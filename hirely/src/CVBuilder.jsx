import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
        {cvData.pages.map((page) => (
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
            {/* Add CSS to hide any page counters */}
            <style>
              {`
                .print-page .page-counter,
                .print-page .page-number,
                .print-page [class*="page"],
                .print-page [class*="counter"] {
                  display: none !important;
                }
              `}
            </style>
            <CVPreview 
              template={template}
              cvData={cvData}
              customization={customization}
              currentPage={page.id}
              isPrintMode={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const CVBuilder = ({onEditingStateChange}) => {
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (onEditingStateChange) {
      onEditingStateChange(currentStep === 'form-filling');
    }
  }, [currentStep, onEditingStateChange]);

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

  const exportToPDF = async () => {
  setIsGeneratingPDF(true);
  
  try {
    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = `
      position: fixed;
      top: -10000px;
      left: -10000px;
      width: 210mm;
      z-index: 10000;
      background: white;
    `;
    document.body.appendChild(tempContainer);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;

    // Use the actual print view content instead of recreating it
    const printContainer = document.getElementById('cv-print-container');
    if (!printContainer) {
      // If print view isn't open, create it temporarily
      setShowPrintView(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for render
    }

    const printPages = document.querySelectorAll('.print-page');
    
    for (let i = 0; i < printPages.length; i++) {
      const pageElement = printPages[i];
      
      const canvas = await html2canvas(pageElement, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: pageElement.scrollWidth,
        height: pageElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: pageElement.scrollWidth,
        windowHeight: pageElement.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      if (i > 0) {
        pdf.addPage();
      }
      
      // Calculate dimensions to fit A4
      const imgWidth = pageWidth;
      const imgHeight = pageHeight;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST');
    }

    // Clean up
    document.body.removeChild(tempContainer);
    
    // Save PDF
    pdf.save('my-cv.pdf');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  } finally {
    setIsGeneratingPDF(false);
  }
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
        <button 
          onClick={exportToPDF} 
          className="export-button"
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? '⏳ Generating PDF...' : '📄 Download PDF'}
        </button>
        
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
          PDF Preview
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