'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categories as defaultCategories } from '../data/categories';
import { useData } from '../context/DataContext';

export default function CategorySection() {
  const { categories: ctxCategories } = useData();

  // Deduplicate categories by ID, Slug, and normalized Name
  const categories = [];
  const seenKeys = new Set();

  const addIfUnique = (cat) => {
    if (!cat || !cat.name) return;
    const normName = cat.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    const normId = String(cat.id || cat.slug || normName).toLowerCase();
    
    if (!seenKeys.has(normName) && !seenKeys.has(normId)) {
      seenKeys.add(normName);
      seenKeys.add(normId);
      categories.push(cat);
    }
  };

  const rawCategories = (ctxCategories && ctxCategories.length > 0) ? ctxCategories : defaultCategories;
  rawCategories.forEach(addIfUnique);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (typeof window !== 'undefined') {
        const el = document.getElementById('categories-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getCleanDescription = (cat) => {
    if (!cat.description || cat.description.length < 6 || cat.description.toLowerCase().includes('kghj')) {
      return `High-performance industrial equipment engineered for ${cat.name || 'construction'}.`;
    }
    return cat.description;
  };

  return (
    <section id="categories-section" style={{ padding: '90px 0', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>MACHINERY CATEGORIES</div>
          <h2 className="heading-md" style={{ marginBottom: '12px' }}>
            Purpose-Built Equipment for Every Stage
          </h2>
          <p className="text-body">
            Explore our comprehensive range of high-performance construction and rebar processing machinery for all site requirements.
          </p>
        </div>

        {/* Centered Responsive Flex Grid */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '48px'
          }}
          className="categories-grid"
        >
          {currentCategories.map((cat) => (
            <div 
              key={cat.id || cat.slug || cat.name}
              style={{
                width: '100%',
                maxWidth: '280px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              className="cat-card-item"
            >
              {/* Top Image Box */}
              <div 
                style={{
                  height: '190px',
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
                <img 
                  src={cat.image || "/images/machines/stirrup-bender-d4.jpg"} 
                  alt={cat.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/machines/stirrup-bender-d4.jpg";
                  }}
                  style={{ 
                    maxHeight: '100%', 
                    maxWidth: '100%', 
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto',
                    transition: 'transform 0.4s ease'
                  }}
                  className="cat-img-zoom"
                />
              </div>

              {/* Card Content */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'center' }}>
                <h3 
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    marginBottom: '8px',
                    lineHeight: 1.35,
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}
                >
                  {cat.name}
                </h3>

                <p 
                  style={{
                    fontSize: '0.825rem',
                    color: '#64748B',
                    lineHeight: 1.45,
                    marginBottom: '20px',
                    minHeight: '36px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {getCleanDescription(cat)}
                </p>

                <Link 
                  href={`/products?category=${cat.id || cat.slug}`}
                  style={{
                    marginTop: 'auto',
                    backgroundColor: '#F47B20',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    display: 'inline-block',
                    boxShadow: '0 2px 10px rgba(244, 123, 32, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                  className="cat-btn"
                >
                  View Products
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* Pagination Controls Component */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                backgroundColor: currentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                color: currentPage === 1 ? '#94A3B8' : '#1E293B',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '6px',
                    border: isActive ? '1px solid #F47B20' : '1px solid #E2E8F0',
                    backgroundColor: isActive ? '#F47B20' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#1E293B',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                backgroundColor: currentPage === totalPages ? '#F1F5F9' : '#FFFFFF',
                color: currentPage === totalPages ? '#94A3B8' : '#1E293B',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>

      <style jsx>{`
        .cat-card-item:hover {
          transform: translateY(-6px);
          border-color: rgba(244, 123, 32, 0.4) !important;
          box-shadow: 0 16px 32px rgba(244, 123, 32, 0.12) !important;
        }
        .cat-card-item:hover .cat-img-zoom {
          transform: scale(1.06);
        }
        .cat-btn:hover {
          background-color: #E0670F !important;
          box-shadow: 0 4px 14px rgba(244, 123, 32, 0.4) !important;
        }
        @media (max-width: 768px) {
          .cat-card-item {
            max-width: 100% !important;
            width: calc(50% - 12px) !important;
          }
        }
        @media (max-width: 520px) {
          .cat-card-item {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
