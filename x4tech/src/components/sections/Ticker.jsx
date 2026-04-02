import React from 'react';

const items = [
  'App Development', 'Website Design', 'Logo Design', 'Brand Identity',
  'UI/UX Design', 'Poster Design', 'E-Commerce', 'Mobile Apps',
  'React Native', 'Figma to Code', 'SEO Optimization', 'Webflow'
];

export default function Ticker() {
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="ticker-item">
            {item}
            <span className="ticker-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
