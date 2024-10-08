import RssFeedEmitter from 'rss-feed-emitter';

export class RssEmiter {
    feeder;

    constructor() {
        this.feeder = new RssFeedEmitter({ skipFirstLoad: false });
        this.feeder.on('error', console.log);
    }

    add(url, eventName) {
        this.feeder.add({
            url: url,
            refresh: 60000,
            eventName: eventName
        });
    }

    remove(url) {
        this.feeder.remove(url)
    }

    on(eventName, onNewItem) {
        this.feeder.on(eventName, onNewItem);
    }

    destroy() {
        this.feeder.destroy();
    }
}