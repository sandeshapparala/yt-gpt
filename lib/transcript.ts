// lib/transcript.ts
import { YoutubeTranscript } from 'youtube-transcript';

export const getTranscript = async (videoId: string): Promise<string> => {
    try {
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
        // Concatenate the transcript texts
        const transcript = transcriptItems.map(item => item.text).join(' ');
        return transcript;
    } catch (error) {
        console.error('Failed to fetch transcript:', error);
        throw new Error('Failed to fetch transcript');
    }
};