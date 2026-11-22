export function errorHandler(error, _req, res, _next) {
  console.error(error.message);
  const status = error.status || (error.name === 'MulterError' ? 400 : 500);
  res.status(status).json({ error: error.publicMessage || 'Something went wrong. Please try again.' });
}
