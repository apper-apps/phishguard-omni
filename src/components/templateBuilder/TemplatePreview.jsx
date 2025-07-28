import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { COMPONENT_TYPES } from './ComponentPalette';

function TemplatePreview({ components, htmlContent, templateData }) {
  const generateHTMLPreview = () => {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${templateData?.subject || 'Email Template'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .component { margin-bottom: 20px; }
          .button { display: inline-block; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; }
          .divider { border: none; margin: 20px 0; }
          .signature { border-left: 4px solid #1E40AF; padding-left: 16px; }
        </style>
      </head>
      <body>
        <div class="email-container">
    `;

    components.forEach(component => {
      html += '<div class="component">';
      
      switch (component.type) {
        case COMPONENT_TYPES.HEADING:
          html += `<h${component.props.level} style="text-align: ${component.props.align}; color: ${component.props.color}; margin: 0;">${component.props.text}</h${component.props.level}>`;
          break;
          
        case COMPONENT_TYPES.TEXT:
          html += `<p style="text-align: ${component.props.align}; color: ${component.props.color}; line-height: 1.6; margin: 0;">${component.props.text}</p>`;
          break;
          
        case COMPONENT_TYPES.IMAGE:
          html += `<div style="text-align: ${component.props.align};"><img src="${component.props.src}" alt="${component.props.alt}" style="width: ${component.props.width}; max-width: 100%; height: auto; border-radius: 4px;"></div>`;
          break;
          
        case COMPONENT_TYPES.BUTTON:
          html += `<div style="text-align: ${component.props.align};"><a href="${component.props.url}" class="button" style="background-color: ${component.props.backgroundColor}; color: ${component.props.textColor};">${component.props.text}</a></div>`;
          break;
          
        case COMPONENT_TYPES.LOGO:
          html += `<div style="text-align: ${component.props.align};"><img src="${component.props.src}" alt="${component.props.alt}" style="width: ${component.props.width}; height: auto;"></div>`;
          break;
          
        case COMPONENT_TYPES.DIVIDER:
          html += `<hr class="divider" style="border-top: ${component.props.thickness}px solid ${component.props.color}; margin: ${component.props.margin};">`;
          break;
          
        case COMPONENT_TYPES.SPACER:
          html += `<div style="height: ${component.props.height};"></div>`;
          break;
          
        case COMPONENT_TYPES.SIGNATURE:
          html += `
            <div class="signature">
              <p style="margin: 0; font-weight: 600; color: #1a1a1a;">${component.props.name}</p>
              <p style="margin: 4px 0; color: #666;">${component.props.title}</p>
              <p style="margin: 4px 0; color: #666;">${component.props.company}</p>
              <p style="margin: 4px 0; color: #1E40AF;">${component.props.email}</p>
              <p style="margin: 4px 0; color: #666;">${component.props.phone}</p>
            </div>
          `;
          break;
      }
      
      html += '</div>';
    });

    if (htmlContent) {
      html += `<div class="component">${htmlContent}</div>`;
    }

    html += `
        </div>
      </body>
      </html>
    `;

    return html;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="Eye" className="mr-2" />
          Email Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto border rounded-lg m-4">
          <iframe
            srcDoc={generateHTMLPreview()}
            className="w-full h-[500px] border-none"
            title="Email Preview"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default TemplatePreview;