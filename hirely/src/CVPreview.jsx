
const CVPreview = ({ template, cvData }) => {
  // Template-specific styling and layout
  const getTemplateStyles = () => {
    const styles = {
      modern: {
        container: 'modern-container',
        header: 'modern-header',
        section: 'modern-section'
      },
      creative: {
        container: 'creative-container',
        header: 'creative-header',
        section: 'creative-section'
      },
      classic: {
        container: 'classic-container',
        header: 'classic-header',
        section: 'classic-section'
      },
      minimal: {
        container: 'minimal-container',
        header: 'minimal-header',
        section: 'minimal-section'
      }
    };
    return styles[template.id] || styles.modern;
  };

  const templateStyles = getTemplateStyles();

  const renderSection = (section) => {
    switch(section) {
      case 'header':
        return (
          <div className={`preview-header ${templateStyles.header}`}>
            <h1>{cvData.personalInfo?.name || 'Your Name'}</h1>
            <p>{cvData.personalInfo?.title || 'Professional Title'}</p>
            <div className="contact-info">
              <span>{cvData.personalInfo?.email || 'email@example.com'}</span>
              <span>{cvData.personalInfo?.phone || '(123) 456-7890'}</span>
              <span>{cvData.personalInfo?.location || 'City, Country'}</span>
            </div>
          </div>
        );
      
      case 'summary':
        return (
          <div className={`preview-section ${templateStyles.section}`}>
            <h2>Professional Summary</h2>
            <p>{cvData.personalInfo?.summary || 'Experienced professional with a proven track record...'}</p>
          </div>
        );
      
      case 'experience':
        return (
          <div className={`preview-section ${templateStyles.section}`}>
            <h2>Work Experience</h2>
            {cvData.experience?.length > 0 ? (
              cvData.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <h3>{exp.jobTitle || 'Job Title'}</h3>
                  <p className="company">{exp.company || 'Company Name'} | {exp.dates || 'Dates'}</p>
                  <p>{exp.description || 'Job responsibilities and achievements...'}</p>
                </div>
              ))
            ) : (
              <div className="experience-item">
                <h3>Job Title</h3>
                <p className="company">Company Name | Dates</p>
                <p>Job responsibilities and achievements...</p>
              </div>
            )}
          </div>
        );
      
      case 'education':
        return (
          <div className={`preview-section ${templateStyles.section}`}>
            <h2>Education</h2>
            {cvData.education?.length > 0 ? (
              cvData.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <h3>{edu.degree || 'Degree Name'}</h3>
                  <p className="institution">{edu.institution || 'Institution Name'} | {edu.dates || 'Dates'}</p>
                </div>
              ))
            ) : (
              <div className="education-item">
                <h3>Degree Name</h3>
                <p className="institution">Institution Name | Dates</p>
              </div>
            )}
          </div>
        );
      
      case 'skills':
        return (
          <div className={`preview-section ${templateStyles.section}`}>
            <h2>Skills</h2>
            <div className="skills-list">
              {cvData.skills?.length > 0 ? (
                cvData.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill.name || 'Skill Name'}</span>
                ))
              ) : (
                <>
                  <span className="skill-tag">Skill 1</span>
                  <span className="skill-tag">Skill 2</span>
                  <span className="skill-tag">Skill 3</span>
                </>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`cv-preview ${templateStyles.container}`}>
      <div className="preview-content">
        {template.sections.map(section => (
          <div key={section}>
            {renderSection(section)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVPreview;