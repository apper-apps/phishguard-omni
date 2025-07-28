import simulationData from "@/services/mockData/simulationResults.json";

class SimulationService {
  constructor() {
    this.results = [...simulationData];
  }

  async getAll() {
    await this.delay(200);
    return [...this.results];
  }

  async getByCampaign(campaignId) {
    await this.delay(150);
    return this.results.filter(r => r.campaignId === parseInt(campaignId));
  }

  async getByEmployee(employeeId) {
    await this.delay(150);
    return this.results.filter(r => r.employeeId === parseInt(employeeId));
  }

  async create(resultData) {
    await this.delay(200);
    const maxId = Math.max(...this.results.map(r => r.Id), 0);
    const newResult = {
      Id: maxId + 1,
      ...resultData,
      timestamp: new Date().toISOString()
    };
    this.results.push(newResult);
    return { ...newResult };
  }

  async getCampaignStatistics(campaignId) {
    await this.delay(200);
    const campaignResults = this.results.filter(r => r.campaignId === parseInt(campaignId));
    
    const opened = campaignResults.filter(r => r.opened).length;
    const clicked = campaignResults.filter(r => r.clicked).length;
    const reported = campaignResults.filter(r => r.reported).length;
    const total = campaignResults.length;

    return {
      total,
      opened,
      clicked,
      reported,
      openRate: total > 0 ? ((opened / total) * 100).toFixed(1) : 0,
      clickRate: total > 0 ? ((clicked / total) * 100).toFixed(1) : 0,
      reportRate: total > 0 ? ((reported / total) * 100).toFixed(1) : 0
    };
  }

  async getTimelineData(campaignId) {
    await this.delay(200);
    const campaignResults = this.results
      .filter(r => r.campaignId === parseInt(campaignId))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const timeline = [];
    let openedCount = 0;
    let clickedCount = 0;
    let reportedCount = 0;

    campaignResults.forEach(result => {
      if (result.opened) openedCount++;
      if (result.clicked) clickedCount++;
      if (result.reported) reportedCount++;

      timeline.push({
        timestamp: result.timestamp,
        opened: openedCount,
        clicked: clickedCount,
        reported: reportedCount
      });
    });

    return timeline;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new SimulationService();