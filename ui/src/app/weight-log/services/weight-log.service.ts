import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { WeightLogEntry } from '../models/weight-log-entry.type'

@Injectable({
  providedIn: 'root',
})
export class WeightLogService {
  constructor(private http: HttpClient) {}

  public fetchWeightLogEntries() {
    return this.http.get<WeightLogEntry[]>(`${environment.apiUrl}/weight/log`)
  }

  public createWeightLogEntry(weight: number) {
    return this.http.post<WeightLogEntry>(`${environment.apiUrl}/weight/log`, {
      weight: weight,
    })
  }

  public deleteWeightLogEntry(weightActivityLogId: string) {
    return this.http.delete<WeightLogEntry>(`${environment.apiUrl}/weight/log/${weightActivityLogId}`)
  }
}
