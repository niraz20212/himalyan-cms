const path = require('path');
const app = require('./app');
const prisma = require('./config/db');
const env = require('./config/env');
const runCommand = require('./utils/runCommand');

const projectRoot = path.resolve(__dirname, '..');

const syncDatabaseSchema = async () => {
  if (!env.autoDbPushOnStart) {
    return;
  }

  console.log('Syncing database schema with Prisma...');
  runCommand('npx prisma db push --skip-generate', projectRoot);
};

const seedDatabaseIfEnabled = async () => {
  if (!env.autoDbSeedOnStart) {
    return;
  }

  const userCount = await prisma.user.count();
  if (userCount > 0) {
    return;
  }

  console.log('Seeding database...');
  runCommand('node src/seed/seed.js', projectRoot);
};

const startServer = async () => {
  try {
    await syncDatabaseSchema();
    await prisma.$connect();
    await seedDatabaseIfEnabled();

    app.listen(env.port, () => {
      console.log(`API running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
