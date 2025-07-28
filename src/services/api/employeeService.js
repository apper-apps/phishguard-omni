import employeesData from "@/services/mockData/employees.json";

class EmployeeService {
  constructor() {
    this.employees = [...employeesData];
  }

  async getAll() {
    await this.delay(250);
    return [...this.employees];
  }

  async getById(id) {
    await this.delay(200);
    const employee = this.employees.find(e => e.Id === parseInt(id));
    if (!employee) {
      throw new Error("Employee not found");
    }
    return { ...employee };
  }

  async create(employeeData) {
    await this.delay(300);
    const maxId = Math.max(...this.employees.map(e => e.Id), 0);
    const newEmployee = {
      Id: maxId + 1,
      ...employeeData,
      riskScore: 50,
      campaignHistory: [],
      lastActivity: null,
      trainingCompleted: false
    };
    this.employees.push(newEmployee);
    return { ...newEmployee };
  }

  async update(id, updates) {
    await this.delay(250);
    const index = this.employees.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    this.employees[index] = { ...this.employees[index], ...updates };
    return { ...this.employees[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.employees.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    const deleted = this.employees.splice(index, 1)[0];
    return { ...deleted };
  }

  async bulkImport(csvData) {
    await this.delay(800);
    // Simulate CSV parsing and validation
    const importedCount = Math.floor(Math.random() * 50) + 10;
    return {
      imported: importedCount,
      errors: Math.floor(importedCount * 0.1),
      duplicates: Math.floor(importedCount * 0.05)
    };
  }

  async getByDepartment(department) {
    await this.delay(200);
    return this.employees.filter(e => e.department === department);
  }

  async getRiskStatistics() {
    await this.delay(200);
    const lowRisk = this.employees.filter(e => e.riskScore >= 80).length;
    const mediumRisk = this.employees.filter(e => e.riskScore >= 60 && e.riskScore < 80).length;
    const highRisk = this.employees.filter(e => e.riskScore < 60).length;
    const trainingCompleted = this.employees.filter(e => e.trainingCompleted).length;

    return {
      total: this.employees.length,
      lowRisk,
      mediumRisk,
      highRisk,
      trainingCompleted,
      averageRiskScore: Math.round(this.employees.reduce((sum, e) => sum + e.riskScore, 0) / this.employees.length)
    };
  }

  async assignTraining(employeeIds, trainingModule) {
    await this.delay(400);
    const updated = [];
    employeeIds.forEach(id => {
      const index = this.employees.findIndex(e => e.Id === parseInt(id));
      if (index !== -1) {
        this.employees[index].trainingAssigned = trainingModule;
        this.employees[index].trainingAssignedDate = new Date().toISOString();
        updated.push(this.employees[index]);
      }
    });
    return updated;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new EmployeeService();