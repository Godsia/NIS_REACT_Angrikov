import React from 'react';
import ReactECharts from 'echarts-for-react';

export interface ChartDataItem {
  value: number;
  name: string;
  itemStyle?: { color?: string };
}

interface PieChartComponentProps {
  data: ChartDataItem[];
  type: 'basic' | 'donut' | 'rose';
  title?: string;
}

export default function PieChartComponent({ data, type, title }: PieChartComponentProps) {
  const option = {
    title: title ? { text: title, left: 'center' } : undefined,
    tooltip: { trigger: 'item' },
    legend: { orient: 'horizontal', bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: type === 'donut' ? ['40%', '70%'] : type === 'rose' ? [10, 80] : '60%',
        roseType: type === 'rose' ? 'area' : undefined,
        data: data.map((item) => ({
          value: item.value,
          name: item.name,
          itemStyle: item.itemStyle,
        })),
        label: { show: data.length > 0 },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
}
