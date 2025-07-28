class CampaignService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'campaign';
    
    // Define updateable fields based on Tables & Fields JSON
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'templateId', 'status', 'scheduledDate',
      'targetGroups', 'metrics', 'createdDate', 'completedDate',
      'customDomain', 'senderDomain', 'landingPageUrl', 'description'
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "templateId" } },
          { field: { Name: "status" } },
          { field: { Name: "scheduledDate" } },
          { field: { Name: "targetGroups" } },
          { field: { Name: "metrics" } },
          { field: { Name: "createdDate" } },
          { field: { Name: "completedDate" } },
          { field: { Name: "customDomain" } },
          { field: { Name: "senderDomain" } },
          { field: { Name: "landingPageUrl" } },
          { field: { Name: "description" } }
        ],
        orderBy: [{ fieldName: "createdDate", sorttype: "DESC" }],
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
        console.error("Error fetching campaigns:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.updateableFields.map(field => ({ field: { Name: field } }))
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching campaign with ID ${id}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async create(campaignData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (campaignData[field] !== undefined) {
          filteredData[field] = campaignData[field];
        }
      });

      // Set defaults for required fields
      filteredData.status = filteredData.status || "draft";
      filteredData.createdDate = new Date().toISOString();
      filteredData.metrics = filteredData.metrics || JSON.stringify({
        sent: 0, opened: 0, clicked: 0, reported: 0,
        openRate: 0, clickRate: 0, reportRate: 0
      });

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
          console.error(`Failed to create campaigns ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating campaign:", error.response.data.message);
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Filter to only include updateable fields
      const filteredUpdates = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      });

      const params = {
        records: [filteredUpdates]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update campaigns ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error updating campaign:", error.response.data.message);
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete campaigns ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return response.results.filter(result => result.success).length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting campaign:", error.response.data.message);
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async launch(id) {
    try {
      const campaign = await this.getById(id);
      if (campaign.status !== "scheduled") {
        throw new Error("Campaign must be scheduled to launch");
      }
      return await this.update(id, { status: "active" });
    } catch (error) {
      console.error("Error launching campaign:", error.message);
      throw error;
    }
  }

  async getMetrics() {
    try {
      const allCampaigns = await this.getAll();
      
      const activeCampaigns = allCampaigns.filter(c => c.status === "active").length;
      const completedCampaigns = allCampaigns.filter(c => c.status === "completed").length;
      
      let totalSent = 0;
      let totalClicked = 0;
      let totalReported = 0;
// Helper function to create default metrics structure
      const createDefaultMetrics = () => ({
        sent: 0,
        opened: 0,
        clicked: 0,
        reported: 0,
        openRate: 0,
        clickRate: 0,
        reportRate: 0
      });

      // Helper function to validate metrics structure
      const isValidMetrics = (metrics) => {
        return metrics && 
               typeof metrics === 'object' && 
               typeof metrics.sent === 'number' &&
               typeof metrics.clicked === 'number' &&
               typeof metrics.reported === 'number';
      };

      allCampaigns.forEach(campaign => {
        let metrics = null;
        
        // Handle both string and object formats safely
        if (typeof campaign.metrics === 'string') {
          try {
            const parsed = JSON.parse(campaign.metrics);
            metrics = isValidMetrics(parsed) ? parsed : createDefaultMetrics();
          } catch (error) {
            console.error(`Error parsing campaign metrics JSON for campaign ${campaign.Id || 'unknown'}:`, error);
            console.error(`Problematic metrics data:`, campaign.metrics);
            metrics = createDefaultMetrics();
          }
        } else if (typeof campaign.metrics === 'object' && campaign.metrics !== null) {
          metrics = isValidMetrics(campaign.metrics) ? campaign.metrics : createDefaultMetrics();
        } else {
          metrics = createDefaultMetrics();
        }
        
        // Always use valid metrics (never null)
        totalSent += metrics.sent || 0;
        totalClicked += metrics.clicked || 0;
        totalReported += metrics.reported || 0;
      });

      return {
        activeCampaigns,
        completedCampaigns,
        totalSent,
        totalClicked,
        totalReported,
        overallClickRate: totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : 0,
        overallReportRate: totalSent > 0 ? ((totalReported / totalSent) * 100).toFixed(1) : 0
      };
    } catch (error) {
      console.error("Error getting campaign metrics:", error.message);
      throw error;
    }
  }
}

export default new CampaignService();