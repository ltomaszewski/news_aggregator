// TODO: Create same with two or three source to save in database on load

// TODO: Add database access adjustments
// Validate everything is created with dummy data.
// Double check if develop and production modes work to make sure next step of development gonna work

// TODO: Design facade
// This will act as the main controller that will retrieve news from any emitter.
// At first, there will be two emitters: one for RSS and another for FinMarket

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

        const investingCom = new Source(1, "investing.com", NewsSourceEntityType.Rss, "https://pl.investing.com/rss/market_overview_Fundamental.rss", ["investing"])
        newsSourceEntityRepository.insert(investingCom)
    }

    const rssEmiter = new RssEmiter()
    rssEmiter.add("https://pap-mediaroom.pl/kategoria/biznes-i-finanse/rss.xml")
    rssEmiter.on(function (object: any) {
        console.log(object)
    })
})();
