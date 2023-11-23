import { ScraperItemDTO } from "../../dtos/ScraperItemDTO.js";
import { ScraperItem } from "../../entities/ScraperItem.js";
import { ScraperItemRepository } from "../../repositories/ScraperItemRepository.js";

export class ScraperItemService {
    private repository: ScraperItemRepository;

    constructor(repository: ScraperItemRepository) {
        this.repository = repository;
    }

    async insert(scraperItemDTO: ScraperItemDTO): Promise<void> {
        const exists = await this.repository.getByUrlAndTitle(scraperItemDTO.url, scraperItemDTO.title ?? '');
        if (exists) {
            throw new Error("An item with the same URL already exists.");
        }

        const theNewestEntity = await this.repository.getTheNewestEntity();
        let newId
        if (theNewestEntity) {
            newId = theNewestEntity.id + 1;
        } else {
            newId = 0;
        }

        const entity = ScraperItem.createFromDTO(scraperItemDTO, newId);
        await this.repository.insert(entity);
    }

    async getAllWithForLoop(forLoop: (scraperItem: ScraperItem) => Promise<boolean>, lastFetchedAt: number | undefined) {
        return await this.repository.scraperItemWithForLoop(forLoop, lastFetchedAt);
    }

    async getById(id: number): Promise<ScraperItem | undefined> {
        return this.repository.getById(id);
    }

    async trackChanges(change: (newTweet: ScraperItem | undefined, oldTweet: ScraperItem | undefined, err: Error) => void) {
        return this.repository.trackChanges(change);
    }
}