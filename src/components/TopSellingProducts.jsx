'use client';

import Link from 'next/link';
import { Tag, ArrowRight, Eye, Send, Award } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function TopSellingProducts({ onOpenQuote }) {
  const { products } = useData();
  const topProducts = products ? products.filter(p => p.isTopSelling || true).slice(0, 8) : [];

  return (
    <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(244, 123, 32, 0.1)',
              color: '#F47B20',
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              padding: '6px 16px',
              borderRadius: '20px',
              marginBottom: '14px',
              textTransform: 'uppercase',
              border: '1px solid rgba(244, 123, 32, 0.2)'
            }}
          >
            <Award size={14} />
            <span>HEAVY-DUTY MACHINERY</span>
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0B1F33', marginBottom: '10px', letterSpacing: '-0.02em' }}>
            Top Selling Products
          </h2>

          <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.5 }}>
            Available for bulk orders with factory-direct pricing and Pan India delivery
          </p>
        </div>

        {/* 4-Column / 3-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }} className="top-selling-grid">
          {topProducts.map((prod) => (
            <div 
              key={prod.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              className="top-product-card"
            >
              {/* Product Thumbnail Header Area */}
              <div 
                style={{
                  height: '210px',
                  background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
                  borderBottom: '1px solid #F1F5F9',
                  padding: '20px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {/* Product Model Code Badge */}
                {prod.code && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      backgroundColor: '#0F172A',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      letterSpacing: '0.05em',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}
                  >
                    {prod.code}
                  </div>
                )}

                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  style={{ 
                    maxHeight: '100%', 
                    maxWidth: '100%', 
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto',
                    transition: 'transform 0.4s ease'
                  }}
                  className="product-img-zoom"
                />
              </div>

              {/* Product Content */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1.4,
                    marginBottom: '12px',
                    minHeight: '44px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                  title={prod.name}
                >
                  {prod.name}
                </h3>

                {/* Price Tag Badge */}
                <div 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    backgroundColor: 'rgba(244, 123, 32, 0.08)',
                    border: '1px solid rgba(244, 123, 32, 0.18)',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    width: 'fit-content',
                    fontSize: '0.875rem', 
                    fontWeight: 800, 
                    color: '#EA580C', 
                    marginBottom: '20px' 
                  }}
                >
                  <Tag size={14} style={{ color: '#F47B20' }} />
                  <span>{prod.priceFormatted || '₹ 1,50,000'}</span>
                </div>

                {/* Buttons Row (View & Get Quote) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: 'auto' }}>
                  <Link 
                    href={`/products/${prod.id}`}
                    style={{
                      border: '1.5px solid #CBD5E1',
                      color: '#334155',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    className="top-view-btn"
                  >
                    <Eye size={15} />
                    <span>View</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => onOpenQuote && onOpenQuote(prod)}
                    style={{
                      backgroundColor: '#F47B20',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(244, 123, 32, 0.25)',
                      transition: 'all 0.2s ease'
                    }}
                    className="top-quote-btn"
                  >
                    <Send size={14} />
                    <span>Get Quote</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Bottom Center CTA Button */}
        <div style={{ textAlign: 'center' }}>
          <Link 
            href="/products" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#F47B20',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.925rem',
              padding: '14px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              boxShadow: '0 4px 16px rgba(244, 123, 32, 0.35)',
              transition: 'all 0.2s ease'
            }}
            className="top-view-all-btn"
          >
            <span>VIEW ALL PRODUCTS</span>
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>

      <style jsx>{`
        .top-product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(244, 123, 32, 0.12) !important;
          border-color: rgba(244, 123, 32, 0.4) !important;
        }
        .top-product-card:hover .product-img-zoom {
          transform: scale(1.06);
        }
        .top-view-btn:hover {
          border-color: #F47B20 !important;
          color: #F47B20 !important;
          background-color: rgba(244, 123, 32, 0.04) !important;
        }
        .top-quote-btn:hover {
          background-color: #E0670F !important;
          box-shadow: 0 4px 14px rgba(244, 123, 32, 0.4) !important;
        }
        .top-view-all-btn:hover {
          background-color: #E0670F !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(244, 123, 32, 0.45) !important;
        }
        @media (max-width: 1100px) {
          .top-selling-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .top-selling-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 500px) {
          .top-selling-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

