export class TweetDTO {
    readonly packageInfo: string;
    readonly ticker: string;
    readonly title: string;
    readonly text: string;
    readonly postTime: number;

    constructor(packageInfo: string, ticker: string, title: string, text: string, postTime: number) {
        this.packageInfo = packageInfo;
        this.ticker = ticker === text ? "" : ticker;
        this.title = title;
        this.text = text;
        this.postTime = postTime;

        if (!packageInfo || !ticker || !title || !text || !postTime) {
            throw new Error('All fields (packageInfo, ticker, title, text, postTime, userId) are required.');
        }
    }

    static createFromObject(object: any): TweetDTO {
        if (!object || !object.packageInfo || !object.ticker || !object.title || !object.text || !object.postTime) {
            throw new Error('All fields (packageInfo, ticker, title, text, postTime, userId) are required.');
        }

        return new TweetDTO(object.packageInfo, object.ticker, object.title, object.text, object.postTime);
    }

    static compareTweets(tweet1: TweetDTO, tweet2: TweetDTO): boolean {
        return tweet1.ticker === tweet2.ticker &&
            tweet1.title === tweet2.title &&
            tweet1.text === tweet2.text;
    }
}
