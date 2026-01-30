import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const { lang, t, setLanguage } = useLanguage();
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/+$/, '') || '/';

  const navItems = [
    { href: '/', label: t.nav_home },
    { href: '/immigration', label: t.nav_move },
    { href: '/verify', label: t.nav_verify },
    { href: '/worldcup', label: t.nav_wc },
  ];

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="kicker">{t.site_name}</div>
          <div className="big">{t.site_name}</div>
          <div className="small">{t.site_tagline}</div>
          <nav className="nav">
            {navItems.map((item) => {
              const isActive = (item.href === '/' && currentPath === '/') || 
                               (item.href !== '/' && currentPath === item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={isActive ? 'active' : ''}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${lang === 'en' ? 'primary' : ''}`}
            type="button"
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
          <button
            className={`btn ${lang === 'ar' ? 'primary' : ''}`}
            type="button"
            onClick={() => setLanguage('ar')}
          >
            AR
          </button>
        </div>
      </div>
      <div className="hr"></div>
      <div id="page">
        {children}
      </div>
      <div className="footer">{t.disclaimer}</div>
    </div>
  );
}
