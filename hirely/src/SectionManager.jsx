// SectionManager.jsx
import { useState } from 'react';
import SectionFormModal from './SectionFormModal';
import './SectionManager.css';

const SectionManager = ({ template, cvData, setCvData, currentPage }) => {
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [showCustomSectionModal, setShowCustomSectionModal] = useState(false);

  const availableSections = [
    { id: 'summary', name: 'Professional Summary', icon: '📝', type: 'textarea' },
    { id: 'experience', name: 'Work Experience', icon: '💼', type: 'list' },
    { id: 'education', name: 'Education', icon: '🎓', type: 'list' },
    { id: 'skills', name: 'Skills', icon: '⚡', type: 'skills' },
    { id: 'projects', name: 'Projects', icon: '🚀', type: 'list' },
    { id: 'languages', name: 'Languages', icon: '🌎', type: 'list' },
    { id: 'certifications', name: 'Certifications', icon: '🏆', type: 'list' },
    { id: 'achievements', name: 'Achievements', icon: '⭐', type: 'list' },
    { id: 'publications', name: 'Publications', icon: '📚', type: 'list' },
    { id: 'references', name: 'References', icon: '👥', type: 'simple' },
    { id: 'volunteer', name: 'Volunteer Experience', icon: '❤️', type: 'list' },
    { id: 'interests', name: 'Interests', icon: '🎯', type: 'tags' }
  ];

  const currentPageData = cvData.pages?.find(page => page.id === currentPage) || cvData.pages[0];
  const currentSections = currentPageData.sections || [];

  // Get custom sections from cvData
  const customSections = cvData.customSections || [];

  const addSection = (section) => {
    setCvData(prev => {
      const updatedPages = prev.pages.map(page => 
        page.id === currentPage 
          ? { ...page, sections: [...page.sections, section.id] }
          : page
      );
      return { ...prev, pages: updatedPages };
    });
    
    // Open the form modal for the new section
    setSelectedSection(section);
    setIsEditingExisting(false);
    setShowFormModal(true);
    setShowSectionModal(false);
  };

  const addCustomSection = (customSectionData) => {
    const customSectionId = `custom-${Date.now()}`;
    const newCustomSection = {
      id: customSectionId,
      name: customSectionData.name,
      icon: customSectionData.icon || '📄',
      type: customSectionData.type || 'simple'
    };

    setCvData(prev => {
      // Add to custom sections array
      const updatedCustomSections = [...(prev.customSections || []), newCustomSection];
      
      // Add to current page sections
      const updatedPages = prev.pages.map(page => 
        page.id === currentPage 
          ? { ...page, sections: [...page.sections, customSectionId] }
          : page
      );

      return { 
        ...prev, 
        customSections: updatedCustomSections,
        pages: updatedPages 
      };
    });

    setShowCustomSectionModal(false);
    
    // Open the form modal for the new custom section
    setSelectedSection(newCustomSection);
    setIsEditingExisting(false);
    setShowFormModal(true);
  };

  const editSection = (sectionId) => {
    // Check if it's a custom section or predefined section
    const isCustomSection = sectionId.startsWith('custom-');
    
    if (isCustomSection) {
      const section = customSections.find(s => s.id === sectionId);
      setSelectedSection(section);
    } else {
      const section = availableSections.find(s => s.id === sectionId);
      setSelectedSection(section);
    }
    
    setIsEditingExisting(true);
    setShowFormModal(true);
  };

  const removeSection = (sectionId) => {
    if (sectionId === 'header') return;
    
    setCvData(prev => {
      // Remove from page sections
      const updatedPages = prev.pages.map(page => 
        page.id === currentPage 
          ? { ...page, sections: page.sections.filter(s => s !== sectionId) }
          : page
      );

      // If it's a custom section, also remove from customSections array
      let updatedCustomSections = prev.customSections;
      if (sectionId.startsWith('custom-')) {
        updatedCustomSections = (prev.customSections || []).filter(s => s.id !== sectionId);
      }

      return { 
        ...prev, 
        pages: updatedPages,
        customSections: updatedCustomSections
      };
    });
  };

  const moveSection = (fromIndex, toIndex) => {
    setCvData(prev => {
      const updatedPages = prev.pages.map(page => {
        if (page.id === currentPage) {
          const newSections = [...page.sections];
          const [movedSection] = newSections.splice(fromIndex, 1);
          newSections.splice(toIndex, 0, movedSection);
          return { ...page, sections: newSections };
        }
        return page;
      });
      return { ...prev, pages: updatedPages };
    });
  };

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
    return availableSections.find(s => s.id === sectionId) || { 
      id: sectionId, 
      name: sectionId, 
      icon: '📄' 
    };
  };

  const getSectionDataCount = (sectionId) => {
    // For custom sections, check cvData.customSectionsData or similar structure
    if (sectionId.startsWith('custom-')) {
      const customData = cvData.customSectionsData?.[sectionId];
      if (!customData) return 0;
      
      if (Array.isArray(customData)) {
        return customData.length;
      }
      return Object.keys(customData).length > 0 ? 1 : 0;
    }

    // For predefined sections
    const data = cvData[sectionId === 'summary' ? 'personalInfo' : sectionId];
    if (!data) return 0;
    
    if (Array.isArray(data)) {
      return data.length;
    } else if (sectionId === 'summary') {
      return data.summary ? 1 : 0;
    }
    return Object.keys(data).length > 0 ? 1 : 0;
  };

  const getCountIcon = (count) => {
    return `${count}`;
  };

  const unusedSections = availableSections.filter(
    section => !currentSections.includes(section.id)
  );

  // Combine predefined and custom sections for display
  const allCurrentSections = currentSections.map(sectionId => ({
    id: sectionId,
    ...getSectionInfo(sectionId)
  }));

  return (
    <div className="section-manager">
      <div className="section-manager-header">
        <h4>Page Sections</h4>
        <button 
          onClick={() => setShowSectionModal(true)}
          className="add-section-btn"
        >
          + Add Section
        </button>
      </div>

      <div className="sections-list">
        {allCurrentSections.map((section, index) => {
          const dataCount = getSectionDataCount(section.id);
          
          return (
            <div key={section.id} className="section-item">
              <div 
                className="section-info"
                onClick={() => editSection(section.id)}
                style={{ cursor: 'pointer' }}
              >
                <span className="section-icon">{section.icon}</span>
                <span className="section-name">{section.name}</span>
                {section.id.startsWith('custom-') && (
                  <span className="custom-badge">Custom</span>
                )}
                {dataCount > 0 && (
                  <span className="data-count">{getCountIcon(dataCount)}</span>
                )}
              </div>
              
              <div className="section-actions">
                {index > 0 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(index, index - 1);
                    }}
                    className="move-btn"
                    title="Move up"
                  >
                    ↑
                  </button>
                )}
                
                {index < allCurrentSections.length - 1 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(index, index + 1);
                    }}
                    className="move-btn"
                    title="Move down"
                  >
                    ↓
                  </button>
                )}
                
                {section.id !== 'header' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSection(section.id);
                    }}
                    className="remove-btn"
                    title="Remove section"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Section Modal */}
      {showSectionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Section</h3>
              <button onClick={() => setShowSectionModal(false)} className="close-btn">
                ×
              </button>
            </div>
            
            <div className="sections-grid">
              {unusedSections.map(section => (
                <div 
                  key={section.id}
                  className="section-option"
                  onClick={() => addSection(section)}
                >
                  <span className="section-icon">{section.icon}</span>
                  <span className="section-name">{section.name}</span>
                </div>
              ))}
              
              {/* Custom Section Option */}
              <div 
                className="section-option custom-section-option"
                onClick={() => {
                  setShowSectionModal(false);
                  setShowCustomSectionModal(true);
                }}
              >
                <span className="section-icon">✨</span>
                <span className="section-name">Custom Section</span>
                <span className="custom-tag">New</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Section Creation Modal */}
      {showCustomSectionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create Custom Section</h3>
              <button onClick={() => setShowCustomSectionModal(false)} className="close-btn">
                ×
              </button>
            </div>
            
            <CustomSectionForm 
              onSubmit={addCustomSection}
              onCancel={() => setShowCustomSectionModal(false)}
            />
          </div>
        </div>
      )}

      {/* Section Form Modal */}
      <SectionFormModal
        section={selectedSection}
        cvData={cvData}
        setCvData={setCvData}
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSave={() => setShowFormModal(false)}
        isEditing={isEditingExisting}
      />
    </div>
  );
};

// Custom Section Form Component
const CustomSectionForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '📄',
    type: 'simple'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a section name');
      return;
    }
    onSubmit(formData);
  };

  const iconOptions = ['📄', '✨', '⭐', '🎯', '🏅', '📊', '💡', '🔧', '🎨', '🌐'];

  return (
    <form onSubmit={handleSubmit} className="custom-section-form">
      <div className="form-group">
        <label>Section Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="e.g., Publications, Awards, Portfolio"
          required
        />
      </div>

      <div className="form-group">
        <label>Icon</label>
        <div className="icon-selector">
          {iconOptions.map(icon => (
            <button
              key={icon}
              type="button"
              className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
              onClick={() => setFormData({...formData, icon})}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Content Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option value="simple">Simple Text</option>
          <option value="list">List Items</option>
          <option value="textarea">Paragraph</option>
          <option value="tags">Tags</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="submit-btn">
          Create Section
        </button>
      </div>
    </form>
  );
};

export default SectionManager;