import { Browser, Page } from "puppeteer";
import { Scraper } from "./Scarper.js";
import { dotEnv } from "../../../../config/Constants.js";
import { ScraperItemDTO } from "../../../dtos/ScraperItemDTO.js";
import UserAgent from "user-agents";

export class ReutersScarper implements Scraper {
    private url: string;

    constructor(useProxy: boolean) {
        const url = "https://www.reuters.com/"
        if (useProxy) {
            const proxyPrefix = "https://scraping.narf.ai/api/v1/?api_key=" + dotEnv.NARF_AI_KEY + "&url="
            const newUrlWithProxy = proxyPrefix + encodeURIComponent(url);
            this.url = newUrlWithProxy
        } else {
            this.url = url;
        }
    }

    async scalp(page: Page): Promise<ScraperItemDTO[]> {
        const userAgent = new UserAgent({ deviceCategory: 'desktop' }); // You can specify the device category
        const randomUserAgent = userAgent.toString();
        page.setUserAgent(randomUserAgent);

        console.log(` Navigating to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'domcontentloaded' }).catch(e => console.error(e));

        const articles = await page.$$eval('[class^="home-page-grid__story"]', (elements) => {
            console.log("Extracting article hrefs...");
            // Use Array.from to maintain the order of elements
            return Array.from(elements, (element) => {
                const href = element.querySelector('div > a[href]');
                const url = `${href}`;

                const textContents = href?.textContent

                const timeElement = element.querySelector('div > time');
                const time = timeElement?.getAttribute('datetime');

                return { url: url, textContents: textContents, time: time };
            }).filter((attr) => attr !== null);
        });

        const news = articles.map(article => { return new ScraperItemDTO(article.url, article.textContents, article.time) });

        if (news.length == 0) {
            console.error('ReutersScarper empty articles for url ' + this.url);
        }

        return news;
    }
}