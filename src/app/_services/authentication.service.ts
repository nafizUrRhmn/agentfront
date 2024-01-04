﻿import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {User} from "../_models";
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User | null>(null);
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/v1/login`, { username, password }, { withCredentials: true })
            .pipe(map(user => {
              console.log(user);
                sessionStorage.setItem("refreshToken", user.refreshToken)
                this.userSubject.next(user);
                this.startRefreshTokenTimer();
                return user;
            }));
    }

    logout() {
        this.http.post<any>(`${environment.apiUrl}/v1/revoke-token`, {refreshToken: sessionStorage.getItem('refreshToken')}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.userSubject.next(null);
        this.router.navigate(['/public/login']);
    }

    refreshToken() {
      return this.http.post<any>(`${environment.apiUrl}/v1/refresh-token`, {refreshToken: sessionStorage.getItem('refreshToken')}, { withCredentials: true })
        .pipe(map((user) => {
          this.userSubject.next(user);
          // this.startRefreshTokenTimer();
          return user;
        }));
    }

    // helper methods

    private refreshTokenTimeout?: any;

     updateJwt(){
      const jwtBase64 = this.userValue!.jwtToken!.split('.')[1];
      const jwtToken = JSON.parse(atob(jwtBase64));
      const expires = new Date(jwtToken.exp+'');
      if (jwtToken.exp - Date.now()<=0){
        this.refreshToken()
      }
  }
    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtBase64 = this.userValue!.jwtToken!.split('.')[1];
        const jwtToken = JSON.parse(atob(jwtBase64));
        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        console.log(timeout);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}
