export type NgxChartsDataSeriesEntry = {
  id?: string | undefined
  name: string | Date
  value: number
}

export type NgxChartsDataFormat = {
  name: string
  series: NgxChartsDataSeriesEntry[]
}
