const express = require("express");
const path = require("path");
const client = require("prom-client");

const app = express();
const port = process.env.PORT || 8080;

// Prometheus metrics setup
client.collectDefaultMetrics({ prefix: 'react_app_' });

const httpRequestCounter = new client.Counter({
  name: 'react_app_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Middleware to count requests
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// Serve React build
app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "build", "index.html")));

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// ⚡ Bind to 0.0.0.0 for Kubernetes
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
