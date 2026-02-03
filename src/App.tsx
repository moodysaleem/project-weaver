import React from "react";
import { Routes, Route } from "react-router-dom";

import { Shell } from "@/components/Shell";

import Index from "@/pages/Index";
import Immigration from "@/pages/Immigration";
import Verify from "@/pages/Verify";
import WorldCup from "@/pages/WorldCup";
import Toronto from "@/pages/Toronto";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Index />} />
<Route path="/worldcup/toronto" element={<Toronto />} />

        {/* Main sections */}
        <Route path="/immigration" element={<Immigration />} />
        <Route path="/verify" element={<Verify />} />

        {/* World Cup */}
        <Route path="/worldcup" element={<WorldCup />} />
        <Route path="/worldcup/toronto" element={<Toronto />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  );
}
