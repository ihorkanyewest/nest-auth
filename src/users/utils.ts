import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';

export const scrypt = promisify(_scrypt);

export const generateSalt: () => string = () => randomBytes(8).toString('hex');

export const generateHash: (
  primary: string,
  secondary: string,
) => Promise<string> = async (primary, secondary) => {
  const hash = (await scrypt(primary, secondary, 32)) as Buffer;

  return new Promise((resolve) => {
    resolve(hash.toString('hex'));
  });
};

export const generateCryptedPassword: (
  password: string,
) => Promise<string> = async (password) => {
  const salt = generateSalt();

  const hash = await generateHash(password, salt);

  return new Promise((resolve) => {
    resolve(`${salt}.${hash}`);
  });
};

export const comparePasswords: (
  storedPassword: string,
  password: string,
) => Promise<boolean> = async (storedPassword, password) => {
  const [salt, storedHash] = storedPassword.split('.');

  const hash = await generateHash(password, salt);

  return new Promise((resolve) => {
    resolve(storedHash === hash);
  });
};
