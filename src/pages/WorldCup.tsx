import React, { useMemo, useState } from 'react';
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
  icon: string;
  title: string;
  body: string;
};

type PitfallCard = {
  icon: string;
  title: string;
  body: string;
};

function normalizeCityKey(city?: string): 'ny' | 'mx' | 'tor' | 'dal_atl' | 'various' {
  if (!city) return 'various';
  const c = city.toLowerCase();
  if (c.includes('new york') || c.includes('new jersey')) return 'ny';
  if (c.includes('mexico')) return 'mx';
  if (c.includes('toronto')) return 'tor';
  if (c.includes('dallas') || c.includes('atlanta')) return 'dal_atl';
  return 'various';
}

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
      subtitle: 'Plan your match-week calmly with practical steps — not generic advice.',
      start: 'Start Planning',
      matchQuestion: 'Which match are you planning to attend?',
      budgetQuestion: "What's your weekly budget for the trip?",
      accommodationQuestion: 'Where do you prefer to stay?',
      next: 'Next',
      back: 'Back',
      seeResults: 'See My Plan',
      resultsTitle: 'Your Match-Week Plan',
      selectedMatch: 'Selected Match',
      yourBudget: 'Your Budget',
      stayType: 'Accommodation',
      nextSteps: 'Recommended Next Steps',
      bookFlights: 'Book flights early (prices jump as match week approaches)',
      bookAccommodation: 'Reserve accommodation with flexible cancellation',
      travelInsurance: 'Get medical coverage you can actually use on the ground',
      localTours: 'Browse local tours (optional)',
      usefulLinks: 'Useful Links',
      startOver: 'Start Over',

      // New sections
      risksTitle: 'Top 3 “things people don’t expect” (based on your answers)',
      risksSubtitle: 'This is where travelers lose time, money, or peace of mind.',
      cityPitfallsTitle: 'City-specific pitfalls (the “locals know this” part)',
      cityPitfallsSubtitle: 'These are practical traps that don’t show up in generic guides.',
      linkHint: 'Use the links below after you review the risks + city pitfalls.',
      note: 'Note: this tool is guidance, not official legal/travel advice.'
    },
    ar: {
      title: 'مخطط كأس العالم 2026',
      subtitle: 'خطّط لأسبوع المباراة بهدوء — بخطوات عملية وليست نصائح عامة.',
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
      bookFlights: 'احجز الطيران مبكراً (الأسعار ترتفع مع اقتراب أسبوع المباراة)',
      bookAccommodation: 'احجز سكنًا مع سياسة إلغاء مرنة',
      travelInsurance: 'احصل على تغطية طبية تستطيع استخدامها فعليًا هناك',
      localTours: 'تصفح جولات محلية (اختياري)',
      usefulLinks: 'روابط مفيدة',
      startOver: 'ابدأ من جديد',

      // New sections
      risksTitle: 'أهم 3 أمور “قد لا تتوقعها” (حسب إجاباتك)',
      risksSubtitle: 'هنا عادةً يخسر المسافر وقتًا أو مالًا أو راحة بال.',
      cityPitfallsTitle: 'فخاخ خاصة بالمدينة (هذه أشياء يعرفها السكان)',
      cityPitfallsSubtitle: 'نقاط عملية لا تظهر في الإرشادات العامة.',
      linkHint: 'استخدم الروابط أدناه بعد مراجعة المخاطر وفخاخ المدينة.',
      note: 'ملاحظة: هذه أداة إرشادية وليست استشارة رسمية.'
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

  const topRisks: RiskItem[] = useMemo(() => {
    const risks: RiskItem[] = [];

    const budgetLow = answers.budget === 'budget';
    const stayingBudgetish = answers.accommodation === 'hostel' || answers.accommodation === 'friends';

    // Risk 1: Accommodation trap
    if (budgetLow || stayingBudgetish) {
      risks.push({
        icon: '🏨',
        title: isArabic ? 'قيود الإقامة خلال أسبوع المباراة' : 'Accommodation constraints during match week',
        body: isArabic
          ? 'خلال كأس العالم قد تفرض أماكن كثيرة حدًا أدنى لعدد الليالي وترفع الأسعار بسرعة. ركّز على “إلغاء مرن” وخيارات بديلة قريبة من المواصلات.'
          : 'During major events, minimum-night stays and sudden price jumps are common. Prioritize “free cancellation” and keep a backup option near transit.'
      });
    } else {
      risks.push({
        icon: '🏨',
        title: isArabic ? 'ارتفاع الأسعار سريعًا' : 'Prices can spike fast (even with a good budget)',
        body: isArabic
          ? 'حتى مع ميزانية متوسطة/عالية، الأسعار قد ترتفع مع اقتراب المباراة. الأفضل حجز خيار جيد مبكرًا مع إلغاء مرن بدل الانتظار.'
          : 'Even with mid/high budget, prices often jump as match week approaches. Book a solid option early with flexible cancellation instead of waiting.'
      });
    }

    // Risk 2: Transport reality
    risks.push({
      icon: '🚇',
      title: isArabic ? 'الازدحام والتنقل يوم المباراة' : 'Match-day transport congestion',
      body: isArabic
        ? 'يوم المباراة المواصلات تكون مزدحمة وقد تُغلق مناطق. السكن “أرخص لكنه بعيد” قد يكلفك وقتًا وراحة أكثر من المال.'
        : 'On match days, transit gets crowded and some zones can be restricted. “Cheap but far” can cost you more in time and stress than money.'
    });

    // Risk 3: Entry & documents
    risks.push({
      icon: '🛂',
      title: isArabic ? 'متطلبات دخول قد لا تنتبه لها' : 'Hidden entry requirements',
      body: isArabic
        ? 'حتى لو كانت وجهتك بدون تأشيرة، قد تحتاج شروطًا مثل صلاحية الجواز، تصاريح عبور، أو إثبات تذكرة عودة. افحصها مبكرًا لتجنب مفاجآت.'
        : 'Even visa-free travel can still require passport validity rules, transit authorizations, or return-ticket proof. Check early to avoid surprises.'
    });

    return risks.slice(0, 3);
  }, [answers.budget, answers.accommodation, isArabic]);

  const cityPitfalls: PitfallCard[] = useMemo(() => {
    const cityKey = normalizeCityKey(selectedMatch?.city);

    const T = (en: string, ar: string) => (isArabic ? ar : en);

    if (cityKey === 'ny') {
      return [
        {
          icon: '🗺️',
          title: T('“Close on the map” can feel far at night', 'القرب على الخريطة لا يعني سهولة أو راحة ليلًا'),
          body: T(
            'NYC area stays can look “10 minutes away” but become stressful late night (transfers, long walks, empty platforms). Aim for simple routes and well-lit streets.',
            'قد يبدو السكن “قريبًا” لكن يصبح مرهقًا ليلًا (تبديل خطوط، مشي طويل، محطات فارغة). اختر مسارًا بسيطًا وشوارع مضيئة.'
          )
        },
        {
          icon: '💳',
          title: T('Use OMNY fare capping instead of guessing tickets', 'استخدم حدّ OMNY الأسبوعي بدل الحيرة بالتذاكر'),
          body: T(
            'In NYC, OMNY has a weekly fare cap concept (you stop paying after a threshold). It’s often simpler than planning passes in advance.',
            'في نيويورك، نظام OMNY فيه “حد أسبوعي” (تتوقف عن الدفع بعد حد معين). غالبًا أسهل من شراء باقات مسبقًا.'
          )
        },
        {
          icon: '⏱️',
          title: T('Build “buffer time” for match day', 'ضع وقتًا احتياطيًا يوم المباراة'),
          body: T(
            'Even locals add buffer time on event days. Plan to arrive earlier than you think, especially if you have kids or multiple transfers.',
            'حتى السكان يضيفون وقتًا احتياطيًا في أيام الفعاليات. خطط للوصول مبكرًا خصوصًا مع الأطفال أو تبديلات متعددة.'
          )
        }
      ];
    }

    if (cityKey === 'mx') {
      return [
        {
          icon: '🚇',
          title: T('Rush-hour crowding is real', 'الازدحام في أوقات الذروة حقيقي'),
          body: T(
            'Mexico City transit can be extremely crowded at peak times. If your family is not used to it, plan travel outside rush hours when possible.',
            'مواصلات مكسيكو سيتي قد تكون مزدحمة جدًا في الذروة. إن لم تكن العائلة معتادة، حاول تجنب الذروة قدر الإمكان.'
          )
        },
        {
          icon: '💳',
          title: T('Get an integrated transit card early', 'احصل على بطاقة مواصلات موحّدة مبكرًا'),
          body: T(
            'A single integrated card is commonly used across multiple transit modes. Buying it early reduces friction and stress.',
            'هناك بطاقة موحّدة تُستخدم في أكثر من وسيلة مواصلات. شراؤها مبكرًا يقلل التوتر والوقت.'
          )
        },
        {
          icon: '🌆',
          title: T('Pick neighborhoods for walkability, not just price', 'اختر الحي للمشي والراحة وليس للسعر فقط'),
          body: T(
            'Some areas feel fine daytime but uncomfortable late. Prioritize walkable streets, lighting, and easy transit back after night matches.',
            'بعض المناطق قد تكون جيدة نهارًا وغير مريحة ليلًا. ركّز على سهولة المشي والإضاءة وسهولة العودة بالمواصلات.'
          )
        }
      ];
    }

    if (cityKey === 'tor') {
      return [
        {
          icon: '🚋',
          title: T('Don’t assume “a short drive” is easy', 'لا تفترض أن “المسافة بالسيارة قصيرة” يعني سهولة'),
          body: T(
            'Traffic and event surges can make car/taxi plans expensive. Staying near reliable transit often beats relying on rideshare.',
            'الازدحام وقت الفعاليات قد يجعل السيارة/التاكسي مكلفًا. السكن قرب مواصلات موثوقة غالبًا أفضل من الاعتماد على التطبيقات.'
          )
        },
        {
          icon: '💳',
          title: T('Use PRESTO for transit convenience', 'استخدم PRESTO لسهولة التنقل'),
          body: T(
            'Toronto uses PRESTO for transit fares; it’s usually the smoothest option for visitors using public transport.',
            'تورونتو تستخدم بطاقة PRESTO للدفع في المواصلات، وغالبًا هي الأسهل للزوار.'
          )
        },
        {
          icon: '🏨',
          title: T('Hotels can “look central” but isolate you', 'بعض الفنادق تبدو مركزية لكنها تعزلك'),
          body: T(
            'Check whether the route back at night is simple (few transfers, safe-feeling walk). A “central” pin can still be inconvenient.',
            'تأكد أن العودة ليلًا سهلة (تبديلات قليلة، مشي مريح). علامة “مركزي” قد تكون خادعة.'
          )
        }
      ];
    }

    if (cityKey === 'dal_atl') {
      return [
        {
          icon: '🚗',
          title: T('Car-first reality: budget for rides if needed', 'واقع الاعتماد على السيارة: ضع ميزانية للنقل'),
          body: T(
            'Some US cities are car-oriented. If you can’t rent a car, choose accommodation with a clear transit plan or budget for rides.',
            'بعض المدن تعتمد على السيارة. إن لم تستأجر سيارة، اختر سكنًا مع خطة مواصلات واضحة أو ضع ميزانية للتنقل.'
          )
        },
        {
          icon: '🚌',
          title: T('Know your local transit system options', 'اعرف خيارات المواصلات المحلية'),
          body: T(
            'Check the main transit operator and whether day/month passes exist. That can save a lot versus repeated taxis.',
            'تحقق من الجهة المسؤولة عن المواصلات وهل توجد تذاكر يومية/شهرية. قد توفر كثيرًا مقارنة بالتكاسي.'
          )
        },
        {
          icon: '⏱️',
          title: T('Distances are bigger than they look', 'المسافات أكبر مما تبدو'),
          body: T(
            'A “few miles” can still mean long travel time. Choose your stay based on the match-day route, not just price.',
            'حتى “عدة أميال” قد تعني وقتًا طويلًا. اختر السكن بناءً على طريق يوم المباراة لا على السعر فقط.'
          )
        }
      ];
    }

    // Various / fallback
    return [
      {
        icon: '🧭',
        title: isArabic ? 'ابدأ بالخطة قبل التفاصيل' : 'Start with the route, then the details',
        body: isArabic
          ? 'اختر سكنًا بناءً على “كيف ستصل وتعود يوم المباراة”، ثم قرر التفاصيل الأخرى.'
          : 'Pick accommodation based on “how you will get there and back on match day”, then decide the rest.'
      },
      {
        icon: '🛡️',
        title: isArabic ? 'فكّر في الطوارئ مبكرًا' : 'Think about emergencies early',
        body: isArabic
          ? 'أين أقرب مستشفى/صيدلية؟ وكيف ستتواصل؟ هذه أشياء بسيطة لكنها تمنح راحة بال.'
          : 'Where is the nearest pharmacy/hospital? How will you communicate? Small details that reduce anxiety.'
      },
      {
        icon: '⏱️',
        title: isArabic ? 'ضع وقتًا احتياطيًا' : 'Build buffer time',
        body: isArabic
          ? 'أيام الفعاليات تختلف عن الأيام العادية. الوصول مبكرًا يقلل التوتر.'
          : 'Event days are different from normal days. Arrive earlier than you think.'
      }
    ];
  }, [selectedMatch?.city, isArabic]);

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

        {/* Top 3 risks */}
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

        {/* City pitfalls */}
        <div className="card" style={{ background: 'hsl(var(--soft))', marginBottom: '12px' }}>
          <div className="kicker">{c.cityPitfallsTitle}</div>
          <div className="small" style={{ marginTop: '6px' }}>{c.cityPitfallsSubtitle}</div>
          <div className="hr"></div>
          <ul className="list">
            {cityPitfalls.map((p, idx) => (
              <li key={idx}>
                <span style={{ marginInlineEnd: '8px' }}>{p.icon}</span>
                <strong>{p.title}:</strong> <span>{p.body}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next steps */}
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

        <div className="small" style={{ marginTop: '12px', opacity: 0.8 }}>
          {c.note}
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
