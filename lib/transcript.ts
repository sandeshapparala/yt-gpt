// lib/transcript.ts
import { YoutubeTranscript } from 'youtube-transcript';

export const getTranscript = async (videoId: string): Promise<string> => {
    try {
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, {
            lang: 'en',
            country: 'US'
        });

        if (!transcriptItems || transcriptItems.length === 0) {
            throw new Error('No transcript available for this video');
        }

        const transcript = transcriptItems.map(item => item.text).join(' ');
        return transcript;
    } catch (error) {
        console.error('Transcript error details:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch transcript');
    }
};