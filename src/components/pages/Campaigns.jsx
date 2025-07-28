import { useNavigate } from "react-router-dom";
import CampaignList from "@/components/organisms/CampaignList";
import Button from "@/components/atoms/Button";

const Campaigns = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Create and manage phishing simulation campaigns</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate("/campaigns/new")}
          icon="Plus"
        >
          New Campaign
        </Button>
      </div>

      <CampaignList />
    </div>
  );
};

export default Campaigns;