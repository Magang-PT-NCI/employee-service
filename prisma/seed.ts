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
  await createEmployee({ name: 'Aditya Wijaya Putra' });
  await createEmployee({ name: 'Rina Andriani' });
  await createEmployee({ name: 'Budi Santoso' });
  await createEmployee({ name: 'Maria Hadiyanti' });
  await createEmployee({ name: 'Dewa Prasetyo' });
  await createEmployee({ name: 'Dini Kusuma Wardani' });
  await createEmployee({ name: 'Arif Rahman Hakim' });
  await createEmployee({ name: 'Lestari Wulandari', position: 'Koordinator' });
  await createEmployee({ name: 'Indra Gunawan' });
  await createEmployee({ name: 'Siti Fatimah' });
  await createEmployee({ name: 'Agus Supriadi' });
  await createEmployee({ name: 'Retno Maharani' });
  await createEmployee({ name: 'Eko Saputro' });
  await createEmployee({ name: 'Yuli Kartika Sari' });
  await createEmployee({ name: 'Joko Susanto', position: 'Koordinator' });

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
