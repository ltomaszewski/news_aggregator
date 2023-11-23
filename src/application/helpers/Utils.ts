export function findProp(obj: any, prop: string, defval?: any): any {
    if (typeof defval === 'undefined') {
        defval = null;
    }

    const keys = prop.split('.');
    for (let i = 0; i < keys.length; i++) {
        if (typeof obj[keys[i]] === 'undefined') {
            return defval;
        }
        obj = obj[keys[i]];
    }
    return obj;
}

export function isNumber(value: unknown): value is number {
    return typeof value === 'number';
}

export function currentTimestampAndDate(): string {
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);
    const formattedDate = now.toISOString(); // Or use any other format you prefer

    return `Timestamp: ${timestamp}, Date: ${formattedDate}`;
}