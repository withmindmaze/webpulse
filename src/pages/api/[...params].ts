import supabase from '@/utils/supabaseClient';
import * as ChromeLauncher from 'chrome-launcher';
import lighthouse, { Config, OutputMode } from 'lighthouse';
import type { NextApiRequest, NextApiResponse } from 'next';
import nextCors from 'nextjs-cors';

export const config = {
  api: {
    responseLimit: false,
  },
}

function runLighthouse(url: string, categories: string[], device: string): Promise<any> {
  return ChromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
  })
    .then(chrome => {
      console.log(`Chrome launched with debugging port: ${chrome.port}`);

      const options = {
        port: chrome.port,
        onlyCategories: categories,
        output: "html" as OutputMode,
        preset: 'desktop',
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
      };

      const config = {
        extends: 'lighthouse:default',
        settings: {
          formFactor: device === 'desktop' ? 'desktop' : 'mobile',
          throttling: {
            rttMs: 40,
            throughputKbps: 10240,
            cpuSlowdownMultiplier: 1,
            requestLatencyMs: 0,
            downloadThroughputKbps: 0,
            uploadThroughputKbps: 0
          },
          screenEmulation: device === 'desktop' ? desktopEmulation : mobileEmulation,
          emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4143.7 Safari/537.36 Chrome-Lighthouse'
        } as Config.Settings
      };

      return lighthouse(url, options, config)
        .then(runnerResult => {
          chrome.kill();
          console.log("Chrome was killed");
          return runnerResult;
        })
        .catch(err => {
          chrome.kill();
          console.error("Chrome was killed");
          console.error("Error during Lighthouse run:", err);
          throw err;
        }).finally(() => {
          if (chrome)
            chrome.kill();
        });
    })
    .catch(err => {
      console.error("Failed to generate report:", err);
      throw err;
    });
}


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
  console.log("🚀 ~ handler ~ req.body:", req.body);

  switch (params[0]) {
    case 'audit':
      const { url, categories, device, user_id, generatedBy } = req.body;

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
        const runnerResult = await runLighthouse(url, categories, device);
        const jsonReport = runnerResult?.lhr
        if (user_id !== undefined) {
          const reportData = await supabase
            .from('report')
            .insert([{
              user_id,
              json_report: jsonReport,
              url,
              generated_by: generatedBy ? generatedBy : 'user'
            }]);
          console.log(reportData);
        }
        res.status(200).json({ data: runnerResult, jsonReport: jsonReport });
      } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
      }
      break;
    default:
      return res.status(500).json({ error: 'Function not found' });
  }
}
