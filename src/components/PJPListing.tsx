import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, ChevronDown } from 'lucide-react';
import { App } from 'antd';
import SelectPopup from '../common-components/SelectPopup';
import PJPDetails from './pjp-details/PJPDetails';
import { counterData } from '../placeholder-data/counterData';
import { getCurrentLocation } from '../utils/locationUtils';
import type { Counter, PJPItem, PJPDetails as PJPDetailsData } from '../types/pjp';

// TODO: Replace with actual API call
// import { counterApi } from '../services';
const dummyData: PJPItem[] = [
  {
    id: 1,
    counterID: '000786543',
    counterName: 'Pooja Steel Traders',
    visitDate: '2024-06-20',
    visitTime: '10:30 AM',
    remarks: 'First visit of the day',
  },
  {
    id: 2,
    counterID: '000786544',
    counterName: 'Maa Durga Traders',
    visitDate: '2024-06-21',
    visitTime: '11:00 AM',
    remarks: 'Second visit of the day',
  },
  {
    id: 3,
    counterID: '000786545',
    counterName: 'Gurutextiles',
    visitDate: '2024-06-22',
    visitTime: '12:00 PM',
    remarks: 'Third visit of the day',
  },
  {
    id: 4,
    counterID: '000786546',
    counterName: 'Rajesh Hardware Store',
    visitDate: '2024-06-23',
    visitTime: '01:00 PM',
    remarks: 'Regular monthly visit',
  },
  {
    id: 5,
    counterID: '000786547',
    counterName: 'Krishna Electronics',
    visitDate: '2024-06-24',
    visitTime: '02:00 PM',
    remarks: 'New product introduction visit',
  },
  {
    id: 6,
    counterID: '000786548',
    counterName: 'Shri Ganesh Enterprises',
    visitDate: '2024-06-25',
    visitTime: '03:00 PM',
    remarks: 'Follow-up visit for pending orders',
  },
];

