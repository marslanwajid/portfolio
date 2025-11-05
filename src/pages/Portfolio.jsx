import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPortfolios } from '../utils/api';

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchPortfolios({ per_page: 100 });
        setProjects(data);
        
        // Extract unique categories
        const cats = ['all', ...new Set(
          data.flatMap(project => 
            project.project_categories?.map(cat => cat.name) || []
          )
        )];
        setCategories(cats);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project =>
        project.project_categories?.some(cat => cat.name === selectedCategory)
      );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">My Portfolio</h1>
          <p className="text-xl text-gray-600">Projects I've built and contributed to</p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No projects found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const image = project._embedded?.['wp:featuredmedia']?.[0]?.source_url;
              const techStack = project.tech_stack || [];
              const techArray = Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',') : []);
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
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {image && (
                    <div className="aspect-video overflow-hidden bg-gray-200">
                      <img
                        src={image}
                        alt={project.title.rendered}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title.rendered}
                    </h3>
                    {project.project_type && (
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                        {project.project_type}
                      </span>
                    )}
                    <div
                      className="text-gray-600 text-sm mb-4 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: project.excerpt?.rendered || project.content.rendered.substring(0, 100) + '...',
                      }}
                    />
                    {techArray.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {techArray.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                        {techArray.length > 3 && (
                          <span className="text-xs text-gray-500">+{techArray.length - 3} more</span>
                        )}
                      </div>
                    )}
                    <div className="text-blue-600 font-semibold group-hover:underline">
                      View Project →
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;

