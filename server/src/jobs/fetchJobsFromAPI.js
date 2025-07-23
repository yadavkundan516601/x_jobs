import axios from "axios";
import { xmlToJson } from "../utils/xmlToJson.js";
import { logInfo } from "../utils/logger.js";

/**
 * Fetches and parses XML job data from a given API URL
 * @param {string} url - The job feed URL (XML)
 * @returns {Promise<Array>} - Parsed list of job objects
 */
export async function fetchJobsFromAPI(url) {
  try {
    logInfo(`Fetching jobs from url :: ${url}`);

    const response = await axios.get(url);
    const xml = response.data;

    const json = await xmlToJson(xml);

    const items = json?.rss?.channel?.item;
    if (!items) return [];

    const normalized = Array.isArray(items) ? items : [items];

    const data = normalized.map((item) => {
      const mediaContent = item["media:content"]?.$?.url;
      const fullContent = item["content:encoded"];
      const company =
        item["job_listing:company"] || item["dc:creator"] || item.author || "";
      const location = item["job_listing:location"] || "";
      const jobType = item["job_listing:job_type"] || "";

      return {
        externalId:
          typeof item.guid === "object"
            ? item.guid._ || item.link || item.title
            : item.guid || item.link || item.title,
        title: item.title,
        description: item.description,
        fullContent,
        pubDate: new Date(item.pubDate),
        link: item.link,
        company,
        location,
        jobType,
        mediaUrl: mediaContent,
        sourceUrl: url,
        raw: item,
      };
    });

    return data;
  } catch (error) {
    console.error(`❌ Error fetching jobs from ${url}:`, error.message);
    return [];
  }
}
