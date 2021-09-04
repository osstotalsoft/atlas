const { APOLLO_LOGGING_LEVEL } = process.env;
const { ApolloError } = require("apollo-server-errors");
const { v4 } = require("uuid");
const { append, map } = require("ramda");
require("colors");
const {
  indexes: { elasticLogs },
} = require("../../elasticSearch");

const loggingLevels = {
  INFO: "INFO",
  ERROR: "ERROR",
  DEBUG: "DEBUG",
};

const shouldSkipLogging = (operationName, logLevel) => {
  if (operationName === "IntrospectionQuery") return false;

  const { INFO, ERROR, DEBUG } = loggingLevels;
  switch (logLevel) {
    case INFO:
      return (
        APOLLO_LOGGING_LEVEL === loggingLevels.INFO ||
        APOLLO_LOGGING_LEVEL === loggingLevels.DEBUG
      );
    case DEBUG:
      return APOLLO_LOGGING_LEVEL === loggingLevels.DEBUG;
    case ERROR:
      return (
        APOLLO_LOGGING_LEVEL === loggingLevels.ERROR ||
        APOLLO_LOGGING_LEVEL === loggingLevels.DEBUG ||
        APOLLO_LOGGING_LEVEL === loggingLevels.INFO
      );
  }
};

const initializeDbLogging = (context, operationName) => ({
  logInfo: (message, code, autoSave = false) =>
    shouldSkipLogging(operationName, loggingLevels.INFO) &&
    logEvent(context, message, null, code, loggingLevels.INFO, null, autoSave),
  logDebug: (message, details, code, autoSave = false) =>
    shouldSkipLogging(operationName, loggingLevels.DEBUG) &&
    logEvent(
      context,
      message,
      details,
      code,
      loggingLevels.DEBUG,
      null,
      autoSave
    ),
  logError: (message, code, error) =>
    shouldSkipLogging(operationName, loggingLevels.ERROR) &&
    logDbError(context, message, code, loggingLevels.ERROR, error),
});

const saveLogs = async (context) => {
  const { logs, requestId } = context;
  if (logs) {
    const { index, type } = elasticLogs;

    const insertLogs = map(
      ({ uid, code, message, details, timeStamp, loggingLevel }) => ({
        id: uid,
        requestId: requestId || v4(),
        code,
        message,
        details,
        timeStamp,
        loggingLevel,
      }),
      logs
    );
    await context.elastic.seed(index, type, insertLogs);
  }
  context.logs = null;
};

const logEvent = async (
  context,
  message,
  details,
  code,
  level,
  error,
  autoSave
) => {
  const { INFO, DEBUG } = loggingLevels;
  const logId = v4();
  context.logs = append(
    {
      uid: logId,
      code,
      message,
      details,
      timeStamp: new Date(),
      loggingLevel: level,
      error,
    },
    context.logs
  );

  switch (level) {
    case INFO: {
      console.log(`${code} ${message}`.green);
      details && console.log(`${code} ${details}`.green);
      break;
    }
    case DEBUG: {
      console.log(`${code} ${message}`.blue);
      details && console.log(`${code} ${details}`.blue);
      break;
    }
  }

  if (autoSave) {
    await saveLogs(context);
  }
};

const logDbError = async (context, message, code, level, error) => {
  console.error(
    `${code} ${message} ${error?.message} ${error?.stack} ${JSON.stringify(
      error?.extensions
    )}`.red
  );

  const logId = v4();
  const messageWithLogId = `${message} For more details check Log Id: < ${logId} > Request Id: < ${context.requestId} >`;

  context.logs = append(
    {
      uid: logId,
      code,
      message,
      details: `${error.message} ${error.stack} ${JSON.stringify(
        error.extensions
      )}`,
      timeStamp: new Date(),
      loggingLevel: level,
      error,
    },
    context.logs
  );
  await saveLogs(context);

  return new ApolloError(messageWithLogId, code, { logId });
};

module.exports = { saveLogs, loggingLevels, initializeDbLogging };
module.exports.tests = {
  shouldSkipLogging,
  loggingLevels,
  logEvent,
  logDbError,
};
