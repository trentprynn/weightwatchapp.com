import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboardInfo() {
    return this.http.get<any>(`${environment.apiUrl}/dashboard`)
  }
}
