import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface ToolCardProps {
  href: string;
  title: string;
  description: string;
  cta: string;
}

function ToolCard({ href, title, description, cta }: ToolCardProps) {
  return (
    <div className="card">
      <div className="kicker">{title}</div>
      <div className="big">{title}</div>
      <div className="small">{description}</div>
      <div style={{ marginTop: '12px' }}>
        <Link className="btn primary" to={href}>
          {cta}
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { lang, t, isArabic } = useLanguage();

  const tools = [
    {
      href: '/immigration',
      title: t.nav_move,
      description: isArabic
        ? 'اختبار قصير لتقليل القلق وتحديد نقطة البداية.'
        : '2‑minute guide to narrow options and reduce uncertainty.',
    },
    {
      href: '/verify',
      title: t.nav_verify,
      description: isArabic
        ? 'فحص أولي لاكتشاف الأخطاء الشائعة قبل الإرسال.'
        : 'First‑pass checks to catch common mistakes before submission.',
    },
    {
      href: '/worldcup',
      title: t.nav_wc,
      description: isArabic
        ? 'خطة سفر هادئة لأسبوع المباراة وروابط مفيدة.'
        : 'Calm match‑week plan + helpful links.',
    },
  ];

  return (
    <div className="card">
      <div className="kicker">
        {isArabic ? 'اختر أداة' : 'Choose a tool'}
      </div>
      <div className="big">
        {isArabic ? 'بماذا تحتاج مساعدة اليوم؟' : 'What do you need help with today?'}
      </div>
      <div className="small">
        {isArabic
          ? 'اختر أداة واحدة لتحصل على وضوح وخطوات عملية.'
          : 'Pick one tool to get clarity and next steps.'}
      </div>
      <div className="hr"></div>
      <div className="grid two">
        {tools.map((tool) => (
          <ToolCard
            key={tool.href}
            href={tool.href}
            title={tool.title}
            description={tool.description}
            cta={t.open}
          />
        ))}
      </div>
    </div>
  );
}
