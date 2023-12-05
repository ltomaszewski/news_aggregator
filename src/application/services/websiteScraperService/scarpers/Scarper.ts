import { Browser, Page } from "puppeteer";
import { ScraperItemDTO } from "../../../dtos/ScraperItemDTO.js";

export interface Scraper {
    scalp(page: Page): Promise<ScraperItemDTO[]>;
}