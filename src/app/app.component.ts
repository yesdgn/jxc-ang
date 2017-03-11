import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as store from 'store2';

import { environment } from '../environments/environment';
import { MissionService } from './core/mission.service';
import { CommonService } from './core/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 private appconfig=environment.APP_CONFIG;
  private userInfo = this.commonService.UserInfo;
  private isLogin = this.commonService.UserInfo ? true : false;
  private onceSubscription: Subscription;

  constructor(private commonService: CommonService, private router: Router, private missionService: MissionService
    ) {
    //订阅消息
    this.onceSubscription = missionService.missionOnceAnnounced$.subscribe(
      astronaut => {
        switch (astronaut.type) {
          case 'LOGIN':  //已登录
            this.isLogin = true;
            this.userInfo = this.commonService.UserInfo;
            break;
          case 'LOGINOUT':  //注销
            this.logout();
            break;
          case 'MESSAGE':  //显示消息
            this.commonService.globalMessage(astronaut.payload);
            break;
        }
      });
  }
  ngOnInit() {
    if (!this.isLogin) {
      setTimeout(function () {
        this.router.navigate(['/login']);
      }.bind(this), 0);
    }
  }


  logout() {
    this.commonService.logout();
    this.isLogin = false;
    store.session.remove('userInfo');
    store.session.remove('sessionKey');
    this.router.navigate(['/login']);
  }
  setFavorites(){
    this.commonService.setFavorite()
    .then((data)=>{
     this.commonService.globalMessage(data[0].resultDescribe);
    })
  }
  showMessages(){

  }
}


