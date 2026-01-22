import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";
import "./styles/dark.css";

// Initialize theme: default to dark unless user previously selected light
const initialTheme = localStorage.getItem('theme');
if (initialTheme === 'light') {
	document.documentElement.classList.remove('dark');
} else {
	// default to dark mode
	document.documentElement.classList.add('dark');
}

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
