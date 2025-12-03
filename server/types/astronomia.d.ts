declare module 'astronomia/julian' {
  export function DateToJD(date: Date): number;
  export class CalendarGregorian {
    constructor(year: number, month: number, day: number, hour?: number);
    toJDE(): number;
  }
}

declare module 'astronomia/planetposition' {
  export interface PlanetData {}
  
  export interface Position {
    lon: number;
    lat: number;
    range: number;
  }
  
  export function position(planet: PlanetData, jd: number): Position;
  
  export const mercury: PlanetData;
  export const venus: PlanetData;
  export const earth: PlanetData;
  export const mars: PlanetData;
  export const jupiter: PlanetData;
  export const saturn: PlanetData;
  export const uranus: PlanetData;
  export const neptune: PlanetData;
}

declare module 'astronomia/solar' {
  export function apparentLongitude(T: number): number;
  export function apparentEquatorial(T: number): { ra: number; dec: number };
}
