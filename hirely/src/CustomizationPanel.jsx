// CustomizationPanel.jsx
import './CustomizationPanel.css';

const CustomizationPanel = ({ template, customization, onCustomizationChange }) => {
  const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Black', value: '#000000' }
  ];

  const fonts = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
    { name: 'Courier New', value: 'Courier New, monospace' },
    { name: 'Brush Script MT', value: 'Brush Script MT, cursive' }
  ];

  const handleColorChange = (colorType, value) => {
    onCustomizationChange({
      ...customization,
      colors: {
        ...customization.colors,
        [colorType]: value
      }
    });
  };

  const handleFontChange = (fontType, value) => {
    onCustomizationChange({
      ...customization,
      fonts: {
        ...customization.fonts,
        [fontType]: value
      }
    });
  };

  const resetCustomization = () => {
    onCustomizationChange({
      colors: { ...template.defaultColors },
      fonts: { ...template.defaultFonts }
    });
  };

  return (
    <div className="customization-panel">
      <div className="panel-header">
        <h3>Customize Template</h3>
        <button onClick={resetCustomization} className="reset-btn">
          Reset to Default
        </button>
      </div>

      {/* Color Customization */}
      <div className="customization-section">
        <h4>Colors</h4>
        
        {template.customizable.includes('primaryColor') && (
          <div className="color-group">
            <label>Primary Color</label>
            <div className="color-picker">
              <input 
                type="color" 
                value={customization.colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
              />
              <span className="color-value">{customization.colors.primary}</span>
            </div>
            <div className="color-presets">
              {colors.map(color => (
                <button
                  key={color.value}
                  className="color-preset"
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorChange('primary', color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {template.customizable.includes('secondaryColor') && (
          <div className="color-group">
            <label>Secondary Color</label>
            <div className="color-picker">
              <input 
                type="color" 
                value={customization.colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
              />
              <span className="color-value">{customization.colors.secondary}</span>
            </div>
            <div className="color-presets">
              {colors.map(color => (
                <button
                  key={color.value}
                  className="color-preset"
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorChange('secondary', color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {template.customizable.includes('backgroundColor') && (
          <div className="color-group">
            <label>Background Color</label>
            <div className="color-picker">
              <input 
                type="color" 
                value={customization.colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
              />
              <span className="color-value">{customization.colors.background}</span>
            </div>
          </div>
        )}
      </div>

      {/* Font Customization */}
      <div className="customization-section">
        <h4>Fonts</h4>
        
        {template.customizable.includes('headingFont') && (
          <div className="font-group">
            <label>Heading Font</label>
            <select 
              value={customization.fonts.heading}
              onChange={(e) => handleFontChange('heading', e.target.value)}
            >
              {fonts.map(font => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>
            <div 
              className="font-preview"
              style={{ fontFamily: customization.fonts.heading }}
            >
              Heading Preview
            </div>
          </div>
        )}

        {template.customizable.includes('bodyFont') && (
          <div className="font-group">
            <label>Body Font</label>
            <select 
              value={customization.fonts.body}
              onChange={(e) => handleFontChange('body', e.target.value)}
            >
              {fonts.map(font => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>
            <div 
              className="font-preview"
              style={{ fontFamily: customization.fonts.body }}
            >
              Body text preview for the selected font family.
            </div>
          </div>
        )}
      </div>

      {/* Additional Customization Options */}
      <div className="customization-section">
        <h4>Layout</h4>
        <div className="layout-group">
          <label>Font Size</label>
          <input 
            type="range" 
            min="12"
            max="18"
            value={customization.fontSize || 16}
            onChange={(e) => onCustomizationChange({
              ...customization,
              fontSize: parseInt(e.target.value)
            })}
          />
          <span>{customization.fontSize || 16}px</span>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;