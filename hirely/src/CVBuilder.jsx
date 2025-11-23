import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useCallback, useEffect, useRef, useState } from 'react';
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
        padding: '0px', 
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
      }}>
        {cvData.pages.map((page) => (
          <div 
            key={page.id}
            className="cv-page print-page"
            style={{
              width: '210mm',
              height: 'auto',
              minHeight: '0',
              overflow: 'auto',
              background: 'white',
              margin: '0 auto',
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
  const [overflowDetected, setOverflowDetected] = useState(false);
  const previewContainerRef = useRef(null);

  useEffect(() => {
    if (onEditingStateChange) {
      onEditingStateChange(currentStep === 'form-filling');
    }
  }, [currentStep, onEditingStateChange]);

  // Real overflow detection using A4 page dimensions
  const checkVisualOverflow = useCallback(() => {
    const previewContainer = previewContainerRef.current;
    if (!previewContainer) return false;

    // Find the CV page element in the preview
    const pageElement = previewContainer.querySelector('.cv-page');
    if (!pageElement) return false;

    // A4 page content height limit in pixels (approximately)
    const CONTENT_HEIGHT_PX = 1000; // Allow some margin for padding
    
    const pageHeight = pageElement.scrollHeight;
    const isOverflowing = pageHeight > CONTENT_HEIGHT_PX;

    console.log('Page height:', pageHeight, 'Limit:', CONTENT_HEIGHT_PX, 'Overflowing:', isOverflowing);
    
    setOverflowDetected(isOverflowing);
    return isOverflowing;
  }, []);

  // Handle overflow by moving content to new pages
  const handleOverflow = useCallback(() => {
    setCvData(prev => {
      const currentPageData = prev.pages.find(page => page.id === currentPage);
      if (!currentPageData || currentPageData.sections.length <= 2) {
        return prev; // Don't move if only header + one section
      }

      // Create a copy of the current page sections
      const sections = [...currentPageData.sections];
      
      // Keep essential sections on first page (header + maybe summary)
      const essentialSections = sections.slice(0, 2); // header + first content section
      const remainingSections = sections.slice(2);
      
      if (remainingSections.length === 0) {
        return prev; // Nothing to move
      }

      let updatedPages = [...prev.pages];
      const currentPageIndex = updatedPages.findIndex(page => page.id === currentPage);
      
      // Update current page with only essential sections
      updatedPages[currentPageIndex] = {
        ...currentPageData,
        sections: essentialSections
      };

      // Distribute remaining sections to new pages
      let currentNewPageSections = [];
      let newPageId = Math.max(...updatedPages.map(p => p.id)) + 1;

      remainingSections.forEach((section, index) => {
        currentNewPageSections.push(section);
        
        // Create new page every 3-4 sections to prevent new overflow
        if (currentNewPageSections.length >= 3 || index === remainingSections.length - 1) {
          updatedPages.push({
            id: newPageId,
            sections: [...currentNewPageSections]
          });
          currentNewPageSections = [];
          newPageId++;
        }
      });

      console.log('Moved sections to new pages. Old page:', essentialSections, 'New pages created');
      
      return {
        ...prev,
        pages: updatedPages
      };
    });
  }, [currentPage]);

  // Check for overflow whenever data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const isOverflowing = checkVisualOverflow();
      if (isOverflowing) {
        console.log('Overflow detected, handling...');
        handleOverflow();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [cvData, currentPage, checkVisualOverflow, handleOverflow]);

  // Also check when user adds new sections or content
  useEffect(() => {
    const timer = setTimeout(() => {
      checkVisualOverflow();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    cvData.experience,
    cvData.education, 
    cvData.skills,
    cvData.projects,
    cvData.personalInfo?.summary,
    cvData.pages,
    checkVisualOverflow
  ]);

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

  // Fixed Manual overflow check
  const manualOverflowCheck = () => {
    console.log('Manual overflow check triggered');
    const isOverflowing = checkVisualOverflow();
    console.log('Is overflowing:', isOverflowing);
    
    if (isOverflowing) {
      console.log('Calling handleOverflow...');
      handleOverflow();
      setTimeout(() => {
        alert('Overflow detected! Content has been moved to new pages.');
      }, 100);
    } else {
      alert('No overflow detected. Your content fits perfectly on the current page.');
    }
  };

  // Force redistribute all content
  const redistributeAllContent = () => {
    setCvData(prev => {
      // Collect all sections from all pages
      const allSections = [];
      prev.pages.forEach(page => {
        allSections.push(...page.sections);
      });

      // Redistribute sections evenly
      const updatedPages = [];
      let currentPageSections = [];
      let pageId = 1;

      allSections.forEach((section, index) => {
        currentPageSections.push(section);
        
        // Create new page every 3-4 sections or if it's the last section
        if (currentPageSections.length >= 4 || index === allSections.length - 1) {
          updatedPages.push({
            id: pageId,
            sections: [...currentPageSections]
          });
          currentPageSections = [];
          pageId++;
        }
      });

      return {
        ...prev,
        pages: updatedPages
      };
    });
    alert('All content has been redistributed across pages.');
  };


  const exportToPDF = async () => {
    setIsGeneratingPDF(true);

    try {
      setShowPrintView(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const content = document.querySelector(".print-page .preview-content");
      if (!content) return alert("preview-content not found");

      const canvas = await html2canvas(content, {
        scale: 8,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // Convert pixels → mm
      const pxToMm = px => px * 0.264583;

      // FIX: Set width to A4 (210mm)
      const pdfWidthMm = 210;

      // Convert canvas width to mm
      const canvasWidthMm = pxToMm(canvas.width);
      const canvasHeightMm = pxToMm(canvas.height);

      // Scale the height proportionally to the fixed A4 width
      const pdfHeightMm = (pdfWidthMm / canvasWidthMm) * canvasHeightMm;

      // Now create a PDF page with EXACT scaled height
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: [pdfWidthMm, pdfHeightMm]
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidthMm, pdfHeightMm);

      pdf.save("my-cv.pdf");

    } catch (err) {
      console.error("PDF Error:", err);
      alert("Error generating PDF.");
    }

    setIsGeneratingPDF(false);
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
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
          <button
            onClick={() => {
              console.log("cvData SAMPLE:", JSON.stringify(cvData, null, 2));
              alert("Check the console for cvData output.");
            }}
          >
            Log CV Data
          </button>

          <button 
            onClick={manualOverflowCheck}
            style={{
              background: overflowDetected ? '#ff6b6b' : '#28a745', 
              color: 'white', 
              border: 'none', 
              padding: '8px 12px', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
            title="Check if content overflows the page"
          >
            {overflowDetected ? '⚠️ Overflow!' : 'Check Overflow'}
          </button>

          <button 
            onClick={redistributeAllContent}
            style={{
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              padding: '8px 12px', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
            title="Redistribute all content evenly across pages"
          >
            Redistribute Content
          </button>
        </div>
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
        
        <div className="builder-preview" ref={previewContainerRef}>
          <div className="cv-preview-container">
            <CVPreview 
              template={selectedTemplate}
              cvData={cvData}
              customization={customization}
              currentPage={currentPage}
            />
          </div>
          
          {/* Overflow indicator */}
          {overflowDetected && (
            <div className="overflow-warning" style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#ff6b6b',
              color: 'white',
              padding: '10px 15px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              zIndex: 100,
              animation: 'pulse 2s infinite'
            }}>
              ⚠️ Page Overflow Detected - Some content may be cut off
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CVBuilder;