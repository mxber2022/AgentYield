"use client";

import { useAgent } from "./hooks/useAgent";
import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, LineChart, Shield, Wallet, Menu, X, ChevronRight, Hexagon, ArrowUpRight, Sparkles, Activity,Bot, Coins, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';


interface TokenFormData {
  name: string;
  symbol: string;
  initialSupply?: string;
  maxSupply?: string;
  baseUri?: string;
}

interface TokenModalProps {
  type: 'ERC20' | 'ERC721' | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: 'ERC20' | 'ERC721', data: TokenFormData) => void;
}

const TokenModal: React.FC<TokenModalProps> = ({ type, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<TokenFormData>({
    name: '',
    symbol: '',
    initialSupply: '',
    maxSupply: '',
    baseUri: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type) {
      onSubmit(type, formData);
      setFormData({
        name: '',
        symbol: '',
        initialSupply: '',
        maxSupply: '',
        baseUri: ''
      });
    }
  };

  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a1a1a] rounded-2xl w-full max-w-lg p-8 shadow-2xl border border-white/10">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          {type === 'ERC20' ? <Coins className="w-6 h-6" /> : <Square className="w-6 h-6" />}
          Create {type} Token
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 mb-1">Token Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., My Token" 
              className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:border-white/40 focus:outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block text-white/80 mb-1">Token Symbol</label>
            <input 
              type="text" 
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="e.g., MTK" 
              className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:border-white/40 focus:outline-none" 
              required 
            />
          </div>
          {type === 'ERC20' ? (
            <div>
              <label className="block text-white/80 mb-1">Initial Supply</label>
              <input 
                type="number" 
                name="initialSupply"
                value={formData.initialSupply}
                onChange={handleChange}
                placeholder="e.g., 1000000" 
                className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:border-white/40 focus:outline-none" 
                required 
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-white/80 mb-1">Collection Size (Max Supply)</label>
                <input 
                  type="number" 
                  name="maxSupply"
                  value={formData.maxSupply}
                  onChange={handleChange}
                  placeholder="e.g., 10000" 
                  className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:border-white/40 focus:outline-none" 
                  required 
                />
              </div>
              <div>
                <label className="block text-white/80 mb-1">Base URI</label>
                <input 
                  type="text" 
                  name="baseUri"
                  value={formData.baseUri}
                  onChange={handleChange}
                  placeholder="e.g., https://api.example.com/metadata/" 
                  className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:border-white/40 focus:outline-none" 
                  required 
                />
              </div>
            </>
          )}

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-all duration-300"
            >
              Deploy Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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

  const suggestionChips = [
    "Show highest APY",
    // "Compare risks",
    "Latest opportunities",
    "Portfolio analysis",
    "Mint ERC-20 Token",
    "Mint ERC-721 NFT"
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTokenType, setActiveTokenType] = useState<'ERC20' | 'ERC721' | null>(null);
  
  const handleSuggestionClick = (suggestion: string) => {
    
   // setInput(suggestion);

    switch (suggestion) {
      case "Mint ERC-20 Token":
        setActiveTokenType('ERC20');
        setIsModalOpen(true);
        break;
      case "Mint ERC-721 NFT":
        setActiveTokenType('ERC721');
        setIsModalOpen(true);
        break;
      default:
        setInput(suggestion);
    }
   
  }

  async function handleTokenFormSubmit() {

  }

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
                Vault<span className="font-bold">AI</span>
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
                    <span>Your personal AI Assistant</span>
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
          <div className="flex-grow overflow-y-auto space-y-6 p-8 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`flex ${
        msg.sender === 'user' ? 'justify-end' : 'justify-start'
      } message-enter message-enter-active`}
    >
      <div
        className={`max-w-[80%] p-6 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:scale-[1.02] ${
          msg.sender === 'user'
            ? 'bg-white text-black ml-8'
            : 'glass text-white/90 mr-8'
        }`}
      >
        <ReactMarkdown
          components={{
            p: ({ node, ...props }) => (
              <p className="leading-relaxed tracking-wide" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a
                {...props}
                className="text-white/80 hover:text-white underline transition-colors duration-200 ease-in-out"
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


           {/* Suggestion Chips */}
           <div className="px-6 py-3 glass border-t border-white/[0.02]">
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-2">
              {suggestionChips.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isThinking}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm transition-all duration-300
                    ${isThinking
                      ? 'text-white/30 bg-white/5 cursor-not-allowed'
                      : 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10 active:scale-95'
                    }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 glass">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                className="flex-grow px-6 py-4 rounded-2xl glass text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all tracking-wide"
                placeholder="Ask me anything to do..."
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
                <span className="text-white/90 font-light tracking-tighter">Vault<span className="font-bold">AI</span></span>
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

        {/* Token Creation Modal */}
        <TokenModal
        type={activeTokenType}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveTokenType(null);
        }}
        onSubmit={handleTokenFormSubmit}
      />
    </div>
    
  );
}

export default App;