const { Translate } = require('@google-cloud/translate').v2;

const path = require('path');

// Initialize Google Cloud Translation API
const googleCloudTranslate = new Translate({
    keyFilename: path.join(__dirname, '../../service-account.json'),
    projectId: 'sahayak-465612'
});

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { text, source, target } = JSON.parse(event.body);
        
        const [translation] = await googleCloudTranslate.translate(text, {
            from: source || 'te',
            to: target || 'en'
        });
        
        if (translation && translation.trim()) {
            return {
                statusCode: 200,
                body: JSON.stringify({ translatedText: translation })
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Empty translation result' })
            };
        }
    } catch (error) {
        console.error('Google Cloud Translation error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Google Cloud Translation failed' })
        };
    }
};