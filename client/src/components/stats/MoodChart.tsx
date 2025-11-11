import { motion } from "framer-motion";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MoodData {
  mood: string;
  count: number;
}

interface MoodChartProps {
  data: MoodData[];
}

const MOOD_COLORS: Record<string, string> = {
  "excited": "hsl(var(--liquid-gold))",
  "happy": "hsl(var(--aurora-teal))",
  "calm": "hsl(var(--hyper-violet))",
  "anxious": "hsl(var(--cyber-fuchsia))",
  "frustrated": "hsl(var(--magenta-quartz))",
  "reflective": "hsl(var(--hyper-violet))",
};

export function MoodChart({ data }: MoodChartProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="editorial-card p-6 relative overflow-hidden"
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="absolute inset-0 gradient-teal-gold opacity-5" />
      <div className="relative z-10">
        <h3 className="font-serif text-lg font-semibold mb-4">Mood Patterns</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <XAxis 
                dataKey="mood" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  padding: "8px 12px"
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }}
              />
              <Bar 
                dataKey="count" 
                radius={[8, 8, 0, 0]}
                animationDuration={prefersReducedMotion ? 0 : 1000}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={MOOD_COLORS[entry.mood.toLowerCase()] || "hsl(var(--primary))"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
