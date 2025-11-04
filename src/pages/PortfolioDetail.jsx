import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPortfolioBySlug } from '../utils/api';

function PortfolioDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await fetchPortfolioBySlug(slug);
        if (!data) {
          setError('Project not found');
        } else {
          setProject(data);
        }
      } catch (err) {
        setError('Failed to load project');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Project not found'}</h2>
        <Link to="/portfolio" className="text-blue-600 hover:underline">
          ← Back to Portfolio
        </Link>
      </div>
    );
  }

  const featuredImage = project._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const techStack = project.tech_stack || [];
  const techArray = Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',') : []);

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-8">
        {/* Back Button */}
        <Link
          to="/portfolio"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          ← Back to Portfolio
        </Link>

        {/* Featured Image */}
        {featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={featuredImage}
              alt={project.title.rendered}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {project.title.rendered}
          </h1>
          <div className="flex flex-wrap gap-4 items-center">
            {project.project_type && (
              <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full">
                {project.project_type}
              </span>
            )}
            {project.date_completed && (
              <span className="text-gray-600">Completed: {new Date(project.date_completed).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        {/* Tech Stack */}
        {techArray.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Technologies Used</h3>
            <div className="flex flex-wrap gap-3">
              {techArray.map((tech, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Project Description */}
        <div className="mb-8 prose max-w-none">
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: project.content.rendered }}
          />
        </div>

        {/* Categories */}
        {project.project_categories && project.project_categories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {project.project_categories.map((cat) => (
                <span
                  key={cat.id}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-200">
          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View Live Site →
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View on GitHub →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default PortfolioDetail;

