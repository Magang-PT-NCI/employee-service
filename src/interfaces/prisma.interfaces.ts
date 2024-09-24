import { Position } from '../types/employee.types';

export interface Employee {
  nik: string;
  name: string;
  password: string;
  area: string;
  role: string;
  position: Position;
  profile_photo: string;
}

export interface ApiKey {
  id: number;
  key: string;
}
