import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const areas = ['Bandung', 'Cimahi', 'Jakarta'];
const roles = [
  'Frontend Developer',
  'Backend Developer',
  'UI/UX Designer',
  'System Analyst',
  'Data Analyst',
];

let nikCounter = 1;

const getRandomData = (source: string[]) => {
  return source[Math.floor(Math.random() * source.length)];
};

const getPassword = (name: string) => {
  const splitName = name.split(' ');
  const firstName = splitName[0].toLowerCase();
  const secondName = splitName[1].toLowerCase();
  return bcrypt.hashSync(`${firstName}${secondName}123`, 10);
};

const createEmployee = async (user: any) => {
  const nik = '0012300456007' + `${nikCounter++}`.padStart(2, '0');
  const password = getPassword(user.name);
  const area = getRandomData(areas);
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
  createEmployee({ name: 'Aditya Wijaya Putra' });
  createEmployee({ name: 'Rina Andriani' });
  createEmployee({ name: 'Budi Santoso' });
  createEmployee({ name: 'Maria Hadiyanti' });
  createEmployee({ name: 'Dewa Prasetyo' });
  createEmployee({ name: 'Dini Kusuma Wardani' });
  createEmployee({ name: 'Arif Rahman Hakim' });
  createEmployee({ name: 'Lestari Wulandari', position: 'Koordinator' });
  createEmployee({ name: 'Indra Gunawan' });
  createEmployee({ name: 'Siti Fatimah' });
  createEmployee({ name: 'Agus Supriadi' });
  createEmployee({ name: 'Retno Maharani' });
  createEmployee({ name: 'Eko Saputro' });
  createEmployee({ name: 'Yuli Kartika Sari' });
  createEmployee({ name: 'Joko Susanto', position: 'Koordinator' });

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
