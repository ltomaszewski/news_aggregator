import { SourceDTO } from "../dtos/SourceDTO";

export class Source {
    static Schema = {
        name: "Source",
        properties: {
            id: 'id',
            name: 'name',
            type: 'type',
            url: 'url',
            tags: 'tags',
            contentXpath: 'contentXpath'
        },
    };

    static createFromObject(object: any): Source {
        return new Source(object.id, object.name, object.type, object.url, object.tags, object.contentXpath);
    }

    readonly id: number;
    readonly name: string;
    readonly type: NewsSourceEntityType;
    readonly url: string;
    readonly tags: string[];
    readonly contentXpath: string;

    constructor(id: number, name: string, type: NewsSourceEntityType, url: string, tags: string[], contentXpath: string = "") {
        this.id = id;
        this.name = name;
        this.type = type;
        this.url = url;
        this.tags = tags;
        this.contentXpath = contentXpath
    }

    static findMaxId(sources: Source[]): number {
        let maxId = 0;
        for (const source of sources) {
            if (source.id > maxId) {
                maxId = source.id;
            }
        }
        return maxId;
    }

    static createNewId(sources: Source[]): number {
        const maxId = Source.findMaxId(sources);
        return maxId + 1;
    }

    static createFromDTO(dto: SourceDTO, newId: number): Source {
        return new Source(newId, dto.name, dto.type, dto.url, dto.tags, dto.contentXpath);
    }
}

export enum NewsSourceEntityType { Rss, Twitter }