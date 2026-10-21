type TSessionsByNetwork = Record<string, number>;

type TSessionsPerDay = {
  date: string;
  count: number;
};

type TDashboardData = {
  active_clients: number;
  inactive_clients: number;
  sessions_today: number;
  sessions_this_week: number;
  total_sessions: number;
  low_balance_clients: number;
  unassigned_extensions: number;
  total_funding_ngn: string;
  sessions_by_network: TSessionsByNetwork;
  sessions_last_30_days: TSessionsPerDay[];
};

type TDashboardResponse = TDashboardData;
