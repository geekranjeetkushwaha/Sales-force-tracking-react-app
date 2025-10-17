import type { SelectPopupProps } from './types';
import { Search, X } from 'lucide-react';

function SelectPopup<T>({
  show,
  onClose,
  data,
  searchQuery,
  setSearchQuery,
  displayField,
  keyField,
  title = 'Select Item',
}: SelectPopupProps<T>) {
  if (!show) return null;

  const filteredData = data.filter(item =>
    displayField(item).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item: T) => {
    onClose(item);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose(null);
    }
  };

  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 z-50 flex items-end md:items-stretch md:justify-end"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white w-full md:!w-[40%] h-full md:max-h-full flex flex-col animate-slide-up md:animate-slide-right min-h-screen md:min-h-full md:rounded-l-lg"
        onClick={handlePopupClick}
      >
        {/* Popup Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={() => onClose(null)}
            className="text-orange-500 hover:text-orange-600 p-1 rounded-full hover:bg-orange-50 transition-colors"
          >
            <X size={20} className="cursor-pointer" />
          </button>
        </div>

        {/* Search Box */}
        <div className="p-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={`Search ${title}`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Data List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {filteredData.length > 0 ? (
            <div className="space-y-3">
              {filteredData.map((item, idx) => (
                <div
                  key={keyField(item, idx)}
                  onClick={() => handleSelect(item)}
                  className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <p className="text-gray-700 text-sm">{displayField(item)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No items found</div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes slide-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-slide-right {
          animation: slide-right 0.3s ease-out;
        }
        
        @media (min-width: 768px) {
          .animate-slide-up {
            animation: slide-right 0.3s ease-out;
          }
        }
      `}</style>
    </div>
  );
}

export default SelectPopup;
