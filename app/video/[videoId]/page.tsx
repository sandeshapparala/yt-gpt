// app/video/[videoId]/page.tsx
import VideoPlayer from './components/VideoPlayer';
import VideoDetails from './components/VideoDetails';
import React from "react";
import InputForm from "@/components/InputForm";
import {BackgroundBeams} from "@/components/ui/background-beams";
import Tabs from "./components/Tabs";

export default function VideoPage({ params }: { params: { videoId: string } }) {
    const { videoId } = params;

    return (
        <div className="absolute top-0 w-full h-auto  flex flex-col items-center  bg-slate-950 pt-36">
            <div className="absolute inset-0 w-full h-screen bg-black "/>
            <div
                className="absolute inset-0 w-full min-h-screen h-screen bg-slate-950 [mask-image:radial-gradient(transparent,white)] "/>
            <BackgroundBeams className={"h-screen"}/>
            <div className={"z-20 w-full"}>
                <InputForm/>

            </div>


            <div className={"z-20 w-full h-[670px] max-w-6xl mt-6 rounded-lg flex gap-4 mb-6"}>
                <div className={"w-2/5 bg-white rounded-lg"}>
                    <div className="bg-gray-800 rounded-t-lg p-3">
                        <h2 className="text-white text-xl font-semibold text-center">
                            YouTube Video
                        </h2>
                    </div>
                    <div className={"p-3"}>
                    <VideoPlayer videoId={videoId} />
                    <VideoDetails videoId={videoId} />
                    </div>

                </div>

                <div className={"w-3/5 bg-white rounded-lg overflow-auto relative"}>
                    <Tabs videoId={videoId} />

                </div>

            </div>


        </div>






        // <div className="flex flex-col md:flex-row mt-10">
        //     <div className="md:w-1/2 md:pr-4">
        //         <VideoPlayer videoId={videoId} />
        //         <VideoDetails videoId={videoId} />
        //     </div>
        //     <div className="md:w-1/2 md:pl-4 mt-6 md:mt-0">
        //         <VideoTabs videoId={videoId} />
        //     </div>
        // </div>
    );
}
