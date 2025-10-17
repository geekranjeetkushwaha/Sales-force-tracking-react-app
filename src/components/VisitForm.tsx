import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Radio, Button, Modal, Spin, Alert, App } from 'antd';
import {
  CameraOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import {
  getCurrentLocationWithAddress,
  formatLocationForAPI,
  type LocationData,
} from '../utils/locationUtils';
import './VisitForm.css';

// Form types
interface VisitFormValues {
  customerId: string;
  customerType: string;
  visitType: string;
  visitMode: string;
  skuDetails: string;
  remarks: string;
}

const VisitForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const visitDetails = location.state?.visitDetails;
  const checkinLocationData = location.state?.locationData; // Visit check-in location captured from PJPListing
  const [form] = Form.useForm();
  const [isVerified, setIsVerified] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [captureLocation, setCaptureLocation] = useState<LocationData | null>(null);
  const [locationPermission, setLocationPermission] = useState<
    'checking' | 'granted' | 'denied' | 'unavailable'
  >('checking');
  const [locationError, setLocationError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check location permissions on component mount
  useEffect(() => {
    checkLocationPermissions();
  }, []);

  const checkLocationPermissions = async () => {
    if (!navigator.geolocation) {
      setLocationPermission('unavailable');
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    try {
      // Try to get current position to check if permission is granted
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 300000, // 5 minutes
        });
      });

      if (position) {
        setLocationPermission('granted');
        setLocationError(null);
      }
    } catch (error) {
      console.error('Location permission check failed:', error);

      if (error && typeof error === 'object' && 'code' in error && error.code === 1) {
        // PERMISSION_DENIED
        setLocationPermission('denied');
        setLocationError(
          'Location access denied. Please enable location services and grant permission to continue.'
        );
      } else if (error && typeof error === 'object' && 'code' in error && error.code === 2) {
        // POSITION_UNAVAILABLE
        setLocationPermission('unavailable');
        setLocationError('Location information is unavailable. Please check your GPS settings.');
      } else if (error && typeof error === 'object' && 'code' in error && error.code === 3) {
        // TIMEOUT
        setLocationPermission('denied');
        setLocationError('Location request timed out. Please try again.');
      } else {
        setLocationPermission('denied');
        setLocationError('Unable to retrieve location. Please enable location services.');
      }
    }
  };

  const handleRetryLocation = () => {
    setLocationPermission('checking');
    setLocationError(null);
    checkLocationPermissions();
  };

  const handleBackClick = () => {
    // Navigate back to PJP listing page
    navigate('/');
  };

  const onFinish = async (values: VisitFormValues) => {
    try {
      setLocationLoading(true);

      // Capture location when submitting the form
      const currentLocation = await getCurrentLocationWithAddress();

      const formData = {
        ...values,
        checkinLocation: checkinLocationData ? formatLocationForAPI(checkinLocationData) : null, // Location when visit was started
        verificationLocation: captureLocation ? formatLocationForAPI(captureLocation) : null, // Location when photo was captured
        submitLocation: formatLocationForAPI(currentLocation), // Location when form was submitted
        verificationImage: capturedImage,
        timestamp: new Date().toISOString(),
      };

      console.log('Form submission data:', formData);

      // Show success message
      message.success({
        content: 'Visit details submitted successfully!',
        duration: 3,
        onClose: () => {
          // Navigate to homepage after message closes
          navigate('/', { replace: true });
        },
      });

      // Also navigate after a short delay as fallback
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error(
        error instanceof Error ? error.message : 'Failed to submit form. Please try again.'
      );
    } finally {
      setLocationLoading(false);
    }
  };

  // Open camera for verification
  const handleVerifyClick = async () => {
    setCameraLoading(true);
    try {
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      // Request camera access - only camera, no file input
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile if available
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraOpen(true);
      setCameraLoading(false);

      // Set video stream when modal opens
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      setCameraLoading(false);
      console.error('Error accessing camera:', error);

      let errorMessage = 'Unable to access camera. ';
      if (error instanceof Error && error.name === 'NotAllowedError') {
        errorMessage += 'Please grant camera permissions and try again.';
      } else if (error instanceof Error && error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error instanceof Error && error.name === 'NotSupportedError') {
        errorMessage += 'Camera not supported on this browser.';
      } else {
        errorMessage += 'Please check your camera and try again.';
      }

      message.error(errorMessage);
    }
  };

  // Capture image from camera
  const handleCaptureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        try {
          // Capture verification location when taking the photo
          const verificationLocation = await getCurrentLocationWithAddress();
          setCaptureLocation(verificationLocation);

          // Set canvas size to match video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Draw video frame to canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert to base64 image
          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setCapturedImage(imageDataUrl);

          // Stop camera stream
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }

          setIsCameraOpen(false);
          setIsVerified(true);

          message.success({
            content: 'Image and location captured successfully! You can now fill the form.',
            duration: 4,
          });

          console.log('Captured verification location:', verificationLocation);
        } catch (locationError) {
          // Still allow image capture even if location fails
          console.warn('Failed to capture location:', locationError);

          // Set canvas size to match video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Draw video frame to canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert to base64 image
          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setCapturedImage(imageDataUrl);

          // Stop camera stream
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }

          setIsCameraOpen(false);
          setIsVerified(true);

          message.warning({
            content:
              'Image captured but location access failed. You can still proceed with the form.',
            duration: 4,
          });
        }
      }
    }
  };

  // Close camera without capturing
  const handleCloseCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  // Reset verification
  const handleRetakePhoto = () => {
    setCapturedImage(null);
    setIsVerified(false);
    setCaptureLocation(null); // Clear verification location data
  };

  // Show location permission UI if location is not granted
  if (locationPermission === 'checking') {
    return (
      <div className="visit-form-container flex flex-col items-center justify-center px-4 py-12">
        <div className="visit-form-card">
          <div className="text-center py-8">
            <Spin size="large" />
            <p className="text-gray-600 mt-4 text-lg">Checking location permissions...</p>
            <p className="text-gray-500 text-sm mt-2">
              Please wait while we verify location access
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (locationPermission === 'denied' || locationPermission === 'unavailable') {
    return (
      <div className="visit-form-container flex flex-col items-center justify-center px-4 py-12">
        <div className="visit-form-card">
          <div className="text-center py-8">
            <ExclamationCircleOutlined className="text-red-500 text-6xl mb-4" />
            <h2 className="text-xl font-bold text-red-600 mb-4">Location Access Required</h2>
            <Alert
              message="Location Permission Needed"
              description={
                locationError ||
                'Please allow location access to continue with the visit form. Location is required for verification purposes.'
              }
              type="error"
              showIcon
              className="mb-6 text-left"
            />
            <div className="space-y-4">
              <div className="text-gray-600 text-sm text-left bg-gray-50 p-4 rounded border">
                <h4 className="font-medium mb-2">How to enable location access:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Click the location icon in your browser's address bar</li>
                  <li>Select "Allow" for location permissions</li>
                  <li>Refresh the page or click "Retry" below</li>
                  <li>Ensure GPS/Location services are enabled on your device</li>
                </ul>
              </div>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRetryLocation}
                size="large"
                className="w-full"
              >
                Retry Location Access
              </Button>
              <Button type="default" onClick={() => navigate('/')} className="w-full">
                Go Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="visit-form-container flex flex-col px-4 py-4">
      {/* Back Button - Top Left */}
      <div className="mb-4">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBackClick}
          className="back-button flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
        >
          Back
        </Button>
      </div>

      {/* Form Container */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="visit-form-card">
          <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">Visit Details</h2>
          {visitDetails && (
            <div className="mb-6 text-center">
              <p className="text-gray-700 text-lg">
                <strong>Counter:</strong> {visitDetails.name}
              </p>
              <p className="text-gray-500 mt-2">
                <strong>Code:</strong> {visitDetails.code}
              </p>
            </div>
          )}

          {/* Check-in Location Display */}
          {checkinLocationData && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-center gap-2 text-blue-600 text-sm">
                <EnvironmentOutlined />
                <span className="font-medium">Visit Check-in Location:</span>
              </div>
              <div className="text-gray-600 text-xs mt-1">
                {checkinLocationData.address ||
                  `${checkinLocationData.latitude.toFixed(6)}, ${checkinLocationData.longitude.toFixed(6)}`}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                Accuracy: ±{Math.round(checkinLocationData.accuracy)}m
              </div>
            </div>
          )}

          {/* Location Status Display */}
          {locationPermission === 'granted' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <EnvironmentOutlined />
                <span className="font-medium">Location access granted</span>
              </div>
              <p className="text-green-700 text-xs mt-1">
                Ready to capture verification and submit locations
              </p>
            </div>
          )}

          {/* Verification Section */}
          <div className="mb-6">
            {!isVerified ? (
              <Button
                type="primary"
                icon={cameraLoading ? <LoadingOutlined /> : <CameraOutlined />}
                onClick={handleVerifyClick}
                className="verification-button w-full mb-4"
                size="large"
                loading={cameraLoading}
                disabled={cameraLoading || locationPermission !== 'granted'}
              >
                {cameraLoading ? 'Opening Camera...' : 'Verify Before Proceed'}
              </Button>
            ) : (
              <div className="verification-complete text-center">
                <div className="flex items-center justify-center mb-3">
                  <CheckCircleOutlined className="text-green-500 text-xl mr-2" />
                  <span className="text-green-600 font-medium">Verification Complete</span>
                </div>
                {capturedImage && (
                  <div className="mb-3">
                    <img
                      src={capturedImage}
                      alt="Captured verification"
                      className="captured-image"
                    />
                    {captureLocation && (
                      <div className="location-info mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                        <div className="flex items-center gap-1 text-green-600">
                          <EnvironmentOutlined />
                          <span className="font-medium">Verification Location Captured:</span>
                        </div>
                        <div className="text-gray-600 mt-1">
                          {captureLocation.address ||
                            `${captureLocation.latitude.toFixed(6)}, ${captureLocation.longitude.toFixed(6)}`}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          Accuracy: ±{Math.round(captureLocation.accuracy)}m
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <Button
                  type="link"
                  onClick={handleRetakePhoto}
                  className="text-blue-500 p-0"
                  size="small"
                >
                  Retake Photo
                </Button>
              </div>
            )}
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={!isVerified || locationPermission !== 'granted'}
            className={
              isVerified && locationPermission === 'granted' ? 'form-enabled' : 'form-disabled'
            }
          >
            <Form.Item
              label="Purpose of Visit"
              name="purpose"
              rules={[{ required: true, message: 'Please select the purpose of visit!' }]}
            >
              <Radio.Group disabled={!isVerified || locationPermission !== 'granted'}>
                <Radio value="Site Service">Site Service</Radio>
                <Radio value="New Site">New Site</Radio>
                <Radio value="Site Conversion">Site Conversion</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Remarks"
              name="remarks"
              rules={[{ required: true, message: 'Please enter remarks!' }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter remarks"
                disabled={!isVerified || locationPermission !== 'granted'}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={!isVerified || locationPermission !== 'granted'}
                loading={locationLoading}
                icon={locationLoading ? <LoadingOutlined /> : null}
              >
                {locationLoading ? 'Capturing Location...' : 'Submit'}
              </Button>
            </Form.Item>
          </Form>

          {/* Camera Modal */}
          <Modal
            title="Capture Verification Photo"
            open={isCameraOpen}
            onCancel={handleCloseCamera}
            footer={[
              <Button key="cancel" onClick={handleCloseCamera}>
                Cancel
              </Button>,
              <Button key="capture" type="primary" onClick={handleCaptureImage}>
                Capture Photo
              </Button>,
            ]}
            width={400}
            centered
          >
            <div className="text-center">
              {cameraLoading ? (
                <div className="camera-loading">
                  <Spin
                    size="large"
                    indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                  />
                  <p className="camera-loading-text">Initializing camera...</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="camera-video"
                  onLoadedMetadata={() => console.log('Camera ready')}
                />
              )}
              <canvas ref={canvasRef} className="hidden" />
              <p className="text-gray-600 text-sm mt-3">
                Position yourself in the frame and click "Capture Photo" when ready
              </p>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default VisitForm;
