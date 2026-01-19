"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", contracts: 4 },
  { month: "Feb", contracts: 6 },
  { month: "Mar", contracts: 8 },
  { month: "Apr", contracts: 5 },
  { month: "May", contracts: 7 },
  { month: "Jun", contracts: 9 },
];

const config = {
  contracts: {
    label: "Contracts",
    theme: {
      light: "hsl(var(--chart-1))",
      dark: "hsl(var(--chart-1))",
    },
  },
};

export function ContractAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={config}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload) return null;
                    return (
                      <ChartTooltipContent>
                        {payload.map((item: any) => (
                          <div key={item.name}>
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {item.name}
                            </span>
                            <span className="font-bold">{item.value}</span>
                          </div>
                        ))}
                      </ChartTooltipContent>
                    );
                  }}
                />
                <Bar
                  dataKey="contracts"
                  fill="currentColor"
                  className="fill-primary"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
