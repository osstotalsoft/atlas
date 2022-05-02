const { apply } = require("ramda");
const { esClient } = require("../../../elasticSearch/client");
const {
  indexes: { workflowSnapshots },
  elastic,
} = require("../../../elasticSearch");
const { v4 } = require("uuid");

const getSnapshotNumber = async (workflowName, version) => {
  const hits = await elastic.search(workflowSnapshots.index, { workflowName, version });
  const snapshots = hits?.map((h) => h.snapshotNumber);
  const latestSnapshot = apply(Math.max, snapshots);
  return latestSnapshot > 0 ? latestSnapshot + 1 : 1;
};

const saveSnapshot = async (workflow) => {
  const { index, type } = workflowSnapshots;
  const doc = {
    id: v4(),
    snapshotNumber: await getSnapshotNumber(workflow?.name, workflow?.version),
    version: workflow?.version,
    workflowName: workflow?.name,
    definition: workflow,
    createdBy: workflow?.createdBy,
    changedBy: workflow?.updatedBy,
    timeStamp: new Date(),
  };
  await esClient.update({
    id: doc.id,
    index,
    type,
    refresh: true,
    doc_as_upsert: true,
    body: {
      doc,
    },
  });
};

module.exports = { saveSnapshot };
