export function toArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const keys = ["items", "data", "results", "list", "value"];
  for (const key of keys) {
    if (Array.isArray(payload[key])) return payload[key];
  }

  return [];
}

export function pick(obj, keys, fallback = "-") {
  if (!obj || typeof obj !== "object") return fallback;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") return obj[key];
  }
  return fallback;
}

export function rowId(row, keys = []) {
  const defaults = ["id", "capacityId", "reportId", "assignmentId", "collectorId", "ruleId"];
  const val = pick(row, [...keys, ...defaults], null);
  return val ?? JSON.stringify(row);
}

export function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getApiErrorMessage(error, fallback = "Co loi xay ra") {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.title === "string") return data.title;

  if (data?.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors)
      .flat()
      .filter((m) => typeof m === "string");
    if (messages.length > 0) return messages.join(" ");
  }

  return fallback;
}
