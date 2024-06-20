import { useState, useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Light as SyntaxHightlight } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import bot from "../assets/img/bot.jpg";
import user from "../assets/img/user.png";
import search from "../assets/svg/search.svg";

const Home = () => {
  const [inputData, setInputData] = useState("");
  const [userChat, setUserChat] = useState<string[]>([]);
  const [aiChat, setAiChat] = useState<string[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const autoResize = (e: any) => {
    e.target.style.height = "28px";
    e.target.style.overflowY = "hidden";
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.overflowY = "auto";
  };

  const handleClick = async () => {
    try {
      const data = {
        content: inputData,
        API_KEY: import.meta.env.VITE_GROQ_API_KEY,
      };
      const response = await fetch("http://localhost:3000/chat-to-groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      const aiResponse = result.record;
      setAiChat((prev) => [...prev, aiResponse]);
      setUserChat((prev) => [...prev, inputData]);
      if (inputRef.current) {
        inputRef.current.value = "";
        if (window.innerWidth >= 640) {
          inputRef.current.focus();
        }
      }
      autoResize({ target: inputRef.current });
    } catch (e) {
      console.log(e);
    }
  };

  const handleKey = async (e: any) => {
    if (e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleClick();
    }
  };

  useEffect(() => {
    AOS.init();
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [aiChat]);

  return (
    <>
      <div className="w-full gradient-circle min-h-[100vh] overflow-hidden relative">
        <div
          className={`fixed ${
            isChecked == true ? "right-0" : "-right-72"
          }  min-h-screen flex duration-300 z-50`}
        >
          <div className="flex flex-col gap-1.5 right-5 top-5 relative">
            <div
              className={`w-6 h-[4px] bg-white duration-300 ${
                isChecked == true ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <div
              className={`w-6 h-[4px] bg-white duration-300 ${
                isChecked == true ? "opacity-0" : ""
              }`}
            />
            <div
              className={`w-6 h-[4px] bg-white duration-300 ${
                isChecked == true ? "-rotate-45 -translate-y-3" : ""
              }`}
            />
            <input
              type="checkbox"
              className="absolute w-[25px] h-[25px] opacity-0 cursor-pointer"
              onChange={() => setIsChecked((prev) => (prev = !prev))}
            />
          </div>
          <div className="bg-[#13171c] w-72 text-white">
            <div className="py-5 text-center font-bold text-xl select-none cursor-default border-b-2 border-white">
              ASKWAI
            </div>
            <li className="list-none py-5 text-center font-semibold text-lg">
              <a href="#" className="hover:text-yellow-400">
                Created by
              </a>
            </li>
            <li className="list-none py-5 text-center font-semibold text-lg ">
              <a
                href="https://groq.com/"
                target="_blank"
                className="hover:text-yellow-400"
              >
                Reference
              </a>
            </li>
            <li className="list-none py-5 text-center font-semibold text-lg ">
              <a
                href="https://github.com/iamCelott/AskWai"
                target="_blank"
                className="hover:text-yellow-400"
              >
                Github Project
              </a>
            </li>
          </div>
        </div>

        <div className=" text-white flex flex-col items-center py-12">
          <div className="flex gap-2">
            <span
              data-aos="fade-down"
              data-aos-delay="200"
              className="text-3xl font-semibold"
            >
              Ask
            </span>
            <span
              data-aos="fade-down"
              data-aos-delay="600"
              className="text-3xl font-semibold"
            >
              Wai
            </span>
          </div>
          <span
            data-aos="fade-up"
            data-aos-delay="1000"
            className="text-xl tracking-widest"
          >
            Ask All Your Confusion
          </span>
        </div>
        <div className="w-full px-7 mx-auto max-w-[768px]">
          {userChat.flatMap((chat: string, index: number) => [
            <div
              key={`user-${index}`}
              style={{ clear: "both" }}
              className="z-10 float-right mb-2 flex gap-2 sm:max-w-[80%]"
            >
              <div className="bg-[rgba(0,0,0,0.3)] p-3 rounded-lg text-sm text-white">
                <p className="text-sm text-white">{chat}</p>
              </div>
              <img src={user} alt="user" className="w-7 h-7 rounded-full" />
            </div>,
            aiChat[index] && (
              <div
                key={`bot-${index}`}
                style={{ clear: "both" }}
                className="z-10 float-left mb-32 flex gap-2 sm:max-w-[80%]"
              >
                <img src={bot} alt="user" className="w-7 h-7 rounded-full" />
                <SyntaxHightlight
                  language="swift"
                  style={darcula}
                  wrapLongLines
                >
                  {aiChat[index]}
                </SyntaxHightlight>
              </div>
            ),
          ])}
        </div>
        <div className="flex w-full justify-center px-7 fixed bottom-7 z-40">
          <div className="bg-[#585c5c] rounded-xl w-full max-w-[768px] p-2 flex gap-4 justify-between items-center">
            <textarea
              placeholder="Search..."
              className="bg-transparent text-lg text-white outline-none flex-grow px-3 h-[28px] resize-none max-h-[150px] overflow-hidden"
              onInput={autoResize}
              onChange={(e: any) => setInputData(e.target.value)}
              onKeyDown={handleKey}
              ref={inputRef}
            />
            <div className="flex items-end h-full">
              <button
                className="bg-[rgba(255,255,225,0.3)] rounded-full p-2"
                onClick={handleClick}
              >
                <img src={search} alt="" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
