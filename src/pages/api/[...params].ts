// pages/api/[...params].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import lighthouse, { OutputMode, Config } from 'lighthouse';
import * as ChromeLauncher from 'chrome-launcher';
import nextCors from 'nextjs-cors';

async function runLighthouse(url: string, categories: string[], device: string): Promise<any> {

  const chrome = await ChromeLauncher.launch({
    startingUrl: 'https://google.com',
    chromeFlags: ['--headless', '--disable-gpu', '--remote-debugging-port=9222'],
  });
  const options = {
    port: chrome.port,
    onlyCategories: categories,
    output: "html" as OutputMode,
  };
  const mobileEmulation = {
    mobile: true,
    width: 360,
    height: 640,
    deviceScaleFactor: 2.625,
    disabled: false,
  };
  const desktopEmulation = {
    mobile: false,
    width: 1350,
    height: 940,
    deviceScaleFactor: 1,
    disabled: false,
  }

  const config = {
    extends: 'lighthouse:default',
    settings: {
      formFactor: device === 'desktop' ? 'desktop' : 'mobile',
      screenEmulation: device === 'desktop' ? desktopEmulation : mobileEmulation,
    } as Config.Settings
  };

  const runnerResult = await lighthouse(url, options, config);
  chrome.kill();
  // const result = runnerResult?.report as string;
  return runnerResult;
}

// type MiddlewareFn = (
//   req: NextApiRequest,
//   res: NextApiResponse,
//   next: (err?: any) => void
// ) => void;

// function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: MiddlewareFn): Promise<any> {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result?: any) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Initialize CORS middleware
  await nextCors(req, res, {
    methods: ['POST', 'OPTIONS'],
    origin: '*',
    allowedHeaders: ['Content-Type'],
  });

  const { params } = req.query;

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!Array.isArray(params)) {
    return res.status(500).json({ error: 'Function not found' });
  }

  console.log("🚀 ~ handler ~ params[0:", params[0]);
  console.log("🚀 ~ handler ~ req.body:", req.body)
  switch (params[0]) {
    case 'audit':
      const { url, categories, device } = req.body;

      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required and must be a string' });
      }

      if (!categories || !Array.isArray(categories)) {
        return res.status(400).json({ error: 'Categories must be an array' });
      }

      if (!device || typeof device !== 'string') {
        return res.status(400).json({ error: 'Device is required and must be a string' });
      }

      try {
        const reportHtml = await runLighthouse(url, categories, device);
        res.status(200).send(reportHtml);
      } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
      }
      break;
    default:
      return res.status(500).json({ error: 'Function not found' });
  }

}
