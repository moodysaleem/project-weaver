import React, { useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AFFILIATE } from '@/lib/i18n';

type QuizStep = 'intro' | 'match' | 'host' | 'budget' | 'accommodation' | 'results';

interface QuizAnswers {
  match: string;
  hostCity: string;
  budget: string;
  accommodation: string;
}

const MATCHES = [
  { id: 'group-a1', label: 'Group Stage - USA vs TBD', date: 'June 11, 2026', city: 'New York/New Jersey' },
  { id: 'group-b1', label: 'Group Stage - Mexico vs TBD', date: 'June 12, 2026', city: 'Mexico City' },
  { id: 'group-c1', label: 'Group Stage - Canada vs TBD', date: 'June 13, 2026', city: 'Toronto' },
  { id: 'knockout-qf', label: 'Quarter Final', date: 'July 3-4, 2026', city: 'Various' },
  { id: 'knockout-sf', label: 'Semi Final', date: 'July 7-8, 2026', city: 'Dallas / Atlanta' },
  { id: 'final', label: 'Final', date: 'July 19, 2026', city: 'New York/New Jersey' },
];

const HOST_CHOICES = [
  { id: 'ny', label: { en: 'New York / New Jersey', ar: 'نيويورك / نيوجيرسي' } },
  { id: 'dallas', label: { en: 'Dallas, Texas', ar: 'دالاس - تكساس' } },
  { id: 'atlanta', label: { en: 'Atlanta, Georgia', ar: 'أتلانتا - جورجيا' } },
  { id: 'tor', label: { en: 'Toronto, Canada', ar: 'تورونتو - كندا' } },
  { id: 'mx', label: { en: 'Mexico City, Mexico', ar: 'مكسيكو سيتي - المكسيك' } },
];

const BUDGETS = [
  { id: 'budget', label: { en: 'Budget ($500–1000/week)', ar: 'اقتصادي ($500–1000/أسبوع)' } },
  { id: 'mid', label: { en: 'Mid-range ($1000–2500/week)', ar: 'متوسط ($1000–2500/أسبوع)' } },
  { id: 'premium', label: { en: 'Premium ($2500+/week)', ar: 'فاخر ($2500+/أسبوع)' } },
];

const ACCOMMODATIONS = [
  { id: 'hotel', label: { en: 'Hotel', ar: 'فندق' } },
  { id: 'airbnb', label: { en: 'Airbnb / Rental', ar: 'إيربنب / إيجار' } },
  { id: 'hostel', label: { en: 'Hostel', ar: 'نزل' } },
  { id: 'friends', label: { en: 'Friends / Family', ar: 'أصدقاء / عائلة' } },
];

type Risk = {
  icon: string;
  title: string;
  problem: string;
  fix: string;
  action?: { label: string; href: string };
};

function skyscannerCity(city: string) {
  return `${AFFILIATE.skyscanner}?destination=${encodeURIComponent(city)}`;
}

