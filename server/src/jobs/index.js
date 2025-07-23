import { fetchJobsFromAPI } from "./fetchJobsFromAPI.js";

const FEED_URLS = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
  "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://www.higheredjobs.com/rss/articleFeed.cfm",
];

/**
 * Fetch jobs from all feeds and flatten into one array
 * @returns {Promise<Array>} - All normalized job entries
 */
export async function fetchJobsFromAllAPIs() {
  const results = await Promise.allSettled(
    FEED_URLS.map((url) => fetchJobsFromAPI(url))
  );

  const allJobs = results
    .filter((res) => res.status === "fulfilled")
    .flatMap((res) => res.value);

  return allJobs;
}
