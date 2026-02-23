import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'What is the latest news about SolidJS?',
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  console.log(response.text);
}
run().catch(console.error);
