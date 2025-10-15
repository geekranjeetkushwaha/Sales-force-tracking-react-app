import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Search, ChevronDown } from 'lucide-react';
import SelectPopup from '../common-components/SelectPopup';
import { counterData } from '../placeholder-data/counterData';

export default function PJPApp() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('counter');
    const [showCounterPopup, setShowCounterPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCounter, setSelectedCounter] = useState<any>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleCounterSelect = (counter: any) => {
        setSelectedCounter(counter);
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        // Navigate to Visit page and pass selectedCounter details
        navigate('/visit', { state: { visitDetails: selectedCounter } });
        setShowConfirm(false);
        setSelectedCounter(null);
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setSelectedCounter(null);
    };

    return (
        <div className="bg-gray-50 flex flex-col h-full flex-1">
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
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
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

                <button
                    onClick={() => setActiveTab('site')}
                    className={`flex-1 py-4 font-semibold text-sm transition-colors bg-orange-500 text-white`}
                >
                    SELECT SITE
                </button>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(128, 128, 128, 0.68) 100%)'}}>
                    <div className="bg-white rounded-lg shadow-lg p-6 w-160">
                        <h2 className="text-lg font-semibold mb-4">Confirmation!</h2>
                        <p className="mb-6 text-gray-700">Do you want to start a visit for <span className="font-bold">{selectedCounter.name}</span> ({selectedCounter.code})?</p>

                        <p className="mb-6 text-gray-700">Please ensure that you are at the counter's location when you click on "Start Visit".</p>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >Cancel</button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
                            >Start Visit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}