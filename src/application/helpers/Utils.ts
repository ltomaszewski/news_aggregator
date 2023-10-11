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