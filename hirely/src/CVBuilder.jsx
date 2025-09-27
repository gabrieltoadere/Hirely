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

  // Add a print-specific class to body when component mounts
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
      }}
    >
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
              boxSizing: 'border-box'
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
      
      {/* Move styles to a separate style tag for better control */}
      <style>{`
        /* Print styles */
        @media print {
          /* Reset everything for print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          @page {
            margin: 0 !important;
            size: A4 portrait;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
          }
          
          /* Hide everything except print container */
          body > *:not(.cv-print-container) {
            display: none !important;
          }
          
          /* Show print container content */
          .cv-print-container {
            all: initial !important;
            display: block !important;
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }
          
          /* Hide close button in print */
          .print-close-button {
            display: none !important;
          }
          
          /* Style pages for print */
          .print-pages-container {
            all: initial !important;
            display: block !important;
            width: 100% !important;
          }
          
          .cv-page {
                display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 15mm !important;
            margin: 0 auto !important;
            page-break-after: always;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          
          .cv-page:last-child {
            page-break-after: auto;
          }
          
          /* Hide page numbers in print */
          .page-number {
            display: none !important;
          }
        }
        
        /* Screen styles for print preview */
        @media screen {
          .cv-print-container {
            display: block !important;
          }
          
          .cv-page {
            display: block !important;
            visibility: visible !important;
          }
          
          body.print-active {
            overflow: hidden !important;
          }
        }
      `}</style>
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
  const [isPrinting, setIsPrinting] = useState(false);

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
    setShowPrintView(true);
    setIsPrinting(true);
  };

  const handleClosePrintView = () => {
    setShowPrintView(false);
    setIsPrinting(false);
  };

  // Handle the actual printing after the component renders
  useEffect(() => {
    if (isPrinting && showPrintView) {
      // Wait longer for everything to render completely
      const printTimer = setTimeout(() => {
        console.log('Starting print...');
        window.print();
        
        // Don't close immediately - let user handle the print dialog
        setTimeout(() => {
          setIsPrinting(false);
        }, 2000);
      }, 1500); // Increased delay for better rendering

      return () => clearTimeout(printTimer);
    }
  }, [isPrinting, showPrintView]);

  // Also add a manual print button inside the print view for testing
  const handleManualPrint = () => {
    window.print();
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
          style={{marginLeft: '10px', background: '#666'}}
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
};

export default CVBuilder;