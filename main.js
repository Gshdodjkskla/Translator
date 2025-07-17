class TeluguTranslatorApp {
    constructor() {
        this.micHandler = new MicrophoneHandler();
        this.translator = new PerfectTranslator();
        this.currentTeluguText = '';
        this.currentRawText = '';
        this.currentImprovedText = '';
        this.currentInputMethod = 'voice';
        
        this.initializeElements();
        this.setupEventListeners();
        this.setupMicrophoneHandlers();
    }

    initializeElements() {
        // Tab elements
        this.voiceTab = document.getElementById('voiceTab');
        this.textTab = document.getElementById('textTab');
        this.voiceSection = document.getElementById('voiceSection');
        this.textSection = document.getElementById('textSection');
        
        // Voice controls
        this.startMicButton = document.getElementById('startMicButton');
        this.stopMicButton = document.getElementById('stopMicButton');
        this.status = document.getElementById('status');
        
        // Text input
        this.teluguInput = document.getElementById('teluguInput');
        this.translateButton = document.getElementById('translateButton');
        
        // Results
        this.resultsSection = document.getElementById('resultsSection');
        this.teluguDisplay = document.getElementById('teluguDisplay');
        this.rawDisplay = document.getElementById('rawDisplay');
        this.improvedDisplay = document.getElementById('improvedDisplay');
        
        // Text areas for editing
        this.teluguTextArea = document.getElementById('teluguTextArea');
        this.rawTextArea = document.getElementById('rawTextArea');
        this.improvedTextArea = document.getElementById('improvedTextArea');
        
        // Edit controls
        this.teluguControls = document.getElementById('teluguControls');
        this.rawControls = document.getElementById('rawControls');
        this.improvedControls = document.getElementById('improvedControls');
        
        // Messages
        this.errorMessage = document.getElementById('errorMessage');
        this.successMessage = document.getElementById('successMessage');
        
        // Copy buttons
        this.copyTeluguBtn = document.getElementById('copyTeluguBtn');
        this.copyRawBtn = document.getElementById('copyRawBtn');
        this.copyImprovedBtn = document.getElementById('copyImprovedBtn');
        
        // Edit buttons
        this.editTeluguBtn = document.getElementById('editTeluguBtn');
        this.editRawBtn = document.getElementById('editRawBtn');
        this.editImprovedBtn = document.getElementById('editImprovedBtn');
        
        // Save/Cancel buttons
        this.saveTeluguBtn = document.getElementById('saveTeluguBtn');
        this.cancelTeluguBtn = document.getElementById('cancelTeluguBtn');
        this.saveRawBtn = document.getElementById('saveRawBtn');
        this.cancelRawBtn = document.getElementById('cancelRawBtn');
        this.saveImprovedBtn = document.getElementById('saveImprovedBtn');
        this.cancelImprovedBtn = document.getElementById('cancelImprovedBtn');
        
        // Action buttons
        this.translateAgain = document.getElementById('translateAgain');
        this.sendWhatsApp = document.getElementById('sendWhatsApp');
        this.reTranslateBtn = document.getElementById('reTranslateBtn');
        
        // Improvement buttons
        this.improveGrammarBtn = document.getElementById('improveGrammarBtn');
        this.makeFormalBtn = document.getElementById('makeFormalBtn');
        this.makeSimpleBtn = document.getElementById('makeSimpleBtn');
        
        // Initially disable stop button
        this.stopMicButton.disabled = true;
        this.translateButton.disabled = true;
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        console.log('Start button:', this.startMicButton);
        console.log('Stop button:', this.stopMicButton);
        
        // Tab switching
        this.voiceTab?.addEventListener('click', () => this.switchToVoice());
        this.textTab?.addEventListener('click', () => this.switchToText());
        
        // Voice controls
        this.startMicButton?.addEventListener('click', () => {
            console.log('Start button clicked');
            this.startListening();
        });
        this.stopMicButton?.addEventListener('click', () => {
            console.log('Stop button clicked');
            this.stopListening();
        });
        
        // Text input
        this.teluguInput?.addEventListener('input', () => this.validateTextInput());
        this.translateButton?.addEventListener('click', () => this.translateTextInput());
        
        // Copy buttons - Fixed copy functionality
        this.copyTeluguBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.copyText(this.currentTeluguText, 'Telugu text');
        });
        this.copyRawBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.copyText(this.currentRawText, 'Raw translation');
        });
        this.copyImprovedBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.copyText(this.currentImprovedText, 'Improved text');
        });
        
        // Edit buttons
        this.editTeluguBtn?.addEventListener('click', () => this.startEditingTelugu());
        this.editRawBtn?.addEventListener('click', () => this.startEditingRaw());
        this.editImprovedBtn?.addEventListener('click', () => this.startEditingImproved());
        
        // Save/Cancel buttons
        this.saveTeluguBtn?.addEventListener('click', () => this.saveTeluguEdit());
        this.cancelTeluguBtn?.addEventListener('click', () => this.cancelTeluguEdit());
        this.saveRawBtn?.addEventListener('click', () => this.saveRawEdit());
        this.cancelRawBtn?.addEventListener('click', () => this.cancelRawEdit());
        this.saveImprovedBtn?.addEventListener('click', () => this.saveImprovedEdit());
        this.cancelImprovedBtn?.addEventListener('click', () => this.cancelImprovedEdit());
        
        // Action buttons
        this.translateAgain?.addEventListener('click', () => this.resetApp());
        this.sendWhatsApp?.addEventListener('click', () => this.sendToWhatsApp());
        this.reTranslateBtn?.addEventListener('click', () => this.reTranslateFromTelugu());
        
        // Improvement buttons
        this.improveGrammarBtn?.addEventListener('click', () => this.improveGrammar());
        this.makeFormalBtn?.addEventListener('click', () => this.makeFormal());
        this.makeSimpleBtn?.addEventListener('click', () => this.makeSimple());
    }

    setupMicrophoneHandlers() {
        this.micHandler.onResult = (currentText, finalText, interimText) => {
            if (currentText.trim()) {
                const displayText = currentText.length > 150 ? 
                    currentText.substring(0, 150) + '...' : currentText;
                this.updateStatus('listening', `🎤 ${displayText}`);
            }
        };

        this.micHandler.onError = (errorType, message) => {
            this.showError(message);
            this.resetButtons();
        };

        this.micHandler.onStatusChange = (status, message) => {
            this.updateStatus(status, message);
            
            // Show continuous listening indicator
            if (status === 'listening' && this.startMicButton) {
                this.startMicButton.textContent = 'Listening...';
                this.startMicButton.style.backgroundColor = '#ff4444';
                this.startMicButton.style.animation = 'pulse 2s infinite';
            }
        };
    }

    switchToVoice() {
        this.currentInputMethod = 'voice';
        this.voiceTab?.classList.add('active');
        this.textTab?.classList.remove('active');
        this.voiceSection?.classList.add('active');
        this.textSection?.classList.remove('active');
        this.hideResults();
        this.hideError();
        this.hideSuccess();
    }

    switchToText() {
        this.currentInputMethod = 'text';
        this.textTab?.classList.add('active');
        this.voiceTab?.classList.remove('active');
        this.textSection?.classList.add('active');
        this.voiceSection?.classList.remove('active');
        this.hideResults();
        this.hideError();
        this.hideSuccess();
        this.micHandler.stopListening();
        this.resetButtons();
    }

    validateTextInput() {
        if (this.teluguInput && this.translateButton) {
            const hasText = this.teluguInput.value.trim().length > 0;
            this.translateButton.disabled = !hasText;
        }
    }

    async translateTextInput() {
        const teluguText = this.teluguInput?.value.trim();
        if (!teluguText) {
            this.showError('Please enter Telugu text to translate');
            return;
        }

        this.setButtonLoading(this.translateButton, true);
        await this.processTeluguText(teluguText);
        this.setButtonLoading(this.translateButton, false);
    }

    async startListening() {
        console.log('startListening method called');
        this.hideError();
        this.hideSuccess();
        this.hideResults();
        
        console.log('About to call micHandler.startListening()');
        const success = await this.micHandler.startListening();
        console.log('startListening result:', success);
        
        if (success) {
            this.startMicButton.disabled = true;
            this.stopMicButton.disabled = false;
            this.startMicButton?.classList.add('listening');
            console.log('Button states updated successfully');
        } else {
            console.log('Failed to start listening');
        }
    }

    async stopListening() {
        console.log('Stop button clicked');
        
        // Get the accumulated text before stopping
        const accumulatedText = this.micHandler.getCurrentText();
        console.log('Accumulated text before stop:', accumulatedText);
        
        const finalText = this.micHandler.stopListening();
        console.log('Final text from mic handler:', finalText);
        
        this.resetButtons();
        
        // Use accumulated text if finalText is empty
        const textToProcess = finalText || accumulatedText;
        console.log('Text to process:', textToProcess);
        
        if (textToProcess && textToProcess.trim().length > 0) {
            await this.processTeluguText(textToProcess);
        } else {
            this.showError('No speech detected. Please try speaking again in Telugu.');
            this.updateStatus('', 'Click START to try again');
        }
    }

    async processTeluguText(teluguText) {
        console.log('Processing Telugu text:', teluguText);
        
        // Validate input
        if (!teluguText || typeof teluguText !== 'string') {
            this.showError('Invalid text input. Please try again.');
            return;
        }
        
        const cleanedInput = teluguText.trim();
        if (!cleanedInput) {
            this.showError('No text to translate. Please speak or type something in Telugu.');
            return;
        }
        
        if (cleanedInput.length < 2) {
            this.showError('Text too short. Please speak or type more content in Telugu.');
            return;
        }
        
        this.updateStatus('processing', '⏳ Processing and translating...');
        
        try {
            // Clean up repetitions but preserve long text
            let cleanedTelugu = this.translator.removeRepetitions(cleanedInput);
            
            // Additional safety check for Telugu repetitions
            if (cleanedTelugu && /[\u0C00-\u0C7F]/.test(cleanedTelugu)) {
                cleanedTelugu = this.removeTeluguSentenceDuplicates(cleanedTelugu);
            }
            
            console.log('Original input:', cleanedInput);
            console.log('Cleaned Telugu text:', cleanedTelugu);
            console.log('Input length:', cleanedInput.length, 'Cleaned length:', cleanedTelugu ? cleanedTelugu.length : 0);
            
            if (!cleanedTelugu || cleanedTelugu.trim().length < 2) {
                console.error('Text cleaning failed - original:', cleanedInput, 'cleaned:', cleanedTelugu);
                throw new Error('Text became empty after cleaning');
            }
            
            this.currentTeluguText = cleanedTelugu;
            if (this.teluguDisplay) {
                this.teluguDisplay.textContent = cleanedTelugu;
            }
            
            // NEW Two-Stage Translation System
            this.updateStatus('processing', '🔄 Stage 1: Raw Translation...');
            const translationResult = await this.translator.translateText(cleanedTelugu);
            console.log('Translation result:', translationResult);
            
            if (!translationResult || (!translationResult.raw && !translationResult.enhanced)) {
                // Fallback to legacy method if new system fails
                const legacyResult = await this.translator.translateTextLegacy(cleanedTelugu);
                if (!legacyResult) {
                    throw new Error('Translation returned empty result');
                }
                this.currentRawText = legacyResult;
                this.currentImprovedText = this.translator.enhanceTranslation(legacyResult);
            } else {
                // Use new two-stage system
                this.currentRawText = translationResult.raw;
                
                this.updateStatus('processing', '✨ Stage 2: Professional Enhancement...');
                this.currentImprovedText = translationResult.enhanced;
            }
            
            // Display raw translation (Stage 1 result)
            if (this.rawDisplay) {
                this.rawDisplay.textContent = this.currentRawText;
            }
            console.log('Raw translation (Stage 1):', this.currentRawText);
            
            // Display enhanced translation (Stage 2 result)
            if (this.improvedDisplay) {
                this.improvedDisplay.textContent = this.currentImprovedText;
            }
            console.log('Enhanced translation (Stage 2):', this.currentImprovedText);
            
            this.showResults();
            this.updateStatus('', '✅ Translation completed successfully!');
            this.showSuccess('Translation completed successfully!');
            
        } catch (error) {
            console.error('Translation error:', error);
            
            // Provide more specific error messages
            let errorMessage = 'Translation failed. ';
            if (error.message.includes('No text to translate')) {
                errorMessage += 'Please speak or type something in Telugu.';
            } else if (error.message.includes('All translation methods failed')) {
                errorMessage += 'Translation service unavailable. Please check your internet connection and try again.';
            } else if (error.message.includes('empty after cleaning')) {
                errorMessage += 'The text appears to be invalid. Please try speaking or typing different content.';
            } else {
                errorMessage += 'Please try again or check your internet connection.';
            }
            
            this.showError(errorMessage);
            this.updateStatus('', '');
            
            // If we have some text, show it anyway
            if (cleanedInput && cleanedInput.length > 0) {
                this.currentTeluguText = cleanedInput;
                if (this.teluguDisplay) {
                    this.teluguDisplay.textContent = cleanedInput;
                }
                this.currentRawText = `Original Telugu: ${cleanedInput}\n\nNote: Translation service unavailable. Please manually translate or try again later.`;
                if (this.rawDisplay) {
                    this.rawDisplay.textContent = this.currentRawText;
                }
                this.currentImprovedText = this.currentRawText;
                if (this.improvedDisplay) {
                    this.improvedDisplay.textContent = this.currentImprovedText;
                }
                this.showResults();
            }
        }
    }

    removeTeluguSentenceDuplicates(text) {
        // Split by common Telugu and English sentence endings
        const sentences = text.split(/[।.!?]+/).filter(s => s.trim());
        const uniqueSentences = [];
        const seen = new Set();
        
        for (const sentence of sentences) {
            const trimmed = sentence.trim();
            if (!trimmed || trimmed.length < 5) continue;
            
            // Normalize for comparison
            const normalized = trimmed.toLowerCase().replace(/\s+/g, ' ');
            
            if (!seen.has(normalized)) {
                seen.add(normalized);
                uniqueSentences.push(trimmed);
            }
        }
        
        return uniqueSentences.join('. ').trim();
    }

    async reTranslateFromTelugu() {
        if (!this.currentTeluguText) {
            this.showError('No Telugu text to re-translate');
            return;
        }

        this.setButtonLoading(this.reTranslateBtn, true);
        this.updateStatus('processing', 'Re-translating...');
        
        try {
            const rawTranslation = await this.translator.translateText(this.currentTeluguText);
            this.currentRawText = rawTranslation;
            if (this.rawDisplay) {
                this.rawDisplay.textContent = rawTranslation;
            }
            
            const improvedText = this.translator.perfectGrammarCorrection(rawTranslation);
            this.currentImprovedText = improvedText;
            if (this.improvedDisplay) {
                this.improvedDisplay.textContent = improvedText;
            }
            
            this.updateStatus('', '✅ Re-translation completed!');
            this.showSuccess('Re-translation completed successfully!');
        } catch (error) {
            this.showError('Re-translation failed. Please try again.');
            this.updateStatus('', '');
        }
        
        this.setButtonLoading(this.reTranslateBtn, false);
    }

    async improveGrammar() {
        if (!this.currentRawText) {
            this.showError('No text to improve');
            return;
        }

        this.setButtonLoading(this.improveGrammarBtn, true);
        const improvedText = this.translator.perfectGrammarCorrection(this.currentRawText);
        this.currentImprovedText = improvedText;
        if (this.improvedDisplay) {
            this.improvedDisplay.textContent = improvedText;
        }
        this.showSuccess('Grammar improved successfully!');
        this.setButtonLoading(this.improveGrammarBtn, false);
    }

    async makeFormal() {
        if (!this.currentRawText) {
            this.showError('No text to make formal');
            return;
        }

        this.setButtonLoading(this.makeFormalBtn, true);
        let formal = this.translator.perfectGrammarCorrection(this.currentRawText);
        
        // Enhanced formal conversion
        const formalReplacements = {
            'hi': 'Dear',
            'hello': 'Dear',
            'thanks': 'Thank you',
            'thx': 'Thank you',
            'please': 'Kindly',
            'okay': 'Very well',
            'ok': 'Alright',
            'bye': 'Best regards',
            'see you': 'Looking forward to meeting you',
            'asap': 'as soon as possible',
            'fyi': 'for your information'
        };

        Object.entries(formalReplacements).forEach(([informal, formal_word]) => {
            const regex = new RegExp(`\\b${informal}\\b`, 'gi');
            formal = formal.replace(regex, formal_word);
        });
        
        // Add formal greeting if missing
        if (!formal.match(/^(dear|respected|hello|good morning|good afternoon|good evening)/i)) {
            formal = 'Dear Sir/Madam, ' + formal;
        }
        
        this.currentImprovedText = formal;
        if (this.improvedDisplay) {
            this.improvedDisplay.textContent = formal;
        }
        this.showSuccess('Text made formal successfully!');
        this.setButtonLoading(this.makeFormalBtn, false);
    }

    async makeSimple() {
        if (!this.currentRawText) {
            this.showError('No text to simplify');
            return;
        }

        this.setButtonLoading(this.makeSimpleBtn, true);
        let simple = this.translator.perfectGrammarCorrection(this.currentRawText);
        
        // Enhanced simplification
        const simplifications = {
            'utilize': 'use',
            'commence': 'start',
            'terminate': 'end',
            'assist': 'help',
            'purchase': 'buy',
            'obtain': 'get',
            'acquire': 'get',
            'demonstrate': 'show',
            'facilitate': 'help',
            'accommodate': 'help',
            'participate': 'take part',
            'contribute': 'help',
            'establish': 'set up',
            'maintain': 'keep',
            'provide': 'give',
            'receive': 'get',
            'in order to': 'to',
            'due to the fact that': 'because',
            'at this point in time': 'now',
            'in the event that': 'if'
        };

        Object.entries(simplifications).forEach(([complex, simple_word]) => {
            const regex = new RegExp(`\\b${complex}\\b`, 'gi');
            simple = simple.replace(regex, simple_word);
        });
        
        this.currentImprovedText = simple;
        if (this.improvedDisplay) {
            this.improvedDisplay.textContent = simple;
        }
        this.showSuccess('Text simplified successfully!');
        this.setButtonLoading(this.makeSimpleBtn, false);
    }

    // Enhanced copy functionality
    async copyText(text, type) {
        if (!text) {
            this.showError(`No ${type} to copy`);
            return;
        }

        try {
            // Try modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                this.showSuccess(`${type} copied to clipboard!`);
                return;
            }
            
            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.style.opacity = '0';
            textArea.style.zIndex = '-1';
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            textArea.setSelectionRange(0, text.length);
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                this.showSuccess(`${type} copied to clipboard!`);
            } else {
                throw new Error('Copy command failed');
            }
            
        } catch (error) {
            console.error('Copy failed:', error);
            // Final fallback - show text for manual copy
            this.showError(`Failed to copy automatically. Please copy manually: ${text.substring(0, 50)}...`);
        }
    }

    // Edit functionality
    startEditingTelugu() {
        if (this.teluguTextArea && this.teluguDisplay && this.teluguControls && this.editTeluguBtn) {
            this.teluguTextArea.value = this.currentTeluguText;
            this.teluguDisplay.style.display = 'none';
            this.teluguTextArea.style.display = 'block';
            this.teluguControls.style.display = 'flex';
            this.editTeluguBtn.style.display = 'none';
            this.teluguTextArea.focus();
        }
    }

    saveTeluguEdit() {
        if (this.teluguTextArea) {
            this.currentTeluguText = this.teluguTextArea.value;
            if (this.teluguDisplay) {
                this.teluguDisplay.textContent = this.currentTeluguText;
            }
            this.cancelTeluguEdit();
            this.showSuccess('Telugu text updated! Click "Re-translate" to get new translation.');
        }
    }

    cancelTeluguEdit() {
        if (this.teluguDisplay && this.teluguTextArea && this.teluguControls && this.editTeluguBtn) {
            this.teluguDisplay.style.display = 'block';
            this.teluguTextArea.style.display = 'none';
            this.teluguControls.style.display = 'none';
            this.editTeluguBtn.style.display = 'block';
        }
    }

    startEditingRaw() {
        if (this.rawTextArea && this.rawDisplay && this.rawControls && this.editRawBtn) {
            this.rawTextArea.value = this.currentRawText;
            this.rawDisplay.style.display = 'none';
            this.rawTextArea.style.display = 'block';
            this.rawControls.style.display = 'flex';
            this.editRawBtn.style.display = 'none';
            this.rawTextArea.focus();
        }
    }

    saveRawEdit() {
        if (this.rawTextArea) {
            this.currentRawText = this.rawTextArea.value;
            if (this.rawDisplay) {
                this.rawDisplay.textContent = this.currentRawText;
            }
            this.cancelRawEdit();
            this.showSuccess('Raw translation updated!');
        }
    }

    cancelRawEdit() {
        if (this.rawDisplay && this.rawTextArea && this.rawControls && this.editRawBtn) {
            this.rawDisplay.style.display = 'block';
            this.rawTextArea.style.display = 'none';
            this.rawControls.style.display = 'none';
            this.editRawBtn.style.display = 'block';
        }
    }

    startEditingImproved() {
        if (this.improvedTextArea && this.improvedDisplay && this.improvedControls && this.editImprovedBtn) {
            this.improvedTextArea.value = this.currentImprovedText;
            this.improvedDisplay.style.display = 'none';
            this.improvedTextArea.style.display = 'block';
            this.improvedControls.style.display = 'flex';
            this.editImprovedBtn.style.display = 'none';
            this.improvedTextArea.focus();
        }
    }

    saveImprovedEdit() {
        if (this.improvedTextArea) {
            this.currentImprovedText = this.improvedTextArea.value;
            if (this.improvedDisplay) {
                this.improvedDisplay.textContent = this.currentImprovedText;
            }
            this.cancelImprovedEdit();
            this.showSuccess('Improved text updated!');
        }
    }

    cancelImprovedEdit() {
        if (this.improvedDisplay && this.improvedTextArea && this.improvedControls && this.editImprovedBtn) {
            this.improvedDisplay.style.display = 'block';
            this.improvedTextArea.style.display = 'none';
            this.improvedControls.style.display = 'none';
            this.editImprovedBtn.style.display = 'block';
        }
    }

    sendToWhatsApp() {
        const message = this.currentImprovedText || this.currentRawText;
        if (!message) {
            this.showError('No message to send');
            return;
        }

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }

    resetApp() {
        this.hideResults();
        this.hideError();
        this.hideSuccess();
        this.currentTeluguText = '';
        this.currentRawText = '';
        this.currentImprovedText = '';
        
        if (this.teluguDisplay) this.teluguDisplay.textContent = '';
        if (this.rawDisplay) this.rawDisplay.textContent = '';
        if (this.improvedDisplay) this.improvedDisplay.textContent = '';
        if (this.teluguInput) this.teluguInput.value = '';
        
        this.validateTextInput();
        this.micHandler.stopListening();
        this.resetButtons();
        this.updateStatus('', '');
    }

    resetButtons() {
        if (this.startMicButton) this.startMicButton.disabled = false;
        if (this.stopMicButton) this.stopMicButton.disabled = true;
        this.startMicButton?.classList.remove('listening');
    }

    setButtonLoading(button, isLoading) {
        if (button) {
            button.disabled = isLoading;
            if (isLoading) {
                button.classList.add('loading');
            } else {
                button.classList.remove('loading');
            }
        }
    }

    updateStatus(statusClass, statusText) {
        if (this.status) {
            this.status.className = `status ${statusClass}`;
            this.status.textContent = statusText;
        }
    }

    showResults() {
        if (this.resultsSection) {
            this.resultsSection.style.display = 'block';
        }
    }

    hideResults() {
        if (this.resultsSection) {
            this.resultsSection.style.display = 'none';
        }
    }

    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.style.display = 'block';
        }
        this.hideSuccess();
        
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        if (this.errorMessage) {
            this.errorMessage.style.display = 'none';
        }
    }

    showSuccess(message) {
        if (this.successMessage) {
            this.successMessage.textContent = message;
            this.successMessage.style.display = 'block';
        }
        this.hideError();
        
        setTimeout(() => {
            this.hideSuccess();
        }, 3000);
    }

    hideSuccess() {
        if (this.successMessage) {
            this.successMessage.style.display = 'none';
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TeluguTranslatorApp();
});
