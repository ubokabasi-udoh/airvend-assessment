import { GET_DASHBOARD_DATA } from "@/api/dashboard/api";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatNumber = (value: number) => value.toLocaleString();

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

export default function DashboardPage() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => GET_DASHBOARD_DATA(),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Failed to load dashboard.</div>;
  }

  const cards = [
    { label: "Active Clients", value: formatNumber(data.active_clients) },
    { label: "Inactive Clients", value: formatNumber(data.inactive_clients) },
    { label: "Sessions Today", value: formatNumber(data.sessions_today) },
    {
      label: "Sessions This Week",
      value: formatNumber(data.sessions_this_week),
    },
    { label: "Total Sessions", value: formatNumber(data.total_sessions) },
    {
      label: "Low Balance Clients",
      value: formatNumber(data.low_balance_clients),
    },
    {
      label: "Unassigned Extensions",
      value: formatNumber(data.unassigned_extensions),
    },
    { label: "Total Funding", value: `₦${data.total_funding_ngn}` },
  ];

  const networks = Object.entries(data.sessions_by_network).sort(
    ([, a], [, b]) => b - a,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border bg-white p-5 flex flex-col gap-2"
          >
            <span className="text-xs lg:text-sm text-faded">{card.label}</span>
            <span className="text-2xl lg:text-3xl font-semibold text-primary-dark">
              {card.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="rounded-xl border bg-white p-5 lg:col-span-3">
          <p className="font-semibold mb-1">Sessions</p>
          <p className="text-xs text-faded mb-4">Last 30 days</p>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.sessions_last_30_days}>
                <defs>
                  <linearGradient id="sessionsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4834d4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#4834d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  labelFormatter={(label) => formatDate(String(label))}
                  formatter={(value) => [value, "Sessions"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#4834d4"
                  strokeWidth={2}
                  fill="url(#sessionsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 lg:col-span-2">
          <p className="font-semibold mb-4">Sessions by Network</p>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NETWORK</TableHead>
                <TableHead className="text-right">SESSIONS</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {networks.map(([network, count]) => (
                <TableRow key={network}>
                  <TableCell>{network}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(count)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
