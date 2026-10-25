const API_BASE_URL = 'http://localhost:8000';

async function handleResponse(res) {
  if (!res.ok) {
    let errorDetail = 'API Request Failed';
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch {
      errorDetail = res.statusText || errorDetail;
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

export const api = {
  baseUrl: API_BASE_URL,

  async getHealth() {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    return handleResponse(res);
  },

  async getDatasetSummary() {
    const res = await fetch(`${API_BASE_URL}/api/dataset/summary`);
    return handleResponse(res);
  },

  async getDatasetQuality() {
    const res = await fetch(`${API_BASE_URL}/api/dataset/quality`);
    return handleResponse(res);
  },

  async uploadDataset(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res);
  },

  async cleanDataset(options = {}) {
    const res = await fetch(`${API_BASE_URL}/api/dataset/clean`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        impute_missing_rating: options.impute_missing_rating ?? true,
        imputation_strategy: options.imputation_strategy || 'category_mean',
        trim_whitespace: options.trim_whitespace ?? true,
        remove_duplicates: options.remove_duplicates ?? true,
      }),
    });
    return handleResponse(res);
  },

  async resetDataset() {
    const res = await fetch(`${API_BASE_URL}/api/dataset/reset`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  async getDashboardData(filters = {}) {
    const res = await fetch(`${API_BASE_URL}/api/dashboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    });
    return handleResponse(res);
  },

  async getCustomerAnalytics(filters = {}) {
    const res = await fetch(`${API_BASE_URL}/api/analytics/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    });
    return handleResponse(res);
  },

  async getShoppingPatterns(filters = {}) {
    const res = await fetch(`${API_BASE_URL}/api/analytics/shopping-patterns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    });
    return handleResponse(res);
  },

  async getExplorerData(params = {}) {
    const res = await fetch(`${API_BASE_URL}/api/dataset/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse(res);
  },

  getPdfReportUrl(useCleaned = true) {
    return `${API_BASE_URL}/api/reports/pdf?use_cleaned=${useCleaned}`;
  },

  getCleanedCsvUrl() {
    return `${API_BASE_URL}/api/exports/cleaned-csv`;
  },

  getSummaryCsvUrl(useCleaned = true) {
    return `${API_BASE_URL}/api/exports/summary-csv?use_cleaned=${useCleaned}`;
  },
};
