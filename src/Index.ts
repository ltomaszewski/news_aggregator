// Importing CLIConfiguration class for handling Command Line Interface (CLI) arguments
import 'dotenv/config';
import { CLIConfiguration } from "./config/CLIConfiguration";

// Extracting command line arguments
const args = process.argv;

// Creating CLIConfiguration object from the extracted CLI arguments
export const configuration: CLIConfiguration = CLIConfiguration.fromCommandLineArguments(args);

// Importing necessary modules and classes for database integration
import { DatabaseRepository } from "./application/repositories/DatabaseRepository/DatabaseRepository";
import { DatabaseForceDrop, DatabaseHost, DatabasePort, Env, baseDatabaseName } from "./config/Constants";
import { SourceRepository } from "./application/repositories/SourceRepository";
import { RssService } from "./application/services/rssService/RssService";
import { SourceService } from "./application/services/SourceService";
import { NewsService } from "./application/services/NewsService";
import { NewsRepository } from "./application/repositories/NewsRepository";
import express from "express";
import { SourceRESTService } from "./application/services/REST/SourceRESTService";
import { TweetRESTService } from "./application/services/REST/TweetRESTService";
import { TweetService } from "./application/services/TweetService";
import { TweetRepository } from "./application/repositories/TweetRepository";
import { ImportRESTService } from "./application/services/REST/ImportRESTService";
import { ScraperItemRepository } from './application/repositories/ScraperItemRepository.js';
import { ScraperItemService } from './application/services/websiteScraperService/ScraperItemService.js';
import { WebsiteScraperService } from './application/services/websiteScraperService/WebsiteScraperService.js';

// Asynchronous function for database operations
(async () => {
    // Database connection details
    const databaseName = `${configuration.env}${baseDatabaseName}`;

    // Creating DatabaseRepository instance for database connection
    const databaseRepository = new DatabaseRepository(DatabaseHost, DatabasePort, DatabaseForceDrop);

    // Establishing connection to the specified database
    await databaseRepository.connect(databaseName);

    // Creating all repositories and services
    const sourceRepository = new SourceRepository(databaseRepository, databaseName);
    const newsRepository = new NewsRepository(databaseRepository, databaseName);
    const tweetRepository = new TweetRepository(databaseRepository, databaseName);
    const scraperItemRepository = new ScraperItemRepository(databaseRepository, databaseName);

    const sourceService = new SourceService(sourceRepository);
    const newsService = new NewsService(newsRepository);
    const tweetService = new TweetService(tweetRepository);
    const scraperItemSerivce = new ScraperItemService(scraperItemRepository);
    const websiteScraperService = new WebsiteScraperService(scraperItemSerivce);
    const rssService = new RssService();

    // Init if empty some default sources
    await sourceService.insertDefaultIfNeeded();

    // Setup callback for RssService to save new rssItem to database
    rssService.setCallback((rssItem) => {
        newsService.saveRssItem(rssItem);
    })

    // Add already existing sources to the RssService
    const sources = await sourceRepository.getAll();
    for (const source of sources) {
        rssService.add(source)
    }

    // Setup REST Server
    const app = express();
    app.use(express.json());

    // Install REST services endpoints
    const baseApi = "/api/v1";
    const sourceRestService = new SourceRESTService(sourceService, rssService);
    const tweetRestService = new TweetRESTService(tweetService);
    const importRestService = new ImportRESTService(databaseName, databaseRepository)

    // Install REST endpoints
    sourceRestService.installEndpoints(baseApi, app);
    tweetRestService.installEndpoints(baseApi, app);
    importRestService.installEndpoints(baseApi, app);

    const PORT = configuration.env == Env.Prod ? 996 : 696

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    websiteScraperService.start()
})();