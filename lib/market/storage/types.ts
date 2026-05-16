export type StorageMode = 'local-json' | 'kv' | 'memory';

export interface MarketStorage {
  mode: StorageMode;
  kvAvailable: boolean;
  readJson<T>(key: 'history' | 'alerts'): Promise<T[]>;
  writeJson<T>(key: 'history' | 'alerts', value: T[]): Promise<boolean>;
}
