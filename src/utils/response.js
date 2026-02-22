// utils/response.js

// /**
//  * Standardized API Response Utility
//  * @param {object} res - Express response object
//  * @param {number} status - HTTP status code
//  * @param {boolean} success - Success flag
//  * @param {string} message - Response message
//  * @param {object} [data={}] - Additional response data
//  */
// export const sendResponse = (res, status, success, message, data = {}) => {
//   return res.status(status).json({
//     success,
//     message,
//     ...data,
//   });
// };

/**
 * Standardized API Response Utility with i18n support
 * @param {object} res - Express response object
 * @param {number} status - HTTP status code
 * @param {boolean} success - Success flag
 * @param {string} message - Response message key
 * @param {object} [data={}] - Additional response data
 * @param {object} [vars={}] - Variables for message interpolation
 */
export const sendResponse = (res, status, success, message, data = {}, vars = {}) => {
  // Get request from response to use i18n
  const req = res.req;

  let localizedMessage = message;

  if (req && typeof message === "string") {
    localizedMessage = req.__(message, vars); // interpolate variables if needed
  }

  return res.status(status).json({
    success,
    message: localizedMessage,
    ...(Object.keys(data).length ? { data } : {}),
  });
};

/**
 * Common controller error handler
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {Error|object} error - Thrown error
 * @param {object} [options]
 * @param {string} [options.logPrefix]
 * @param {string} [options.fallbackMessage]
 * @param {Function} [options.validationMapper]
 */
export const handleError = (
  req,
  res,
  error,
  { logPrefix = "Controller error:", fallbackMessage = "error.internal", validationMapper } = {}
) => {
  // Validation errors are sent as an array so UI can show field-level messages.
  if (error?.name === "SequelizeValidationError") {
    const mapValidation = validationMapper || ((err) => req.__(err.message));
    const messages = error.errors.map(mapValidation);
    return sendResponse(res, 422, false, messages);
  }

  // Service-layer controlled errors preserve explicit status/message mapping.
  if (error?.status && error?.exposeMessage) {
    return sendResponse(res, error.status, false, error.exposeMessage);
  }

  // Fallback for unexpected runtime errors.
  console.error(logPrefix, error);
  return sendResponse(res, 500, false, fallbackMessage);
};
