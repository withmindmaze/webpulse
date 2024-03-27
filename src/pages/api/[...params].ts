// pages/api/[...params].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import lighthouse from 'lighthouse';
import * as ChromeLauncher from 'chrome-launcher';

function setCorsHeaders(res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function runLighthouse(url: string): Promise<string> {

  const chrome = await ChromeLauncher.launch({
    startingUrl: 'https://google.com',
    chromeFlags: ['--headless', '--disable-gpu']
  });
  const options = { port: chrome.port };
  const runnerResult = await lighthouse(url, options);
  chrome.kill();
  const result = runnerResult?.report as string;
  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  setCorsHeaders(res);

  // Handle preflight requests for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
  }

  const { params } = req.query;

  if (params instanceof Array && params[0] === 'audit' && req.method === 'POST') {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required and must be a string' });
    }

    try {
      const reportHtml = await runLighthouse(url);
      res.status(200).send(reportHtml);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
