import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useSettingsStore } from '@/stores/settingsStore';

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: ChartData[];
  dataKeys: string[];
  title?: string;
  height?: number;
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

export const Chart: React.FC<ChartProps> = ({
  type,
  data,
  dataKeys,
  title,
  height = 300,
  colors = DEFAULT_COLORS,
}) => {
  const { theme } = useSettingsStore();
  const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

  // Type assertions needed for recharts with React 18
  const LineChartComponent = LineChart as any;
  const BarChartComponent = BarChart as any;
  const AreaChartComponent = AreaChart as any;
  const PieChartComponent = PieChart as any;
  const LineComponent = Line as any;
  const BarComponent = Bar as any;
  const AreaComponent = Area as any;
  const PieComponent = Pie as any;
  const CellComponent = Cell as any;
  const XAxisComponent = XAxis as any;
  const YAxisComponent = YAxis as any;
  const CartesianGridComponent = CartesianGrid as any;
  const TooltipComponent = Tooltip as any;
  const LegendComponent = Legend as any;

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChartComponent data={data}>
            <CartesianGridComponent strokeDasharray="3 3" stroke={gridColor} />
            <XAxisComponent dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
            <YAxisComponent tick={{ fill: textColor, fontSize: 12 }} />
            <TooltipComponent
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: gridColor,
                borderRadius: 8,
              }}
            />
            <LegendComponent />
            {dataKeys.map((key, index) => (
              <LineComponent
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[index % colors.length], strokeWidth: 2 }}
              />
            ))}
          </LineChartComponent>
        );

      case 'bar':
        return (
          <BarChartComponent data={data}>
            <CartesianGridComponent strokeDasharray="3 3" stroke={gridColor} />
            <XAxisComponent dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
            <YAxisComponent tick={{ fill: textColor, fontSize: 12 }} />
            <TooltipComponent
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: gridColor,
                borderRadius: 8,
              }}
            />
            <LegendComponent />
            {dataKeys.map((key, index) => (
              <BarComponent
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChartComponent>
        );

      case 'area':
        return (
          <AreaChartComponent data={data}>
            <CartesianGridComponent strokeDasharray="3 3" stroke={gridColor} />
            <XAxisComponent dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
            <YAxisComponent tick={{ fill: textColor, fontSize: 12 }} />
            <TooltipComponent
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: gridColor,
                borderRadius: 8,
              }}
            />
            <LegendComponent />
            {dataKeys.map((key, index) => (
              <AreaComponent
                key={key}
                type="monotone"
                dataKey={key}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
              />
            ))}
          </AreaChartComponent>
        );

      case 'pie':
        return (
          <PieChartComponent>
            <PieComponent
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey={dataKeys[0]}
              label={({ name, percent }: { name: string; percent: number }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((_entry, index) => (
                <CellComponent
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </PieComponent>
            <TooltipComponent
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: gridColor,
                borderRadius: 8,
              }}
            />
            <LegendComponent />
          </PieChartComponent>
        );

      default:
        return null;
    }
  };

  return (
    <div className="my-4 p-4 rounded-lg border border-border bg-card">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart() as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
