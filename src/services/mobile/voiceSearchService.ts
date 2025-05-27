
export interface VoiceSearchResult {
  transcript: string;
  confidence: number;
  isListening: boolean;
}

class VoiceSearchService {
  private recognition: SpeechRecognition | null = null;
  private isSupported = false;

  constructor() {
    this.checkSupport();
  }

  private checkSupport() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.isSupported = true;
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
      this.isSupported = true;
    } else {
      console.warn('Speech recognition not supported');
      this.isSupported = false;
    }

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'fr-FR';
    }
  }

  /**
   * Check if voice search is supported
   */
  isVoiceSearchSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Start voice recognition
   */
  async startListening(): Promise<VoiceSearchResult> {
    return new Promise((resolve, reject) => {
      if (!this.recognition || !this.isSupported) {
        reject(new Error('Voice recognition not supported'));
        return;
      }

      let finalTranscript = '';
      let isListening = true;

      this.recognition.onstart = () => {
        console.log('Voice recognition started');
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Return interim results
        if (interimTranscript) {
          resolve({
            transcript: interimTranscript,
            confidence: event.results[event.resultIndex][0].confidence || 0.5,
            isListening: true
          });
        }
      };

      this.recognition.onend = () => {
        isListening = false;
        if (finalTranscript) {
          resolve({
            transcript: finalTranscript,
            confidence: 0.9,
            isListening: false
          });
        }
      };

      this.recognition.onerror = (event) => {
        reject(new Error(`Voice recognition error: ${event.error}`));
      };

      // Start recognition
      try {
        this.recognition.start();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop voice recognition
   */
  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  /**
   * Set language for recognition
   */
  setLanguage(lang: string) {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  /**
   * Process voice command for smart search
   */
  processVoiceCommand(transcript: string): {
    searchQuery: string;
    filters: any;
    action: string;
  } {
    const lowerTranscript = transcript.toLowerCase();
    
    // Extract filters from voice commands
    const filters: any = {};
    let searchQuery = transcript;
    let action = 'search';

    // Detect period filters
    if (lowerTranscript.includes('moyen âge') || lowerTranscript.includes('médiéval')) {
      filters.periods = ['Moyen Âge'];
      searchQuery = searchQuery.replace(/moyen âge|médiéval/gi, '').trim();
    }

    if (lowerTranscript.includes('renaissance')) {
      filters.periods = ['Renaissance'];
      searchQuery = searchQuery.replace(/renaissance/gi, '').trim();
    }

    // Detect culture filters
    if (lowerTranscript.includes('celte') || lowerTranscript.includes('celtique')) {
      filters.cultures = ['Celte'];
      searchQuery = searchQuery.replace(/celte|celtique/gi, '').trim();
    }

    if (lowerTranscript.includes('romain') || lowerTranscript.includes('antique')) {
      filters.cultures = ['Romain'];
      searchQuery = searchQuery.replace(/romain|antique/gi, '').trim();
    }

    // Detect actions
    if (lowerTranscript.includes('ajouter') || lowerTranscript.includes('créer')) {
      action = 'create';
    } else if (lowerTranscript.includes('carte') || lowerTranscript.includes('localiser')) {
      action = 'map';
    } else if (lowerTranscript.includes('analyser') || lowerTranscript.includes('analyse')) {
      action = 'analyze';
    }

    return {
      searchQuery: searchQuery.trim(),
      filters,
      action
    };
  }
}

export const voiceSearchService = new VoiceSearchService();
