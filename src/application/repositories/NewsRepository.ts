import { News } from "../entities/News";
import { Repository } from "../interfaces/Repository";
import { DatabaseRepository } from "./DatabaseRepository/DatabaseRepository";

export class NewsRepository implements Repository<News> {
    private databaseRepository: DatabaseRepository
    private databaseName: string

    constructor(databaseRepository: DatabaseRepository, databaseName: string) {
        this.databaseRepository = databaseRepository
        this.databaseName = databaseName
    }

    async insert(entity: News) {
        await this.databaseRepository.insert(this.databaseName, News.Schema.name, entity)
    }

    async getAll(): Promise<News[]> {
        const result = (await this.databaseRepository.query(this.databaseName, News.Schema.name, function (table) { return table }))
        const rawResult = await result.toArray()
        const sampleEntities = rawResult.map((object: any) => { return News.createFromObject(object) })
        result.close()
        return sampleEntities
    }

    async update(entity: News) {
        await this.databaseRepository.insert(this.databaseName, News.Schema.name, entity)
    }

    async delete(entity: News) {
        await this.databaseRepository.delete(this.databaseName, News.Schema.name, { id: entity.id })
    }

    async nextId(): Promise<number> {
        const all = await this.getAll()
        if (all.length == 0) { return 0 }
        const ids = all.map((a) => a.id)
        const maxValue = Math.max(...ids)
        return maxValue + 1
    }

    async findNewsWithLink(link: String): Promise<News | null> {
        const result = await (await this.databaseRepository.query(this.databaseName, News.Schema.name, function (table) { return table.filter({ link: link }) })).toArray();
        if (result.length > 0) {
            return result[0]
        } else {
            return null
        }
    }
}
