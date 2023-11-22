import { Source } from "../../entities/Source";
import { RssEmiter } from "./RssEmiter.js";
import { RssItem } from "./RssItem.js";

export class RssService {
    private _sources: Map<string, Source> = new Map();
    private _rssEmiter: RssEmiter = new RssEmiter();
    private _callback: (items: RssItem) => void = (items) => { };

    add(source: Source) {
        this._rssEmiter.add(source.url, source.name);
        this._rssEmiter.on(source.name, (item: any) => {
            const rssSource = this._sources.get(source.name);
            if (rssSource) {
                const rssItem = RssItem.fromObject(item, rssSource);
                this._callback(rssItem);
            } else {
                process.exit(0);
            }
        });
        this._sources.set(source.name, source);
    }

    remove(source: Source) {
        this._rssEmiter.remove(source.url);
    }

    setCallback(callback: (items: RssItem) => void): void {
        this._callback = callback;
    }
}