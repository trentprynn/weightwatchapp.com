import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { User } from 'src/app/user/types/user.type'
import { environment } from 'src/environments/environment'
import { RegisterRequest } from '../types/register-request.model'

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private http: HttpClient) {}

  register(registerRequestModel: RegisterRequest) {
    return this.http.post<User>(`${environment.apiUrl}/user`, registerRequestModel)
  }
}
