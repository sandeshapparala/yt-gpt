// app/video/[videoId]/components/VideoDetails.tsx
'use client';

import { useEffect, useState } from 'react';
import { getVideoDetails } from '@/lib/youtube';

interface VideoDetails {
    title: string;
    channel: string;
    // Add other properties as needed
}

const VideoDetails = ({ videoId }: { videoId: string }) => {
    const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);

    useEffect(() => {
        async function fetchDetails() {
            const details = await getVideoDetails(videoId);
            setVideoDetails(details);
        }
        fetchDetails();
    }, [videoId]);

    if (!videoDetails) return <div>Loading...</div>;

    return (
        <div className="mt-4">
            <h1 className="text-xl font-bold text-black pb-3">{videoDetails.title}</h1>
            <p className="text-gray-700 ">Channel: {videoDetails.channel}</p>




        </div>
    );
};

export default VideoDetails;
