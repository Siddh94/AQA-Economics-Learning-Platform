declare module 'recharts' {
  import { ComponentType, ReactNode } from 'react';

  export interface LineChartProps {
    data?: any[];
    width?: number;
    height?: number;
    children?: ReactNode;
  }

  export interface LineProps {
    type?: string;
    dataKey?: string;
    stroke?: string;
    strokeWidth?: number;
    dot?: any;
  }

  export interface XAxisProps {
    dataKey?: string;
  }

  export interface YAxisProps {
    domain?: [number, number];
  }

  export interface CartesianGridProps {
    strokeDasharray?: string;
  }

  export interface TooltipProps {}

  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    children?: ReactNode;
  }

  export const LineChart: ComponentType<LineChartProps>;
  export const Line: ComponentType<LineProps>;
  export const XAxis: ComponentType<XAxisProps>;
  export const YAxis: ComponentType<YAxisProps>;
  export const CartesianGrid: ComponentType<CartesianGridProps>;
  export const Tooltip: ComponentType<TooltipProps>;
  export const ResponsiveContainer: ComponentType<ResponsiveContainerProps>;
}
