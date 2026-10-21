type TClientExtension = {
  id: number;
  uid: string;
  extension: string;
  extension_type: string;
  status: string;
  assigned: number;
  created_at: string;
};

type TClient = {
  id: number;
  uid: string;
  phone_number: string;
  business_type: string;
  callback_url: string;
  session_balance: number;
  status: string;
  extension?: TClientExtension | null;
  user: TUserDetails;
  created_at: string;
};

type TClientsResponse = {
  data: TClient[];
  meta?: { total?: number };
};

type TClientKey = {
  id: number;
  name: string;
  key_prefix: string;
  key_hint: string;
  environment: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
};

type TClientKeysResponse = {
  data: TClientKey[];
};

// TODO: create/revoke response shapes unknown
type TClientKeyMutationResponse = {
  data?: unknown;
  [key: string]: unknown;
};
