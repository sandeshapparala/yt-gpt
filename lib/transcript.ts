// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */

// lib/transcript.ts
import { YoutubeTranscript } from 'youtube-transcript';

export const getTranscript = async (videoId: string): Promise<string> => {
    try {
        // Add retries and timeout
        const maxRetries = 3;
        let lastError;

        for (let i = 0; i < maxRetries; i++) {
            try {
                const transcriptItems = await Promise.race([
                    YoutubeTranscript.fetchTranscript(videoId),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Timeout')), 10000)
                    )
                ]);

                if (!transcriptItems || transcriptItems.length === 0) {
                    throw new Error('No transcript available');
                }

                // Concatenate the transcript texts with proper spacing
                const transcript = transcriptItems
                    .map(item => item.text)
                    .join(' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                return transcript;
            } catch (err) {
                lastError = err;
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }

        throw lastError;
    } catch (error) {
        console.error('Failed to fetch transcript:', error);
        throw new Error(`Failed to fetch transcript: ${error.message}`);
    }
};