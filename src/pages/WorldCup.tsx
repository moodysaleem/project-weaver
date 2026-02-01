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

      whereToStayTitle: 'Where to stay (recommended bases)',
      whereToStaySubtitle: 'These are areas that tend to be convenient for visitors: walkable, food options, and simpler transport.',
      beCarefulTitle: 'Be careful with… (common comfort pitfalls)',
      beCarefulSubtitle: 'Not “danger”, but places that often feel isolated, inconvenient late-night, or family-unfriendly depending on the block.',
      insuranceTitle: 'Insurance reality check (so you don’t get surprised)',
      insuranceSubtitle: 'Flight “insurance” is not the same as medical coverage after you land. Here is the practical difference.',
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

      whereToStayTitle: 'أين تسكن؟ (مناطق مفضلة كقاعدة)',
      whereToStaySubtitle: 'هذه مناطق غالبًا مناسبة للزوار: مشي أفضل، مطاعم، وتنقل أسهل.',
      beCarefulTitle: 'انتبه لـ… (فخاخ الراحة الشائعة)',
      beCarefulSubtitle: 'ليس “خطرًا”، لكن أماكن قد تكون معزولة أو مزعجة ليلًا أو غير مناسبة للعائلة حسب الشارع.',
      insuranceTitle: 'توضيح مهم عن التأمين (حتى لا تتفاجأ)',
      insuranceSubtitle: 'تأمين الطيران ليس مثل التأمين الطبي بعد الوصول. هذا الفرق العملي.',
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

    if (budgetLow || stayingBudgetish) {
      risks.push({
        icon: '🏨',
        title: isArabic ? 'قيود الإقامة خلال أسبوع المباراة' : 'Accommodation constraints during match week',
        body: isArabic
          ? 'خلال الأحداث الكبرى ترتفع الأسعار وقد تُفرض مدة إقامة دنيا. احجز خيارًا بإلغاء مرن واحفظ خيارًا احتياطيًا قريبًا من المواصلات.'
          : 'During major events, minimum-night stays and sudden price jumps are common. Book a flexible option and keep a backup near transit.'
      });
    } else {
      risks.push({
        icon: '🏨',
        title: isArabic ? 'الأسعار تقفز بسرعة حتى مع ميزانية جيدة' : 'Prices can spike fast (even with a good budget)',
        body: isArabic
          ? 'الانتظار قد يجعل نفس الفندق أغلى بكثير قبل المباراة. احجز مبكرًا مع إلغاء مرن بدل المقامرة.'
          : 'Waiting can make the same hotel much more expensive closer to match day. Book early with flexible cancellation instead of gambling.'
      });
    }

    risks.push({
      icon: '🚇',
      title: isArabic ? 'الازدحام والتنقل يوم المباراة' : 'Match-day transport congestion',
      body: isArabic
        ? 'يوم المباراة يختلف عن الأيام العادية. السكن “أرخص لكنه بعيد” قد يكلف وقتًا وتوترًا أكثر من المال.'
        : 'Match day is different from normal days. “Cheaper but far” can cost you more in time and stress than money.'
    });

    risks.push({
      icon: '🛂',
      title: isArabic ? 'متطلبات دخول قد لا تنتبه لها' : 'Hidden entry requirements',
      body: isArabic
        ? 'حتى بدون تأشيرة قد توجد شروط مثل صلاحية الجواز، تصريح عبور، أو إثبات تذكرة عودة. افحص قبل الحجز النهائي.'
        : 'Even visa-free travel can require passport validity rules, transit authorizations, or return-ticket proof. Check before final bookings.'
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
          title: T('Manhattan (Midtown / near major subway lines)', 'مانهاتن (قرب خطوط المترو الأساسية)'),
          body: T(
            'Often easiest for families: more services, simpler navigation, late-night options, and fewer transfer headaches.',
            'غالبًا الأسهل للعائلات: خدمات أكثر، تنقل أبسط، خيارات ليلًا، وتبديلات أقل.'
          )
        },
        {
          icon: '✅',
          title: T('Jersey City / Hoboken (practical base)', 'جيرسي سيتي / هوبوكن (قاعدة عملية)'),
          body: T(
            'Usually more space for the money while still being connected. Great if your match is at MetLife and you want simpler return routes.',
            'عادةً مساحة أكبر مقابل السعر مع اتصال جيد. خيار عملي إذا كانت المباراة في MetLife وتريد عودة أسهل.'
          )
        }
      );

      beCareful.push(
        {
          icon: '⚠️',
          title: T('“Cheapest deal” right next to a station', '“أرخص خيار” بجانب محطة'),
          body: T(
            'A cheap pin can still mean a stressful walk at night or multiple transfers. Always check the route back after 10–11pm.',
            'قد يكون السكن رخيصًا لكن العودة ليلًا مرهقة أو بتبديلات كثيرة. افحص مسار العودة بعد 10–11 مساءً.'
          )
        },
        {
          icon: '⚠️',
          title: T('Industrial/empty streets after dark', 'شوارع صناعية/فارغة ليلًا'),
          body: T(
            'Some areas feel fine daytime but uncomfortable late-night for families. Use Street View + recent reviews, not only distance.',
            'بعض المناطق جيدة نهارًا لكنها غير مريحة ليلًا للعائلات. اعتمد على Street View ومراجعات حديثة لا على المسافة فقط.'
          )
        }
      );

      smartLinks.push(
        { label: T('How to get to MetLife by transit (NJ Transit)', 'الوصول إلى MetLife بالمواصلات (NJ Transit)'), href: 'https://www.njtransit.com/meadowlands' }
      );
    } else if (cityKey === 'mx') {
      whereToStay.push(
        {
          icon: '✅',
          title: T('Roma / Condesa (walkable base)', 'روما / كونديزا (مناسبة للمشي)'),
          body: T(
            'Often picked by visitors for cafes, parks, and walkability. Usually feels easier day-to-day than “random cheap” districts.',
            'يختارها كثير من الزوار للمشي والمقاهي والحدائق. غالبًا أسهل من مناطق “رخيصة لكن عشوائية”.'
          )
        },
        {
          icon: '✅',
          title: T('Polanco (higher budget comfort)', 'بولانكو (راحة أعلى للميزانية المرتفعة)'),
          body: T(
            'More expensive but often calmer and easier for families. If budget allows, it reduces friction.',
            'أغلى لكنها غالبًا أهدأ وأسهل للعائلات. إن سمحت الميزانية فهي تقلل المتاعب.'
          )
        }
      );

      beCareful.push(
        {
          icon: '⚠️',
          title: T('Late-night returns with multiple transfers', 'عودة ليلًا بتبديلات كثيرة'),
          body: T(
            'A route that looks fine at 2pm can feel exhausting late-night. Favor direct routes back to your base.',
            'مسار يبدو جيدًا نهارًا قد يصبح متعبًا ليلًا. فضّل طرق العودة المباشرة.'
          )
        },
        {
          icon: '⚠️',
          title: T('Over-optimistic “10 minutes away” map pins', 'دبابيس “10 دقائق” المتفائلة'),
          body: T(
            'Traffic and big-city reality can turn short distances into long trips. Prefer neighborhoods that work for both match day and normal day.',
            'الزحام قد يجعل المسافة القصيرة طويلة. اختر حيًا يناسب يوم المباراة واليوم العادي.'
          )
        }
      );

      smartLinks.push(
        { label: T('Mexico City integrated mobility card (overview)', 'بطاقة المواصلات الموحدة في مكسيكو سيتي'), href: 'https://mexicocity.cdmx.gob.mx/e/getting-around/mexico-city-metro-card/' }
      );
    } else if (cityKey === 'tor') {
      whereToStay.push(
        {
          icon: '✅',
          title: T('Downtown / near a TTC subway line', 'وسط المدينة / قرب خط TTC'),
          body: T(
            'Usually simplest for visitors: predictable routes, food options, and less dependence on taxis.',
            'عادةً الأسهل للزوار: مسارات أوضح، خيارات طعام، واعتماد أقل على التكاسي.'
          )
        },
        {
          icon: '✅',
          title: T('West Queen West / Liberty Village (popular base)', 'ويست كوين ويست / ليبرتي فيلاج (مناطق شائعة)'),
          body: T(
            'Often convenient for cafes and getting around. Always verify your exact transit route to the stadium area.',
            'مناطق مريحة للمشي والمقاهي. فقط تأكد من مسار المواصلات حسب موقع المباراة.'
          )
        }
      );

      beCareful.push(
        {
          icon: '⚠️',
          title: T('Assuming rideshare will be cheap on match day', 'افتراض أن أوبر/ليفت ستكون رخيصة يوم المباراة'),
          body: T(
            'Event surges can get expensive. A transit-based plan is usually calmer.',
            'الطلب وقت الفعاليات يرفع السعر. خطة تعتمد على المواصلات غالبًا أهدأ.'
          )
        }
      );

      smartLinks.push(
        { label: T('TTC fares and passes (PRESTO)', 'أسعار وتذاكر TTC (PRESTO)'), href: 'https://www.ttc.ca/Fares-and-passes' }
      );
    } else if (cityKey === 'dal_atl') {
      whereToStay.push(
        {
          icon: '✅',
          title: T('Stay where your return route is simple', 'اسكن حيث تكون العودة سهلة وواضحة'),
          body: T(
            'In some US cities, distances are bigger than expected. A “good” base is one with a predictable route back after the match.',
            'في بعض المدن الأمريكية المسافات أكبر مما تتوقع. “القاعدة الجيدة” هي التي تضمن عودة واضحة بعد المباراة.'
          )
        }
      );

      beCareful.push(
        {
          icon: '⚠️',
          title: T('Car-first neighborhoods without a plan', 'مناطق تعتمد على السيارة بدون خطة'),
          body: T(
            'If you’re not renting a car, don’t choose a place that forces you into repeated expensive rides.',
            'إن لم تستأجر سيارة، لا تختَر سكنًا يجبرك على مواصلات مكلفة كل مرة.'
          )
        }
      );

      smartLinks.push(
        { label: T('Dallas DART fares & passes', 'أسعار وتذاكر DART في دالاس'), href: 'https://www.dart.org/fare/general-fares-and-overview/fares' }
      );
    } else {
      whereToStay.push(
        {
          icon: '✅',
          title: T('Pick your base by the match-day route', 'اختر قاعدتك حسب مسار يوم المباراة'),
          body: T(
            'Don’t pick purely by price. Pick by: easy transit, fewer transfers, and a calm return plan after night matches.',
            'لا تختَر بالسعر فقط. اختر حسب: مواصلات سهلة، تبديلات أقل، وخطة عودة مريحة بعد المباريات الليلية.'
          )
        }
      );
      beCareful.push(
        {
          icon: '⚠️',
          title: T('Isolated/empty streets after dark', 'شوارع فارغة/معزولة ليلًا'),
          body: T(
            'Use Street View + recent reviews and check the walk from station to hotel late at night.',
            'استخدم Street View ومراجعات حديثة وافحص المشي من المحطة للسكن ليلًا.'
          )
        }
      );
    }

    return { whereToStay, beCareful, smartLinks };
  }, [selectedMatch?.city, isArabic]);

  const insuranceGuidance: CardItem[] = useMemo(() => {
    const T = (en: string, ar: string) => (isArabic ? ar : en);

    return [
      {
        icon: '🧠',
        title: T('Flight “insurance” ≠ medical coverage', 'تأمين الطيران ≠ تغطية طبية'),
        body: T(
          'Airline/credit-card coverage is often about delays/cancellation. Medical costs after you land can be separate.',
          'تغطية شركة الطيران/البطاقة غالبًا تتعلق بالتأخير أو الإلغاء. التكاليف الطبية بعد الوصول شيء آخر.'
        )
      },
      {
        icon: '💳',
        title: T('Reality: many travel medical claims are reimbursement', 'الواقع: كثير من المطالبات تكون “تعويض”'),
        body: T(
          'Often you pay first, then submit documents for reimbursement. Some plans can arrange payment for expensive procedures via assistance, but don’t assume it for everything.',
          'غالبًا تدفع أولًا ثم تقدّم مستندات للتعويض. بعض الخطط قد ترتّب الدفع لإجراءات مكلفة عبر المساعدة، لكن لا تفترض ذلك دائمًا.'
        )
      },
      {
        icon: '📄',
        title: T('What actually makes claims succeed', 'ما الذي يجعل التعويض ينجح فعلًا'),
        body: T(
          'Keep receipts, medical reports, and proof of travel dates. Without documents, claims become painful or denied.',
          'احتفظ بالإيصالات والتقارير الطبية وإثبات تواريخ السفر. بدون مستندات تصبح المطالبة صعبة أو قد تُرفض.'
        )
      }
    ];
  }, [isArabic]);

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

        {/* Be careful with */}
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

        {/* Insurance guidance */}
        <div className="card" style={{ background: 'hsl(var(--soft))', marginBottom: '12px' }}>
          <div className="kicker">{c.insuranceTitle}</div>
          <div className="small" style={{ marginTop: '6px' }}>{c.insuranceSubtitle}</div>
          <div className="hr"></div>
          <ul className="list">
            {insuranceGuidance.map((p, idx) => (
              <li key={idx}>
                <span style={{ marginInlineEnd: '8px' }}>{p.icon}</span>
                <strong>{p.title}:</strong> <span>{p.body}</span>
              </li>
            ))}
          </ul>

          <div className="small" style={{ marginTop: '10px', opacity: 0.9 }}>
            {isArabic
              ? 'ملاحظة واقعية: بعض خطط التأمين الطبي تعتمد على “تعويض” بعد الدفع، وبعضها قد يرتّب الدفع في حالات كبيرة عبر خدمة المساعدة. اقرأ الشروط قبل الشراء.'
              : 'Real note: many travel medical plans work via reimbursement, and some can arrange payment for expensive cases via assistance. Always read the policy before buying.'}
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
              href={selectedMatch?.city ? `https://www.google.com/search?q=${encodeURIComponent(selectedMatch.city + ' transit weekly pass card')}` : 'https://www.google.com/search?q=city+transit+weekly+pass'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isArabic ? 'بطاقة المواصلات الأسبوعية (بحث سريع)' : 'Weekly transit pass/card (quick search)'}
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
