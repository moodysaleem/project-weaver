import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, I18N, I18NStrings, getUiLang, setUiLang, applyLangToDocument } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  t: I18NStrings;
  setLanguage: (lang: Language) => void;
  isArabic: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(getUiLang);

  useEffect(() => {
    applyLangToDocument(lang);
  }, [lang]);

  const setLanguage = (newLang: Language) => {
    setUiLang(newLang);
    setLang(newLang);
    applyLangToDocument(newLang);
  };

  const value: LanguageContextType = {
    lang,
    t: I18N[lang],
    setLanguage,
    isArabic: lang === 'ar'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
