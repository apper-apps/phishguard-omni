import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import templateService from '@/services/api/templateService';
import employeeService from '@/services/api/employeeService';
import DragDropProvider from '@/components/templateBuilder/DragDropProvider';
import ComponentPalette from '@/components/templateBuilder/ComponentPalette';
import TemplateCanvas from '@/components/templateBuilder/TemplateCanvas';
import WYSIWYGEditor from '@/components/templateBuilder/WYSIWYGEditor';
import TemplatePreview from '@/components/templateBuilder/TemplatePreview';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import ApperIcon from '@/components/ApperIcon';

function TemplateBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('builder'); // 'builder', 'wysiwyg', 'html', 'preview'
  const [cssContent, setCssContent] = useState('');
  const [sampleEmployee, setSampleEmployee] = useState(null);
  // Template data
  const [templateData, setTemplateData] = useState({
    name: '',
    category: 'Credential Harvesting',
    subject: '',
    sender: '',
    preview: '',
    difficulty: 'easy',
    tags: []
  });
  
  // Builder state
  const [components, setComponents] = useState([]);
  const [htmlContent, setHtmlContent] = useState('');
  const [newTag, setNewTag] = useState('');

  const categories = [
    'Credential Harvesting',
    'Malware Delivery',
    'Social Engineering',
    'Business Email Compromise',
    'Information Gathering',
    'Financial Fraud'
  ];

// Load existing template if editing
  useEffect(() => {
    if (id) {
      loadTemplate();
    }
    loadSampleEmployee();
  }, [id]);

  const loadSampleEmployee = async () => {
    try {
      const employees = await employeeService.getAll();
      if (employees.length > 0) {
        const employee = employees[0];
        const nameParts = employee.name.split(' ');
        setSampleEmployee({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          fullName: employee.name,
          email: employee.email,
          department: employee.department,
          company: 'Acme Corporation',
          position: 'Employee',
          phone: '+1 (555) 123-4567'
        });
      }
    } catch (error) {
      console.error('Error loading sample employee:', error);
    }
  };

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const template = await templateService.getById(parseInt(id));
      setTemplateData({
        name: template.name || '',
        category: template.category || 'Credential Harvesting',
        subject: template.subject || '',
        sender: template.sender || '',
        preview: template.preview || '',
        difficulty: template.difficulty || 'easy',
        tags: template.tags || []
      });
      
      if (template.structure) {
        setComponents(template.structure);
      }
      
      if (template.htmlContent) {
        setHtmlContent(template.htmlContent);
      }
    } catch (error) {
      toast.error('Failed to load template');
      console.error('Error loading template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComponent = (component) => {
    setComponents(prev => [...prev, component]);
  };

  const handleUpdateComponent = (componentId, updates) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === componentId 
          ? { ...comp, props: { ...comp.props, ...updates } }
          : comp
      )
    );
  };

  const handleDeleteComponent = (componentId) => {
    setComponents(prev => prev.filter(comp => comp.id !== componentId));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !templateData.tags.includes(newTag.trim())) {
      setTemplateData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTemplateData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const generateContentFromComponents = () => {
    return components.map(component => {
      switch (component.type) {
        case 'heading':
          return component.props.text;
        case 'text':
          return component.props.text;
        case 'button':
          return `[BUTTON: ${component.props.text}]`;
        default:
          return '';
      }
    }).filter(Boolean).join(' ');
  };

  const handleSave = async () => {
    if (!templateData.name.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    if (!templateData.subject.trim()) {
      toast.error('Please enter an email subject');
      return;
    }
try {
      setSaving(true);
      
      const saveData = {
        ...templateData,
        content: generateContentFromComponents() || htmlContent || templateData.preview,
        structure: components,
        htmlContent: htmlContent,
        cssContent: cssContent,
        createdDate: new Date().toISOString()
      };

      if (id) {
        await templateService.update(parseInt(id), saveData);
        toast.success('Template updated successfully!');
      } else {
        await templateService.create(saveData);
        toast.success('Template created successfully!');
      }
      
      navigate('/templates');
    } catch (error) {
      toast.error('Failed to save template');
      console.error('Error saving template:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <DragDropProvider>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/templates')}
              icon="ArrowLeft"
            >
              Back to Templates
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? 'Edit Template' : 'Template Builder'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setActiveTab('preview')}
              icon="Eye"
            >
              Preview
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={saving}
              icon="Save"
            >
              {id ? 'Update Template' : 'Save Template'}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
<div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { key: 'builder', label: 'Visual Builder', icon: 'Layout' },
            { key: 'wysiwyg', label: 'Rich Text', icon: 'Edit3' },
            { key: 'html', label: 'HTML/CSS', icon: 'Code' },
            { key: 'preview', label: 'Preview', icon: 'Eye' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Template Settings Sidebar */}
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Template Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={templateData.name}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={templateData.category}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, category: e.target.value }))}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={templateData.subject}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Email subject line"
                  />
                </div>

                <div>
                  <Label htmlFor="sender">Sender Email</Label>
                  <Input
                    id="sender"
                    value={templateData.sender}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, sender: e.target.value }))}
                    placeholder="sender@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="preview">Preview Text</Label>
                  <textarea
                    id="preview"
                    value={templateData.preview}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, preview: e.target.value }))}
                    placeholder="Email preview text"
                    className="flex w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <select
                    id="difficulty"
                    value={templateData.difficulty}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button size="sm" onClick={handleAddTag} icon="Plus">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {templateData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 text-xs bg-primary/10 text-primary rounded"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <ApperIcon name="X" size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
{activeTab === 'builder' && (
              <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
                <div className="col-span-3">
                  <ComponentPalette />
                </div>
                <div className="col-span-9">
                  <TemplateCanvas
                    components={components}
                    onAddComponent={handleAddComponent}
                    onUpdateComponent={handleUpdateComponent}
                    onDeleteComponent={handleDeleteComponent}
                  />
                </div>
              </div>
            )}

{activeTab === 'wysiwyg' && (
              <WYSIWYGEditor
                content={htmlContent}
                onChange={setHtmlContent}
              />
            )}

            {activeTab === 'html' && (
              <div className="grid grid-cols-2 gap-6 h-[calc(100vh-200px)]">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ApperIcon name="Code" className="mr-2" />
                      HTML Editor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      className="w-full h-80 p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your HTML content here..."
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ApperIcon name="Palette" className="mr-2" />
                      CSS Styles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={cssContent}
                      onChange={(e) => setCssContent(e.target.value)}
                      className="w-full h-80 p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="/* Add your custom CSS styles here */
.email-container {
  max-width: 600px;
  margin: 0 auto;
}

.custom-button {
  background-color: #1E40AF;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
}"
                    />
                  </CardContent>
                </Card>
              </div>
            )}

{activeTab === 'preview' && (
              <TemplatePreview
                components={components}
                htmlContent={htmlContent}
                cssContent={cssContent}
                templateData={templateData}
                sampleEmployee={sampleEmployee}
              />
            )}
          </div>
        </div>
      </div>
    </DragDropProvider>
  );
}

export default TemplateBuilder;