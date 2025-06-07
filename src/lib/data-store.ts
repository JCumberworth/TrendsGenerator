import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Trend, Report } from '@/types';

const DATA_DIR = join(process.cwd(), 'data');

export function getTrendsData(): Trend[] {
  try {
    const filePath = join(DATA_DIR, 'trends.json');
    if (!existsSync(filePath)) {
      return [];
    }
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading trends data:', error);
    return [];
  }
}

export function getReportsData(): Report[] {
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

export function saveTrendsData(trends: Trend[]): void {
  try {
    const filePath = join(DATA_DIR, 'trends.json');
    writeFileSync(filePath, JSON.stringify(trends, null, 2));
  } catch (error) {
    console.error('Error saving trends data:', error);
  }
}

export function saveReportsData(reports: Report[]): void {
  try {
    const filePath = join(DATA_DIR, 'reports.json');
    writeFileSync(filePath, JSON.stringify(reports, null, 2));
  } catch (error) {
    console.error('Error saving reports data:', error);
  }
}