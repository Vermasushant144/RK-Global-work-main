'use client';

export default function Logo({ width = 220, height = 60, lightMode = true }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      textDecoration: 'none'
    }}>
      {/* Circular logo image */}
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid #F47B20',
        flexShrink: 0,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(244,123,32,0.25)'
      }}>
        <img
          src="/logo.png"
          alt="R K Global Engineering"
          style={{
            width: '44px',
            height: '44px',
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </div>

      {/* Brand text */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 900,
          fontSize: '1.15rem',
          letterSpacing: '0.04em',
          color: lightMode ? '#0B1F33' : '#FFFFFF'
        }}>
          R K <span style={{ color: '#F47B20' }}>GLOBAL</span>
        </span>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: '0.62rem',
          letterSpacing: '0.18em',
          color: lightMode ? '#5A6578' : '#94A3B8',
          textTransform: 'uppercase'
        }}>
          Engineering
        </span>
      </div>
    </div>
  );
}
