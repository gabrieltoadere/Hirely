// CVBuilder.jsx (updated)
import { useState } from 'react';
import './CVBuilder.css';
import CVForm from './CVForm';
import CVPreview from './CVPreview';
import CustomizationPanel from './CustomizationPanel';
import TemplateSelector from './templateSelector';

const CVBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [cvData, setCvData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    skills: []
  });
  const [customization, setCustomization] = useState({});
  const [currentStep, setCurrentStep] = useState('template-selection');

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Initialize customization with template defaults
    setCustomization({
      colors: { ...template.defaultColors },
      fonts: { ...template.defaultFonts },
      fontSize: 16
    });
    setCurrentStep('form-filling');
  };

  const handleBackToTemplates = () => {
    setCurrentStep('template-selection');
  };

  if (currentStep === 'template-selection') {
    return (
      <TemplateSelector 
        onTemplateSelect={handleTemplateSelect}
        currentTemplate={selectedTemplate?.id}
      />
    );
  }

  return (
    <div className="cv-builder">
      <div className="builder-header">
        <button onClick={handleBackToTemplates} className="back-button">
          ← Change Template
        </button>
        <h2>Editing: {selectedTemplate.name} Template</h2>
      </div>
      
      <div className="builder-content">
        <div className="builder-sidebar">
          <CVForm 
            template={selectedTemplate}
            cvData={cvData}
            setCvData={setCvData}
          />
          <CustomizationPanel 
            template={selectedTemplate}
            customization={customization}
            onCustomizationChange={setCustomization}
          />
        </div>
        
        <div className="builder-preview">
          <CVPreview 
            template={selectedTemplate}
            cvData={cvData}
            customization={customization}
          />
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;