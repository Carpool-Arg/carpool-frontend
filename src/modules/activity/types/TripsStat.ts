import { Stat } from "./Stat"


export interface TripStat {
  historialTotal: number
  kmFiltered: number //filtered total
  historialByPeriod: Stat[]
}