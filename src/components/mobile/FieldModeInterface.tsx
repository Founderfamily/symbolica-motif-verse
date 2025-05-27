
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Camera, 
  Mic, 
  MicOff, 
  Save, 
  Upload,
  Wifi, 
  WifiOff,
  FileText,
  Image as ImageIcon,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { capacitorService } from '@/services/mobile/capacitorService';
import { offlineService } from '@/services/mobile/offlineService';

interface FieldNote {
  id: string;
  content: string;
  location: { lat: number; lng: number } | null;
  timestamp: number;
  audioUrl?: string;
  images: string[];
  synced: boolean;
}

const FieldModeInterface: React.FC = () => {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);
  const [currentNote, setCurrentNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [fieldNotes, setFieldNotes] = useState<FieldNote[]>([]);
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    checkNetworkStatus();
    loadFieldNotes();
    getCurrentLocation();
    
    // Monitor network status
    const interval = setInterval(checkNetworkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkNetworkStatus = async () => {
    const status = await capacitorService.getNetworkStatus();
    setIsOnline(status.connected);
  };

  const loadFieldNotes = async () => {
    const notes = await offlineService.getFieldNotes();
    setFieldNotes(notes);
  };

  const getCurrentLocation = async () => {
    const location = await capacitorService.getCurrentLocation();
    if (location) {
      // Convert from latitude/longitude to lat/lng format
      setCurrentLocation({
        lat: location.latitude,
        lng: location.longitude
      });
    }
  };

  const capturePhoto = async () => {
    const imageData = await capacitorService.takePhoto();
    if (imageData) {
      setCapturedImages([...capturedImages, imageData]);
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        setCurrentNote(prev => `${prev}\n[Note audio enregistrée: ${new Date().toLocaleTimeString()}]`);
        setAudioChunks([]);
      };

      setAudioRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting audio recording:', error);
    }
  };

  const stopAudioRecording = () => {
    if (audioRecorder && isRecording) {
      audioRecorder.stop();
      audioRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setAudioRecorder(null);
    }
  };

  const saveFieldNote = async () => {
    if (!currentNote.trim()) return;

    const noteId = await offlineService.saveFieldNote(
      currentNote,
      currentLocation,
      undefined, // Audio URL would go here
      capturedImages
    );

    // Clear current note
    setCurrentNote('');
    setCapturedImages([]);
    
    // Reload notes
    loadFieldNotes();

    // Try to sync if online
    if (isOnline) {
      // Here you would normally sync with your backend
      console.log('Note saved and ready for sync');
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLocationString = (location: { lat: number; lng: number } | null) => {
    if (!location) return 'Position non disponible';
    return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
  };

  return (
    <div className="space-y-4">
      {/* Network Status */}
      <Alert className={isOnline ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}>
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-amber-600" />}
          <AlertDescription className={isOnline ? 'text-green-800' : 'text-amber-800'}>
            {isOnline ? 'En ligne - Synchronisation automatique' : 'Hors ligne - Les données seront synchronisées plus tard'}
          </AlertDescription>
        </div>
      </Alert>

      {/* New Field Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Nouvelle note de terrain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {getLocationString(currentLocation)}
            <Button size="sm" variant="ghost" onClick={getCurrentLocation}>
              Actualiser
            </Button>
          </div>

          {/* Note content */}
          <Textarea
            placeholder="Décrivez votre découverte, les conditions de terrain, les observations..."
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            rows={6}
          />

          {/* Media capture buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={capturePhoto}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Photo ({capturedImages.length})
            </Button>
            
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={isRecording ? stopAudioRecording : startAudioRecording}
              className="flex items-center gap-2"
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isRecording ? 'Arrêter' : 'Audio'}
            </Button>

            <Button
              onClick={saveFieldNote}
              disabled={!currentNote.trim()}
              className="flex items-center gap-2 ml-auto"
            >
              <Save className="h-4 w-4" />
              Sauvegarder
            </Button>
          </div>

          {/* Captured images preview */}
          {capturedImages.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Images capturées:</div>
              <div className="flex gap-2 overflow-x-auto">
                {capturedImages.map((image, index) => (
                  <div key={index} className="flex-shrink-0">
                    <img 
                      src={image} 
                      alt={`Capture ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Field Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Notes sauvegardées ({fieldNotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {fieldNotes.map((note) => (
                <div key={note.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {formatTimestamp(note.timestamp)}
                    </div>
                    <div className="flex items-center gap-2">
                      {note.images.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {note.images.length}
                        </Badge>
                      )}
                      {note.synced ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Upload className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    {note.content.length > 150 
                      ? `${note.content.substring(0, 150)}...`
                      : note.content
                    }
                  </div>
                  
                  {note.location && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {getLocationString(note.location)}
                    </div>
                  )}
                </div>
              ))}

              {fieldNotes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune note de terrain sauvegardée</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldModeInterface;
