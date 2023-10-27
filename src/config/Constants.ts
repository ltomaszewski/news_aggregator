import { SourceDTO } from "../application/dtos/SourceDTO";

// Enumeration representing different environment modes: Development and Production
export enum Env {
    Dev = 'DEV_',
    Prod = ''
}

// DatabaseHost - the hostname of the RethinkDB server
export const DatabaseHost = '192.168.50.101';
// DatabasePort - the port number of the RethinkDB server
export const DatabasePort = 28015;
// DatabaseForceDrop - indicates whether the database should be forcefully dropped (true/false)
export const DatabaseForceDrop = false;

export const DEFAULT_SOURCES: SourceDTO[] = [
    SourceDTO.createFromObject({
        name: 'investing.com',
        type: 0,
        url: 'https://investing.com/rss/market_overview_Fundamental.rss',
        tags: ["finance"]
    }),
    SourceDTO.createFromObject({
        name: 'yahoo.finance',
        type: 0,
        url: 'https://finance.yahoo.com/news/rssindex',
        tags: ["finance"]
    }),
    SourceDTO.createFromObject({
        name: 'wsj.com',
        type: 0,
        url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
        tags: ["news"]
    }),
    SourceDTO.createFromObject({
        name: 'wsj.com',
        type: 0,
        url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
        tags: ["news"]
    }),
    SourceDTO.createFromObject({
        name: 'marketwatch',
        type: 0,
        url: 'http://feeds.marketwatch.com/marketwatch/realtimeheadlines/',
        tags: ["finance"]
    }),
    SourceDTO.createFromObject({
        name: 'marketwatch',
        type: 0,
        url: 'http://feeds.marketwatch.com/marketwatch/realtimeheadlines/',
        tags: ["finance"]
    }),
    SourceDTO.createFromObject({
        name: 'newsmax',
        type: 0,
        url: 'https://www.newsmax.com/rss/economy/2/',
        tags: ["finance"]
    }),
    // SourceDTO.createFromObject({
    //     name: 'tradingeconomics',
    //     type: 0,
    //     url: 'https://tradingeconomics.com/united-states/rss',
    //     tags: ["finance"]
    // }),
    SourceDTO.createFromObject({
        name: 'NYT',
        type: 0,
        url: 'https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/business/economy/rss.xml',
        tags: ["news"]
    }),
    SourceDTO.createFromObject({
        name: 'theguardian',
        type: 0,
        url: 'https://www.theguardian.com/business/economics/rss',
        tags: ["news"]
    }),
    SourceDTO.createFromObject({
        name: 'polsatnews',
        type: 0,
        url: 'https://www.polsatnews.pl/rss/wszystkie.xml',
        tags: ["news", "pl"]
    }),
    SourceDTO.createFromObject({
        name: 'polsatnews',
        type: 0,
        url: 'https://www.polsatnews.pl/rss/wszystkie.xml',
        tags: ["news", "pl"]
    }),
    SourceDTO.createFromObject({
        name: 'googlenews_pl',
        type: 0,
        url: 'https://news.google.com/rss?topic=n&hl=pl&gl=PL&ceid=PL:pl',
        tags: ["news", "pl"]
    }),
    SourceDTO.createFromObject({
        name: 'googlenews_us',
        type: 0,
        url: 'https://news.google.com/rss?topic=n&hl=en-US&gl=US&ceid=US:en',
        tags: ["news", "us"]
    })
];
