import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import campaignService from '@/services/api/campaignService';
import templateService from '@/services/api/templateService';
import employeeService from '@/services/api/employeeService';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import { cn } from '@/utils/cn';

const CampaignForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    templateId: '',
    customDomain: '',
    senderDomain: '',
    landingPageUrl: '',
    targetGroups: [],
    scheduledDate: '',
    description: ''
  });

  const steps = [
    { id: 1, title: 'Basic Info', icon: 'FileText' },
    { id: 2, title: 'Domain Settings', icon: 'Globe' },
    { id: 3, title: 'Template', icon: 'Mail' },
    { id: 4, title: 'Targets', icon: 'Users' },
    { id: 5, title: 'Schedule', icon: 'Calendar' }
  ];

  const presetDomains = [
    { name: 'Microsoft Office', domain: 'office365-updates.com', description: 'Mimics official Microsoft communications' },
    { name: 'Google Workspace', domain: 'googleworkspace-security.net', description: 'Appears as Google security alerts' },
    { name: 'IT Support', domain: 'company-itsupport.org', description: 'Internal IT support communications' },
    { name: 'HR Portal', domain: 'hr-employee-portal.com', description: 'Human resources notifications' },
    { name: 'Bank Security', domain: 'secure-banking-alerts.net', description: 'Financial institution security notices' },
    { name: 'Custom Domain', domain: 'custom', description: 'Configure your own domain' }
  ];

  const departmentGroups = [
    'Sales', 'Marketing', 'Engineering', 'IT', 'Finance', 
    'Accounting', 'HR', 'Operations', 'Executive', 'All Employees'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [templatesData, employeesData] = await Promise.all([
        templateService.getAll(),
        employeeService.getAll()
      ]);
      
      setTemplates(templatesData);
      setEmployees(employeesData);

      if (isEditing) {
        const campaign = await campaignService.getById(id);
        setFormData({
          name: campaign.name || '',
          templateId: campaign.templateId || '',
          customDomain: campaign.customDomain || '',
          senderDomain: campaign.senderDomain || '',
          landingPageUrl: campaign.landingPageUrl || '',
          targetGroups: campaign.targetGroups || [],
          scheduledDate: campaign.scheduledDate ? campaign.scheduledDate.slice(0, 16) : '',
          description: campaign.description || ''
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDomainSelect = (domain) => {
    if (domain === 'custom') {
      handleInputChange('customDomain', '');
      handleInputChange('senderDomain', '');
      handleInputChange('landingPageUrl', '');
    } else {
      handleInputChange('customDomain', domain);
      handleInputChange('senderDomain', `noreply@${domain}`);
      handleInputChange('landingPageUrl', `https://${domain}/security-update`);
    }
  };

  const handleTargetGroupToggle = (group) => {
    const currentGroups = formData.targetGroups;
    const updatedGroups = currentGroups.includes(group)
      ? currentGroups.filter(g => g !== group)
      : [...currentGroups, group];
    
    handleInputChange('targetGroups', updatedGroups);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '';
      case 2:
        return formData.customDomain.trim() !== '' && 
               formData.senderDomain.trim() !== '' && 
               formData.landingPageUrl.trim() !== '';
      case 3:
        return formData.templateId !== '';
      case 4:
        return formData.targetGroups.length > 0;
      case 5:
        return true; // Schedule is optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      toast.error('Please complete all required fields');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (asDraft = true) => {
    try {
      setLoading(true);
      
      const campaignData = {
        ...formData,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate).toISOString() : null,
        status: asDraft ? 'draft' : 'scheduled'
      };

      if (isEditing) {
        await campaignService.update(id, campaignData);
        toast.success('Campaign updated successfully!');
      } else {
        await campaignService.create(campaignData);
        toast.success(`Campaign ${asDraft ? 'saved as draft' : 'created and scheduled'}!`);
      }
      
      navigate('/campaigns');
    } catch (err) {
      toast.error(err.message || 'Failed to save campaign');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !templates.length) return <Loading />;
  if (error && !templates.length) return <Error message={error} onRetry={loadData} />;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <FormField label="Campaign Name" required>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter campaign name"
                className="w-full"
              />
            </FormField>
            
            <FormField label="Description">
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of this campaign"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="3"
              />
            </FormField>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-4 block">Choose Domain Configuration</Label>
              <div className="grid gap-4 md:grid-cols-2">
                {presetDomains.map((preset) => (
                  <Card
                    key={preset.domain}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      formData.customDomain === preset.domain && "ring-2 ring-primary bg-primary/5"
                    )}
                    onClick={() => handleDomainSelect(preset.domain)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <ApperIcon name="Globe" className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 mb-1">{preset.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{preset.description}</p>
                          {preset.domain !== 'custom' && (
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                              {preset.domain}
                            </code>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <FormField label="Custom Domain" required>
                <Input
                  value={formData.customDomain}
                  onChange={(e) => handleInputChange('customDomain', e.target.value)}
                  placeholder="example-phishing-domain.com"
                  className="w-full"
                />
              </FormField>
              
              <FormField label="Sender Email" required>
                <Input
                  value={formData.senderDomain}
                  onChange={(e) => handleInputChange('senderDomain', e.target.value)}
                  placeholder="noreply@example-domain.com"
                  className="w-full"
                />
              </FormField>
              
              <FormField label="Landing Page URL" required>
                <Input
                  value={formData.landingPageUrl}
                  onChange={(e) => handleInputChange('landingPageUrl', e.target.value)}
                  placeholder="https://example-domain.com/secure-login"
                  className="w-full"
                />
              </FormField>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-4 block">Select Email Template</Label>
              <div className="grid gap-4 md:grid-cols-2">
                {templates.map((template) => (
                  <Card
                    key={template.Id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      formData.templateId === template.Id && "ring-2 ring-primary bg-primary/5"
                    )}
                    onClick={() => handleInputChange('templateId', template.Id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ApperIcon name="Mail" className="w-4 h-4 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              template.difficulty === 'Easy' && "bg-green-100 text-green-700",
                              template.difficulty === 'Medium' && "bg-yellow-100 text-yellow-700",
                              template.difficulty === 'Hard' && "bg-red-100 text-red-700"
                            )}>
                              {template.difficulty}
                            </span>
                            <span className="text-xs text-gray-500">{template.category}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-4 block">Target Groups</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {departmentGroups.map((group) => (
                  <div
                    key={group}
                    className={cn(
                      "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all",
                      formData.targetGroups.includes(group) 
                        ? "border-primary bg-primary/5" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => handleTargetGroupToggle(group)}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center",
                      formData.targetGroups.includes(group) 
                        ? "border-primary bg-primary" 
                        : "border-gray-300"
                    )}>
                      {formData.targetGroups.includes(group) && (
                        <ApperIcon name="Check" className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{group}</span>
                    <span className="text-sm text-gray-500 ml-auto">
                      {group === 'All Employees' ? employees.length : 
                       employees.filter(emp => emp.department === group).length} employees
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <FormField label="Scheduled Launch Date (Optional)">
              <Input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-2">
                Leave empty to save as draft. You can schedule or launch manually later.
              </p>
            </FormField>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ApperIcon name="Info" className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Campaign Summary</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Domain:</strong> {formData.customDomain}</p>
                    <p><strong>Template:</strong> {templates.find(t => t.Id === formData.templateId)?.name || 'Not selected'}</p>
                    <p><strong>Targets:</strong> {formData.targetGroups.join(', ')}</p>
                    {formData.scheduledDate && (
                      <p><strong>Scheduled:</strong> {new Date(formData.scheduledDate).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/campaigns')}
          icon="ArrowLeft"
          className="text-gray-600"
        >
          Back to Campaigns
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Campaign' : 'Create New Campaign'}
          </h1>
          <p className="text-gray-600">Configure phishing simulation with custom domains</p>
        </div>
      </div>

      {/* Step Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                  currentStep >= step.id 
                    ? "border-primary bg-primary text-white" 
                    : "border-gray-300 text-gray-400"
                )}>
                  {currentStep > step.id ? (
                    <ApperIcon name="Check" className="w-5 h-5" />
                  ) : (
                    <ApperIcon name={step.icon} className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={cn(
                    "text-sm font-medium",
                    currentStep >= step.id ? "text-primary" : "text-gray-400"
                  )}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-12 h-0.5 mx-4",
                    currentStep > step.id ? "bg-primary" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              icon="ChevronLeft"
            >
              Previous
            </Button>

            <div className="flex items-center gap-3">
              {currentStep === steps.length ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleSubmit(false)}
                    disabled={loading || !formData.scheduledDate}
                  >
                    {loading ? 'Creating...' : 'Create & Schedule'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  icon="ChevronRight"
                  iconPosition="right"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignForm;