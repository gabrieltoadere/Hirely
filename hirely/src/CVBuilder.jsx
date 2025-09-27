// CVBuilder.jsx
import { useState } from 'react';
import './CVBuilder.css';
import CVForm from './CVForm';
import CVPreview from './CVPreview';
import TemplateSelector from './templateSelector';

const CVBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [cvData, setCvData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    skills: []
  });
  const [currentStep, setCurrentStep] = useState('template-selection');

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
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
        <CVForm 
          template={selectedTemplate}
          cvData={cvData}
          setCvData={setCvData}
        />
        <CVPreview 
          template={selectedTemplate}
          cvData={cvData}
        />
      </div>
    </div>
  );
};

export default CVBuilder;