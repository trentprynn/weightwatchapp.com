import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs'
import { environment } from 'src/environments/environment'
import { WeightLogEntry } from '../models/weight-log-entry.type'

@Injectable({
  providedIn: 'root',
})
export class WeightLogService {
  constructor(private http: HttpClient) {}

  public fetchWeightLogEntries() {
    return this.http.get<WeightLogEntry[]>(`${environment.apiUrl}/weight-log`).pipe(
      map((data) => {
        data.forEach((d) => {
          d.createdAt = new Date(d.createdAt)
        })
        return data
      })
    )
  }

  public createWeightLogEntry(weight: number) {
    return this.http
      .post<WeightLogEntry>(`${environment.apiUrl}/weight-log`, {
        weight: weight,
      })
      .pipe(
        map((data) => {
          data.createdAt = new Date(data.createdAt)
          return data
        })
      )
  }

  public deleteWeightLogEntry(weightActivityLogId: string) {
    return this.http.delete<WeightLogEntry>(`${environment.apiUrl}/weight-log/${weightActivityLogId}`).pipe(
      map((data) => {
        data.createdAt = new Date(data.createdAt)
        return data
      })
    )
  }
}
