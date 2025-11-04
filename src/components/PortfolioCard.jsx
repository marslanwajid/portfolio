// PortfolioCard Component
// This component receives portfolio data and displays it in a card format

function PortfolioCard({ portfolio }) {
  // 'portfolio' is the data passed from App.jsx (coming from WordPress API)
  
  // Extract featured image URL from embedded data
  const featuredImage = 
    portfolio._embedded &&
    portfolio._embedded['wp:featuredmedia'] &&
    portfolio._embedded['wp:featuredmedia'][0]?.source_url;

  return (
    <div className="border border-gray-300 rounded-lg p-6 mb-8 bg-white shadow-md">
      {/* Portfolio Title */}
      <h2 className="mt-0 text-gray-800 text-2xl font-bold mb-4">
        {portfolio.title.rendered}
      </h2>

      {/* Featured Image (if exists) */}
      {featuredImage && (
        <img
          src={featuredImage}
          alt={portfolio.title.rendered}
          className="w-full max-w-lg h-auto rounded mb-4 block"
        />
      )}

      {/* Content from WordPress */}
      <div
        className="my-4 text-gray-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: portfolio.content.rendered }}
      />

      {/* Project URL (if exists) */}
      {portfolio.project_url && (
        <p className="mt-4">
          <a 
            href={portfolio.project_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 no-underline font-semibold hover:text-blue-800 hover:underline"
          >
            View Project →
          </a>
        </p>
      )}
    </div>
  );
}

export default PortfolioCard;

