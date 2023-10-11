import { NewsEntity } from "../entities/NewsEntity";
import { NewsSourceEntity } from "../entities/NewsSourceEntity";
import { Repository } from "../interfaces/Repository";
import { DatabaseRepository } from "./DatabaseRepository/DatabaseRepository";

export class NewsSourceEntityRepository implements Repository<NewsSourceEntity> {
    private databaseRepository: DatabaseRepository
    private databaseName: string

    constructor(databaseRepository: DatabaseRepository, databaseName: string) {
        this.databaseRepository = databaseRepository
        this.databaseName = databaseName
    }

    async insert(entity: NewsSourceEntity) {
        await this.databaseRepository.insert(this.databaseName, NewsSourceEntity.Schema.name, entity)
    }

    async getAll(): Promise<NewsSourceEntity[]> {
        const result = (await this.databaseRepository.query(this.databaseName, NewsSourceEntity.Schema.name, function (table) { return table }))
        const rawResult = await result.toArray()
        const sampleEntities = rawResult.map((object: any) => { return NewsSourceEntity.createFromObject(object) })
        result.close()
        return sampleEntities
    }

    async update(entity: NewsSourceEntity) {
        await this.databaseRepository.insert(this.databaseName, NewsSourceEntity.Schema.name, entity)
    }

    async delete(entity: NewsSourceEntity) {
        await this.databaseRepository.delete(this.databaseName, NewsSourceEntity.Schema.name, { id: entity.id })
    }
}
