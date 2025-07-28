import DashboardMetrics from "@/components/organisms/DashboardMetrics";
import CampaignChart from "@/components/organisms/CampaignChart";
import RecentActivity from "@/components/organisms/RecentActivity";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Metrics Overview */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Security Overview</h2>
          <p className="text-gray-600 mt-1">Monitor your organization's security posture and campaign performance</p>
        </div>
        <DashboardMetrics />
      </section>

      {/* Charts and Activity */}
      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CampaignChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;