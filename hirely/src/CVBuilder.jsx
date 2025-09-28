import { useEffect, useRef, useState } from 'react';
import './CVBuilder.css';
import CVPreview from './CVPreview';
import CustomizationPanel from './CustomizationPanel';
import PageManager from './PageManager';
import SectionManager from './SectionManager';
import TemplateSelector from './templateSelector';

// Print View Component
const PrintView = ({ cvData, template, customization, onClose }) => {
  const printContainerRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('print-active');
    
    return () => {
      document.body.classList.remove('print-active');
    };
  }, []);

  return (
    <div 
      ref={printContainerRef}
      id="cv-print-container" 
      className="cv-print-container"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        background: 'white', 
        zIndex: 10000, 
        padding: '20px', 
        overflow: 'auto',
        boxSizing: 'border-box'
      }}>
        
      {/* Close button for preview */}
      <button 
        onClick={onClose}
        className="print-close-button"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#ff4444',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 10001,
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        ✕ Close Preview
      </button>
      
      <div className="print-pages-container" style={{ 
        width: '100%', 
        maxWidth: '210mm', 
        margin: '0 auto',
        paddingTop: '60px'
      }}>
        {cvData.pages.map((page, pageIndex) => (
          <div 
            key={page.id}
            className="cv-page print-page"
            style={{
              width: '210mm',
              minHeight: '297mm',
              background: 'white',
              margin: '0 auto 10mm auto',
              padding: '15mm',
              boxShadow: '0 0 20px rgba(0,0,0,0.2)',
              boxSizing: 'border-box',
              position: 'relative'
            }}
          >
            <CVPreview 
              template={template}
              cvData={cvData}
              customization={customization}
              currentPage={page.id}
              isPrintMode={true}
            />
            {/* Page number indicator (hidden in print) */}
            <div className="page-number" style={{ 
              position: 'absolute', 
              top: '5mm', 
              right: '15mm', 
              fontSize: '10pt', 
              color: '#666',
              fontFamily: 'Arial, sans-serif'
            }}>
              Page {pageIndex + 1} of {cvData.pages.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CVBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [cvData, setCvData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
    certifications: [],
    achievements: [],
    publications: [],
    volunteer: [],
    interests: [],
    pages: [
      {
        id: 1,
        sections: ['header', 'summary', 'experience', 'education', 'skills']
      }
    ]
  });
  const [customization, setCustomization] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStep, setCurrentStep] = useState('template-selection');
  const [showPrintView, setShowPrintView] = useState(false);

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

  const exportToPDF = () => {
  const previewElement = document.querySelector('.cv-preview');
  
  if (!previewElement) {
    alert('CV preview not found.');
    return;
  }

  const printClone = previewElement.cloneNode(true);
  
  printClone.style.cssText = `
    position: fixed !important;
    top: 10px !important;
    left: 10px !important;
    width: 210mm !important;
    min-height: 297mm !important;
    background: white !important;
    z-index: 9999 !important;
    margin: 0 !important;
    padding: 8mm !important;
    box-shadow: none !important;
    transform: none !important;
    overflow: visible !important;
    visibility: visible !important;
    display: block !important;
    box-sizing: border-box !important;
  `;

  printClone.classList.add('print-mode');

  const printContainer = document.createElement('div');
  printContainer.id = 'cv-print-container';
  printContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.8);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    overflow: auto;
    box-sizing: border-box;
  `;

  printContainer.appendChild(printClone);
  document.body.appendChild(printContainer);

  const printStyles = `
    <style>
      @media print {
        /* Remove browser headers and footers */
        @page {
          margin: 0 !important; /* This is the key line */
          size: A4;
        }
        
        body {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Hide URL, page numbers, date, etc. */
        /* Chrome, Safari, Edge */
        @page { 
          margin: 0; 
          size: A4;
        }
        
        /* Firefox */
        @page :footer { display: none }
        @page :header { display: none }
        
        /* General print hiding */
        body * {
          visibility: hidden;
        }
        
        #cv-print-container,
        #cv-print-container * {
          visibility: visible;
        }
        
        #cv-print-container {
          all: unset !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: white !important;
          display: flex !important;
          justify-content: center !important;
          align-items: flex-start !important;
        }
        
        .cv-preview.print-mode {
          width: 210mm !important;
          min-height: 297mm !important;
          padding: 5mm !important;
          margin: 0 !important;
        }
        
        .cv-preview.print-mode .preview-content {
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
        }
        
        .cv-preview.print-mode .name {
          font-size: 22pt !important;
          margin-bottom: 5px !important;
        }
        
        .cv-preview.print-mode .title {
          font-size: 12pt !important;
          margin-bottom: 10px !important;
        }
        
        .cv-preview.print-mode h2 {
          font-size: 14pt !important;
          margin-bottom: 8px !important;
        }
        
        .cv-preview.print-mode .experience-item,
        .cv-preview.print-mode .education-item {
          margin-bottom: 8px !important;
        }
      }
      
      /* Additional browser-specific fixes */
      @media print {
        /* Chrome/Safari/Edge */
        .cv-preview.print-mode {
          -webkit-print-color-adjust: exact; /* Force colors to print */
        }
        
        /* Firefox */
        @-moz-document url-prefix() {
          .cv-preview.print-mode {
            print-color-adjust: exact;
          }
        }
      }
    </style>
  `;

  document.head.insertAdjacentHTML('beforeend', printStyles);

  setTimeout(() => {
    window.print();
    
    setTimeout(() => {
      const printContainer = document.getElementById('cv-print-container');
      if (printContainer) printContainer.remove();
      
      const styles = document.querySelector('style');
      if (styles && styles.innerHTML.includes('@media print')) {
        styles.remove();
      }
    }, 500);
  }, 500);
};

  const handleClosePrintView = () => {
    setShowPrintView(false);
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
      {/* Print View Overlay */}
      {showPrintView && (
        <PrintView 
          cvData={cvData}
          template={selectedTemplate}
          customization={customization}
          onClose={handleClosePrintView}
        />
      )}
      
      <div className="builder-header">
        <button onClick={handleBackToTemplates} className="back-button">
          ← Change Template
        </button>
        <h2>Editing: {selectedTemplate?.name || 'Selected'} Template</h2>
        <button onClick={exportToPDF} className="export-button">
          📄 Export PDF
        </button>
        
        {/* Debug button - manually trigger print without auto-open */}
        <button 
          onClick={() => setShowPrintView(true)}
          style={{
            marginLeft: '10px', 
            background: '#666', 
            color: 'white', 
            border: 'none', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            cursor: 'pointer'
          }}
        >
          👁️ Preview Only
        </button>
      </div>
      
      <div className="builder-content">
        <div className="builder-sidebar">
          <div className="cv-form-container">
            <h3>Build Your CV</h3>
            
            <PageManager 
              cvData={cvData}
              setCvData={setCvData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            
            <SectionManager 
              template={selectedTemplate}
              cvData={cvData}
              setCvData={setCvData}
              currentPage={currentPage}
            />
            
            <div className="personal-info-section">
              <h4>Personal Information</h4>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={cvData.personalInfo?.name || ''}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, name: e.target.value }
                  }))}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Professional Title</label>
                <input 
                  type="text" 
                  value={cvData.personalInfo?.title || ''}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, title: e.target.value }
                  }))}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={cvData.personalInfo?.email || ''}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, email: e.target.value }
                  }))}
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="tel" 
                  value={cvData.personalInfo?.phone || ''}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, phone: e.target.value }
                  }))}
                  placeholder="(123) 456-7890"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  value={cvData.personalInfo?.location || ''}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, location: e.target.value }
                  }))}
                  placeholder="City, Country"
                />
              </div>
            </div>
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
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CVBuilder;   