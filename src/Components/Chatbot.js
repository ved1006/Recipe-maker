// src/Components/Chatbot.js
import React, { useState } from "react";
import "./Chatbot.css";

// Read Gemini API key from .env
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I’m Cooksy, your AI cooking assistant. Ask me about recipes, ingredients, or meal planning!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text:
                      "You are Cooksy AI, a helpful assistant that ONLY talks about cooking, recipes, ingredients, substitutions, " +
                      "meal planning, and food tips. Be detailed with steps and ingredient lists. If asked something unrelated, " +
                      "politely redirect back to cooking topics.",
                  },
                ],
              },
              {
                role: "user",
                parts: [{ text: input }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      console.log("Gemini raw response:", data);

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `⚠️ Gemini Error: ${data.error.message}` },
        ]);
      } else {
        const botReply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "⚠️ No reply from Gemini.";
        setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      }
    } catch (err) {
      console.error("Gemini API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Sorry, I couldn’t connect to the Gemini service.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}

        {isLoading && (
          <div className="chat-message bot">
            <em>Cooksy is thinking...</em>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me about recipes, ingredients, or meal ideas..."
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
