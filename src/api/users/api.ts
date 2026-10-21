import { api } from "../axios";

export async function GET_USERS(
  params: TParams & { role?: string },
): Promise<TUsersResponse> {
  try {
    const response = await api.get("users", { params });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function GET_USER(params: {
  uid: string;
}): Promise<TGetUserResponse> {
  try {
    const response = await api.get(`users/${params.uid}`, { params });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function CREATE_USER(
  payload: TCreateUserPayload,
): Promise<TUsersResponse> {
  try {
    const response = await api.post("users", payload);

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function UPDATE_USER(
  data: TEditUserPayload,
): Promise<TUsersResponse> {
  try {
    const response = await api.put(`users/${data.uid}`, { data });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function DELETE_USER(params: {
  uid: string;
}): Promise<TUsersResponse> {
  try {
    const response = await api.delete(`users/${params.uid}`, { params });

    return response.data;
  } catch (error) {
    throw error;
  }
}
