// SectionFormModal.jsx
import { useEffect, useState } from 'react';
import './SectionFormModal.css';

const SectionFormModal = ({ section, cvData, setCvData, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState([]);

  // Initialize form data when section changes
  useEffect(() => {
    if (section) {
      const sectionData = cvData[section.id === 'summary' ? 'personalInfo' : section.id];
      
      if (section.type === 'tags' || section.type === 'list') {
        setFormData(sectionData || []);
      } else if (section.id === 'summary') {
        setFormData({ summary: sectionData?.summary || '' });
      } else {
        setFormData(sectionData || {});
      }
    }
  }, [section, cvData]);

  const handleSave = () => {
    if (section.id === 'summary') {
      setCvData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, summary: formData.summary || '' }
      }));
    } else if (section.type === 'tags' || section.type === 'list') {
      setCvData(prev => ({
        ...prev,
        [section.id]: formData
      }));
    } else {
      setCvData(prev => ({
        ...prev,
        [section.id]: formData
      }));
    }
    
    onSave();
    onClose();
  };

  const renderForm = () => {
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
            <label>Add {section.name}</label>
            <div className="tags-input-container">
              <input
                type="text"
                placeholder={`Add a ${section.name.slice(0, -1)} and press Enter`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setFormData(prev => [...(prev || []), { name: e.target.value.trim() }]);
                    e.target.value = '';
                    e.preventDefault();
                  }
                }}
              />
              <div className="tags-list">
                {(formData || []).map((item, index) => (
                  <span key={index} className="tag">
                    {item.name}
                    <button 
                      onClick={() => setFormData(prev => prev.filter((_, i) => i !== index))}
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
            <label>{section.name}</label>
            <button 
              type="button"
              onClick={() => setFormData(prev => [...(prev || []), {}])}
              className="add-item-btn"
            >
              + Add New
            </button>
            
            <div className="items-list">
              {(formData || []).map((item, index) => (
                <div key={index} className="item-form">
                  <div className="item-header">
                    <h4>Item #{index + 1}</h4>
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => prev.filter((_, i) => i !== index))}
                      className="remove-item-btn"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Title"
                    value={item.title || item.name || item.jobTitle || item.degree || ''}
                    onChange={(e) => {
                      const fieldName = section.id === 'skills' ? 'name' : 
                                     section.id === 'experience' ? 'jobTitle' :
                                     section.id === 'education' ? 'degree' : 'title';
                      setFormData(prev => {
                        const updated = [...prev];
                        updated[index] = { ...updated[index], [fieldName]: e.target.value };
                        return updated;
                      });
                    }}
                  />
                  
                  <input
                    type="text"
                    placeholder="Organization/Company"
                    value={item.company || item.institution || item.issuer || ''}
                    onChange={(e) => {
                      const fieldName = section.id === 'education' ? 'institution' :
                                     section.id === 'certifications' ? 'issuer' : 'company';
                      setFormData(prev => {
                        const updated = [...prev];
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
                        const updated = [...prev];
                        updated[index] = { ...updated[index], [fieldName]: e.target.value };
                        return updated;
                      });
                    }}
                  />
                  
                  <textarea
                    placeholder="Description"
                    value={item.description || ''}
                    onChange={(e) => setFormData(prev => {
                      const updated = [...prev];
                      updated[index] = { ...updated[index], description: e.target.value };
                      return updated;
                    })}
                    rows={3}
                  />
                </div>
              ))}
            </div>
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
          <h2>Add {section.name}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="modal-body">
          {renderForm()}
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={handleSave} className="save-btn">Save Section</button>
        </div>
      </div>
    </div>
  );
};

export default SectionFormModal;