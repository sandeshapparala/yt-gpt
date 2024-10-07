// app/video/[videoId]/page.tsx
import VideoPlayer from './components/VideoPlayer';
import VideoDetails from './components/VideoDetails';
import VideoTabs from './components/Tabs';

export default function VideoPage({ params }: { params: { videoId: string } }) {
    const { videoId } = params;

    return (
        <div className="flex flex-col md:flex-row mt-10">
            <div className="md:w-1/2 md:pr-4">
                <VideoPlayer videoId={videoId} />
                <VideoDetails videoId={videoId} />
            </div>
            <div className="md:w-1/2 md:pl-4 mt-6 md:mt-0">
                <VideoTabs videoId={videoId} />
            </div>
        </div>
    );
}
