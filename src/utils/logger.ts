import pino from "pino";

const transport = pino.transport({
  targets: [
    {
      target: "pino/file",
      options: {
        destination: `logs/server.log`,
      },
      level: "error",
    },
    {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
      level: "info",
    },
  ],
});

const pinoConfig = pino(
  {
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

export default pinoConfig;
