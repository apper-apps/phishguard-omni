import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import Chart from "react-apexcharts";
import campaignService from "@/services/api/campaignService";
import employeeService from "@/services/api/employeeService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Reports = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("30");

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [campaignData, employeeData] = await Promise.all([
        campaignService.getAll(),
        employeeService.getAll()
      ]);
      
      setCampaigns(campaignData);
      setEmployees(employeeData);
    } catch (err) {
      setError(err.message || "Failed to load report data");
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const generateRiskScoreChart = () => {
    const riskBuckets = {
      "Low Risk (80-100)": employees.filter(e => e.riskScore >= 80).length,
      "Medium Risk (60-79)": employees.filter(e => e.riskScore >= 60 && e.riskScore < 80).length,
      "High Risk (0-59)": employees.filter(e => e.riskScore < 60).length
    };

    return {
      options: {
        chart: {
          type: "donut",
          toolbar: { show: false }
        },
        colors: ["#10B981", "#F59E0B", "#EF4444"],
        labels: Object.keys(riskBuckets),
        legend: {
          position: "bottom"
        },
        plotOptions: {
          pie: {
            donut: {
              size: "60%"
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return Math.round(val) + "%";
          }
        }
      },
      series: Object.values(riskBuckets)
    };
  };

  const generateDepartmentChart = () => {
    const deptStats = {};
    employees.forEach(emp => {
      if (!deptStats[emp.department]) {
        deptStats[emp.department] = { total: 0, highRisk: 0 };
      }
      deptStats[emp.department].total++;
      if (emp.riskScore < 60) {
        deptStats[emp.department].highRisk++;
      }
    });

    const departments = Object.keys(deptStats);
    const totalCounts = departments.map(dept => deptStats[dept].total);
    const riskCounts = departments.map(dept => deptStats[dept].highRisk);

    return {
      options: {
        chart: {
          type: "bar",
          toolbar: { show: false }
        },
        colors: ["#3B82F6", "#EF4444"],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "70%",
            borderRadius: 4
          }
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: departments,
          labels: {
            style: { fontSize: "12px" }
          }
        },
        yaxis: {
          title: { text: "Number of Employees" }
        },
        legend: {
          position: "top"
        }
      },
      series: [
        {
          name: "Total Employees",
          data: totalCounts
        },
        {
          name: "High Risk",
          data: riskCounts
        }
      ]
    };
  };

  const completedCampaigns = campaigns.filter(c => c.status === "completed");
  const averageClickRate = completedCampaigns.length > 0 ? 
    (completedCampaigns.reduce((sum, c) => sum + parseFloat(c.metrics.clickRate), 0) / completedCampaigns.length).toFixed(1) : 0;
  const averageReportRate = completedCampaigns.length > 0 ? 
    (completedCampaigns.reduce((sum, c) => sum + parseFloat(c.metrics.reportRate), 0) / completedCampaigns.length).toFixed(1) : 0;

  const exportReport = () => {
    const reportData = {
      generated: new Date().toISOString(),
      summary: {
        totalEmployees: employees.length,
        totalCampaigns: campaigns.length,
        completedCampaigns: completedCampaigns.length,
        averageClickRate,
        averageReportRate
      },
      campaigns: completedCampaigns,
      employees: employees
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `phishing-report-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Report exported successfully");
  };

  if (loading) return <Loading variant="skeleton" />;
  if (error) return <Error message={error} onRetry={loadReportData} />;

  const riskChart = generateRiskScoreChart();
  const deptChart = generateDepartmentChart();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your security training program</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <Button
            variant="outline"
            onClick={exportReport}
            icon="Download"
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mr-4">
                <ApperIcon name="Users" className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-green-200 rounded-lg flex items-center justify-center mr-4">
                <ApperIcon name="Mail" className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Campaigns Run</p>
                <p className="text-3xl font-bold text-gray-900">{completedCampaigns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-warning/20 rounded-lg flex items-center justify-center mr-4">
                <ApperIcon name="MousePointer" className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Click Rate</p>
                <p className="text-3xl font-bold text-gray-900">{averageClickRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-accent/20 rounded-lg flex items-center justify-center mr-4">
                <ApperIcon name="Shield" className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Report Rate</p>
                <p className="text-3xl font-bold text-gray-900">{averageReportRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Chart
                options={riskChart.options}
                series={riskChart.series}
                type="donut"
                height="100%"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Chart
                options={deptChart.options}
                series={deptChart.series}
                type="bar"
                height="100%"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-surface">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opened
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reported
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.slice(0, 10).map((campaign) => (
                  <tr key={campaign.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {campaign.targetGroups.join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={
                          campaign.status === "completed" ? "success" :
                          campaign.status === "active" ? "warning" :
                          campaign.status === "scheduled" ? "info" : "default"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.metrics.sent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.metrics.opened} ({campaign.metrics.openRate}%)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.metrics.clicked} ({campaign.metrics.clickRate}%)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.metrics.reported} ({campaign.metrics.reportRate}%)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={cn(
                        "text-sm font-medium",
                        parseFloat(campaign.metrics.reportRate) >= 10 ? "text-green-600" :
                        parseFloat(campaign.metrics.reportRate) >= 5 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {campaign.metrics.reportRate}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;