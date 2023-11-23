import { Browser } from "puppeteer";
import { Scraper } from "./Scarper.js";
import { dotEnv } from "../../../../config/Constants.js";
import { ScraperItemDTO } from "../../../dtos/ScraperItemDTO.js";
import { currentTimestampAndDate } from "../../../helpers/Utils.js";

export class PAPScarper implements Scraper {
    private url: string;

    constructor(useProxy: boolean) {
        const url = "https://www.pap.pl"
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
        await page.setJavaScriptEnabled(false)

        console.log(currentTimestampAndDate() + `Navigating to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'domcontentloaded' }).catch(e => console.error(currentTimestampAndDate() + e));

        const articles = await page.evaluate(() => {
            const articleElements = Array.from(document.querySelectorAll('li.news > div > div.textWrapper'));

            return articleElements.map((articleElement) => {
                const hrefSuffix = articleElement.querySelector('h3 > a[href]')?.getAttribute('href') || '';
                const href = `https://www.pap.pl${hrefSuffix}`;
                const text = articleElement.querySelector('h3 > a[href]')?.textContent?.trim()

                return { href, text };
            });
        });

        if (articles.length == 0) {
            console.error(currentTimestampAndDate() + 'PAPScarper empty articles for url ' + this.url);
        }

        const news = articles.map(article => { return new ScraperItemDTO(article.href, article.text, null, null) });

        return news;
    }

}
