// app/video/[videoId]/components/VideoPlayer.tsx
'use client';

import React from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = ({ videoId }: { videoId: string }) => {
    return (
        <div className="w-full aspect-w-16 aspect-h-9">
            <YouTube videoId={videoId} className="w-full h-full" />
        </div>
    );
};

export default VideoPlayer;
