
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type { Trend, Report } from '@/types';
import { mockTrends, mockReports } from './mock-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const TRENDS_FILE = path.join(DATA_DIR, 'trends.json');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');

interface DataStore {
  trends: Trend[];
  lastUpdated: string;
}

interface ReportsStore {
  reports: Report[];
  lastUpdated: string;
}

export async function ensureDataDirectory() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

export async function saveTrendsData(trends: Trend[]): Promise<void> {
  await ensureDataDirectory();
  const dataStore: DataStore = {
    trends,
    lastUpdated: new Date().toISOString(),
  };
  await writeFile(TRENDS_FILE, JSON.stringify(dataStore, null, 2));
}

export async function getTrendsData(): Promise<Trend[]> {
  try {
    if (!existsSync(TRENDS_FILE)) {
      // If no data file exists, return mock data and create initial file
      await saveTrendsData(mockTrends);
      return mockTrends;
    }

    const fileContent = await readFile(TRENDS_FILE, 'utf-8');
    const dataStore: DataStore = JSON.parse(fileContent);
    
    // Check if data is from today
    const lastUpdated = new Date(dataStore.lastUpdated);
    const today = new Date();
    const isToday = lastUpdated.toDateString() === today.toDateString();
    
    if (!isToday && dataStore.trends.length === 0) {
      // If data is old and empty, return mock data
      return mockTrends;
    }
    
    return dataStore.trends;
  } catch (error) {
    console.error('Error reading trends data:', error);
    return mockTrends;
  }
}

export async function saveReportsData(reports: Report[]): Promise<void> {
  await ensureDataDirectory();
  const reportsStore: ReportsStore = {
    reports,
    lastUpdated: new Date().toISOString(),
  };
  await writeFile(REPORTS_FILE, JSON.stringify(reportsStore, null, 2));
}

export async function getReportsData(): Promise<Report[]> {
  try {
    if (!existsSync(REPORTS_FILE)) {
      await saveReportsData(mockReports);
      return mockReports;
    }

    const fileContent = await readFile(REPORTS_FILE, 'utf-8');
    const reportsStore: ReportsStore = JSON.parse(fileContent);
    return reportsStore.reports;
  } catch (error) {
    console.error('Error reading reports data:', error);
    return mockReports;
  }
}
