const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('proptrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchAccounts = async () => {
  const res = await fetch(`${API_URL}/accounts`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch accounts');
  return res.json();
};

export const fetchTrades = async () => {
  const res = await fetch(`${API_URL}/trades`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch trades');
  return res.json();
};

export const fetchAlerts = async () => {
  const res = await fetch(`${API_URL}/alerts`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
};

export const fetchAnalyticsSummary = async () => {
  const res = await fetch(`${API_URL}/analytics/summary`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch analytics summary');
  return res.json();
};

export const fetchEquityCurve = async () => {
  const res = await fetch(`${API_URL}/analytics/equity-curve`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch equity curve');
  return res.json();
};

export const createTrade = async (tradeData: any) => {
  const res = await fetch(`${API_URL}/trades`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(tradeData)
  });
  if (!res.ok) throw new Error('Failed to create trade');
  return res.json();
};

export const bulkCreateTrades = async (payload: { trades: any[] }) => {
  const res = await fetch(`${API_URL}/trades/bulk`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to bulk import trades');
  return res.json();
};

export const createAccount = async (accountData: any) => {
  const res = await fetch(`${API_URL}/accounts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(accountData)
  });
  if (!res.ok) throw new Error('Failed to create account');
  return res.json();
};
