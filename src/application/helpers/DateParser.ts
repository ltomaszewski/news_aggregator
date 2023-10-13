import { getUnixTime } from "date-fns";

export class DateParser {
    parse(rawDate: string): number {
        const result = new Date(rawDate);
        if (!isNaN(result.getTime())) {
            return getUnixTime(result)
        } else {
            const customParse = this.parseDateString(rawDate);
            return getUnixTime(customParse)
        }
    }

    private parseDateString(dateString: string): Date {
        const regex = /^.*, (\d{1,2})\/(\d{1,2})\/(\d{4}) - (\d{1,2}):(\d{1,2})$/;
        const match = dateString.match(regex);

        if (match) {
            const [, month, day, year, hours, minutes] = match.map(Number);
            // JavaScript months are 0-indexed, so subtract 1 from the parsed month
            return new Date(year, month - 1, day, hours, minutes);
        } else {
            console.error('Invalid date format');
            process.exit(0)
        }
    }
}