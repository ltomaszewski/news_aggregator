import RssFeedEmitter from 'rss-feed-emitter';

export class RssEmiter {
    feeder;

    constructor() {
        this.feeder = new RssFeedEmitter({ skipFirstLoad: false });
    }

    add(url) {
        this.feeder.add({
            url: url,
            refresh: 2000
        });
    }

    on(onNewItem) {
        this.feeder.on('error', console.error);
        this.feeder.on('new-item', onNewItem);
    }

    destroy() {
        this.feeder.destroy();
    }
}