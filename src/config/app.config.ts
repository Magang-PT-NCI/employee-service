import { config } from 'dotenv';
import * as process from 'node:process';

config();

export const PORT: number = parseInt(process.env.PORT) || 3001;
export const SECRET_KEY: string = process.env.SECRET_KEY || 'rahasia';
