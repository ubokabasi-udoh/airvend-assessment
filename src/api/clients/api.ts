import { api } from "../axios";

export async function GET_CLIENTS(params: TParams): Promise<TClientsResponse> {
  try {
    const response = await api.get("clients", { params });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function GET_CLIENT_KEYS(params: {
  uid: string;
}): Promise<TClientKeysResponse> {
  try {
    const response = await api.get(`clients/${params.uid}/verify-keys`);

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function CREATE_CLIENT_KEY(params: {
  uid: string;
  name: string;
  environment: string;
}): Promise<TClientKeyMutationResponse> {
  try {
    const response = await api.post(`clients/${params.uid}/verify-keys`, {
      name: params.name,
      environment: params.environment,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function REVOKE_CLIENT_KEY(params: {
  uid: string;
  kid: string;
}): Promise<TClientKeyMutationResponse> {
  try {
    const response = await api.delete(
      `clients/${params.uid}/verify-keys/${params.kid}`,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}
