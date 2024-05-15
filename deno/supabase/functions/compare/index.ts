//@ts-nocheck
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supabase = createClient('https://kckpcztvngcakrpuxvcj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtja3BjenR2bmdjYWtycHV4dmNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzUyNzUwNiwiZXhwIjoyMDI5MTAzNTA2fQ.pgBXRDZcnq8J78ClKyT5vp6_ZfE1ZluXXNFgB7CJdms');
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

console.log("Hello from comparison Function!")
const emailMetrics = [];


Deno.serve(async (req: any) => {
  // const { } = await req.json();

  // Fetch the first alert where last_executed_at is null
  const { data: comparisonAlerts, error } = await supabase
    .from('comparison_alert')
    .select('*')
    .is('last_executed_at', null)
    .limit(1);

  const comparisonAlert = comparisonAlerts[0];

  if (error) {
    console.error('Error fetching comparison alerts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch comparison alerts' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (comparisonAlert.length === 0) {
    return new Response(JSON.stringify({ message: 'No comparison alerts to process' }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Process each alert record
  // comparisonAlert.forEach(async (alert: any) => {
  const myReport = await generateMyWebsiteReport(comparisonAlert.url, comparisonAlert.user_id);
  const competitorReport = await generateCompetitorReport(comparisonAlert.competitor_url, comparisonAlert.user_id);
  await compareMetrics(myReport, competitorReport, comparisonAlert.metrics, comparisonAlert.url, comparisonAlert.competitor_url, comparisonAlert.email);
  // });

  // Update the last_executed_at field for the processed alert
  const { error: updateError } = await supabase
    .from('comparison_alert')
    .update({ last_executed_at: new Date().toISOString() })
    .eq('id', comparisonAlert.id);

  if (updateError) {
    console.error('Error updating comparison alert:', updateError);
    return new Response(JSON.stringify({ error: 'Failed to update comparison alert' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ message: "Processes initiated", }), {
    headers: { "Content-Type": "application/json" },
  });

});

const generateMyWebsiteReport = async (myUrl: any, user_id: any) => {
  const apiUrl = `http://zk4gkk8.141.164.47.85.sslip.io/api/audit`;
  const apiResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: myUrl,
      categories: ["performance", "accessibility", "seo", "pwa"],
      device: "desktop",
      user_id: user_id,
      generatedBy: "system",
    }),
  });

  const data = await apiResponse.json();
  const generatedReport = data.data.lhr;
  return generatedReport;
}

const generateCompetitorReport = async (url: any, user_id: any) => {
  const apiUrl = `http://zk4gkk8.141.164.47.85.sslip.io/api/audit`;
  const apiResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url,
      categories: ["performance", "accessibility", "seo", "pwa"],
      device: "desktop",
      user_id: user_id,
      generatedBy: "system",
    }),
  });

  const data = await apiResponse.json();
  const generatedReport = data.data.lhr;
  return generatedReport;
}

async function compareMetrics(myReport: any, competitorReport: any, metrics: any, url: any, competitor_url: any, toEmail: any) {
  const myPerformanceScore = myReport.categories.performance.score * 100;
  const myAccessibilityScore = myReport.categories.accessibility.score * 100;
  const mySeoScore = myReport.categories.seo.score * 100;
  const myPwaScore = myReport.categories.pwa.score * 100;

  const competitorPerformanceScore = competitorReport.categories.performance.score * 100;
  const competitorAccessibilityScore = competitorReport.categories.accessibility.score * 100;
  const competitorSeoScore = competitorReport.categories.seo.score * 100;
  const competitorPwaScore = competitorReport.categories.pwa.score * 100;

  if (metrics.includes("Performance")) {
    const isReduced = myPerformanceScore < parseInt(competitorPerformanceScore)
    emailMetrics.push({
      name: "Performance",
      myScore: myPerformanceScore,
      competitorScore: competitorPerformanceScore,
      isReduced: isReduced
    });
    if (myPerformanceScore < parseInt(competitorPerformanceScore)) {
      console.log("Performance is reduced");
    }
  }

  if (metrics.includes("Accessibility")) {
    const isReduced = myAccessibilityScore < parseInt(competitorAccessibilityScore);
    emailMetrics.push({
      name: "Accessibility",
      myScore: myAccessibilityScore,
      competitorScore: competitorAccessibilityScore,
      isReduced: isReduced
    });
    if (myAccessibilityScore < parseInt(competitorAccessibilityScore)) {
      console.log("Accessibility is reduced");
    }
  }

  if (metrics.includes("SEO")) {
    emailMetrics.push({
      name: "SEO",
      myScore: mySeoScore,
      competitorScore: competitorSeoScore,
    });
    if (mySeoScore < parseInt(competitorSeoScore)) {
      console.log("SEO score is reduced");
    }
  }
  if (metrics.includes("PWA")) {
    emailMetrics.push({
      name: "PWA",
      myScore: myPwaScore,
      competitorScore: competitorPwaScore,
    });
    if (myPwaScore < parseInt(competitorPwaScore)) {
      console.log("PWA score is reduced");
    }
  }
  sendEmail(url, competitor_url, toEmail);
}

const sendEmail = async (url: any, competitor_url: any, toEmail: any) => {
  const client = new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: {
        username: "jawadakhter7@gmail.com",
        password: "xquzjmzerdumzpen",
      },
    },
  });

  try {
    await client.send({
      from: "jawadakhter7@gmail.com",
      to: toEmail,
      subject: "Audit Alert",
      content: htmlReport(url, competitor_url),
      html: htmlReport(url, competitor_url),
    });

  } catch (error) {
    console.log({ error });
  } finally {
    await client.close();
  }
}

const htmlReport = (url: any, competitor_url: any) => {
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
        .lower-score {
            background-color: #ffcccc; /* Light red background for lower scores */
        }
    </style>
    </head>
    <body>
    <div class="email-container">
        <h2>Website Audit Report</h2>
        <h3>My Website: ${url}</h3>
        <h3>Competitor Website: ${competitor_url}</h3>
        <table>
            <tr>
                <th>Metric</th>
                <th>My Score</th>
                <th>Competitor Score</th>
            </tr>
            ${emailMetrics.map(metric => `<tr class="${metric.myScore < metric.competitorScore ? 'lower-score' : ''}"><td>${metric.name}</td><td>${metric.myScore}</td><td>${metric.competitorScore}</td> </tr>`).join('')}
        </table>
    </div>
    </body>
    </html>`;
  return emailBody;
}



/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/compare' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
