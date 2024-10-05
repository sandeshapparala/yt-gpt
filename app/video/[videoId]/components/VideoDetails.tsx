// app/video/[videoId]/components/VideoDetails.tsx
'use client';

import { useEffect, useState } from 'react';
import { getVideoDetails } from '@/lib/youtube';

const VideoDetails = ({ videoId }: { videoId: string }) => {
    const [videoDetails, setVideoDetails] = useState<any>(null);

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
            <h1 className="text-2xl font-bold">{videoDetails.title}</h1>
            <p className="text-gray-400">{videoDetails.channel}</p>




        </div>
    );
};

export default VideoDetails;
