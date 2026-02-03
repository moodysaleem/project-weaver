import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { AFFILIATE } from '@/lib/i18n';

type QuizStep = 'intro' | 'match' | 'host' | 'budget' | 'accommodation' | 'results';

interface QuizAnswers {
  match: string;
  hostCity: string; // only needed for "Dallas / Atlanta" or "Various"
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
  { id: 'friends', label: { en: 'Staying with friends/family', ar: 'مع أصدقاء/عائلة' } },
];

type RiskWithFix = {
  icon: string;
  title: string;
  problem: string;
  fix: string;
  action?: { label: string; href: string };
};

type CardItem = {
  icon: string;
  title: string;
  body: string;
};

function normalizeCityKey(matchCity?: string, hostCity?: string): 'ny' | 'mx' | 'tor' | 'dallas' | 'atlanta' {
  const hc = (hostCity || '').toLowerCase();
  if (hc.includes('dallas')) return 'dallas';
  if (hc.includes('atlanta')) return 'atlanta';
  if (hc.includes('tor')) return 'tor';
  if (hc.includes('mx')) return 'mx';
  if (hc.includes('ny')) return 'ny';

  const c = (matchCity || '').toLowerCase();
  if (c.includes('new york') || c.includes('new jersey')) return 'ny';
  if (c.includes('mexico')) return 'mx';
  if (c.includes('toronto')) return 'tor';
  if (c.includes('dallas')) return 'dallas';
  if (c.includes('atlanta')) return 'atlanta';

  return 'ny';
}

function bookingAreaSearch(area: string, cityName: string, lang: 'en' | 'ar') {
  const q = encodeURIComponent(`${area} ${cityName}`);
  const locale = lang === 'ar' ? 'ar' : 'en-us';
  return `https://www.booking.com/searchresults.html?ss=${q}&lang=${locale}`;
}

