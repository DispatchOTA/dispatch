import { randomBytes, createHash as cryptoHash } from 'crypto';

export const createRandomToken = () => randomBytes(16).toString('hex'); // 32 char random string

export const createHash = (algo: 'md5' | 'sha1' | 'sha256', payload: Buffer | string): string => {
  switch (algo) {
    case 'md5':
      return cryptoHash('md5').update(payload).digest('hex');
    case 'sha1':
      return cryptoHash('sha1').update(payload).digest('hex');
    case 'sha256':
      return cryptoHash('sha256').update(payload).digest('hex');
    default:
      throw new Error(`Invalid algorithm: ${algo}`);
  }
};
