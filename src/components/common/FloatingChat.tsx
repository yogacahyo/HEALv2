"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, ChevronDown } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  role: string;
  content: string;
  time: string;
  isMine: boolean;
}

const DUMMY_CHAT: Message[] = [
  {
    id: "1",
    sender: "Sistem HEAL",
    role: "Bot",
    content: "Selamat datang di grup koordinasi Shifting SIMRS.",
    time: "08:00",
    isMine: false,
  },
  {
    id: "2",
    sender: "dr. Agus Salim",
    role: "Kepala Unit",
    content: "Admin, tolong cek pengajuan cuti dr. Maya untuk minggu depan ya.",
    time: "09:15",
    isMine: false,
  },
  {
    id: "3",
    sender: "Budi Santoso",
    role: "Admin",
    content: "Baik dok, segera saya proses setelah AI Rostering selesai di-generate.",
    time: "09:18",
    isMine: true,
  },
];

export function FloatingChat({ fabOffset = "bottom-6 sm:bottom-8 right-6 sm:right-8" }: { fabOffset?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(DUMMY_CHAT);
  const [inputMsg, setInputMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "Anda",
      role: "Pengguna",
      content: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    };

    setMessages([...messages, newMsg]);
    setInputMsg("");
  };

  return (
    <>
      {/* Overlay background on mobile when open (optional, gives better focus) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed z-40 bg-[#0d9488] hover:bg-[#0f766e] text-white p-3.5 sm:p-4 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${fabOffset}`}
          style={{ boxShadow: "0 8px 24px rgba(13,148,136,0.4)" }}
          title="Buka Chat Shifting"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed z-50 flex flex-col bg-white overflow-hidden shadow-2xl transition-all duration-300 ease-out
            bottom-0 left-0 right-0 h-[85vh] w-full rounded-t-3xl
            sm:rounded-2xl sm:bottom-8 sm:right-8 sm:left-auto sm:w-[380px] lg:w-[400px] sm:h-[600px] sm:max-h-[85vh]"
          style={{ 
            boxShadow: "0 -4px 24px rgba(0,0,0,0.1), 0 16px 48px rgba(0,0,0,0.2)"
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0d9488] to-[#1e40af] p-4 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight truncate">Koordinasi Shifting</h3>
                <p className="text-[10px] text-white/80 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  3 Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors shrink-0"
            >
              <ChevronDown className="w-5 h-5 sm:hidden" />
              <X className="w-5 h-5 hidden sm:block" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc] space-y-4 scrollbar-hide">
            <div className="text-center my-2">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                Hari Ini
              </span>
            </div>
            
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.isMine ? "items-end" : "items-start"}`}
              >
                {!msg.isMine && (
                  <span className="text-[10px] font-semibold text-slate-500 mb-1 ml-1 flex items-center gap-1">
                    {msg.sender} <span className="font-normal opacity-60">({msg.role})</span>
                  </span>
                )}
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                    msg.isMine 
                      ? "bg-[#0d9488] text-white rounded-br-sm" 
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
                <span className="text-[9px] font-medium text-slate-400 mt-1 mx-1">
                  {msg.time}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-2 relative">
              <input 
                type="text" 
                placeholder="Ketik pesan..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 bg-slate-100 text-slate-800 text-sm rounded-full py-3.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 transition-all placeholder:text-slate-400"
              />
              <button 
                type="submit"
                disabled={!inputMsg.trim()}
                className={`absolute right-1.5 p-2 rounded-full transition-all duration-200 flex items-center justify-center ${
                  inputMsg.trim() 
                    ? "bg-[#0d9488] text-white shadow-md hover:scale-105" 
                    : "bg-transparent text-slate-400"
                }`}
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
