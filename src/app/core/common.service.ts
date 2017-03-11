import { Injectable } from '@angular/core';
import { SHA1 } from 'crypto-js';
import { ifNull } from './dgn';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';
import { LoginUser, RegUser } from './data-model';
import * as store from 'store2';
import { MdSnackBar,MdSnackBarConfig } from '@angular/material';
@Injectable()
export class CommonService {
  private userInfo;
  private sessionKey;
  private APP_CONFIG=environment.APP_CONFIG;
  constructor(private httpService: HttpService,private snackBar: MdSnackBar) { };

  get UserInfo() {
    if (this.userInfo)
    { return this.userInfo; }
    else {
      this.userInfo = store.session('userInfo');
      return this.userInfo;
    }
  }
  get SessionKey() {
    if (this.sessionKey)
    { return this.sessionKey; }
    else {
      this.sessionKey = store.session('sessionKey');
      return this.sessionKey;
    }
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error);
  }

  public login(loginUser: LoginUser): Promise<any> {
    let payload = {
      apiid: 100016,
      logintype: this.APP_CONFIG.LOGINTYPE,
      usertype: this.APP_CONFIG.USERTYPE,
      loginid: loginUser.loginID,
      password: SHA1(loginUser.password).toString(),
    }
    return this.httpService.httpPost(payload)
      .then(data => {
        if (data.item0[0].result == 'success') {
          if (loginUser.rememberLogin) { store.set('loginName', data.item1[0].LoginID); }
          store.session('userInfo', data.item1[0]);
          store.session('sessionKey', data.item0[0].accessToken);
          this.userInfo = data.item1[0];
          this.sessionKey = data.item0[0].accessToken;
        }
        return data;
      })
      .catch(this.handleError);
  }
  public logout(): Promise<any> {
    let payload = {
      apiid: 100065,
      appid: this.APP_CONFIG.APPID,
      sessionkey: this.SessionKey,
      userid: this.UserInfo.UserID,
    }
    return this.httpService.httpPost(payload)
      .then()
      .catch(this.handleError);
  }
  
  public reg(regUser: RegUser): Promise<any> {
    if (regUser.password != regUser.password2) {
      return Promise.reject('两次密码不一致');
    }
    let payload = {
      apiid: 100015,
      loginid: regUser.loginID,
      appid: this.APP_CONFIG.APPID,
      logintype: this.APP_CONFIG.LOGINTYPE,
      usertype: this.APP_CONFIG.USERTYPE,
      nickname: regUser.loginID,
      checkcode: 'nocheck',
      password: SHA1(regUser.password).toString()
    };
    return this.httpService.httpPost(payload)
      .then(data => {
        if (data.item0[0].result == 'success') {
          store.set('loginName', data.item1[0].LoginID);
          store.session('userInfo', data.item1[0]);
          store.session('sessionKey', data.item0[0].accessToken);
        }
        return data;
      })
      .catch(this.handleError);
  }
  public readPofile(personID): Promise<any> {
    let payload = {
      apiid: 100063,
      sessionkey: this.SessionKey,
      userid: this.UserInfo.UserID,
      personID: personID
    };
    return this.httpService.httpGet(payload)
      .then()
      .catch(this.handleError);
  }
  public saveProfile(form0): Promise<any> {
    let formArr = [];
    formArr.push(form0);
    let payload = {
      apiid: 100025,
      sessionkey: this.SessionKey,
      userid: this.UserInfo.UserID,
      jsonData: JSON.stringify(formArr)
    };
    return this.httpService.httpPost(payload)
      .then()
      .catch(this.handleError);
  }
  public readFavorite(): Promise<any> {
    let payload = {
      apiid: 100019,
      sessionkey: this.SessionKey,
      userid: this.UserInfo.UserID
    };
    return this.httpService.httpGet(payload)
      .then()
      .catch(this.handleError);
  }
  public setFavorite(): Promise<any> {
    let payload = {
      apiid: 100018,
      sessionkey: this.SessionKey,
      userid: this.UserInfo.UserID,
      path: location.pathname,
    };
    return this.httpService.httpGet(payload)
      .then()
      .catch(this.handleError);
  }
  public readMainMenu(): Promise<any> {
    let payload = {
      apiid: 100017,
      userid: this.UserInfo.UserID,
      rootValue:0,
      nodeColName:'MenuID',
      parentNodeColName:'PMenuID',
    };
    return this.httpService.httpGet(payload)
      .then()
      .catch(this.handleError);
  }
  public readTreeMenu(apiid,rootValue,nodeColName,parentNodeColName): Promise<any> {
    let payload = {
      apiid:apiid,
      sessionkey: this.SessionKey,
      userid: this.UserInfo.UserID,
      rootValue:rootValue,
      nodeColName:nodeColName,
      parentNodeColName:parentNodeColName,
    };
    return this.httpService.httpGet(payload)
      .then()
      .catch(this.handleError);
  }
  public readPageConfig(routeurl,dataid): Promise<any> {
    let payload = {
      apiid: 100000,
      sessionkey: this.SessionKey,
      userid: this.UserInfo.UserID,
      routeurl: routeurl,
      dataid:dataid
    };
    return this.httpService.httpGet(payload)
      .then()
      .catch(this.handleError);
  }

  public readFormData(apiID, dataID): Promise<any> {
    let payload = {
      apiid: apiID,
      sessionkey: this.SessionKey,
      userid: this.UserInfo.UserID,
      dataid: dataID
    };
    return this.httpService.httpGet(payload)
      .then()
      .catch(this.handleError);
  }
  public readFormListData(apiID, pageSize, curPage, filterCondition, sorter): Promise<any> {
    let payload = {
      apiid: apiID,
      sessionkey: this.SessionKey,
      userid: this.UserInfo.UserID,
      pageSize: pageSize,
      curPage: curPage,
      filter: JSON.stringify(filterCondition),
      sorter: ifNull(sorter) ? '' : ' order by ' + sorter.field + (sorter.order === 'ascend' ? ' asc ' : ' desc ')
    };
    return this.httpService.httpGet(payload)
      .then()
      .catch(this.handleError);
  }
  public readFormLoadItems(pageID, dataID): Promise<any> {
    let payload = {
      apiid: 100001,
      sessionkey: this.SessionKey,
      userid: this.UserInfo.UserID,
      dataid: dataID,
      pageid: pageID
    };
    return this.httpService.httpGet(payload)
      .then()
      .catch(this.handleError);
  }
  public saveFormData(apiid, formDataArray): Promise<any> {
    let payload = {
      apiid: apiid,
      sessionkey: this.SessionKey,
      userid: this.UserInfo.UserID,
      jsonData: JSON.stringify(formDataArray)
    };
    return this.httpService.httpPost(payload)
      .then()
      .catch(this.handleError);
  }
  public deleteFormData(apiid, dataid): Promise<any> {
    let payload = {
      apiid: apiid,
      sessionkey: this.SessionKey,
      userid: this.UserInfo.UserID,
      dataid: dataid
    };
    return this.httpService.httpPost(payload)
      .then()
      .catch(this.handleError);
  }
  public deleteUser(apiid, dataid): Promise<any> {
    let payload = {
      apiid: apiid,
      sessionkey: this.SessionKey,
      userid: this.UserInfo.UserID,
      dataid: dataid
    };
    return this.httpService.httpPost(payload)
      .then()
      .catch(this.handleError);
  }
    public changePassword(personID, oldPasssord,newPasssord): Promise<any> {
    let payload = {
      apiid:100058,
      sessionkey: this.SessionKey,
      userid: this.UserInfo.UserID,
      personid:personID,
      oldpassword:SHA1(oldPasssord).toString(),
      newpassword:SHA1(newPasssord).toString(),
    };
    return this.httpService.httpPost(payload)
      .then()
      .catch(this.handleError);
  }

 public globalMessage(message: string) {
    let config = new MdSnackBarConfig();
    config.duration = 1000;
    this.snackBar.open(message, 'OK', config);
  }

}
