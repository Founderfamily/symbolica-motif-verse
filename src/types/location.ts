
export interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
}

export interface SymbolLocation extends LocationData {
  id: string;
  symbol_id: string;
  created_at: string;
}
