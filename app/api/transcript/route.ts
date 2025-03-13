// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */

import { NextRequest, NextResponse } from 'next/server';
import { getTranscript } from '@/lib/transcript';
import axios from 'axios';

// Try different methods to fetch the transcript
async function tryMultipleMethods(videoId) {
    let errors = [];

    // Method 1: Try direct library method
    try {
        return await getTranscript(videoId);
    } catch (error) {
        errors.push({ method: 'direct', error: error.message });
        console.log('Direct method failed:', error.message);
    }

    // Method 2: Try third-party transcript service
    try {
        const response = await axios.get(
            `https://youtubetranscript.com/?server_vid=${videoId}`,
            { timeout: 10000 }
        );
        if (response.data && typeof response.data === 'string' &&
            response.data.includes('transcript-text')) {
            // Extract transcript from HTML response
            const match = response.data.match(/<div id="transcript-text">(.*?)<\/div>/s);
            if (match && match[1]) {
                return match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            }
        }
    } catch (error) {
        errors.push({ method: 'third-party', error: error.message });
        console.log('Third-party service failed:', error.message);
    }

    throw new Error(`All transcript methods failed: ${JSON.stringify(errors)}`);
}

export async function POST(request: NextRequest) {
    try {
        const { videoId } = await request.json();

        if (!videoId) {
            return NextResponse.json(
                { error: 'Video ID is required' },
                { status: 400 }
            );
        }

        // Try multiple methods to get the transcript
        const transcript = await tryMultipleMethods(videoId);

        if (!transcript) {
            return NextResponse.json(
                { error: 'No transcript available' },
                { status: 404 }
            );
        }

        return NextResponse.json({ transcript });
    } catch (error) {
        console.error('Error fetching transcript:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch transcript',
                details: error.message,
                stack: error.stack
            },
            { status: 500 }
        );
    }
}