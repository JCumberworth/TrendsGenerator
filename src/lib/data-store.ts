
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Trend, Report } from '@/types';
import { 
  getTrendsFromDB, 
  saveTrendsToDB, 
  getReportsFromDB, 
  saveReportToDB,
  getReportByIdFromDB,
  initializeTables 
} from './db-models';

const DATA_DIR = join(process.cwd(), 'data');

// Initialize database on first import
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized && process.env.DATABASE_URL) {
    try {
      await initializeTables();
      dbInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }
}

export async function getTrendsData(): Promise<Trend[]> {
  await ensureDbInitialized();
  
  // Try database first if available
  if (process.env.DATABASE_URL) {
    try {
      return await getTrendsFromDB();
    } catch (error) {
      console.error('Error reading trends from database, falling back to file:', error);
    }
  }

  // Fallback to file system
  try {
    const filePath = join(DATA_DIR, 'trends.json');
    if (!existsSync(filePath)) {
      return [];
    }
    const data = readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Handle both array format (old) and object format (new with trends property)
    if (Array.isArray(parsed)) {
      return parsed;
    } else if (parsed.trends && Array.isArray(parsed.trends)) {
      return parsed.trends;
    }
    
    return [];
  } catch (error) {
    console.error('Error reading trends data:', error);
    return [];
  }
}

export async function getReportsData(): Promise<Report[]> {
  await ensureDbInitialized();
  
  // Try database first if available
  if (process.env.DATABASE_URL) {
    try {
      return await getReportsFromDB();
    } catch (error) {
      console.error('Error reading reports from database, falling back to file:', error);
    }
  }

  // Fallback to file system
  try {
    const filePath = join(DATA_DIR, 'reports.json');
    if (!existsSync(filePath)) {
      return [];
    }
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading reports data:', error);
    return [];
  }
}

export async function saveTrendsData(trends: Trend[]): Promise<void> {
  await ensureDbInitialized();
  
  // Save to database if available
  if (process.env.DATABASE_URL) {
    try {
      await saveTrendsToDB(trends);
      return;
    } catch (error) {
      console.error('Error saving trends to database, falling back to file:', error);
    }
  }

  // Fallback to file system
  try {
    const filePath = join(DATA_DIR, 'trends.json');
    const dataToSave = {
      trends: trends,
      lastUpdated: new Date().toISOString()
    };
    writeFileSync(filePath, JSON.stringify(dataToSave, null, 2));
  } catch (error) {
    console.error('Error saving trends data:', error);
  }
}

export async function saveReportsData(reports: Report[]): Promise<void> {
  await ensureDbInitialized();
  
  // Save to database if available
  if (process.env.DATABASE_URL) {
    try {
      // For multiple reports, save each one individually
      for (const report of reports) {
        await saveReportToDB(report);
      }
      return;
    } catch (error) {
      console.error('Error saving reports to database, falling back to file:', error);
    }
  }

  // Fallback to file system
  try {
    const filePath = join(DATA_DIR, 'reports.json');
    writeFileSync(filePath, JSON.stringify(reports, null, 2));
  } catch (error) {
    console.error('Error saving reports data:', error);
  }
}

export async function getReportById(id: string): Promise<Report | null> {
  await ensureDbInitialized();
  
  // Try database first if available
  if (process.env.DATABASE_URL) {
    try {
      return await getReportByIdFromDB(id);
    } catch (error) {
      console.error('Error reading report from database, falling back to file:', error);
    }
  }

  // Fallback to file system
  const reports = await getReportsData();
  return reports.find(report => report.id === id) || null;
}
