// app/api/azureVoices/route.ts

import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function GET() {
    // Replace these with your actual Azure subscription key and region
    const subscriptionKey = process.env.AZURE_SUBSCRIPTION_KEY || '5iE36b0toBxuWHCPIkMMTw9jH9mEBsRb5hooYwdLmoibNiS4Tx7bJQQJ99AKAC3pKaRXJ3w3AAAYACOGbRDJ';
    const region = process.env.AZURE_REGION || 'eastasia'; // e.g., 'eastus'

    const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/voices/list`;

    try {
        const response = await fetch(endpoint, {
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
            },
        });

        if (!response.ok) {
            const error = await response.text();
            return new NextResponse(error, { status: response.status });
        }

        const voices = await response.json();
        return new NextResponse(JSON.stringify(voices), { status: 200 });
    } catch (error) {
        console.error('Error fetching voices from Azure:', error);
        return new NextResponse('Error fetching voices from Azure', { status: 500 });
    }
}
