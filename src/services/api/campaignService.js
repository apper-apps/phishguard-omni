import campaignsData from "@/services/mockData/campaigns.json";

class CampaignService {
  constructor() {
    this.campaigns = [...campaignsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.campaigns];
  }

  async getById(id) {
    await this.delay(200);
    const campaign = this.campaigns.find(c => c.Id === parseInt(id));
    if (!campaign) {
      throw new Error("Campaign not found");
    }
    return { ...campaign };
  }

async create(campaignData) {
    await this.delay(400);
    const maxId = Math.max(...this.campaigns.map(c => c.Id), 0);
    const newCampaign = {
      Id: maxId + 1,
      ...campaignData,
      status: campaignData.status || "draft",
      customDomain: campaignData.customDomain || "",
      senderDomain: campaignData.senderDomain || "",
      landingPageUrl: campaignData.landingPageUrl || "",
      description: campaignData.description || "",
      createdDate: new Date().toISOString(),
      completedDate: null,
      metrics: {
        sent: 0,
        opened: 0,
        clicked: 0,
        reported: 0,
        openRate: 0,
        clickRate: 0,
        reportRate: 0
      }
    };
    this.campaigns.push(newCampaign);
    return { ...newCampaign };
  }

async update(id, updates) {
    await this.delay(350);
    const index = this.campaigns.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Campaign not found");
    }
    
    const updatedCampaign = {
      ...this.campaigns[index],
      ...updates,
      customDomain: updates.customDomain ?? this.campaigns[index].customDomain,
      senderDomain: updates.senderDomain ?? this.campaigns[index].senderDomain,
      landingPageUrl: updates.landingPageUrl ?? this.campaigns[index].landingPageUrl,
      description: updates.description ?? this.campaigns[index].description
    };
    
    this.campaigns[index] = updatedCampaign;
    return { ...updatedCampaign };
  }
  async delete(id) {
    await this.delay(250);
    const index = this.campaigns.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Campaign not found");
    }
    const deleted = this.campaigns.splice(index, 1)[0];
    return { ...deleted };
  }

  async launch(id) {
    await this.delay(500);
    const campaign = await this.getById(id);
    if (campaign.status !== "scheduled") {
      throw new Error("Campaign must be scheduled to launch");
    }
    return await this.update(id, { status: "active" });
  }

  async getMetrics() {
    await this.delay(200);
    const activeCampaigns = this.campaigns.filter(c => c.status === "active").length;
    const completedCampaigns = this.campaigns.filter(c => c.status === "completed").length;
    const totalSent = this.campaigns.reduce((sum, c) => sum + c.metrics.sent, 0);
    const totalClicked = this.campaigns.reduce((sum, c) => sum + c.metrics.clicked, 0);
    const totalReported = this.campaigns.reduce((sum, c) => sum + c.metrics.reported, 0);

    return {
      activeCampaigns,
      completedCampaigns,
      totalSent,
      totalClicked,
      totalReported,
      overallClickRate: totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : 0,
      overallReportRate: totalSent > 0 ? ((totalReported / totalSent) * 100).toFixed(1) : 0
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new CampaignService();