import api from "./axios";

export const getTransactions = async (params: any) => {
  const res = await api.get("/transactions", { params });
  return res.data;
};

export const getMonthlyStats = async (startDate: string, endDate: string) => {
  const res = await api.get("/transactions/stats/monthly", {
    params: { startDate, endDate },
  });
  return res.data.data;
};

export const getDailyStats = async (startDate: string, endDate: string) => {
  const res = await api.get("/transactions/stats/daily", {
    params: { startDate, endDate },
  });
  return res.data.data;
};

export const getCategoryStats = async (startDate: string, endDate: string) => {
  const res = await api.get("/transactions/stats/category", {
    params: { startDate, endDate },
  });
  return res.data.data;
};
