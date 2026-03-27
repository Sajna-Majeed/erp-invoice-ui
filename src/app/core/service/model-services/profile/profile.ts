import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UiService {
  showProfile$ = new Subject<void>();

  openProfile() {
    this.showProfile$.next();
  }
}