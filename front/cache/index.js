// const fs = require("fs");
// const path = require("path");

// const cacheDir = path.resolve(process.cwd(), "cache");
// const memoryCache = {};
// const isBuildTime = process.env.BUILD_CACHE === "true";

// /**
//  * Validate cache structure
//  */
// const validateCache = (data) => {
//   if (typeof data !== "object" || data === null) {
//     console.warn("Invalid cache data structure. Returning empty object.");
//     return null;
//   }
//   return data;
// };

// /**
//  * Read a single cache item
//  */
// const readCacheItem = (key) => {
//   try {
//     const filePath = path.join(cacheDir, `${key}.json`);
//     if (!fs.existsSync(filePath)) return null;

//     const raw = fs.readFileSync(filePath, "utf8");
//     return validateCache(JSON.parse(raw));
//   } catch (err) {
//     console.error(`Error reading cache item ${key}:`, err);
//     return null;
//   }
// };

// /**
//  * Write a single cache item
//  */
// const writeCacheItem = (key, data) => {
//   try {
//     if (typeof data !== "object" || data === null) {
//       console.warn(`Attempted to write non-object cache item for key: ${key}`);
//       return;
//     }

//     fs.mkdirSync(cacheDir, { recursive: true });
//     const filePath = path.join(cacheDir, `${key}.json`);

//     const tmpFilePath = `${filePath}.tmp`;
//     fs.writeFileSync(tmpFilePath, JSON.stringify(data, null, 2), "utf8");
//     fs.renameSync(tmpFilePath, filePath);
//   } catch (err) {
//     console.error(`Error writing cache item ${key}:`, err);
//   }
// };

// /**
//  * Safe fetch with optional build-time caching
//  */

// module.exports = { readCacheItem, writeCacheItem };
