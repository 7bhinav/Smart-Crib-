import React, { useState, useEffect, useRef } from 'react';
import Icon from './AppIcon';

// Local rule-based responder for on-device suggestions (no external API)
function localResponder(messages) {
  // Use the last user message or initial context
  const last = [...messages].reverse().find(m => m.role === 'user');
  const text = (last?.content || '').toLowerCase();

  // Heuristic: detect blood pressure values like "BP 150/95" or "150 mmhg"
  const bpMatch = text.match(/(\b(\d{2,3})\/(\d{2,3})\b)|((\d{2,3})\s?mmhg)/i);

  if (bpMatch) {
    // Extract numbers if available
    let systolic = null, diastolic = null;
    if (bpMatch[2] && bpMatch[3]) {
      systolic = parseInt(bpMatch[2], 10);
      diastolic = parseInt(bpMatch[3], 10);
    } else if (bpMatch[5]) {
      systolic = parseInt(bpMatch[5], 10);
    }

    const lines = [];
    lines.push('I detected elevated blood pressure readings. Follow these steps:');
    if (systolic && diastolic) {
      lines.push(`- Recent reading: ${systolic}/${diastolic} mmHg.`);
    }
    lines.push('- Re-measure after 5 minutes in a calm, seated position.');
    lines.push('- Ensure the cuff size is correct and placed on the upper arm.');
    lines.push('- If the child shows symptoms (difficulty breathing, altered consciousness, severe headache, vomiting, seizures) seek emergency care immediately.');
    lines.push('- For asymptomatic elevated readings: log values, ensure hydration, avoid stimulants, and contact the pediatrician for follow-up.');
    lines.push('- If BP remains persistently high on repeated measurements, seek urgent pediatric evaluation.');
    return lines.join('\n');
  }

  // Generic suggestions for other alerts
  if (text.includes('fever')) {
    return 'For fever: monitor temperature, encourage fluids, use age-appropriate antipyretics per pediatric guidance, and seek care if >39°C or if the child is lethargic or not feeding.';
  }

  // fallback
  return "I can't analyze that precisely without measurements. For urgent signs (difficulty breathing, persistent vomiting, seizure, unresponsiveness) seek emergency care. Otherwise document symptoms and contact the child's pediatrician.";
}

const ChatBot = ({ open, onClose, initialContext }) => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a clinical assistant for pediatric care. Provide concise, conservative, safety-first suggestions and clearly state when to seek emergency help.' },
    ...(initialContext ? [{ role: 'user', content: initialContext }] : [])
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) {
      // if there is initial context, run a first local response
      const init = initialContext;
      if (init) {
        const reply = localResponder([{ role: 'user', content: init }]);
        setMessages((m) => [...m, { role: 'assistant', content: reply }]);
      }
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!open) return null;

  const sendMessage = (text) => {
    if (!text?.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    // local response (deterministic)
    setTimeout(() => {
      const reply = localResponder([...messages, userMsg]);
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    }, 300);
  };

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
              <div className="text-xs text-muted-foreground">On-device guidance (not a substitute for medical advice)</div>
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
            placeholder="Type a question (e.g., what to do for high blood pressure?)"
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
