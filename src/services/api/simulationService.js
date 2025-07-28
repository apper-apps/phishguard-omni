class SimulationService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'simulation_result';
    
    // Define updateable fields based on Tables & Fields JSON
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'campaignId', 'employeeId',
      'opened', 'clicked', 'reported', 'timestamp', 'ipAddress', 'userAgent'
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "campaignId" } },
          { field: { Name: "employeeId" } },
          { field: { Name: "opened" } },
          { field: { Name: "clicked" } },
          { field: { Name: "reported" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "ipAddress" } },
          { field: { Name: "userAgent" } }
        ],
        orderBy: [{ fieldName: "timestamp", sorttype: "DESC" }],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching simulation results:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async getByCampaign(campaignId) {
    try {
      const params = {
        fields: this.updateableFields.map(field => ({ field: { Name: field } })),
        where: [
          {
            FieldName: "campaignId",
            Operator: "EqualTo",
            Values: [parseInt(campaignId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching simulation results by campaign:", error.message);
      throw error;
    }
  }

  async getByEmployee(employeeId) {
    try {
      const params = {
        fields: this.updateableFields.map(field => ({ field: { Name: field } })),
        where: [
          {
            FieldName: "employeeId",
            Operator: "EqualTo",  
            Values: [parseInt(employeeId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching simulation results by employee:", error.message);
      throw error;
    }
  }

  async create(resultData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (resultData[field] !== undefined) {
          filteredData[field] = resultData[field];
        }
      });

      // Set timestamp if not provided
      filteredData.timestamp = filteredData.timestamp || new Date().toISOString();

      const params = {
        records: [filteredData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create simulation results ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating simulation result:", error.response.data.message);
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async getCampaignStatistics(campaignId) {
    try {
      const campaignResults = await this.getByCampaign(campaignId);
      
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
    } catch (error) {
      console.error("Error getting campaign statistics:", error.message);
      throw error;
    }
  }

  async getTimelineData(campaignId) {
    try {
      const campaignResults = await this.getByCampaign(campaignId);
      
      // Sort by timestamp
      const sortedResults = campaignResults.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );

      const timeline = [];
      let openedCount = 0;
      let clickedCount = 0;
      let reportedCount = 0;

      sortedResults.forEach(result => {
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
    } catch (error) {
      console.error("Error getting timeline data:", error.message);
      throw error;
    }
  }
}

export default new SimulationService();