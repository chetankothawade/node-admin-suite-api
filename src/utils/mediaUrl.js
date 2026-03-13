import { Storage } from "../services/storage/storageManager.js";

const HTTP_URL_REGEX = /^https?:\/\//i;

export const resolvePreviewUrl = (storedValue) => {
  if (storedValue === null || storedValue === undefined) return "";

  const value = String(storedValue).trim();
  if (!value) return "";

  if (HTTP_URL_REGEX.test(value)) return value;

  const normalizedPath = value.replace(/^\/+/, "");
  try {
    return Storage.getUrl(normalizedPath);
  } catch {
    return value;
  }
};

