import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquareCode } from 'lucide-react';
import GlassCard from './GlassCard';

interface Message {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: Date;
}

interface AICoachProps {
  onSendMessage: (message: string) => Promise<string>;
}

export const AICoach: React.FC<AICoachProps> = ({ onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'coach',
      text: "Hi, I am your health coach. Ask me a question or pick one of the quick replies below.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "Why do I feel tired?",
    "How can I feel less stressed?",
    "What should I focus on first?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isSending) return;

    const userMsg: Message = {
      id: `msg-${crypto.randomUUID()}-user`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsSending(true);

    try {
      const responseText = await onSendMessage(text);
      const coachMsg: Message = {
        id: `msg-${crypto.randomUUID()}-coach`,
        sender: 'coach',
        text: responseText,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, coachMsg]);
    } catch {
      const errorMsg: Message = {
        id: `msg-${crypto.randomUUID()}-error`,
        sender: 'coach',
        text: "Sorry, I could not load that answer. Please try again.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <GlassCard className="h-full flex flex-col justify-between" hoverable={false}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquareCode className="w-5 h-5 text-brand-green" />
          <h2 className="text-sm font-mono tracking-widest text-gray-400 uppercase">
            HEALTH COACH
          </h2>
        </div>

        {/* Messages list */}
        <div className="h-62.5 overflow-y-auto pr-1 flex flex-col gap-3 font-sans text-xs border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.01)] rounded-lg p-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div
                className={`p-3 rounded-lg leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gray-800 text-white rounded-tr-none'
                    : 'bg-[rgba(13,242,125,0.04)] text-gray-200 border border-[rgba(13,242,125,0.1)] rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] font-mono text-gray-500 mt-1 uppercase tracking-widest">
                {msg.sender === 'user' ? 'TELEMETRY IN' : 'COACH OUT'} · {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          {isSending && (
            <div className="self-start flex flex-col items-start max-w-[85%]">
              <div className="p-3 rounded-lg bg-[rgba(13,242,125,0.02)] border border-[rgba(13,242,125,0.06)] rounded-tl-none text-gray-500 font-mono tracking-widest text-[9px] animate-pulse">
                SYNAPSING ADVICE...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="flex gap-2 flex-wrap mt-4">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleSend(reply)}
              disabled={isSending}
              className="text-[10px] font-mono border border-border-subtle hover:border-brand-green bg-[rgba(255,255,255,0.02)] text-gray-300 hover:text-white px-2.5 py-1.5 rounded transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input controls */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputValue);
        }}
        className="flex gap-2 border-t border-border-subtle pt-4 mt-6"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about sleep, stress, energy, or exercise..."
          disabled={isSending}
          className="flex-1 bg-gray-900 border border-border-subtle rounded px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-brand-green disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isSending || !inputValue.trim()}
          className="bg-brand-green text-black hover:bg-brand-green-hover px-3.5 py-2 rounded flex items-center justify-center transition-all cursor-pointer hover:shadow-[0_0_10px_rgba(13,242,125,0.4)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </GlassCard>
  );
};

export default AICoach;
