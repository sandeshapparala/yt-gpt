// lib/summary.ts
import { TextServiceClient } from '@google-ai/generativelanguage';
import { GoogleAuth } from 'google-auth-library';
import { GoogleGenerativeAI } from '@google/generative-ai';


export const generateSummary = async (transcript: string): Promise<string> => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const client = new TextServiceClient({
            authClient: new GoogleAuth().fromAPIKey(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string),
        });

        const prompt = `
You are an expert content summarizer. Please read the following transcript of a YouTube video and create a comprehensive summary that includes the following sections:

1. **Summary**: Provide a brief overview of the main topics and themes discussed in the video, capturing the essence in 1-2 sentences.
2. **Highlights**: List the key points or memorable moments from the video using bullet points. Use relevant emojis to make the highlights engaging and easy to skim.
3. **Key Insights**: Elaborate on the most important concepts, ideas, or lessons from the video. Provide detailed explanations in bullet points, and include emojis where appropriate to enhance readability.

Ensure that the summary is written in clear and engaging language, suitable for readers who have not seen the video. Do not include any personal opinions or external information; base the summary solely on the provided transcript.
add two line breaks after each section to separate them visually.

**Transcript:**

${transcript}
`;

        const API = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!API) {
            throw new Error('API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY.');
        }

        const genAI = new GoogleGenerativeAI(API);
        const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);

        if (!result || !result.response) {
            throw new Error('Failed to generate summary. The response is empty.');
        }

        return result.response.text();
    } catch (error) {
        console.error('Error generating summary:', error);
        throw new Error('An error occurred while generating the summary. Please try again later.');
    }
};
