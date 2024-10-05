// components/InputForm.tsx
'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
// import {Input} from "@/components/ui/input";



const InputForm = () => {
    const [url, setUrl] = useState('');
    const router = useRouter();

    const extractVideoId = (url: string) => {
        const regex = /(?:v=|\/)([0-9A-Za-z_-]{11}).*/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const videoId = extractVideoId(url);
        if (videoId) {
            router.push(`/video/${videoId}`);
        } else {
            alert('Please enter a valid YouTube URL');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center border-2 border-dashed border-gray-500 p-4 rounded-lg bg-gray-800 w-full max-w-6xl mx-auto mt-6">
            <input
                type="text"
                placeholder="Enter YouTube URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-grow p-3 text-black rounded-l-lg outline-none w-full "
            />
            <button type="submit" className={"bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 ease-in-out"}>Summarise</button>
        </form>
    );
};

export default InputForm;

