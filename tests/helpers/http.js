import express from "express";

const buildUrl = (baseUrl, path) => new URL(path, baseUrl).toString();

export async function createHttpTestClient(router, { basePath = "/" } = {}) {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(basePath, router);

  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const request = async ({
    method = "GET",
    path = "/",
    body,
    headers = {},
  } = {}) => {
    const response = await fetch(buildUrl(baseUrl, path), {
      method,
      headers: {
        ...(body ? { "content-type": "application/json" } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    return { status: response.status, data, headers: response.headers };
  };

  const close = async () =>
    new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });

  return { request, close };
}

