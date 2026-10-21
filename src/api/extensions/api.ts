import { api } from "../axios";

export async function GET_EXTENSIONS(
  params: TParams,
): Promise<TExtensionsResponse> {
  try {
    const response = await api.get("extensions", { params });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function GET_EXTENSION(params: {
  uuid: string;
}): Promise<TExtensionResponse> {
  try {
    const response = await api.get(`extensions/${params.uuid}`);

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function UPDATE_EXTENSION(
  data: TEditExtensionPayload,
): Promise<TExtensionResponse> {
  try {
    const { uuid, ...payload } = data;
    const response = await api.put(`extensions/${uuid}`, payload);

    return response.data;
  } catch (error) {
    throw error;
  }
}
