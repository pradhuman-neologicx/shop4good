import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading: boolean = false;
  public loading$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  setLoading(loading: boolean) {
    this.loading = loading;
    this.loading$.next(loading);
  }

  getLoading(): boolean {
    return this.loading;
  }
}
