import React from 'react';
import { ArrowUpRight } from 'lucide-react';

// PortfolioCard - Styled to match site (glass, dark, responsive, bottom overlay)
function PortfolioCard({ portfolio = {} }) {
  // Featured image
  const featuredImage =
    portfolio._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    portfolio.featured_image_url ||
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop';

  // Title
  const title = portfolio.title?.rendered || portfolio.title || 'Untitled Project';

  // Category / Type
  const category =
    portfolio.project_type ||
    (Array.isArray(portfolio.categories_names) ? portfolio.categories_names[0] : undefined) ||
    'Website Design';

  // Date
  let dateStr = '—';
  if (portfolio.date_completed) {
    const d = new Date(portfolio.date_completed);
    if (!isNaN(d)) dateStr = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } else if (portfolio.date) {
    const d = new Date(portfolio.date);
    if (!isNaN(d)) dateStr = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  // Link
  let link = portfolio.project_url || portfolio.link || (portfolio.slug ? `/portfolio/${portfolio.slug}` : '#');
  if (link && !/^https?:\/\//i.test(link) && !link.startsWith('/')) {
    link = `https://${link}`;
  }

  return (
    <div
      className="group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 mx-auto"
      style={{
        background: '#1A1A1A',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        border: '2px solid transparent',
        maxWidth: '900px',
        width: '100%'
      }}
    >
      {/* Image */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <img
          src={featuredImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Bottom overlay content */}
      <div
        className="absolute flex flex-row gap-2 sm:gap-3 justify-center items-center"
        style={{
          left: '50%',
          bottom: '12px',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 24px)',
          maxWidth: '800px',
          paddingTop: '8px',
          paddingBottom: '8px',
          paddingLeft: '12px',
          paddingRight: '8px',
          borderRadius: '16px',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(16px)'
        }}
      >
        <div className="flex-1 text-left min-w-0">
          <div
            className="text-xs mb-1 font-light uppercase tracking-wider"
            style={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            {category}
          </div>
          <h3 className="mb-1">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-white hover:no-underline line-clamp-2"
            >
              {title}
            </a>
          </h3>
          {dateStr !== '—' && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-white/70 hover:text-white transition-colors">
              {dateStr}
            </a>
          )}
        </div>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center transition-all duration-300 group-hover:scale-105 flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-[148px] xl:h-[148px] rounded-xl sm:rounded-2xl"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'transparent'
          }}
          aria-label="Open project"
        >
          <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10" strokeWidth={2} style={{ color: '#FFFFFF' }} />
        </a>
      </div>
    </div>
  );
}

export default PortfolioCard;
