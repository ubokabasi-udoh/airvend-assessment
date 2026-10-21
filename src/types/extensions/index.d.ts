type TExtension = {
  id: number;
  uid: string;
  extension: string;
  extension_type: string;
  status: string;
  assigned: number;
  client: TClient | null;
  created_at: string;
};

type TExtensionsResponse = {
  data: TExtension[];
  meta?: { total?: number };
};

type TExtensionResponse = {
  data: TExtension;
};

// TODO: update payload shape is assumed, confirm with the API
type TEditExtensionPayload = {
  uuid: string;
  extension_type: string;
  status: string;
};
