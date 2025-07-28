import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import campaignService from "@/services/api/campaignService";
import employeeService from "@/services/api/employeeService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import StatCard from "@/components/molecules/StatCard";

const DashboardMetrics = () => {
  const [campaignMetrics, setCampaignMetrics] = useState(null);
  const [employeeMetrics, setEmployeeMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [campaignData, employeeData] = await Promise.all([
        campaignService.getMetrics(),
        employeeService.getRiskStatistics()
      ]);
      
      setCampaignMetrics(campaignData);
      setEmployeeMetrics(employeeData);
    } catch (err) {
      setError(err.message || "Failed to load metrics");
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (loading) return <Loading variant="skeleton" />;
  if (error) return <Error message={error} onRetry={loadMetrics} />;

  const securityPosture = employeeMetrics ? 
    Math.round((employeeMetrics.lowRisk / employeeMetrics.total) * 100) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Campaigns"
        value={campaignMetrics?.activeCampaigns || 0}
        change="+2 this week"
        changeType="positive"
        icon="Mail"
        trend="up"
      />

      <StatCard
        title="Overall Click Rate"
        value={`${campaignMetrics?.overallClickRate || 0}%`}
        change="-5.2% from last month"
        changeType="positive"
        icon="MousePointer"
        trend="down"
      />

      <StatCard
        title="Report Rate"
        value={`${campaignMetrics?.overallReportRate || 0}%`}
        change="+2.1% from last month"
        changeType="positive"
        icon="Shield"
        trend="up"
      />

      <StatCard
        title="Security Posture"
        value={`${securityPosture}%`}
        change={`${employeeMetrics?.lowRisk || 0} low-risk employees`}
        changeType={securityPosture >= 70 ? "positive" : securityPosture >= 50 ? "neutral" : "negative"}
        icon="TrendingUp"
        trend={securityPosture >= 70 ? "up" : "down"}
      />

      <StatCard
        title="High-Risk Employees"
        value={employeeMetrics?.highRisk || 0}
        change="Need training"
        changeType={employeeMetrics?.highRisk > 5 ? "negative" : "positive"}
        icon="AlertTriangle"
        trend={employeeMetrics?.highRisk > 5 ? "up" : "down"}
      />

      <StatCard
        title="Training Completed"
        value={`${Math.round(((employeeMetrics?.trainingCompleted || 0) / (employeeMetrics?.total || 1)) * 100)}%`}
        change={`${employeeMetrics?.trainingCompleted || 0} of ${employeeMetrics?.total || 0} employees`}
        changeType="positive"
        icon="BookOpen"
        trend="up"
      />

      <StatCard
        title="Total Employees"
        value={employeeMetrics?.total || 0}
        change="Across all departments"
        changeType="neutral"
        icon="Users"
      />

      <StatCard
        title="Emails Sent"
        value={campaignMetrics?.totalSent?.toLocaleString() || "0"}
        change="All-time total"
        changeType="neutral"
        icon="Send"
      />
    </div>
  );
};

export default DashboardMetrics;