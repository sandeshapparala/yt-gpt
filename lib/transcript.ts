// components/register/RegisterForm.tsx
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */

import { YoutubeTranscript } from 'youtube-transcript';
import axios from 'axios';

// Client-side YouTube transcript fetching
export const getTranscript = async (videoId: string): Promise<string> => {
    try {
        const maxRetries = 3;
        let lastError;

        for (let i = 0; i < maxRetries; i++) {
            try {
                // Use a CORS proxy for YouTube requests
                const corsProxy = 'https://corsproxy.io/?';
                
                // Method 1: Try YoutubeTranscript library with CORS proxy
                try {
                    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, {
                        corsProxy // Set CORS proxy for the library
                    });
                    
                    if (transcriptItems && transcriptItems.length > 0) {
                        return transcriptItems
                            .map(item => item.text)
                            .join(' ')
                            .replace(/\s+/g, ' ')
                            .trim();
                    }
                } catch (err) {
                    console.log('YoutubeTranscript library failed:', err.message);
                }
                
                // Method 2: Try CORS-friendly transcript sources
                try {
                    // Use a CORS proxy with these services
                    const services = [
                        `${corsProxy}https://youtubetranscript.com/?server_vid=${videoId}`,
                        `${corsProxy}https://downsub.com/api/transcript?url=https://www.youtube.com/watch?v=${videoId}`
                    ];
                    
                    for (const service of services) {
                        try {
                            const response = await axios.get(service, { timeout: 10000 });
                            if (response.data) {
                                // Process based on service format
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

                // Method 3: Try a simpler approach with just the YouTube page
                try {
                    const ytPageUrl = `${corsProxy}https://www.youtube.com/watch?v=${videoId}`;
                    const response = await axios.get(ytPageUrl, { timeout: 10000 });
                    
                    if (response.data) {
                        // Look for caption tracks in YouTube page
                        const captionRegex = /"captionTracks":\s*(\[.*?\])/;
                        const match = response.data.match(captionRegex);
                        
                        if (match && match[1]) {
                            const captionTracks = JSON.parse(match[1]);
                            if (captionTracks.length > 0) {
                                // Get the first caption track URL
                                const captionUrl = captionTracks[0].baseUrl;
                                // Fetch the caption track
                                const captionResponse = await axios.get(`${corsProxy}${captionUrl}`, { timeout: 10000 });
                                // Parse the XML response
                                if (captionResponse.data) {
                                    // Simple XML parsing to extract text
                                    const textRegex = /<text[^>]*>(.*?)<\/text>/g;
                                    let transcript = '';
                                    let textMatch;
                                    
                                    while ((textMatch = textRegex.exec(captionResponse.data)) !== null) {
                                        transcript += ' ' + textMatch[1];
                                    }
                                    
                                    return transcript.replace(/&amp;/g, '&')
                                                    .replace(/&lt;/g, '<')
                                                    .replace(/&gt;/g, '>')
                                                    .replace(/\s+/g, ' ')
                                                    .trim();
                                }
                            }
                        }
                    }
                } catch (ytError) {
                    console.log('YouTube page method failed:', ytError.message);
                }
                
                throw new Error('Could not retrieve transcript with any method');
                
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