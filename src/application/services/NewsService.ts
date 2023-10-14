import { NewsRepository } from "../repositories/NewsRepository";
import { RssItem } from "./Rss/RssItem";

export class NewsService {
    private newsRepository: NewsRepository;

    constructor(newsRepository: NewsRepository) {
        this.newsRepository = newsRepository;
    }

    async saveRssItem(rssItem: RssItem) {
        console.log(rssItem)
    }
}