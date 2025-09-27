// TemplateSelector.jsx
import { CV_TEMPLATES } from './templates';

const TemplateSelector = ({ onTemplateSelect, currentTemplate }) => {
  return (
    <div className="template-selector">
      <h2>Choose a Template</h2>
      <div className="templates-grid">
        {CV_TEMPLATES.map(template => (
          <div 
            key={template.id}
            className={`template-card ${currentTemplate === template.id ? 'selected' : ''}`}
            onClick={() => onTemplateSelect(template)}
          >
            <div className="template-thumbnail">
              <img src={template.thumbnail} alt={template.name} />
              {template.isPopular && <span className="popular-badge">Popular</span>}
            </div>
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <span className="category">{template.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;