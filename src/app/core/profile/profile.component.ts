import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonService } from '../common.service';
import { Profile } from '../data-model';
import { getRandom } from '../dgn';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private profile: Profile;
  constructor(private route: ActivatedRoute, private router: Router, private commonService: CommonService) {
  this.profile = new Profile('ADD', '');
  }

  ngOnInit() {
    this.readPofile(this.commonService.UserInfo.UserID);
  }

  readPofile(personID): void {
    this.commonService.readPofile(personID)
      .then((data) => {
        let dataItem = data.item0[0];
        this.profile = new Profile('UPDATE', dataItem.Name, dataItem.UserID, dataItem.ID, dataItem.Code, dataItem.Email, dataItem.Mobile, dataItem.CompID, dataItem.Remark,dataItem.UserImages);
      }
      )
      .catch(error => this.commonService.globalMessage(error)
      );
  }

  formSubmit() {
    this.commonService.saveProfile(this.profile)
      .then((data) => {
        if (data[0].result == 'success') {
           this.commonService.globalMessage(data[0].resultDescribe);
        }
        else if (data[0].result == 'fail') {
          this.commonService.globalMessage(data[0].resultDescribe);
        }
        else {
          this.commonService.globalMessage(data);
        }
      }
      )
      .catch(error => {
        this.commonService.globalMessage(error);
      }
      );
  }

}
