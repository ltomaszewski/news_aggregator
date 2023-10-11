export class NewsSourceEntity {

    static Schema = {
        name: "NewsSourceEntity",
        properties: {
            id: 'id',
            name: 'name',
            type: 'type',
            url: 'url',
            tags: 'tags'
        },
    };

    static createFromObject(object: any): NewsSourceEntity {
        return new NewsSourceEntity(object.id, object.name, object.type, object.url, object.tags);
    }

    readonly id: number;
    readonly name: string;
    readonly type: NewsSourceEntityType;
    readonly url: string;
    readonly tags: string[];

    constructor(id: number, name: string, type: NewsSourceEntityType, url: string, tags: string[]) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.url = url;
        this.tags = tags;
    }
}

export enum NewsSourceEntityType { Rss, Finmarket }