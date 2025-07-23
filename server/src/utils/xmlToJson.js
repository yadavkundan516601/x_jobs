// src/utils/xmlToJson.js
import { parseStringPromise } from "xml2js";

/**
 * Converts an XML string to a JavaScript object (JSON)
 * @param {string} xml
 * @returns {Promise<Object>}
 */
export const xmlToJson = async (xml) => {
  try {
    const json = await parseStringPromise(xml, { explicitArray: false });
    return json;
  } catch (error) {
    console.error("❌ Failed to parse XML:", error.message);
    throw new Error("Invalid XML format");
  }
};
