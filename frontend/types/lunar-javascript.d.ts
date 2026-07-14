declare module "lunar-javascript" {
  export class Lunar {
    static fromDate(date: Date): Lunar;
    static fromYmd(year: number, month: number, day: number): Lunar;
    getDay(): number;
    getMonth(): number;
    getYear(): number;
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getTimeInGanZhi(): string;
    getTimes(): LunarTime[];
    getJieQi(): string;
    getNextJieQi(): JieQi;
    getPrevJieQi(): JieQi;
    getSolar(): Solar;
  }

  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    toYmd(): string;
  }

  export class LunarTime {
    getGanZhi(): string;
    getTianShenLuck(): string;
  }

  export interface JieQi {
    getName(): string;
  }
}
