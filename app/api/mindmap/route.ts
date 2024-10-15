// Delete all the content and replace it with new code

// app/api/summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTranscript } from '@/lib/transcript';
import {generateSummary} from "@/lib/sumary";


export async function POST(request: NextRequest) {
    try {
        const { videoId } = await request.json();
        const transcript = await getTranscript(videoId);

        if (!transcript) {
            return NextResponse.json({ error: 'Transcript not found.' }, { status: 404 });
        }

        const summary = await generateSummary(transcript);

        return NextResponse.json({ summary });
    } catch (error) {
        console.error('Error in summary route:', error);
        return NextResponse.json({ error: 'Failed to generate summary.' }, { status: 500 });
    }
}
