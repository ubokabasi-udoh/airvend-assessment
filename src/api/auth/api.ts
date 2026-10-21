import { api, publicApi } from "../axios";

export async function LOGIN(data: TLoginPayload): Promise<TLoginResponse> {
  try {
    const response = await publicApi.post("auth/login", data);

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function GET_LOGGED_IN_USER(): Promise<TLoginResponse> {
  try {
    const response = await api.post("auth/me");

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function LOGOUT(): Promise<TLoginResponse> {
  try {
    const response = await api.post("auth/logout");

    return response.data;
  } catch (error) {
    throw error;
  }
}
