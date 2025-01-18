"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const chartConfig = {
  responseTime: {
    label: "Response Time",
    color: "hsl(var(--chart-1))",
  },
  isUp: {
    label: "Status",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Chart() {
  const [chartData, setChartData] = useState<any>([]);

  const generateRandomData = () => {
    const now = Date.now();
    return Array.from({ length: 7 }, (_, i) => ({
      timestamp: now - (6 - i) * 3600000, // Generate timestamps for the last 7 hours
      isUp: Math.random() > 0.2 ? 1 : 0, // 80% chance of being up
      responseTime: Math.floor(Math.random() * 200) + 50, // Random response time between 50-250ms
    }));
  };

  useEffect(() => {
    const data = generateRandomData();
    setChartData(data);
  }, []);

  return (
    <ChartContainer config={chartConfig} className="w-full">
      <AreaChart
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(value) => format(new Date(value), 'HH:mm')}
        />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" domain={[0, 1]} />
        {/* <ChartTooltip>
          {({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Time
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {format(new Date(payload[0].payload.timestamp), 'HH:mm')}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Response Time
                      </span>
                      <span className="font-bold">
                        {payload[0].value}ms
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Status
                      </span>
                      <span className="font-bold">
                        {payload[1].value === 1 ? 'Up' : 'Down'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        </ChartTooltip> */}
        <ChartTooltip
        cursor={false}
        content={<ChartTooltipContent/>}
        />
        <Area
          type="monotone"
          dataKey="responseTime"
          stroke="var(--color-responseTime)"
          fill="var(--color-responseTime)"
          yAxisId="left"
        />
        <Area
          type="step"
          dataKey="isUp"
          stroke="var(--color-isUp)"
          fill="var(--color-isUp)"
          yAxisId="right"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}

