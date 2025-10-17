import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Search, ChevronDown } from 'lucide-react';
import { App } from 'antd';
import SelectPopup from '../common-components/SelectPopup';
import PJPDetails from './pjp-details/PJPDetails';
import { counterData } from '../placeholder-data/counterData';
import { getCurrentLocation, type LocationData } from '../utils/locationUtils';
// TODO: Replace with actual API call
// import { counterApi } from '../services';
const dummyData = [
    { id: 1, counterID: '000786543', counterName: 'Pooja Steel Traders', visitDate: '2024-06-20', remarks: 'First visit of the day' },
    { id: 2, counterID: '000786544', counterName: 'Maa Durga Traders', visitDate: '2024-06-21', remarks: 'Second visit of the day' },
    { id: 3, counterID: '000786545', counterName: 'Gurutextiles', visitDate: '2024-06-22', remarks: 'Third visit of the day' },
];
export default function PJPApp() {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const [activeTab, setActiveTab] = useState('counter');
    const [showCounterPopup, setShowCounterPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCounter, setSelectedCounter] = useState<any>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
    const [PJPSummaryData, setPJPSummaryData] = useState(dummyData); // Placeholder for PJP summary data
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [selectedPJPItem, setSelectedPJPItem] = useState<any>(null);

    const handleCounterSelect = (counter: any) => {
        setSelectedCounter(counter);
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        setLocationLoading(true);
        try {
            // Get current location before proceeding
            const location = await getCurrentLocation();
            setCurrentLocation(location);

            // Navigate to Visit page and pass selectedCounter details with location
            navigate('/visit', {
                state: {
                    visitDetails: selectedCounter,
                    locationData: location
                }
            });
            setShowConfirm(false);
            setSelectedCounter(null);
        } catch (error: any) {
            console.error('Location error:', error);

            // Handle different location errors
            let errorMessage = 'Unable to get your current location. ';

            if (error.message?.includes('denied')) {
                errorMessage = 'Location access denied. Please enable GPS location in your browser settings and try again.';
            } else if (error.message?.includes('unavailable')) {
                errorMessage = 'Location service is unavailable. Please check your GPS settings and try again.';
            } else if (error.message?.includes('timeout')) {
                errorMessage = 'Location request timed out. Please ensure GPS is enabled and try again.';
            } else {
                errorMessage += 'Please enable location access and try again.';
            }

            message.error({
                content: errorMessage,
                duration: 5,
            });
        } finally {
            setLocationLoading(false);
        }
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setSelectedCounter(null);
    };

    const handlePJPItemClick = (item: any) => {
        // Transform the item data to match the expected format for PJPDetails
        const transformedItem = {
            name: item.counterName,
            code: item.counterID,
            status: 'Visited',
            visitCount: 1,
            address: 'Sample Address - To be fetched from API',
            contactPerson: 'Contact Person - To be fetched from API',
            phone: '+91-9876543210',
            lastVisit: item.visitDate,
            category: 'Retailer',
            territory: '50040101000001',
            region: 'North Region',
            notes: item.remarks || 'No additional notes'
        };
        
        setSelectedPJPItem(transformedItem);
        setShowDetailsPopup(true);
    };

    const handleDetailsPopupClose = () => {
        setShowDetailsPopup(false);
        setSelectedPJPItem(null);
    };

    const handleStartVisitFromDetails = (item: any) => {
        // Transform back to counter format for visit
        const counterFormat = {
            id: item.code,
            name: item.name,
            code: item.code
        };
        setSelectedCounter(counterFormat);
        setShowConfirm(true);
    };

    const showNoDataComponent = () => {
        return <div className="flex flex-col items-center justify-center flex-1">
            {/* Icon */}
            <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                        <div className="text-3xl">📋</div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Search size={18} className="text-white" />
                    </div>
                </div>
            </div>

            {/* Message */}
            <h3 className="text-lg font-semibold text-gray-800 text-center">
                No visits are done today yet!
            </h3>
            <p className="text-gray-600 text-center text-sm mt-2">
                Start adding visits by<br />
                clicking on select counter
            </p>

            {/* Decorative Chevrons */}
            <div className="flex flex-col items-center gap-2 mt-8">
                <ChevronDown size={20} className="text-purple-300" />
                <ChevronDown size={20} className="text-purple-300" />
                <ChevronDown size={20} className="text-purple-300" />
            </div>
        </div>
    }

    return (
        <div className="h-[calc(100vh-73px)] md:!h-auto bg-gray-50 flex flex-col">
            {/* Territories Section */}
            <div className="bg-white px-4 py-3 border-b border-gray-200">
                <div className="flex gap-2">
                    <MapPin size={20} className="text-red-500 flex-shrink-0" />
                    <div>
                        <h2 className="font-semibold text-gray-800 text-sm">My Territories: 50040101000001, 50040101000002</h2>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col px-4 py-6">
                {
                    PJPSummaryData.length ?
                        (
                            <>
                                {/* Summary Header */}
                                <div className="mb-6">
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold">Today's Visits</h2>
                                                <p className="text-blue-100 text-sm">Track your daily progress</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold">{PJPSummaryData.length}</div>
                                                <div className="text-blue-100 text-sm">Completed</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Visits Grid */}
                                <div className="grid md:!grid-cols-3 grid-cols-1  gap-4 w-full max-w-6xl mx-auto">
                                    {PJPSummaryData.map((item: any, idx: number) =>
                                        <div 
                                            key={idx} 
                                            className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                                            onClick={() => handlePJPItemClick(item)}
                                        >
                                            {/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
                                            <div className="flex flex-col space-y-3">
                                                {/* Counter Name */}
                                                <div className="flex items-start gap-2">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-blue-600 text-sm font-semibold">{idx + 1}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-800 text-base leading-tight">{item.counterName}</h3>
                                                        <p className="text-gray-500 text-sm mt-1">ID: {item.counterID}</p>
                                                    </div>
                                                </div>

                                                {/* Visit Date */}
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
                                                        <span className="text-green-600 text-xs">📅</span>
                                                    </div>
                                                    <span className="text-gray-600">Visit Date:</span>
                                                    <span className="font-medium text-gray-800">{item.visitDate}</span>
                                                </div>

                                                {/* Remarks */}
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div className="w-4 h-4 bg-orange-100 rounded flex items-center justify-center">
                                                            <span className="text-orange-600 text-xs">💬</span>
                                                        </div>
                                                        <span className="text-gray-600">Remarks:</span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm bg-gray-50 p-2 rounded border-l-2 border-gray-300 ml-6">
                                                        {item.remarks}
                                                    </p>
                                                </div>

                                                {/* Status Badge & Click Indicator */}
                                                <div className="flex justify-between items-center">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        ✓ Completed
                                                    </span>
                                                    <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        View Details →
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )
                        :
                        showNoDataComponent()

                }

            </div>

            {/* Bottom Navigation */}
            <div className="flex gap-2 bg-white border-t border-gray-200">
                <button
                    onClick={() => {
                        setActiveTab('counter');
                        setShowCounterPopup(true);
                    }}
                    className={`flex-1 py-4 font-semibold text-sm transition-colors bg-orange-500 text-white hover:bg-orange-600`}>
                    SELECT COUNTER
                </button>

                {/* <button
                    onClick={() => setActiveTab('site')}
                    className={`flex-1 py-4 font-semibold text-sm transition-colors bg-orange-500 text-white`}
                >
                    SELECT SITE
                </button> */}
            </div>

            {/* Counter Selection Popup as separate component */}
            <SelectPopup
                show={showCounterPopup}
                onClose={(selected) => {
                    setShowCounterPopup(false);
                    if (selected) {
                        handleCounterSelect(selected);
                    }
                }}
                data={counterData}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                displayField={item => `${item.name}, ${item.code}`}
                keyField={(item, idx) => `${item.id}-${item.code}-${idx}`}
                title="Counter"
            />

            {/* Confirmation Dialog */}
            {showConfirm && selectedCounter && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(128, 128, 128, 0.68) 100%)' }}>
                    <div className="bg-white rounded-lg shadow-lg p-6 w-160">
                        <h2 className="text-lg font-semibold mb-4">Confirmation!</h2>
                        <p className="mb-4 text-gray-700">Do you want to start a visit for <span className="font-bold">{selectedCounter.name}</span> ({selectedCounter.code})?</p>

                        <p className="mb-4 text-gray-700">Please ensure that you are at the counter's location when you click on "Start Visit".</p>

                        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <MapPin size={16} className="inline mr-1" />
                                Your current location will be captured for visit verification.
                            </p>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleCancel}
                                disabled={locationLoading}
                                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >Cancel</button>
                            <button
                                onClick={handleConfirm}
                                disabled={locationLoading}
                                className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {locationLoading && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                )}
                                {locationLoading ? 'Getting Location...' : 'Start Visit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PJP Details Popup */}
            <PJPDetails
                isOpen={showDetailsPopup}
                onClose={handleDetailsPopupClose}
                onStartVisit={handleStartVisitFromDetails}
                data={selectedPJPItem}
                title="Visit Details"
            />
        </div>
    );
}