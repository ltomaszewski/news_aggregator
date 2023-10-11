import { NewsEntity } from "../entities/NewsEntity";
import { Repository } from "../interfaces/Repository";
import { DatabaseRepository } from "./DatabaseRepository/DatabaseRepository";

export class NewsEntityRepository implements Repository<NewsEntity> {
    private databaseRepository: DatabaseRepository
    private databaseName: string

    constructor(databaseRepository: DatabaseRepository, databaseName: string) {
        this.databaseRepository = databaseRepository
        this.databaseName = databaseName
    }

    async insert(entity: NewsEntity) {
        await this.databaseRepository.insert(this.databaseName, NewsEntity.Schema.name, entity)
    }

    async getAll(): Promise<NewsEntity[]> {
        const result = (await this.databaseRepository.query(this.databaseName, NewsEntity.Schema.name, function (table) { return table }))
        const rawResult = await result.toArray()
        const sampleEntities = rawResult.map((object: any) => { return NewsEntity.createFromObject(object) })
        result.close()
        return sampleEntities
    }

    async update(entity: NewsEntity) {
        await this.databaseRepository.insert(this.databaseName, NewsEntity.Schema.name, entity)
    }

    async delete(entity: NewsEntity) {
        await this.databaseRepository.delete(this.databaseName, NewsEntity.Schema.name, { id: entity.id })
    }
}
