"use client"
import React, { useState, useRef } from "react";
import Image from "next/image";
import {ReactTyped  ,Typed} from "react-typed";
import { HashLoader } from "react-spinners";

function Page() {
  const replaceNewlinesWithBr = (text: string) => {
    return text.replace(/\n\s*\n/g, "<br><br>").replace(/\n/g, "<br>");
  };

  const typedRef = useRef<Typed | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [strings, setStrings] = useState([
    "Ask me anything?",
    "Write a Story About Batman",
    "Write a JavaScript Program.",
    "What is Gemini AI?",
  ]);
  const [useLoop, setUseLoop] = useState(true);
  const [speed, setSpeed] = useState(60);

  const fetchData = async (prompt: string) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const response = await fetch("/api", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    console.log(data);

    if (data.success  == true) {
      setLoading(false);
      setPrompt("");
      const promptString = replaceNewlinesWithBr(data.data);
      setStrings([promptString]);
    } else {
      setLoading(false)
      setStrings(["Something Went Wrong!"]);
    }

    setSpeed(10);
    setUseLoop(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      fetchData(prompt);
    }
  };

  const handleData = () => {
    fetchData(prompt);
  };

  return (
    <div className="w-screen h-screen bg-zinc-900">
      <div className="w-[90%] md:w-[70%] h-full mx-auto flex flex-col space-y-2">
        <div className="logo w-full h-[10%] flex justify-center items-center space-x-4">
          <Image
            src="/logo.jpg"
            width={50}
            height={50}
            alt="AlphaBot Logo"
            className="rounded-full"
          />
          <div className="text-white font-bold text-2xl">AlphaBot</div>
        </div>

        <div className="chatbox h-[75%] no-scrollbar overflow-auto">
          {!loading && (
            <ReactTyped
              strings={strings}
              typedRef={(typedInstance : any) => {
                typedRef.current = typedInstance;
              }}
              typeSpeed={speed}
              style={{ color: "white" }}
              loop={useLoop}
            />
          )}

          {loading && (
            <div className="flex flex-col justify-center items-center h-full">
              <h3 className="text-white font-bold my-2">Generating Response...</h3>
              <HashLoader color="#bd51b2" />
            </div>
          )}
        </div>

        <div className="inputfield h-[10%]">
          <div className="w-full flex items-center">
            <input
              type="text"
              name="prompt"
              id="prompt"
              value={prompt}
              onChange={handleChange}
              className="w-[70%] md:w-[90%] py-2 px-2 rounded-l-lg bg-black border-2 box-border text-white border-r-0 focus:outline-none"
              placeholder="Message AlphaBot"
              onKeyDown={handleKeyDown}
              style={{
                paddingTop: "0.54rem",
                paddingBottom: "0.55rem",
              }}
            />
            <button
              className="text-white py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 w-[30%] md:w-[10%] focus:ring-4 focus:outline-none focus:ring-purple-200 font-medium rounded-r-lg text-sm px-5 text-center disabled:bg-black disabled:border"
              onClick={handleData}
              disabled={prompt.length === 0}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
