//@ts-nocheck
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supabase = createClient('https://kckpcztvngcakrpuxvcj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtja3BjenR2bmdjYWtycHV4dmNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzUyNzUwNiwiZXhwIjoyMDI5MTAzNTA2fQ.pgBXRDZcnq8J78ClKyT5vp6_ZfE1ZluXXNFgB7CJdms')

import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

console.log("Hello from send alert Function!");
const metrics = [];

Deno.serve(async (req: any) => {
  const { alert } = await req.json();
  console.log({ alert: alert });
  console.log({
    env1: Deno.env.get('NEXT_JS_API_BASE_URL'),
  });

  // Process each alert record
  const apiUrl = `${Deno.env.get('NEXT_JS_API_BASE_URL')}/api/alert/sendAlert`;
  const apiResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: alert.url,
      device: "desktop",
      user_id: alert.user_id,
      generatedBy: "system",
    }),
  });

  const data = await apiResponse.json();
  const generatedReport = data.data;
  await compareMetrics(alert.metrics, generatedReport, alert.url, alert.email, alert);

  return new Response(JSON.stringify({ message: "Processes initiated", }), {
    headers: { "Content-Type": "application/json" },
  });
})

async function compareMetrics(storedMetrics: any, generatedReport: any, url: any, toEmail: any, alert: any) {
  const generatedPerformanceScore = generatedReport?.performance * 100;
  const generatedAccessibilityScore = generatedReport?.accessibility * 100;
  const generatedSeoScore = generatedReport?.seo * 100;
  const generatedPwaScore = generatedReport?.pwa * 100;

  const storedPerformanceScore = storedMetrics?.Performance;
  const storedAccessibilityScore = storedMetrics?.Accessibility;
  const storedSeoScore = storedMetrics?.SEO;
  const storedPwaScore = storedMetrics?.PWA;

  if (storedPerformanceScore) {
    const isReduced = generatedPerformanceScore < parseInt(storedPerformanceScore);
    metrics.push({
      name: "Performance",
      score: generatedPerformanceScore.toFixed(1),
      threshold: storedPerformanceScore,
      isReduced: isReduced
    });
    if (isReduced) {
      console.log("Performance is reduced");
    }
  }

  if (storedAccessibilityScore) {
    const isReduced = generatedAccessibilityScore < parseInt(storedAccessibilityScore);
    metrics.push({
      name: "Accessibility",
      score: generatedAccessibilityScore.toFixed(1),
      threshold: storedAccessibilityScore,
      isReduced: isReduced
    });
    if (isReduced) {
      console.log("Accessibility is reduced");
    }
  }

  if (storedSeoScore) {
    const isReduced = generatedSeoScore < parseInt(storedSeoScore);
    metrics.push({
      name: "SEO",
      score: generatedSeoScore.toFixed(1),
      threshold: storedSeoScore,
      isReduced: isReduced
    });
    if (isReduced) {
      console.log("SEO score is reduced");
    }
  }
  if (storedPwaScore) {
    const isReduced = generatedPwaScore < parseInt(storedPwaScore);
    metrics.push({
      name: "PWA",
      score: generatedPwaScore.toFixed(1),
      threshold: storedPwaScore,
      isReduced: isReduced
    });
    if (isReduced) {
      console.log("PWA score is reduced");
    }
  }
  sendEmail(url, toEmail, alert);
}

const sendEmail = async (url: any, toEmail: any, alert: any) => {
  const client = new SMTPClient({
    connection: {
      hostname: Deno.env.get('SMTP_HOST'),
      port: 465,
      tls: true,
      auth: {
        username: Deno.env.get('SMTP_USERNAME'),
        password: Deno.env.get('SMPTP_PASSWORD'),
      },
    },
  });

  try {
    await client.send({
      from: Deno.env.get('EMAIL_FROM'),
      to: toEmail,
      subject: "Audit Alert",
      content: htmlReport(url),
      html: htmlReport(url),
    });

  } catch (error) {
    console.log({ error });
  } finally {
    await client.close();
  }
}

const htmlReport = (url: any) => {
  const emailBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #4CAF50;
            color: white;
        }
        .reduced {
            color: red;
        }
    </style>
    </head>
    <body>
    <div class="email-container">
        <h2>Website Audit Report</h2>
        <h3>My Website: ${url}</h3>
        <table>
            <tr>
                <th>Metric</th>
                <th>Score</th>
                <th>Threshold</th>
            </tr>
            ${metrics.map(metric => `<tr class="${metric.isReduced ? 'reduced' : ''}"><td>${metric.name}</td><td>${metric.score}</td><td>${metric.threshold}</td></tr>`).join('')}
        </table>
    </div>
    </body>
    </html>`;
  return emailBody;
}


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/audit' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
