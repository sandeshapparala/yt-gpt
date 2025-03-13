// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */

// lib/transcript.ts
import { YoutubeTranscript } from 'youtube-transcript';
import axios from 'axios';

// Additional methods to fetch YouTube transcripts
export const getTranscript = async (videoId: string): Promise<string> => {
    try {
        // Add retries and timeout
        const maxRetries = 3;
        let lastError;

        for (let i = 0; i < maxRetries; i++) {
            try {
                // Method 1: Try our proxy API first in production
                if (typeof window !== 'undefined') { // Check if we're in the browser
                    try {
                        // Use our proxy-transcript API
                        const response = await axios.get(`/api/proxy-transcript?videoId=${videoId}`, {
                            timeout: 15000
                        });
                        if (response.data && response.data.transcript) {
                            return response.data.transcript;
                        }
                    } catch (proxyErr) {
                        console.log('Proxy API failed, falling back to other methods', proxyErr);
                    }

                    // Method 2: Try using free online services that provide YouTube transcripts
                    try {
                        const services = [
                            `https://youtubetranscript.com/?server_vid=${videoId}`,
                            `https://www.captionsgrabber.com/caption-api.php?id=${videoId}`,
                            `https://downsub.com/api/transcript?url=https://www.youtube.com/watch?v=${videoId}`
                        ];

                        for (const service of services) {
                            try {
                                const response = await axios.get(service, { timeout: 10000 });
                                // Each service returns data in different formats, we need to handle them
                                if (response.data) {
                                    // Processing depends on the service response format
                                    // This is a simplified check
                                    if (typeof response.data === 'string' && response.data.includes('transcript-text')) {
                                        const match = response.data.match(/<div id="transcript-text">(.*?)<\/div>/s);
                                        if (match && match[1]) {
                                            return match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                                        }
                                    } else if (response.data.transcript || response.data.text) {
                                        return response.data.transcript || response.data.text;
                                    }
                                }
                            } catch (e) {
                                console.log(`Service ${service} failed:`, e.message);
                            }
                        }
                    } catch (serviceErr) {
                        console.log('All transcript services failed', serviceErr);
                    }
                }

                // Method 3: Direct library method as last resort
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
                console.log(`Attempt ${i + 1} failed:`, err.message);
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