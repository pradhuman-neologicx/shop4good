import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(private http: HttpClient) {}

  // admin panel

  getisLoggedIn(): boolean {
    return window.localStorage.getItem('isloggedIn') === 'true';
  }
  isLoggedIn(isloggedIn: boolean) {
    window.localStorage['isloggedIn'] =
      isloggedIn != undefined ? isloggedIn : false;
  }

  getLoginAs(): number {
    return window.localStorage['LoginAs'];
  }

  saveLoginAs(LoginAs: number) {
    window.localStorage['LoginAs'] = LoginAs;
  }

  saveRoles(roles: any) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  getRoles() {
    return JSON.parse(localStorage.getItem('roles') || '[]');
  }

  getfirstLoggedIn(): boolean {
    return window.localStorage['isfirstlogin'];
  }
  firstLoggedIn(isfirstlogin: boolean) {
    window.localStorage['isfirstlogin'] =
      isfirstlogin != undefined ? isfirstlogin : false;
  }

  getSession(): string {
    return window.localStorage['Session'];
  }

  saveSession(Session: string) {
    window.localStorage['Session'] = Session;
  }
  getName(): string {
    return window.localStorage['name'];
  }

  saveName(name: string) {
    window.localStorage['name'] = name;
  }

  getSessionStartdate(): string {
    return window.localStorage['Sessionstartdate'];
  }

  saveSessionStartdate(Session: string) {
    window.localStorage['Sessionstartdate'] = Session;
  }

  getSessionEnddate(): string {
    return window.localStorage['SessionEnddate'];
  }

  saveSessionEnddate(Session: string) {
    window.localStorage['SessionEnddate'] = Session;
  }

  getpanelUserId(): Number {
    return window.localStorage['panel_user_id'];
  }

  savepanelUserId(userid: Number) {
    window.localStorage['panel_user_id'] = userid;
  }
  getadminame(): String {
    return window.localStorage['adminname'];
  }

  saveadminame(adminname: string) {
    window.localStorage['adminname'] = adminname;
  }

  saveAdminToken(Token: String) {
    window.localStorage['Token'] = Token;
  }
  saveAdminRole(Role: String) {
    window.localStorage['Role'] = Role;
  }
  getadmiRole(): String {
    return window.localStorage['Role'];
  }
  getpanelPartyId(): Number {
    return window.localStorage['Party_id'];
  }

  savePartyId(Party_id: Number) {
    window.localStorage['Party_id'] = Party_id;
  }

  getType(): String {
    return window.localStorage['Type'];
  }

  saveType(Type: String) {
    window.localStorage['Type'] = Type;
  }

  getToken(): String {
    return window.localStorage['Token'];
  }

  saveToken(Token: String) {
    window.localStorage['Token'] = Token;
  }

  // Profile Image of
  getImageUrl(): String {
    return window.localStorage['ImageUrl'];
  }

  saveImageUrl(ImageUrl: String) {
    window.localStorage['ImageUrl'] = ImageUrl;
  }

  getUserId(): String {
    return window.localStorage['user_id'];
  }

  saveUserId(user_id: String) {
    window.localStorage['user_id'] = user_id;
  }

  // student panel
  getstudentLoggedIn(): boolean {
    return window.localStorage['isloggedStudent'];
  }
  isstudentLoggedIn(isloggedStudent: boolean) {
    window.localStorage['isloggedStudent'] =
      isloggedStudent != undefined ? isloggedStudent : false;
  }

  getSessionStartdateStudent(): string {
    return window.localStorage['SessionstartdateStudent'];
  }

  saveSessionStartdateStudent(Session: string) {
    window.localStorage['SessionstartdateStudent'] = Session;
  }

  getSessionEnddateStudent(): string {
    return window.localStorage['SessionEnddateStudent'];
  }

  saveSessionEnddateStudent(Session: string) {
    window.localStorage['SessionEnddateStudent'] = Session;
  }

  getSessionStudent(): string {
    return window.localStorage['SessionStudent'];
  }

  saveSessionStudent(Session: string) {
    window.localStorage['SessionStudent'] = Session;
  }

  getpanelUserIdStudent(): String {
    return window.localStorage['panel_user_idStudent'];
  }

  savepanelUserIdStudent(userid: String) {
    window.localStorage['panel_user_idStudent'] = userid;
  }

  getTokenStudent(): String {
    return window.localStorage['TokenStudent'];
  }

  saveTokenStudent(Token: String) {
    window.localStorage['TokenStudent'] = Token;
  }

  // Profile Image of
  getImageUrlStudent(): String {
    return window.localStorage['ImageUrlStudent'];
  }

  saveImageUrlStudent(ImageUrl: String) {
    window.localStorage['ImageUrlStudent'] = ImageUrl;
  }

  getUserIdStudent(): String {
    return window.localStorage['user_idStudent'];
  }

  saveUserIdStudent(user_id: String) {
    window.localStorage['user_idStudent'] = user_id;
  }

  getLoginAsStudent(): number {
    return window.localStorage['LoginAsStudent'];
  }

  saveLoginAsStudent(LoginAs: number) {
    window.localStorage['LoginAsStudent'] = LoginAs;
  }

  ///call on logout
  clearStorage() {
    window.localStorage.removeItem('isloggedIn');
    window.localStorage.removeItem('panel_user_id');

    window.localStorage.removeItem('Token');
    window.localStorage.removeItem('Role');
    window.localStorage.removeItem('adminname');
    window.localStorage.removeItem('isfirstlogin');

    // window.localStorage.removeItem("isloggedStudent");
  }

  clearStorageStudent() {
    window.localStorage.removeItem('isloggedStudent');
    window.localStorage.removeItem('user_idStudent');
    window.localStorage.removeItem('panel_user_idStudent');
    window.localStorage.removeItem('LoginAsStudent');

    window.localStorage.removeItem('TokenStudent');
    window.localStorage.removeItem('SessionStudent');
    window.localStorage.removeItem('ImageUrlStudent');
    window.localStorage.removeItem('SessionstartdateStudent');
    window.localStorage.removeItem('SessionEnddateStudent');
  }
}
