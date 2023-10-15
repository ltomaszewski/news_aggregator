import { SourceDTO } from "../dtos/SourceDTO";
import { NewsSourceEntityType, Source } from "../entities/Source";
import { SourceRepository } from "../repositories/SourceRepository";

export class SourceService {
    private sourceRepository: SourceRepository

    constructor(repository: SourceRepository) {
        this.sourceRepository = repository
    }

    async insertDefaultIfNeeded() {
        const investingCom = new Source(1, "investing.com", NewsSourceEntityType.Rss, "https://investing.com/rss/market_overview_Fundamental.rss", ["investing"]);
        const yahooFinance = new Source(2, "yahoo.finance", NewsSourceEntityType.Rss, "https://finance.yahoo.com/news/rssindex", ["yahoo"]);
        const wsj = new Source(3, "wsj.com", NewsSourceEntityType.Rss, "https://feeds.a.dj.com/rss/RSSWorldNews.xml", ["us"]);
        const defaultSources = [investingCom, yahooFinance, wsj];
        const allSources = await this.sourceRepository.getAll();

        for (let source of defaultSources) {
            if (!(await allSources).find(x => x.id === source.id)) {
                await this.sourceRepository.insert(source);
            }
        }
    }

    async save(sourceDTO: SourceDTO): Promise<Source> {
        const allSources = await this.sourceRepository.getAll()
        if ((await allSources).find(x => x.url === sourceDTO.url)) {
            throw Error(`"Source with this URL already exists"`);
        }
        const newId = Source.createNewId(allSources);
        const newSource = Source.createFromDTO(sourceDTO, newId);
        await this.sourceRepository.insert(newSource)
        return newSource
    }

    async remove(id: number): Promise<Source> {
        const allSources = await this.sourceRepository.getAll()
        const source = await allSources.find(x => x.id === id)
        if (source) {
            await this.sourceRepository.delete(source)
            return source
        } else {
            throw Error(`"Source with this ID does not exist"`);
        }
    }

    async getAll(): Promise<Source[]> {
        return await this.sourceRepository.getAll();
    }
}