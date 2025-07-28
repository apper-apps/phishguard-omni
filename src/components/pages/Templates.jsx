import { useNavigate } from "react-router-dom";
import TemplateGallery from "@/components/organisms/TemplateGallery";
import Button from "@/components/atoms/Button";

const Templates = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600 mt-1">Browse and customize phishing email templates for your campaigns</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate("/templates/new")}
          icon="Plus"
        >
          Create Template
        </Button>
      </div>

      <TemplateGallery />
    </div>
  );
};

export default Templates;