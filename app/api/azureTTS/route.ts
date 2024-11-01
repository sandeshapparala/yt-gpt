// app/api/azureTTS/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { text, voiceName, rate } = await request.json();

  // Use environment variables for sensitive information
  const subscriptionKey = "5iE36b0toBxuWHCPIkMMTw9jH9mEBsRb5hooYwdLmoibNiS4Tx7bJQQJ99AKAC3pKaRXJ3w3AAAYACOGbRDJ";
  const region = "eastasia";

  const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

  const ssml = `
    <speak version='1.0' xml:lang='en-US'>
      <voice name='${voiceName}'>
        <prosody rate='${rate}%'>
          ${text}
        </prosody>
      </voice>
    </speak>`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
      },
      body: ssml,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Azure TTS API Error (${response.status}): ${error}`);
      return NextResponse.json({ error }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (error) {
    console.error('Error calling Azure TTS:', error);
    return NextResponse.json({ error: 'Error calling Azure TTS' }, { status: 500 });
  }
}