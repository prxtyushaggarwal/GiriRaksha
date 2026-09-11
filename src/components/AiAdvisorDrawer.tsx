import React, { useState } from "react";
import { queryAiAdvisor } from "@/lib/api";
import { Bot, Send, Sparkles, X, Loader2, User, HelpCircle } from "lucide-react";

interface AiAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeCorridor?: string;
  selectedHazard?: any;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  provider?: string;
}

export default function AiAdvisorDrawer({
  isOpen,
  onClose,
  activeCorridor,
  selectedHazard,
}: AiAdvisorDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am **GrahRaksha AI**, calibrated on National Disaster Management Authority (NDMA), Border Roads Organisation (BRO), and ASDMA safety protocols.\n\nAsk me about mountain evacuation guidelines, real-time corridor statuses, pore-water pressure safety thresholds, or emergency helplines.",
      provider: "GrahRaksha Knowledge Core"
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await queryAiAdvisor(
        query,
        activeCorridor,
        selectedHazard,
        selectedHazard?.risk_score || undefined
      );
      const assistantMsg: Message = {
        role: "assistant",
        content: res.advice,
        provider: res.provider,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Unable to query live advisor server. Ensure backend is active.",
          provider: "Local Offline Fallback",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "What is the emergency evacuation protocol if caught in a debris slide?",
    "Status of NH-27 Guwahati-Haflong-Silchar corridor in Assam",
    "Current status and safe transit window for NH-58 Badrinath",
    "How does soil pore-water saturation trigger mountain slope failure?",
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col animate-fade-in text-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              GrahRaksha AI Advisor
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Live Telemetry
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">NDMA & BRO Mountain Transit Intelligence</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Telemetry Badge */}
      <div className="bg-slate-950 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Active Corridor: <strong className="text-cyan-400">{activeCorridor || "NH-58 / Himalayas"}</strong></span>
        {selectedHazard && (
          <span className="text-rose-400 font-semibold font-mono">
            Hazard Score: {selectedHazard.risk_score}/100
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                m.role === "user"
                  ? "bg-cyan-600 text-white font-medium"
                  : "bg-slate-800/80 border border-slate-700/60 text-slate-200"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
              {m.provider && (
                <div className="mt-2 pt-1 border-t border-slate-700/50 text-[10px] text-slate-400 font-mono">
                  Engine: {m.provider}
                </div>
              )}
            </div>
            {m.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5 items-center text-xs text-slate-400 font-mono">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            Analyzing telemetry & calculating slope safety protocol...
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40">
        <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-cyan-400" /> Suggested Protocols:
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] whitespace-nowrap border border-slate-700/80 transition-all cursor-pointer"
            >
              {p.slice(0, 35)}...
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about evacuation, road closures, slope metrics..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
