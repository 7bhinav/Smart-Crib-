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
  const bottomRef = useRef(null);

  const sendMessage = async (text) => {
    if (!text?.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    
    // Add thinking message
    setMessages((m) => [...m, { role: 'assistant', content: 'Thinking...' }]);
    
    try {
      console.log('Sending message to /api/chat');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMsg = errorData.error || `HTTP ${response.status}`;
        console.error('API error response:', errorData);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log('API response:', data);
      const answer = data.reply || 'No response available.';
      
      setMessages((m) => {
        const updated = [...m];
        updated[updated.length - 1] = { role: 'assistant', content: answer };
        return updated;
      });
    } catch (err) {
      console.error('Chat API error:', err.message, err);
      const errorMsg = err.message || 'Unknown error occurred';
      setMessages((m) => {
        const updated = [...m];
        updated[updated.length - 1] = { role: 'assistant', content: `Error: ${errorMsg}. Please check the browser console for details.` };
        return updated;
      });
    }
  };

  useEffect(() => {
    if (open) {
      const init = initialContext;
      if (init) {
        setMessages((m) => [...m, { role: 'user', content: init }]);
        sendMessage(init);
      } else {
        const greeting = `Hi there. Current vitals - Heart: ${vitals?.heartRate ?? 'N/A'} BPM, O2: ${vitals?.oxygenSaturation ?? 'N/A'}%, Temp: ${vitals?.bodyTemperature ?? 'N/A'}F. How can I help?`;
        setMessages((m) => [...m, { role: 'assistant', content: greeting }]);
      }
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-card rounded-lg border border-border shadow-xl overflow-hidden flex flex-col">
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
          <button className="p-2 rounded-md" onClick={onClose} aria-label="Close chat">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {messages.filter(m => m.role !== 'system').map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-md ${m.role === 'user' ? 'bg-primary text-white' : 'bg-muted/60 text-foreground'}`}>
                <div className="text-sm whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-border flex items-center gap-2">
          <input
            className="flex-1 bg-popover border border-border rounded-md p-2 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about baby care..."
            aria-label="Chat input"
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
