import { NewsSourceEntityType, Source } from "../entities/Source";
import { SourceRepository } from "../repositories/SourceRepository";

export class SourceService {
    private sourceRepository: SourceRepository

    constructor(repository: SourceRepository) {
        this.sourceRepository = repository
    }

    async insertDefaultSourcesIfNeeded() {
        const papSource = new Source(0, "pap", NewsSourceEntityType.Rss, "https://pap-mediaroom.pl/kategoria/biznes-i-finanse/rss.xml", ["gpw", "pl"])
        const investingCom = new Source(1, "investing.com", NewsSourceEntityType.Rss, "https://investing.com/rss/market_overview_Fundamental.rss", ["investing"])
        const yahooFinance = new Source(2, "yahoo.finance", NewsSourceEntityType.Rss, "https://finance.yahoo.com/news/rssindex", ["yahoo"])
        const wsj = new Source(3, "wsj.com", NewsSourceEntityType.Rss, "https://feeds.a.dj.com/rss/RSSWorldNews.xml", ["us"])
        const defaultSources = [papSource, investingCom, yahooFinance, wsj]
        const allSources = this.sourceRepository.getAll()

        for (let source of defaultSources) {
            if (!(await allSources).find(x => x.id === source.id)) {
                await this.sourceRepository.insert(source);
            }
        }
    }
}