function skyscannerCitySearch(cityName: string) {
  return `${AFFILIATE.skyscanner}?destination=${encodeURIComponent(cityName)}`;
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

  const content = {
    en: {
      title: 'WorldCup 2026 Planner',
      subtitle: 'Real pitfalls + the fixes, so you travel calmly (not generic advice).',
      start: 'Start Planning',

      matchQuestion: 'Which match are you planning to attend?',
      hostQuestion: 'Which host city are you focusing on?',
      hostHelper:
        'Some matches are listed as “Various” or “Dallas / Atlanta”. Pick the city you’re actually planning for so the guidance becomes specific.',
      budgetQuestion: "What's your weekly budget for the trip?",
      accommodationQuestion: 'Where do you prefer to stay?',

      next: 'Next',
      back: 'Back',
      seeResults: 'See My Plan',
      resultsTitle: 'Your Match-Week Plan',
      selectedMatch: 'Selected Match',
      yourHostCity: 'Host City',
      yourBudget: 'Your Budget',
      stayType: 'Accommodation',

      risksTitle: 'Top 3 pitfalls (and the fixes)',
      risksSubtitle: 'This is where people lose money, time, or peace of mind — and how to avoid it.',

      whereToStayTitle: 'Comfortable areas to stay (by name)',
      whereToStaySubtitle:
        'These bases are usually easier for visitors: walkability, food, and simpler routes back after the match.',
      beCarefulTitle: 'Comfort “speed bumps” (what to avoid by type)',
      beCarefulSubtitle:
        'Not “danger”. More like: places that often feel isolated, inconvenient late-night, or stressful for families depending on the block.',

      insuranceTitle: 'Insurance reality check',
      insuranceBody:
        'In the US, a doctor visit or an ER visit can cost hundreds to thousands of dollars — and many plans reimburse later (meaning you may pay first).',
      insuranceFix:
        'For peace of mind: choose coverage with an assistance network that can coordinate care and arrange payment for expensive cases (read policy details).',

      quickPlanTitle: 'Your quick plan (10 minutes, no stress)',
      action1: 'Pick a comfortable base and book a flexible cancellation option',
      action2: 'Test your late-night return route (transfers + walking)',
      action3: 'Choose medical coverage that matches “pay-first vs arranged payment”',
      action4: 'Save match-day documents and addresses offline',

      linksTitle: 'Useful links',
      linkHint: 'Use these after you pick your base and understand the pitfalls.',
      startOver: 'Start Over',
      note: 'Note: guidance only, not official legal/travel advice.',
    },
    ar: {
      title: 'مخطط كأس العالم 2026',
      subtitle: 'مطبات واقعية + حلولها حتى تسافر بهدوء (ليس كلامًا عامًا).',
      start: 'ابدأ التخطيط',

      matchQuestion: 'أي مباراة تخطط لحضورها؟',
      hostQuestion: 'أي مدينة مضيفة تركز عليها؟',
      hostHelper:
        'بعض المباريات تظهر “متنوعة” أو “دالاس / أتلانتا”. اختر المدينة التي ستسافر لها فعليًا لتصبح الإرشادات محددة.',
      budgetQuestion: 'ما هي ميزانيتك الأسبوعية للرحلة؟',
      accommodationQuestion: 'أين تفضل الإقامة؟',

      next: 'التالي',
      back: 'رجوع',
      seeResults: 'اعرض خطتي',
      resultsTitle: 'خطة أسبوع المباراة',
      selectedMatch: 'المباراة المختارة',
      yourHostCity: 'المدينة المضيفة',
      yourBudget: 'ميزانيتك',
      stayType: 'الإقامة',

      risksTitle: 'أهم 3 مطبات (ومعها الحلول)',
      risksSubtitle: 'هنا يخسر الناس مالًا أو وقتًا أو راحة بال — وهكذا تتفاداها.',

      whereToStayTitle: 'مناطق مريحة للسكن (بالأسماء)',
      whereToStaySubtitle:
        'هذه قواعد غالبًا أسهل للزوار: مشي أفضل، طعام وخدمات، ومسارات عودة أبسط بعد المباراة.',
      beCarefulTitle: 'مطبات الراحة (ما يجب تجنبه حسب “النوع”)',
      beCarefulSubtitle:
        'ليس “خطرًا”. بل أماكن قد تكون معزولة أو مزعجة ليلًا أو مرهقة للعائلة حسب الشارع.',

      insuranceTitle: 'توضيح مهم عن التأمين',
      insuranceBody:
        'في أمريكا، زيارة طبيب أو قسم الطوارئ قد تكلف مئات إلى آلاف الدولارات — وكثير من الخطط تعمل بنظام “تعويض لاحق” (أي قد تدفع أنت أولًا).',
      insuranceFix:
        'لراحة بال أكبر: اختر خطة لديها خدمة مساعدة/شبكة يمكنها تنسيق العلاج وترتيب الدفع للحالات المكلفة (اقرأ الشروط).',

      quickPlanTitle: 'خطتك السريعة (10 دقائق بدون توتر)',
      action1: 'اختر قاعدة سكن مريحة واحجز بخيار إلغاء مرن',
      action2: 'اختبر مسار العودة ليلًا (تبديلات + مشي)',
      action3: 'اختر تغطية طبية تناسب “الدفع أولًا vs ترتيب الدفع”',
      action4: 'احفظ مستندات يوم المباراة والعناوين بدون إنترنت',

      linksTitle: 'روابط مفيدة',
      linkHint: 'استخدم الروابط بعد اختيار قاعدة السكن وفهم المطبات.',
      startOver: 'ابدأ من جديد',
      note: 'ملاحظة: هذه إرشادات عامة وليست استشارة رسمية.',
    },
  } as const;

  const c = content[lang];

  const selectedMatch = MATCHES.find(m => m.id === answers.match);

  const needsHostCity = useMemo(() => {
    if (!selectedMatch) return false;
    return selectedMatch.city === 'Various' || selectedMatch.city.includes('Dallas / Atlanta');
  }, [selectedMatch]);

  const steps: QuizStep[] = useMemo(() => {
    const base: QuizStep[] = ['match'];
    if (needsHostCity) base.push('host');
    base.push('budget', 'accommodation');
    return base;
  }, [needsHostCity]);

  const currentStepIndex = steps.indexOf(step);

  const handleSelect = (field: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const goNext = () => {
    if (step === 'intro') return setStep('match');

    if (step === 'match' && answers.match) {
      return setStep(needsHostCity ? 'host' : 'budget');
    }

    if (step === 'host' && answers.hostCity) return setStep('budget');
    if (step === 'budget' && answers.budget) return setStep('accommodation');
    if (step === 'accommodation' && answers.accommodation) return setStep('results');
  };

  const goBack = () => {
    if (step === 'match') return setStep('intro');
    if (step === 'host') return setStep('match');
    if (step === 'budget') return setStep(needsHostCity ? 'host' : 'match');
    if (step === 'accommodation') return setStep('budget');
    if (step === 'results') return setStep('accommodation');
  };

  const startOver = () => {
    setAnswers({ match: '', hostCity: '', budget: '', accommodation: '' });
    setStep('intro');
  };

  const cityKey = useMemo(() => {
    return normalizeCityKey(selectedMatch?.city, answers.hostCity);
  }, [selectedMatch?.city, answers.hostCity]);

  const cityName = useMemo(() => {
    const map = {
      ny: { en: 'New York / New Jersey', ar: 'نيويورك / نيوجيرسي' },
      dallas: { en: 'Dallas, Texas', ar: 'دالاس - تكساس' },
      atlanta: { en: 'Atlanta, Georgia', ar: 'أتلانتا - جورجيا' },
      tor: { en: 'Toronto, Canada', ar: 'تورونتو - كندا' },
      mx: { en: 'Mexico City, Mexico', ar: 'مكسيكو سيتي - المكسيك' },
    } as const;
    return isArabic ? map[cityKey].ar : map[cityKey].en;
  }, [cityKey, isArabic]);

  const selectedBudget = BUDGETS.find(b => b.id === answers.budget);
  const selectedAccommodation = ACCOMMODATIONS.find(a => a.id === answers.accommodation);

  const profile = useMemo(() => {
    const T = (enText: string, arText: string) => (isArabic ? arText : enText);

    const baseAreas: Record<typeof cityKey, CardItem[]> = {
      ny: [
        { icon: '✅', title: T('Midtown Manhattan', 'ميدتاون مانهاتن'), body: T('Easiest logistics and late-night options.', 'أسهل لوجستيات وخيارات ليلًا.') },
        { icon: '✅', title: T('Upper West Side', 'أبر ويست سايد'), body: T('Family-friendly feel, parks, good transit.', 'مناسب للعائلة نسبيًا وحدائق ومواصلات جيدة.') },
        { icon: '✅', title: T('Jersey City / Hoboken', 'جيرسي سيتي / هوبوكن'), body: T('Often better value + simpler match-day return for MetLife.', 'قيمة أفضل غالبًا + عودة أسهل ليوم المباراة (MetLife).') },
      ],
      dallas: [
        { icon: '✅', title: T('Uptown / Oak Lawn', 'أبتاون / أوك لون'), body: T('Comfortable base: dining + walkable pockets.', 'قاعدة مريحة: مطاعم + مناطق للمشي.') },
        { icon: '✅', title: T('Downtown / Arts District', 'وسط المدينة / حي الفنون'), body: T('Central and practical if your route back is clear.', 'مركزي وعملي إذا كان مسار العودة واضحًا.') },
        { icon: '✅', title: T('Plano (calmer family vibe)', 'بلانو (أهدأ للعائلة)'), body: T('Good for calm — only if your match-day route is solid.', 'مناسب للهدوء — فقط إذا كان مسارك يوم المباراة مضبوطًا.') },
      ],
      atlanta: [
        { icon: '✅', title: T('Midtown', 'ميدتاون'), body: T('Popular base: dining + simpler movement.', 'قاعدة شائعة: مطاعم وتنقل أسهل.') },
        { icon: '✅', title: T('Virginia-Highland', 'فيرجينيا-هايلاند'), body: T('Comfortable vibe for visitors (route-dependent).', 'أجواء مريحة للزوار (حسب المسار).') },
        { icon: '✅', title: T('Buckhead (higher budget comfort)', 'باكهيد (راحة للميزانية الأعلى)'), body: T('Often comfortable — confirm match-day route back.', 'غالبًا مريح — تأكد من مسار العودة يوم المباراة.') },
      ],
      tor: [
        { icon: '✅', title: T('Downtown / near TTC Subway', 'وسط المدينة / قرب مترو TTC'), body: T('Predictable transit and fewer surprises.', 'مواصلات أوضح ومفاجآت أقل.') },
        { icon: '✅', title: T('The Annex', 'ذا أنيكس'), body: T('Comfortable base with good connectivity.', 'قاعدة مريحة واتصال جيد.') },
        { icon: '✅', title: T('Yorkville (higher budget comfort)', 'يوركفيل (راحة للميزانية الأعلى)'), body: T('Comfort + services, easier for families.', 'راحة وخدمات وأسهل للعائلة.') },
      ],
      mx: [
        { icon: '✅', title: T('Roma Norte', 'روما نورتي'), body: T('Walkable, cafes, visitor-friendly base.', 'مناسبة للمشي ومقاهي وقاعدة محببة للزوار.') },
        { icon: '✅', title: T('Condesa', 'كونديزا'), body: T('Comfortable streets and calmer vibe.', 'شوارع مريحة وأجواء أهدأ.') },
        { icon: '✅', title: T('Polanco (higher budget comfort)', 'بولانكو (راحة للميزانية الأعلى)'), body: T('More expensive, often smoother logistics.', 'أغلى لكن غالبًا لوجستيات أسهل.') },
      ],
    };

    const bumps: Record<typeof cityKey, CardItem[]> = {
      ny: [
        { icon: '⚠️', title: T('“Cheap next to station” with 2–3 transfers', '“رخيص بجانب محطة” مع 2–3 تبديلات'), body: T('Looks fine on maps, painful at 11pm.', 'يبدو جيدًا ثم يصبح مرهقًا ليلًا.') },
        { icon: '⚠️', title: T('Industrial blocks after dark', 'شوارع صناعية/فارغة ليلًا'), body: T('Check the street, not only the neighborhood label.', 'افحص الشارع نفسه لا اسم الحي فقط.') },
      ],
      dallas: [
        { icon: '⚠️', title: T('Car-first areas without a plan', 'مناطق تعتمد على السيارة بدون خطة'), body: T('Rides add up fast if transit isn’t realistic.', 'التطبيقات تصبح مكلفة إن لم تكن المواصلات عملية.') },
        { icon: '⚠️', title: T('Assuming “close” means easy', 'افتراض أن “قريب” يعني سهل'), body: T('Event traffic can turn short trips into long ones.', 'زحام الفعاليات يحول القريب إلى رحلة طويلة.') },
      ],
      atlanta: [
        { icon: '⚠️', title: T('Far suburbs with no transit plan', 'ضواحٍ بعيدة بدون خطة مواصلات'), body: T('Surge pricing on match day is common.', 'الارتفاع السعري يوم المباراة شائع.') },
        { icon: '⚠️', title: T('Late-night transfers + long walk', 'تبديلات ليلية + مشي طويل'), body: T('This is where families feel uncomfortable.', 'هنا تفقد العائلة الراحة.') },
      ],
      tor: [
        { icon: '⚠️', title: T('Relying on rideshare on match day', 'الاعتماد على التطبيقات يوم المباراة'), body: T('Surges can surprise you.', 'الارتفاع السعري قد يفاجئك.') },
        { icon: '⚠️', title: T('Awkward transfers at night', 'تبديلات مزعجة ليلًا'), body: T('Transfers + long walks feel worse after events.', 'التبديلات والمشي يصبح أسوأ بعد الفعاليات.') },
      ],
      mx: [
        { icon: '⚠️', title: T('Over-optimistic map pins', 'دبابيس خريطة متفائلة'), body: T('Traffic can turn “close” into a long ride.', 'الزحام يحول “قريب” إلى رحلة طويلة.') },
        { icon: '⚠️', title: T('Late-night return not planned', 'العودة ليلًا بدون خطة'), body: T('Pick a base with a simple route back.', 'اختر قاعدة بعودة بسيطة.') },
      ],
    };

    const top3: Record<typeof cityKey, RiskWithFix[]> = {
      ny: [
        {
          icon: '🚇',
          title: T('Late-night return route is the real test', 'مسار العودة ليلًا هو الاختبار الحقيقي'),
          problem: T('A “good deal” becomes stressful when you’re tired and transferring lines.', 'الصفقة الرخيصة تصبح مرهقة عندما تكون متعبًا وتبدّل خطوطًا.'),
          fix: T('Choose a base with fewer transfers + shorter walks back.', 'اختر قاعدة بتبديلات أقل + مشي أقصر.'),
          action: {
            label: T('Search stays in comfortable areas', 'ابحث عن سكن في مناطق مريحة'),
            href: bookingAreaSearch('Midtown Manhattan', 'New York', lang),
          },
        },
        {
          icon: '✈️',
          title: T('Flights spike closer to tournament windows', 'أسعار الطيران تقفز مع اقتراب البطولة'),
          problem: T('Waiting too long removes your “good-value” choices.', 'التأخير يزيل خيارات السعر الجيد.'),
          fix: T('Track flights early and keep flexible options saved.', 'راقب الرحلات مبكرًا واحفظ خيارات مرنة.'),
          action: {
            label: T('Search flights to New York', 'ابحث عن رحلات إلى نيويورك'),
            href: skyscannerCitySearch('New York'),
          },
        },
        {
          icon: '🛡️',
          title: T('Medical costs can be thousands upfront', 'التكاليف الطبية قد تكون آلافًا مقدمًا'),
          problem: T(
            'A doctor/ER visit can cost hundreds to thousands — and many plans reimburse later (pay-first).',
            'زيارة طبيب/طوارئ قد تكلف مئات إلى آلاف — وكثير من الخطط تعوّض لاحقًا (تدفع أولًا).'
          ),
          fix: T(
            'Choose coverage with an assistance network that can coordinate care and arrange payment for expensive cases (read policy).',
            'اختر تغطية مع خدمة مساعدة يمكنها تنسيق العلاج وترتيب الدفع للحالات المكلفة (اقرأ الشروط).'
          ),
          action: {
            label: T('Check travel insurance options', 'الاطلاع على خيارات التأمين'),
            href: AFFILIATE.insurance,
          },
        },
      ],
      dallas: [
        {
          icon: '🚦',
          title: T('Traffic is the hidden cost', 'الزحام هو التكلفة الخفية'),
          problem: T('Match-day congestion can eat hours and kill the vibe.', 'زحام يوم المباراة قد يستهلك ساعات ويقتل المتعة.'),
          fix: T('Stay in a predictable base (Uptown/Downtown) and avoid long late-night walks.', 'اسكن في قاعدة متوقعة (أبتاون/وسط المدينة) وتجنب مشي طويل ليلًا.'),
          action: {
            label: T('Search stays in Uptown', 'ابحث عن سكن في أبتاون'),
            href: bookingAreaSearch('Uptown', 'Dallas', lang),
          },
        },
        {
          icon: '🏨',
          title: T('“Cheap hotel” can become expensive', '“الفندق الرخيص” قد يصبح مكلفًا'),
          problem: T('You save on room but spend heavily on rides and time.', 'توفّر في السكن ثم تدفع كثيرًا للمواصلات والوقت.'),
          fix: T('Pay a bit more for a comfortable base; you often win back money and calm.', 'ادفع قليلًا أكثر لقاعدة مريحة؛ غالبًا ستربح المال وراحة البال.'),
          action: {
            label: T('Search stays in Downtown', 'ابحث عن سكن في وسط المدينة'),
            href: bookingAreaSearch('Downtown', 'Dallas', lang),
          },
        },
        {
          icon: '🛡️',
          title: T('ER/doctor can cost thousands upfront', 'الطوارئ/الطبيب قد يكلف آلافًا مقدمًا'),
          problem: T(
            'Many plans reimburse later — meaning you may pay first, then wait.',
            'كثير من الخطط تعوّض لاحقًا — أي قد تدفع أولًا ثم تنتظر.'
          ),
          fix: T(
            'Choose coverage with assistance that can coordinate care and arrange payment for expensive cases (read policy).',
            'اختر تغطية مع مساعدة تستطيع تنسيق العلاج وترتيب الدفع للحالات المكلفة (اقرأ الشروط).'
          ),
          action: {
            label: T('Check travel insurance options', 'الاطلاع على خيارات التأمين'),
            href: AFFILIATE.insurance,
          },
        },
      ],
      atlanta: [
        {
          icon: '🚇',
          title: T('Return route matters more than “distance”', 'مسار العودة أهم من “القرب”'),
          problem: T('Two places can be close, but one has a painful return path.', 'قد يكون مكانان قريبين لكن أحدهما عودته مرهقة.'),
          fix: T('Pick a base with fewer transfers and a comfortable walk back.', 'اختر قاعدة بتبديلات أقل ومشي مريح.'),
          action: {
            label: T('Search stays in Midtown', 'ابحث عن سكن في ميدتاون'),
            href: bookingAreaSearch('Midtown', 'Atlanta', lang),
          },
        },
        {
          icon: '🏨',
          title: T('Booking too late creates bad choices', 'التأخر في الحجز يخلق خيارات سيئة'),
          problem: T('You end up far away or locked into minimum-night terms.', 'ستضطر لسكن بعيد أو شروط مدة إقامة دنيا.'),
          fix: T('Book flexible cancellation early and keep a backup saved.', 'احجز بإلغاء مرن مبكرًا واحتفظ بخيار احتياطي.'),
          action: {
            label: T('Search flexible hotels', 'ابحث عن فنادق بإلغاء مرن'),
            href: AFFILIATE.booking,
          },
        },
        {
          icon: '🛡️',
          title: T('Medical costs can be shocking', 'التكاليف الطبية قد تكون صادمة'),
          problem: T('An urgent visit can become a large bill quickly.', 'زيارة عاجلة قد تتحول لفاتورة كبيرة بسرعة.'),
          fix: T('Choose coverage with assistance + understand pay-first vs arranged payment.', 'اختر تغطية مع مساعدة وافهم الدفع أولًا مقابل ترتيب الدفع.'),
          action: {
            label: T('Check travel insurance options', 'الاطلاع على خيارات التأمين'),
            href: AFFILIATE.insurance,
          },
        },
      ],
      tor: [
        {
          icon: '🚇',
          title: T('Transit-first planning saves money', 'التخطيط بالمواصلات يوفر المال'),
          problem: T('Rideshare adds up fast during event surges.', 'التطبيقات تصبح مكلفة وقت الفعاليات.'),
          fix: T('Stay near TTC lines and test the return route after 10pm.', 'اسكن قرب TTC واختبر العودة بعد 10 مساءً.'),
          action: {
            label: T('Search stays near TTC', 'ابحث عن سكن قرب TTC'),
            href: bookingAreaSearch('Downtown', 'Toronto', lang),
          },
        },
        {
          icon: '🏨',
          title: T('Hotels fill up near event windows', 'الفنادق تمتلئ في نافذة الفعاليات'),
          problem: T('Prices rise and options shrink quickly.', 'الأسعار ترتفع والخيارات تقل بسرعة.'),
          fix: T('Book early with flexible cancellation and keep a backup saved.', 'احجز مبكرًا بإلغاء مرن واحتفظ بخيار احتياطي.'),
          action: {
            label: T('Search flexible hotels', 'ابحث عن فنادق بإلغاء مرن'),
            href: AFFILIATE.booking,
          },
        },
        {
          icon: '✈️',
          title: T('Flights get expensive earlier than you think', 'الطيران يصبح غاليًا أبكر مما تتوقع'),
          problem: T('Waiting removes your best-value options.', 'التأخير يزيل خيارات السعر الجيد.'),
          fix: T('Track flights early and save 2–3 good options.', 'راقب الرحلات مبكرًا واحفظ 2–3 خيارات جيدة.'),
          action: {
            label: T('Search flights to Toronto', 'ابحث عن رحلات إلى تورونتو'),
            href: skyscannerCitySearch('Toronto'),
          },
        },
      ],
      mx: [
        {
          icon: '🚦',
          title: T('Traffic is the hidden schedule killer', 'الزحام هو قاتل الجدول'),
          problem: T('A short distance can become a 60–90 min ride.', 'مسافة قصيرة قد تصبح 60–90 دقيقة.'),
          fix: T('Pick a base that works for your whole week, not only the venue.', 'اختر قاعدة تناسب أسبوعك كله لا الملعب فقط.'),
          action: {
            label: T('Search stays in Roma Norte', 'ابحث عن سكن في روما نورتي'),
            href: bookingAreaSearch('Roma Norte', 'Mexico City', lang),
          },
        },
        {
          icon: '🏨',
          title: T('Match week pricing + minimum nights', 'أسعار أسبوع المباراة + مدة إقامة دنيا'),
          problem: T('You might be forced into longer stays or worse locations.', 'قد تُجبر على إقامة أطول أو موقع أسوأ.'),
          fix: T('Book flexible cancellation early and keep options saved.', 'احجز مبكرًا بإلغاء مرن واحتفظ بخيارات محفوظة.'),
          action: {
            label: T('Search flexible hotels', 'ابحث عن فنادق بإلغاء مرن'),
            href: AFFILIATE.booking,
          },
        },
        {
          icon: '✈️',
          title: T('Flight prices jump near big events', 'أسعار الطيران تقفز قرب الفعاليات الكبيرة'),
          problem: T('Late booking usually costs more and leaves poor flight times.', 'الحجز المتأخر غالبًا أغلى ويترك أوقات سفر سيئة.'),
          fix: T('Track early and keep flexible options.', 'راقب مبكرًا واختر خيارات مرنة.'),
          action: {
            label: T('Search flights to Mexico City', 'ابحث عن رحلات إلى مكسيكو سيتي'),
            href: skyscannerCitySearch('Mexico City'),
          },
        },
      ],
    };

    const smartLinks: Record<typeof cityKey, { label: string; href: string }[]> = {
      ny: [{ label: T('MetLife transit guide (NJ Transit)', 'دليل المواصلات إلى MetLife (NJ Transit)'), href: 'https://www.njtransit.com/meadowlands' }],
      dallas: [{ label: T('Dallas DART fares & passes', 'أسعار وتذاكر DART في دالاس'), href: 'https://www.dart.org/fare/general-fares-and-overview/fares' }],
      atlanta: [{ label: T('Atlanta MARTA fares & passes', 'أسعار وتذاكر MARTA في أتلانتا'), href: 'https://www.itsmarta.com/fare-programs.aspx' }],
      tor: [{ label: T('TTC fares & passes', 'أسعار وتذاكر TTC'), href: 'https://www.ttc.ca/Fares-and-passes' }],
      mx: [{ label: T('Mexico City mobility card info', 'معلومات بطاقة مواصلات مكسيكو سيتي'), href: 'https://mexicocity.cdmx.gob.mx/e/getting-around/mexico-city-metro-card/' }],
    };

    return {
      areas: baseAreas[cityKey],
      bumps: bumps[cityKey],
      top3: top3[cityKey],
      smartLinks: smartLinks[cityKey],
    };
  }, [cityKey, isArabic, lang]);

  const areasWithLinks = useMemo(() => {
    return profile.areas.map(a => ({
      ...a,
      href: bookingAreaSearch(a.title, cityName, lang),
    }));
  }, [profile.areas, cityName, lang]);

  if (step === 'intro') {
    return (
      <div className="card">
        <div className="kicker">{t.nav_wc}</div>
        <div className="big">{c.title}</div>
        <div className="small">{c.subtitle}</div>
        <div className="hr"></div>
        <button className="btn primary" onClick={() => setStep('match')}>
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
            <div className="kicker">{c.yourHostCity}</div>
            <div className="big" style={{ fontSize: '16px' }}>{cityName}</div>
          </div>
          <div className="result-item">
            <div className="kicker">{c.yourBudget}</div>
            <div className="big" style={{ fontSize: '16px' }}>{selectedBudget?.label[lang]}</div>
          </div>
          <div className="result-item">
            <div className="kicker">{c.stayType}</div>
            <div className="big" style={{ fontSize: '16px' }}>{selectedAccommodation?.label[lang]}</div>
          </div>
        </div>

        {/* Toronto deep-dive (safe trigger) */}
        {cityKey === 'tor' && (
          <div className="card" style={{ background: 'hsl(var(--soft))', marginBottom: '12px' }}>
            <div className="kicker">
              {isArabic ? 'دليل المدينة التفصيلي' : 'City deep-dive guide'}
            </div>
            <div className="small" style={{ marginTop: '6px' }}>
              {isArabic
                ? 'أحياء مريحة، مطبات المواصلات، وحقيقة التأمين الصحي في تورونتو.'
                : 'Comfortable neighborhoods, transport pitfalls, and healthcare reality in Toronto.'}
            </div>
            <div style={{ marginTop: '12px' }}>
              <Link to="/worldcup/toronto" className="btn primary">
                {isArabic ? 'اقرأ دليل تورونتو →' : 'Read the Toronto guide →'}
              </Link>
            </div>
          </div>
        )}

        {/* Top 3 pitfalls + contextual CTAs */}
        <div className="card" style={{ background: 'hsl(var(--soft))', marginBottom: '12px' }}>
          <div className="kicker">{c.risksTitle}</div>
          <div className="small" style={{ marginTop: '6px' }}>{c.risksSubtitle}</div>
          <div className="hr"></div>
          <ul className="list">
            {profile.top3.map((r, idx) => (
              <li key={idx}>
                <span style={{ marginInlineEnd: '8px' }}>{r.icon}</span>
                <strong>{r.title}:</strong> <span>{r.problem}</span>
                <div className="small" style={{ marginTop: '6px', fontWeight: 900 }}>
                  {isArabic ? 'الحل: ' : 'Fix: '}
                  <span style={{ fontWeight: 600 }}>{r.fix}</span>
                </div>

                {r.action?.href && (
                  <div style={{ marginTop: '10px' }}>
                    <a className="btn small" href={r.action.href} target="_blank" rel="noopener noreferrer">
                      {r.action.label}
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Comfortable areas */}
        <div className="card" style={{ background: 'hsl(var(--soft))', marginBottom: '12px' }}>
          <div className="kicker">{c.whereToStayTitle}</div>
          <div className="small" style={{ marginTop: '6px' }}>{c.whereToStaySubtitle}</div>
          <div className="hr"></div>

          <div className="grid two" style={{ marginTop: '12px' }}>
            {areasWithLinks.map(a => (
              <div className="linkcard" key={a.title}>
                <a href={a.href} target="_blank" rel="noopener noreferrer">
                  <div style={{ fontWeight: 900 }}>{a.icon} {a.title}</div>
                  <div className="small" style={{ marginTop: '6px' }}>{a.body}</div>
                  <div className="small" style={{ marginTop: '8px', opacity: 0.9 }}>
                    {isArabic ? 'ابحث عن سكن هنا' : 'Search stays here'}
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Comfort bumps */}
        <div className="card" style={{ background: 'hsl(var(--soft))', marginBottom: '12px' }}>
          <div className="kicker">{c.beCarefulTitle}</div>
          <div className="small" style={{ marginTop: '6px' }}>{c.beCarefulSubtitle}</div>
          <div className="hr"></div>
          <ul className="list">
            {profile.bumps.map((p, idx) => (
              <li key={idx}>
                <span style={{ marginInlineEnd: '8px' }}>{p.icon}</span>
                <strong>{p.title}:</strong> <span>{p.body}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Insurance explainer block (extra trust) */}
        <div className="card" style={{ background: 'hsl(var(--soft))', marginBottom: '12px' }}>
          <div className="kicker">{c.insuranceTitle}</div>
          <div className="small" style={{ marginTop: '6px' }}>{c.insuranceBody}</div>
          <div className="small" style={{ marginTop: '10px', fontWeight: 900 }}>{c.insuranceFix}</div>
          <div style={{ marginTop: '12px' }}>
            <a className="btn small" href={AFFILIATE.insurance} target="_blank" rel="noopener noreferrer">
              {isArabic ? 'اطّلع على خيارات التأمين' : 'Check insurance options'}
            </a>
          </div>
        </div>

        {/* Quick plan */}
        <div className="card" style={{ background: 'hsl(var(--soft))', marginBottom: '12px' }}>
          <div className="kicker">{c.quickPlanTitle}</div>
          <div className="hr"></div>
          <ul className="list">
            <li>✅ {c.action1}</li>
            <li>✅ {c.action2}</li>
            <li>✅ {c.action3}</li>
            <li>✅ {c.action4}</li>
          </ul>
        </div>

        <div className="hr"></div>

        {/* Useful links */}
        <div className="kicker">{c.linksTitle}</div>
        <div className="small" style={{ marginTop: '6px' }}>{c.linkHint}</div>

        <div className="grid two" style={{ marginTop: '12px' }}>
          {profile.smartLinks.map(l => (
            <div className="linkcard" key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
            </div>
          ))}

          <div className="linkcard">
            <a href={skyscannerCitySearch(cityName)} target="_blank" rel="noopener noreferrer">
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

  // Quiz view
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
            {MATCHES.map(match => (
              <div
                key={match.id}
                className={`option ${answers.match === match.id ? 'selected' : ''}`}
                onClick={() => setAnswers(prev => ({ ...prev, match: match.id, hostCity: '' }))}
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

      {step === 'host' && (
        <>
          <div className="big">{c.hostQuestion}</div>
          <div className="small" style={{ marginTop: '8px' }}>{c.hostHelper}</div>
          <div className="hr"></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {HOST_CHOICES.map(hc => (
              <div
                key={hc.id}
                className={`option ${answers.hostCity === hc.id ? 'selected' : ''}`}
                onClick={() => handleSelect('hostCity', hc.id)}
              >
                <div style={{ fontWeight: 900 }}>{hc.label[lang]}</div>
                {answers.hostCity === hc.id && <span className="badge ok">✓</span>}
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
            {BUDGETS.map(budget => (
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
            {ACCOMMODATIONS.map(acc => (
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
            (step === 'host' && !answers.hostCity) ||
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
