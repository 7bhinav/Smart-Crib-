import React, { useState, useEffect } from 'react';
import ChatBot from './ChatBot';
import Icon from './AppIcon';
import { useVitals } from '../contexts/VitalsContext';

const FloatingChatWidget = ({ initialContext }) => {
  const [open, setOpen] = useState(false);
  const [widgetInitialContext, setWidgetInitialContext] = useState(initialContext || '');
  const { vitals, urgentEvent } = useVitals();

  useEffect(() => {
    if (urgentEvent) {
  // auto-open chat with urgent context and a short initial prompt
  setOpen(true);
  // build an initial context message describing the urgent event so ChatBot can respond immediately
  let ctx = '';
  if (urgentEvent.type === 'high-temp') ctx = `Alert: detected high temperature ${urgentEvent.value ?? ''}`;
  else if (urgentEvent.type === 'low-spo2') ctx = `Alert: detected low oxygen saturation ${urgentEvent.value ?? ''}`;
  else if (urgentEvent.type === 'high-bp') ctx = `Alert: detected high blood pressure ${urgentEvent.value ?? ''}`;
  else ctx = 'Alert: abnormal vital detected. Please advise.';
  // set initialContext on the ChatBot by re-rendering via prop
  setWidgetInitialContext(ctx);
    }
  }, [urgentEvent]);

  return (
    <>
      <div className="fixed right-4 bottom-6 z-40">
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center text-white"
          aria-label="Open chat"
        >
          <Icon name="MessageCircle" size={22} />
        </button>
      </div>

  <ChatBot open={open} onClose={() => setOpen(false)} initialContext={widgetInitialContext} />
    </>
  );
};

export default FloatingChatWidget;
