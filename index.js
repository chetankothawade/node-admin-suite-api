// index.js
process.removeAllListeners('warning');
import app from './app.js';

const PORT = Number.parseInt(process.env.PORT, 10) || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});