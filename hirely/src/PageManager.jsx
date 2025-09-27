// PageManager.jsx
import './PageManager.css';

const PageManager = ({ cvData, setCvData, currentPage, setCurrentPage }) => {
  const addNewPage = () => {
    const newPageId = Math.max(...cvData.pages.map(p => p.id), 0) + 1;
    
    // New pages start with minimal sections (no header if not first page)
    const newPageSections = cvData.pages.length === 0 
      ? ['header', 'summary'] // First page gets header
      : ['summary']; // Subsequent pages start empty or with basic sections
    
    setCvData(prev => ({
      ...prev,
      pages: [
        ...prev.pages,
        {
          id: newPageId,
          sections: newPageSections
        }
      ]
    }));
    
    setCurrentPage(newPageId);
  };

  const removePage = (pageId) => {
    if (cvData.pages.length <= 1) return;
    
    setCvData(prev => ({
      ...prev,
      pages: prev.pages.filter(page => page.id !== pageId)
    }));
    
    if (currentPage === pageId) {
      setCurrentPage(cvData.pages[0].id);
    }
  };

  const duplicatePage = (pageId) => {
    const pageToDuplicate = cvData.pages.find(page => page.id === pageId);
    const newPageId = Math.max(...cvData.pages.map(p => p.id), 0) + 1;
    
    setCvData(prev => ({
      ...prev,
      pages: [
        ...prev.pages,
        {
          id: newPageId,
          sections: [...pageToDuplicate.sections]
        }
      ]
    }));
    
    setCurrentPage(newPageId);
  };

  return (
    <div className="page-manager">
      <div className="page-manager-header">
        <h4>Pages</h4>
        <button onClick={addNewPage} className="add-page-btn">
          + Add Page
        </button>
      </div>
      
      <div className="pages-list">
        {cvData.pages.map((page, index) => (
          <div 
            key={page.id}
            className={`page-item ${currentPage === page.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(page.id)}
          >
            <div className="page-info">
              <span className="page-number">Page {index + 1}</span>
              <span className="page-sections-count">
                {page.sections.length} sections
                {index > 0 && !page.sections.includes('header') && ' (No header)'}
              </span>
            </div>
            
            <div className="page-actions">
              {cvData.pages.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicatePage(page.id);
                    }}
                    className="duplicate-page-btn"
                    title="Duplicate page"
                  >
                    ⎘
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removePage(page.id);
                    }}
                    className="remove-page-btn"
                    title="Remove page"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageManager;