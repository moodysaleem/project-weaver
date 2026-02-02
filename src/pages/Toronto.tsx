import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AFFILIATE } from '@/lib/i18n';

export default function TorontoGuide() {
  const { lang, isArabic } = useLanguage();

  const t = {
    en: {
      title: 'World Cup 2026 – Toronto Guide',
      subtitle: 'Practical, calm guidance for match week (no generic advice).',

      entryTitle: 'Entry reality (Canada vs USA)',
      entryBody:
        'For many travelers, Canada feels more accessible. Canada uses an ETA for visa-exempt nationalities, while the US uses ESTA. Both are electronic, but Canada often feels less intimidating for families and first-time visitors.',

      stayTitle: 'Comfortable areas to stay (by name)',
      staySubtitle:
        'These bases are usually easier for visitors: predictable transit, food nearby, and calmer late-night returns.',
      areas: [
        {
          name: 'Downtown Toronto (near TTC subway)',
          body: 'Central, predictable transit, easiest logistics for events and late returns.',
        },
        {
          name: 'The Annex',
          body: 'Comfortable residential feel, good subway access, popular with families.',
        },
        {
          name: 'Yorkville (higher budget)',
          body: 'More expensive, but calm streets, services, and easier walking.',
        },
        {
          name: 'Mississauga (only if near GO / transit)',
          body: 'Can work for families if you are very close to a reliable transit line.',
        },
      ],

      bumpsTitle: 'مطبات الراحة (what often surprises visitors)',
      bumps: [
        {
          title: 'Relying on Uber during match days',
          body: 'Surge pricing adds up fast during events.',
        },
        {
          title: 'Late-night transfers + long walks',
          body: 'Even safe cities feel stressful when tired with family.',
        },
        {
          title: '“Looks close on the map”',
          body: 'Transfers matter more than distance.',
        },
      ],

      transitTitle: 'Transport math (real numbers)',
      transitBody:
        'A TTC weekly pass costs roughly CAD $40–50. Using rideshares twice per day can easily exceed CAD $300–400 in a week.',
      transitFix:
        'Choose a base near a TTC subway line and test the return route after 10pm.',

      healthTitle: 'Healthcare reality (important)',
      healthBody:
        'In Canada, visitors are NOT covered by public healthcare. A doctor or emergency visit can cost hundreds to thousands of dollars.',
      healthFix:
        'Many insurance plans reimburse later (you pay first). For peace of mind, choose coverage with an assistance network that can coordinate care and arrange payment for expensive cases. Always read policy details.',

      planTitle: 'Your calm match-week plan',
      plan: [
        'Pick a base near TTC and book with flexible cancellation',
        'Test your late-night return route once',
        'Choose medical coverage that matches “pay-first vs arranged payment”',
        'Save match tickets and addresses offline',
      ],

      linksTitle: 'Useful links',
      note:
        'Guidance only. Not official legal or medical advice.',
    },

    ar: {
      title: 'كأس العالم 2026 – دليل تورونتو',
      subtitle: 'إرشادات عملية وهادئة لأسبوع المباراة (بدون كلام عام).',

      entryTitle: 'الدخول: كندا مقابل أمريكا',
      entryBody:
        'بالنسبة لكثير من المسافرين، كندا تبدو أسهل. كندا تستخدم تصريح السفر الإلكتروني (ETA) لبعض الجنسيات، بينما أمريكا تستخدم ESTA. كلاهما إلكتروني، لكن كندا غالبًا تُشعِر العائلات بطمأنينة أكبر.',

      stayTitle: 'مناطق مريحة للسكن (بالأسماء)',
      staySubtitle:
        'هذه قواعد غالبًا أسهل للزوار: مواصلات واضحة، خدمات قريبة، وعودة أهدأ ليلًا.',
      areas: [
        {
          name: 'وسط تورونتو (قرب مترو TTC)',
          body: 'مركزي، مواصلات متوقعة، وأسهل لوجستيات للفعاليات.',
        },
        {
          name: 'ذا أنيكس (The Annex)',
          body: 'حي سكني مريح، مناسب للعائلات، واتصال جيد بالمترو.',
        },
        {
          name: 'يوركفيل (ميزانية أعلى)',
          body: 'أغلى، لكن شوارع أهدأ وخدمات أسهل للمشي.',
        },
        {
          name: 'ميسيساغا (فقط قرب مواصلات قوية)',
          body: 'قد تكون مناسبة للعائلات إذا كنت قريبًا جدًا من خط مواصلات موثوق.',
        },
      ],

      bumpsTitle: 'مطبات الراحة (أشياء تفاجئ الزوار)',
      bumps: [
        {
          title: 'الاعتماد على أوبر في أيام المباريات',
          body: 'الأسعار ترتفع بسرعة مع الفعاليات.',
        },
        {
          title: 'تبديلات ليلية مع مشي طويل',
          body: 'حتى المدن الآمنة تصبح مرهقة مع التعب والعائلة.',
        },
        {
          title: '“يبدو قريبًا على الخريطة”',
          body: 'التبديلات أهم من المسافة.',
        },
      ],

      transitTitle: 'حسابات المواصلات (أرقام حقيقية)',
      transitBody:
        'بطاقة TTC الأسبوعية تكلف تقريبًا 40–50 دولار كندي. استخدام تطبيقات النقل مرتين يوميًا قد يتجاوز 300–400 دولار في أسبوع.',
      transitFix:
        'اختر قاعدة قرب مترو TTC واختبر العودة بعد الساعة 10 مساءً.',

      healthTitle: 'حقيقة التأمين الصحي (مهم)',
      healthBody:
        'في كندا، الزائر غير مشمول بالتأمين الصحي الحكومي. زيارة طبيب أو الطوارئ قد تكلف مئات إلى آلاف الدولارات.',
      healthFix:
        'كثير من الخطط تعمل بنظام التعويض لاحقًا (تدفع أولًا). لراحة بال أكبر، اختر تغطية مع خدمة مساعدة يمكنها تنسيق العلاج وترتيب الدفع للحالات المكلفة. اقرأ الشروط دائمًا.',

      planTitle: 'خطتك الهادئة لأسبوع المباراة',
      plan: [
        'اختر قاعدة قرب TTC واحجز بإلغاء مرن',
        'اختبر مسار العودة ليلًا مرة واحدة',
        'اختر تغطية طبية تناسب “الدفع أولًا مقابل ترتيب الدفع”',
        'احفظ التذاكر والعناوين بدون إنترنت',
      ],

      linksTitle: 'روابط مفيدة',
      note:
        'إرشادات عامة فقط وليست استشارة قانونية أو طبية.',
    },
  }[lang];

  return (
    <div className="card">
      <div className="big">{t.title}</div>
      <div className="small">{t.subtitle}</div>

      <div className="hr" />

      <div className="kicker">{t.entryTitle}</div>
      <p className="small">{t.entryBody}</p>

      <div className="hr" />

      <div className="kicker">{t.stayTitle}</div>
      <p className="small">{t.staySubtitle}</p>

      <ul className="list">
        {t.areas.map(a => (
          <li key={a.name}>
            <strong>{a.name}:</strong> {a.body}
          </li>
        ))}
      </ul>

      <div className="hr" />

      <div className="kicker">{t.bumpsTitle}</div>
      <ul className="list">
        {t.bumps.map(b => (
          <li key={b.title}>
            <strong>{b.title}:</strong> {b.body}
          </li>
        ))}
      </ul>

      <div className="hr" />

      <div className="kicker">{t.transitTitle}</div>
      <p className="small">{t.transitBody}</p>
      <p className="small" style={{ fontWeight: 700 }}>{t.transitFix}</p>

      <div className="hr" />

      <div className="kicker">{t.healthTitle}</div>
      <p className="small">{t.healthBody}</p>
      <p className="small" style={{ fontWeight: 700 }}>{t.healthFix}</p>

      <div className="hr" />

      <div className="kicker">{t.planTitle}</div>
      <ul className="list">
        {t.plan.map(p => (
          <li key={p}>✅ {p}</li>
        ))}
      </ul>

      <div className="hr" />

      <div className="kicker">{t.linksTitle}</div>
      <div className="grid two">
        <a className="linkcard" href={AFFILIATE.booking} target="_blank" rel="noreferrer">
          Booking.com – {isArabic ? 'حجز الإقامة' : 'Book accommodation'}
        </a>
        <a className="linkcard" href={AFFILIATE.insurance} target="_blank" rel="noreferrer">
          SafetyWing – {isArabic ? 'تأمين السفر' : 'Travel insurance'}
        </a>
      </div>

      <p className="small" style={{ marginTop: '12px', opacity: 0.8 }}>
        {t.note}
      </p>
    </div>
  );
}