export default function PJPApp() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [, setActiveTab] = useState('counter');
  const [showCounterPopup, setShowCounterPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pjpSearchQuery, setPjpSearchQuery] = useState('');
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [PJPSummaryData] = useState<PJPItem[]>(dummyData); // Placeholder for PJP summary data
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

  // Filter PJP data based on search query
  const filteredPJPData = PJPSummaryData.filter(item => {
    if (!pjpSearchQuery.trim()) return true;

    const searchTerm = pjpSearchQuery.toLowerCase().trim();
    const counterName = item.counterName.toLowerCase();
    const counterId = item.counterID.toLowerCase();

    return counterName.includes(searchTerm) || counterId.includes(searchTerm);
  });
  const [selectedPJPItem, setSelectedPJPItem] = useState<PJPDetailsData | null>(null);

  const handleCounterSelect = (counter: Counter) => {
    setSelectedCounter(counter);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setLocationLoading(true);
    try {
      // Get current location before proceeding
      const location = await getCurrentLocation();

      // Navigate to Visit page and pass selectedCounter details with location
      navigate('/visit', {
        state: {
          visitDetails: selectedCounter,
          locationData: location,
        },
      });
      setShowConfirm(false);
      setSelectedCounter(null);
    } catch (error) {
      console.error('Location error:', error);

      // Handle different location errors
      let errorMessage = 'Unable to get your current location. ';

      if (error instanceof Error && error.message?.includes('denied')) {
        errorMessage =
          'Location access denied. Please enable GPS location in your browser settings and try again.';
      } else if (error instanceof Error && error.message?.includes('unavailable')) {
        errorMessage =
          'Location service is unavailable. Please check your GPS settings and try again.';
      } else if (error instanceof Error && error.message?.includes('timeout')) {
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

  const handlePJPItemClick = (item: PJPItem) => {
    // Transform the item data to match the expected format for PJPDetails
    const transformedItem: PJPDetailsData = {
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
      notes: item.remarks || 'No additional notes',
      visitTime: item.visitTime || '',
    };

    setSelectedPJPItem(transformedItem);
    setShowDetailsPopup(true);
  };

  const handleDetailsPopupClose = () => {
    setShowDetailsPopup(false);
    setSelectedPJPItem(null);
  };

  const handleStartVisitFromDetails = (item: PJPDetailsData) => {
    // Transform back to counter format for visit
    const counterFormat: Counter = {
      id: parseInt(item.code),
      name: item.name,
      code: item.code,
    };
    setSelectedCounter(counterFormat);
    setShowConfirm(true);
  };

  const showNoDataComponent = () => {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
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
          Start adding visits by
          <br />
          clicking on select counter
        </p>

        {/* Decorative Chevrons */}
        <div className="flex flex-col items-center gap-2 mt-8">
          <ChevronDown size={20} className="text-purple-300" />
          <ChevronDown size={20} className="text-purple-300" />
          <ChevronDown size={20} className="text-purple-300" />
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-73px)] md:!h-auto bg-gray-50 flex flex-col">
      {/* Territories Section */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4">
          {/* Territories Info */}
          <div className="flex gap-2 flex-1 w-full">
            <div className="flex-1 flex justify-between items-center w-full">
              <div className=" flex items-center gap-2">
                <MapPin size={20} className="text-red-500 flex-shrink-0" />
                <h2 className="font-semibold text-gray-800 text-sm !mb-0">
                  My Territories: 50040101000001, 50040101000002
                </h2>
              </div>
              <div className="fixed md:!relative bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
                <button
                  onClick={() => {
                    setActiveTab('counter');
                    setShowCounterPopup(true);
                  }}
                  className="w-full py-3 px-4 md:rounded-lg cursor-pointer bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Search size={16} />
                  SELECT COUNTER
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Select Counter Button */}
          <div className="hidden md:block flex-shrink-0">
            <button
              onClick={() => {
                setActiveTab('counter');
                setShowCounterPopup(true);
              }}
              className="px-6 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              <Search size={16} />
              SELECT COUNTER
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-4 py-6 pb-[100px]">
        {PJPSummaryData.length ? (
          <>
            {/* Search Input */}
            <div className="mb-4">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by counter name or counter ID..."
                  value={pjpSearchQuery}
                  onChange={e => setPjpSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
                {pjpSearchQuery && (
                  <button
                    onClick={() => setPjpSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Summary Header */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Today's Visits</h2>
                    <p className="text-blue-100 text-sm">
                      {pjpSearchQuery
                        ? `Showing ${filteredPJPData.length} of ${PJPSummaryData.length} visits`
                        : 'Track your daily progress'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {pjpSearchQuery ? filteredPJPData.length : PJPSummaryData.length}
                    </div>
                    <div className="text-blue-100 text-sm">
                      {pjpSearchQuery ? 'Found' : 'Completed'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visits Grid */}
            {filteredPJPData.length > 0 ? (
              <div className="grid md:!grid-cols-3 grid-cols-1  gap-4 w-full max-w-6xl mx-auto">
                {filteredPJPData.map((item: PJPItem, idx: number) => (
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
                          <h3 className="font-semibold text-gray-800 text-base leading-tight">
                            {item.counterName}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">ID: {item.counterID}</p>
                        </div>
                      </div>

                      {/* Visit Date */}
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
                          <span className="text-green-600 text-xs">📅</span>
                        </div>
                        <span className="text-gray-600">Visit Time:</span>
                        <span className="font-medium text-gray-800">{item.visitTime}</span>
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
                ))}
              </div>
            ) : (
              /* No Search Results */
              <div className="flex flex-col items-center justify-center flex-1 py-12">
                <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                      <Search size={32} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                  No visits found
                </h3>
                <p className="text-gray-600 text-center text-sm mb-4">
                  No visits match your search for "{pjpSearchQuery}"
                </p>
                <button
                  onClick={() => setPjpSearchQuery('')}
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        ) : (
          showNoDataComponent()
        )}
      </div>

      {/* Counter Selection Popup as separate component */}
      <SelectPopup
        show={showCounterPopup}
        onClose={selected => {
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(128, 128, 128, 0.68) 100%)',
          }}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-160">
            <h2 className="text-lg font-semibold mb-4">Confirmation!</h2>
            <p className="mb-4 text-gray-700">
              Do you want to start a visit for{' '}
              <span className="font-bold">{selectedCounter.name}</span> ({selectedCounter.code})?
            </p>

            <p className="mb-4 text-gray-700">
              Please ensure that you are at the counter's location when you click on "Start Visit".
            </p>

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
              >
                Cancel
              </button>
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
