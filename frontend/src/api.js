const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  return response.json();
}

export async function getState() {
  const res = await fetch(`${API_URL}/api/state`);
  return handleResponse(res);
}

export async function getHistory() {
  const res = await fetch(`${API_URL}/api/history`);
  return handleResponse(res);
}

export async function addLight(location) {
  const res = await fetch(`${API_URL}/api/lights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location }),
  });
  return handleResponse(res);
}

export async function removeLight(id) {
  const res = await fetch(`${API_URL}/api/lights/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

export async function setMode(id, mode) {
  const res = await fetch(`${API_URL}/api/lights/${id}/mode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode }),
  });
  return handleResponse(res);
}

export async function setBrightness(id, brightness) {
  const res = await fetch(`${API_URL}/api/lights/${id}/brightness`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brightness }),
  });
  return handleResponse(res);
}

export async function serviceLight(id) {
  const res = await fetch(`${API_URL}/api/lights/${id}/service`, {
    method: "POST",
  });
  return handleResponse(res);
}

export async function setSpeed(minutesPerTick) {
  const res = await fetch(`${API_URL}/api/control/speed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ minutes_per_tick: minutesPerTick }),
  });
  return handleResponse(res);
}