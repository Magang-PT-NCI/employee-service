import { config } from 'dotenv';
import * as process from 'node:process';

config();

export const PORT = process.env.PORT || 3001;
export const SECRET_KEY = process.env.SECRET_KEY || 'rahasia';
