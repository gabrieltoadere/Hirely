// CVPreview.jsx
import './CVPreview.css';

const CVPreview = ({ template, cvData, customization, currentPage = 1 }) => {
  // Get the current page data or use the first page as fallback
  const currentPageData = cvData.pages?.find(page => page.id === currentPage) || 
                         cvData.pages?.[0] || 
                         { sections: template.sections }; // Fallback to template sections

  // Use the current page's sections or fallback to template sections
  const sectionsToRender = currentPageData.sections || template.sections;

  // Get custom sections from cvData
  const customSections = cvData.customSections || [];

  // Apply template-specific CSS classes and custom styles
  const getTemplateClass = () => {
    return `cv-preview template-${template.id}`;
  };

  const getCustomStyles = () => {
    if (!customization) {
      return {
        '--primary-color': template.defaultColors.primary,
        '--secondary-color': template.defaultColors.secondary,
        '--background-color': template.defaultColors.background,
        '--text-color': template.defaultColors.text || '#374151',
        '--heading-font': template.defaultFonts.heading,
        '--body-font': template.defaultFonts.body,
        '--font-size': '16px'
      };
    }

    return {
      '--primary-color': customization.colors?.primary || template.defaultColors.primary,
      '--secondary-color': customization.colors?.secondary || template.defaultColors.secondary,
      '--background-color': customization.colors?.background || template.defaultColors.background,
      '--text-color': customization.colors?.text || template.defaultColors.text || '#374151',
      '--heading-font': customization.fonts?.heading || template.defaultFonts.heading,
      '--body-font': customization.fonts?.body || template.defaultFonts.body,
      '--font-size': `${customization.fontSize || 16}px`
    };
  };

  // Helper function to preserve line breaks in text
  const formatTextWithLineBreaks = (text) => {
    if (!text) return '';
    
    // Split by newlines and create React elements with breaks
    return text.split('\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  // Helper function to get section info (for custom sections)
  const getSectionInfo = (sectionId) => {
    // Check if it's a custom section
    if (sectionId.startsWith('custom-')) {
      return customSections.find(s => s.id === sectionId) || { 
        id: sectionId, 
        name: 'Custom Section', 
        icon: '📄' 
      };
    }
    // Otherwise it's a predefined section
    return null;
  };

  // Render custom section content
  const renderCustomSection = (sectionId) => {
    const sectionInfo = getSectionInfo(sectionId);
    const customData = cvData.customSectionsData?.[sectionId];
    
    if (!sectionInfo) {
      return (
        <div className="preview-section">
          <h2>{sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}</h2>
          <p>Content for {sectionId} section...</p>
        </div>
      );
    }

    const sectionName = sectionInfo.name || 'Custom Section';

    switch(sectionInfo.type) {
      case 'textarea':
        return (
          <div className="preview-section custom-section">
            <h2>{sectionName}</h2>
            <div className="preserve-line-breaks">
              {customData?.content ? formatTextWithLineBreaks(customData.content) : `Add your ${sectionName.toLowerCase()} content here...`}
            </div>
          </div>
        );

      case 'list':
        const listItems = Array.isArray(customData) ? customData : [];
        return (
          <div className="preview-section custom-section">
            <h2>{sectionName}</h2>
            {listItems.length > 0 ? (
              listItems.map((item, index) => (
                <div key={index} className="custom-list-item">
                  <h3>{item.title || item.name }</h3>
                  {item.description && (
                    <div className="preserve-line-breaks">
                      {formatTextWithLineBreaks(item.description)}
                    </div>
                  )}
                  {item.dates && <span className="dates">{item.dates}</span>}
                </div>
              ))
            ) : (
              <p>No items added yet. Add some content to your {sectionName.toLowerCase()}.</p>
            )}
          </div>
        );

      case 'tags':
        const tags = Array.isArray(customData) ? customData : [];
        return (
          <div className="preview-section custom-section">
            <h2>{sectionName}</h2>
            <div className="tags-list">
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag.name || tag}
                  </span>
                ))
              ) : (
                <p>No tags added yet.</p>
              )}
            </div>
          </div>
        );

      case 'simple':
      default:
        return (
          <div className="preview-section custom-section">
            <h2>{sectionName}</h2>
            <div className="preserve-line-breaks">
              {customData?.content ? formatTextWithLineBreaks(customData.content) : `Content for ${sectionName} section...`}
            </div>
          </div>
        );
    }
  };

  // Template-specific content rendering
  const renderSection = (section) => {
    const data = cvData || {};

    // Check if it's a custom section
    if (section.startsWith('custom-')) {
      return renderCustomSection(section);
    }

    switch(section) {
      // In CVPreview.jsx - update the header section
      case 'header':
        // Don't show header on subsequent pages if it's the same as first page
        const isSubsequentPage = currentPage > 1;
        const shouldShowHeader = !isSubsequentPage || 
                                cvData.pages?.[currentPage - 1]?.sections?.includes('header');
        
        if (!shouldShowHeader) {
          return null; // Don't render header on subsequent pages if not explicitly added
        }

        return (
          <div className="preview-header">
            <h1 className="name">{data.personalInfo?.name || 'Your Name'}</h1>
            {!isSubsequentPage && ( // Only show title/contact on first page
              <>
                <p className="title">{data.personalInfo?.title || 'Professional Title'}</p>
                <div className="contact-info">
                  <span>{data.personalInfo?.email || 'email@example.com'}</span>
                  <span>{data.personalInfo?.phone || '(123) 456-7890'}</span>
                  <span>{data.personalInfo?.location || 'City, Country'}</span>
                </div>
              </>
            )}
            {data.personalInfo?.summary && isSubsequentPage && (
              <div className="summary">
                <p>{data.personalInfo.summary}</p>
              </div>
            )}
          </div>
        );
        
      case 'experience':
        const experiences = data.experience || [{}];
        return (
          <div className="preview-section experience-section">
            <h2>Work Experience</h2>
            {experiences.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="experience-header">
                  <h3>{exp.jobTitle || 'Job Title'}</h3>
                  <span className="dates">{exp.dates || 'Dates'}</span>
                </div>
                <p className="company">{exp.company || 'Company Name'}</p>
                <div className="description preserve-line-breaks">
                  {exp.description ? formatTextWithLineBreaks(exp.description) : 'Job responsibilities and achievements...'}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'education':
        const education = data.education || [{}];
        return (
          <div className="preview-section education-section">
            <h2>Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="education-header">
                  <h3>{edu.degree || 'Degree Name'}</h3>
                  <span className="dates">{edu.dates || 'Dates'}</span>
                </div>
                <p className="institution">{edu.institution || 'Institution Name'}</p>
                {edu.description && (
                  <div className="description preserve-line-breaks">
                    {formatTextWithLineBreaks(edu.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      case 'skills':
        const skills = data.skills || [];
        return (
          <div className="preview-section skills-section">
            <h2>Skills</h2>
              <div className="skills-detailed-list">
                {skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="skill-header">
                      <strong className="skill-name">{skill.name || skill.title}</strong>
                      {skill.level && <span className="skill-level">({skill.level})</span>}
                    </div>
                    {skill.bulletPoints && skill.bulletPoints.length > 0 && (
                      <ul className="skill-bullets">
                        {skill.bulletPoints.map((bullet, bulletIndex) => (
                          bullet && (
                            <li key={bulletIndex} className="preserve-line-breaks">
                              {formatTextWithLineBreaks(bullet)}
                            </li>
                          )
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
          </div>
        );
      
      case 'summary':
        return (
          <div className="preview-section summary-section">
            <h2>Professional Summary</h2>
            <div className="preserve-line-breaks">
              {data.personalInfo?.summary ? formatTextWithLineBreaks(data.personalInfo.summary) : 'Experienced professional with a proven track record...'}
            </div>
          </div>
        );
      
      case 'projects': {
        const projects = (data.projects || [])
          .filter(p => p && (p.name || p.title || p.description || p.technologies || p.dates));

        if (projects.length === 0) return null;

        return (
          <div className="preview-section projects-section">
            <h2>Projects</h2>

            {projects.map((project, index) => {
              const name = project.name || project.title;

              return (
                <div key={index} className="project-item">
                  {(name || project.dates) && (
                    <div className="project-header">
                      {name && <h3>{name}</h3>}
                      {project.dates && <span className="dates">{project.dates}</span>}
                    </div>
                  )}

                  {project.description && (
                    <div className="description preserve-line-breaks">
                      {formatTextWithLineBreaks(project.description)}
                    </div>
                  )}

                  {project.technologies && (
                    <p className="technologies">Technologies: {project.technologies}</p>
                  )}

                  {project.link && (
                    <p className="project-link">
                      <a href={project.link} target="_blank" rel="noreferrer">
                        {project.link}
                      </a>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );
      }
      
      case 'languages':
        const languages = data.languages || [{name: 'English', level: 'Fluent'}, {name: 'Spanish', level: 'Intermediate'}];
        return (
          <div className="preview-section languages-section">
            <h2>Languages</h2>
            <div className="languages-list">
              {languages.map((lang, index) => (
                <div key={index} className="language-item">
                  <span className="language-name">{lang.name}</span>
                  <span className="language-level">({lang.level})</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'certifications':
        const certifications = data.certifications || [{}];
        return (
          <div className="preview-section certifications-section">
            <h2>Certifications</h2>
            {certifications.map((cert, index) => (
              <div key={index} className="certification-item">
                <h3>{cert.name || 'Certification Name'}</h3>
                <p className="issuer">{cert.issuer || 'Issuing Organization'} | {cert.date || 'Date'}</p>
                {cert.description && (
                  <div className="description preserve-line-breaks">
                    {formatTextWithLineBreaks(cert.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      case 'achievements':
        const achievements = data.achievements || [{}];
        return (
          <div className="preview-section achievements-section">
            <h2>Achievements</h2>
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <h3>{achievement.title || 'Achievement Title'}</h3>
                <div className="preserve-line-breaks">
                  {achievement.description ? formatTextWithLineBreaks(achievement.description) : 'Description of achievement...'}
                </div>
                <span className="date">{achievement.date || 'Date'}</span>
              </div>
            ))}
          </div>
        );
      
      case 'publications':
        const publications = data.publications || [{}];
        return (
          <div className="preview-section publications-section">
            <h2>Publications</h2>
            {publications.map((pub, index) => (
              <div key={index} className="publication-item">
                <h3>{pub.title || 'Publication Title'}</h3>
                <p className="journal">{pub.journal || 'Journal/Conference'} | {pub.date || 'Date'}</p>
                {pub.description && (
                  <div className="description preserve-line-breaks">
                    {formatTextWithLineBreaks(pub.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      case 'references':
        return (
          <div className="preview-section references-section">
            <h2>References</h2>
            <p>References available upon request.</p>
          </div>
        );
      
      case 'volunteer':
        const volunteer = data.volunteer || [{}];
        return (
          <div className="preview-section volunteer-section">
            <h2>Volunteer Experience</h2>
            {volunteer.map((vol, index) => (
              <div key={index} className="volunteer-item">
                <div className="volunteer-header">
                  <h3>{vol.role || 'Volunteer Role'}</h3>
                  <span className="dates">{vol.dates || 'Dates'}</span>
                </div>
                <p className="organization">{vol.organization || 'Organization'}</p>
                <div className="description preserve-line-breaks">
                  {vol.description ? formatTextWithLineBreaks(vol.description) : 'Volunteer work description...'}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'interests':
        const interests = data.interests || [{name: 'Reading'}, {name: 'Traveling'}, {name: 'Photography'}];
        return (
          <div className="preview-section interests-section">
            <h2>Interests</h2>
            <div className="interests-list">
              {interests.map((interest, index) => (
                <span key={index} className="interest-tag">
                  {interest.name}
                </span>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="preview-section">
            <h2>{section.charAt(0).toUpperCase() + section.slice(1)}</h2>
            <p>Content for {section} section...</p>
          </div>
        );
    }
  };

  const leftColumnSections = [
    "summary",
    "experience",
    "education",
    "projects",
    "achievements",
    "publications",
    "volunteer"
  ];

  const rightColumnSections = [
    "skills",
    "languages",
    "certifications",
    "interests"
  ];

  const isCustomSection = (section) => section.startsWith("custom-");

  return (
    <div 
      className={getTemplateClass()} 
      style={getCustomStyles()}
    >
      <div className="preview-content">
        {/* page indicator*/}
        {cvData.pages?.length > 1 && (
          <div className="page-indicator">
            Page {cvData.pages.findIndex(page => page.id === currentPage) + 1} of {cvData.pages.length}
          </div>
        )}
        
        {/* Render header full-width */}
        {sectionsToRender.includes("header") && (
          <div className="section-header">
            {renderSection("header")}
          </div>
        )}

        {/* Render the rest inside the grid */}
        <div className="preview-body-wrapper">
          <div className="preview-body-grid">

            {/* LEFT COLUMN */}
            <div className="preview-left-col">
              {sectionsToRender
                .filter(section => 
                  leftColumnSections.includes(section)
                )
                .map(section => (
                  <div key={section} className={`section-${section}`}>
                    {renderSection(section)}
                  </div>
                ))}
            </div>

            {/* RIGHT COLUMN */}
            <div className="preview-right-col">
              {sectionsToRender
                .filter(section => 
                  rightColumnSections.includes(section) ||
                  isCustomSection(section)
                )
                .map(section => (
                  <div key={section} className={`section-${section}`}>
                    {renderSection(section)}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;