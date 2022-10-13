import { isDevMode } from '/@/utils/env';

// System default cache time, in seconds
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

// aes encryption key
export const cacheCipher = {
  key: 'un9PEuqqV31fqoXt56DzMbMzH7Klnk3g',
  iv: 'FxL3N5nZvlqCTFsJwUuLJ7CK4NS5ZCYx',
};

// Whether the system cache is encrypted using aes
export const enableStorageEncryption = !isDevMode();
