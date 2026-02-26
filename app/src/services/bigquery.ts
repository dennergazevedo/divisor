import { BigQuery, Query } from '@google-cloud/bigquery'

const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  },
})

/* =========================================================
   Types
========================================================= */

type QueryParams = Record<string, any>

interface QueryBigQueryOptions {
  dryRun?: boolean
  jobTimeoutMs?: number
  maxBytesBilled?: number
}

export interface ExperimentPerformanceRow {
  variant: string
  totalConversions: number
  totalValue: number
  totalItems: number
}

/* =========================================================
   Core Query Function
========================================================= */

export async function queryBigQuery<T = any>(
  query: string,
  params: QueryParams = {},
  options: QueryBigQueryOptions = {},
): Promise<T[]> {
  const queryOptions: Query = {
    query,
    params,
    parameterMode: 'named',
    useLegacySql: false,
    location: process.env.BIGQUERY_LOCATION || 'US',
    dryRun: options.dryRun ?? false,
  }

  if (options.jobTimeoutMs) {
    queryOptions.jobTimeoutMs = options.jobTimeoutMs
  }

  if (options.maxBytesBilled) {
    queryOptions.maximumBytesBilled = options.maxBytesBilled.toString()
  }

  const [job] = await bigquery.createQueryJob(queryOptions)

  if (options.dryRun) {
    const bytes = Number(job.metadata.statistics?.totalBytesProcessed || 0)
    console.log(`Dry run: ${bytes} bytes will be processed`)
    return []
  }

  const [rows] = await job.getQueryResults()

  return rows as T[]
}

/* =========================================================
   Date Helpers
========================================================= */

function getLast30DaysSuffixRange() {
  const now = new Date()

  const end = formatDate(now)

  const startDate = new Date()
  startDate.setDate(now.getDate() - 30)

  const start = formatDate(startDate)

  return { start, end }
}

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}${month}${day}`
}

/* =========================================================
   Business Query
========================================================= */

export async function getExperimentPerformance(
  tenantId: string,
  experimentName: string,
): Promise<ExperimentPerformanceRow[]> {
  const { start, end } = getLast30DaysSuffixRange()

  const query = `
    SELECT 
      jsonPayload.variant AS variant,
      COUNT(*) as totalConversions,
      SUM(CAST(jsonPayload.value AS FLOAT64)) as totalValue,
      SUM(CAST(jsonPayload.itensCount AS INT64)) as totalItems
    FROM \`${process.env.GOOGLE_PROJECT_ID}.divisor.conversion_logs_*\`
    WHERE 
      _TABLE_SUFFIX BETWEEN @start AND @end
      AND jsonPayload.tenantId = @tenantId
      AND jsonPayload.experimentName = @experimentName
    GROUP BY variant
  `

  return queryBigQuery<ExperimentPerformanceRow>(
    query,
    {
      tenantId,
      experimentName,
      start,
      end,
    },
    {
      maxBytesBilled: 500 * 1024 * 1024, // 500MB
      jobTimeoutMs: 10000,
    },
  )
}