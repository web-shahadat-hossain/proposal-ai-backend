import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import TemplateSelector from "./components/TemplateSelector";
import ProposalForm from "./components/ProposalForm";
import PreviewModal from "./components/PreviewModal";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProposalDetail from "./pages/ProposalDetail";
import NotFound from "./pages/NotFound";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedProposal, setGeneratedProposal] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Update theme based on dark mode
  const currentTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/create"
            element={
              !selectedTemplate ? (
                <TemplateSelector onSelect={setSelectedTemplate} />
              ) : (
                <ProposalForm
                  templateId={selectedTemplate}
                  onSuccess={setGeneratedProposal}
                  onReset={() => setSelectedTemplate(null)}
                />
              )
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/proposals/:id" element={<ProposalDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {generatedProposal && (
          <PreviewModal
            proposal={generatedProposal}
            onClose={() => setGeneratedProposal(null)}
          />
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
