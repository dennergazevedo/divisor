import { BigQuery } from "@google-cloud/bigquery";

const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  },
});

export async function queryBigQuery(query: string, params: any = {}) {
  const options = {
    query,
    params,
  };

  const [rows] = await bigquery.query(options);
  return rows;
}

export async function getExperimentPerformance(
  tenantId: string,
  experimentName: string,
) {
  const query = `
    SELECT 
  jsonPayload.variant AS variant,
  COUNT(*) as totalConversions,
  SUM(CAST(jsonPayload.value AS FLOAT64)) as totalValue,
  SUM(CAST(jsonPayload.itensCount AS INT64)) as totalItems
FROM \`${process.env.GOOGLE_PROJECT_ID}.divisor.conversion_logs_*\`
WHERE 
  jsonPayload.tenantId = @tenantId
  AND jsonPayload.experimentName = @experimentName
GROUP BY variant
  `;

  return queryBigQuery(query, { tenantId, experimentName });
}
