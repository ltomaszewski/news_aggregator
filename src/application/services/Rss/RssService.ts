import { Source } from "../../entities/Source";
import { RssEmiter } from "./RssEmiter";
import { RssItem } from "./RssItem";

// We have problem here, the callback is called before item is saved into databse, that result lost data. It is needed to create queue and save them one by one with waiting for finish.

export class RssService {
    private _sources: Map<string, Source> = new Map();
    private _rssEmiter: RssEmiter = new RssEmiter();
    private _callback: (items: RssItem[]) => void = (items) => { };
    private _collectedItems: RssItem[] = [];

    constructor() {
        setInterval(() => {
            if (this._collectedItems.length > 0) {
                this._callback(this._collectedItems);
                this._collectedItems = [];
            }
        }, 5000);
    }

    add(source: Source) {
        this._rssEmiter.add(source.url, source.name);
        this._rssEmiter.on(source.name, (item: any) => {
            const rssSource = this._sources.get(source.name);
            if (rssSource) {
                const rssItem = RssItem.fromObject(item, rssSource);
                this._collectedItems.push(rssItem);
            } else {
                process.exit(0);
            }
        });
        this._sources.set(source.name, source);
    }

    remove(source: Source) {
        this._rssEmiter.remove(source.url);
    }

    setCallback(callback: (items: RssItem[]) => void): void {
        this._callback = callback;
    }
}