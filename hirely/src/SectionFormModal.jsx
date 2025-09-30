// SectionFormModal.jsx
import { useEffect, useState } from 'react';
import './SectionFormModal.css';

const SectionFormModal = ({ section, cvData, setCvData, isOpen, onClose, onSave, isEditing }) => {
  const [formData, setFormData] = useState([]);

  // Initialize form data when section changes OR when modal opens/closes
  useEffect(() => {
    if (isOpen && section) {
      const sectionData = cvData[section.id === 'summary' ? 'personalInfo' : section.id];
      
      if (isEditing) {
        // When editing, load existing data
        if (section.type === 'tags' || section.type === 'list') {
          setFormData(Array.isArray(sectionData) ? [...sectionData] : []);
        } else if (section.id === 'summary') {
          setFormData({ summary: sectionData?.summary || '' });
        } else {
          setFormData(sectionData || {});
        }
      } else {
        // When adding new, start with empty form
        if (section.type === 'tags' || section.type === 'list') {
          setFormData([]);
        } else if (section.id === 'summary') {
          setFormData({ summary: '' });
        } else {
          setFormData({});
        }
      }
    } else {
      // Reset form data when modal closes
      setFormData([]);
    }
  }, [section, cvData, isOpen, isEditing]);

  const handleSave = () => {
    if (section.id === 'summary') {
      setCvData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, summary: formData.summary || '' }
      }));
    } else if (section.type === 'tags' || section.type === 'list') {
      // For skills specifically, ensure we're saving the correct structure
      if (section.id === 'skills') {
        const skillsToSave = Array.isArray(formData)
          ? formData.filter(skill => skill.name && skill.name.trim() !== '')
          : [];
        
        setCvData(prev => ({
          ...prev,
          [section.id]: skillsToSave
        }));
      } else {
        // For other list/tags sections
        const dataToSave = Array.isArray(formData) ? formData : [];
        
        if (isEditing) {
          // Replace existing data when editing
          setCvData(prev => ({
            ...prev,
            [section.id]: dataToSave
          }));
        } else {
          // Merge new items with existing ones when adding
          setCvData(prev => ({
            ...prev,
            [section.id]: [
              ...(Array.isArray(prev[section.id]) ? prev[section.id] : []),
              ...dataToSave
            ]
          }));
        }
      }
    } else {
      setCvData(prev => ({
        ...prev,
        [section.id]: formData
      }));
    }
    
    onSave();
    onClose();
  };

  // Safe array mapping function
  const safeMap = (data, callback) => {
    return (Array.isArray(data) ? data : []).map(callback);
  };

  // Simplified skills form - just skill name
  const renderSkillsForm = () => {
    const currentSkills = safeMap(formData, (skill, index) => (
      <div key={index} className="skill-form-item">
        <input
          type="text"
          placeholder="Skill name (e.g., JavaScript, Project Management)"
          value={skill.name || ''}
          onChange={(e) => {
            setFormData(prev => {
              const updated = Array.isArray(prev) ? [...prev] : [];
              updated[index] = { ...updated[index], name: e.target.value };
              return updated;
            });
          }}
          className="skill-name-input"
        />
        <button 
          onClick={() => setFormData(prev => 
            (Array.isArray(prev) ? prev : []).filter((_, i) => i !== index)
          )}
          className="remove-skill-btn"
        >
          Remove
        </button>
      </div>
    ));

    return (
      <div className="form-group">
        <label>{isEditing ? 'Edit' : 'Add'} Skills</label>
        <p className="form-help-text">
          {isEditing 
            ? 'Edit your skills below. Each skill will be displayed in your CV.' 
            : 'Add new skills to your CV. Each skill will be displayed as a tag.'
          }
        </p>
        
        <div className="skills-input-container">
          {/* Quick add input */}
          <div className="quick-add-section">
            <input
              type="text"
              placeholder="Enter a skill"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setFormData(prev => [...(Array.isArray(prev) ? prev : []), { name: e.target.value.trim() }]);
                  e.target.value = '';
                  e.preventDefault();
                }
              }}
              className="quick-add-input"
            />
            <small className="input-hint">Press Enter to add quickly</small>
          </div>

          {/* Skills list */}
          <div className="skills-list-preview">
            <h4>Skills to be {isEditing ? 'updated' : 'added'}:</h4>
            {safeMap(formData, (skill, index) => (
              <div key={index} className="skill-preview-item">
                <span className="skill-name">{skill.name || 'Unnamed Skill'}</span>
                <button
                  onClick={() => setFormData(prev =>
                    (Array.isArray(prev) ? prev : []).filter((_, i) => i !== index)
                  )}
                  className="remove-skill-btn"
                  title="Remove skill"
                >
                  ×
                </button>
              </div>
            ))}
            {formData.length === 0 && (
              <p className="no-skills-message">No skills added yet.</p>
            )}
          </div>

          {/* Editable skills list */}
          <div className="editable-skills-list">
            {currentSkills}
          </div>
        </div>

        <button 
          type="button"
          onClick={() => setFormData(prev => [...(Array.isArray(prev) ? prev : []), { name: '' }])}
          className="add-skill-btn"
        >
          + Add Another Skill
        </button>
      </div>
    );
  };

  const renderForm = () => {
    // Special case for skills - use simplified form
    if (section.id === 'skills') {
      return renderSkillsForm();
    }

    // ... rest of your renderForm function remains the same
    switch (section.type) {
      case 'textarea':
        return (
          <div className="form-group">
            <label>{section.name}</label>
            <textarea
              value={formData.summary || ''}
              onChange={(e) => setFormData({ summary: e.target.value })}
              placeholder={`Enter your ${section.name.toLowerCase()}...`}
              rows={8}
            />
          </div>
        );

      case 'tags':
        return (
          <div className="form-group">
            <label>{isEditing ? 'Edit' : 'Add'} {section.name}</label>
            <div className="tags-input-container">
              <input
                type="text"
                placeholder={`Add a ${section.name.slice(0, -1)} and press Enter`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setFormData(prev => [...(Array.isArray(prev) ? prev : []), { name: e.target.value.trim() }]);
                    e.target.value = '';
                    e.preventDefault();
                  }
                }}
              />
              <div className="tags-list">
                {safeMap(formData, (item, index) => (
                  <span key={index} className="tag">
                    {item.name}
                    <button
                      onClick={() => setFormData(prev =>
                        (Array.isArray(prev) ? prev : []).filter((_, i) => i !== index)
                      )}
                      className="remove-tag"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="form-group">
            <label>{isEditing ? 'Edit' : 'Add New'} {section.name} {isEditing ? 'Items' : 'Item'}</label>
            <p className="form-help-text">
              {isEditing
                ? 'Edit your existing items below'
                : 'Fill in the details for one new item'
              }
            </p>
            
            <div className="items-list">
              {safeMap(formData, (item, index) => (
                <div key={index} className="item-form">
                  <div className="item-header">
                    <h4>{section.name} Item {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => setFormData(prev =>
                        (Array.isArray(prev) ? prev : []).filter((_, i) => i !== index)
                      )}
                      className="remove-item-btn"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    placeholder={
                      section.id === 'experience' ? 'Job Title' :
                      section.id === 'education' ? 'Degree' :
                      section.id === 'certifications' ? 'Certification Name' :
                      'Title'
                    }
                    value={item.title || item.name || item.jobTitle || item.degree || ''}
                    onChange={(e) => {
                      const fieldName = section.id === 'experience' ? 'jobTitle' :
                                     section.id === 'education' ? 'degree' : 'title';
                      setFormData(prev => {
                        const updated = Array.isArray(prev) ? [...prev] : [];
                        updated[index] = { ...updated[index], [fieldName]: e.target.value };
                        return updated;
                      });
                    }}
                  />
                  
                  <input
                    type="text"
                    placeholder={
                      section.id === 'experience' ? 'Company' :
                      section.id === 'education' ? 'Institution' :
                      section.id === 'certifications' ? 'Issuing Organization' :
                      'Organization'
                    }
                    value={item.company || item.institution || item.issuer || ''}
                    onChange={(e) => {
                      const fieldName = section.id === 'education' ? 'institution' :
                                     section.id === 'certifications' ? 'issuer' : 'company';
                      setFormData(prev => {
                        const updated = Array.isArray(prev) ? [...prev] : [];
                        updated[index] = { ...updated[index], [fieldName]: e.target.value };
                        return updated;
                      });
                    }}
                  />
                  
                  <input
                    type="text"
                    placeholder="Dates (e.g., 2020 - Present)"
                    value={item.dates || item.date || ''}
                    onChange={(e) => {
                      const fieldName = section.id === 'certifications' ? 'date' : 'dates';
                      setFormData(prev => {
                        const updated = Array.isArray(prev) ? [...prev] : [];
                        updated[index] = { ...updated[index], [fieldName]: e.target.value };
                        return updated;
                      });
                    }}
                  />
                  
                  <textarea
                    placeholder="Description, details, or accomplishments"
                    value={item.description || ''}
                    onChange={(e) => setFormData(prev => {
                      const updated = Array.isArray(prev) ? [...prev] : [];
                      updated[index] = { ...updated[index], description: e.target.value };
                      return updated;
                    })}
                    rows={3}
                  />
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={() => setFormData(prev => [...(Array.isArray(prev) ? prev : []), {}])}
              className="add-item-btn"
            >
              + Add New Item
            </button>
          </div>
        );

      default:
        return (
          <div className="form-group">
            <p>This section will be added to your CV.</p>
          </div>
        );
    }
  };

  if (!isOpen || !section) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit' : 'Add'} {section.name}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="modal-body">
          {renderForm()}
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button 
            onClick={handleSave} 
            className="save-btn"
            disabled={section.type === 'list' && (!Array.isArray(formData) || formData.length === 0)}
          >
            {isEditing ? 'Update' : 'Save to'} {section.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionFormModal;