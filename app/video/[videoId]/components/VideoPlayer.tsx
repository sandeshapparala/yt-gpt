// app/video/[videoId]/components/VideoPlayer.tsx
'use client';

import React from 'react';

const VideoPlayer = ({ videoId }: { videoId: string }) => {
    return (
        <div className="w-full aspect-w-16 aspect-h-9">
            {/*<YouTube videoId={videoId} className="w-full h-full" />*/}
            <iframe
                id="player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                width="100%"
                height="250px"
                src={`https://www.youtube.com/embed/${videoId}?playsinline=1&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fnotegpt.io&amp;widgetid=1`}
                className="rounded-lg shadow-sm"
            ></iframe>
        </div>
    );
};

export default VideoPlayer;
