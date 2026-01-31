import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AFFILIATE } from '@/lib/i18n';

type QuizStep = 'intro' | 'match' | 'budget' | 'accommodation' | 'results';

interface QuizAnswers {
  match: string;
  budget: string; // budget | mid | premium
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

const BUDGETS = [
  { id: 'budget', label: { en: 'Budget ($500-1000/week)', ar: 'اقتصادي ($500-1000/أسبوع)' } },
  { id: 'mid', label: { en: 'Mid-range ($1000-2500/week)', ar: 'متوسط ($1000-2500/أسبوع)' } },
  { id: 'premium', label: { en: 'Premium ($2500+/week)', ar: 'فاخر ($2500+/أسبوع)' } },
];

const ACCOMMODATIONS = [
  { id: 'hotel', label: { en: 'Hotel', ar: 'فندق' } },
  { id: 'airbnb', label: { en: 'Airbnb / Rental', ar: 'إيربنب / إيجار' } },
  { id: 'hostel', label: { en: 'Hostel', ar: 'نزل' } },
  { id: 'friends', label: { en: 'Staying with friends/family', ar: 'مع أصدقاء/عائلة' } },
];

type RiskItem = {
  title: string;
  body: string;
  icon: string;
};

export default function WorldCupPage() {
  const { lang, t, isArabic } = useLanguage();
  const [step, setStep] = useState<QuizStep>('intro');
  const [answers, setAnswers] = useState<QuizAnswers>({
    match: '',
    budget: '',
    accommodation: '',
  });

  const content = {
    en: {
      title: 'WorldCup 2026 Planner',
      subtitle: 'Plan your match-week calmly with practical steps.',
      start: 'Start Planning',
      matchQuestion: 'Which match are you planning to attend?',
      budgetQuestion: 'What\'s your weekly budget for the trip?',
      accommodationQuestion: 'Where do you prefer to stay?',
      next: 'Next',
      back: 'Back',
      seeResults: 'See My Plan',
      resultsTitle: 'Your Match-Week Plan',
      selectedMatch: 'Selected Match',
      yourBudget: 'Your Budget',
      stayType: 'Accommodation',
      nextSteps: 'Recommended Next Steps',
      bookFlights: 'Book flights early',
      bookAccommodation: 'Reserve accommodation',
      travelInsurance: 'Get travel insurance',
      localTours: 'Browse local tours',
      usefulLinks: 'Useful Links',
      startOver: 'Start Over',

      // NEW
      risksTitle: 'Your Top 3 Risks (based on your answers)',
      risksSubtitle: 'These are the things that most often cause stress or extra cost during match week.',
      linkHint: 'If you want, use the links below after you review the risks.',
    },
    ar: {
      title: 'مخطط كأس العالم 2026',
      subtitle: 'خطط لأسبوع المباراة بهدوء مع خطوات عملية.',
      start: 'ابدأ التخطيط',
      matchQuestion: 'أي مباراة تخطط لحضورها؟',
      budgetQuestion: 'ما هي ميزانيتك الأسبوعية للرحلة؟',
      accommodationQuestion: 'أين تفضل الإقامة؟',
      next: 'التالي',
      back: 'رجوع',
      seeResults: 'اعرض خطتي',
      resultsTitle: 'خطة أسبوع المباراة',
      selectedMatch: 'المباراة المختارة',
      yourBudget: 'ميزانيتك',
      stayType: 'الإقامة',
      nextSteps: 'الخطوات التالية الموصى بها',
      bookFlights: 'احجز الطيران مبكراً',
      bookAccommodation: 'احجز الإقامة',
      travelInsurance: 'احصل على تأمين السفر',
      localTours: 'تصفح الجولات المحلية',
      usefulLinks: 'روابط مفيدة',
      startOver: 'ابدأ من جديد',

      // NEW
      risksTitle: 'أهم 3 أمور قد تُفاجئك (حسب إجاباتك)',
      risksSubtitle: 'هذه الأمور غالبًا ما تسبب توترًا أو تكاليف إضافية خلال أسبوع المباراة.',
      linkHint: 'إذا أحببت، استخدم الروابط أدناه بعد مراجعة النقاط المهمة.',
    }
  };

  const c = content[lang];

  const steps: QuizStep[] = ['match', 'budget', 'accommodation'];
  const currentStepIndex = steps.indexOf(step);

  const handleSelect = (field: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const goNext = () => {
    if (step === 'intro') setStep('match');
    else if (step === 'match' && answers.match) setStep('budget');
    else if (step === 'budget' && answers.budget) setStep('accommodation');
    else if (step === 'accommodation' && answers.accommodation) setStep('results');
  };

  const goBack = () => {
    if (step === 'match') setStep('intro');
    else if (step === 'budget') setStep('match');
    else if (step === 'accommodation') setStep('budget');
    else if (step === 'results') setStep('accommodation');
  };

  const startOver = () => {
    setAnswers({ match: '', budget: '', accommodation: '' });
    setStep('intro');
  };

  const selectedMatch = MATCHES.find(m => m.id === answers.match);
  const selectedBudget = BUDGETS.find(b => b.id === answers.budget);
  const selectedAccommodation = ACCOMMODATIONS.find(a => a.id === answers.accommodation);

  // ✅ NEW: derive "Top 3 risks" based on the user's choices
  const topRisks: RiskItem[] = useMemo(() => {
    const risks: RiskItem[] = [];

    // 1) Accommodation risk (varies by budget & accommodation type)
    if (answers.budget === 'budget' || answers.accommodation === 'hostel' || answers.accommodation === 'friends') {
      risks.push({
        icon: '🏨',
        title: isArabic ? 'قيود الإقامة خلال أسبوع المباراة' : 'Accommodation constraints during match week',
        body: isArabic
          ? 'خلال كأس العالم ترتفع الأسعار وقد تفرض الفنادق حدًا أدنى لعدد الليالي. ابحث عن خيارات مرنة مبكرًا وتأكد من سياسة الإلغاء.'
          : 'Prices rise and many places enforce minimum-night stays. Look for flexible options early and check cancellation rules.',
      });
    } else {
      risks.push({
        icon: '🏨',
        title: isArabic ? 'ارتفاع الأسعار سريعًا' : 'Prices can spike quickly',
        body: isArabic
          ? 'حتى مع ميزانية متوسطة/عالية، الأسعار قد ترتفع بسرعة قرب المباريات. ضع خيارين بديلين في أحياء مختلفة.'
          : 'Even with mid/high budget, prices can jump near match days. Keep 2 backup neighborhoods in mind.',
      });
    }

    // 2) Transport / match-day congestion (always relevant)
    risks.push({
      icon: '🚇',
      title: isArabic ? 'الازدحام والتنقل يوم المباراة' : 'Match-day transport congestion',
      body: isArabic
        ? 'المواصلات تكون مزدحمة جدًا وقد تُغلق بعض المناطق جزئيًا. لا تختر سكنًا بعيدًا فقط لأنه أرخص—قد تخسر وقتًا وراحة.'
        : 'Transport is often overloaded and some zones can be restricted. Don’t stay far only because it’s cheaper—you may pay in time and stress.',
    });

    // 3) Entry / documentation surprises (always relevant)
    risks.push({
      icon: '🛂',
      title: isArabic ? 'متطلبات دخول قد لا تنتبه لها' : 'Hidden entry requirements',
      body: isArabic
        ? 'حتى بدون تأشيرة، قد توجد شروط مثل مدة صلاحية الجواز أو تصاريح عبور أو إثبات تذكرة عودة. تحقق مبكرًا لتجنب مفاجآت.'
        : 'Even visa-free travel can require passport validity, transit authorizations, or return-ticket proof. Check early to avoid surprises.',
    });

    // Optional 4th risk: budget clarity (we won’t show it unless needed)
    // We keep it simple: top 3 only.

    return risks.slice(0, 3);
  }, [answers.budget, answers.accommodation, isArabic]);

  if (step === 'intro') {
    return (
      <div className="card">
        <div className="kicker">{t.nav_wc}</div>
        <div className="big">{c.title}</div>
        <div className="small">{c.subtitle}</div>
        <div className="hr"></div>
        <button className="btn primary" onClick={goNext}>
          {c.start}
        </button>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="card">
        <div className="kicker">{t.nav_wc}</div>
        <div className="big">{c.resultsTitle}</div>
        <div className="hr"></div>

        <div className="grid two" style={{ marginBottom: '16px' }}>
          <div className="result-item">
            <div className="kicker">{c.selectedMatch}</div>
            <div className="big" style={{ fontSize: '16px' }}>{selectedMatch?.label}</div>
            <div className="small">{selectedMatch?.date} • {selectedMatch?.city}</div>
          </div>
          <div className="result-item">
            <div className="kicker">{c.yourBudget}</div>
            <div className="big" style={{ fontSize: '16px' }}>{selectedBudget?.label[lang]}</div>
          </div>
        </div>

        <div className="result-item" style={{ marginBottom: '16px' }}>
          <div className="kicker">{c.stayType}</div>
          <div className="big" style={{ fontSize: '16px' }}>{selectedAccommodation?.label[lang]}</div>
        </div>

        {/* ✅ NEW SECTION: Top 3 Risks */}
        <div className="card" style={{ background: 'hsl(var(--soft))', marginBottom: '12px' }}>
          <div className="kicker">{c.risksTitle}</div>
          <div className="small" style={{ marginTop: '6px' }}>{c.risksSubtitle}</div>
          <div className="hr"></div>
          <ul className="list">
            {topRisks.map((r, idx) => (
              <li key={idx}>
                <span style={{ marginInlineEnd: '8px' }}>{r.icon}</span>
                <strong>{r.title}:</strong> <span>{r.body}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card" style={{ background: 'hsl(var(--soft))' }}>
          <div className="kicker">{c.nextSteps}</div>
          <ul className="list">
            <li>✈️ {c.bookFlights}</li>
            <li>🏨 {c.bookAccommodation}</li>
            <li>🛡️ {c.travelInsurance}</li>
            <li>🎫 {c.localTours}</li>
          </ul>
        </div>

        <div className="hr"></div>

        <div className="kicker">{c.usefulLinks}</div>
        <div className="small" style={{ marginTop: '6px' }}>{c.linkHint}</div>

        <div className="grid two" style={{ marginTop: '12px' }}>
          <div className="linkcard">
            <a href={AFFILIATE.skyscanner} target="_blank" rel="noopener noreferrer">
              {isArabic ? 'Skyscanner - حجز الطيران' : 'Skyscanner - Book Flights'}
            </a>
          </div>
          <div className="linkcard">
            <a href={AFFILIATE.booking} target="_blank" rel="noopener noreferrer">
              {isArabic ? 'Booking.com - حجز الفنادق' : 'Booking.com - Book Hotels'}
            </a>
          </div>
          <div className="linkcard">
            <a href={AFFILIATE.insurance} target="_blank" rel="noopener noreferrer">
              {isArabic ? 'SafetyWing - تأمين السفر' : 'SafetyWing - Travel Insurance'}
            </a>
          </div>
          <div className="linkcard">
            <a href={AFFILIATE.tours} target="_blank" rel="noopener noreferrer">
              {isArabic ? 'GetYourGuide - جولات محلية' : 'GetYourGuide - Local Tours'}
            </a>
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <button className="btn" onClick={startOver}>
            {c.startOver}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="kicker">{t.nav_wc}</div>

      {/* Progress dots */}
      <div className="quiz-progress">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`quiz-progress-dot ${i < currentStepIndex ? 'completed' : ''} ${i === currentStepIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      {step === 'match' && (
        <>
          <div className="big">{c.matchQuestion}</div>
          <div className="hr"></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {MATCHES.map((match) => (
              <div
                key={match.id}
                className={`option ${answers.match === match.id ? 'selected' : ''}`}
                onClick={() => handleSelect('match', match.id)}
              >
                <div>
                  <div style={{ fontWeight: 900 }}>{match.label}</div>
                  <div className="small" style={{ margin: 0 }}>{match.date} • {match.city}</div>
                </div>
                {answers.match === match.id && <span className="badge ok">✓</span>}
              </div>
            ))}
          </div>
        </>
      )}

      {step === 'budget' && (
        <>
          <div className="big">{c.budgetQuestion}</div>
          <div className="hr"></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {BUDGETS.map((budget) => (
              <div
                key={budget.id}
                className={`option ${answers.budget === budget.id ? 'selected' : ''}`}
                onClick={() => handleSelect('budget', budget.id)}
              >
                <div style={{ fontWeight: 900 }}>{budget.label[lang]}</div>
                {answers.budget === budget.id && <span className="badge ok">✓</span>}
              </div>
            ))}
          </div>
        </>
      )}

      {step === 'accommodation' && (
        <>
          <div className="big">{c.accommodationQuestion}</div>
          <div className="hr"></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ACCOMMODATIONS.map((acc) => (
              <div
                key={acc.id}
                className={`option ${answers.accommodation === acc.id ? 'selected' : ''}`}
                onClick={() => handleSelect('accommodation', acc.id)}
              >
                <div style={{ fontWeight: 900 }}>{acc.label[lang]}</div>
                {answers.accommodation === acc.id && <span className="badge ok">✓</span>}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="hr"></div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
        <button className="btn" onClick={goBack}>
          {c.back}
        </button>
        <button
          className="btn primary"
          onClick={goNext}
          disabled={
            (step === 'match' && !answers.match) ||
            (step === 'budget' && !answers.budget) ||
            (step === 'accommodation' && !answers.accommodation)
          }
        >
          {step === 'accommodation' ? c.seeResults : c.next}
        </button>
      </div>
    </div>
  );
}
