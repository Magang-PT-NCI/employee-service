import * as bcrypt from 'bcrypt';
import { PrismaClient, Position } from '@prisma/client';

const prisma = new PrismaClient();
const roles = [
  'Frontend Developer',
  'Backend Developer',
  'UI/UX Designer',
  'System Analyst',
  'Data Analyst',
];

let nikCounter = 1;

const getRandomData = (source: string[]): string => {
  return source[Math.floor(Math.random() * source.length)];
};

const getPassword = (name: string): string => {
  const splitName = name.split(' ');
  const firstName = splitName[0].toLowerCase();
  const secondName = splitName[1].toLowerCase();
  return bcrypt.hashSync(`${firstName}${secondName}123`, 10);
};

interface Employee {
  name: string;
  area: string;
  position?: Position;
  profile_photo?: string;
}

const createEmployee = async (user: Employee) => {
  const nik = '0012300456007' + `${nikCounter++}`.padStart(2, '0');
  const password = getPassword(user.name);
  const area = user.area;
  const profile_photo =
    user.profile_photo ?? '17ZxcvViTexCuS_j_Vve2CKTyHG7iu0aY';
  const position = user.position ?? 'OnSite';
  const role =
    user.position === 'Koordinator' ? position : getRandomData(roles);

  await prisma.employee.create({
    data: {
      nik,
      password,
      area,
      profile_photo,
      position,
      role,
      ...user,
    },
  });
};

const main = async () => {
  await createEmployee({ name: 'Aditya Wijaya Putra', area: 'Surabaya' });
  await createEmployee({ name: 'Rina Andriani', area: 'Surabaya' });
  await createEmployee({ name: 'Budi Santoso', area: 'Surabaya' });
  await createEmployee({ name: 'Maria Hadiyanti', area: 'Surabaya' });
  await createEmployee({ name: 'Dewa Prasetyo', area: 'Surabaya' });
  await createEmployee({ name: 'Dini Kusuma Wardani', area: 'Surabaya' });
  await createEmployee({ name: 'Arif Rahman Hakim', area: 'Surabaya' });
  await createEmployee({
    name: 'Lestari Wulandari',
    position: 'Koordinator',
    area: 'Surabaya',
  });
  await createEmployee({ name: 'Indra Gunawan', area: 'Jakarta' });
  await createEmployee({ name: 'Siti Fatimah', area: 'Jakarta' });
  await createEmployee({ name: 'Agus Supriadi', area: 'Jakarta' });
  await createEmployee({ name: 'Retno Maharani', area: 'Jakarta' });
  await createEmployee({ name: 'Eko Saputro', area: 'Jakarta' });
  await createEmployee({ name: 'Yuli Kartika Sari', area: 'Jakarta' });
  await createEmployee({
    name: 'Joko Susanto',
    position: 'Koordinator',
    area: 'Jakarta',
  });

  await prisma.apiKey.createMany({
    data: [
      { key: '3f9cA1b7X5e4P8k9M2rQ6tJ8uY3sL7dZ' },
      { key: 'w9E4m2N7q6B8a5F3x1L7R5k8pZ2J9vT1' },
    ],
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
