import { config } from 'dotenv';

config();

export const PORT: number = parseInt(process.env.PORT) || 3001;
export const SECRET_KEY: string = process.env.SECRET_KEY || 'rahasia';
export const SECURED: boolean =
  process.env.SECURED?.toLowerCase() === 'true' || false;
export const KEY_FILE: string = process.env.KEY_FILE;
export const CERTIFICATE_FILE: string = process.env.CERTIFICATE_FILE;
