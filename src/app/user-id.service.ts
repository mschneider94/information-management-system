import { Injectable } from '@angular/core';
import { UserID } from './user-id.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserIDService {

  constructor() { }

  getUserID(): UserID {
    let userID: UserID;

    switch (environment.userID.method) {
      
      case 'authelia':
        // ToDo: Implement authelia (https://github.com/authelia/authelia)
        break;

      default:
        userID = {
          name: 'nobody'
        };
    }
    
    return userID;
  }
}
