// All things calendar related belong here.
// NOTE: As of now, CalendarEntry represents an actual (non-null) entry.
// Therefore, all functions using this class should expect that 
// a `null` value is the absence of an entry and handle it as such.

export class CalendarEntry {
  date: SimpleDate;
  sleepQuality: SleepQuality;
  sleepTime: TimeRange;
  notes: string;

  constructor(date: SimpleDate, sleepQuality: SleepQuality,
    sleepTimeRange: TimeRange, notes: string) {
    this.date = date;
    this.sleepQuality = sleepQuality;
    this.sleepTime = sleepTimeRange;
    this.notes = notes;
  }
}

// A date that only uses Year, Month, and Day
export class SimpleDate {
  day: number;
  month: number;
  year: number;
  date: Date;

  constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.date = new Date(year, month, day);
  }

  static currentDate() {
    const currDate = new Date();
    return new SimpleDate(currDate.getFullYear(), currDate.getMonth(), currDate.getDate())
  }

  // Get the total number of days in the current month
  getNumDaysInMonth() {
    // Using 0 as the "day" argument fetches the last day of the previous month
    return new Date(this.getYear(), this.getMonth() % 12, 0).getDate();
  }

  // Get the current month as a string
  getMonthString() {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ]
    return months[this.getMonth() - 1];
  }

  // Get the current day
  getDay() {
    return this.date.getDate();
  }

  // Get the current month index (1 -> Jan, ..., 12 -> Dec)
  getMonth() {
    return this.date.getMonth() + 1;
  }

  // Get the current year
  getYear() {
    return new Date().getFullYear();
  }

  // Formats the date as {MonthString} {Day}, {Year}
  toPrettyString() {
    let [year, month, day] = SimpleDate.extractYearMonthDayFromString(this.toString());

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return `${monthNames[month - 1]} ${day}, ${year}`;
  }

  toString() {
    return `${this.year}-${this.month}-${this.day}`
  }

  // PRE: dateStr must be in the form represented by 'toString()'
  static fromString(dateStr: string) {
    const [year, month, day] = SimpleDate.extractYearMonthDayFromString(dateStr);
    return new SimpleDate(year, month, day);
  }

  // Returns the numeric values for year, month, and day
  // in the array shaped as [year, month, day].
  //
  // PRE: dateStr must be in the form represented by 'toString()'
  static extractYearMonthDayFromString(dateStr: string): number[] {
    // Buffers for collecting year, month, and day.
    let yearBuf: string = "", year: number;
    let monthBuf: string = "", month: number;
    let dayBuf: string = "", day: number;

    let i = 0;

    // Year
    while (dateStr[i] !== '-') {
      yearBuf += dateStr[i];
      i++;
    }
    i++; // skip the '-'
    year = parseInt(yearBuf);

    // Month
    while (dateStr[i] !== '-') {
      monthBuf += dateStr[i];
      i++;
    }
    i++; // skip the '-'
    month = parseInt(monthBuf);

    while (i < dateStr.length) {
      dayBuf += dateStr[i];
      i++;
    }
    day = parseInt(dayBuf);

    return [year, month, day];
  }
}

export enum SleepQuality {
  POOR,
  FAIR,
  GOOD,
}

/// Time should be given in 24-hour format
export class Time {
  hour: number;
  minute: number;
  second: number;

  constructor(hour: number, minute: number, second: number) {
    this.hour = hour;
    this.minute = minute;
    this.second = second;
  }

  toString() {
    return this.padTime();
  }

  // PRE: timeStr must be in the form represented by 'toString()'
  static fromString(timeStr: string) {
    const [hour, minute, second] = Time.extractHourMinuteSecondFromString(timeStr);
    return new Time(hour, minute, second);
  }
 
  // Returns the numeric values for hour, minute, and second
  // in the array shaped as [hour, minute, second].
  //
  // PRE: timeStr must be in the form represented by 'toString()'
  static extractHourMinuteSecondFromString(timeStr: string): number[] {
    // Buffers for collecting year, month, and day.
    let hourBuf: string = "", hour: number;
    let minuteBuf: string = "", minute: number;
    let secondBuf: string = "", second: number;

    let i = 0;

    // Hour
    while (timeStr[i] !== ':') {
      hourBuf += timeStr[i];
      i++;
    }
    i++; // skip the ':'
    hour = parseInt(hourBuf);

    // Minute
    while (timeStr[i] !== ':') {
      minuteBuf += timeStr[i];
      i++;
    }
    i++; // skip the ':'
    minute = parseInt(minuteBuf);

    // Second
    while (i < timeStr.length) {
      secondBuf += timeStr[i];
      i++;
    }
    second = parseInt(secondBuf);

    return [hour, minute, second];
  }

  padTime() {
    const paddedHour = this.hour.toString().padStart(2, '0')
    const paddedMinute = this.minute.toString().padStart(2, '0')
    const paddedSecond = this.second.toString().padStart(2, '0')
    return `${paddedHour}:${paddedMinute}:${paddedSecond}`
  }

}

export class TimeRange {
  startTime: Time;
  endTime: Time;

  constructor(startTime: Time, endTime: Time) {
    this.startTime = startTime;
    this.endTime = endTime;
  }

  toString() {
    return `${this.startTime.toString()} - ${this.endTime.toString()}`;
  }
}
