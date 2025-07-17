// Test script to show the difference between raw and enhanced translation
const PerfectTranslator = require('./translator.js');

// Mock the translation methods for testing
class TestTranslator extends PerfectTranslator {
    async translateWithGoogle(text) {
        // Simulate a basic, literal translation from Google
        if (text.includes('రేపటి నుండి మా కళాశాలలో వార్షిక పరీక్షలు')) {
            return "From tomorrow annual examinations are starting in our college. All departments students should attend on time. All rules related to examinations should be respected. No one should worry. We made arrangements to make question papers easy. All facilities have been provided. Everyone should not forget their admit card. It is very important to reach on time. Answer sheets will be collected immediately after examinations. We wish everyone the best.";
        }
        return text; // fallback
    }

    async translateWithGoogleCloud(text) {
        throw new Error('Google Cloud not available in test');
    }

    async translateWithMyMemory(text) {
        throw new Error('MyMemory not available in test');
    }

    async translateWithLibreTranslate(text) {
        throw new Error('LibreTranslate not available in test');
    }
}

async function testTranslation() {
    const translator = new TestTranslator();
    
    const teluguText = "రేపటి నుండి మా కళాశాలలో వార్షిక పరీక్షలు ప్రారంభం అవుతున్నాయి. అన్ని విభాగాల విద్యార్థులు సకాలంలో హాజరు కావాలి. పరీక్షలకు సంబంధించిన అన్ని నియమాలను గౌరవించాలి. ఎవరు కూడా ఆందోళన చెందకూడదు. ప్రశ్నపత్రాలు సులభంగా ఉండేలా ఏర్పాట్లు చేశాం. అన్ని సౌకర్యాలు కల్పించబడ్డాయి. ప్రతి ఒక్కరు తన అడ్మిట్ కార్డు మరిచిపోవద్దు. సమయానికి చేరుకోవడం చాలా అవసరం. పరీక్షల తర్వాత తక్షణమే సమాధానపత్రాలు సేకరించబడతాయి. అందరికి శుభాకాంక్షలు తెలియజేస్తున్నాం.";
    
    console.log("=".repeat(80));
    console.log("Telugu Text:");
    console.log("=".repeat(80));
    console.log(teluguText);
    console.log();
    
    try {
        const result = await translator.translateText(teluguText);
        
        console.log("=".repeat(80));
        console.log("STAGE 1 - RAW TRANSLATION (Basic & Literal):");
        console.log("=".repeat(80));
        console.log(result.raw);
        console.log();
        
        console.log("=".repeat(80));
        console.log("STAGE 2 - ENHANCED TRANSLATION (Professional & Polished):");
        console.log("=".repeat(80));
        console.log(result.enhanced);
        console.log();
        
        console.log("=".repeat(80));
        console.log("COMPARISON:");
        console.log("=".repeat(80));
        console.log("Raw length:", result.raw.length);
        console.log("Enhanced length:", result.enhanced.length);
        console.log("Difference:", result.enhanced.length - result.raw.length, "characters");
        
    } catch (error) {
        console.error("Translation failed:", error.message);
    }
}

// Run the test
testTranslation();