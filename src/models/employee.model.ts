import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../utils/prisma.utils';
import { EmployeeResBody } from '../dto/employee.dto';
import { Position } from '../types/employee.types';
import { Employee } from '../interfaces/prisma.interfaces';

export class EmployeeModel {
  private static prisma: PrismaClient = getPrismaClient();

  public nik: string;
  public name: string;
  public password: string;
  public area: string;
  public role: string;
  public position: Position;
  public profilePhoto: string;

  static async get(nik: string): Promise<EmployeeModel | null> {
    const result: Employee = await EmployeeModel.prisma.employee.findUnique({
      where: { nik },
    });

    if (!result) {
      return null;
    }

    const employee: EmployeeModel = new EmployeeModel();
    employee.nik = result.nik;
    employee.name = result.name;
    employee.password = result.password;
    employee.area = result.area;
    employee.role = result.role;
    employee.position = result.position;
    employee.profilePhoto = result.profile_photo;

    return employee;
  }

  getProfilePhoto(): string {
    return `https://lh3.googleusercontent.com/d/${this.profilePhoto}=s220`;
  }

  getResData(): EmployeeResBody {
    return {
      nik: this.nik,
      name: this.name,
      area: this.area,
      role: this.role,
      position: this.position,
    };
  }
}
