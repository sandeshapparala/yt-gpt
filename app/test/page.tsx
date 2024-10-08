'use client'

import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Page = () => {
    const [result, setResult] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
                const genAI = new GoogleGenerativeAI(API);
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

                const prompt = 'Write a story about a magic backpack.';
                const response = await model.generateContent(prompt);

                const text = await response.response.text();
                setResult(text);
            } catch (error) {
                console.error('Error generating content:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>{result}</div>
    );
};

export default Page;