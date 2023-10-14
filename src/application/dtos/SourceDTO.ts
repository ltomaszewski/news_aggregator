import { NewsSourceEntityType } from "../entities/Source";
import { isNumber } from "../helpers/Utils";

export class SourceDTO {
    readonly name: string;
    readonly type: NewsSourceEntityType;
    readonly url: string;
    readonly tags: string[];
    readonly contentXpath: string;

    constructor(name: string, type: NewsSourceEntityType, url: string, tags: string[], contentXpath: string = "") {
        this.name = name;
        this.type = type;
        this.url = url;
        this.tags = tags;
        this.contentXpath = contentXpath;

        if (!name || !url || tags.length === 0) {
            throw new Error('All fields (name, type, url, tags) are required.');
        }
    }

    static createFromObject(object: any): SourceDTO {
        if (!object || !object.name || !object.url || !object.tags || object.tags.length === 0) {
            throw new Error('All fields (name, type, url, tags) are required.');
        }

        if (!isNumber(object.type)) {
            throw new Error('Invalid value for "type" field, it must be a number.');
        }

        return new SourceDTO(object.name, object.type, object.url, object.tags, object.contentXpath);
    }
}