import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AFFILIATE } from '@/lib/i18n';

export default function ImmigrationPage() {
  const { lang, t, isArabic } = useLanguage();

  const content = {
    en: {
      title: 'Immigration / Relocation Guide',
      subtitle: 'A 2-minute guide to narrow your options and reduce uncertainty about moving abroad.',
      section1Title: 'Before You Start',
      section1Items: [
        'Research visa requirements for your nationality',
        'Check language requirements for your destination',
        'Understand the cost of living',
        'Look into healthcare and insurance options',
      ],
      section2Title: 'Common Pathways',
      pathways: [
        { title: 'Work Visa', desc: 'Sponsored by an employer in the destination country' },
        { title: 'Student Visa', desc: 'Enroll in an educational institution' },
        { title: 'Family Reunification', desc: 'Join family members already residing there' },
        { title: 'Skilled Worker Programs', desc: 'Points-based systems (Canada, Australia, etc.)' },
      ],
      section3Title: 'Useful Resources',
      languageTest: 'Language Proficiency Tests',
      languageLearn: 'Language Learning',
      comingSoon: 'More detailed guides coming soon. This is an MVP focused on clarity.',
    },
    ar: {
      title: 'دليل الهجرة / الانتقال',
      subtitle: 'دليل من دقيقتين لتضييق خياراتك وتقليل عدم اليقين بشأن الانتقال للخارج.',
      section1Title: 'قبل أن تبدأ',
      section1Items: [
        'ابحث عن متطلبات التأشيرة لجنسيتك',
        'تحقق من متطلبات اللغة لوجهتك',
        'افهم تكلفة المعيشة',
        'ابحث في خيارات الرعاية الصحية والتأمين',
      ],
      section2Title: 'المسارات الشائعة',
      pathways: [
        { title: 'تأشيرة عمل', desc: 'برعاية صاحب عمل في البلد المقصد' },
        { title: 'تأشيرة طالب', desc: 'التسجيل في مؤسسة تعليمية' },
        { title: 'لم شمل الأسرة', desc: 'الانضمام إلى أفراد الأسرة المقيمين هناك' },
        { title: 'برامج العمال المهرة', desc: 'أنظمة النقاط (كندا، أستراليا، إلخ)' },
      ],
      section3Title: 'موارد مفيدة',
      languageTest: 'اختبارات إجادة اللغة',
      languageLearn: 'تعلم اللغة',
      comingSoon: 'المزيد من الأدلة التفصيلية قادمة قريباً. هذا نموذج أولي يركز على الوضوح.',
    }
  };

  const c = content[lang];

  return (
    <div className="card">
      <div className="kicker">{t.nav_move}</div>
      <div className="big">{c.title}</div>
      <div className="small">{c.subtitle}</div>
      <div className="hr"></div>

      {/* Section 1: Before You Start */}
      <div className="kicker">{c.section1Title}</div>
      <ul className="list">
        {c.section1Items.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>

      <div className="hr"></div>

      {/* Section 2: Common Pathways */}
      <div className="kicker">{c.section2Title}</div>
      <div className="grid two" style={{ marginTop: '12px' }}>
        {c.pathways.map((pathway, i) => (
          <div key={i} className="result-item">
            <div style={{ fontWeight: 900 }}>{pathway.title}</div>
            <div className="small" style={{ margin: 0 }}>{pathway.desc}</div>
          </div>
        ))}
      </div>

      <div className="hr"></div>

      {/* Section 3: Useful Resources */}
      <div className="kicker">{c.section3Title}</div>
      <div className="grid two" style={{ marginTop: '12px' }}>
        <div className="linkcard">
          <div style={{ fontWeight: 900, marginBottom: '8px' }}>{c.languageTest}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <a href={AFFILIATE.languageTest.en} target="_blank" rel="noopener noreferrer">English (EF SET)</a>
            <a href={AFFILIATE.languageTest.de} target="_blank" rel="noopener noreferrer">German (Goethe)</a>
            <a href={AFFILIATE.languageTest.fr} target="_blank" rel="noopener noreferrer">French (DELF)</a>
          </div>
        </div>
        <div className="linkcard">
          <div style={{ fontWeight: 900, marginBottom: '8px' }}>{c.languageLearn}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <a href={AFFILIATE.languageLearn.en} target="_blank" rel="noopener noreferrer">Duolingo</a>
            <a href={AFFILIATE.languageLearn.de} target="_blank" rel="noopener noreferrer">DW German</a>
            <a href={AFFILIATE.languageLearn.fr} target="_blank" rel="noopener noreferrer">TV5Monde</a>
          </div>
        </div>
      </div>

      <div className="hr"></div>
      <div className="small" style={{ textAlign: 'center' }}>
        <em>{c.comingSoon}</em>
      </div>
    </div>
  );
}
