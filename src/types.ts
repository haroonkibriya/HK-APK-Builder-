export type BuildStatus = 
  | 'QUEUED' 
  | 'ANALYZING' 
  | 'PREPARING' 
  | 'BUILDING' 
  | 'PACKAGING' 
  | 'SUCCESS' 
  | 'FAILED' 
  | 'CANCELLED' 
  | 'EXPIRED';

export interface BuildConfig {
  buildId: string;
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  webUrl: string;
  orientation: 'auto' | 'portrait' | 'landscape';
  iconColor: string;
  iconBadge: string;
  enableSplashScreen: boolean;
  splashColor: string;
  showStatusBar: boolean;
  fullScreen: boolean;
  allowExternalBrowser: boolean;
  enablePullToRefresh: boolean;
  enableZoom: boolean;
  requireCamera: boolean;
  requireMicrophone: boolean;
  requireLocation: boolean;
}

export interface BuildRecord extends BuildConfig {
  id: string;
  status: BuildStatus;
  apkFileName: string;
  apkFileSize: string;
  apkSha256: string;
  createdAt: number;
  expiresAt: number;
  buildDurationMs: number;
  logs: string[];
  downloadUrl: string;
  isPwa?: boolean;
}

export interface AnalysisResult {
  isValidUrl: boolean;
  isHttps: boolean;
  isReachable: boolean;
  httpStatusCode: number;
  responseTimeMs: number;
  pageTitle: string;
  suggestedAppName: string;
  suggestedPackageName: string;
  hasMobileViewport: boolean;
  isPwa: boolean;
  manifestUrl?: string;
  faviconUrl?: string;
  errorMessage?: string;
}
