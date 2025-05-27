
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.bac1b919eb854e42bbfe04f3f3f09b84',
  appName: 'symbolica',
  webDir: 'dist',
  server: {
    url: "https://bac1b919-eb85-4e42-bbfe-04f3f3f09b84.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Geolocation: {
      permissions: ['location']
    }
  }
};

export default config;
