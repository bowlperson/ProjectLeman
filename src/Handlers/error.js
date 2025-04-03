export default {
  execute(client) {
    const handleError = (type, error) => {
      logger.error(`${type}: ${error.stack || error.message}`);
    };

    const processEvents = {
      unhandledRejection: "Unhandled promise rejection",
      uncaughtException: "Uncaught exception",
      uncaughtExceptionMonitor: "Uncaught exception monitored"
    };

    for (const [event, message] of Object.entries(processEvents)) {
      process.on(event, (error) => handleError(message, error));
    }
  },
};
