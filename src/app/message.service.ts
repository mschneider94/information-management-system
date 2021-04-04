import { Injectable } from '@angular/core';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() {
    UIkit.use(Icons);
  }

  show(message: string, status: string = null): void {
    UIkit.notification(message, {
      pos: 'bottom-right',
      timeout: 3000,
      status: status
    });
  }

  info(message: any): void {
    console.info(message);
  }

  log(message: any): void {
    console.log(message);
  }

  warn(message: any): void {
    console.warn(message);
  }

  error(message: any): void {
    console.error(message);
  }

  debug(message: any): void {
    console.debug(message);
  }
}
