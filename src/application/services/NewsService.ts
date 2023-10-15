import { News } from "../entities/News";
import { NewsRepository } from "../repositories/NewsRepository";
import { RssItem } from "./Rss/RssItem";

export class NewsService {
    private newsRepository: NewsRepository;

    constructor(newsRepository: NewsRepository) {
        this.newsRepository = newsRepository;
    }

    async saveRssItems(rssItems: RssItem[]) {
        for (let rssItem of rssItems) {
            await this.saveRssItem(rssItem);
        }
    }

    async saveRssItem(rssItem: RssItem) {
        const alreadyExisitngNews = await this.checkIfExists(rssItem)
        if (alreadyExisitngNews) {
            console.log("News already exists " + rssItem.link + " id: " + alreadyExisitngNews.id);
            return;
        }
        const publicationDate = rssItem.publicationDate;
        const fetchedAt = rssItem.fetchedAt;
        const id = await this.newsRepository.nextId();
        const id_source = rssItem.source.id;
        const title = rssItem.title;
        const description = rssItem.description;
        const link = rssItem.link;

        const news = new News(id, id_source, fetchedAt, publicationDate, title, description, link, []);
        await this.newsRepository.insert(news);
        console.log("Added new news item: " + news.title);
    }

    private async checkIfExists(rssItem: RssItem): Promise<News | null> {
        const existing = await this.newsRepository.findNewsWithLink(rssItem.link);
        return existing
    }
}