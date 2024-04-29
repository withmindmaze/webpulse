// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
//@ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supabase = createClient('https://kckpcztvngcakrpuxvcj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtja3BjenR2bmdjYWtycHV4dmNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzUyNzUwNiwiZXhwIjoyMDI5MTAzNTA2fQ.pgBXRDZcnq8J78ClKyT5vp6_ZfE1ZluXXNFgB7CJdms')
const RESEND_API_KEY = "re_a1FAKJKQ_N6JwbzUUv8vuBHQ8eNJur8qF";

console.log("Hello from Functions!")

//@ts-ignore
Deno.serve(async (req: any) => {
  const { } = await req.json();

  // Fetch all alerts from the "alert" table
  const { data: alerts, error } = await supabase
    .from('alert')
    .select('*');

  if (error) {
    console.error('Error fetching alerts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch alerts' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Process each alert record
  alerts.forEach(async (alert: any) => {
    const apiUrl = `http://zk4gkk8.141.164.47.85.sslip.io/api/audit`;
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: alert.url,
        categories: ["performance", "accessibility", "seo", "pwa"],
        device: "desktop",
        user_id: alert.user_id,
        generatedBy: "system",
      }),
    });

    const data = await apiResponse.json();
    const generatedReport = data.data.lhr;
    compareMetrics(alert.metrics, generatedReport);
  });

  return new Response(JSON.stringify({ message: "Processes initiated", }), {
    headers: { "Content-Type": "application/json" },
  });

})

function compareMetrics(storedMetrics: any, generatedReport: any) {
  const generatedPerformanceScore = generatedReport.categories.performance.score;
  const generatedAccessibilityScore = generatedReport.categories.accessibility.score;
  const generatedSeoScore = generatedReport.categories.seo.score;
  const generatedPwaScore = generatedReport.categories.pwa.score;

  const storedPerformanceScore = storedMetrics.Performance;
  const storedAccessibilityScore = storedMetrics.Accessibility;
  const storedSeoScore = storedMetrics.SEO;
  const storedPwaScore = storedMetrics.PWA;

  if (storedPerformanceScore) {
    if (generatedPerformanceScore < parseInt(storedPerformanceScore)) {
      console.log("Performance is reduced");
    }
  }

  if (storedAccessibilityScore) {
    if (generatedAccessibilityScore < parseInt(storedAccessibilityScore)) {
      console.log("Accessibility is reduced");
    }
  }

  if (storedSeoScore) {
    if (generatedSeoScore < parseInt(storedSeoScore)) {
      console.log("SEO score is reduced");
    }
  }
  if (storedPwaScore) {
    if (generatedPwaScore < parseInt(storedPwaScore)) {
      console.log("PWA score is reduced");
    }
  }
}

const sendEmail = async () => {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'jawad@withmindmaze.com',
      to: 'jawadakhter7@gmail.com',
      subject: 'hello world',
      html: '<strong>it works!</strong>',
    }),
  })

  const data = await res.json();
  console.log("Email response", data);
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/audit' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
