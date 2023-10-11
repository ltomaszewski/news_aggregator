import { News } from "../entities/News";
import { Source } from "../entities/Source";
import { Repository } from "../interfaces/Repository";
import { DatabaseRepository } from "./DatabaseRepository/DatabaseRepository";

export class SourceRepository implements Repository<Source> {
    private databaseRepository: DatabaseRepository
    private databaseName: string

    constructor(databaseRepository: DatabaseRepository, databaseName: string) {
        this.databaseRepository = databaseRepository
        this.databaseName = databaseName
    }

    async insert(entity: Source) {
        await this.databaseRepository.insert(this.databaseName, Source.Schema.name, entity)
    }

    async getAll(): Promise<Source[]> {
        const result = (await this.databaseRepository.query(this.databaseName, Source.Schema.name, function (table) { return table }))
        const rawResult = await result.toArray()
        const sampleEntities = rawResult.map((object: any) => { return Source.createFromObject(object) })
        result.close()
        return sampleEntities
    }

    async update(entity: Source) {
        await this.databaseRepository.insert(this.databaseName, Source.Schema.name, entity)
    }

    async delete(entity: Source) {
        await this.databaseRepository.delete(this.databaseName, Source.Schema.name, { id: entity.id })
    }
}
