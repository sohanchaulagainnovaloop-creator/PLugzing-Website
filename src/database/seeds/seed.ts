import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../../modules/users/entities/user.entity';
import { UserRole } from '../../modules/auth/enums/user-role.enum';

const dataSource = new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [User],
});

async function seed() {
  await dataSource.initialize();

  console.log('Database connected.');

  const userRepository = dataSource.getRepository(User);

  const adminEmail = 'sohan@example.com';

  let admin = await userRepository.findOne({
    where: { email: adminEmail },
  });

  if (!admin) {
    admin = userRepository.create({
      name: 'Sohan',
      email: adminEmail,
      password: await bcrypt.hash('Admin123!', 10),
      role: UserRole.ADMIN,
    });

    await userRepository.save(admin);

    console.log('Admin user created.');
  } else {
    console.log('Admin user already exists.');
  }

  const userEmail = 'user@example.com';

  let user = await userRepository.findOne({
    where: { email: userEmail },
  });

  if (!user) {
    user = userRepository.create({
      name: 'Normal User',
      email: userEmail,
      password: await bcrypt.hash('User123!', 10),
      role: UserRole.USER,
    });

    await userRepository.save(user);

    console.log('Normal user created.');
  } else {
    console.log('Normal user already exists.');
  }

  await dataSource.destroy();

  console.log('Seeding completed.');
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
