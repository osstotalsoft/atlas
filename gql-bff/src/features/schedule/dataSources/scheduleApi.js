const {
  NoCacheRESTDataSource,
} = require("../../../utils/noCacheRESTDataSource");
const { removeQuotes } = require("../../../utils/functions");

class ScheduleApi extends NoCacheRESTDataSource {
  constructor() {
    super();
    this.baseURL = removeQuotes(`${process.env.SCHEDULE_URL}`);
  }
  async getSchedule(name) {
    return this.get(`/schedule/${name}`);
  }

  async getSchedules() {
    return await this.get(`/schedule`);
  }

  async createSchedule(body) {
    return await this.post(`/schedule`, body, {
      headers: { "content-type": "application/json" },
    });
  }

  async updateSchedule(name, body) {
    return await this.put(`/schedule/${name}`, body, {
      headers: { "content-type": "application/json" },
    });
  }

  async deleteSchedule(name) {
    return await this.delete(`/schedule/${name}`);
  }
}

module.exports = ScheduleApi;
