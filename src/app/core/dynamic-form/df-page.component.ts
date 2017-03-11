import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../common.service';
import { PageService } from './df-page.service';

@Component({
  selector: 'app-dynamic-form',
  template: `
    <div class="marT10"  >
      <dynamic-form-m *ngIf="pageConfig?.item0[0]?.PageType===1" [pageConfig]="pageConfig" ></dynamic-form-m>
      <dynamic-form-list *ngIf="pageConfig?.item0[0]?.PageType===2"  [pageConfig]="pageConfig" ></dynamic-form-list>
      <dynamic-form-tree-tree *ngIf="pageConfig?.item0[0]?.PageType===3"  [pageConfig]="pageConfig" ></dynamic-form-tree-tree>
    </div>
  `
})
  
export class DfPageComponent implements OnInit {
  private pageid;
  private dataid;
  private pageConfig;

  constructor(private commonService: CommonService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.pageid = params['pageid'];
      this.dataid = params['dataid'];
      this.readPageConfig(this.pageid, this.dataid);  //必须放在这个forEach里 否则当路由改变时无法再次触发
    })
  }

  readPageConfig(pageID, dataID) {
    this.commonService.readPageConfig(pageID, dataID)
      .then((data) => {
        if (data.item0.length === 0)
        { this.commonService.globalMessage("页面不存在"); }
        this.pageConfig = data;
      })
      .catch(error => {
        this.commonService.globalMessage(error);
      })
  }
}
