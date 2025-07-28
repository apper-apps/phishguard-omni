class EmployeeService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'employee';
    
    // Define updateable fields based on Tables & Fields JSON
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'email', 'department', 
      'riskScore', 'campaignHistory', 'lastActivity', 'trainingCompleted'
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "email" } },
          { field: { Name: "department" } },
          { field: { Name: "riskScore" } },
          { field: { Name: "campaignHistory" } },
          { field: { Name: "lastActivity" } },
          { field: { Name: "trainingCompleted" } }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }],
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
        console.error("Error fetching employees:", error?.response?.data?.message);
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
        console.error(`Error fetching employee with ID ${id}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async create(employeeData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (employeeData[field] !== undefined) {
          filteredData[field] = employeeData[field];
        }
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
          console.error(`Failed to create employees ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating employee:", error.response.data.message);
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
          console.error(`Failed to update employees ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error updating employee:", error.response.data.message);
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
          console.error(`Failed to delete employees ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return response.results.filter(result => result.success).length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting employee:", error.response.data.message);
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async getByDepartment(department) {
    try {
      const params = {
        fields: this.updateableFields.map(field => ({ field: { Name: field } })),
        where: [
          {
            FieldName: "department",
            Operator: "EqualTo",
            Values: [department]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees by department:", error.message);
      throw error;
    }
  }

  async getRiskStatistics() {
    try {
      const allEmployees = await this.getAll();
      
      const lowRisk = allEmployees.filter(e => e.riskScore >= 80).length;
      const mediumRisk = allEmployees.filter(e => e.riskScore >= 60 && e.riskScore < 80).length;
      const highRisk = allEmployees.filter(e => e.riskScore < 60).length;
      const trainingCompleted = allEmployees.filter(e => e.trainingCompleted).length;

      return {
        total: allEmployees.length,
        lowRisk,
        mediumRisk,
        highRisk,
        trainingCompleted,
        averageRiskScore: allEmployees.length > 0 ? 
          Math.round(allEmployees.reduce((sum, e) => sum + (e.riskScore || 0), 0) / allEmployees.length) : 0
      };
    } catch (error) {
      console.error("Error getting risk statistics:", error.message);
      throw error;
    }
  }

  async assignTraining(employeeIds, trainingModule) {
    try {
      const updatePromises = employeeIds.map(id => 
        this.update(parseInt(id), {
          trainingAssigned: trainingModule,
          trainingAssignedDate: new Date().toISOString()
        })
      );

      const results = await Promise.all(updatePromises);
      return results.filter(result => result !== null);
    } catch (error) {
      console.error("Error assigning training:", error.message);
      throw error;
    }
  }

  async bulkImport(csvData) {
    // This would typically parse CSV and create multiple records
    // For now, return a simulated response
    return {
      imported: 0,
      errors: 0,
      duplicates: 0
    };
  }
}

export default new EmployeeService();