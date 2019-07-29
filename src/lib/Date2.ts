type Name = 'fullYear' | 'month' | 'day' | 'date' | 'hours' | 'minutes' | 'seconds' | 'milliseconds';

interface ProxySetOptions {
  verb: 'set';
  name: Name;
  value: number;
  offset?: number;
}

interface ProxyGetOptions {
  verb: 'get';
  name: Name;
  offset?: number;
}

type TimeType = 'seconds' | 'minutes' | 'hours' | 'days';
type TimeFormat = 'date' | 'datetime' | 'time' | string;
export default class Date2 {
  private readonly date: Date;

  static timeTypeMap: { [key in TimeType]: (n: number) => number } = {
    seconds: n => n * 1000,
    minutes: n => n * 1000 * 60,
    hours: n => n * 1000 * 60 * 60,
    days: n => n * 1000 * 60 * 60 * 24,
  };

  private static makeDate2(date: Date | Date2) {
    if (date instanceof Date) {
      return new Date2(date);
    } else {
      return date;
    }
  }

  constructor(date?: Date | number | Date2 | string) {
    const d =
      typeof date === 'number' ? new Date(date) :
        typeof date === 'string' ? Date.parse(date)
          : date instanceof Date ? date
          : date instanceof Date2 ? date
            : new Date();
    this.date = new Date(d.valueOf());
  }

  add(n: number, time: TimeType) {
    return new Date2(this.date.valueOf() + Date2.timeTypeMap[time](n));
  }

  weekday(n?: number) {
    if (n) {
      throw new Error('You can not set weekday');
    }
    return this.proxy({name: 'day', verb: 'get'});
  }

  day(): number;
  day(n: number): Date2;
  day(n?: number) {
    if (n === undefined) {
      return this.proxy({name: 'date', verb: 'get'});
    } else {
      return this.proxy({name: 'date', verb: 'set', value: n});
    }
  }

  year(): number;
  year(n: number): Date2;
  year(n?: number) {
    if (n === undefined) {
      return this.proxy({name: 'fullYear', verb: 'get'});
    } else {
      return this.proxy({name: 'fullYear', verb: 'set', value: n});
    }
  }

  month(): number;
  month(n: number): Date2;
  month(n?: number) {
    if (n === undefined) {
      return this.proxy({name: 'month', verb: 'get', offset: 1});
    } else {
      return this.proxy({name: 'month', verb: 'set', value: n, offset: 1});
    }
  }

  get monthBeginning() {
    return this.day(1);
  }

  get monthEnding() {
    return this.month(this.month() + 1).day(0);
  }

  get nextMonth() {
    let day = this.day();
    let month = this.month();
    let nextMonth = this.day(1).month(month + 1);
    if (day > nextMonth.monthEnding.day()) {
      return nextMonth.monthEnding;
    } else {
      return nextMonth.day(day);
    }
  }

  get previousMonth() {
    let day = this.day();
    let month = this.month();
    let nextMonth = this.day(1).month(month - 1);
    if (day > nextMonth.monthEnding.day()) {
      return nextMonth.monthEnding;
    } else {
      return nextMonth.day(day);
    }
  }

  hours(): number;
  hours(n: number): Date2;
  hours(n?: number) {
    if (n === undefined) {
      return this.proxy({name: 'hours', verb: 'get'});
    } else {
      return this.proxy({name: 'hours', verb: 'set', value: n});
    }
  }

  minutes(): number;
  minutes(n: number): Date2;
  minutes(n?: number) {
    if (n === undefined) {
      return this.proxy({name: 'minutes', verb: 'get'});
    } else {
      return this.proxy({name: 'minutes', verb: 'set', value: n});
    }
  }

  seconds(): number;
  seconds(n: number): Date2;
  seconds(n?: number) {
    if (n === undefined) {
      return this.proxy({name: 'seconds', verb: 'get'});
    } else {
      return this.proxy({name: 'seconds', verb: 'set', value: n});
    }
  }

  milliseconds(): number;
  milliseconds(n: number): Date2;
  milliseconds(n?: number) {
    if (n === undefined) {
      return this.proxy({name: 'milliseconds', verb: 'get'});
    } else {
      return this.proxy({name: 'milliseconds', verb: 'set', value: n});
    }
  }

  get clone() {
    return new Date2(this.date);
  }

  private proxy(options: ProxyGetOptions): number;
  private proxy(options: ProxySetOptions): Date2;
  private proxy(options: ProxyGetOptions | ProxySetOptions) {
    const {offset = 0} = options;
    if (options.verb === 'get') {
      return (this.date as any)[`get${capitalize(options.name)}`]() + offset;
    } else {
      let d = this.clone;
      (d.date as any)[`set${capitalize(options.name)}`](options.value - offset);
      return d;
    }
  }


  isSameMonthAs(date: Date | Date2) {
    const date2 = Date2.makeDate2(date);
    return this.year() === date2.year() && this.month() === date2.month();
  }

  isLaterMonthThan(date: Date | Date2) {
    const date2 = Date2.makeDate2(date);
    return this.year() === date2.year() && this.month() > date2.month()
      || this.year() > date2.year();
  }

  isFormerMonthThan(date: Date | Date2) {
    const date2 = Date2.makeDate2(date);
    return this.year() === date2.year() && this.month() < date2.month()
      || this.year() < date2.year();
  }

  isSameDayAs(date: Date | Date2) {
    const date2 = Date2.makeDate2(date);
    return this.isSameMonthAs(date2) && this.day() === date2.day();
  }

  toDate() {
    return this.clone.date;
  }

  valueOf() {
    return this.date.valueOf();
  }

  /**
   * toString
   *
   * year: yyyy
   * month: MM
   * day in month: dd
   * hour (0-23): HH
   * minute in hour: mm
   * seconds: ss
   *
   * @param format
   * @see http://tutorials.jenkov.com/java-date-time/parsing-formatting-dates.html
   *
   */
  toString(format: TimeFormat) {
    const formatString =
      format === 'datetime' ? 'yyyy-MM-dd HH:mm:ss'
        : format === 'date' ? 'yyyy-MM-dd'
        : format === 'time' ? 'HH:mm:ss' : format;
    return formatString.replace(/yyyy/g, this.year().toString())
      .replace(/MM/g, pad(this.month()))
      .replace(/M/g, this.month().toString())
      .replace(/dd/g, pad(this.day()))
      .replace(/d/g, this.day().toString())
      .replace(/HH/g, pad(this.hours()))
      .replace(/H/g, this.hours().toString())
      .replace(/mm/g, pad(this.minutes()))
      .replace(/m/g, this.minutes().toString())
      .replace(/ss/g, pad(this.seconds()))
      .replace(/s/g, this.seconds().toString());
  }
}

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function pad(n: number) {
  return n >= 10 ? n.toString() : '0' + n.toString();
}
