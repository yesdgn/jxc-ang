import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { now, chain, keys, sortBy, toUpper, isString } from 'lodash';
import { MD5 } from 'crypto-js';
import { MissionService } from './mission.service';
import { ifNull } from './dgn';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpService {
  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  private APP_CONFIG=environment.APP_CONFIG;
  constructor(private http: Http, private missionService: MissionService) { }
  httpGet(payload): Promise<any> {
    let url = this.getUrl('get', payload);
    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json())
      .then(res  => {  
 
        if (res.returnCode == 0)
        { return res.items }
        else if (res.returnCode == 1003 || res.returnCode == 1004) {
          this.missionService.announceOnceMission({ type: 'LOGINOUT', payload: true });
          throw new Error(res.returnDescribe); 
        }
        else
        { throw new Error(res.returnDescribe); }
      })
      .catch(this.handleError);
  }
  httpPost(payload): Promise<any> {
    let url = this.APP_CONFIG.APISERVERURL + '/' + payload.apiid;
    let body = this.getUrl('post', payload);
    return this.http
      .post(url, body, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .then(res => {
        if (res.returnCode == 0)
        { return res.items }
        else if (res.returnCode == 1003 || res.returnCode == 1004) {
          this.missionService.announceOnceMission({ type: 'LOGINOUT', payload: true });
          throw new Error(res.returnDescribe); 
        }
        else
        { throw new Error(res.returnDescribe); }
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    // console.error(error); 
    console.log(error);
    return Promise.reject(error.message ? error.message : '读取服务器错误');
  }

  private getUrl(type, paramsObj) {
    let params = paramsObj;
    let stringC = '';
    let stringB = '';

    params.appid = this.APP_CONFIG.APPID;
    params.timestamp = now();
    let stringA = chain(params)
      .keys()
      .sortBy()
      .value();

    stringA.map(function (key) {
      if (ifNull(params[key])) {
        stringB = (ifNull(stringB) ? '' : stringB + '&') + key + '=';
      }
      else {
        stringC = (ifNull(stringC) ? '' : stringC + '&') + key + '=' + encodeURIComponent(params[key]);
      }
      return;
    })

    let sign = toUpper(MD5(stringC).toString());
    if (type == 'get') {
      stringC = this.APP_CONFIG.APISERVERURL + '/' + params.apiid + '?' + stringC + '&sign=' + sign + (ifNull(stringB) ? '' : '&' + stringB);
    }
    else if (type == 'post') {
      stringC = stringC + '&sign=' + sign + (ifNull(stringB) ? '' : '&' + stringB);
    }
    return stringC
  }


}
