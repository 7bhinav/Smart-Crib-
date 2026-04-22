import React, { useState, useEffect, useRef } from 'react';
import Icon from './AppIcon';
import { useVitals } from '../contexts/VitalsContext';

const ChatBot = ({ open, onClose, initialContext }) => {
  const { vitals } = useVitals();

  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a clinical assistant for pediatric care.' },
    ...(initialContext ? [{ role: 'user', content: initialContext }] : [])
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // ✅ WhatsApp-style scroll
  const scrollToBottom = () => {
    const el = containerRef.current;
    if (!el) return;

    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 120;

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Streaming function (word-by-word)
  const streamText = async (text) => {
    const words = text.split(' ');
    let current = '';

    for (let i = 0; i < words.length; i++) {
      current += words[i] + ' ';

      await new Promise((res) => setTimeout(res, 25));

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: current.trim(),
        };
        return updated;
      });
    }
  };

  const sendMessage = async (text) => {
    if (!text?.trim()) return;

    const userMsg = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        const responseText = await response.text();

        let errorMsg = `HTTP ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          errorMsg = responseText || errorMsg;
        }

        throw new Error(errorMsg);
      }

      const data = await response.json();
      const answer = data.reply || 'No response available.';

      setIsTyping(false);

      // add empty message
      setMessages((m) => [...m, { role: 'assistant', content: '' }]);

      // stream response
      await streamText(answer);

    } catch (err) {
      setIsTyping(false);

      setMessages((m) => [
        ...m,
        { role: 'assistant', content: `Error: ${err.message}` }
      ]);
    }
  };

  useEffect(() => {
    if (open) {
      const init = initialContext;

      if (init) {
        setMessages((m) => [...m, { role: 'user', content: init }]);
        sendMessage(init);
      } else {
        const greeting = `Hi there! I'm your health assistant. How can I help you? You can ask me about baby care, vital signs, or when to seek medical help.`;

        setMessages((m) => [...m, { role: 'assistant', content: greeting }]);
      }
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-card rounded-lg border border-border shadow-xl flex flex-col h-[80vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <Icon name="MessageCircle" size={18} className="text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Clinical Chat Assistant</div>
              <div className="text-xs text-muted-foreground">AI-powered guidance (not medical advice)</div>
            </div>
          </div>
          <button className="p-2 rounded-md" onClick={onClose}>
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={containerRef}
          className="p-4 flex-1 overflow-y-auto space-y-3"
        >
          {messages
            .filter((m) => m.role !== 'system')
            .map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-md ${m.role === 'user' ? 'bg-primary text-white' : 'bg-muted/60 text-foreground'}`}>

                  {/* ✅ UPDATED TEXT RENDERING */}
                  <div
                    className="text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: m.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\n/g, "<br/>")
                    }}
                  />

                </div>
              </div>
            ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted/60 p-3 rounded-md flex gap-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce delay-100">•</span>
                <span className="animate-bounce delay-200">•</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border flex items-center gap-2">
          <input
            className="flex-1 bg-popover border border-border rounded-md p-2 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about baby care..."
          />
          <button type="submit" className="px-3 py-2 bg-primary text-white rounded-md">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;