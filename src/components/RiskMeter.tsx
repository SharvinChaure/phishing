"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

type RiskMeterProps = {
  score: number;
};

export function RiskMeter({ score }: RiskMeterProps) {
  const color = useMemo(() => {
    if (score >= 70) return "hsl(var(--destructive))";
    if (score >= 40) return "#f59e0b"; // amber-500
    return "hsl(var(--primary))";
  }, [score]);

  const data = [{ name: "score", value: score, fill: color }];

  return (
    <div className="relative h-48 w-48" data-ai-hint="risk meter">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="75%"
          outerRadius="90%"
          barSize={15}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: "hsl(var(--muted))" }}
            dataKey="value"
            angleAxisId={0}
            cornerRadius={10}
            className="animate-in fade-in-50 duration-1000"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold font-headline" style={{ color }}>
          {score}
        </span>
        <span className="text-sm text-muted-foreground">Risk Score</span>
      </div>
    </div>
  );
}
