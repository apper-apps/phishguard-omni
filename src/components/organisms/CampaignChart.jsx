import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import campaignService from "@/services/api/campaignService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CampaignChart = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState("success_rates");

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await campaignService.getAll();
      // Only show completed campaigns with metrics
      const completedCampaigns = data.filter(c => c.status === "completed" && c.metrics.sent > 0);
      setCampaigns(completedCampaigns);
    } catch (err) {
      setError(err.message || "Failed to load campaign data");
      toast.error("Failed to load campaign chart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  if (loading) return <Loading variant="skeleton" />;
  if (error) return <Error message={error} onRetry={loadCampaigns} />;

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="BarChart3" className="w-5 h-5 mr-2 text-primary" />
            Campaign Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No completed campaigns to display</p>
            <p className="text-sm mt-1">Run some campaigns to see performance metrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getChartData = () => {
    if (chartType === "success_rates") {
      return {
        options: {
          chart: {
            type: "bar",
            toolbar: { show: false },
            background: "transparent"
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "60%",
              borderRadius: 8
            }
          },
          colors: ["#10B981", "#F59E0B", "#EF4444"],
          dataLabels: { enabled: false },
          stroke: { show: true, width: 2, colors: ["transparent"] },
          xaxis: {
            categories: campaigns.map(c => c.name.length > 15 ? c.name.substring(0, 15) + "..." : c.name),
            labels: {
              style: { fontSize: "12px" }
            }
          },
          yaxis: {
            title: { text: "Percentage (%)" },
            max: 100
          },
          fill: { opacity: 1 },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + "%";
              }
            }
          },
          legend: {
            position: "top",
            horizontalAlign: "right"
          }
        },
        series: [
          {
            name: "Report Rate",
            data: campaigns.map(c => parseFloat(c.metrics.reportRate))
          },
          {
            name: "Open Rate", 
            data: campaigns.map(c => parseFloat(c.metrics.openRate))
          },
          {
            name: "Click Rate",
            data: campaigns.map(c => parseFloat(c.metrics.clickRate))
          }
        ]
      };
    } else {
      // Volume chart
      return {
        options: {
          chart: {
            type: "line",
            toolbar: { show: false },
            background: "transparent"
          },
          colors: ["#1E40AF", "#3B82F6", "#10B981"],
          stroke: {
            width: 3,
            curve: "smooth"
          },
          xaxis: {
            categories: campaigns.map(c => c.name.length > 15 ? c.name.substring(0, 15) + "..." : c.name),
            labels: {
              style: { fontSize: "12px" }
            }
          },
          yaxis: {
            title: { text: "Number of Emails" }
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + " emails";
              }
            }
          },
          legend: {
            position: "top",
            horizontalAlign: "right"
          },
          markers: {
            size: 6,
            hover: { size: 8 }
          }
        },
        series: [
          {
            name: "Sent",
            data: campaigns.map(c => c.metrics.sent)
          },
          {
            name: "Opened",
            data: campaigns.map(c => c.metrics.opened)
          },
          {
            name: "Clicked",
            data: campaigns.map(c => c.metrics.clicked)
          }
        ]
      };
    }
  };

  const chartData = getChartData();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <ApperIcon name="BarChart3" className="w-5 h-5 mr-2 text-primary" />
            Campaign Performance
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={chartType === "success_rates" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setChartType("success_rates")}
            >
              Success Rates
            </Button>
            <Button
              variant={chartType === "volume" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setChartType("volume")}
            >
              Volume
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type={chartType === "success_rates" ? "bar" : "line"}
            height="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignChart;