// SectionManager.jsx
import { useState } from 'react';
import SectionFormModal from './SectionFormModal';
import './SectionManager.css';

const SectionManager = ({ template, cvData, setCvData, currentPage }) => {
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  const availableSections = [
  { id: 'summary', name: 'Professional Summary', icon: '📝', type: 'textarea' },
  { id: 'experience', name: 'Work Experience', icon: '💼', type: 'list' },
  { id: 'education', name: 'Education', icon: '🎓', type: 'list' },
  { id: 'skills', name: 'Skills', icon: '⚡', type: 'list' },
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

  const editSection = (sectionId) => {
    const section = availableSections.find(s => s.id === sectionId);
    setSelectedSection(section);
    setIsEditingExisting(true);
    setShowFormModal(true);
  };

  const removeSection = (sectionId) => {
    if (sectionId === 'header') return;
    
    setCvData(prev => {
      const updatedPages = prev.pages.map(page => 
        page.id === currentPage 
          ? { ...page, sections: page.sections.filter(s => s !== sectionId) }
          : page
      );
      return { ...prev, pages: updatedPages };
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

  const getSectionDataCount = (sectionId) => {
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

  return (
    <div className="section-manager">
      <div className="section-manager-header">
        <h4>Page Sections</h4>
        <button 
          onClick={() => setShowSectionModal(true)}
          className="add-section-btn"
          disabled={unusedSections.length === 0}
        >
          + Add Section
        </button>
      </div>

      <div className="sections-list">
        {currentSections.map((sectionId, index) => {
          const sectionInfo = availableSections.find(s => s.id === sectionId);
          const dataCount = getSectionDataCount(sectionId);
          
          return (
            <div key={sectionId} className="section-item">
              <div 
                className="section-info"
                onClick={() => editSection(sectionId)}
                style={{ cursor: 'pointer' }}
              >
                <span className="section-icon">{sectionInfo?.icon || '📄'}</span>
                <span className="section-name">{sectionInfo?.name || sectionId}</span>
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
                
                {index < currentSections.length - 1 && (
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
                
                {sectionId !== 'header' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSection(sectionId);
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
            </div>
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

export default SectionManager;