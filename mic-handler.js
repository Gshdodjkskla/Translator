class MicrophoneHandler {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.permissionGranted = false;
        this.onResult = null;
        this.onError = null;
        this.onStatusChange = null;
        this.accumulatedText = '';
        this.silenceTimeout = null;
        this.recognitionState = 'stopped';
        this.lastResultTime = 0;
        this.minSpeechLength = 3; // Minimum characters for valid speech
        this.processedTranscripts = new Set(); // Track processed transcripts to avoid duplicates
        
        // Check permission status without requesting it
        this.checkExistingPermission();
    }

    async checkExistingPermission() {
        try {
            // Check if permission was already granted
            const permission = await navigator.permissions.query({ name: 'microphone' });
            if (permission.state === 'granted') {
                this.permissionGranted = true;
                this.initializeSpeechRecognition();
                if (this.onStatusChange) {
                    this.onStatusChange('ready', 'Ready to listen - Click START to begin');
                }
            } else {
                this.permissionGranted = false;
                if (this.onStatusChange) {
                    this.onStatusChange('permission-needed', 'Click START to grant microphone access');
                }
            }
        } catch (error) {
            // Fallback for browsers that don't support permissions API
            this.permissionGranted = false;
            if (this.onStatusChange) {
                this.onStatusChange('permission-needed', 'Click START to grant microphone access');
            }
        }
    }

    async requestPermission() {
        if (this.permissionGranted) return true;

        try {
            // Request permission by trying to access microphone
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            });
            this.permissionGranted = true;
            
            // Stop the stream immediately
            stream.getTracks().forEach(track => track.stop());
            
            // Initialize speech recognition
            this.initializeSpeechRecognition();
            
            if (this.onStatusChange) {
                this.onStatusChange('ready', 'Permission granted. Ready to listen');
            }
            
            return true;
        } catch (error) {
            this.permissionGranted = false;
            if (this.onError) {
                this.onError('permission-denied', 'Microphone access denied. Please allow access and try again.');
            }
            return false;
        }
    }

    initializeSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            if (this.onError) {
                this.onError('not-supported', 'Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
            }
            return false;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Enhanced configuration for better Telugu recognition
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'te-IN';
        this.recognition.maxAlternatives = 1;
        
        // Remove automatic stopping - let it run indefinitely
        // this.recognition.serviceURI = 'wss://speech.googleapis.com/v1/speech:recognize';
        
        this.recognition.onstart = () => {
            console.log('Speech recognition started');
            this.recognitionState = 'running';
            this.isListening = true;
            this.lastResultTime = Date.now();
            if (this.onStatusChange) {
                this.onStatusChange('listening', '🎤 Listening... Speak clearly in Telugu');
            }
        };
        
        this.recognition.onresult = (event) => {
            console.log('Speech recognition result received');
            this.lastResultTime = Date.now();
            
            let finalTranscript = '';
            let interimTranscript = '';
            
            // Process ALL results, not just new ones
            for (let i = 0; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    // Only add final results we haven't seen before
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }
            
            if (finalTranscript.trim()) {
                const trimmedFinal = finalTranscript.trim();
                const normalizedFinal = trimmedFinal.toLowerCase().replace(/\s+/g, ' ').trim();
                
                // AGGRESSIVE DUPLICATE PREVENTION
                // Check if this exact text is already in our accumulated text
                const normalizedAccumulated = this.accumulatedText.toLowerCase().replace(/\s+/g, ' ');
                
                if (!normalizedAccumulated.includes(normalizedFinal) && normalizedFinal.length > 5) {
                    // Only add if it's NOT already in our accumulated text and is meaningful length
                    this.accumulatedText += finalTranscript;
                    console.log('Added NEW transcript:', finalTranscript.substring(0, 100) + '...');
                    console.log('Total length now:', this.accumulatedText.length);
                } else {
                    console.log('DUPLICATE ignored (already in accumulated text):', trimmedFinal.substring(0, 50) + '...');
                }
            }
            
            // Show current text being recognized
            const currentText = this.accumulatedText + interimTranscript;
            if (currentText.trim()) {
                const displayText = currentText.length > 150 ? 
                    currentText.substring(0, 150) + '...' : currentText;
                if (this.onResult) {
                    this.onResult(currentText, this.accumulatedText, interimTranscript);
                }
                if (this.onStatusChange) {
                    const charCount = currentText.length;
                    const wordCount = currentText.split(' ').length;
                    this.onStatusChange('listening', `🎤 Listening... (${charCount} chars, ${wordCount} words) - ${displayText}`);
                }
            }
            
            // Reset silence timeout
            this.resetSilenceTimeout();
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.recognitionState = 'stopped';
            
            // Handle all errors by trying to restart (except network errors)
            if (event.error === 'no-speech' || event.error === 'aborted' || event.error === 'audio-capture') {
                if (this.isListening) {
                    console.log('Non-fatal error, restarting recognition...');
                    setTimeout(() => {
                        if (this.isListening) {
                            this.restartRecognition();
                        }
                    }, 500);
                }
            } else if (event.error === 'network') {
                // Network error - show error but don't stop listening
                if (this.onStatusChange) {
                    this.onStatusChange('error', 'Network error - check connection and try again');
                }
                setTimeout(() => {
                    if (this.isListening) {
                        this.restartRecognition();
                    }
                }, 2000);
            } else {
                // Other errors - try to restart anyway
                console.log('Error encountered, attempting restart...');
                setTimeout(() => {
                    if (this.isListening) {
                        this.restartRecognition();
                    }
                }, 1000);
            }
        };
        
        this.recognition.onend = () => {
            console.log('Speech recognition ended');
            this.recognitionState = 'stopped';
            
            // ALWAYS restart if still listening (unless manually stopped)
            if (this.isListening) {
                console.log('Auto-restarting recognition to continue listening...');
                // Clear recent duplicates to allow new speech
                this.processedTranscripts.clear();
                setTimeout(() => {
                    if (this.isListening) {
                        this.restartRecognition();
                    }
                }, 500); // Slightly longer delay to prevent rapid restarts
            }
        };
        
        return true;
    }

    async startListening() {
        console.log('Starting to listen...');
        
        if (!this.permissionGranted) {
            const granted = await this.requestPermission();
            if (!granted) return false;
        }

        if (!this.recognition) {
            if (!this.initializeSpeechRecognition()) {
                return false;
            }
        }

        // Reset state
        this.accumulatedText = '';
        this.processedTranscripts.clear(); // Clear processed transcripts
        this.isListening = true;
        this.recognitionState = 'starting';
        this.lastResultTime = Date.now();
        
        try {
            this.recognition.start();
            console.log('Speech recognition start attempted');
            return true;
        } catch (error) {
            console.error('Failed to start recognition:', error);
            this.recognitionState = 'stopped';
            if (this.onError) {
                this.onError('start-failed', 'Failed to start listening. Please try again.');
            }
            return false;
        }
    }

    stopListening() {
        console.log('Stopping listening...');
        console.log('Accumulated text before stop:', this.accumulatedText);
        
        this.isListening = false;
        this.recognitionState = 'stopping';
        this.clearSilenceTimeout();
        
        if (this.recognition) {
            try {
                this.recognition.stop();
                console.log('Recognition stop attempted');
            } catch (error) {
                console.error('Error stopping recognition:', error);
            }
        }
        
        // Get final text and clean it
        const finalText = this.accumulatedText.trim();
        console.log('Final text to return:', finalText);
        
        // Reset accumulated text
        this.accumulatedText = '';
        
        if (this.onStatusChange) {
            if (finalText && finalText.length >= this.minSpeechLength) {
                this.onStatusChange('stopped', 'Processing speech...');
            } else {
                this.onStatusChange('stopped', 'No speech detected. Please try again.');
            }
        }
        
        // Return final text only if it meets minimum requirements
        return finalText && finalText.length >= this.minSpeechLength ? finalText : '';
    }

    restartRecognition() {
        if (!this.isListening || this.recognitionState === 'running') return;
        
        console.log('Attempting to restart recognition...');
        
        // REMOVE TIME-BASED STOPPING - Keep trying to restart indefinitely
        setTimeout(() => {
            if (this.isListening && this.recognitionState !== 'running') {
                try {
                    // Create new recognition instance to avoid conflicts
                    this.initializeSpeechRecognition();
                    this.recognition.start();
                    console.log('Recognition restarted successfully');
                } catch (error) {
                    console.error('Failed to restart recognition:', error);
                    // Try again after a short delay
                    if (this.isListening) {
                        setTimeout(() => {
                            if (this.isListening) {
                                this.restartRecognition();
                            }
                        }, 1000);
                    }
                }
            }
        }, 100);
    }

    resetSilenceTimeout() {
        this.clearSilenceTimeout();
        
        // REMOVE AUTOMATIC STOPPING - Let user control when to stop
        // Keep recognition running until manually stopped
        this.silenceTimeout = setTimeout(() => {
            if (this.isListening) {
                console.log('Continuous listening active, accumulated text:', this.accumulatedText);
                
                // Clear old duplicate detection to allow new speech
                if (this.processedTranscripts.size > 5) {
                    this.processedTranscripts.clear();
                    console.log('Cleared duplicate detection cache to allow new speech');
                }
                
                // Just show status, don't stop automatically
                if (this.onStatusChange) {
                    if (this.accumulatedText.trim().length > 0) {
                        const wordCount = this.accumulatedText.trim().split(/\s+/).length;
                        this.onStatusChange('listening', `🎤 Listening... (${this.accumulatedText.length} chars, ${wordCount} words)`);
                    } else {
                        this.onStatusChange('listening', '🎤 Listening... Please speak in Telugu');
                    }
                }
                // Continue the timeout cycle
                this.resetSilenceTimeout();
            }
        }, 2000); // Check every 2 seconds and clear duplicates
    }

    clearSilenceTimeout() {
        if (this.silenceTimeout) {
            clearTimeout(this.silenceTimeout);
            this.silenceTimeout = null;
        }
    }

    getErrorMessage(error) {
        switch (error) {
            case 'no-speech':
                return 'No speech detected. Please speak clearly and try again.';
            case 'audio-capture':
                return 'Microphone access denied or unavailable. Please check your microphone.';
            case 'not-allowed':
                return 'Microphone access denied. Please allow access and refresh the page.';
            case 'network':
                return 'Network error. Please check your internet connection.';
            case 'service-not-allowed':
                return 'Speech recognition service not allowed. Please try again.';
            case 'bad-grammar':
                return 'Speech recognition failed. Please speak more clearly.';
            case 'language-not-supported':
                return 'Telugu language not supported. Please check your browser settings.';
            default:
                return `Speech recognition error (${error}). Please try again.`;
        }
    }

    // Get current accumulated text (useful for debugging)
    getCurrentText() {
        return this.accumulatedText;
    }

    // Check if currently listening
    getIsListening() {
        return this.isListening;
    }

    // Get recognition state
    getState() {
        return this.recognitionState;
    }

    destroy() {
        console.log('Destroying microphone handler...');
        this.stopListening();
        this.clearSilenceTimeout();
        this.recognition = null;
        this.onResult = null;
        this.onError = null;
        this.onStatusChange = null;
    }
}
