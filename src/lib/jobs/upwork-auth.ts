// src/lib/upwork-scraper.ts
import puppeteer, { Browser, Cookie, Page } from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

// Schema validation
const JobSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.object({
    amount: z.number(),
    type: z.enum(['Fixed', 'Hourly']),
  }),
  // ... other fields
});


type Job = z.infer<typeof JobSchema>;
// Configuration
const CONFIG = {
  USER: process.env.UPWORK_USER!,
  PASS: process.env.UPWORK_PASS!,
  PROXIES: process.env.PROXIES?.split(',') || [],
  USER_AGENTS: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...'
  ],
  COOKIE_PATH: path.join(__dirname, 'upwork-cookies.json')
};

// Core functions
export const initializeScraper = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        // '--disable-setuid-sandbox',
        // ...(CONFIG.PROXIES.length ? [`--proxy-server=${getRandomProxy()}`] : [])
      ]
    });

    const page = await browser.newPage();
    await setupPage(page);

    // Try to reuse cookies
    const cookies = await loadCookies();
    if (cookies) await browser.setCookie(...cookies);

    return { browser, page };
  } catch (error) {
    await browser?.close();
    throw error;
  }
};

export const loginToUpwork = async (browser: Browser, page: Page) => {
  try {
    await page.goto('https://www.upwork.com/login', { waitUntil: 'networkidle2', timeout: 90000 });


    // Check if already logged in
    if (page.url().includes('/nx/find-work/')) return true;

    // Username
    await humanType(page, '#login_username', CONFIG.USER);
    await page.click('#login_password_continue');
    await randomDelay(1000, 3000);

    // Password
    await page.waitForSelector('#login_password', { visible: true });
    await humanType(page, '#login_password', CONFIG.PASS);
    await page.click('#login_control_continue');

    // Wait for login completion
    await page.waitForNavigation({ timeout: 30000 });

    // Save new cookies
    const cookies = await browser.cookies();
    await saveCookies(cookies);

    return true;
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

export const scrapeJobs = async (page: Page): Promise<Job[]> => {
  await page.goto('https://www.upwork.com/nx/find-work/most-recent', { waitUntil: 'domcontentloaded' });

  const rawData = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.job-card')).map(card => ({
      id: card.getAttribute('data-id') || '',
      title: card.querySelector('.job-title')?.textContent?.trim() || '',
      // ... other fields
    }));
  });

  return validateJobs(rawData);
};

// Helper functions
const setupPage = async (page: Page) => {
  await page.setUserAgent(getRandomUserAgent());
  await page.setViewport({
    width: 1280 + Math.floor(Math.random() * 200),
    height: 800 + Math.floor(Math.random() * 200),
    deviceScaleFactor: 1
  });
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9'
  });
};

const humanType = async (page: Page, selector: string, text: string) => {
  await page.click(selector);
  for (const char of text) {
    await page.type(selector, char, { delay: Math.random() * 50 + 30 });
    if (Math.random() < 0.05) {
      await page.keyboard.press('Backspace');
      await page.type(selector, char);
    }
  }
};

const validateJobs = (data: unknown): Job[] => {
  const result = JobSchema.array().safeParse(data);
  if (!result.success) throw new Error('Invalid job data');
  return result.data;
};

const getRandomProxy = () => {
  return CONFIG.PROXIES[Math.floor(Math.random() * CONFIG.PROXIES.length)];
};

const getRandomUserAgent = () => {
  return CONFIG.USER_AGENTS[Math.floor(Math.random() * CONFIG.USER_AGENTS.length)];
};

const randomDelay = (min: number, max: number) =>
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

const saveCookies = async (cookies: Cookie[]) => {
  await fs.writeFile(CONFIG.COOKIE_PATH, JSON.stringify(cookies, null, 2));
};

const loadCookies = async () => {
  try {
    return JSON.parse(await fs.readFile(CONFIG.COOKIE_PATH, 'utf-8'));
  } catch {
    return null;
  }
};
