import { Job, Platform } from "@/types/jobs";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

export const ExecuteScraping = async (): Promise<Job[]> => {
  const browser = await puppeteer.launch({
    headless: true, // Keep visible for debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Configure browser to appear more human-like
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to page with realistic delays
    await page.goto("https://www.upwork.com/nx/search/jobs", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    // Wait for dynamic content using reliable selector
    await page.waitForSelector('[data-test="JobTile"]', {
      visible: true,
      timeout: 15000
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
        // Extract data using robust selectors
        const jobData: Job = {
          platform: Platform.UPWORK,
          posted: $('[data-test="job-pubilshed-date"] span:last-child').text().trim(),
          title: $('[data-test="job-tile-title-link UpLink"]').text().trim(),
          jobType: isFixedPrice ? `Fixed: ${$('[data-test="is-fixed-price"] strong:last-child').text().trim()}` : $('[data-test="job-type-label"] strong').text().trim(),
          experienceLevel: $('[data-test="experience-level"] strong').text().trim(),
          clientBudget: $('[data-test="is-fixed-price"] strong:last-child').text().trim() || "Not Specified",
          duration: $('[data-test="duration-label"] strong:last-child').text().trim() || $('[data-test="is-fixed-price"] strong:last-child').text().trim(),
          tokens: $('[data-test="token"] span').map((_, el) => $(el).text().trim()).get()
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

// // Click job to open slider
// await jobHandle.click();

// // Wait for slider animation and content
// await page.waitForSelector('[data-test="UpCSliderBody"]', {
//   visible: true,
//   timeout: 5000
// });

// // Extract data from slider content
// const jobData = await page.evaluate(() => {
//   const getText = (selector: string) =>
//     document.querySelector(selector)?.textContent?.trim() || 'N/A';

//   const getNumber = (selector: string) =>
//     parseFloat(getText(selector).replace(/[^\d.]/g, '')) || 0;

//   // Main data extraction
//   return {
//     id: window.location.href.split('/').pop() || '',
//     title: getText('h4.m-0'),
//     price: {
//       amount: getNumber('[data-test="BudgetAmount"] strong'),
//       type: getText('[data-cy="clock-hourly"] + div .description') as 'Fixed' | 'Hourly'
//     },
//     description: getText('[data-test="Description"]'),
//     experience: getText('[data-cy="expertise"] strong'),
//     skills: Array.from(document.querySelectorAll('[data-test="Skill"]'))
//       .map(el => el.textContent?.trim() || ''),
//     client: {
//       name: getText('[data-test="client-name"]'),
//       score: getNumber('[data-test="client-rating"]'),
//       spent: getText('[data-qa="client-spend"]'),
//       hireRate: getNumber('[data-qa="client-hires"]'),
//       location: getText('[data-qa="client-location"] strong'),
//       jobsPosted: getNumber('[data-test="OtherJobs"] header h5'),
//       activeHires: getNumber('[data-qa="client-hires"]')
//     },
//     posted: getText('[data-test="PostedOn"] span')
//   };
// });

// jobs.push(jobData);

// // Close slider
// await page.click('[data-test="UpCIcon"]');
