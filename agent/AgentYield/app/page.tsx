"use client";

import { useAgent } from "./hooks/useAgent";
import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, LineChart, Shield, Wallet, Menu, X, ChevronRight, Hexagon, ArrowUpRight, Sparkles, Activity,Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

function App() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isThinking } = useAgent();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSendMessage = async () => {
    if (!input.trim() || isThinking) return;
    const message = input;
    setInput("");
    await sendMessage(message);
  };

  const navigationItems = [
    { name: 'Dashboard', icon: LineChart },
    { name: 'Portfolio', icon: Wallet },
    { name: 'Risk Analysis', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
    {/* Header */}
    <header className="glass fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <Hexagon className="w-8 h-8 text-white rotate-90 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.25} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse-slow" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-50">
                  <div className="w-4 h-4 bg-white/10 rounded-full animate-ping" />
                </div>
              </div>
              <h1 className="text-3xl font-light tracking-tighter text-gradient">
                yield<span className="font-bold">seeker</span>
              </h1>
            </div>
            <nav className="hidden md:ml-12 md:flex md:space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className="group flex items-center text-white/60 hover:text-white px-3 py-1.5 text-sm font-medium tracking-wide transition-all duration-300 glass-hover rounded-lg"
                >
                  <item.icon className="w-4 h-4 mr-2 group-hover:text-white transition-colors" />
                  {item.name}
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500" />
                </a>
              ))}
            </nav>
          </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl text-white/60 hover:text-white glass-hover transition-all"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden glass border-t border-white/5">
            <div className="px-3 pt-3 pb-4 space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className="flex items-center text-white/60 hover:text-white glass-hover px-4 py-3 rounded-xl text-base font-medium tracking-wide transition-all"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 pt-32">
        <div className="w-full max-w-4xl h-[calc(100vh-10rem)] glass rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="px-8 py-6 glass border-b border-white/[0.02]">
            <div className="flex items-center">
              <div className="relative flex items-center justify-center w-12 h-12">
                <Bot className="w-6 h-6 text-white/80" strokeWidth={1.5} />
                <div className="absolute inset-0 bg-white/5 rounded-xl animate-pulse-slow"></div>
                <div className="absolute top-0 right-0">
                  {/* <div className="relative">
                    <div className="w-2.5 h-2.5 bg-emerald-500/80 rounded-full"></div>
                    <div className="absolute inset-0 bg-emerald-500/50 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-pulse"></div>
                  </div> */}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-light text-white/90 tracking-tight flex items-center space-x-3">
                    <span>AI Yield Assistant</span>
                    {/* <Sparkles className="w-4 h-4 text-white/40" /> */}
                  </h2>
                  <div className="flex items-center space-x-2 text-emerald-500/80">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium tracking-wide">LIVE</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="h-1 w-1 rounded-full bg-emerald-500/60"></div>
                  <p className="text-sm text-white/50 tracking-wide">Real-time market analysis & yield optimization</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto space-y-6 p-8 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} message-enter message-enter-active`}
              >
                <div
                  className={`max-w-[80%] p-6 rounded-2xl shadow-lg
                    ${msg.sender === 'user' 
                      ? 'bg-white text-black ml-8' 
                      : 'glass text-white/90 mr-8'
                    } transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="leading-relaxed tracking-wide" {...props} />,
                      a: ({node, ...props}) => (
                        <a
                          {...props}
                          className="text-white/80 hover:text-white underline transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            
            {isThinking && (
              <div className="flex items-center space-x-3 text-white/50 pl-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm animate-pulse tracking-wide">Analyzing ...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 glass">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                className="flex-grow px-6 py-4 rounded-2xl glass text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all tracking-wide"
                placeholder="Ask about portfolio and yield opportunities..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
                disabled={isThinking}
              />
              <button
                onClick={onSendMessage}
                disabled={isThinking}
                className={`p-4 rounded-2xl transition-all duration-300 flex items-center justify-center
                  ${isThinking
                    ? 'glass cursor-not-allowed'
                    : 'bg-white text-black hover:bg-white/90 active:scale-95 hover:scale-105'
                  }`}
              >
                <Send className={`w-5 h-5 ${isThinking ? 'text-white/50' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Hexagon className="w-4 h-4 text-white/90 rotate-90" strokeWidth={1.5} />
                <span className="text-white/90 font-light tracking-tighter">Agent<span className="font-bold">Yield</span></span>
              </div>
              <span className="text-white/20">|</span>
              <span className="text-white/50 text-sm tracking-wide">Optimizing DeFi yields with AI</span>
            </div>
            <div className="flex space-x-10">
              <a href="#" className="text-white/50 hover:text-white text-sm transition-colors tracking-wide">Terms</a>
              <a href="#" className="text-white/50 hover:text-white text-sm transition-colors tracking-wide">Privacy</a>
              <a href="#" className="text-white/50 hover:text-white text-sm transition-colors tracking-wide">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;