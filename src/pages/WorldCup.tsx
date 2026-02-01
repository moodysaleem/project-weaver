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

type RiskItem = { icon: string; title: string; body: string };
type CardItem = { icon: string; title: string; body: string };

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

      risksTitle: 'Top 3 “things people don’t expect” (based on your answers)',
      risksSubtitle: 'This is where travelers lose time, money, or peace of mind.',

      whereToStayTitle: 'Where to stay (comfortable bases by name)',
      whereToStaySubtitle: 'These areas are usually easier for visitors: walkable, food options, and simpler transport.',
      beCarefulTitle: 'Comfort pitfalls (what to avoid by “type”)',
      beCarefulSubtitle: 'Not “danger”, but places that often feel isolated, inconvenient late-night, or family-unfriendly depending on the block.',

      insuranceTitle: 'Insurance reality check (this is what surprises people)',
      insuranceSubtitle:
        'In the US, a doctor visit or an ER visit can cost hundreds to thousands of dollars. Many plans reimburse you later, meaning you may pay first.',
      insuranceTip:
        'If you want peace of mind, choose a plan that can coordinate care and arrange payment for expensive cases via its assistance network (read the policy).',

      smartLinksTitle: 'Smart links (specific, not generic)',
      linkHint: 'Use the links below after you review the risks + city guidance.',
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

      risksTitle: 'أهم 3 أمور “قد لا تتوقعها” (حسب إجاباتك)',
      risksSubtitle: 'هنا عادةً يخسر المسافر وقتًا أو مالًا أو راحة بال.',

      whereToStayTitle: 'أين تسكن؟ (مناطق مريحة بالأسماء)',
      whereToStaySubtitle: 'هذه مناطق غالبًا مناسبة للزوار: مشي أفضل، مطاعم، وتنقل أسهل.',
      beCarefulTitle: 'مطبات الراحة (ما يجب تجنبه حسب “النوع”)',
      beCarefulSubtitle: 'ليس “خطرًا”، لكن أماكن قد تكون معزولة أو مزعجة ليلًا أو غير مناسبة للعائلة حسب الشارع.',

      insuranceTitle: 'توضيح مهم عن التأمين (هذا ما يُفاجئ الناس)',
      insuranceSubtitle:
        'في أمريكا، زيارة طبيب أو قسم الطوارئ قد تكلف مئات إلى آلاف الدولارات. كثير من الخطط تعمل بنظام “تعويض لاحق”، أي قد تدفع أنت أولًا.',
      insuranceTip:
        'لراحة بال أكبر: اختر خطة لديها “مساعدة/شبكة” يمكنها ترتيب العلاج وترتيب الدفع للحالات المكلفة (اقرأ الشروط جيدًا).',

      smartLinksTitle: 'روابط ذكية (محددة وليست عامة)',
      linkHint: 'استخدم الروابط أدناه بعد مراجعة المخاطر وإرشادات المدينة.',
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

    risks.push({
      icon: '🏨',
      title: isArabic ? 'الإقامة تُحسم مبكرًا' : 'Accommodation gets decided early',
      body: isArabic
        ? (budgetLow || stayingBudgetish
            ? 'في أسبوع المباراة قد تختفي الخيارات المناسبة بسرعة. احجز خيارًا بإلغاء مرن واحفظ خيارًا احتياطيًا.'
            : 'حتى مع ميزانية جيدة، الأسعار قد تقفز فجأة قبل المباراة. الحجز المبكر مع إلغاء مرن يقلل المخاطرة.')
        : (budgetLow || stayingBudgetish
            ? 'In match week, good-value options disappear fast. Book a flexible option and keep a backup.'
            : 'Even with a good budget, prices can jump close to match week. Early booking with flexible cancellation reduces risk.')
    });

    risks.push({
      icon: '🚦',
      title: isArabic ? 'المسافة لا تعني سهولة التنقل' : 'Distance doesn’t equal ease',
      body: isArabic
        ? 'المهم هو: طريق العودة ليلًا بعد المباراة. تجنب أماكن تتطلب تبديلات كثيرة أو مشي طويل في شوارع فارغة.'
        : 'What matters is your late-night return route. Avoid plans with many transfers or long walks on empty streets.'
    });

    risks.push({
      icon: '🛡️',
      title: isArabic ? 'التأمين: قد تدفع آلافًا ثم تنتظر التعويض' : 'Insurance: you may pay thousands first',
      body: isArabic
        ? 'في أمريكا، زيارة طوارئ/فحوصات قد تكون باهظة. كثير من الخطط تعوّض لاحقًا، لذلك ابحث عن خطة يمكنها ترتيب الدفع للحالات المكلفة عبر المساعدة.'
        : 'In the US, ER/medical care can be very expensive. Many plans reimburse later, so look for plans that can coordinate care and arrange payment for expensive cases via assistance.'
    });

    return risks.slice(0, 3);
  }, [answers.budget, answers.accommodation, isArabic]);

  const cityGuidance = useMemo(() => {
    const cityKey = normalizeCityKey(selectedMatch?.city);
    const T = (en: string, ar: string) => (isArabic ? ar : en);

    const whereToStay: CardItem[] = [];
    const beCareful: CardItem[] = [];
    const smartLinks: { label: string; href: string }[] = [];

    if (cityKey === 'ny') {
      whereToStay.push(
        {
          icon: '✅',
          title: T('Midtown Manhattan', 'ميدتاون مانهاتن'),
          body: T('Simple subway connections, easy food options, and straightforward late-night returns.', 'تبديلات أقل، طعام وخدمات أكثر، وعودة ليلًا أسهل.')
        },
        {
          icon: '✅',
          title: T('Upper West Side / Upper East Side', 'أبر ويست سايد / أبر إيست سايد'),
          body: T('Family-friendly feel, parks, and predictable transport routes.', 'مناسب للعائلات نسبيًا، قريب من الحدائق، ومسارات تنقل أوضح.')
        },
        {
          icon: '✅',
          title: T('Jersey City / Hoboken (practical for MetLife)', 'جيرسي سيتي / هوبوكن (عملي لـ MetLife)'),
          body: T('Often better value with a simpler match-day return if the match is at MetLife.', 'قيمة أفضل غالبًا مع عودة أسهل يوم المباراة إذا كانت في MetLife.')
        }
      );

      beCareful.push(
        {
          icon: '⚠️',
          title: T('“Cheap near a station” + multiple transfers', '“رخيص قرب محطة” مع تبديلات كثيرة'),
          body: T('Always test the return route after 10–11pm. Transfers + long walks kill comfort.', 'جرّب مسار العودة بعد 10–11 مساءً. التبديلات والمشي الطويل يدمّر الراحة.')
        },
        {
          icon: '⚠️',
          title: T('Industrial/empty streets at night', 'شوارع صناعية/فارغة ليلًا'),
          body: T('Use Street View and recent reviews for the block, not only the neighborhood name.', 'استخدم Street View ومراجعات حديثة للشارع نفسه، لا اسم الحي فقط.')
        }
      );

      smartLinks.push({ label: T('MetLife transit guide (NJ Transit)', 'دليل المواصلات إلى MetLife (NJ Transit)'), href: 'https://www.njtransit.com/meadowlands' });
    } else if (cityKey === 'mx') {
      whereToStay.push(
        { icon: '✅', title: T('Roma Norte', 'روما نورتي'), body: T('Walkable, cafes, and a popular visitor base.', 'مناسب للمشي ومطاعم ومقاهي وقاعدة شائعة للزوار.') },
        { icon: '✅', title: T('Condesa', 'كونديزا'), body: T('Comfortable streets and a calmer feel for families.', 'شوارع مريحة وإحساس أهدأ للعائلات.') },
        { icon: '✅', title: T('Polanco (higher budget comfort)', 'بولانكو (راحة أعلى للميزانية المرتفعة)'), body: T('More expensive but often smoother logistics.', 'أغلى لكن غالبًا أقل مطبات في التنقل والخدمات.') }
      );

      beCareful.push(
        { icon: '⚠️', title: T('Long late-night routes with transfers', 'مسارات ليلية طويلة مع تبديلات'), body: T('Pick a base that keeps the return route simple.', 'اختر قاعدة تجعل العودة سهلة ومباشرة.') },
        { icon: '⚠️', title: T('Over-optimistic “10 minutes away” pins', 'دبابيس “10 دقائق” المتفائلة'), body: T('Traffic changes everything. Base decisions on routes, not distance.', 'الزحام يغيّر كل شيء. قرر بناءً على المسار لا المسافة.') }
      );

      smartLinks.push({ label: T('Integrated mobility card overview', 'نظرة عامة على بطاقة المواصلات الموحدة'), href: 'https://mexicocity.cdmx.gob.mx/e/getting-around/mexico-city-metro-card/' });
    } else if (cityKey === 'tor') {
      whereToStay.push(
        { icon: '✅', title: T('Downtown / near TTC Subway', 'وسط المدينة / قرب مترو TTC'), body: T('Predictable transit + food options + less taxi dependency.', 'مواصلات أوضح + خيارات طعام + اعتماد أقل على التكاسي.') },
        { icon: '✅', title: T('The Annex / Yorkville (comfort)', 'ذا أنيكس / يوركفيل (راحة)'), body: T('Often comfortable and easy to navigate for visitors.', 'غالبًا مريح وسهل للزوار.') },
        { icon: '✅', title: T('West Queen West', 'ويست كوين ويست'), body: T('Popular base with good access if your route is simple.', 'قاعدة شائعة إذا كان المسار واضحًا وسهلًا.') }
      );

      beCareful.push(
        { icon: '⚠️', title: T('Relying on rideshare on match day', 'الاعتماد على أوبر/ليفت يوم المباراة'), body: T('Event surges can be expensive. Transit plan is calmer.', 'الطلب وقت الفعاليات يرفع السعر. المواصلات غالبًا أهدأ.') }
      );

      smartLinks.push({ label: T('TTC fares & passes (PRESTO)', 'أسعار وتذاكر TTC (PRESTO)'), href: 'https://www.ttc.ca/Fares-and-passes' });
    } else if (cityKey === 'dal_atl') {
      // Dallas + Atlanta are different, but we still give named comfortable bases for both.
      // We detect which one user likely means by their mental model; here we show both with clear labeling.
      whereToStay.push(
        {
          icon: '✅',
          title: T('Dallas: Uptown / Oak Lawn', 'دالاس: أبتاون / أوك لون'),
          body: T('Walkable pockets, food options, and usually easier logistics than far suburbs.', 'مناطق فيها مشي وخيارات طعام وخدمات، وغالبًا أسهل من الضواحي البعيدة.')
        },
        {
          icon: '✅',
          title: T('Dallas: Downtown / Arts District', 'دالاس: وسط المدينة / حي الفنون'),
          body: T('Central base, easier planning if you rely on transit/rideshare.', 'قاعدة مركزية أسهل للتخطيط إن كنت تعتمد على المواصلات/التطبيقات.')
        },
        {
          icon: '✅',
          title: T('Dallas: Plano (if you want calm + family)', 'دالاس: بلانو (هدوء للعائلة)'),
          body: T('More suburban and calm. Choose it only if your match-day route is clear.', 'ضاحية أهدأ. اخترها فقط إذا كان مسار يوم المباراة واضحًا.')
        },
        {
          icon: '✅',
          title: T('Atlanta: Midtown / Virginia-Highland', 'أتلانتا: ميدتاون / فيرجينيا-هايلاند'),
          body: T('Popular visitor areas with dining and easier day-to-day movement.', 'مناطق شائعة للزوار مع مطاعم وتنقل يومي أسهل.')
        },
        {
          icon: '✅',
          title: T('Atlanta: Buckhead (higher budget comfort)', 'أتلانتا: باكهيد (راحة للميزانية الأعلى)'),
          body: T('Often comfortable, but always confirm match-day route to the venue.', 'غالبًا مريح، لكن تأكد من مسار الذهاب والعودة يوم المباراة.')
        }
      );

      beCareful.push(
        {
          icon: '⚠️',
          title: T('“Cheap far away” with no transit plan', '“رخيص بعيد” بدون خطة مواصلات'),
          body: T('Some areas are car-first. Without a clear route, you’ll pay a lot in rides.', 'بعض المناطق تعتمد على السيارة. بدون مسار واضح ستدفع كثيرًا في المواصلات.')
        },
        {
          icon: '⚠️',
          title: T('Assuming walking works everywhere', 'افتراض أن المشي خيار دائمًا'),
          body: T('Distances and road layouts can make walking unrealistic. Pick your base based on the route.', 'المسافات وتصميم الطرق قد يجعل المشي غير عملي. اختر القاعدة حسب المسار.')
        }
      );

      smartLinks.push(
        { label: T('Dallas DART fares & passes', 'أسعار وتذاكر DART في دالاس'), href: 'https://www.dart.org/fare/general-fares-and-overview/fares' },
        { label: T('Atlanta MARTA fares & passes', 'أسعار وتذاكر MARTA في أتلانتا'), href: 'https://www.itsmarta.com/fare-programs.aspx' }
      );
    } else {
      whereToStay.push(
        {
          icon: '✅',
          title: T('Choose a base near reliable transit', 'اختر قاعدة قرب مواصلات موثوقة'),
          body: T('Pick by route (few transfers) more than price.', 'اختر حسب المسار (تبديلات أقل) أكثر من السعر.')
        }
      );
      beCareful.push(
        {
          icon: '⚠️',
          title: T('Isolated streets late night', 'شوارع معزولة ليلًا'),
          body: T('Check Street View and the walk from station to hotel at night.', 'افحص Street View والمشي من المحطة للسكن ليلًا.')
        }
      );
    }

    return { whereToStay, beCareful, smartLinks };
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

        {/* Where to stay */}
        <div className="card" style={{ background: 'hsl(var(--soft))', marginBottom: '12px' }}>
          <div className="kicker">{c.whereToStayTitle}</div>
          <div className="small" style={{ marginTop: '6px' }}>{c.whereToStaySubtitle}</div>
          <div className="hr"></div>
          <ul className="list">
            {cityGuidance.whereToStay.map((p, idx) => (
              <li key={idx}>
                <span style={{ marginInlineEnd: '8px' }}>{p.icon}</span>
                <strong>{p.title}:</strong> <span>{p.body}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Comfort pitfalls */}
        <div className="card" style={{ background: 'hsl(var(--soft))', marginBottom: '12px' }}>
          <div className="kicker">{c.beCarefulTitle}</div>
          <div className="small" style={{ marginTop: '6px' }}>{c.beCarefulSubtitle}</div>
          <div className="hr"></div>
          <ul className="list">
            {cityGuidance.beCareful.map((p, idx) => (
              <li key={idx}>
                <span style={{ marginInlineEnd: '8px' }}>{p.icon}</span>
                <strong>{p.title}:</strong> <span>{p.body}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Insurance */}
        <div className="card" style={{ background: 'hsl(var(--soft))', marginBottom: '12px' }}>
          <div className="kicker">{c.insuranceTitle}</div>
          <div className="small" style={{ marginTop: '6px' }}>{c.insuranceSubtitle}</div>
          <div className="small" style={{ marginTop: '10px', fontWeight: 800 }}>
            {c.insuranceTip}
          </div>
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

        <div className="kicker">{c.smartLinksTitle}</div>
        <div className="grid two" style={{ marginTop: '12px' }}>
          {cityGuidance.smartLinks.map((l) => (
            <div className="linkcard" key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            </div>
          ))}
          <div className="linkcard">
            <a
              href={selectedMatch?.city ? `https://www.google.com/search?q=${encodeURIComponent(selectedMatch.city + ' best areas to stay tourists')}` : 'https://www.google.com/search?q=best+areas+to+stay+world+cup+city'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isArabic ? 'أفضل مناطق السكن (بحث سريع)' : 'Best areas to stay (quick search)'}
            </a>
          </div>
          <div className="linkcard">
            <a
              href={selectedMatch?.city ? `https://www.google.com/search?q=${encodeURIComponent(selectedMatch.city + ' transit day pass week pass card')}` : 'https://www.google.com/search?q=city+transit+weekly+pass'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isArabic ? 'تذاكر المواصلات (بحث سريع)' : 'Transit passes (quick search)'}
            </a>
          </div>
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