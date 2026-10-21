import { api } from "../axios";

export async function GET_DASHBOARD_DATA(): Promise<TDashboardResponse> {
  try {
    const response = await api.get("dashboard");

    return response.data;
  } catch (error) {
    throw error;
  }
}