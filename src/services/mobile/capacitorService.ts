
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Network } from '@capacitor/network';

export interface MobileCapabilities {
  camera: boolean;
  geolocation: boolean;
  network: boolean;
  filesystem: boolean;
}

export const capacitorService = {
  /**
   * Check device capabilities
   */
  async checkCapabilities(): Promise<MobileCapabilities> {
    try {
      const info = await Device.getInfo();
      const isMobile = info.platform === 'ios' || info.platform === 'android';
      
      return {
        camera: isMobile,
        geolocation: true,
        network: true,
        filesystem: isMobile
      };
    } catch (error) {
      console.error('Error checking capabilities:', error);
      return {
        camera: false,
        geolocation: false,
        network: true,
        filesystem: false
      };
    }
  },

  /**
   * Take photo with device camera
   */
  async takePhoto(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  },

  /**
   * Select photo from gallery
   */
  async selectPhoto(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Error selecting photo:', error);
      return null;
    }
  },

  /**
   * Get current location
   */
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  },

  /**
   * Check network status
   */
  async getNetworkStatus() {
    try {
      const status = await Network.getStatus();
      return {
        connected: status.connected,
        connectionType: status.connectionType
      };
    } catch (error) {
      console.error('Error checking network:', error);
      return { connected: true, connectionType: 'unknown' };
    }
  },

  /**
   * Save data to device storage
   */
  async saveToDevice(fileName: string, data: string): Promise<boolean> {
    try {
      await Filesystem.writeFile({
        path: fileName,
        data: data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      return true;
    } catch (error) {
      console.error('Error saving to device:', error);
      return false;
    }
  },

  /**
   * Read data from device storage
   */
  async readFromDevice(fileName: string): Promise<string | null> {
    try {
      const result = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      return result.data as string;
    } catch (error) {
      console.error('Error reading from device:', error);
      return null;
    }
  }
};
