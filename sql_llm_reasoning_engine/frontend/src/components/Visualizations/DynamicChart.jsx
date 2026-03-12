import React, { useState, useMemo } from 'react';
import {
  Chart,
  Series,
  Title,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from '@highcharts/react';
import { parseChartData } from '../../utils/chartParser';
import './DynamicChart.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function DynamicChart({ data, content }) {
  const chartConfig = useMemo(() => parseChartData(data, content), [data, content]);
  const [chartType, setChartType] = useState(chartConfig?.suggestedType || 'bar');

  if (!chartConfig) {
    return (
      <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
        DynamicChart: chartConfig is null. Data: {JSON.stringify({ 
          hasColumns: !!data?.columns, 
          hasRows: !!data?.rows, 
          rowCount: data?.rows?.length 
        })}
      </div>
    );
  }

  const { formattedData, xKey, yKeys } = chartConfig;

  // Don't render empty charts or charts with no X/Y axes inferred
  if (!formattedData.length || !xKey || !yKeys.length) {
    return null;
  }

  const categories = formattedData.map(item => item[xKey]);

  const renderSeries = () => {
    if (chartType === 'pie') {
      return (
        <Series
          type="pie"
          name={yKeys[0]}
          data={formattedData.map((item, idx) => ({
            name: item[xKey],
            y: item[yKeys[0]],
            color: COLORS[idx % COLORS.length]
          }))}
        />
      );
    }

    return [...yKeys].reverse().map((key) => {
      const originalIdx = yKeys.indexOf(key);
      return (
        <Series
          key={key}
          type={chartType === 'bar' ? 'column' : 'line'}
          name={key}
          data={formattedData.map(item => item[key])}
          color={COLORS[originalIdx % COLORS.length]}
        />
      );
    });
  };

  return (
    <div className="dynamic-chart-container">
      <div className="chart-controls">
        <span className="chart-title">Data Visualization</span>
        <div className="chart-toggle-group">
          <button
            className={`chart-btn ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
          >
            Bar
          </button>
          <button
            className={`chart-btn ${chartType === 'line' ? 'active' : ''}`}
            onClick={() => setChartType('line')}
          >
            Line
          </button>
          <button
            className={`chart-btn ${chartType === 'pie' ? 'active' : ''}`}
            onClick={() => setChartType('pie')}
          >
            Pie
          </button>
        </div>
      </div>
      <div className="chart-wrapper">
        <Chart height={300} style={{ width: '100%' }}>
          <Title>{chartType.charAt(0).toUpperCase() + chartType.slice(1)} Analysis</Title>
          {chartType !== 'pie' && <XAxis categories={categories} />}
          {chartType !== 'pie' && <YAxis title={{ text: '' }} />}
          <Tooltip shared={chartType !== 'pie'} reverse={true} sort={true} />
          <Legend />
          {renderSeries()}
        </Chart>
      </div>
    </div>
  );
}
