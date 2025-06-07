
import { initializeTables } from '../src/lib/db-models';

async function main() {
  console.log('Initializing database tables...');
  
  try {
    await initializeTables();
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

main();
