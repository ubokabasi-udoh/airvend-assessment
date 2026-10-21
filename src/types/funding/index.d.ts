type TFundingClientUser = {
  id: number;
  uid: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: TRole[];
  created_at: string;
};

type TFundingClient = {
  id: number;
  uid: string;
  phone_number: string;
  business_type: string;
  callback_url: string;
  session_balance: number;
  status: string;
  user: TFundingClientUser;
  created_at: string;
};

type TFundingHistory = {
  id: number;
  client_id: number;
  client: TFundingClient;
  session_value: string;
  amount: string;
  funding_type: string;
  balance_before: string;
  balance_after: string;
  created_at: string;
};

type TFundingHistoryResponse = {
  data: TFundingHistory[];
  meta?: { total?: number };
};

type TFundingHistoryDetailsResponse = {
  data: TFundingHistory;
};

type TFundingParams = TParams & { funding_type?: "manual" | "automatic" };
