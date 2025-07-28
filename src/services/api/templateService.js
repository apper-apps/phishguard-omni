import templatesData from "@/services/mockData/templates.json";

class TemplateService {
  constructor() {
    this.templates = [...templatesData];
  }

  async getAll() {
    await this.delay(200);
    return [...this.templates];
  }

  async getById(id) {
    await this.delay(150);
    const template = this.templates.find(t => t.Id === parseInt(id));
    if (!template) {
      throw new Error("Template not found");
    }
    return { ...template };
  }

  async create(templateData) {
    await this.delay(300);
    const maxId = Math.max(...this.templates.map(t => t.Id), 0);
    const newTemplate = {
      Id: maxId + 1,
      ...templateData,
      createdDate: new Date().toISOString()
    };
    this.templates.push(newTemplate);
    return { ...newTemplate };
  }

  async update(id, updates) {
    await this.delay(250);
    const index = this.templates.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Template not found");
    }
    this.templates[index] = { ...this.templates[index], ...updates };
    return { ...this.templates[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.templates.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Template not found");
    }
    const deleted = this.templates.splice(index, 1)[0];
    return { ...deleted };
  }

  async getByCategory(category) {
    await this.delay(150);
    return this.templates.filter(t => t.category === category);
  }

  async getCategories() {
    await this.delay(100);
    const categories = [...new Set(this.templates.map(t => t.category))];
    return categories.sort();
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new TemplateService();