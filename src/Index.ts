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

// Asynchronous function for database operations
(async () => {
    // Database connection details
    const baseDatabaseName = "NEWS_AGGREGATOR";
    const databaseName = `${configuration.env}${baseDatabaseName}`;

    // Creating DatabaseRepository instance for database connection
    const databaseRepository = new DatabaseRepository(DatabaseHost, DatabasePort, DatabaseForceDrop);

    // Establishing connection to the specified database
    await databaseRepository.connect(databaseName);

    // Creating NewSourceEnityRepository instance for database operations
    const newsSourceEntityRepository = new SourceRepository(databaseRepository, databaseName)

    const newsSources = await newsSourceEntityRepository.getAll()

    if (newsSources.length == 0) {
        // Create test pap source 
        const papSource = new Source(0, "pap", NewsSourceEntityType.Rss, "https://pap-mediaroom.pl/kategoria/biznes-i-finanse/rss.xml", ["gpw", "pl"])
        newsSourceEntityRepository.insert(papSource)

        const investingCom = new Source(1, "investing.com", NewsSourceEntityType.Rss, "https://investing.com/rss/market_overview_Fundamental.rss", ["investing"])
        newsSourceEntityRepository.insert(investingCom)

        const yahooFinance = new Source(2, "investing.com", NewsSourceEntityType.Rss, "https://finance.yahoo.com/news/rssindex", ["yahoo"])
        newsSourceEntityRepository.insert(yahooFinance)

        const wsj = new Source(3, "wsj.com", NewsSourceEntityType.Rss, "https://feeds.a.dj.com/rss/RSSWorldNews.xml", ["us"])
        newsSourceEntityRepository.insert(wsj)
    }

    const rssEmiter = new RssEmiter()
    rssEmiter.add("https://feeds.a.dj.com/rss/RSSWorldNews.xml")
    rssEmiter.on(function (object: any) {
        console.log(object["title"])
        console.log(object["link"])
        console.log(object["description"])
        console.log(findProp(object, "rss:description.#"))
        console.log(findProp(object, "rss:pubdate.#"))
        console.log(findProp(object, "meta.link"))
    })
})();