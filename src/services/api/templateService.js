class TemplateService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'template';
    
    // Define updateable fields based on Tables & Fields JSON
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'category', 'subject', 
      'content', 'difficulty', 'sender', 'preview'
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "category" } },
          { field: { Name: "subject" } },
          { field: { Name: "content" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "sender" } },
          { field: { Name: "preview" } }
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
        console.error("Error fetching templates:", error?.response?.data?.message);
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
        console.error(`Error fetching template with ID ${id}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async create(templateData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (templateData[field] !== undefined) {
          filteredData[field] = templateData[field];
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
          console.error(`Failed to create templates ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating template:", error.response.data.message);
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
          console.error(`Failed to update templates ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error updating template:", error.response.data.message);
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
          console.error(`Failed to delete templates ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return response.results.filter(result => result.success).length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting template:", error.response.data.message);
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async getByCategory(category) {
    try {
      const params = {
        fields: this.updateableFields.map(field => ({ field: { Name: field } })),
        where: [
          {
            FieldName: "category",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching templates by category:", error.message);
      throw error;
    }
  }

  async getCategories() {
    try {
      const allTemplates = await this.getAll();
      const categories = [...new Set(allTemplates.map(t => t.category))];
      return categories.sort();
    } catch (error) {
      console.error("Error getting template categories:", error.message);
      throw error;
    }
  }
}

export default new TemplateService();