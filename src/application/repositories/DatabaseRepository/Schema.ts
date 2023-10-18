import * as r from 'rethinkdb';
import { DatabaseRepository } from './DatabaseRepository';
import { Source } from '../../entities/Source';
import { News } from '../../entities/News';
import { Tweet } from '../../entities/Tweet';

// Schema - responsible for database schema migration
export class Schema {
    databaseName: string
    private databaseRepository: DatabaseRepository

    constructor(databaseName: string, databaseRepository: DatabaseRepository) {
        this.databaseName = databaseName
        this.databaseRepository = databaseRepository
    }

    async updateSchemaIfNeeded(dropAllFirst: boolean = false) {
        if (dropAllFirst) {
            await this.databaseRepository.dropTableIfExists(this.databaseName, Tweet.Schema.name);
            await this.databaseRepository.dropTableIfExists(this.databaseName, News.Schema.name);
            await this.databaseRepository.dropTableIfExists(this.databaseName, Source.Schema.name);
            await this.databaseRepository.dropDatabaseIfExists(this.databaseName);
        }

        await this.databaseRepository.createDatabaseIfNotExists(this.databaseName);
        await this.databaseRepository.createTableIfNotExists(this.databaseName, Tweet.Schema.name);
        await this.databaseRepository.createTableIfNotExists(this.databaseName, Source.Schema.name);
        await this.databaseRepository.createTableIfNotExists(this.databaseName, News.Schema.name);

    }
}
