import env from "../config/env.js";

export const successResponse = (
  res,
  message,
  data = null,
  statusCode = 200
) => {
  const response = {
    success: true,
    message: message,
  };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

export const errorResponse = (res, message, statusCode = 500, error = null) => {
  const response = {
    success: false,
    message: message,
  };

  if (error && env.NODE_ENV === "development") {
    response.error = error instanceof Error ? error.message : error;
    console.error("Detailed Error:", error);
  }
  return res.status(statusCode).json(response);
};
