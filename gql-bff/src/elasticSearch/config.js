const settings = {
  index: {
    number_of_shards: "5",
    number_of_replicas: "0",
  },
};
module.exports = {
  snapshots_body: {
    settings,
    mappings: {
      properties: {
        timeStamp: {
          type: "date",
        },
        createdBy: {
          type: "text",
        },
        changedBy: {
          type: "text",
        },
        definition: {
          type: "text",
        },
        workflowName: {
          type: "text",
        },
        id: {
          type: "text",
        },
        version: {
          type: "integer",
        },
        snapshotNumber: {
          type: "integer",
        },
      },
    },
  },
  logs_body: {
    settings,
    mappings: {
      properties: {
        timeStamp: {
          type: "date",
        },
        code: {
          type: "text",
        },
        requestId: {
          type: "text",
        },
        details: {
          type: "text",
        },
        id: {
          type: "text",
        },
        message: {
          type: "text",
        },
        loggingLevel: {
          type: "text",
        },
      },
    },
  },

  snapshots_body6: {
    settings,
    mappings: {
      snapshot: {
        properties: {
          timeStamp: {
            type: "date",
          },
          createdBy: {
            type: "text",
          },
          changedBy: {
            type: "text",
          },
          definition: {
            type: "text",
          },
          workflowName: {
            type: "text",
          },
          id: {
            type: "text",
          },
          version: {
            type: "integer",
          },
          snapshotNumber: {
            type: "integer",
          },
        },
      },
    },
  },
  logs_body6: {
    settings,
    mappings: {
      log: {
        properties: {
          timeStamp: {
            type: "date",
          },
          code: {
            type: "text",
          },
          requestId: {
            type: "text",
          },
          details: {
            type: "text",
          },
          id: {
            type: "text",
          },
          message: {
            type: "text",
          },
          loggingLevel: {
            type: "text",
          },
        },
      },
    },
  },
};
