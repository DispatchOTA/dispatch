// env
export const ENV_DEVELOPMENT = 'development';
export const ENV_PRODUCTION = 'production';
export const ENV_TEST = 'test';
export const ENV_PROVISION = 'provision';

// infra
export const ARTIFACTS_BUCKET = 'artifacts';

// validation
export const MIN_ID_LEN = 1;
export const MAX_ID_LEN = 500;
export const MIN_DESC_LEN = 0;
export const MAX_DESC_LEN = 5000;
export const MIN_FILENAME_LEN = 2;
export const MAX_FILENAME_LEN = 50;
export const MIN_FILE_SIZE = 1;
export const MAX_FILE_SIZE = 1073741824; // 1GB in bytes
export const POLLING_TIME_REGEX = /^([0-9]{2}):([0-9]{2}):([0-9]{2})$/; // HH:MM:SS

// defaults
export const DEFAULT_POLLING_TIME = '01:00:00'; // 1 hour
export const DEFAULT_DEV_ORIGIN = 'http://localhost:3000';
export const DEFAULT_DEV_PORT = 3000;
