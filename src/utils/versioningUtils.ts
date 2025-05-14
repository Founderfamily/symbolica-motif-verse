
/**
 * Application versioning utilities
 */

export interface AppVersion {
  major: number;
  minor: number;
  patch: number;
  build: string;
  fullVersion: string;
}

// Current application version - Should be updated with each release
export const APP_VERSION: AppVersion = {
  major: 1,
  minor: 0,
  patch: 0,
  build: 'alpha',
  get fullVersion() {
    return `${this.major}.${this.minor}.${this.patch}-${this.build}`;
  }
};

// Version history with changelog entries
export const VERSION_HISTORY = [
  {
    version: '1.0.0-alpha',
    date: '2025-05-14',
    changes: [
      'Version initiale du site Symbolica',
      'Implémentation du tableau de bord administrateur',
      'Ajout de la gestion des symboles',
      'Amélioration de la gestion des images'
    ]
  }
];

/**
 * Check if current version is newer than a specified version
 */
export const isNewerVersion = (targetVersion: string): boolean => {
  const current = APP_VERSION.fullVersion;
  
  // Simple string comparison works if following semver
  return current > targetVersion;
};

/**
 * Find changelog entries for a specific version
 */
export const getChangelogForVersion = (version: string): string[] => {
  const entry = VERSION_HISTORY.find(entry => entry.version === version);
  return entry?.changes || [];
};
