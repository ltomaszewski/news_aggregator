import { Source } from "../../entities/Source";
import { DateParser } from "../../helpers/DateParser.js";
import { findProp } from "../../helpers/Utils";

export class RssItem {
    readonly title: string;
    readonly link: string;
    readonly publicationDate: number;
    readonly description: string;
    readonly fetchedAt: number;
    readonly source: Source;

    constructor(
        title: string,
        link: string,
        publicationDate: number,
        description: string,
        fetchedAt: number,
        source: Source
    ) {
        this.title = title;
        this.link = link;
        this.publicationDate = publicationDate;
        this.description = description;
        this.fetchedAt = fetchedAt;
        this.source = source
    }

    static fromObject(object: any, source: Source): RssItem {
        const dateParser = new DateParser()
        const title = object["title"]
        const link = object["link"]
        const rawPublicationDate = findProp(object, "rss:pubdate.#")
        const publicationDate = dateParser.parse(rawPublicationDate)
        const description = findProp(object, "rss:description.#")
        const fetchedAt = dateParser.currentTime
        return new RssItem(title, link, publicationDate, description, fetchedAt, source)
    }
}
