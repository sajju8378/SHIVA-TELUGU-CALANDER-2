export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    androidScheme?: string;
    url?: string;
    cleartext?: boolean;
  };
}

const config: CapacitorConfig = {
  appId: 'com.telugu.panchangam2027',
  appName: 'Telugu Panchangam 2027',
  webDir: 'dist'
};

export default config;
