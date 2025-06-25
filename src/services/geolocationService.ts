
// Service de géolocalisation pour enrichir les données des quêtes
export interface LocationData {
  country: string;
  region: string;
  city: string;
  zone?: string;
}

// Mapping des coordonnées vers les régions françaises
const FRENCH_REGIONS = {
  'ile-de-france': {
    name: 'Île-de-France',
    bounds: { north: 49.5, south: 48.1, east: 3.6, west: 1.4 },
    cities: ['Paris', 'Versailles', 'Fontainebleau', 'Meaux', 'Melun']
  },
  'occitanie': {
    name: 'Occitanie',
    bounds: { north: 45.0, south: 42.3, east: 4.9, west: -1.8 },
    cities: ['Toulouse', 'Montpellier', 'Montségur', 'Carcassonne', 'Perpignan', 'Albi']
  },
  'corse': {
    name: 'Corse',
    bounds: { north: 43.1, south: 41.3, east: 9.7, west: 8.5 },
    cities: ['Ajaccio', 'Bastia', 'Corte', 'Porto-Vecchio']
  },
  'auvergne-rhone-alpes': {
    name: 'Auvergne-Rhône-Alpes',
    bounds: { north: 46.8, south: 44.1, east: 7.2, west: 2.2 },
    cities: ['Lyon', 'Grenoble', 'Saint-Étienne', 'Chambéry', 'Clermont-Ferrand']
  },
  'bourgogne-franche-comte': {
    name: 'Bourgogne-Franche-Comté',
    bounds: { north: 48.4, south: 46.2, east: 7.2, west: 2.8 },
    cities: ['Dijon', 'Beaune', 'Cluny', 'Besançon', 'Chalon-sur-Saône']
  },
  'bretagne': {
    name: 'Bretagne',
    bounds: { north: 48.9, south: 47.3, east: -1.0, west: -5.1 },
    cities: ['Rennes', 'Brest', 'Carnac', 'Vannes', 'Quimper', 'Saint-Malo']
  },
  'paca': {
    name: 'Provence-Alpes-Côte d\'Azur',
    bounds: { north: 45.1, south: 42.9, east: 7.7, west: 4.2 },
    cities: ['Marseille', 'Nice', 'Toulon', 'Avignon', 'Aix-en-Provence']
  }
};

// Zones historiques spéciales
const HISTORICAL_ZONES = {
  'chateau': ['Versailles', 'Fontainebleau', 'Vincennes'],
  'abbaye': ['Cluny', 'Mont-Saint-Michel', 'Fontenay'],
  'forteresse': ['Montségur', 'Carcassonne', 'Vincennes'],
  'megalithique': ['Carnac', 'Locmariaquer', 'Gavrinis'],
  'centre-historique': ['Paris', 'Lyon', 'Toulouse', 'Dijon']
};

export const geolocationService = {
  // Détermine la région française basée sur les coordonnées
  getRegionFromCoordinates(latitude: number, longitude?: number): string {
    if (!longitude) return 'Multi-régions';
    
    for (const [key, region] of Object.entries(FRENCH_REGIONS)) {
      const { bounds } = region;
      if (latitude >= bounds.south && latitude <= bounds.north &&
          longitude >= bounds.west && longitude <= bounds.east) {
        return region.name;
      }
    }
    return 'Autre région';
  },

  // Détermine la ville principale basée sur les coordonnées et le titre de la quête
  getCityFromQuestData(latitude?: number, longitude?: number, title?: string, description?: string): string {
    const textData = `${title || ''} ${description || ''}`.toLowerCase();
    
    // Recherche par nom dans le titre/description
    for (const region of Object.values(FRENCH_REGIONS)) {
      for (const city of region.cities) {
        if (textData.includes(city.toLowerCase())) {
          return city;
        }
      }
    }
    
    // Si on a des coordonnées, essayer de déterminer la région et prendre la première ville
    if (latitude && longitude) {
      const region = this.getRegionFromCoordinates(latitude, longitude);
      const regionData = Object.values(FRENCH_REGIONS).find(r => r.name === region);
      if (regionData && regionData.cities.length > 0) {
        return regionData.cities[0];
      }
    }
    
    return 'Non spécifiée';
  },

  // Détermine la zone historique
  getHistoricalZone(title: string, description?: string): string | undefined {
    const textData = `${title} ${description || ''}`.toLowerCase();
    
    for (const [zone, keywords] of Object.entries(HISTORICAL_ZONES)) {
      for (const keyword of keywords) {
        if (textData.includes(keyword.toLowerCase())) {
          return zone;
        }
      }
    }
    
    // Détection par mots-clés
    if (textData.includes('château') || textData.includes('castle')) return 'chateau';
    if (textData.includes('abbaye') || textData.includes('abbey')) return 'abbaye';
    if (textData.includes('forteresse') || textData.includes('fort')) return 'forteresse';
    if (textData.includes('mégalithe') || textData.includes('dolmen')) return 'megalithique';
    
    return undefined;
  },

  // Enrichit une quête avec des données géographiques
  enrichQuestWithLocation(quest: any): any {
    // Extraire les coordonnées du premier indice avec localisation
    let latitude: number | undefined;
    let longitude: number | undefined;
    
    if (quest.clues && Array.isArray(quest.clues)) {
      for (const clue of quest.clues) {
        if (clue.location && clue.location.latitude && clue.location.longitude) {
          latitude = clue.location.latitude;
          longitude = clue.location.longitude;
          break;
        }
      }
    }
    
    const country = 'France'; // Toutes les quêtes actuelles sont en France
    const region = this.getRegionFromCoordinates(latitude || 0, longitude);
    const city = this.getCityFromQuestData(latitude, longitude, quest.title, quest.description);
    const zone = this.getHistoricalZone(quest.title, quest.description);
    
    return {
      ...quest,
      locationData: {
        country,
        region,
        city,
        zone,
        hasCoordinates: !!(latitude && longitude),
        coordinates: latitude && longitude ? { latitude, longitude } : null
      }
    };
  },

  // Obtient toutes les régions disponibles
  getAvailableRegions(): string[] {
    return Object.values(FRENCH_REGIONS).map(r => r.name);
  },

  // Obtient toutes les villes disponibles
  getAvailableCities(): string[] {
    const cities = new Set<string>();
    Object.values(FRENCH_REGIONS).forEach(region => {
      region.cities.forEach(city => cities.add(city));
    });
    return Array.from(cities).sort();
  },

  // Obtient toutes les zones historiques disponibles
  getAvailableZones(): string[] {
    return Object.keys(HISTORICAL_ZONES);
  }
};
