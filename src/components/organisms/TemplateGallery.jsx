import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import templateService from "@/services/api/templateService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TemplateGallery = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await templateService.getAll();
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (err) {
      setError(err.message || "Failed to load templates");
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const categories = [...new Set(templates.map(template => template.category))];

  const handleSearch = (searchTerm) => {
    let filtered = templates;
    
    if (searchTerm) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }
    
    setFilteredTemplates(filtered);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    let filtered = templates;
    
    if (category !== "all") {
      filtered = filtered.filter(template => template.category === category);
    }
    
    setFilteredTemplates(filtered);
  };

  const getDifficultyVariant = (difficulty) => {
    switch (difficulty) {
      case "easy": return "success";
      case "medium": return "warning";
      case "hard": return "danger";
      default: return "default";
    }
  };

const handleUseTemplate = (template) => {
    navigate("/campaigns/new", { state: { selectedTemplate: template } });
  };

  const handleEditTemplate = (template) => {
    navigate(`/templates/builder/${template.Id}`);
  };
  const TemplatePreviewModal = ({ template, onClose }) => {
    if (!template) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div 
            className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Template Preview</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="default">{template.category}</Badge>
                  <Badge variant={getDifficultyVariant(template.difficulty)}>
                    {template.difficulty}
                  </Badge>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">From:</span>
                    <div className="text-sm text-gray-900">{template.sender}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Subject:</span>
                    <div className="text-sm text-gray-900 font-medium">{template.subject}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Content:</span>
                    <div className="text-sm text-gray-900 mt-1 p-3 bg-white border rounded">
                      {template.content}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={() => handleUseTemplate(template)}>
                  Use Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <Loading variant="skeleton" />;
  if (error) return <Error message={error} onRetry={loadTemplates} />;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar 
          placeholder="Search templates..." 
          onSearch={handleSearch}
          className="flex-1"
        />
        <div className="flex gap-2 overflow-x-auto">
          <Button
            variant={selectedCategory === "all" ? "primary" : "ghost"}
            size="sm"
            onClick={() => handleCategoryFilter("all")}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "primary" : "ghost"}
              size="sm"
              onClick={() => handleCategoryFilter(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      {filteredTemplates.length === 0 ? (
        <Empty
          icon="FileText"
          title="No templates found"
          description="Create your first phishing email template to get started."
          action={() => navigate("/templates/new")}
          actionLabel="Create Template"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.Id} 
              className="hover:shadow-lg transition-all duration-300 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base mb-2 group-hover:text-primary transition-colors">
                      {template.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="text-xs">
                        {template.category}
                      </Badge>
                      <Badge variant={getDifficultyVariant(template.difficulty)} className="text-xs">
                        {template.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Mail" className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">Subject:</div>
                    <div className="text-sm text-gray-900 font-medium line-clamp-2">
                      {template.subject}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">Preview:</div>
                    <div className="text-sm text-gray-700 line-clamp-3">
                      {template.preview || template.content}
                    </div>
                  </div>

                  {template.tags && (
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{template.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

<div className="flex space-x-1 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditTemplate(template)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleUseTemplate(template)}
                    >
                      Use
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Template Preview Modal */}
      <TemplatePreviewModal 
        template={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />
    </div>
  );
};

export default TemplateGallery;