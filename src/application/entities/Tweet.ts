import { TweetDTO } from "../dtos/TweetDTO";

export class Tweet {
    static Schema = {
        name: "Tweet",
        properties: {
            id: 'id',
            androidPackage: 'androidPackage',
            ticker: 'ticker',
            title: 'title',
            text: 'text',
            postTime: 'postTime',
            userId: 'userId'
        },
    };

    static createFromObject(object: any): Tweet {
        return new Tweet(object.id, object.androidPackage, object.ticker, object.title, object.text, object.postTime, object.userId);
    }

    readonly id: number;
    readonly androidPackage: string;
    readonly ticker: string;
    readonly title: string;
    readonly text: string;
    readonly postTime: number;
    readonly userId: string;

    constructor(id: number, androidPackage: string, ticker: string, title: string, text: string, postTime: number, userId: string) {
        this.id = id;
        this.androidPackage = androidPackage;
        this.ticker = ticker;
        this.title = title;
        this.text = text;
        this.postTime = postTime;
        this.userId = userId;
    }

    static findMaxId(tweets: Tweet[]): number {
        let maxId = 0;
        for (const tweet of tweets) {
            if (tweet.id > maxId) {
                maxId = tweet.id;
            }
        }
        return maxId;
    }

    static createNewId(tweets: Tweet[]): number {
        const maxId = Tweet.findMaxId(tweets);
        return maxId + 1;
    }

    static createFromDTO(dto: TweetDTO, newId: number): Tweet {
        return new Tweet(newId, dto.androidPackage, dto.ticker, dto.title, dto.text, dto.postTime, dto.userId);
    }
}
