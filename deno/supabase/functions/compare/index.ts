//@ts-nocheck
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

console.log("Hello from comparison Function!")
const emailMetrics = [];


Deno.serve(async (req: any) => {
  const { comparisonAlert } = await req.json();
  console.log({ comparisonAlert })

  const myReport = await generateMyWebsiteReport(comparisonAlert.url, comparisonAlert.user_id);
  const competitorReport = await generateCompetitorReport(comparisonAlert.competitor_url, comparisonAlert.user_id);
  await compareMetrics(myReport, competitorReport, comparisonAlert.metrics, comparisonAlert.url, comparisonAlert.competitor_url, comparisonAlert.email, comparisonAlert);

  return new Response(JSON.stringify({ message: "Processes initiated", }), {
    headers: { "Content-Type": "application/json" },
  });

});

const generateMyWebsiteReport = async (myUrl: any, user_id: any) => {
  const apiUrl = `${Deno.env.get('NEXT_JS_API_BASE_URL')}/api/alert/sendAlert`;
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
  const generatedReport = data.data;
  return generatedReport;
}

const generateCompetitorReport = async (url: any, user_id: any) => {
  const apiUrl = `${Deno.env.get('NEXT_JS_API_BASE_URL')}/api/alert/sendAlert`;
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
  const generatedReport = data.data;
  return generatedReport;
}

async function compareMetrics(myReport: any, competitorReport: any, metrics: any, url: any, competitor_url: any, toEmail: any, comparisonAlert: any) {
  const myPerformanceScore = myReport?.performance * 100;
  const myAccessibilityScore = myReport?.accessibility * 100;
  const mySeoScore = myReport?.seo * 100;
  const myPwaScore = myReport?.pwa * 100;

  const competitorPerformanceScore = competitorReport?.performance * 100;
  const competitorAccessibilityScore = competitorReport?.accessibility * 100;
  const competitorSeoScore = competitorReport?.seo * 100;
  const competitorPwaScore = competitorReport?.pwa * 100;

  if (metrics.hasOwnProperty("Performance")) {
    const isReduced = myPerformanceScore < parseInt(competitorPerformanceScore)
    emailMetrics.push({
      name: "Performance",
      myScore: myPerformanceScore.toFixed(1),
      competitorScore: competitorPerformanceScore.toFixed(1),
      isReduced: isReduced
    });
    if (myPerformanceScore < parseInt(competitorPerformanceScore)) {
      console.log("Performance is reduced");
    }
  }

  if (metrics.hasOwnProperty("Accessibility")) {
    const isReduced = myAccessibilityScore < parseInt(competitorAccessibilityScore);
    emailMetrics.push({
      name: "Accessibility",
      myScore: myAccessibilityScore.toFixed(1),
      competitorScore: competitorAccessibilityScore.toFixed(1),
      isReduced: isReduced
    });
    if (myAccessibilityScore < parseInt(competitorAccessibilityScore)) {
      console.log("Accessibility is reduced");
    }
  }

  if (metrics.hasOwnProperty("SEO")) {
    emailMetrics.push({
      name: "SEO",
      myScore: mySeoScore.toFixed(1),
      competitorScore: competitorSeoScore.toFixed(1),
    });
    if (mySeoScore < parseInt(competitorSeoScore)) {
      console.log("SEO score is reduced");
    }
  }
  if (metrics.hasOwnProperty("PWA")) {
    emailMetrics.push({
      name: "PWA",
      myScore: myPwaScore.toFixed(1),
      competitorScore: competitorPwaScore.toFixed(1),
    });
    if (myPwaScore < parseInt(competitorPwaScore)) {
      console.log("PWA score is reduced");
    }
  }
  sendEmail(url, competitor_url, toEmail, comparisonAlert);
}

const sendEmail = async (url: any, competitor_url: any, toEmail: any, comparisonAlert: any) => {
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
      content: htmlReport(url, competitor_url),
      html: htmlReport(url, competitor_url),
    });

  } catch (error) {
    console.log({ error });
  } finally {
    await client.close();
    // Update the last_executed_at field for the processed alert
    // const { error: updateError } = await supabase
    //   .from('comparison_alert')
    //   .update({ last_executed_at: new Date().toISOString() })
    //   .eq('id', comparisonAlert.id);

    // if (updateError) {
    //   console.error('Error updating comparison alert:', updateError);
    // }
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
