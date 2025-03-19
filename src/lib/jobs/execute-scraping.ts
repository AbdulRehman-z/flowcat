import { Job, Platform } from "@/types/jobs";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

export const ExecuteScraping = async (url: string): Promise<Job[]> => {
  const browser = await puppeteer.launch({
    headless: false, // Keep visible for debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Configure browser to appear more human-like
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to page with realistic delays
    const jobsUrl = url || "https://www.upwork.com/nx/search/jobs";
    await page.goto(jobsUrl, {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    // Wait for dynamic content using reliable selector
    await page.waitForSelector('[data-test="JobTile"]', {
      visible: true,
      timeout: 60000
    });

    // Get all job elements
    const jobElements = await page.$$('[data-test="JobTile"]');
    const jobs: Job[] = [];

    for (const jobElement of jobElements) {
      try {
        // Extract HTML content from the element handle
        const jobHTML = await page.evaluate(el => el.outerHTML, jobElement);
        const $ = cheerio.load(jobHTML);
        const isFixedPrice = $('[data-test="is-fixed-price"] strong:last-child').text().trim()

        // Get job URL for apply button
        const jobUrl = $('[data-test="job-tile-title-link UpLink"]').attr('href') || "";
        const applyUrl = jobUrl ? `https://www.upwork.com${jobUrl}` : "";

        // Extract data using robust selectors
        const jobData: Job = {
          platform: Platform.UPWORK,
          posted: $('[data-test="job-pubilshed-date"] span:last-child').text().trim(),
          title: $('[data-test="job-tile-title-link UpLink"]').text().trim(),
          jobType: isFixedPrice ? `Fixed: ${$('[data-test="is-fixed-price"] strong:last-child').text().trim()}` : $('[data-test="job-type-label"] strong').text().trim(),
          experienceLevel: $('[data-test="experience-level"] strong').text().trim(),
          clientBudget: $('[data-test="is-fixed-price"] strong:last-child').text().trim() || "Not Specified",
          duration: $('[data-test="duration-label"] strong:last-child').text().trim() || $('[data-test="is-fixed-price"] strong:last-child').text().trim(),
          tokens: $('[data-test="token"] span').map((_, el) => $(el).text().trim()).get(),
          applyUrl: applyUrl,
        };

        jobs.push(jobData);

      } catch (error) {
        console.error('Error processing job:', error);
        continue;
      }
    }

    return jobs;

  } catch (error) {
    console.error('Scraping failed:', error);
    return [];
  } finally {
    await browser.close();
  }
};
