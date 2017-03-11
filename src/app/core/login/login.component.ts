import { Component, OnInit, AfterViewInit,  ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MissionService } from '../mission.service';
import { CommonService } from '../common.service';
import { LoginUser, RegUser } from '../data-model';
import * as store from 'store2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
  private loginUser: LoginUser;
  private regUser: RegUser;
  private loginUserInfo;

  constructor(private router: Router, private commonService: CommonService, private missionService: MissionService
  ,private el: ElementRef) { 
    
  }

  ngOnInit() {
    let preLoginName = store('loginName');
    let preRememberLogin = store('rememberLogin');
    this.loginUser = new LoginUser(preLoginName ? preLoginName : '', '', preRememberLogin ? true : false);
    this.regUser = new RegUser('', '', '');

    this.loginUserInfo = store.session('userInfo');
    if (this.loginUserInfo) //已登录则直接进入主界面
    { this.missionService.announceOnceMission({type:'LOGIN',payload:true});
      this.router.navigate(['/main']); return; }
    }
 
  rememberLoginChange(): void {
    store.set('rememberLogin', this.loginUser.rememberLogin);
  }
  login(): void {
    this.commonService.login(this.loginUser)
      .then((data) => {
        if ( data.item0[0].result == 'success') {
          this.missionService.announceOnceMission({type:'LOGIN',payload:true}); //发布登录成功的消息，消息内容为true布尔值，代表登录成功。
          this.router.navigate(['/main']);
        }
        else if (data.item0[0].result == 'fail') {
           this.commonService.globalMessage(data.item0[0].resultDescribe);
        }
      }
      )
      .catch(error => this.commonService.globalMessage(error)
      );
  }

  userReg(): void {
    this.commonService.reg(this.regUser)
      .then((data) => {
        if ( data.item0[0].result == 'success') {
          this.missionService.announceOnceMission({type:'LOGIN',payload:true});
          this.router.navigate(['/main']);
        }
        else if ( data.item0[0].result == 'fail') {
          this.commonService.globalMessage(data.item0[0].resultDescribe);
        }
      }
      )
      .catch(error => this.commonService.globalMessage(error)
      );
  }


}


