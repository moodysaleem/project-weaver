// Affiliate links (placeholders until approved)
export const AFFILIATE = {
  booking: "https://www.booking.com/",
  skyscanner: "https://www.skyscanner.net/",
  insurance: "https://safetywing.com/",
  tours: "https://www.getyourguide.com/",
  languageTest: {
    en: "https://www.efset.org/",
    de: "https://www.goethe.de/en/spr/kup/tsd.html",
    fr: "https://www.delfdalf.fr/",
    sv: "https://dialangweb.lancaster.ac.uk/"
  },
  languageLearn: {
    en: "https://www.duolingo.com/",
    de: "https://www.dw.com/en/learn-german/s-2469",
    fr: "https://www.tv5monde.com/",
    sv: "https://www.duolingo.com/"
  }
};

export type Language = 'en' | 'ar';

export interface I18NStrings {
  site_name: string;
  site_tagline: string;
  nav_home: string;
  nav_move: string;
  nav_verify: string;
  nav_wc: string;
  disclaimer: string;
  open: string;
}

export const I18N: Record<Language, I18NStrings> = {
  en: {
    site_name: "AtlasBorder",
    site_tagline: "Calm, practical tools for cross‑border decisions.",
    nav_home: "Home",
    nav_move: "Immigration / Relocation",
    nav_verify: "Application Validation",
    nav_wc: "WorldCup 2026 Planner",
    disclaimer: "Disclaimer: informational only, not legal advice. Always verify with official sources.",
    open: "Open"
  },
  ar: {
    site_name: "أطلس بوردر",
    site_tagline: "أدوات هادئة وعملية لقرارات السفر والانتقال عبر الحدود.",
    nav_home: "الرئيسية",
    nav_move: "الهجرة / الانتقال",
    nav_verify: "فحص الطلب قبل الإرسال",
    nav_wc: "مخطط كأس العالم 2026",
    disclaimer: "تنبيه: معلومات عامة وليست استشارة قانونية. تحقق دائماً من المصادر الرسمية.",
    open: "افتح"
  }
};

export function getUiLang(): Language {
  const stored = localStorage.getItem("uiLang");
  return (stored === "ar" ? "ar" : "en") as Language;
}

export function setUiLang(lang: Language): void {
  localStorage.setItem("uiLang", lang);
}

export function applyLangToDocument(lang: Language): void {
  const html = document.documentElement;
  html.setAttribute("data-lang", lang);
  if (lang === "ar") {
    html.setAttribute("lang", "ar");
    html.setAttribute("dir", "rtl");
  } else {
    html.setAttribute("lang", "en");
    html.setAttribute("dir", "ltr");
  }
}
