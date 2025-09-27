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
  const previewElement = document.querySelector('.cv-preview');
  
  if (!previewElement) {
    alert('CV preview not found. Please try again.');
    return;
  }

  // Create a clone of the preview for printing
  const printClone = previewElement.cloneNode(true);
  
  // Style the clone for printing with proper A4 dimensions
  printClone.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 210mm !important;  /* A4 width */
    min-height: 297mm !important; /* A4 height */
    background: white !important;
    z-index: 9999 !important;
    margin: 0 !important;
    padding: 15mm !important;  /* Reduced from 20mm */
    box-shadow: none !important;
    transform: none !important;
    overflow: visible !important;
    visibility: visible !important;
    display: block !important;
    box-sizing: border-box !important;
  `;

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
    padding: 10mm;  /* Reduced container padding */
    overflow: auto;
    box-sizing: border-box;
  `;

  printContainer.appendChild(printClone);
  document.body.appendChild(printContainer);

  // Add optimized print styles
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
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          display: flex !important;
          justify-content: center !important;
          align-items: flex-start !important;
        }
        .cv-preview.print-mode {
          width: 210mm !important;
          min-height: 297mm !important;
          box-shadow: none !important;
          margin: 0 !important;
          padding: 10mm !important;  /* Even less padding for print */
          transform: scale(1) !important;
        }
        
        /* Optimize CV content for print */
        .cv-preview.print-mode .preview-content {
          padding: 0 !important;
          width: 100% !important;
        }
        
        /* Reduce font sizes for better fit */
        .cv-preview.print-mode .name {
          font-size: 24pt !important;
        }
        
        .cv-preview.print-mode .title {
          font-size: 14pt !important;
        }
        
        .cv-preview.print-mode h2 {
          font-size: 16pt !important;
        }
        
        .cv-preview.print-mode h3 {
          font-size: 12pt !important;
        }
        
        .cv-preview.print-mode p {
          font-size: 10pt !important;
        }
        
        /* Ensure good page breaks */
        .preview-section {
          page-break-inside: avoid;
          break-inside: avoid;
        }
      }
      
      /* Screen preview styles */
      .cv-preview.print-mode {
        transform: scale(0.8) !important; /* Scale down for screen preview */
        width: 210mm !important;
        min-height: 297mm !important;
        background: white !important;
        border: 1px solid #ccc !important;
      }
    </style>
  `;

  document.head.insertAdjacentHTML('beforeend', printStyles);

  // Trigger print
  setTimeout(() => {
    window.print();
    
    // Clean up
    setTimeout(() => {
      const printContainer = document.getElementById('cv-print-container');
      if (printContainer) {
        printContainer.remove();
      }
      
      const addedStyles = document.querySelector('style');
      if (addedStyles && addedStyles.innerHTML.includes('@media print')) {
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