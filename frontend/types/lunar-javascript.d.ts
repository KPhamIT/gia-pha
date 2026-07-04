declare module "lunar-javascript" {
  export class Lunar {
    static fromDate(date: Date): Lunar;
    getDay(): number;
    getMonth(): number;
    getYear(): number;
    getYearInGanZhi(): string;
    getTimes(): LunarTime[];
    getJieQi(): string;
    getNextJieQi(): JieQi;
    getPrevJieQi(): JieQi;
  }

  export class LunarTime {
    getGanZhi(): string;
    getTianShenLuck(): string;
  }

  export interface JieQi {
    getName(): string;
  }
}
