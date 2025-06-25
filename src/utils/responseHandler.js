export const responseHandler = (res, statusCode, data, message) => {
  const response = {
    status: statusCode >= 200 && statusCode < 300 ? "success" : "error",
    data,
  };

  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
};
