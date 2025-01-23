// app/api/transcript/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTranscript } from '@/lib/transcript';

export async function POST(request: NextRequest) {
    try {
        const { videoId } = await request.json();

        if (!videoId) {
            return NextResponse.json({ error: 'VideoId is required' }, { status: 400 });
        }

        const transcript = await getTranscript(videoId);

        if (!transcript) {
            return NextResponse.json({ error: 'No transcript found' }, { status: 404 });
        }

        return NextResponse.json({ transcript });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transcript';
        console.error('Transcript API error:', errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
