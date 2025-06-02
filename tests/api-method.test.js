import assert from 'node:assert/strict';
import { GET as getTrends } from '../src/app/api/trends/route.ts';
import { GET as getReports } from '../src/app/api/reports/route.ts';
import { GET as getReport } from '../src/app/api/reports/[reportId]/route.ts';
import { POST as analyzeTrends } from '../src/app/api/ai/analyze-trends/route.ts';
import { POST as analyzeIdea } from '../src/app/api/ai/analyze-idea/route.ts';
import { POST as generateIdeas } from '../src/app/api/ai/generate-ideas/route.ts';
import { POST as generateReport } from '../src/app/api/ai/generate-report/route.ts';

const routes = [
  [getTrends, 'POST'],
  [getReports, 'POST'],
  [req => getReport(req, { params: { reportId: '1' } }), 'POST'],
  [analyzeTrends, 'GET'],
  [analyzeIdea, 'GET'],
  [generateIdeas, 'GET'],
  [generateReport, 'GET'],
];

test('routes return 405 for unsupported methods', async () => {
  for (const [handler, wrongMethod] of routes) {
    const res = await handler(new Request('http://localhost', { method: wrongMethod }));
    assert.equal(res.status, 405);
  }
});
