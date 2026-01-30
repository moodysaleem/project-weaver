import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CheckItem {
  id: string;
  label: { en: string; ar: string };
  checked: boolean;
}

const INITIAL_CHECKS: CheckItem[] = [
  { id: 'photo', label: { en: 'Photo meets requirements (size, background, recency)', ar: 'الصورة تستوفي المتطلبات (الحجم، الخلفية، الحداثة)' }, checked: false },
  { id: 'passport', label: { en: 'Passport valid for 6+ months beyond travel date', ar: 'جواز السفر صالح لأكثر من 6 أشهر بعد تاريخ السفر' }, checked: false },
  { id: 'forms', label: { en: 'All required forms completed and signed', ar: 'جميع النماذج المطلوبة مكتملة وموقعة' }, checked: false },
  { id: 'fees', label: { en: 'Application fees paid', ar: 'رسوم الطلب مدفوعة' }, checked: false },
  { id: 'copies', label: { en: 'Copies of all documents made', ar: 'نسخ من جميع المستندات موجودة' }, checked: false },
  { id: 'translations', label: { en: 'Translations certified (if required)', ar: 'الترجمات معتمدة (إذا لزم الأمر)' }, checked: false },
  { id: 'financials', label: { en: 'Financial documents ready (bank statements, etc.)', ar: 'المستندات المالية جاهزة (كشوف الحساب، إلخ)' }, checked: false },
  { id: 'insurance', label: { en: 'Travel/health insurance arranged', ar: 'تأمين السفر/الصحة مرتب' }, checked: false },
];

export default function VerifyPage() {
  const { lang, t, isArabic } = useLanguage();
  const [checks, setChecks] = useState<CheckItem[]>(INITIAL_CHECKS);

  const content = {
    en: {
      title: 'Application Validation Checklist',
      subtitle: 'First-pass checks to catch common mistakes before submission. Go through each item carefully.',
      progress: 'Progress',
      complete: 'complete',
      allDone: 'All checks complete! Your application looks ready.',
      stillPending: 'items remaining',
      reset: 'Reset Checklist',
      tip: 'Tip: Always double-check with the official requirements for your specific visa type and destination.',
    },
    ar: {
      title: 'قائمة التحقق من الطلب',
      subtitle: 'فحوصات أولية لاكتشاف الأخطاء الشائعة قبل الإرسال. راجع كل عنصر بعناية.',
      progress: 'التقدم',
      complete: 'مكتمل',
      allDone: 'جميع الفحوصات مكتملة! يبدو طلبك جاهزاً.',
      stillPending: 'عناصر متبقية',
      reset: 'إعادة تعيين القائمة',
      tip: 'نصيحة: تحقق دائماً من المتطلبات الرسمية لنوع تأشيرتك ووجهتك المحددة.',
    }
  };

  const c = content[lang];

  const completedCount = checks.filter(c => c.checked).length;
  const totalCount = checks.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const allComplete = completedCount === totalCount;

  const toggleCheck = (id: string) => {
    setChecks(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const resetChecks = () => {
    setChecks(INITIAL_CHECKS);
  };

  return (
    <div className="card">
      <div className="kicker">{t.nav_verify}</div>
      <div className="big">{c.title}</div>
      <div className="small">{c.subtitle}</div>
      <div className="hr"></div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="kicker">{c.progress}</span>
          <span className={`badge ${allComplete ? 'ok' : 'warn'}`}>
            {allComplete ? c.allDone : `${totalCount - completedCount} ${c.stillPending}`}
          </span>
        </div>
        <div style={{ 
          height: '8px', 
          background: 'hsl(var(--soft))', 
          borderRadius: '4px', 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            height: '100%', 
            width: `${progressPercent}%`, 
            background: allComplete ? 'hsl(var(--ok))' : 'hsl(var(--brand))',
            transition: 'width 0.3s ease',
            borderRadius: '4px'
          }} />
        </div>
      </div>

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {checks.map((item) => (
          <div
            key={item.id}
            className={`option ${item.checked ? 'selected' : ''}`}
            onClick={() => toggleCheck(item.id)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                border: item.checked ? 'none' : '2px solid hsl(var(--border))',
                background: item.checked ? 'hsl(var(--ok))' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {item.checked && '✓'}
              </div>
              <span style={{ 
                textDecoration: item.checked ? 'line-through' : 'none',
                color: item.checked ? 'hsl(var(--muted))' : 'inherit'
              }}>
                {item.label[lang]}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="hr"></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="small" style={{ margin: 0 }}>
          <em>{c.tip}</em>
        </div>
        <button className="btn" onClick={resetChecks}>
          {c.reset}
        </button>
      </div>
    </div>
  );
}
