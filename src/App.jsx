import React from "react";
import Routes from "./Routes";
import FloatingChatWidget from './components/FloatingChatWidget';
import { VitalsProvider } from './contexts/VitalsContext';

function App() {
  return (
    <VitalsProvider>
      <Routes />
      <FloatingChatWidget />
    </VitalsProvider>
  );
}

export default App;
