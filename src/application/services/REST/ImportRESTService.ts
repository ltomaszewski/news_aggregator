import express from "express";
import { configuration } from "../../../Index";
import { DatabaseHost, DatabasePort, Env, baseDatabaseName } from "../../../config/Constants";
import { DatabaseRepository } from "../../repositories/DatabaseRepository/DatabaseRepository";
import { SourceRepository } from "../../repositories/SourceRepository";
import { NewsRepository } from "../../repositories/NewsRepository";
import { TweetRepository } from "../../repositories/TweetRepository";
import { TweetDTO } from "../../dtos/TweetDTO";
import { TweetService } from "../TweetService";
import { RssItem } from "../Rss/RssItem";
import { NewsService } from "../NewsService";

export class ImportRESTService {
    private databaseName: string;
    private databaseRepository: DatabaseRepository;

    constructor(databaseName: string, databaseRespository: DatabaseRepository) {
        this.databaseName = databaseName;
        this.databaseRepository = databaseRespository;
    }

    installEndpoints(basePath: string, app: express.Application) {
        app.get(basePath + "/import/dev/tweets", async (req, res) => {
            try {
                await this.importTweetsFromDevelopmentDataIfNeed();
                res.sendStatus(204);
            } catch (error: any) {
                res.status(400).json({ error: error.message });
            }
        });

        app.get(basePath + "/import/dev/news", async (req, res) => {
            try {
                await this.importNewsFromDevelopmentDataIfNeed();
                res.sendStatus(204);
            } catch (error: any) {
                res.status(400).json({ error: error.message });
            }
        });
    }

    async importTweetsFromDevelopmentDataIfNeed() {
        const databaseName = `${Env.Dev}${baseDatabaseName}`;
        const developDatabase = new DatabaseRepository(DatabaseHost, DatabasePort, false);
        await developDatabase.connect(databaseName);

        const prodSourcesRepository = new SourceRepository(this.databaseRepository, this.databaseName);
        const prodNewsRepository = new NewsRepository(this.databaseRepository, this.databaseName);
        const prodTweetRepository = new TweetRepository(this.databaseRepository, this.databaseName);
        const prodTweetService = new TweetService(prodTweetRepository);
        const developSourcesRepository = new SourceRepository(developDatabase, databaseName);
        const developNewsRepository = new NewsRepository(developDatabase, databaseName);
        const developTweetRepository = new TweetRepository(developDatabase, databaseName);

        const developSources = developSourcesRepository.getAll();
        const developNews = developNewsRepository.getAll();
        const developTweets = (await developTweetRepository.getAll())
            .filter(tweet => tweet.androidPackage.startsWith("com.twitter"));

        const developTweetsDTO: TweetDTO[] = developTweets.map(tweet => {
            return new TweetDTO(tweet.androidPackage, tweet.ticker, tweet.title, tweet.text, tweet.postTime)
        });

        for (let tweetDTO of developTweetsDTO) {
            await prodTweetService.save(tweetDTO);
        }
    }

    async importNewsFromDevelopmentDataIfNeed() {
        const databaseName = `${Env.Dev}${baseDatabaseName}`;
        const developDatabase = new DatabaseRepository(DatabaseHost, DatabasePort, false);
        await developDatabase.connect(databaseName);

        const prodNewsRepository = new NewsRepository(this.databaseRepository, this.databaseName);
        const prodSourcesRepository = new SourceRepository(this.databaseRepository, this.databaseName);
        const prodNewsService = new NewsService(prodNewsRepository);
        const developNewsRepository = new NewsRepository(developDatabase, databaseName);
        const developSourcesRepository = new SourceRepository(developDatabase, databaseName);

        const prodSources = await prodSourcesRepository.getAll()
        const developSources = await developSourcesRepository.getAll();
        const developNewss = await developNewsRepository.getAll();

        for (let developNews of developNewss) {
            const developSourceForCurrentNews = developSources.find(source => source.id == developNews.id_source); // Find source for news
            if (developSourceForCurrentNews) { // Check if exists source on develop
                const prodSourceOfDevelopSource = prodSources.find(source => source.url == developSourceForCurrentNews.url); // Find the same source for the same url as on develop
                if (prodSourceOfDevelopSource) {  // Check if the same source on develop exists on prod
                    const developNewsDTOForProd = new RssItem(developNews.title, developNews.link, developNews.publicationDate, developNews.description, developNews.fetchedAt, prodSourceOfDevelopSource);
                    prodNewsService.saveRssItem(developNewsDTOForProd)
                }
            }
        }
    }

}