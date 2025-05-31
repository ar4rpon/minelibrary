/**
 * Theme UI Types
 * テーマ・スタイリング関連型定義
 */

import type { Breakpoint } from './component';

/**
 * カラーパレット
 */
export interface ColorPalette {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: ColorScale;
  gray: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
}

/**
 * カラースケール
 */
export type ColorScale = {
  [key in 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900]: string;
};

/**
 * タイポグラフィ設定
 */
export interface Typography {
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  fontSize: {
    xs: [string, string];
    sm: [string, string];
    base: [string, string];
    lg: [string, string];
    xl: [string, string];
    '2xl': [string, string];
    '3xl': [string, string];
    '4xl': [string, string];
    '5xl': [string, string];
    '6xl': [string, string];
  };
  fontWeight: {
    thin: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
}

/**
 * スペーシング設定
 */
export interface Spacing {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
  40: string;
  48: string;
  56: string;
  64: string;
}

/**
 * シャドウ設定
 */
export interface Shadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

/**
 * ボーダー半径設定
 */
export interface BorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

/**
 * テーマ設定
 */
export interface Theme {
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  shadows: Shadows;
  borderRadius: BorderRadius;
  breakpoints: Record<Breakpoint, string>;
  zIndex: {
    dropdown: number;
    sticky: number;
    fixed: number;
    overlay: number;
    modal: number;
    popover: number;
    tooltip: number;
  };
}

/**
 * テーマモード
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * テーマコンテキスト
 */
export interface ThemeContext {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  toggleMode: () => void;
}
