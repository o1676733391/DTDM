import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// For development, allow running without Clerk if key is not configured
if (!PUBLISHABLE_KEY) {
  console.warn("Clerk Publishable Key not found. Authentication will not work. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file.");
}

const AppWithProviders = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

createRoot(document.getElementById("root")).render(
  PUBLISHABLE_KEY ? (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppWithProviders />
    </ClerkProvider>
  ) : (
    <AppWithProviders />
  )
);
