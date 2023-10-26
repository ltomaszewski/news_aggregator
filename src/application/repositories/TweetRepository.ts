import { Tweet } from "../entities/Tweet";
import { Repository } from "../interfaces/Repository";
import { DatabaseRepository } from "./DatabaseRepository/DatabaseRepository";

export class TweetRepository implements Repository<Tweet> {
    private databaseRepository: DatabaseRepository;
    private databaseName: string;

    constructor(databaseRepository: DatabaseRepository, databaseName: string) {
        this.databaseRepository = databaseRepository;
        this.databaseName = databaseName;
    }

    async insert(entity: Tweet) {
        await this.databaseRepository.insert(this.databaseName, Tweet.Schema.name, entity);
    }

    async getAll(): Promise<Tweet[]> {
        const result = await this.databaseRepository.query(this.databaseName, Tweet.Schema.name, function (table) { return table; });
        const rawResult = await result.toArray();
        const tweetEntities = rawResult.map((object: any) => { return Tweet.createFromObject(object); });
        result.close();
        return tweetEntities;
    }

    async update(entity: Tweet) {
        await this.databaseRepository.insert(this.databaseName, Tweet.Schema.name, entity);
    }

    async delete(entity: Tweet) {
        await this.databaseRepository.delete(this.databaseName, Tweet.Schema.name, { id: entity.id });
    }

    async nextId(): Promise<number> {
        const all = await this.getAll();
        if (all.length === 0) {
            return 0;
        }
        const ids = all.map((tweet) => tweet.id);
        const maxValue = Math.max(...ids);
        return maxValue + 1;
    }

    async findTweetWithText(text: string, postTime: number, title: string): Promise<Tweet | null> {
        const result = await (await this.databaseRepository.query(this.databaseName, Tweet.Schema.name, function (table) { return table.filter({ postTime: postTime, text: text, title: title }); })).toArray();
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    }
}
