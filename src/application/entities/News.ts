export class News {
    static Schema = {
        name: "News",
        properties: {
            id: 'id',
            id_source: 'id_source',
            fetchedAt: 'fetchedAt',
            publicationDate: 'publicationDate',
            title: 'title',
            description: 'description',
            link: 'link',
            tags: 'tags'
        },
    };

    static createFromObject(object: any): News {
        return new News(
            object.id,
            object.id_source,
            object.fetchedAt,
            object.publicationDate,
            object.title,
            object.description,
            object.link,
            object.tags
        );
    }

    readonly id: number;
    readonly id_source: number;
    readonly fetchedAt: number;
    readonly publicationDate: number;
    readonly title: string;
    readonly description: string;
    readonly link: string;
    readonly tags: string[];

    constructor(
        id: number,
        id_source: number,
        fetchedAt: number,
        publicationDate: number,
        title: string,
        description: string,
        link: string,
        tags: string[]
    ) {
        this.id = id;
        this.id_source = id_source;
        this.fetchedAt = fetchedAt;
        this.publicationDate = publicationDate;
        this.title = title;
        this.description = description;
        this.link = link;
        this.tags = tags;
    }
}