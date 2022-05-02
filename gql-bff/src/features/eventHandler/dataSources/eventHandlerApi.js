const ConductorApi = require("../../../utils/conductorApi");

class EventHandlerApi extends ConductorApi {
  async getEventHandler({ name, event, activeOnly }) {
    const eventHandlers = await this.get(
      `/api/event/${event}?activeOnly=${activeOnly}`
    );
    return eventHandlers?.find((h) => h.name === name);
  }

  async getEventHandlerList() {
    return await this.get(`/api/event`);
  }

  async getWorkflow(name) {
    return await this.get(`/api/metadata/workflow/${name}`);
  }

  async createEventHandler(body) {
    return await this.post(`/api/event`, body, {
      headers: { "content-type": "application/json" },
    });
  }

  async editEventHandler(body) {
    return await this.put(`/api/event`, body, {
      headers: { "content-type": "application/json" },
    });
  }
}

module.exports = EventHandlerApi;
