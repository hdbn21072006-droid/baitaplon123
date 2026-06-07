import fs from 'fs';
import path from 'path';
import { dbPool } from '../config/database';

export const runPostgresMigration = async () => {
	try {
		console.log('[Migration] Starting PostgreSQL migration...');
		
		const sqlPath = path.join(__dirname, 'init_postgres.sql');
		const sql = fs.readFileSync(sqlPath, 'utf8');
		
		const client = await dbPool.connect();
		try {
			await client.query(sql);
			console.log('[Migration] PostgreSQL migration completed successfully!');
		} finally {
			client.release();
		}
	} catch (error) {
		console.error('[Migration] Error running PostgreSQL migration:', error);
		throw error;
	}
};

// Run if called directly
if (require.main === module) {
	runPostgresMigration()
		.then(() => {
			console.log('[Migration] Done');
			process.exit(0);
		})
		.catch((error) => {
			console.error('[Migration] Failed:', error);
			process.exit(1);
		});
}
