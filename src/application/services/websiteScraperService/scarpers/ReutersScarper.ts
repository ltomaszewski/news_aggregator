import { Browser } from "puppeteer";
import { Scraper } from "./Scarper.js";
import { dotEnv } from "../../../../config/Constants.js";
import { ScraperItemDTO } from "../../../dtos/ScraperItemDTO.js";
import { currentTimestampAndDate } from "../../../helpers/Utils.js";

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

    async scalp(browser: Browser): Promise<ScraperItemDTO[]> {
        const page = await browser.newPage()
        page.setJavaScriptEnabled(false)
        console.log(currentTimestampAndDate() + `Navigating to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'domcontentloaded' }).catch(e => console.error(currentTimestampAndDate() + e));

        const articles = await page.$$eval('[class^="home-page-grid__story"]', (elements) => {
            const uniqueHrefSet = new Set<string>();
            console.log(currentTimestampAndDate() + "Extracting article hrefs...");
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
            console.error(currentTimestampAndDate() + 'ReutersScarper empty articles for url ' + this.url);
        }

        return news;
    }
}