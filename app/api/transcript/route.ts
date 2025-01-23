// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */

// app/api/transcript/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTranscript } from '@/lib/transcript';

export async function POST(request: NextRequest) {
    try {
        const { videoId } = await request.json();

        if (!videoId) {
            return NextResponse.json(
                { error: 'Video ID is required' },
                { status: 400 }
            );
        }

        const transcript = await getTranscript(videoId);

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
                details: error.message
            },
            { status: 500 }
        );
    }
}