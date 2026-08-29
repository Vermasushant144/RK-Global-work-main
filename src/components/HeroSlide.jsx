'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Crosshair, ShieldCheck, Settings, Headphones, 
  Layers, Zap, Sliders, CheckCircle2, Wrench, Award, Cpu, MapPin 
} from 'lucide-react';

const iconMap = {
  Crosshair, ShieldCheck, Settings, Headphones, Layers,
  Zap, Sliders, CheckCircle2, Wrench, Award, Cpu, MapPin
};

export default function HeroSlide({ slide, isActive, onOpenQuote }) {
  const [imgSrc, setImgSrc] = useState(slide.image || '/images/machines/stirrup-bender-d4.webp');

  const handleError = () => {
    if (slide.fallbackImage && imgSrc !== slide.fallbackImage) {
      setImgSrc(slide.fallbackImage);
    } else {
      setImgSrc('/images/machines/rebar-bending-machine.webp');
    }
  };

  const title = slide.title || (slide.headingLine1 ? `${slide.headingLine1} ${slide.headingLine2 || ''}` : 'Heavy Duty Construction Machinery');
  const description = slide.subtitle || slide.description || 'High performance B2B construction equipment manufactured in India with ex-factory pricing and 1-year warranty.';
  const badgeText = slide.badge || slide.eyebrow || 'R K GLOBAL ENGINEERING';
  const featuresList = slide.features && Array.isArray(slide.features) ? slide.features : [
    { icon: 'ShieldCheck', label: 'ISO 9001 Certified' },
    { icon: 'Award', label: 'Factory Direct Price' },
    { icon: 'Wrench', label: '1-Year Warranty' },
    { icon: 'CheckCircle2', label: 'Pan-India Delivery' }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      minHeight: '580px',
      width: '100%',
      backgroundColor: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '4px solid #F47B20'
    }}>

      {/* Single unified row: text left, image right — no nested wrappers */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0',
        padding: '60px 80px',
        width: '100%',
        maxWidth: '1300px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>

        {/* LEFT: Text block */}
        <div style={{ flex: '1 1 50%', paddingRight: '48px' }}>

          {/* Badge */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{
              backgroundColor: '#F47B20',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 900,
              padding: '5px 16px',
              borderRadius: '20px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}>
              {badgeText}
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2rem, 3.2vw, 3rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: '16px',
            color: '#0B1F33'
          }}>
            {title}
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '1rem',
            color: '#4A5568',
            lineHeight: 1.7,
            marginBottom: '28px'
          }}>
            {description}
          </p>

          {/* Features */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px 24px',
            marginBottom: '36px'
          }}>
            {featuresList.map((feat, idx) => {
              const IconComp = iconMap[feat.icon] || ShieldCheck;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: 'rgba(244,123,32,0.12)',
                    color: '#F47B20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComp size={13} />
                  </div>
                  <span style={{ fontSize: '0.83rem', fontWeight: 700, color: '#1A202C' }}>
                    {feat.label || feat.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenQuote}
              style={{ padding: '13px 28px', fontSize: '0.92rem', borderRadius: '8px' }}
            >
              <span>{slide.btnPrimaryText || 'Request Quote Now'}</span>
              <ArrowRight size={17} />
            </button>
            <Link
              href="/products"
              className="btn btn-outline"
              style={{ borderColor: '#0B1F33', color: '#0B1F33', padding: '13px 28px', fontSize: '0.92rem', borderRadius: '8px' }}
            >
              <span>{slide.btnSecondaryText || 'View 2026 Catalog'}</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        {/* RIGHT: Image — inline, no wrapper, no border, blends with white bg */}
        <div style={{
          flex: '1 1 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={slide.image || imgSrc}
            alt={title}
            onError={handleError}
            style={{
              maxWidth: '90%',
              maxHeight: '440px',
              width: '900px',
              height: '800px',
              objectFit: 'contain',
              display: 'flex',
              mixBlendMode: 'multiply'
            }}
          />
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          div[style*="space-between"] {
            flex-direction: column !important;
            padding: 40px 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
