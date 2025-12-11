import { app } from "./index.js";
import { config } from "./src/settings/config.js";
import { startConnection } from "./src/settings/database.js";

const start = async () => {
  await startConnection({
    uri: config.mongo,
    database: config.database,
  });

  app.listen(config.port, () => {
    console.log("Server running on http://localhost:" + config.port);
  });
};

start();