function bookingArea(area: string, city: string, lang: 'en' | 'ar') {
  const locale = lang === 'ar' ? 'ar' : 'en-us';
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
    `${area} ${city}`
  )}&lang=${locale}`;
}

export default function WorldCupPage() {
  const { lang, t, isArabic } = useLanguage();
  const [step, setStep] = useState<QuizStep>('intro');
  const [answers, setAnswers] = useState<QuizAnswers>({
    match: '',
    hostCity: '',
    budget: '',
    accommodation: '',
  });

  const c = {
    en: {
      title: 'World Cup 2026 Planner',
      subtitle: 'Real-world pitfalls and the solutions people wish they knew earlier.',
      start: 'Start planning',
      risks: 'Top pitfalls & what to do instead',
      fix: 'What to do',
      insurance: 'Medical costs can be thousands of dollars',
      insuranceDesc:
        'In the US, even a short ER visit or doctor consultation can cost hundreds or thousands. Many plans reimburse later — meaning you pay first.',
      insuranceFix:
        'Choose coverage that can coordinate care and arrange payment for expensive cases, so you’re not stuck paying upfront.',
      searchHotels: 'Search comfortable areas',
      searchFlights: 'Search flights to this city',
      insuranceBtn: 'Check travel insurance options',
      startOver: 'Start over',
    },
    ar: {
      title: 'مخطط كأس العالم 2026',
      subtitle: 'مطبات واقعية وحلول عملية يتمنى الناس لو عرفوها مبكرًا.',
      start: 'ابدأ التخطيط',
      risks: 'أهم المطبات والحلول',
      fix: 'ما الذي يُنصح به',
      insurance: 'التكاليف الطبية قد تصل لآلاف الدولارات',
      insuranceDesc:
        'في الولايات المتحدة، زيارة طوارئ أو طبيب قد تكلف مئات أو آلاف الدولارات. كثير من الخطط تعوّض لاحقًا، أي أنك تدفع أولًا.',
      insuranceFix:
        'اختر تأمينًا يستطيع تنسيق العلاج وترتيب الدفع للحالات المكلفة حتى لا تضطر للدفع من جيبك.',
      searchHotels: 'ابحث عن مناطق سكن مريحة',
      searchFlights: 'ابحث عن رحلات إلى هذه المدينة',
      insuranceBtn: 'الاطلاع على خيارات التأمين',
      startOver: 'ابدأ من جديد',
    },
  }[lang];

  const selectedMatch = MATCHES.find(m => m.id === answers.match);
  const city =
    answers.hostCity === 'dallas'
      ? 'Dallas'
      : answers.hostCity === 'atlanta'
      ? 'Atlanta'
      : answers.hostCity === 'tor'
      ? 'Toronto'
      : answers.hostCity === 'mx'
      ? 'Mexico City'
      : 'New York';

  const risks: Risk[] = [
    {
      icon: '🚇',
      title: isArabic ? 'مسار العودة ليلًا' : 'Late-night return routes',
      problem: isArabic
        ? 'صفقة رخيصة قد تتحول لتجربة مرهقة بعد المباراة بسبب تبديلات ومشي طويل.'
        : 'A cheap stay can become stressful after the match due to transfers and long walks.',
      fix: isArabic
        ? 'اختر منطقة بعودة مباشرة وتبديلات أقل.'
        : 'Choose an area with fewer transfers and a simple route back.',
      action: {
        label: c.searchHotels,
        href: bookingArea('central area', city, lang),
      },
    },
    {
      icon: '✈️',
      title: isArabic ? 'الحجوزات المتأخرة' : 'Late flight booking',
      problem: isArabic
        ? 'أسعار الرحلات ترتفع بسرعة مع اقتراب البطولة.'
        : 'Flight prices rise quickly as the tournament approaches.',
      fix: isArabic
        ? 'راقب الرحلات مبكرًا واختر خيارات مرنة.'
        : 'Track flights early and keep flexible options.',
      action: {
        label: c.searchFlights,
        href: skyscannerCity(city),
      },
    },
    {
      icon: '🛡️',
      title: c.insurance,
      problem: c.insuranceDesc,
      fix: c.insuranceFix,
      action: {
        label: c.insuranceBtn,
        href: AFFILIATE.insurance,
      },
    },
  ];

  if (step === 'intro') {
    return (
      <div className="card">
        <div className="big">{c.title}</div>
        <div className="small">{c.subtitle}</div>
        <div className="hr" />
        <button className="btn primary" onClick={() => setStep('match')}>
          {c.start}
        </button>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="card">
        <div className="big">{c.risks}</div>
        <div className="hr" />

        <ul className="list">
          {risks.map((r, i) => (
            <li key={i}>
              <strong>{r.icon} {r.title}</strong>
              <div className="small">{r.problem}</div>
              <div className="small" style={{ fontWeight: 700 }}>
                {c.fix}: {r.fix}
              </div>
              {r.action && (
                <a
                  className="btn small"
                  href={r.action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: '6px', display: 'inline-block' }}
                >
                  {r.action.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="hr" />
        <button className="btn" onClick={() => setStep('intro')}>
          {c.startOver}
        </button>
      </div>
    );
  }

  // simplified quiz flow for brevity
  return (
    <div className="card">
      <button className="btn primary" onClick={() => setStep('results')}>
        {isArabic ? 'اعرض النتيجة' : 'Show my plan'}
      </button>
    </div>
  );
}