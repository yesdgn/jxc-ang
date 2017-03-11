import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../common.service';
import { ChangePassword } from '../data-model';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
private changePassword :ChangePassword;
  constructor(private commonService: CommonService,private route: ActivatedRoute, private router: Router) {
    this.changePassword=new ChangePassword('','','');
  }


  ngOnInit() {
  }

  formSubmit() {
    if (this.changePassword.newpassword!==this.changePassword.newpassword2)
    {this.commonService.globalMessage('两次密码输入不一致'); return;}
    let userid;
    this.route.params.forEach((params: Params) => {
         userid=params['dataid'];
    });
    if (!userid){userid=this.commonService.UserInfo.UserID;}
    this.commonService.changePassword(userid,this.changePassword.oldpassword,this.changePassword.newpassword)
    .then((data)=>{
      this.commonService.globalMessage(data[0].resultDescribe);
    })
  }

}
