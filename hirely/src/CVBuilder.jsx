// CVBuilder.jsx
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

  // Updated export function in CVBuilder.jsx
const exportToPDF = () => {
  // Store references to elements
  const previewElement = document.querySelector('.cv-preview');
  const previewContainer = document.querySelector('.cv-preview-container');
  const builderContent = document.querySelector('.builder-content');
  
  if (!previewElement) {
    alert('CV preview not found. Please try again.');
    return;
  }

  // Create a clone of the preview for printing
  const printClone = previewElement.cloneNode(true);
  
  // Style the clone for printing
  printClone.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: white !important;
    z-index: 9999 !important;
    margin: 0 !important;
    padding: 20mm !important;
    box-shadow: none !important;
    transform: none !important;
    overflow: visible !important;
    visibility: visible !important;
    display: block !important;
  `;

  // Add print-specific styles to the clone
  printClone.classList.add('print-mode');

  // Create a print container
  const printContainer = document.createElement('div');
  printContainer.id = 'cv-print-container';
  printContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: white;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20mm;
    overflow: auto;
  `;

  // Append the clone to the print container
  printContainer.appendChild(printClone);
  
  // Add print container to body
  document.body.appendChild(printContainer);

  // Add print styles
  const printStyles = `
    <style>
      @media print {
        body * {
          visibility: hidden;
        }
        #cv-print-container,
        #cv-print-container * {
          visibility: visible;
        }
        #cv-print-container {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: auto !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .cv-preview.print-mode {
          width: 210mm !important;
          min-height: 297mm !important;
          box-shadow: none !important;
          margin: 0 auto !important;
          padding: 20mm !important;
        }
      }
      
      /* Screen styles for print preview */
      .cv-preview.print-mode {
        transform: scale(1) !important;
        width: 210mm !important;
        min-height: 297mm !important;
        background: white !important;
      }
    </style>
  `;

  // Add styles to head
  document.head.insertAdjacentHTML('beforeend', printStyles);

  // Trigger print
  setTimeout(() => {
    window.print();
    
    // Clean up after printing
    setTimeout(() => {
      if (document.getElementById('cv-print-container')) {
        document.getElementById('cv-print-container').remove();
      }
      
      // Remove the print styles
      const addedStyles = document.querySelector('style[data-print-styles]');
      if (addedStyles) {
        addedStyles.remove();
      }
    }, 500);
  }, 500);
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
        <button onClick={exportToPDF} className="export-button">
          📄 Export PDF
        </button>
      </div>
      
      <div className="builder-content">
        <div className="builder-sidebar">
          <div className="cv-form-container">
            <h3>Fill in Your Information</h3>
            <CVForm 
              template={selectedTemplate}
              cvData={cvData}
              setCvData={setCvData}
            />
          </div>
          
          <div className="customization-container">
            <CustomizationPanel 
              template={selectedTemplate}
              customization={customization}
              onCustomizationChange={setCustomization}
            />
          </div>
        </div>
        
        <div className="builder-preview">
          <div className="cv-preview-container">
            <CVPreview 
              template={selectedTemplate}
              cvData={cvData}
              customization={customization}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;