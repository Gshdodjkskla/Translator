class PerfectTranslator {
    constructor() {
        this.translationMethods = [
            this.translateWithGoogleCloud.bind(this),
            this.translateWithGoogle.bind(this),
            this.translateWithMyMemory.bind(this),
            this.translateWithLibreTranslate.bind(this)
        ];
    }

    // New Two-Stage Translation System
    async translateText(text) {
        if (!text || !text.trim()) {
            throw new Error('No text to translate');
        }

        // STAGE 1: Get raw meaningful translation
        const rawTranslation = await this.getRawTranslation(text);
        
        // STAGE 2: Enhance to professional level
        const enhancedTranslation = this.enhanceTranslation(rawTranslation);
        
        return {
            raw: rawTranslation,
            enhanced: enhancedTranslation
        };
    }

    // STAGE 1: Raw Translation (Telugu → Complete Meaningful English)
    async getRawTranslation(text) {
        const cleanedText = this.preprocessText(text);
        
        const chunks = this.splitIntoChunks(cleanedText, 1500);
        const translatedChunks = [];
        
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            let translated = null;
            
            if (chunks.length > 5) {
                console.log(`🔄 Raw Translation: Processing chunk ${i + 1}/${chunks.length}...`);
            }
            
            for (const method of this.translationMethods) {
                try {
                    const result = await method(chunk);
                    if (result && result.trim() && result.trim() !== chunk) {
                        translated = result;
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
        
        // Make the raw translation complete and meaningful (but not fully polished)
        return this.makeRawTranslationComplete(basicTranslation);
    }

    // Make raw translation basic and literal (minimal processing)
    makeRawTranslationComplete(text) {
        let basic = text;

        // MINIMAL processing - only fix critical issues for readability
        basic = basic.replace(/\bi\b/g, 'I');
        basic = basic.replace(/^([a-z])/, (match) => match.toUpperCase());
        
        // Only fix obvious Telugu-English pronoun issues
        basic = basic.replace(/\bour college\b/gi, 'my college');
        basic = basic.replace(/\bour father\b/gi, 'my father');
        basic = basic.replace(/\bour mother\b/gi, 'my mother');
        
        // Fix only the most basic time expressions
        basic = basic.replace(/\btoday morning\b/gi, 'this morning');
        basic = basic.replace(/\byesterday night\b/gi, 'last night');
        
        // Ensure sentence ending
        if (basic && !basic.match(/[.!?]$/)) {
            basic += '.';
        }

        return basic.trim();
    }

    // Remove these methods since raw translation should be minimal

    // STAGE 2: Enhanced Translation (Raw English → Professional Polish)
    enhanceTranslation(rawText) {
        console.log('✨ Stage 2: Professional Enhancement Starting...');
        
        let enhanced = rawText;

        // Step 1: Perfect grammar and syntax
        enhanced = this.perfectGrammarAndSyntax(enhanced);
        
        // Step 2: Add contextual meaning and completeness
        enhanced = this.addContextualCompleteness(enhanced);
        
        // Step 3: Apply professional vocabulary
        enhanced = this.applyProfessionalVocabulary(enhanced);
        
        // Step 4: Enhance sentence structure
        enhanced = this.enhanceSentenceStructure(enhanced);
        
        // Step 5: Apply context-specific professional enhancements
        enhanced = this.applyContextualEnhancements(enhanced);
        
        // Step 6: Final professional polish with formal language
        enhanced = this.finalProfessionalPolish(enhanced);

        console.log('✅ Stage 2: Professional Enhancement Completed');
        return enhanced;
    }

    // Add contextual completeness for Stage 2
    addContextualCompleteness(text) {
        let contextual = text;

        // Educational/Examination context completeness
        if (/\b(b\.?tech|semester|examination|exams|college|university|first year|second year|third year|fourth year)\b/gi.test(text)) {
            
            // Handle semester/exam announcements
            if (/\b(semester|exams?)\s+(?:from\s+)?tomorrow\b/gi.test(contextual)) {
                contextual = contextual.replace(/\bb\.?tech\s+first\s+year\s+semester\s+from\s+tomorrow/gi, 
                    'B.Tech first year semester examinations will commence from tomorrow');
                contextual = contextual.replace(/\bsemester\s+from\s+tomorrow/gi, 
                    'semester examinations will commence from tomorrow');
                contextual = contextual.replace(/\bexams?\s+from\s+tomorrow/gi, 
                    'examinations will commence from tomorrow');
            }
            
            // Add context for incomplete semester mentions
            if (/\bb\.?tech.*semester\.?$/gi.test(contextual) && !/examination|exam|commence|start/gi.test(contextual)) {
                contextual = contextual.replace(/\bb\.?tech\s+first\s+year\s+semester\.?$/gi, 
                    'B.Tech first year semester examinations are scheduled');
            }
            
            // General educational enhancements
            contextual = contextual.replace(/\bstudents\b/gi, 'all students');
            contextual = contextual.replace(/\battend college tomorrow\b/gi, 'attend college tomorrow without fail');
            contextual = contextual.replace(/\bcollege tomorrow mandatory\b/gi, 'college attendance tomorrow is mandatory');
            contextual = contextual.replace(/\bwe want students\b/gi, 'we respectfully request all students');
            contextual = contextual.replace(/\bstudents should attend\b/gi, 'all students are required to attend');
        }

        // Health context completeness
        if (/\bhealth|sick|not well\b/gi.test(text)) {
            contextual = contextual.replace(/\bdon't have health\b/gi, 'am not feeling well');
            contextual = contextual.replace(/\bhealth is not good\b/gi, 'am not feeling well');
            contextual = contextual.replace(/\bhealth problem\b/gi, 'health concerns');
        }

        // Professional context completeness
        contextual = contextual.replace(/\bgoing to office\b/gi, 'proceeding to the office');
        contextual = contextual.replace(/\bcoming from office\b/gi, 'returning from office premises');
        contextual = contextual.replace(/\bgoing to college\b/gi, 'attending college');
        contextual = contextual.replace(/\bgoing in bus\b/gi, 'traveling by bus');
        contextual = contextual.replace(/\bcoming in train\b/gi, 'returning by train');

        return contextual;
    }

    perfectGrammarAndSyntax(text) {
        let perfected = text;

        // Advanced grammar corrections
        perfected = this.applyUniversalGrammarRules(perfected);
        perfected = this.fixSentenceStructure(perfected);
        
        // Perfect tense usage
        perfected = perfected.replace(/\b(I|we|they) are having\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} have`);
        perfected = perfected.replace(/\b(he|she|it) is having\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} has`);
        
        return perfected;
    }

    applyProfessionalVocabulary(text) {
        let professional = text;

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
            'think about': 'consider',
            'talk about': 'discuss',
            'come to': 'attend',
            'go to': 'proceed to',
            'should attend': 'are required to attend',
            'must attend': 'are obligated to attend',
            'need to': 'are required to',
            'have to': 'are obligated to',
            'want to': 'intend to',
            'going to': 'will',
            'start': 'commence',
            'begin': 'commence',
            'end': 'conclude',
            'finish': 'complete',
            'make': 'create',
            'do': 'perform',
            'show': 'demonstrate',
            'use': 'utilize'
        };

        Object.entries(professionalVocab).forEach(([simple, prof]) => {
            const regex = new RegExp(`\\b${simple}\\b`, 'gi');
            professional = professional.replace(regex, prof);
        });

        return professional;
    }

    enhanceSentenceStructure(text) {
        let enhanced = text;

        // Make sentences more sophisticated and formal
        enhanced = enhanced.replace(/\bWe want (.+) to (.+)\b/gi, 'We respectfully request $1 to $2');
        enhanced = enhanced.replace(/\bWe need (.+) to (.+)\b/gi, 'We require $1 to $2');
        enhanced = enhanced.replace(/\bWe have (.+)\b/gi, 'We have accordingly $1');
        enhanced = enhanced.replace(/\bYou must (.+)\b/gi, 'You are required to $1');
        enhanced = enhanced.replace(/\bYou should (.+)\b/gi, 'You are expected to $1');
        enhanced = enhanced.replace(/\bStudents should (.+)\b/gi, 'All students are required to $1');
        enhanced = enhanced.replace(/\bEveryone should (.+)\b/gi, 'All individuals are expected to $1');
        
        // Improve connectors and transitions
        enhanced = enhanced.replace(/\bAnd (.+)\b/gi, 'Additionally, $1');
        enhanced = enhanced.replace(/\bBut (.+)\b/gi, 'However, $1');
        enhanced = enhanced.replace(/\bSo (.+)\b/gi, 'Therefore, $1');
        enhanced = enhanced.replace(/\bAlso (.+)\b/gi, 'Furthermore, $1');
        
        // Make more formal statements
        enhanced = enhanced.replace(/\bNo one should worry\b/gi, 'There is no cause for concern');
        enhanced = enhanced.replace(/\bDon\'t worry\b/gi, 'There is no cause for concern');
        enhanced = enhanced.replace(/\bIt is very important\b/gi, 'It is imperative');
        enhanced = enhanced.replace(/\bIt is important\b/gi, 'It is essential');
        
        return enhanced;
    }

    applyContextualEnhancements(text) {
        let enhanced = text;

        // Educational/Examination context enhancements - MORE AGGRESSIVE
        if (/\b(students|college|attend|examination|b\.?tech|semester|exams?|university|first year)\b/gi.test(text)) {
            enhanced = enhanced.replace(/\brequest all students\b/gi, 'respectfully request all students');
            enhanced = enhanced.replace(/\battend college tomorrow without fail\b/gi, 'mandatorily attend college tomorrow');
            enhanced = enhanced.replace(/\bmandatory for everyone\b/gi, 'mandatory for all concerned students');
            
            // Specific enhancements for semester/exam context
            enhanced = enhanced.replace(/\bb\.?tech\s+first\s+year\s+semester\s+examinations\s+will\s+commence\s+from\s+tomorrow/gi, 
                'B.Tech first year semester examinations are scheduled to commence from tomorrow');
            enhanced = enhanced.replace(/\bfrom\s+tomorrow\b/gi, 'commencing tomorrow');
            enhanced = enhanced.replace(/\bwill\s+commence/gi, 'are scheduled to commence');
            enhanced = enhanced.replace(/\bwill\s+start/gi, 'are scheduled to begin');
        }

        // Professional context enhancements
        if (/\b(office|work|meeting|project)\b/gi.test(text)) {
            enhanced = enhanced.replace(/\bgoing to the office\b/gi, 'proceeding to the office');
            enhanced = enhanced.replace(/\breturning from the office\b/gi, 'returning from office premises');
        }

        return enhanced;
    }

    finalProfessionalPolish(text) {
        let polished = text;

        // Expand contractions for formal tone
        const contractionExpansions = {
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
            "mustn't": "must not"
        };

        Object.entries(contractionExpansions).forEach(([contraction, expansion]) => {
            const regex = new RegExp(`\\b${contraction}\\b`, 'gi');
            polished = polished.replace(regex, expansion);
        });

        // AGGRESSIVE ENHANCEMENT: Add formal context for educational content
        if (/\b(b\.?tech|semester|examination|exams?|college|university|students|first year|second year)\b/gi.test(polished)) {
            
            // If it's a simple semester announcement, make it formal
            if (/\bb\.?tech.*semester.*(?:commence|tomorrow|scheduled)/gi.test(polished) && !/dear students/gi.test(polished)) {
                polished = 'Dear Students,\n\n' + polished + '\n\nAll students are requested to be prepared accordingly.\n\nBest regards,\nThe Academic Office';
            }
            // If it mentions students or examinations, add formal structure
            else if (/students.*(?:attend|examination|college)/gi.test(polished) && !/dear students/gi.test(polished)) {
                polished = 'Dear Students,\n\n' + polished + '\n\nWe appreciate your attention to this matter.\n\nBest regards,\nThe Administration';
            }
            // For short exam-related content, expand it
            else if (polished.length < 100 && /\b(semester|exam|b\.?tech)\b/gi.test(polished)) {
                if (!/dear|notice|announcement/gi.test(polished)) {
                    polished = 'Academic Notice:\n\n' + polished + '\n\nFor further details, please contact the academic office.';
                }
            }
        }
        
        // Ensure proper sentence endings
        if (polished && !polished.match(/[.!?]$/)) {
            polished += '.';
        }
        
        // Professional language refinements - MORE AGGRESSIVE
        polished = polished.replace(/\bWe wish everyone the best\b/gi, 'We extend our best wishes to all students');
        polished = polished.replace(/\bmade arrangements\b/gi, 'have made comprehensive arrangements');
        polished = polished.replace(/\ball the facilities\b/gi, 'all necessary facilities');
        polished = polished.replace(/\bimmediately after\b/gi, 'promptly following');
        polished = polished.replace(/\bshould not forget\b/gi, 'must remember to bring');
        polished = polished.replace(/\bfrom tomorrow\b/gi, 'commencing tomorrow');
        polished = polished.replace(/\bwill start\b/gi, 'will commence');
        polished = polished.replace(/\bwill begin\b/gi, 'will commence');
        
        return polished.trim();
    }

    // Legacy method for backward compatibility
    async translateTextLegacy(text) {
        const result = await this.translateText(text);
        return result.enhanced; // Return only enhanced version for backward compatibility
    }

    async translateBulkLines(lines) {
        // Special method for translating multiple lines efficiently
        if (!Array.isArray(lines)) {
            throw new Error('Input must be an array of lines');
        }
        
        const results = [];
        const batchSize = 5; // Process 5 lines at a time
        
        for (let i = 0; i < lines.length; i += batchSize) {
            const batch = lines.slice(i, i + batchSize);
            const batchPromises = batch.map(async (line, index) => {
                try {
                    const result = await this.translateText(line);
                    return { index: i + index, original: line, translation: result };
                } catch (error) {
                    return { index: i + index, original: line, error: error.message };
                }
            });
            
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
            
            // Progress indication
            console.log(`Processed ${Math.min(i + batchSize, lines.length)}/${lines.length} lines`);
            
            // Rate limiting
            if (i + batchSize < lines.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        
        return results;
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

    preprocessText(text) {
        // Check if this is Telugu text
        const isTeluguText = /[\u0C00-\u0C7F]/.test(text);
        
        if (isTeluguText) {
            // For Telugu text, minimal preprocessing to preserve characters
            return text
                .trim()
                .replace(/\s+/g, ' ')
                .replace(/([।.!?])\s*\1+/g, '$1') // Handle Telugu punctuation too
                .replace(/\n+/g, ' '); // Convert newlines to spaces for Telugu
        }
        
        // Original preprocessing for English text
        return text
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/([.!?])\s*\1+/g, '$1')
            .replace(/\n+/g, '. '); // Convert newlines to sentence breaks
    }

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
                console.log('Google Cloud Translation successful:', data.translatedText);
                // Return the translation exactly as received from Google Cloud
                return data.translatedText.trim();
            } else {
                throw new Error('Empty translation from Google Cloud');
            }
        } catch (error) {
            console.error('Google Cloud Translation failed:', error);
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

    postprocessTranslation(text) {
        // First apply basic grammar correction
        let corrected = this.perfectGrammarCorrection(text);
        
        // Only apply educational/formal corrections if it's actually formal context
        if (/\b(students|college|attend|request|tomorrow|dear|we request)\b/gi.test(text)) {
            corrected = this.fixEducationalLanguage(corrected);
        }
        
        return corrected;
    }

    fixEducationalLanguage(text) {
        let corrected = text;
        
        // Fix educational institution language
        const educationalFixes = {
            'students, colleges tomorrow are mandatory': 'Dear Students, college attendance tomorrow is mandatory',
            'students, college tomorrow are mandatory': 'Dear Students, college attendance tomorrow is mandatory',
            'students colleges are mandatory': 'Dear Students, college attendance is mandatory',
            'we want to be based': 'we request your attendance',
            'we request to be based': 'we request your attendance',
            'based we request': 'we request',
            'we want based': 'we request',
            'it is based': 'it is requested',
            'based on this': 'therefore',
            'colleges tomorrow mandatory': 'college attendance tomorrow is mandatory',
            'tomorrow colleges mandatory': 'tomorrow, college attendance is mandatory',
            'attendance tomorrow mandatory': 'attendance tomorrow is mandatory',
            'college tomorrow compulsory': 'college attendance tomorrow is compulsory',
            'tomorrow college compulsory': 'tomorrow, college attendance is compulsory'
        };

        Object.entries(educationalFixes).forEach(([wrong, correct]) => {
            const regex = new RegExp(`\\b${wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            corrected = corrected.replace(regex, correct);
        });
        
        // Fix formal endings for principal communications
        corrected = corrected.replace(/\bwe are requesting\./gi, 'we request your cooperation.');
        corrected = corrected.replace(/\bwe request\./gi, 'we request your cooperation.');
        corrected = corrected.replace(/\bkindly attend\./gi, 'kindly ensure your attendance.');
        
        // Ensure proper formal greeting
        if (corrected.toLowerCase().startsWith('students,')) {
            corrected = corrected.replace(/^students,/i, 'Dear Students,');
        }
        
        return corrected;
    }

    perfectGrammarCorrection(text) {
        let corrected = text;

        // Check if this is a narrative/story context - be very conservative
        const isNarrative = /\b(I|my|went|came|met|friend|father|mother|brother|sister|spent|bought|did|said|told)\b/gi.test(text);
        
        if (isNarrative) {
            // For narratives, only apply basic grammar rules
            corrected = this.applyBasicGrammarRules(corrected);
        } else {
            // For formal/business contexts, apply comprehensive rules
            corrected = this.applyUniversalGrammarRules(corrected);
            corrected = this.fixSentenceStructure(corrected);
            corrected = this.applyContextualCorrections(corrected);
        }
        
        return corrected.trim();
    }

    applyBasicGrammarRules(text) {
        let corrected = text;

        // Only the most basic grammar corrections for narratives
        corrected = corrected.replace(/\bi\b/g, 'I');
        corrected = corrected.replace(/^([a-z])/, (match) => match.toUpperCase());
        corrected = corrected.replace(/([.!?]\s*)([a-z])/g, (match, punct, letter) => punct + letter.toUpperCase());
        
        // Basic punctuation cleanup
        corrected = corrected.replace(/\s+/g, ' ');
        corrected = corrected.replace(/\s+([.!?])/g, '$1');
        
        // Ensure proper sentence ending
        if (corrected && !corrected.match(/[.!?]$/)) {
            corrected += '.';
        }

        return corrected;
    }

    applyUniversalGrammarRules(text) {
        let corrected = text;

        // 1. CAPITALIZATION RULES
        corrected = corrected.replace(/\bi\b/g, 'I');
        corrected = corrected.replace(/^([a-z])/, (match) => match.toUpperCase());
        corrected = corrected.replace(/([.!?]\s*)([a-z])/g, (match, punct, letter) => punct + letter.toUpperCase());
        
        // 2. ARTICLE CORRECTIONS (a, an, the)
        corrected = corrected.replace(/\ba ([aeiouAEIOU])/g, 'an $1');
        corrected = corrected.replace(/\ban ([^aeiouAEIOU])/g, 'a $1');
        corrected = corrected.replace(/\bgoing to college\b/g, 'going to college');
        corrected = corrected.replace(/\bgoing to office\b/g, 'going to the office');
        corrected = corrected.replace(/\bgoing to school\b/g, 'going to school');
        corrected = corrected.replace(/\bin morning\b/g, 'in the morning');
        corrected = corrected.replace(/\bin evening\b/g, 'in the evening');
        corrected = corrected.replace(/\bin afternoon\b/g, 'in the afternoon');
        corrected = corrected.replace(/\bat night\b/g, 'at night');
        
        // 3. VERB TENSE CORRECTIONS
        corrected = corrected.replace(/\b(I|we|they) are having\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} have`);
        corrected = corrected.replace(/\b(he|she|it) is having\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} has`);
        corrected = corrected.replace(/\b(I|we|they) were having\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} had`);
        corrected = corrected.replace(/\b(he|she|it) was having\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} had`);
        
        // 4. SUBJECT-VERB AGREEMENT
        corrected = corrected.replace(/\b(he|she|it) are\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} is`);
        corrected = corrected.replace(/\b(I|we|they) is\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} are`);
        corrected = corrected.replace(/\bstudents is\b/gi, 'students are');
        corrected = corrected.replace(/\bstudent are\b/gi, 'student is');
        
        // 5. MODAL VERB CORRECTIONS
        corrected = corrected.replace(/\bmust to\b/gi, 'must');
        corrected = corrected.replace(/\bshould to\b/gi, 'should');
        corrected = corrected.replace(/\bcan to\b/gi, 'can');
        corrected = corrected.replace(/\bwill to\b/gi, 'will');
        
        return corrected;
    }

    fixSentenceStructure(text) {
        let corrected = text;

        // 1. FIX DOUBLE NEGATIVES
        corrected = corrected.replace(/\bdon't have no\b/gi, "don't have any");
        corrected = corrected.replace(/\bcan't do nothing\b/gi, "can't do anything");
        corrected = corrected.replace(/\bwon't go nowhere\b/gi, "won't go anywhere");
        
        // 2. FIX WORD ORDER
        corrected = corrected.replace(/\balways I\b/gi, 'I always');
        corrected = corrected.replace(/\busually I\b/gi, 'I usually');
        corrected = corrected.replace(/\bsometimes I\b/gi, 'I sometimes');
        corrected = corrected.replace(/\bnever I\b/gi, 'I never');
        
        // 3. FIX QUESTION FORMATION
        corrected = corrected.replace(/\bwhere you are\?/gi, 'where are you?');
        corrected = corrected.replace(/\bwhat you are doing\?/gi, 'what are you doing?');
        corrected = corrected.replace(/\bhow you are\?/gi, 'how are you?');
        
        // 4. FIX CONDITIONAL SENTENCES
        corrected = corrected.replace(/\bif I will\b/gi, 'if I');
        corrected = corrected.replace(/\bif he will\b/gi, 'if he');
        corrected = corrected.replace(/\bif she will\b/gi, 'if she');
        
        return corrected;
    }

    applyContextualCorrections(text) {
        let corrected = text;
        // COMPREHENSIVE CONTEXT-BASED CORRECTIONS
        
        // Educational Context
        corrected = corrected.replace(/\bwe want students to attend\b/gi, 'we request students to attend');
        corrected = corrected.replace(/\bwe want students to\b/gi, 'we request students to');
        corrected = corrected.replace(/\bstudents to attend college tomorrow\b/gi, 'students to mandatorily attend college tomorrow');
        corrected = corrected.replace(/\bmust attend college tomorrow\b/gi, 'must attend college tomorrow');
        
        // Business/Professional Context
        corrected = corrected.replace(/\bwe want to inform\b/gi, 'we would like to inform');
        corrected = corrected.replace(/\bwe want to request\b/gi, 'we would like to request');
        corrected = corrected.replace(/\bkindly do\b/gi, 'kindly');
        
        // Formal Request Language
        corrected = corrected.replace(/\bwe want (.+) to (.+)\b/gi, 'we request $1 to $2');
        corrected = corrected.replace(/\bwant that (.+) should\b/gi, 'request that $1 should');
        corrected = corrected.replace(/\bwant (.+) should\b/gi, 'request $1 to');
        
        // Enhanced Telugu-English pronoun corrections
        const pronounReplacements = {
            'our girlfriend': 'my girlfriend',
            'our boyfriend': 'my boyfriend',
            'our wife': 'my wife',
            'our husband': 'my husband',
            'our father': 'my father',
            'our mother': 'my mother',
            'our dad': 'my dad',
            'our mom': 'my mom',
            'our family': 'my family',
            'our friends': 'my friends',
            'our brother': 'my brother',
            'our sister': 'my sister',
            'our son': 'my son',
            'our daughter': 'my daughter',
            'our children': 'my children',
            'our house': 'my house',
            'our home': 'my home',
            'our car': 'my car',
            'our phone': 'my phone',
            'our job': 'my job',
            'our work': 'my work',
            'our school': 'my school',
            'our college': 'my college'
        };

        Object.entries(pronounReplacements).forEach(([wrong, correct]) => {
            const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
            corrected = corrected.replace(regex, correct);
        });
        
        // Fix mixed pronouns in complex sentences
        corrected = corrected.replace(/\bI (went|came|did|was|am|have|had)([^.]*?)\b(he|she|they) (went|came|did|was|were|have|had)/gi, (match, verb1, middle, pronoun, verb2) => {
            return `I ${verb1}${middle}I ${verb2}`;
        });
        
        // Fix pronoun inconsistencies in travel contexts
        corrected = corrected.replace(/go slowly as they meet/gi, 'travel slowly together');
        corrected = corrected.replace(/as they meet on/gi, 'together on');
        corrected = corrected.replace(/when they meet/gi, 'when you meet');
        corrected = corrected.replace(/\bthey meet\b/gi, 'you meet');

        // Fix verb consistency and sentence flow
        corrected = corrected.replace(/\bI went out with my friends\.\s*Then I went out with my/gi, 'I went out with my friends, then with my');
        corrected = corrected.replace(/\bI was shopping.*?my father.*?shopping mall/gi, 'My father and I went shopping at the mall');
        
        // Fix shopping and activity patterns
        corrected = corrected.replace(/\bshopping mall.*?shopping/gi, 'shopping mall to shop');
        corrected = corrected.replace(/\bwent.*?shopping.*?shopping/gi, 'went shopping');
        corrected = corrected.replace(/\bto shopping mall\b/gi, 'to the shopping mall');
        corrected = corrected.replace(/\bat shopping mall\b/gi, 'at the shopping mall');
        corrected = corrected.replace(/\bwent to shopping\b/gi, 'went shopping');
        corrected = corrected.replace(/\bwent for shopping\b/gi, 'went shopping');
        
        // Fix thought and feeling patterns
        corrected = corrected.replace(/\bthought of (our|my) friends\b/gi, 'thought about my friends');
        corrected = corrected.replace(/\bthinking of\b/gi, 'thinking about');
        corrected = corrected.replace(/\bfeeling of\b/gi, 'feeling about');
        
        // Enhanced Telugu-English translation fixes
        const teluguEnglishFixes = {
            'what is your good name': 'what is your name',
            'do the needful': 'please take the necessary action',
            'prepone': 'reschedule to an earlier time',
            'out of station': 'out of town',
            'good morning to all': 'good morning everyone',
            'your good self': 'you',
            'my good self': 'I',
            'revert back': 'reply',
            'off day': 'day off',
            'today morning': 'this morning',
            'yesterday night': 'last night',
            'tomorrow morning': 'tomorrow morning',
            'listening music': 'listening to music',
            'going to office': 'going to the office',
            'coming from office': 'coming from the office',
            'going to school': 'going to school',
            'coming from school': 'coming from school',
            'going to home': 'going home',
            'coming to home': 'coming home',
            'reached to home': 'reached home',
            'reached to office': 'reached the office',
            'reached to school': 'reached school',
            "i don't have health": "I'm not feeling well",
            "i don't have good health": "I'm not feeling well",
            "my health is not good": "I'm not feeling well",
            "health is not good": "not feeling well",
            "health is bad": "not feeling well",
            "don't have health": "not feeling well",
            "no health": "not feeling well",
            "health problem": "health issue",
            "body is not well": "not feeling well",
            "i am not well": "I'm not feeling well",
            'in train': 'on the train',
            'by train': 'by train',
            'train lo': 'on the train',
            'bus lo': 'on the bus',
            'going in train': 'traveling by train',
            'coming in train': 'coming by train',
            'andhra train': 'Andhra train',
            'go slowly as they meet': 'travel slowly together',
            'meet in train': 'meet on the train',
            'students students all': 'all students',
            'student students': 'students',
            'all students students': 'all students',
            'attending to college': 'attending college',
            'attend to college': 'attend college',
            'come to college': 'come to college',
            'should attend': 'should attend',
            'must attend': 'must attend',
            'we are requesting that': 'we request that',
            'we are requesting all': 'we request all',
            'should attend college': 'should attend college',
            'attend the college': 'attend college',
            'to the college': 'to college',
            'colleges tomorrow are mandatory': 'college attendance tomorrow is mandatory',
            'college tomorrow are mandatory': 'college attendance tomorrow is mandatory',
            'colleges are mandatory': 'college attendance is mandatory',
            'we want to be based': 'we request your attendance',
            'we request to be based': 'we request your attendance',
            'based we request': 'we request',
            'colleges tomorrow mandatory': 'college attendance tomorrow is mandatory',
            'tomorrow colleges mandatory': 'tomorrow college attendance is mandatory',
            'college tomorrow mandatory': 'tomorrow college attendance is mandatory',
            'attendance is necessary': 'attendance is required',
            'attendance is essential': 'attendance is required',
            'compulsory attendance': 'mandatory attendance',
            'must come college': 'must attend college',
            'should come college': 'should attend college',
            'we want students': 'we request students',
            'want students to attend': 'request students to attend',
            'students to attend college tomorrow': 'students to mandatorily attend college tomorrow',
            'attend college tomorrow': 'attend college tomorrow without fail',
            'compulsory attend': 'mandatory attendance',
            'necessarily attend': 'mandatorily attend',
            'must come college': 'must attend college',
            'should come college': 'should attend college',
            'want that students': 'request that students',
            'asking students': 'requesting students',
            'telling students': 'informing students'
        };

        Object.entries(teluguEnglishFixes).forEach(([wrong, correct]) => {
            const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
            corrected = corrected.replace(regex, correct);
        });

        // Fix verb tenses comprehensively
        corrected = corrected.replace(/\b(I|we|they) are having\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} have`);
        corrected = corrected.replace(/\b(he|she) is having\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} has`);
        corrected = corrected.replace(/\b(I|we|they) were having\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} had`);
        corrected = corrected.replace(/\b(he|she) was having\b/gi, (match, pronoun) => `${pronoun.toLowerCase()} had`);

        // Fix prepositions comprehensively
        const prepositionFixes = {
            'discuss about': 'discuss',
            'married to': 'married',
            'angry on': 'angry with',
            'angry upon': 'angry with',
            'good in': 'good at',
            'weak in': 'weak at',
            'interested on': 'interested in',
            'depend on': 'depend on',
            'depends on': 'depends on',
            'based on': 'based on',
            'focus on': 'focus on',
            'listen music': 'listen to music',
            'listening music': 'listening to music',
            'waiting for you': 'waiting for you',
            'waiting you': 'waiting for you',
            'belonging to': 'belonging to',
            'belonging for': 'belonging to',
            'suffering from': 'suffering from',
            'suffering with': 'suffering from',
            'consist of': 'consist of',
            'consist with': 'consist of',
            'different from': 'different from',
            'different than': 'different from',
            'similar to': 'similar to',
            'similar with': 'similar to',
            'married with': 'married to',
            'meet with': 'meet',
            'reach to': 'reach',
            'return back': 'return',
            'reply back': 'reply'
        };

        Object.entries(prepositionFixes).forEach(([wrong, correct]) => {
            const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
            corrected = corrected.replace(regex, correct);
        });

        // Fix articles comprehensively
        corrected = corrected.replace(/\bin the morning\b/gi, 'in the morning');
        corrected = corrected.replace(/\bin the evening\b/gi, 'in the evening');
        corrected = corrected.replace(/\bin the night\b/gi, 'at night');
        corrected = corrected.replace(/\bin the afternoon\b/gi, 'in the afternoon');

        // Fix contractions and expand them for formal contexts
        const contractions = {
            'wont': "won't",
            'cant': "can't",
            'dont': "don't",
            'isnt': "isn't",
            'arent': "aren't",
            'wasnt': "wasn't",
            'werent': "weren't",
            'hasnt': "hasn't",
            'havent': "haven't",
            'hadnt': "hadn't",
            'wouldnt': "wouldn't",
            'shouldnt': "shouldn't",
            'couldnt': "couldn't",
            'mustnt': "mustn't",
            'neednt': "needn't",
            'dared not': "daren't",
            'will not': "won't",
            'cannot': "can't",
            'shall not': "shan't",
            // For formal contexts, expand contractions
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
            "mustn't": "must not"
        };

        Object.entries(contractions).forEach(([wrong, correct]) => {
            const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
            corrected = corrected.replace(regex, correct);
        });

        // Fix health-related expressions
        corrected = corrected.replace(/because I don'?t have health/gi, "because I'm not feeling well");
        corrected = corrected.replace(/because my health is not good/gi, "because I'm not feeling well");
        corrected = corrected.replace(/because health is not good/gi, "because I'm not feeling well");
        corrected = corrected.replace(/because of health problem/gi, "because of health issues");
        corrected = corrected.replace(/due to health problem/gi, "due to health issues");
        
        // Fix college/school related expressions
        corrected = corrected.replace(/going to college/gi, "going to college");
        corrected = corrected.replace(/not going to college/gi, "not going to college");
        corrected = corrected.replace(/will not go to college/gi, "won't go to college");
        
        // Fix travel and transportation expressions
        corrected = corrected.replace(/go slowly as they meet on the/gi, "travel slowly together on the");
        corrected = corrected.replace(/go slowly as they meet/gi, "travel slowly together");
        corrected = corrected.replace(/slowly as they meet/gi, "slowly together");
        corrected = corrected.replace(/on the (.+) train/gi, "on the $1 train");
        
        // Fix context-specific issues
        corrected = corrected.replace(/\bas they meet on\b/gi, "together on");
        corrected = corrected.replace(/\bwhen meeting on\b/gi, "together on");
        
        // Fix student/college related issues
        corrected = corrected.replace(/\bstudents students all\b/gi, "all students");
        corrected = corrected.replace(/\ball students students\b/gi, "all students");
        corrected = corrected.replace(/\bstudent students\b/gi, "students");
        corrected = corrected.replace(/\battending to college\b/gi, "attending college");
        corrected = corrected.replace(/\battend to college\b/gi, "attend college");
        
        // Fix formal request language
        corrected = corrected.replace(/\bwe are requesting that all\b/gi, "we request that all");
        corrected = corrected.replace(/\bwe are requesting all\b/gi, "we request all");
        corrected = corrected.replace(/\brequesting that (.+) should\b/gi, "requesting that $1");
        
        // Fix redundant words
        corrected = corrected.replace(/\b(\w+)\s+\1\b/gi, '$1'); // Remove immediate word repetitions
        
        // Fix educational/formal language issues
        corrected = corrected.replace(/\bcolleges tomorrow are mandatory\b/gi, 'college attendance tomorrow is mandatory');
        corrected = corrected.replace(/\bcollege tomorrow are mandatory\b/gi, 'college attendance tomorrow is mandatory');
        corrected = corrected.replace(/\bcolleges are mandatory\b/gi, 'college attendance is mandatory');
        corrected = corrected.replace(/\bwe want to be based\b/gi, 'we request your attendance');
        corrected = corrected.replace(/\bwe request to be based\b/gi, 'we request your attendance');
        corrected = corrected.replace(/\bbased we request\b/gi, 'we request');
        corrected = corrected.replace(/\bwe want based\b/gi, 'we request');
        
        // Fix sentence structure for formal notices
        corrected = corrected.replace(/^students,\s*/gi, 'Dear Students, ');
        corrected = corrected.replace(/\btomorrow colleges\b/gi, 'tomorrow, college attendance');
        corrected = corrected.replace(/\bcolleges tomorrow\b/gi, 'college attendance tomorrow');
        
        // Fix formal request endings
        corrected = corrected.replace(/\bwe are requesting\b/gi, 'we request');
        corrected = corrected.replace(/\bwe want that\b/gi, 'we request that');
        corrected = corrected.replace(/\bit is requested that\b/gi, 'we request that');
        
        // Fix sentence structure and flow
        corrected = corrected.replace(/\bI went.*?I went.*?I went/gi, (match) => {
            const parts = match.split(/\bI went/);
            return parts[0] + 'I went' + parts[1].replace(/\bI went/g, ', then I went') + parts[2];
        });

        // FINAL COMPREHENSIVE CLEANUP
        
        // 1. Remove redundant words and phrases
        corrected = corrected.replace(/\b(\w+)\s+\1\b/gi, '$1'); // Remove word repetitions
        corrected = corrected.replace(/\bvery very\b/gi, 'very');
        corrected = corrected.replace(/\bmore and more\b/gi, 'increasingly');
        
        // 2. Fix spacing and punctuation
        corrected = corrected.replace(/\s+/g, ' ');
        corrected = corrected.replace(/\.\s*\./g, '.');
        corrected = corrected.replace(/,\s*,/g, ',');
        corrected = corrected.replace(/\s+([.!?])/g, '$1');
        corrected = corrected.replace(/([.!?])\s*([.!?])/g, '$1');
        
        // 3. Fix capitalization after punctuation
        corrected = corrected.replace(/([.!?])\s*([a-z])/g, (match, punct, letter) => punct + ' ' + letter.toUpperCase());
        
        // 4. Detect and fix context-specific issues
        corrected = this.detectAndFixContext(corrected);
        
        // 5. Ensure proper sentence ending
        if (corrected && !corrected.match(/[.!?]$/)) {
            corrected += '.';
        }

        return corrected.trim();
    }

    detectAndFixContext(text) {
        let corrected = text;
        
        // Detect formal educational context
        if (/\b(students|college|attend|request|tomorrow)\b/gi.test(text)) {
            corrected = corrected.replace(/\bwe want\b/gi, 'we request');
            corrected = corrected.replace(/\bto attend college tomorrow\b/gi, 'to mandatorily attend college tomorrow');
            corrected = corrected.replace(/\bmust attend\b/gi, 'are required to attend');
        }
        
        // Detect business/professional context
        if (/\b(meeting|office|work|project|deadline)\b/gi.test(text)) {
            corrected = corrected.replace(/\bwe want\b/gi, 'we would like');
            corrected = corrected.replace(/\bplease do\b/gi, 'please');
        }
        
        // Detect health context
        if (/\b(health|sick|doctor|medicine|hospital)\b/gi.test(text)) {
            corrected = corrected.replace(/\bdon't have health\b/gi, 'am not feeling well');
            corrected = corrected.replace(/\bhealth is not good\b/gi, 'am not feeling well');
        }
        
        // Detect travel context
        if (/\b(train|bus|travel|journey|ticket)\b/gi.test(text)) {
            corrected = corrected.replace(/\bgoing in\b/gi, 'traveling by');
            corrected = corrected.replace(/\bcoming in\b/gi, 'returning by');
        }
        
        // DON'T REMOVE CONTENT - Only fix grammar, not content
        // Avoid aggressive content removal for narrative contexts
        if (/\b(shopping|friend|father|brother|spent|money)\b/gi.test(text)) {
            // This is a narrative/story context - be very conservative
            // Only fix basic grammar, don't remove any content
            return corrected;
        }
        
        return corrected;
    }

    removeRepetitions(text) {
        if (!text) return text;
        
        // For Telugu text, we need to be much more careful with cleaning
        // Telugu script characters: \u0C00-\u0C7F
        const isTeluguText = /[\u0C00-\u0C7F]/.test(text);
        
        if (isTeluguText) {
            // First, clean up common repetitions in Telugu speech recognition
            let cleanedText = text;
            
            // Remove only exact immediate word repetitions, not similar words
            cleanedText = cleanedText.replace(/(\S+)\s+\1(?=\s|$)/g, '$1'); // Remove immediate word repetitions
            cleanedText = cleanedText.replace(/విద్యార్థుల\s+విద్యార్థులందరూ/g, 'విద్యార్థులందరూ');
            cleanedText = cleanedText.replace(/విద్యార్థులు\s+విద్యార్థులందరూ/g, 'విద్యార్థులందరూ');
            
            // Fix common Telugu formal language patterns
            cleanedText = cleanedText.replace(/కళాశాలలు\s+తప్పనిసరి/g, 'కళాశాలకు హాజరు తప్పనిసరి');
            cleanedText = cleanedText.replace(/ఆధార్వలసిందిగా/g, 'హాజరవ్వాలని');
            
            // ULTRA-AGGRESSIVE DUPLICATE REMOVAL FOR SPEECH RECOGNITION ERRORS
            // Remove massive repetitions that speech recognition creates
            
            // First, remove obvious patterns like "A A A A A"
            let deduped = cleanedText;
            
            // Remove immediate word repetitions
            deduped = deduped.replace(/(\S+)(\s+\1){2,}/g, '$1'); // Remove 3+ consecutive identical words
            
            // Split into meaningful chunks and remove duplicates
            const sentences = deduped.split(/[।.!?]+/).filter(s => s.trim() && s.trim().length > 10);
            const uniqueSentences = [];
            const seen = new Set();
            
            for (const sentence of sentences) {
                const trimmed = sentence.trim();
                if (!trimmed || trimmed.length < 10) continue;
                
                // Very aggressive normalization
                const normalized = trimmed.toLowerCase()
                    .replace(/\s+/g, ' ')
                    .replace(/[^\u0C00-\u0C7F\s]/g, '') // Keep only Telugu characters and spaces
                    .trim();
                
                // Only add if not seen before
                if (!seen.has(normalized) && normalized.length > 5) {
                    seen.add(normalized);
                    uniqueSentences.push(trimmed);
                }
            }
            
            // If we end up with nothing, return the first meaningful sentence
            if (uniqueSentences.length === 0) {
                const firstSentence = sentences[0];
                if (firstSentence && firstSentence.trim().length > 10) {
                    return firstSentence.trim();
                }
            }
            
            return uniqueSentences.join('. ').trim();
        }
        
        // More careful logic for English text
        const paragraphs = text.split(/\n\s*\n/);
        const cleanedParagraphs = [];
        
        for (const paragraph of paragraphs) {
            if (!paragraph.trim()) continue;
            
            const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim());
            const uniqueSentences = [];
            const seen = new Set();
            
            for (const sentence of sentences) {
                const trimmed = sentence.trim();
                if (!trimmed) continue;
                
                // More conservative normalization - preserve important differences
                const normalized = trimmed.toLowerCase()
                    .replace(/\s+/g, ' ')
                    .replace(/[^\w\s]/g, '')
                    .trim();
                
                // Only remove if it's truly identical (not just similar)
                const isExactDuplicate = seen.has(normalized);
                const isMeaningfullyDifferent = this.checkMeaningfulDifference(trimmed, uniqueSentences);
                
                if (!isExactDuplicate && (normalized.length > 3 || isMeaningfullyDifferent)) {
                    seen.add(normalized);
                    uniqueSentences.push(trimmed);
                }
            }
            
            if (uniqueSentences.length > 0) {
                cleanedParagraphs.push(uniqueSentences.join('. ') + '.');
            }
        }
        
        return cleanedParagraphs.join('\n\n').trim();
    }

    checkMeaningfulDifference(sentence, existingSentences) {
        // Check if this sentence adds meaningful information
        const words = sentence.toLowerCase().split(/\s+/);
        const keyWords = words.filter(word => 
            !['i', 'my', 'me', 'and', 'the', 'a', 'an', 'with', 'to', 'for', 'in', 'on', 'at', 'went', 'also', 'too'].includes(word)
        );
        
        for (const existing of existingSentences) {
            const existingWords = existing.toLowerCase().split(/\s+/);
            const existingKeyWords = existingWords.filter(word => 
                !['i', 'my', 'me', 'and', 'the', 'a', 'an', 'with', 'to', 'for', 'in', 'on', 'at', 'went', 'also', 'too'].includes(word)
            );
            
            // If sentences share most key words, they might be similar
            const commonKeyWords = keyWords.filter(word => existingKeyWords.includes(word));
            const similarity = commonKeyWords.length / Math.max(keyWords.length, existingKeyWords.length);
            
            // Only consider similar if 80% or more key words match
            if (similarity >= 0.8) {
                return false; // Not meaningfully different
            }
        }
        
        return true; // Meaningfully different
    }
}
