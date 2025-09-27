// TemplateSelector.jsx
import React from 'react';
import { CV_TEMPLATES } from './templates';
import './templateSelector.css';

const TemplateSelector = ({ onTemplateSelect, currentTemplate }) => {
  // Fallback component if image fails to load
  const ImageWithFallback = ({ src, alt, template }) => {
    const [imageError, setImageError] = React.useState(false);

    if (imageError) {
        return (
            <div
                className="template-thumbnail-placeholder"
                style={{
                    background: `linear-gradient(135deg, ${template.defaultColors.primary}, ${template.defaultColors.secondary})`
                }}
            >
                <div className="placeholder-content">
                    <span className="template-initial">{template.name.charAt(0)}</span>
                    <span className="template-name">{template.name}</span>
                </div>
            </div>
        );
    }

    return (
      <img 
        src={src} 
        alt={alt}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  };

  return (
    <div className="template-selector">
      <div className="selector-header">
        <h2>Choose Your CV Template</h2>
        <p>Select a template that matches your style and industry</p>
      </div>
      
      <div className="templates-grid">
        {CV_TEMPLATES.map(template => (
          <div 
            key={template.id}
            className={`template-card ${currentTemplate === template.id ? 'selected' : ''}`}
            onClick={() => onTemplateSelect(template)}
          >
            <div className="template-thumbnail">
              <ImageWithFallback 
                src={template.thumbnail} 
                alt={`${template.name} Template Preview`}
                template={template}
              />
              
              {template.isPopular && (
                <span className="popular-badge">🔥 Popular</span>
              )}
              
              <div className="template-overlay">
                <span className="preview-text">Click to Preview</span>
              </div>
            </div>
            
            <div className="template-info">
              <div className="template-header">
                <h3>{template.name}</h3>
                <span className="category-badge">{template.category}</span>
              </div>
              <p>{template.description}</p>
              
              <div className="template-features">
                <span className="layout-badge">
                  {template.layout === 'single-column' ? 'Single Column' : 'Two Columns'}
                </span>
                <span className="sections-count">
                  {template.sections.length} sections
                </span>
              </div>
              
              <button className="select-template-btn">
                Use This Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;