export class NewsEntity {
    
    static Schema = {
        name: "NewsEntity",
        properties: {
            id: 'id',
            id_source: 'id_source',
            headline: 'headline',
            text: 'text',
            url: 'url',
            tags: 'tags'
        },
    };

    static createFromObject(object: any): NewsEntity {
        return new NewsEntity(object.id, object.id_source, object.headline, object.text, object.url, object.tags);
    }

    readonly id: number;
    readonly id_source: string;
    readonly headline: string;
    readonly text: string;
    readonly url: string;
    readonly tags: string[];

    constructor(id: number, id_source: string, headline: string, text: string, url: string, tags: string[]) {
        this.id = id;
        this.id_source = id_source;
        this.headline = headline;
        this.text = text;
        this.url = url;
        this.tags = tags;
    }
}
