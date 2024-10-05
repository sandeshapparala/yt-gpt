import React from 'react';
import VideoPlayer from '@/app/video/[videoId]/components/VideoPlayer';
import VideoDetails from "@/app/video/[videoId]/components/VideoDetails";

const Page = ({ params }: { params: { videoId: string } }) => {
    const { videoId } = params;

    return (
        <div className="">
            <p>Video ID: {videoId}</p>
            <VideoPlayer videoId={videoId} />
            <VideoDetails videoId={videoId} />
        </div>
    );
};

export default Page;