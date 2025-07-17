const { Translate } = require('@google-cloud/translate').v2;

// Check if the environment variable is set
if (!process.env.GOOGLE_CREDENTIALS) {
  throw new Error('GOOGLE_CREDENTIALS environment variable not set.');
}

// Parse the credentials from the environment variable
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// Initialize Google Cloud Translation API with credentials object
const googleCloudTranslate = new Translate({
    credentials,
    projectId: credentials.project_id
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