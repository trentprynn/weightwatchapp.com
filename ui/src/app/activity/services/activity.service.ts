import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { Activity } from '../models/activity.type'

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private http: HttpClient) {}

  public fetchActivities() {
    return this.http.get<Activity[]>(`${environment.apiUrl}/activity`)
  }

  public createActivity(activityName: string, activityIconName: string) {
    return this.http.post<Activity>(`${environment.apiUrl}/activity`, {
      activityName: activityName,
      activityIconName: activityIconName,
    })
  }

  public deleteActivity(activityId: string) {
    return this.http.delete<Activity>(`${environment.apiUrl}/activity/${activityId}`)
  }
}
