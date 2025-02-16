import app from "./app.js";
import logger from "./src/config/logger.js";

const port = 80;

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
