import { config } from 'dotenv';

config();

export const PORT: number = parseInt(process.env.PORT) || 3001;
export const SECRET_KEY: string = process.env.SECRET_KEY || 'rahasia';
