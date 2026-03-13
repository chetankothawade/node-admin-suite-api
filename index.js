// index.js
process.removeAllListeners('warning');
import app from './app.js';
import logger from "./src/utils/logger.js";

const PORT = Number.parseInt(process.env.PORT, 10) || 3000;

// Start server
app.listen(PORT, () => {
  logger.info({ port: PORT }, "Server is running");
});
