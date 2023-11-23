import { DEFAULT_SOURCES } from "../../config/Constants";
import { SourceDTO } from "../dtos/SourceDTO";
import { NewsSourceEntityType, Source } from "../entities/Source";
import { currentTimestampAndDate } from "../helpers/Utils.js";
import { SourceRepository } from "../repositories/SourceRepository";

export class SourceService {
    private sourceRepository: SourceRepository

    constructor(repository: SourceRepository) {
        this.sourceRepository = repository
    }

    async insertDefaultIfNeeded() {
        const allSources = await this.sourceRepository.getAll()

        if (allSources.length > 0) {
            return
        }

        for (let source of DEFAULT_SOURCES) {
            try {
                await this.save(source)
            } catch (error) {
                console.log(currentTimestampAndDate() + error)
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