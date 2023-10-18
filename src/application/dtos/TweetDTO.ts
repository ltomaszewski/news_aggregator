export class TweetDTO {
    readonly androidPackage: string;
    readonly ticker: string;
    readonly title: string;
    readonly text: string;
    readonly postTime: number;
    readonly userId: string;

    constructor(androidPackage: string, ticker: string, title: string, text: string, postTime: number, userId: string) {
        this.androidPackage = androidPackage;
        this.ticker = ticker;
        this.title = title;
        this.text = text;
        this.postTime = postTime;
        this.userId = userId;

        if (!androidPackage || !ticker || !title || !text || !postTime || !userId) {
            throw new Error('All fields (androidPackage, ticker, title, text, postTime, userId) are required.');
        }
    }

    static createFromObject(object: any): TweetDTO {
        if (!object || !object.androidPackage || !object.ticker || !object.title || !object.text || !object.postTime || !object.userId) {
            throw new Error('All fields (androidPackage, ticker, title, text, postTime, userId) are required.');
        }

        return new TweetDTO(object.androidPackage, object.ticker, object.title, object.text, object.postTime, object.userId);
    }
}
