import { useEffect, useState } from 'react';
import { fetchPortfolioSettings, fetchSkills, fetchExperience, fetchEducation } from '../utils/api';

function About() {
  const [settings, setSettings] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settingsData, skillsData, expData, eduData] = await Promise.all([
          fetchPortfolioSettings(),
          fetchSkills(),
          fetchExperience(),
          fetchEducation(),
        ]);
        setSettings(settingsData);
        setSkills(skillsData);
        setExperience(expData);
        setEducation(eduData);
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

  // Group skills by category
  const skillsByCategory = {};
  skills.forEach((skill) => {
    const categories = skill.skill_categories || [];
    if (categories.length === 0) {
      const category = 'Other';
      if (!skillsByCategory[category]) skillsByCategory[category] = [];
      skillsByCategory[category].push(skill);
    } else {
      categories.forEach((cat) => {
        if (!skillsByCategory[cat.name]) skillsByCategory[cat.name] = [];
        skillsByCategory[cat.name].push(skill);
      });
    }
  });

  // Sort experience by start date (newest first)
  const sortedExperience = [...experience].sort((a, b) => {
    const dateA = new Date(a.start_date || 0);
    const dateB = new Date(b.start_date || 0);
    return dateB - dateA;
  });

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-8">
        {/* About Me Section */}
        <section className="mb-20">
          <h1 className="text-5xl font-bold text-gray-800 mb-8">About Me</h1>
          {settings?.about_me && (
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: settings.about_me }}
            />
          )}
        </section>

        {/* Skills Section */}
        {Object.keys(skillsByCategory).length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Skills & Technologies</h2>
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category} className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">{category}</h3>
                <div className="flex flex-wrap gap-3">
                  {categorySkills.map((skill) => {
                    const proficiency = skill.proficiency_level || '';
                    const proficiencyColor = {
                      Advanced: 'bg-green-100 text-green-800',
                      Intermediate: 'bg-yellow-100 text-yellow-800',
                      Beginner: 'bg-blue-100 text-blue-800',
                    }[proficiency] || 'bg-gray-100 text-gray-800';

                    return (
                      <div
                        key={skill.id}
                        className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
                      >
                        <span className="font-medium text-gray-800">{skill.title.rendered}</span>
                        {proficiency && (
                          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${proficiencyColor}`}>
                            {proficiency}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Experience Section */}
        {sortedExperience.length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Work Experience</h2>
            <div className="space-y-8">
              {sortedExperience.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{exp.job_title || 'Position'}</h3>
                      <p className="text-xl text-blue-600 font-semibold">{exp.company}</p>
                    </div>
                    <div className="text-gray-600 mt-2 md:mt-0">
                      {exp.start_date && (
                        <span>
                          {new Date(exp.start_date).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      {exp.is_current ? (
                        <span> – Present</span>
                      ) : (
                        exp.end_date && (
                          <span>
                            {' '}
                            –{' '}
                            {new Date(exp.end_date).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <div
                    className="text-gray-700 mb-4"
                    dangerouslySetInnerHTML={{ __html: exp.content?.rendered || '' }}
                  />
                  {exp.technologies_used && exp.technologies_used.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies_used.map((tech, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <section>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Education</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {education.map((edu) => (
                <div key={edu.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {edu.degree || edu.title.rendered}
                  </h3>
                  <p className="text-lg text-blue-600 font-semibold mb-2">
                    {edu.institution}
                  </p>
                  {edu.year && <p className="text-gray-600">{edu.year}</p>}
                  {edu.content?.rendered && (
                    <div
                      className="text-gray-700 mt-4"
                      dangerouslySetInnerHTML={{ __html: edu.content.rendered }}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default About;

