const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const { Translate } = require('@google-cloud/translate').v2;

const app = express();
const PORT = 3001;

// Initialize Google Cloud Translation API
const googleCloudTranslate = new Translate({
    keyFilename: './service-account.json',
    projectId: 'sahayak-465612'
});

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Google Cloud Translation endpoint
app.post('/translate-cloud', async (req, res) => {
    try {
        const { text, source, target } = req.body;
        
        const [translation] = await googleCloudTranslate.translate(text, {
            from: source || 'te',
            to: target || 'en'
        });
        
        if (translation && translation.trim()) {
            res.json({ translatedText: translation });
        } else {
            res.status(500).json({ error: 'Empty translation result' });
        }
    } catch (error) {
        console.error('Google Cloud Translation error:', error);
        res.status(500).json({ error: 'Google Cloud Translation failed' });
    }
});

// Translation endpoint
app.post('/translate', async (req, res) => {
    try {
        const { text } = req.body;
        
        // Try LibreTranslate
        const response = await fetch('https://libretranslate.de/translate', {
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

        if (response.ok) {
            const data = await response.json();
            res.json({ translatedText: data.translatedText });
        } else {
            // Fallback to MyMemory
            const fallbackUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=te|en`;
            const fallbackResponse = await fetch(fallbackUrl);
            const fallbackData = await fallbackResponse.json();
            
            if (fallbackData.responseStatus === 200) {
                res.json({ translatedText: fallbackData.responseData.translatedText });
            } else {
                res.status(500).json({ error: 'Translation failed' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Bulk translation endpoint for 100+ lines
app.post('/translate-bulk', async (req, res) => {
    try {
        const { lines } = req.body;
        
        if (!Array.isArray(lines)) {
            return res.status(400).json({ error: 'Lines must be an array' });
        }
        
        if (lines.length > 1000) {
            return res.status(400).json({ error: 'Maximum 1000 lines supported' });
        }
        
        const results = [];
        const batchSize = 10; // Process 10 lines at a time
        
        for (let i = 0; i < lines.length; i += batchSize) {
            const batch = lines.slice(i, i + batchSize);
            const batchPromises = batch.map(async (line, index) => {
                try {
                    const [translation] = await googleCloudTranslate.translate(line, {
                        from: 'te',
                        to: 'en'
                    });
                    return { 
                        index: i + index, 
                        original: line, 
                        translation: translation,
                        status: 'success'
                    };
                } catch (error) {
                    return { 
                        index: i + index, 
                        original: line, 
                        translation: '',
                        status: 'error',
                        error: error.message 
                    };
                }
            });
            
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
            
            // Rate limiting
            if (i + batchSize < lines.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        res.json({ results, totalProcessed: results.length });
    } catch (error) {
        console.error('Bulk translation error:', error);
        res.status(500).json({ error: 'Bulk translation failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
