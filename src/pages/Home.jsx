import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPortfolioSettings, fetchPortfolios } from '../utils/api';

function Home() {
  const [settings, setSettings] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settingsData, projectsData] = await Promise.all([
          fetchPortfolioSettings(),
          fetchPortfolios({ per_page: 4 }),
        ]);
        setSettings(settingsData);
        setFeaturedProjects(projectsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const hero = settings?.hero || {};
  const featuredImage = featuredProjects[0]?._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                {hero.headline || 'Full Stack Developer'}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                {hero.subtitle || 'Building beautiful and functional web applications'}
              </p>
              <div className="flex gap-4">
                <Link
                  to="/portfolio"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  View My Work
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Get In Touch
                </Link>
              </div>
            </div>
            {featuredImage && (
              <div className="hidden md:block">
                <img
                  src={featuredImage}
                  alt="Featured Project"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Projects</h2>
            <p className="text-gray-600 text-lg">A selection of my recent work</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProjects.slice(0, 4).map((project) => {
              const image = project._embedded?.['wp:featuredmedia']?.[0]?.source_url;
              let external = project.project_url || project.link;
              if (external && !/^https?:\/\//i.test(external)) {
                external = `https://${external}`;
              }
              return (
                <a
                  key={project.id}
                  href={external || `/portfolio/${project.slug}`}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={image}
                        alt={project.title.rendered}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {project.title.rendered}
                    </h3>
                    {project.project_type && (
                      <span className="text-sm text-gray-500">{project.project_type}</span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              to="/portfolio"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Projects →
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Technologies I Work With</h2>
            <p className="text-gray-600 text-lg">Modern tools and frameworks for building great experiences</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {['React', 'WordPress', 'PHP', 'Laravel', 'JavaScript', 'WooCommerce', 'Node.js', 'Git'].map((tech) => (
              <span
                key={tech}
                className="bg-white px-6 py-3 rounded-full shadow-md text-gray-700 font-medium hover:shadow-lg transition-shadow"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/about"
              className="text-blue-600 hover:text-blue-700 font-semibold text-lg"
            >
              View All Skills →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;

