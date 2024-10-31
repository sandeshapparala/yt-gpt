// app/api/transcript/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTranscript } from '@/lib/transcript';

export async function POST(request: NextRequest) {
    try {
        const { videoId } = await request.json();
        const transcript = await getTranscript(videoId);
        return NextResponse.json({ transcript });
    } catch (error) {
        console.error('Error fetching transcript:', error);
        return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 });
    }
}
