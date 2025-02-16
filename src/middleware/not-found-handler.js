import errorDefinitions from "../constants/error-definitions.js";
import PCloudError from "../constants/p-cloud-error.js";

function notFoundHandler(req, res, next) {
  throw new PCloudError(errorDefinitions.COMMON.NOT_FOUND_ERROR);
}

export default notFoundHandler;
