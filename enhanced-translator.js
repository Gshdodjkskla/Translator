class EnhancedTeluguTranslator {
    constructor() {
        this.translationMethods = [
            this.translateWithGoogleCloud.bind(this),
            this.translateWithGoogle.bind(this),
            this.translateWithMyMemory.bind(this),
            this.translateWithLibreTranslate.bind(this)
        ];
    }

    // STAGE 1: Raw Translation (Telugu → Complete Meaningful English)
    async translateRaw(text) {
        if (!text || !text.trim()) {
            throw new Error('No text to translate');
        }

        console.log('🔄 STAGE 1: Raw Translation Starting...');
        const cleanedText = this.preprocessText(text);
        
        const chunks = this.splitIntoChunks(cleanedText, 1500);
        const translatedChunks = [];
        
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            let translated = null;
            
            console.log(`Processing chunk ${i + 1}/${chunks.length}...`);
            
            for (const method of this.translationMethods) {
                try {
                    const result = await method(chunk);
                    if (result && result.trim() && result.trim() !== chunk) {
                        translated = result;
                        console.log(`✅ Raw translation successful with method`);
                        break;
                    }
                } catch (error) {
                    console.log('Translation method failed, trying next...', error);
                    continue;
                }
            }
            
            if (translated) {
                translatedChunks.push(translated);
            } else {
                throw new Error('Raw translation failed for chunk: ' + chunk.substring(0, 50));
            }
            
            if (chunks.length > 10 && i < chunks.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        const basicTranslation = translatedChunks.join(' ');
        
        // STAGE 1 Enhancement: Make it complete and meaningful (but not fully polished)
        const meaningfulTranslation = this.makeMeaningfulAndComplete(basicTranslation);
        
        console.log('✅ STAGE 1: Raw Translation Completed');
        return meaningfulTranslation;
    }

    // Make translation complete and meaningful (Stage 1 enhancement)
    makeMeaningfulAndComplete(text) {
        let enhanced = text;

        // Step 1: Fix basic grammar issues that affect meaning
        enhanced = this.fixBasicGrammarForClarity(enhanced);
        
        // Step 2: Ensure complete context and meaning
        enhanced = this.ensureCompleteContext(enhanced);
        
        // Step 3: Fix common Telugu-English translation gaps
        enhanced = this.fixTranslationGaps(enhanced);
        
        // Step 4: Make sentences complete and clear
        enhanced = this.makeComplete(enhanced);

        return enhanced.trim();
    }

    fixBasicGrammarForClarity(text) {
        let corrected = text;

        // Essential fixes for clarity (not perfection)
        corrected = corrected.replace(/\bi\b/g, 'I');
        corrected = corrected.replace(/^([a-z])/, (match) => match.toUpperCase());
        corrected = corrected.replace(/([.!?]\s*)([a-z])/g, (match, punct, letter) => punct + letter.toUpperCase());
        
        // Fix critical subject-verb agreement for meaning
        corrected = corrected.replace(/\bstudents is\b/gi, 'students are');
        corrected = corrected.replace(/\bstudent are\b/gi, 'student is');
        
        return corrected;
    }

    ensureCompleteContext(text) {
        let contextual = text;

        // Educational context completion
        if (/\b(students|college|attend|examination)\b/gi.test(text)) {
            // Make college notices complete and clear
            contextual = contextual.replace(/\bstudents\b/gi, 'all students');
            contextual = contextual.replace(/\battend college tomorrow\b/gi, 'attend college tomorrow without fail');
            contextual = contextual.replace(/\bmandatory\b/gi, 'compulsory');
            
            // Add context for incomplete sentences
            if (/tomorrow.*college/gi.test(contextual) && !/attendance/gi.test(contextual)) {
                contextual = contextual.replace(/tomorrow.*college/gi, 'tomorrow, college attendance');
            }
        }

        // Health context completion
        if (/\bhealth|sick|not well\b/gi.test(text)) {
            contextual = contextual.replace(/\bdon't have health\b/gi, 'am not feeling well');
            contextual = contextual.replace(/\bhealth is bad\b/gi, 'am not feeling well');
        }

        // Family/personal context completion
        if (/\b(father|mother|family|home)\b/gi.test(text)) {
            contextual = contextual.replace(/\bour father\b/gi, 'my father');
            contextual = contextual.replace(/\bour mother\b/gi, 'my mother');
            contextual = contextual.replace(/\bour family\b/gi, 'my family');
        }

        return contextual;
    }

    fixTranslationGaps(text) {
        let fixed = text;

        // Common Telugu conceptual gaps in English
        const translationGaps = {
            // Time expressions that need context
            'today morning': 'this morning',
            'yesterday night': 'last night',
            'tomorrow evening': 'tomorrow evening',
            
            // Relationship terms that need clarification
            'our people': 'our family members',
            'our person': 'our family member',
            
            // Action clarifications
            'going to office': 'going to the office',
            'coming from office': 'returning from the office',
            'reaching home': 'arriving home',
            
            // Educational terms
            'going to college': 'attending college',
            'college going': 'attending college',
            'study going': 'going to study',
            
            // Formal request clarifications
            'we want that': 'we request that',
            'it is requested': 'we request',
            'should do': 'must do',
            
            // Health expressions
            'body not good': 'not feeling well',
            'health problem': 'health issues',
            
            // Travel expressions
            'going in bus': 'traveling by bus',
            'coming in train': 'returning by train'
        };

        Object.entries(translationGaps).forEach(([gap, clear]) => {
            const regex = new RegExp(`\\b${gap}\\b`, 'gi');
            fixed = fixed.replace(regex, clear);
        });

        return fixed;
    }

    makeComplete(text) {
        let complete = text;

        // Ensure sentences are complete and have proper endings
        if (complete && !complete.match(/[.!?]$/)) {
            complete += '.';
        }

        // Add context where sentences seem incomplete
        if (/^students.*college$/gi.test(complete)) {
            complete = complete.replace(/^students.*college$/gi, 'Dear Students, you must attend college tomorrow.');
        }

        // Fix common incomplete patterns
        complete = complete.replace(/\battend college tomorrow$/gi, 'attend college tomorrow without fail');
        complete = complete.replace(/\bmandatory$/gi, 'mandatory for everyone');
        complete = complete.replace(/\bimportant$/gi, 'very important');

        return complete;
    }

    // STAGE 2: Professional Enhancement (Complete English → Professional Polish)
    async enhanceGrammar(rawEnglishText, context = 'formal') {
        console.log('✨ STAGE 2: Professional Enhancement Starting...');
        
        if (!rawEnglishText || !rawEnglishText.trim()) {
            throw new Error('No text to enhance');
        }

        let enhanced = rawEnglishText;

        // Step 1: Perfect grammar and syntax
        enhanced = this.perfectGrammarSyntax(enhanced);
        
        // Step 2: Apply professional vocabulary
        enhanced = this.applyProfessionalVocabulary(enhanced);
        
        // Step 3: Enhance sentence structure
        enhanced = this.enhanceSentenceStructure(enhanced);
        
        // Step 4: Apply context-specific professional polish
        switch (context) {
            case 'formal':
                enhanced = this.applyFormalEnhancements(enhanced);
                break;
            case 'casual':
                enhanced = this.applyCasualEnhancements(enhanced);
                break;
            case 'professional':
                enhanced = this.applyProfessionalEnhancements(enhanced);
                break;
            case 'educational':
                enhanced = this.applyEducationalEnhancements(enhanced);
                break;
            default:
                enhanced = this.applyGeneralEnhancements(enhanced);
        }

        // Step 5: Final professional polish
        enhanced = this.finalProfessionalPolish(enhanced);

        console.log('✅ STAGE 2: Professional Enhancement Completed');
        return enhanced;
    }

    perfectGrammarSyntax(text) {
        let perfected = text;

        // Perfect all grammar rules
        perfected = this.applyUniversalGrammarRules(perfected);
        
        // Advanced grammar corrections
        perfected = perfected.replace(/\b(I|we|they) are having\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} have`);
        perfected = perfected.replace(/\b(he|she|it) is having\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} has`);
        
        // Perfect tense consistency
        perfected = perfected.replace(/\bwill be going to\b/gi, 'will go to');
        perfected = perfected.replace(/\bam going to go\b/gi, 'will go');
        
        return perfected;
    }

    applyProfessionalVocabulary(text) {
        let professional = text;

        // Replace simple words with professional equivalents
        const professionalVocab = {
            'very important': 'essential',
            'really important': 'crucial',
            'very good': 'excellent',
            'very bad': 'unacceptable',
            'a lot of': 'numerous',
            'lots of': 'multiple',
            'big': 'significant',
            'small': 'minor',
            'get': 'obtain',
            'got': 'obtained',
            'give': 'provide',
            'gave': 'provided',
            'tell': 'inform',
            'told': 'informed',
            'ask': 'request',
            'asked': 'requested',
            'help': 'assist',
            'helped': 'assisted',
            'make sure': 'ensure',
            'find out': 'determine',
            'look at': 'examine',
            'think about': 'consider',
            'talk about': 'discuss',
            'come to': 'attend',
            'go to': 'proceed to'
        };

        Object.entries(professionalVocab).forEach(([simple, professional_word]) => {
            const regex = new RegExp(`\\b${simple}\\b`, 'gi');
            professional = professional.replace(regex, professional_word);
        });

        return professional;
    }

    enhanceSentenceStructure(text) {
        let enhanced = text;

        // Make sentences more sophisticated
        enhanced = enhanced.replace(/\bWe want (.+) to (.+)\b/gi, 'We kindly request $1 to $2');
        enhanced = enhanced.replace(/\bWe need (.+) to (.+)\b/gi, 'We require $1 to $2');
        enhanced = enhanced.replace(/\bYou must (.+)\b/gi, 'You are required to $1');
        enhanced = enhanced.replace(/\bYou should (.+)\b/gi, 'You are expected to $1');
        
        // Improve sentence flow
        enhanced = enhanced.replace(/\bAnd (.+)\b/gi, 'Additionally, $1');
        enhanced = enhanced.replace(/\bBut (.+)\b/gi, 'However, $1');
        enhanced = enhanced.replace(/\bSo (.+)\b/gi, 'Therefore, $1');
        
        return enhanced;
    }

    finalProfessionalPolish(text) {
        let polished = text;

        // Add professional courtesy
        if (/students.*attend.*college/gi.test(polished)) {
            polished = polished.replace(/^(.+)$/gi, 'Dear Students,\n\n$1\n\nThank you for your cooperation.');
        }
        
        // Ensure formal endings
        polished = polished.replace(/\.$/, '.\n\nBest regards.');
        
        // Remove redundant formal endings if multiple exist
        polished = polished.replace(/(Thank you.*?)\n.*?(Thank you.*?)/, '$1');
        polished = polished.replace(/(Best regards.*?)\n.*?(Best regards.*?)/, '$1');
        
        return polished.trim();
    }

    // Complete Translation Pipeline (Telugu → Raw → Enhanced)
    async translateComplete(text, context = 'formal') {
        console.log('🚀 Starting Complete Translation Pipeline...');
        
        try {
            // Stage 1: Raw Translation
            const rawTranslation = await this.translateRaw(text);
            
            // Stage 2: Grammar Enhancement
            const enhancedTranslation = await this.enhanceGrammar(rawTranslation, context);
            
            console.log('✅ Complete Translation Pipeline Finished');
            
            return {
                original: text,
                raw: rawTranslation,
                enhanced: enhancedTranslation,
                context: context
            };

        } catch (error) {
            console.error('❌ Translation Pipeline Failed:', error);
            throw error;
        }
    }

    // Context-specific enhancement methods
    applyFormalEnhancements(text) {
        let enhanced = text;
        
        // Apply universal grammar rules
        enhanced = this.applyUniversalGrammarRules(enhanced);
        
        // Formal-specific enhancements
        const formalReplacements = {
            "won't": "will not",
            "can't": "cannot",
            "don't": "do not",
            "isn't": "is not",
            "aren't": "are not",
            "wasn't": "was not",
            "weren't": "were not",
            "hasn't": "has not",
            "haven't": "have not",
            "hadn't": "had not",
            "wouldn't": "would not",
            "shouldn't": "should not",
            "couldn't": "could not",
            "we want": "we request",
            "we need": "we require",
            "please do": "kindly",
            "very important": "essential",
            "really good": "excellent",
            "really bad": "unacceptable",
            "a lot of": "numerous",
            "lots of": "many",
            "kind of": "somewhat",
            "sort of": "somewhat"
        };

        Object.entries(formalReplacements).forEach(([informal, formal]) => {
            const regex = new RegExp(`\\b${informal}\\b`, 'gi');
            enhanced = enhanced.replace(regex, formal);
        });

        // Formal sentence starters
        enhanced = enhanced.replace(/^students,/i, 'Dear Students,');
        enhanced = enhanced.replace(/^sir,/i, 'Dear Sir,');
        enhanced = enhanced.replace(/^madam,/i, 'Dear Madam,');

        return enhanced;
    }

    applyProfessionalEnhancements(text) {
        let enhanced = this.applyFormalEnhancements(text);
        
        // Professional-specific language
        const professionalReplacements = {
            "we want to tell": "we would like to inform",
            "we want to say": "we would like to state",
            "we think": "we believe",
            "we feel": "we consider",
            "right now": "currently",
            "at this time": "presently",
            "as soon as possible": "at your earliest convenience",
            "get back to": "respond to",
            "find out": "determine",
            "look into": "investigate",
            "set up": "establish",
            "come up with": "develop",
            "put together": "prepare",
            "go over": "review",
            "talk about": "discuss"
        };

        Object.entries(professionalReplacements).forEach(([casual, professional]) => {
            const regex = new RegExp(`\\b${casual}\\b`, 'gi');
            enhanced = enhanced.replace(regex, professional);
        });

        return enhanced;
    }

    applyEducationalEnhancements(text) {
        let enhanced = this.applyFormalEnhancements(text);
        
        // Educational-specific language
        const educationalReplacements = {
            "college tomorrow are mandatory": "college attendance tomorrow is mandatory",
            "colleges are mandatory": "college attendance is mandatory",
            "students must come": "students must attend",
            "should come college": "should attend college",
            "we want students": "we request students",
            "students to attend college tomorrow": "students to mandatorily attend college tomorrow",
            "attend college tomorrow": "attend college tomorrow without fail",
            "compulsory attend": "mandatory attendance",
            "necessarily attend": "mandatorily attend"
        };

        Object.entries(educationalReplacements).forEach(([basic, enhanced_form]) => {
            const regex = new RegExp(`\\b${basic}\\b`, 'gi');
            enhanced = enhanced.replace(regex, enhanced_form);
        });

        // Add proper formal greetings for educational notices
        if (enhanced.toLowerCase().includes('students') && enhanced.toLowerCase().includes('college')) {
            if (!enhanced.toLowerCase().startsWith('dear')) {
                enhanced = 'Dear Students, ' + enhanced.charAt(0).toLowerCase() + enhanced.slice(1);
            }
        }

        return enhanced;
    }

    applyCasualEnhancements(text) {
        let enhanced = this.applyUniversalGrammarRules(text);
        
        // Keep contractions for casual tone
        const casualReplacements = {
            "will not": "won't",
            "cannot": "can't",
            "do not": "don't",
            "is not": "isn't",
            "are not": "aren't",
            "was not": "wasn't",
            "were not": "weren't",
            "has not": "hasn't",
            "have not": "haven't",
            "had not": "hadn't",
            "would not": "wouldn't",
            "should not": "shouldn't",
            "could not": "couldn't"
        };

        Object.entries(casualReplacements).forEach(([formal, casual]) => {
            const regex = new RegExp(`\\b${formal}\\b`, 'gi');
            enhanced = enhanced.replace(regex, casual);
        });

        return enhanced;
    }

    applyGeneralEnhancements(text) {
        let enhanced = text;
        
        // Apply comprehensive grammar corrections
        enhanced = this.applyUniversalGrammarRules(enhanced);
        enhanced = this.fixSentenceStructure(enhanced);
        enhanced = this.applyContextualCorrections(enhanced);
        enhanced = this.fixTeluguEnglishPatterns(enhanced);
        
        return enhanced;
    }

    // Universal grammar rules that apply to all contexts
    applyUniversalGrammarRules(text) {
        let corrected = text;

        // 1. CAPITALIZATION RULES
        corrected = corrected.replace(/\bi\b/g, 'I');
        corrected = corrected.replace(/^([a-z])/, (match) => match.toUpperCase());
        corrected = corrected.replace(/([.!?]\s*)([a-z])/g, (match, punct, letter) => punct + letter.toUpperCase());
        
        // 2. ARTICLE CORRECTIONS (a, an, the)
        corrected = corrected.replace(/\ba ([aeiouAEIOU])/g, 'an $1');
        corrected = corrected.replace(/\ban ([^aeiouAEIOU])/g, 'a $1');
        
        // 3. SUBJECT-VERB AGREEMENT
        corrected = corrected.replace(/\b(he|she|it) are\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} is`);
        corrected = corrected.replace(/\b(I|we|they) is\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} are`);
        corrected = corrected.replace(/\bstudents is\b/gi, 'students are');
        corrected = corrected.replace(/\bstudent are\b/gi, 'student is');
        
        // 4. MODAL VERB CORRECTIONS
        corrected = corrected.replace(/\bmust to\b/gi, 'must');
        corrected = corrected.replace(/\bshould to\b/gi, 'should');
        corrected = corrected.replace(/\bcan to\b/gi, 'can');
        corrected = corrected.replace(/\bwill to\b/gi, 'will');
        
        // 5. PREPOSITION CORRECTIONS
        corrected = corrected.replace(/\bdiscuss about\b/gi, 'discuss');
        corrected = corrected.replace(/\blisten music\b/gi, 'listen to music');
        corrected = corrected.replace(/\blistening music\b/gi, 'listening to music');
        corrected = corrected.replace(/\bmeet with\b/gi, 'meet');
        corrected = corrected.replace(/\breach to\b/gi, 'reach');
        corrected = corrected.replace(/\breturn back\b/gi, 'return');
        
        return corrected;
    }

    // Fix common Telugu-English translation patterns
    fixTeluguEnglishPatterns(text) {
        let corrected = text;
        
        // Common Telugu-English translation issues
        const teluguPatterns = {
            // Pronoun issues (Telugu doesn't distinguish gender)
            'our father': 'my father',
            'our mother': 'my mother',
            'our family': 'my family',
            'our house': 'my house',
            'our college': 'my college',
            
            // Formal language patterns
            'what is your good name': 'what is your name',
            'do the needful': 'please take the necessary action',
            'prepone': 'reschedule to an earlier time',
            'out of station': 'out of town',
            'your good self': 'you',
            'my good self': 'I',
            'revert back': 'reply',
            
            // Time expressions
            'today morning': 'this morning',
            'yesterday night': 'last night',
            'tomorrow morning': 'tomorrow morning',
            
            // Health expressions
            "don't have health": "am not feeling well",
            "health is not good": "am not feeling well",
            "health problem": "health issue",
            
            // Travel expressions
            'going in train': 'traveling by train',
            'coming in train': 'returning by train',
            'in train': 'on the train',
            'train lo': 'on the train',
            
            // Educational expressions
            'attending to college': 'attending college',
            'attend to college': 'attend college',
            'going to college': 'going to college',
            'coming from college': 'coming from college'
        };

        Object.entries(teluguPatterns).forEach(([pattern, correction]) => {
            const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
            corrected = corrected.replace(regex, correction);
        });

        return corrected;
    }

    fixSentenceStructure(text) {
        let corrected = text;

        // Fix word order issues
        corrected = corrected.replace(/\balways I\b/gi, 'I always');
        corrected = corrected.replace(/\busually I\b/gi, 'I usually');
        corrected = corrected.replace(/\bsometimes I\b/gi, 'I sometimes');
        corrected = corrected.replace(/\bnever I\b/gi, 'I never');
        
        // Fix question formation
        corrected = corrected.replace(/\bwhere you are\?/gi, 'where are you?');
        corrected = corrected.replace(/\bwhat you are doing\?/gi, 'what are you doing?');
        corrected = corrected.replace(/\bhow you are\?/gi, 'how are you?');
        
        // Fix conditional sentences
        corrected = corrected.replace(/\bif I will\b/gi, 'if I');
        corrected = corrected.replace(/\bif he will\b/gi, 'if he');
        corrected = corrected.replace(/\bif she will\b/gi, 'if she');
        
        return corrected;
    }

    applyContextualCorrections(text) {
        let corrected = text;
        
        // Detect educational context and apply specific corrections
        if (/\b(students|college|attend|examination|university)\b/gi.test(text)) {
            corrected = corrected.replace(/\bwe want\b/gi, 'we request');
            corrected = corrected.replace(/\bmust come college\b/gi, 'must attend college');
            corrected = corrected.replace(/\bshould come college\b/gi, 'should attend college');
            corrected = corrected.replace(/\bcolleges tomorrow are mandatory\b/gi, 'college attendance tomorrow is mandatory');
        }
        
        // Detect health context
        if (/\b(health|sick|doctor|medicine|hospital)\b/gi.test(text)) {
            corrected = corrected.replace(/\bdon't have health\b/gi, 'am not feeling well');
            corrected = corrected.replace(/\bhealth is not good\b/gi, 'am not feeling well');
        }
        
        // Detect business/professional context
        if (/\b(meeting|office|work|project|deadline)\b/gi.test(text)) {
            corrected = corrected.replace(/\bwe want\b/gi, 'we would like');
            corrected = corrected.replace(/\bplease do\b/gi, 'please');
        }
        
        return corrected;
    }

    preprocessText(text) {
        const isTeluguText = /[\u0C00-\u0C7F]/.test(text);
        
        if (isTeluguText) {
            return text
                .trim()
                .replace(/\s+/g, ' ')
                .replace(/([।.!?])\s*\1+/g, '$1')
                .replace(/\n+/g, ' ');
        }
        
        return text
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/([.!?])\s*\1+/g, '$1')
            .replace(/\n+/g, '. ');
    }

    splitIntoChunks(text, maxLength) {
        if (text.length <= maxLength) {
            return [text];
        }
        
        const chunks = [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        let currentChunk = '';
        
        for (const sentence of sentences) {
            const trimmed = sentence.trim();
            if (!trimmed) continue;
            
            if ((currentChunk + trimmed).length <= maxLength) {
                currentChunk += (currentChunk ? '. ' : '') + trimmed;
            } else {
                if (currentChunk) {
                    chunks.push(currentChunk + '.');
                }
                currentChunk = trimmed;
            }
        }
        
        if (currentChunk) {
            chunks.push(currentChunk + '.');
        }
        
        return chunks;
    }

    // Translation methods (same as original)
    async translateWithGoogleCloud(text) {
        try {
            const response = await fetch('/translate-cloud', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    source: 'te',
                    target: 'en'
                })
            });

            if (!response.ok) {
                throw new Error('Google Cloud API request failed');
            }

            const data = await response.json();
            
            if (data.translatedText && data.translatedText.trim()) {
                return data.translatedText.trim();
            } else {
                throw new Error('Empty translation from Google Cloud');
            }
        } catch (error) {
            throw new Error('Google Cloud Translation API failed');
        }
    }

    async translateWithGoogle(text) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=te&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error('Google Translate API failed');
        }

        const data = await response.json();
        
        if (data && data[0]) {
            let translatedText = '';
            for (const item of data[0]) {
                if (item && item[0]) {
                    translatedText += item[0];
                }
            }
            return translatedText;
        }
        
        throw new Error('Invalid response from Google Translate');
    }

    async translateWithMyMemory(text) {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=te|en`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('MyMemory API failed');
        }

        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData) {
            return data.responseData.translatedText;
        }
        
        throw new Error('Invalid response from MyMemory');
    }

    async translateWithLibreTranslate(text) {
        const url = 'https://libretranslate.de/translate';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: 'te',
                target: 'en',
                format: 'text'
            })
        });

        if (!response.ok) {
            throw new Error('LibreTranslate API failed');
        }

        const data = await response.json();
        
        if (data && data.translatedText) {
            return data.translatedText;
        }
        
        throw new Error('Invalid response from LibreTranslate');
    }
}