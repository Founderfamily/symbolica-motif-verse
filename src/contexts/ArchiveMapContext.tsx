import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LocationData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'archive' | 'clue' | 'location';
  relatedDocuments?: string[];
}

interface ArchiveMapContextType {
  selectedArchive: string | null;
  selectedLocation: LocationData | null;
  setSelectedArchive: (archiveId: string | null) => void;
  setSelectedLocation: (location: LocationData | null) => void;
  archiveLocations: LocationData[];
  setArchiveLocations: (locations: LocationData[]) => void;
}

const ArchiveMapContext = createContext<ArchiveMapContextType | undefined>(undefined);

export const useArchiveMap = () => {
  const context = useContext(ArchiveMapContext);
  if (!context) {
    throw new Error('useArchiveMap must be used within an ArchiveMapProvider');
  }
  return context;
};

interface ArchiveMapProviderProps {
  children: ReactNode;
}

export const ArchiveMapProvider: React.FC<ArchiveMapProviderProps> = ({ children }) => {
  const [selectedArchive, setSelectedArchive] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [archiveLocations, setArchiveLocations] = useState<LocationData[]>([
    // Coordonnées précises pour Fontainebleau
    {
      id: '1',
      name: 'Galerie François Ier',
      latitude: 48.4021,
      longitude: 2.7004,
      type: 'archive',
      relatedDocuments: ['1', '2', '3'] // IDs des documents liés
    },
    {
      id: '2', 
      name: 'Bureau de Napoléon',
      latitude: 48.4025,
      longitude: 2.7010,
      type: 'archive',
      relatedDocuments: ['6', '7']
    },
    {
      id: '3',
      name: 'Escalier Secret (Appartements)',
      latitude: 48.4018,
      longitude: 2.7007,
      type: 'archive',
      relatedDocuments: ['8']
    },
    {
      id: '4',
      name: 'Cour du Cheval Blanc',
      latitude: 48.4015,
      longitude: 2.7000,
      type: 'archive',
      relatedDocuments: ['4', '5']
    }
  ]);

  return (
    <ArchiveMapContext.Provider value={{
      selectedArchive,
      selectedLocation,
      setSelectedArchive,
      setSelectedLocation,
      archiveLocations,
      setArchiveLocations
    }}>
      {children}
    </ArchiveMapContext.Provider>
  );
};