import React from 'react';
import ReactECharts from 'echarts-for-react';

export interface BarChartSeries {
  name: string;
  data: number[];
  color?: string;
}

interface BarChartComponentProps {
  xAxisData: string[];
  seriesData?: number[];
  seriesList?: BarChartSeries[];
  yAxisNames?: [string, string];
  yAxisName?: string;
  title?: string;
  color?: string;
}

export default function BarChartComponent({
  xAxisData,
  seriesData,
  seriesList,
  yAxisNames,
  yAxisName = 'Количество',
  title,
  color = '#5470c6',
}: BarChartComponentProps) {
  const isMulti = seriesList && seriesList.length >= 2;

  const option = isMulti
    ? {
        title: title ? { text: title, left: 'center', top: 8 } : undefined,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        legend: {
          data: seriesList!.map((s) => s.name),
          bottom: 0,
        },
        grid: {
          left: '10%',
          right: '12%',
          bottom: '20%',
          top: title ? 56 : 48,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            rotate: xAxisData.length > 6 ? 45 : 0,
            fontSize: 11,
          },
        },
        yAxis: [
          {
            type: 'value',
            name: yAxisNames?.[0],
            position: 'left',
            minInterval: 1,
          },
          {
            type: 'value',
            name: yAxisNames?.[1],
            position: 'right',
            minInterval: 1,
          },
        ],
        series: seriesList!.map((s, i) => ({
          type: 'bar' as const,
          name: s.name,
          data: s.data,
          yAxisIndex: i,
          itemStyle: { color: s.color },
          barMaxWidth: 36,
        })),
      }
    : {
        title: title ? { text: title, left: 'center', top: 8 } : undefined,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        grid: {
          left: '8%',
          right: '6%',
          bottom: '12%',
          top: title ? 56 : 48,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            rotate: xAxisData.length > 6 ? 45 : 0,
            fontSize: 11,
          },
        },
        yAxis: {
          type: 'value',
          name: yAxisName,
          minInterval: 1,
        },
        series: [
          {
            type: 'bar',
            data: seriesData ?? [],
            itemStyle: { color },
            barMaxWidth: 48,
          },
        ],
      };

  return (
    <div style={{ width: '100%', minHeight: 320, paddingTop: 8 }}>
      <ReactECharts option={option} style={{ height: 320, width: '100%' }} />
    </div>
  );
}
