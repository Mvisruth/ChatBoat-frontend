import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";

type FormData = {
  prompt: string;
};

type Msg = {
  role: "user" | "bot";
  text: string;
};

function ChatBot() {
  const { register, handleSubmit, reset, formState } = useForm<FormData>({
    mode: "onChange",
  });

  const [messages, setMessages] = useState<Msg[]>([]);

  const Submit = async ({ prompt }: FormData) => {
    const userText = prompt.trim();
    if (!userText) return;

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    reset();

    const { data } = await axios.post("https://chatboat-backend-gsnd.onrender.com/api/chat", { prompt: userText });

    setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <div className="w-full border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-semibold text-lg">ChatBoat</h1>
          <p className="text-sm text-gray-500">AI Chat Assistant</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              <h2 className="text-xl font-semibold text-gray-800">
                Welcome to ChatBoat 👋
              </h2>
              <p className="text-sm mt-2">
                Ask anything and get instant replies.
              </p>
            </div>
          )}

          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${
                  m.role === "user"
                    ? "bg-black text-white rounded-br-sm"
                    : "bg-white text-black border rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="w-full border-t bg-white">
        <form
          onSubmit={handleSubmit(Submit)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(Submit)();
            }
          }}
          className="max-w-3xl mx-auto p-4"
        >
          <div className="flex items-end gap-2 bg-gray-100 rounded-2xl p-2 border">
            <textarea
              {...register("prompt", {
                required: true,
                validate: (data) => data.trim().length > 0,
              })}
              className="w-full bg-transparent p-2 focus:outline-none resize-none text-black"
              placeholder="Ask anything..."
              maxLength={1000}
              rows={2}
            />

            {/* ✅ Arrow aligned perfectly */}
            <Button
              disabled={!formState.isValid}
              type="submit"
              className="rounded-full h-10 w-10 p-0 bg-black flex items-center justify-center"
            >
              <FaArrowUp className="text-white text-sm" />
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Press <b>Enter</b> to send • <b>Shift + Enter</b> for new line
          </p>
        </form>
      </div>
    </div>
  );
}

export default ChatBot;
