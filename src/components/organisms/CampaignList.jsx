import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import campaignService from "@/services/api/campaignService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const navigate = useNavigate();

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await campaignService.getAll();
      setCampaigns(data);
      setFilteredCampaigns(data);
    } catch (err) {
      setError(err.message || "Failed to load campaigns");
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleSearch = (searchTerm) => {
    let filtered = campaigns;
    
    if (searchTerm) {
      filtered = filtered.filter(campaign => 
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter(campaign => campaign.status === selectedStatus);
    }
    
    setFilteredCampaigns(filtered);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    let filtered = campaigns;
    
    if (status !== "all") {
      filtered = filtered.filter(campaign => campaign.status === status);
    }
    
    setFilteredCampaigns(filtered);
  };

  const handleLaunchCampaign = async (campaignId) => {
    try {
      await campaignService.launch(campaignId);
      toast.success("Campaign launched successfully!");
      loadCampaigns();
    } catch (err) {
      toast.error(err.message || "Failed to launch campaign");
    }
  };

  const getMetricColor = (rate, type) => {
    if (type === "reportRate") {
      return rate >= 10 ? "text-green-600" : rate >= 5 ? "text-yellow-600" : "text-red-600";
    } else {
      return rate <= 20 ? "text-green-600" : rate <= 40 ? "text-yellow-600" : "text-red-600";
    }
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadCampaigns} />;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar 
          placeholder="Search campaigns..." 
          onSearch={handleSearch}
          className="flex-1"
        />
        <div className="flex gap-2">
          {["all", "draft", "scheduled", "active", "completed"].map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "primary" : "ghost"}
              size="sm"
              onClick={() => handleStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Campaign Grid */}
      {filteredCampaigns.length === 0 ? (
        <Empty
          icon="Mail"
          title="No campaigns found"
          description="Create your first phishing simulation campaign to get started."
          action={() => navigate("/campaigns/new")}
          actionLabel="Create Campaign"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <Card 
              key={campaign.Id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/campaigns/${campaign.Id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      {campaign.name}
                    </h3>
                    <StatusBadge status={campaign.status} />
                  </div>
                  <div className="ml-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Mail" className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target Groups:</span>
                    <span className="font-medium">{campaign.targetGroups.join(", ")}</span>
                  </div>
                  
                  {campaign.scheduledDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Scheduled:</span>
                      <span className="font-medium">
                        {format(new Date(campaign.scheduledDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}

                  {campaign.metrics.sent > 0 && (
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <div className={cn("text-lg font-bold", getMetricColor(campaign.metrics.openRate, "openRate"))}>
                          {campaign.metrics.openRate}%
                        </div>
                        <div className="text-xs text-gray-500">Opened</div>
                      </div>
                      <div className="text-center">
                        <div className={cn("text-lg font-bold", getMetricColor(campaign.metrics.clickRate, "clickRate"))}>
                          {campaign.metrics.clickRate}%
                        </div>
                        <div className="text-xs text-gray-500">Clicked</div>
                      </div>
                      <div className="text-center">
                        <div className={cn("text-lg font-bold", getMetricColor(campaign.metrics.reportRate, "reportRate"))}>
                          {campaign.metrics.reportRate}%
                        </div>
                        <div className="text-xs text-gray-500">Reported</div>
                      </div>
                    </div>
                  )}

                  {campaign.status === "scheduled" && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchCampaign(campaign.Id);
                      }}
                    >
                      Launch Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignList;