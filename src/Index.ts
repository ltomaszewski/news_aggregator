// TODO: Finish RSS integration

// TODO: Integration of economic calendar, it should act as knowledge source when news shoudl arrive or, when use webscrbe to fetch dedicated data for analyze

// TODO: Add Android integration via NotificationListenerService on android via emulator or real device

// TODO: when rss integration is in palce, new pice of code to open the link to content should be implmented with way to read it and summirize with AI

// TODO: System to fetch data from custom website, like i.e. Fed website and minutes release. All of them should be downloader and analized with AI and compared between automaticly

// Importing CLIConfiguration class for handling Command Line Interface (CLI) arguments
import { CLIConfiguration } from "./config/CLIConfiguration";

// Extracting command line arguments
const args = process.argv;

// Creating CLIConfiguration object from the extracted CLI arguments
export const configuration: CLIConfiguration = CLIConfiguration.fromCommandLineArguments(args);

// Importing necessary modules and classes for database integration
import { DatabaseRepository } from "./application/repositories/DatabaseRepository/DatabaseRepository";
import { DatabaseForceDrop, DatabaseHost, DatabasePort } from "./config/Constants";
import { SourceRepository } from "./application/repositories/SourceRepository";
import { Source, NewsSourceEntityType } from "./application/entities/Source";
import { RssEmiter } from "./application/services/Rss/RssEmiter";
import { findProp } from "./application/helpers/Utils";
import { DateUtils } from "./application/helpers/DateParser";
import { getUnixTime } from "date-fns";
import { da } from "date-fns/locale";
import { RssService } from "./application/services/Rss/RssService";
import { SourceService } from "./application/services/SourceService";
import { NewsService } from "./application/services/NewsService";
import { NewsRepository } from "./application/repositories/NewsRepository";
import express from "express";
import { SourceRESTService } from "./application/services/REST/SourceRESTService";
import { TweetRESTService } from "./application/services/REST/TweetRESTService";
import { TweetService } from "./application/services/TweetService";
import { TweetRepository } from "./application/repositories/TweetRepository";

// Asynchronous function for database operations
(async () => {
    const dateParser = new DateUtils()

    // Database connection details
    const baseDatabaseName = "NEWS_AGGREGATOR";
    const databaseName = `${configuration.env}${baseDatabaseName}`;

    // Creating DatabaseRepository instance for database connection
    const databaseRepository = new DatabaseRepository(DatabaseHost, DatabasePort, DatabaseForceDrop);

    // Establishing connection to the specified database
    await databaseRepository.connect(databaseName);

    // Creating all repositories and services
    const sourceRepository = new SourceRepository(databaseRepository, databaseName);
    const newsRepository = new NewsRepository(databaseRepository, databaseName);
    const tweetRepository = new TweetRepository(databaseRepository, databaseName);

    const sourceService = new SourceService(sourceRepository);
    const newsService = new NewsService(newsRepository);
    const tweetService = new TweetService(tweetRepository);
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

    // Install REST endpoints
    sourceRestService.installEndpoints(baseApi, app);
    tweetRestService.installEndpoints(baseApi, app);

    const PORT = process.env.PORT || 696;

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

})();