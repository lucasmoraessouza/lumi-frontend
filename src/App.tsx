import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppSidebar } from "./components/app-sidebar";
import Dashboard from "./pages/dashboard";
import Invoices from "./pages/invoices";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <ModeToggle />

      <Router>
        <div className="flex w-full">
          <AppSidebar />
          <div className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/invoices" element={<Invoices />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}