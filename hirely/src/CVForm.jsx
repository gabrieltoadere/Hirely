import './CVForm.css';

const CVForm = ({ template, cvData, setCvData }) => {
  // Update personal info
  const updatePersonalInfo = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  // Update experience array
  const updateExperience = (index, field, value) => {
    setCvData(prev => {
      const updatedExperience = [...prev.experience];
      updatedExperience[index] = {
        ...updatedExperience[index],
        [field]: value
      };
      return { ...prev, experience: updatedExperience };
    });
  };

  // Add new experience entry
  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { jobTitle: '', company: '', dates: '', description: '' }
      ]
    }));
  };

  // Remove experience entry
  const removeExperience = (index) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Update education array
  const updateEducation = (index, field, value) => {
    setCvData(prev => {
      const updatedEducation = [...prev.education];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value
      };
      return { ...prev, education: updatedEducation };
    });
  };

  // Add new education entry
  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: '', institution: '', dates: '' }
      ]
    }));
  };

  // Remove education entry
  const removeEducation = (index) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Update skills array
  const updateSkills = (index, value) => {
    setCvData(prev => {
      const updatedSkills = [...prev.skills];
      updatedSkills[index] = { name: value };
      return { ...prev, skills: updatedSkills };
    });
  };

  // Add new skill
  const addSkill = () => {
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '' }]
    }));
  };

  // Remove skill
  const removeSkill = (index) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Render form sections based on template
  const renderSection = (section) => {
    switch(section) {
      case 'header':
        return (
          <PersonalInfoForm 
            data={cvData.personalInfo || {}}
            onChange={updatePersonalInfo}
          />
        );
      
      case 'experience':
        return (
          <ExperienceForm 
            data={cvData.experience || []}
            onChange={updateExperience}
            onAdd={addExperience}
            onRemove={removeExperience}
          />
        );
      
      case 'education':
        return (
          <EducationForm 
            data={cvData.education || []}
            onChange={updateEducation}
            onAdd={addEducation}
            onRemove={removeEducation}
          />
        );
      
      case 'skills':
        return (
          <SkillsForm 
            data={cvData.skills || []}
            onChange={updateSkills}
            onAdd={addSkill}
            onRemove={removeSkill}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="cv-form">
      <h3>Fill in your information</h3>
      {template.sections.map(section => (
        <div key={section} className="form-section">
          {renderSection(section)}
        </div>
      ))}
    </div>
  );
};

// Personal Info Sub-component
const PersonalInfoForm = ({ data, onChange }) => (
  <div className="form-section">
    <h4>Personal Information</h4>
    <div className="form-group">
      <label>Full Name</label>
      <input 
        type="text" 
        value={data.name || ''}
        onChange={(e) => onChange('name', e.target.value)}
        placeholder="John Doe"
      />
    </div>
    <div className="form-group">
      <label>Professional Title</label>
      <input 
        type="text" 
        value={data.title || ''}
        onChange={(e) => onChange('title', e.target.value)}
        placeholder="Software Engineer"
      />
    </div>
    <div className="form-group">
      <label>Email</label>
      <input 
        type="email" 
        value={data.email || ''}
        onChange={(e) => onChange('email', e.target.value)}
        placeholder="john.doe@example.com"
      />
    </div>
    <div className="form-group">
      <label>Phone</label>
      <input 
        type="tel" 
        value={data.phone || ''}
        onChange={(e) => onChange('phone', e.target.value)}
        placeholder="(123) 456-7890"
      />
    </div>
    <div className="form-group">
      <label>Location</label>
      <input 
        type="text" 
        value={data.location || ''}
        onChange={(e) => onChange('location', e.target.value)}
        placeholder="City, Country"
      />
    </div>
    <div className="form-group">
      <label>Professional Summary</label>
      <textarea 
        value={data.summary || ''}
        onChange={(e) => onChange('summary', e.target.value)}
        placeholder="Brief summary of your professional background..."
        rows="4"
      />
    </div>
  </div>
);

// Experience Sub-component
const ExperienceForm = ({ data, onChange, onAdd, onRemove }) => (
  <div className="form-section">
    <div className="section-header">
      <h4>Work Experience</h4>
      <button type="button" onClick={onAdd} className="add-button">
        + Add Experience
      </button>
    </div>
    
    {data.map((exp, index) => (
      <div key={index} className="form-item-group">
        <div className="item-header">
          <h5>Experience #{index + 1}</h5>
          {data.length > 1 && (
            <button 
              type="button" 
              onClick={() => onRemove(index)}
              className="remove-button"
            >
              Remove
            </button>
          )}
        </div>
        
        <div className="form-group">
          <label>Job Title</label>
          <input 
            type="text" 
            value={exp.jobTitle || ''}
            onChange={(e) => onChange(index, 'jobTitle', e.target.value)}
            placeholder="Senior Developer"
          />
        </div>
        <div className="form-group">
          <label>Company</label>
          <input 
            type="text" 
            value={exp.company || ''}
            onChange={(e) => onChange(index, 'company', e.target.value)}
            placeholder="Tech Company Inc."
          />
        </div>
        <div className="form-group">
          <label>Dates</label>
          <input 
            type="text" 
            value={exp.dates || ''}
            onChange={(e) => onChange(index, 'dates', e.target.value)}
            placeholder="Jan 2020 - Present"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea 
            value={exp.description || ''}
            onChange={(e) => onChange(index, 'description', e.target.value)}
            placeholder="Describe your responsibilities and achievements..."
            rows="3"
          />
        </div>
      </div>
    ))}
  </div>
);

// Education Sub-component
const EducationForm = ({ data, onChange, onAdd, onRemove }) => (
  <div className="form-section">
    <div className="section-header">
      <h4>Education</h4>
      <button type="button" onClick={onAdd} className="add-button">
        + Add Education
      </button>
    </div>
    
    {data.map((edu, index) => (
      <div key={index} className="form-item-group">
        <div className="item-header">
          <h5>Education #{index + 1}</h5>
          {data.length > 1 && (
            <button 
              type="button" 
              onClick={() => onRemove(index)}
              className="remove-button"
            >
              Remove
            </button>
          )}
        </div>
        
        <div className="form-group">
          <label>Degree</label>
          <input 
            type="text" 
            value={edu.degree || ''}
            onChange={(e) => onChange(index, 'degree', e.target.value)}
            placeholder="Bachelor of Science in Computer Science"
          />
        </div>
        <div className="form-group">
          <label>Institution</label>
          <input 
            type="text" 
            value={edu.institution || ''}
            onChange={(e) => onChange(index, 'institution', e.target.value)}
            placeholder="University Name"
          />
        </div>
        <div className="form-group">
          <label>Dates</label>
          <input 
            type="text" 
            value={edu.dates || ''}
            onChange={(e) => onChange(index, 'dates', e.target.value)}
            placeholder="2016 - 2020"
          />
        </div>
      </div>
    ))}
  </div>
);

// Skills Sub-component
const SkillsForm = ({ data, onChange, onAdd, onRemove }) => (
  <div className="form-section">
    <div className="section-header">
      <h4>Skills</h4>
      <button type="button" onClick={onAdd} className="add-button">
        + Add Skill
      </button>
    </div>
    
    {data.map((skill, index) => (
      <div key={index} className="form-item-group">
        <div className="item-header">
          <h5>Skill #{index + 1}</h5>
          {data.length > 1 && (
            <button 
              type="button" 
              onClick={() => onRemove(index)}
              className="remove-button"
            >
              Remove
            </button>
          )}
        </div>
        
        <div className="form-group">
          <label>Skill Name</label>
          <input 
            type="text" 
            value={skill.name || ''}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder="JavaScript, React, Node.js"
          />
        </div>
      </div>
    ))}
  </div>
);

export default CVForm;