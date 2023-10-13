import { Source } from "../../entities/Source";
import { DateUtils } from "../../helpers/DateParser";
import { findProp } from "../../helpers/Utils";
import { RssEmiter } from "./RssEmiter";
import { RssItem } from "./RssItem";

export class RssService {
    private _sources: Map<string, Source> = new Map();
    private _rssEmiter: RssEmiter = new RssEmiter();
    private _callback: (item: RssItem) => void = (item) => { };

    constructor() { }

    add(source: Source) {
        this._rssEmiter.add(source.url, source.name)
        this._rssEmiter.on(source.name, (item: any) => {
            const rssSource = this._sources.get(source.name)
            if (rssSource) {
                const rssItem = RssItem.fromObject(item, rssSource)
                this._callback(rssItem)
            } else {
                process.exit(0)
            }
        })
        this._sources.set(source.name, source)
    }

    setCallback(callback: (item: RssItem) => void): void {
        this._callback = callback;
    }
}