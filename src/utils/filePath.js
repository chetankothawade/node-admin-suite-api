export function generateFilePath(fileName, folder = "general") {

  const basePath = (process.env.UPLOAD_PATH || "uploads").replace(/^\/+|\/+$/g, "");
  const cleanFolder = String(folder || "general").replace(/^\/+|\/+$/g, "");
  const cleanFileName = String(fileName || "file").replace(/[\\/:*?"<>|]/g, "_");

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  const uniqueName = `${Date.now()}_${cleanFileName}`;

  return `${basePath}/${cleanFolder}/${year}/${month}/${uniqueName}`;
}
