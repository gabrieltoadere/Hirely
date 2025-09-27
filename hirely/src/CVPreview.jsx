import './CVPreview.css';

const CVPreview = ({ template, cvData, customization }) => {
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

  // Template-specific content rendering
  const renderSection = (section) => {
    const data = cvData || {};
    
    switch(section) {
      case 'header':
        return (
          <div className="preview-header">
            <h1 className="name">{data.personalInfo?.name || 'Your Name'}</h1>
            <p className="title">{data.personalInfo?.title || 'Professional Title'}</p>
            <div className="contact-info">
              <span>📧 {data.personalInfo?.email || 'email@example.com'}</span>
              <span>📱 {data.personalInfo?.phone || '(123) 456-7890'}</span>
              <span>📍 {data.personalInfo?.location || 'City, Country'}</span>
            </div>
            {data.personalInfo?.summary && (
              <div className="summary">
                <h3>Summary</h3>
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
                <p className="description">{exp.description || 'Job responsibilities and achievements...'}</p>
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
              </div>
            ))}
          </div>
        );
      
      case 'skills':
        const skills = data.skills || [{name: 'Skill 1'}, {name: 'Skill 2'}, {name: 'Skill 3'}];
        return (
          <div className="preview-section skills-section">
            <h2>Skills</h2>
            <div className="skills-list">
              {skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill.name || `Skill ${index + 1}`}
                </span>
              ))}
            </div>
          </div>
        );
      
      case 'summary':
        return (
          <div className="preview-section summary-section">
            <h2>Professional Summary</h2>
            <p>{data.personalInfo?.summary || 'Experienced professional with a proven track record...'}</p>
          </div>
        );
      
      case 'portfolio':
        return (
          <div className="preview-section portfolio-section">
            <h2>Portfolio</h2>
            <p>Portfolio items would be displayed here...</p>
          </div>
        );
      
      case 'references':
        return (
          <div className="preview-section references-section">
            <h2>References</h2>
            <p>References available upon request.</p>
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

  return (
    <div 
      className={getTemplateClass()} 
      style={getCustomStyles()}
    >
      <div className="preview-content">
        {template.sections.map(section => (
          <div key={section} className={`section-${section}`}>
            {renderSection(section)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVPreview;