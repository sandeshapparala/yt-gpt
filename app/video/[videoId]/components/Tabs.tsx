// app/video/[videoId]/components/Tabs.tsx
'use client';


import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import TranscriptTab from './TranscriptTab';
import SummaryTab from './SummaryTab';
// import MindmapTab from './MindmapTab';
// import ChatTab from './ChatTab';

const VideoTabs = ({ videoId }: { videoId: string }) => {
    return (
        <Tabs defaultValue="transcript" className="w-full text-black">
            <TabsList className={"bg-gray-800 rounded-t-lg h-12 px-5 w-full sticky top-0"}>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="mindmap">Mindmap</TabsTrigger>
                <TabsTrigger value="chat">Chat with AI</TabsTrigger>
            </TabsList>

            <TabsContent value="transcript" className={"flex justify-center items-center"}>
                <TranscriptTab videoId={videoId} />
            </TabsContent>
            <TabsContent value="summary">
                <SummaryTab videoId={videoId} />
            </TabsContent>
            <TabsContent value="mindmap">
                {/*<MindmapTab videoId={videoId} />*/}
            </TabsContent>
            <TabsContent value="chat">
                {/*<ChatTab videoId={videoId} />*/}
            </TabsContent>
        </Tabs>
    );
};

export default VideoTabs;
