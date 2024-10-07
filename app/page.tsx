import React from 'react'
import {BackgroundBeams} from "@/components/ui/background-beams";
import InputForm from "@/components/InputForm";

const HomePage = () => {
    return (
        <div className="absolute top-0 w-full h-auto  flex flex-col items-center  bg-slate-900 pt-36">
            <div className="absolute inset-0 w-full h-screen bg-black "/>
            <div
                className="absolute inset-0 w-full min-h-screen h-screen bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] "/>
            <BackgroundBeams className={"h-screen"}/>
            <div className={"z-20 container "}>
                <div className={"info "}>
                    <h1 className="text-6xl text-white font-bold text-center leading-tight pb-3">
                        Same Info in Less Time, <br/> Transcribe or Summarize{" "}
                        <span>In Seconds</span>!
                    </h1>
                    <p className={"text-gray-200 text-center text-xl"}>
                        Instantly Summarize any Video With Ease
                    </p>
                </div>
                <InputForm/>
            </div>
        </div>
    )
}
export default HomePage
