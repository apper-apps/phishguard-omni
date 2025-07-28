import { useState, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import campaignService from "@/services/api/campaignService";
import simulationService from "@/services/api/simulationService";
import employeeService from "@/services/api/employeeService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecentActivity = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [campaigns, results, employees] = await Promise.all([
        campaignService.getAll(),
        simulationService.getAll(),
        employeeService.getAll()
      ]);

      // Create activity timeline from various sources
      const activityItems = [];

      // Add campaign activities
      campaigns.forEach(campaign => {
        if (campaign.status === "completed" && campaign.completedDate) {
          activityItems.push({
            id: `campaign-${campaign.Id}`,
            type: "campaign_completed",
            timestamp: campaign.completedDate,
            title: `Campaign "${campaign.name}" completed`,
            description: `${campaign.metrics.sent} emails sent, ${campaign.metrics.clicked} clicks, ${campaign.metrics.reported} reports`,
            icon: "CheckCircle",
            color: "green"
          });
        }
        
        if (campaign.status === "active") {
          activityItems.push({
            id: `campaign-active-${campaign.Id}`,
            type: "campaign_active",
            timestamp: campaign.scheduledDate,
            title: `Campaign "${campaign.name}" is running`,
            description: `Targeting ${campaign.targetGroups.join(", ")} departments`,
            icon: "Play",
            color: "blue"
          });
        }
      });

      // Add recent simulation results
      results.slice(-10).forEach(result => {
        const employee = employees.find(emp => emp.Id === result.employeeId);
        const campaign = campaigns.find(camp => camp.Id === result.campaignId);
        
        if (employee && campaign) {
          let activityType, description, icon, color;
          
          if (result.reported) {
            activityType = "phish_reported";
            description = `Correctly reported suspicious email`;
            icon = "Shield";
            color = "green";
          } else if (result.clicked) {
            activityType = "phish_clicked";
            description = `Clicked on phishing link - training assigned`;
            icon = "AlertTriangle";
            color = "red";
          } else if (result.opened) {
            activityType = "phish_opened";
            description = `Opened phishing email`;
            icon = "Mail";
            color = "yellow";
          }

          activityItems.push({
            id: `result-${result.Id}`,
            type: activityType,
            timestamp: result.timestamp,
            title: `${employee.name} ${activityType.replace("_", " ")}`,
            description: `Campaign: ${campaign.name} - ${description}`,
            icon,
            color,
            employee: employee.name,
            campaign: campaign.name
          });
        }
      });

      // Sort by timestamp (most recent first) and take last 15
      const sortedActivities = activityItems
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 15);

      setActivities(sortedActivities);
    } catch (err) {
      setError(err.message || "Failed to load recent activity");
      toast.error("Failed to load recent activity");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const getActivityColor = (color) => {
    switch (color) {
      case "green": return "text-green-600 bg-green-100";
      case "red": return "text-red-600 bg-red-100";
      case "blue": return "text-blue-600 bg-blue-100";
      case "yellow": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) return <Loading variant="skeleton" />;
  if (error) return <Error message={error} onRetry={loadRecentActivity} />;

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="Activity" className="w-5 h-5 mr-2 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <ApperIcon name="Inbox" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  getActivityColor(activity.color)
                )}>
                  <ApperIcon name={activity.icon} className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;