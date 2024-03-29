// pages/api/[...params].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import lighthouse from 'lighthouse';
import * as ChromeLauncher from 'chrome-launcher';
import Cors from 'cors';



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

const cors = Cors({
  methods: ['GET', 'HEAD', 'POST'], // Adjust the methods as needed
  origin: '*', // Adjust the origin as needed
});

type MiddlewareFn = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (err?: any) => void
) => void;

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: MiddlewareFn): Promise<any> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result?: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  await runMiddleware(req, res, cors);

  const { params } = req.query;

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!Array.isArray(params)) {
    return res.status(500).json({ error: 'Function not found' });
  }

  switch (params[0]) {
    case 'audit':
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
      break;
    default:
      return res.status(500).json({ error: 'Function not found' });
  }

}
