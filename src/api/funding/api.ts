import { api } from "../axios";

export async function GET_FUNDING_HISTORY(
  params: TFundingParams,
): Promise<TFundingHistoryResponse> {
  try {
    const response = await api.get("funding-history", { params });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function GET_FUNDING_HISTORY_BY_ID(params: {
  id: string;
}): Promise<TFundingHistoryDetailsResponse> {
  try {
    const response = await api.get(`funding-history/${params.id}`);

    return response.data;
  } catch (error) {
    throw error;
  }
}
