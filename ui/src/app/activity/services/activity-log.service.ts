import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { ActivityLog } from '../models/activity-log-entry.type'

@Injectable({
  providedIn: 'root',
})
export class ActivityLogService {
  constructor(private http: HttpClient) {}

  public fetchActivityLogs() {
    return this.http.get<ActivityLog[]>(`${environment.apiUrl}/activity/log`)
  }

  public addActivityLog(activityId: string, activityDate: Date, activityLengthSeconds: number) {
    return this.http.post<ActivityLog>(`${environment.apiUrl}/activity/log`, {
      activityId: activityId,
      activityLengthSeconds: activityLengthSeconds,
      activityDate: activityDate,
    })
  }

  public deleteActivityLog(activityLogId: string) {
    return this.http.delete<ActivityLog>(`${environment.apiUrl}/activity/log/${activityLogId}`)
  }
}
