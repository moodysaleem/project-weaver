import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Shell } from "@/components/Shell";
import Index from "./pages/Index";
import WorldCup from "./pages/WorldCup";
import Immigration from "./pages/Immigration";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";

const App = () => (
  <LanguageProvider>
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/worldcup" element={<WorldCup />} />
          <Route path="/immigration" element={<Immigration />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  </LanguageProvider>
);

export default App;
