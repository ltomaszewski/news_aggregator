import RssFeedEmitter from 'rss-feed-emitter';

export class RssEmiter {
    feeder;

    constructor() {
        this.feeder = new RssFeedEmitter({ skipFirstLoad: false });
        this.feeder.on('error', console.error);
    }

    add(url, eventName) {
        this.feeder.add({
            url: url,
            refresh: 2000,
            eventName: eventName
        });
    }

    on(eventName, onNewItem) {
        this.feeder.on(eventName, onNewItem);
    }

    destroy() {
        this.feeder.destroy();
    }
}