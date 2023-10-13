export class Source {
    static Schema = {
        name: "Source",
        properties: {
            id: 'id',
            name: 'name',
            type: 'type',
            url: 'url',
            tags: 'tags'
        },
    };

    static createFromObject(object: any): Source {
        return new Source(object.id, object.name, object.type, object.url, object.tags);
    }

    readonly id: number;
    readonly name: string;
    readonly type: NewsSourceEntityType;
    readonly url: string;
    readonly tags: string[];
    // TODO:
    // Custom configuration i.e. for rss source where some elements are not parsed on it self right. Format {destinationField}:{custom_object_Field}
    // Small unit test is needed to validate schema of any rss link. Support is not implemented yet
    readonly adjustments: string[];

    constructor(id: number, name: string, type: NewsSourceEntityType, url: string, tags: string[], adjustments: string[] = []) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.url = url;
        this.tags = tags;
        this.adjustments = adjustments
    }
}

export enum NewsSourceEntityType { Rss, Finmarket }