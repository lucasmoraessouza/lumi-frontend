import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Bounce, ToastContainer } from "react-toastify";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </StrictMode>
    <ToastContainer
      className="z-50"
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Bounce}
      closeButton={false}
      limit={3}
    />
  </QueryClientProvider>
);
