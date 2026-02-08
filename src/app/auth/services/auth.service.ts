import { HttpClient } from '@angular/common/http';
import { Injectable, signal, provideBrowserGlobalErrorListeners, inject, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { UserRegister } from '@auth/interfaces/user.register.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated'

const BASE_URL = environment.apiBaseUrl;
const AUTH_LOGIN = '/auth/login';
const CHECK_STATUS_TOKEN = '/auth/check-status'
const REGISTER_AUTH = '/auth/register';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal('checking')
  private _user = signal<User | null>(null)
  private _token = signal<string | null>(localStorage.getItem('token'))

  private http = inject(HttpClient);


  checkStatusResource = rxResource(
    {
      stream: () => this.checkStatus()
    }

  );

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') {
      return 'checking'
    }
    if (this._user()) {
      return 'authenticated'
    }
    return 'not-authenticated'

  })

  user = computed(() =>
    this._user()
  )
  token = computed(this._token)
  isadmin = computed(()=>this._user()?.roles.includes('admin') ?? false)

  register(user: UserRegister): Observable<boolean> {
    return this.http.post<AuthResponse>(`${BASE_URL + REGISTER_AUTH}`, {
      ...user
    }).pipe(
      map(resp => {
        return true
      }),
      catchError((error: any) => {
        return of(false)
      })
    )

  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${BASE_URL + AUTH_LOGIN}`, {
      email,
      password
    }).pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuhError(error))

    )
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logOut();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${BASE_URL + CHECK_STATUS_TOKEN}`).pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuhError(error))
    )



  }
  logOut() {
    this._user.set(null),
    this._token.set(null),
    this._authStatus.set('not-authenticated')
    localStorage.removeItem('token');
  }

  private handleAuthSuccess(resp: AuthResponse) {
    this._user.set(resp.user);
    this._authStatus.set('authenticated');
    this._token.set(resp.token);

    localStorage.setItem("token", resp.token);
    return true;
  }
  private handleAuhError(error: any) {
    this.logOut();
    return of(false);
  }

}
