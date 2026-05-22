declare module 'lunar-javascript' {
  class Lunar {
    static fromYmd(year: number, month: number, day: number): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getSolar(): Solar;
    getYearGan(): string;
    getYearZhi(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getDayGan(): string;
    getDayZhi(): string;
  }

  class LunarMonth {
    getYear(): number;
    getMonth(): number;
    getDayCount(): number;
    isLeap(): boolean;
  }

  class LunarYear {
    static fromYear(year: number): LunarYear;
    getMonth(month: number): LunarMonth | null;
    getLeapMonth(): number;
  }

  class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getLunar(): Lunar;
  }
}
