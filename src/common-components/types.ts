export interface SelectPopupProps<T> {
  show: boolean;
  onClose: (selected: T | null) => void;
  data: T[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  displayField: (item: T) => string;
  keyField: (item: T, idx: number) => string | number;
  title?: string;
}
