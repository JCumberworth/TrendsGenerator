
import { query } from './db';
import type { Trend, Report } from '@/types';

// Initialize database tables
export async function initializeTables() {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL not set, skipping database initialization');
    return;
  }

  try {
    // Create trends table
    await query(`
      CREATE TABLE IF NOT EXISTS trends (
        id SERIAL PRIMARY KEY,
        topic_name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        search_volume INTEGER,
        trend_score DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create reports table
    await query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        month VARCHAR(50) NOT NULL,
        report_markdown TEXT NOT NULL,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
}

// Trend operations
export async function getTrendsFromDB(): Promise<Trend[]> {
  const result = await query('SELECT * FROM trends ORDER BY created_at DESC');
  return result.rows;
}

export async function saveTrendsToDB(trends: Trend[]): Promise<void> {
  // Clear existing trends
  await query('DELETE FROM trends');
  
  // Insert new trends
  for (const trend of trends) {
    await query(
      'INSERT INTO trends (topic_name, category, search_volume, trend_score) VALUES ($1, $2, $3, $4)',
      [trend.topic_name, trend.category, trend.search_volume, trend.trend_score]
    );
  }
}

// Report operations
export async function getReportsFromDB(): Promise<Report[]> {
  const result = await query('SELECT * FROM reports ORDER BY generated_at DESC');
  return result.rows.map(row => ({
    id: row.id.toString(),
    month: row.month,
    generated_at: row.generated_at.toISOString(),
    report_markdown: row.report_markdown
  }));
}

export async function saveReportToDB(report: Omit<Report, 'id'>): Promise<string> {
  const result = await query(
    'INSERT INTO reports (month, report_markdown, generated_at) VALUES ($1, $2, $3) RETURNING id',
    [report.month, report.report_markdown, report.generated_at]
  );
  return result.rows[0].id.toString();
}

export async function getReportByIdFromDB(id: string): Promise<Report | null> {
  const result = await query('SELECT * FROM reports WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: row.id.toString(),
    month: row.month,
    generated_at: row.generated_at.toISOString(),
    report_markdown: row.report_markdown
  };
}
