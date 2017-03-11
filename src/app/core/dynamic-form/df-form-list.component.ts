import { Component, Input, OnChanges } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MdDialog, MdDialogRef, MdSnackBarConfig } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../common.service';
import { ControlBase } from './df-control-base';

import { PageService } from './df-page.service';
import { DgnDialog } from '../shared-component/dialog.component';
import { getRandom } from '../dgn';
import { trim, omit } from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'dynamic-form-list',
  templateUrl: 'df-form-list.component.html',
  styleUrls: ['./df-form-list.component.css']
})
export class DFormListComponent implements OnChanges {
  @Input() pageConfig;
  private controls: ControlBase<any>[] = [];
  private buttons;
  private buttonAction;
  private pageListControl;
  private pageListControlArr = [];
  private dataTableControlArr;
  private formData;
  private formDataArr = [];
  private formTotalCountArr = [];
  private primaryKey;
  private form: FormGroup;
  private pageid;
  private dataid;
  private pageInfo;
  private pageControl;
  private formLoadItems;
  private primaryKeyCol;
  private pageSize = 10;
  private currentPage = 0;
  private filterCondition = {};
  private sorter = '';
  private curActionArr;
  private treeControlArr;
  private treeMenuDataArr;
  dialogRef: MdDialogRef<DgnDialog>;
  constructor(private pageService: PageService, private route: ActivatedRoute, private router: Router , private location: Location, private commonService: CommonService, public dialog: MdDialog) {
  }
  ngOnChanges() {
    //会在该组件的输入属性变化时执行。主要是为了从新增状态路由到更新状态时能重新加载数据，用ngOnInit的话只能加载一次。
    this.route.params.forEach((params: Params) => {
      this.pageid = params['pageid'];
    });
    this.pageInit()
      .then()
      .catch(error => {
        this.commonService.globalMessage(error);
      })
  }

  async handleActionArr() {
    for (const curAction of this.curActionArr) {
      const response = await this.handleAction(curAction);
    }
  }

  formButtonClick(button) {
    if (this.buttonAction.length > 0) {
      this.curActionArr = this.buttonAction.filter((action) => {
        return action.ObjectID == button.ButtonID
      })
      if (this.curActionArr.length > 0) {
        if (button.ConfirmDialog == 1) {
          this.openDialog();
        }
        else {
          this.handleActionArr()
            .then()
            .catch(error => {
              this.commonService.globalMessage(error);
            })
        }
      }
      else {
        this.commonService.globalMessage('没有配置按钮的action');
      }
    }
    else {
      this.commonService.globalMessage('没有配置按钮的action');
    }
  }

  openDialog() {

    this.dialogRef = this.dialog.open(DgnDialog, { disableClose: false });
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
      if (result === 'yes') {
        this.handleActionArr()
          .then()
          .catch(error => {
            this.commonService.globalMessage(error);
          })
      }
    });
  }

  handleAction(action) {
    var promise = Promise.resolve();
    return promise.then(() => {
      switch (action.Action) {
        case 'Save':
          return this.Save(action.RelationApi);
        case 'Back':
          return this.Back();
        case 'New':
          return this.New();
        case 'JumpPage':
          return this.JumpPage(action.ActionJsonParam);
      }
    })
  }

  Save(apiID): Promise<any> {
    let formDataArray = [];
    this.formDataArr.map((dataTableData, index) => {
      let ListExcludeColName = [];
      this.pageListControlArr[index].map((item) => {
        if (item.ExcludeSave == 1) { ListExcludeColName.push(item.colName); }
      })
      let dataTableData_s = [];
      dataTableData.map((rowItem) => {
        if (rowItem.DgnOperatorType) {
          dataTableData_s.push(omit(rowItem, ListExcludeColName)) //排除列表不需要保存的列。
        }
      })
      formDataArray.push(dataTableData_s);
    })

    return this.pageService.saveFormData(formDataArray, apiID)
      .then((data) => {
        this.commonService.globalMessage(data[0].resultDescribe);
        if (data[0].result == 'success' && this.dataid == 0) {
          this.form.patchValue({ ID: data[0].insertId });  //新增时服务器会返回自增ID，因为新增保存后其实会重载数据，这里赋值已经有点多余，可能在路由没成功时，至少ID是有值的。
          this.router.navigate(['/page/' + this.pageid, this.primaryKey]);
        }
      })
      .catch(error => {
        this.commonService.globalMessage(error);
      })
  }


  New(): Promise<any> {
    return this.router.navigate(['/page/' + this.pageid, 0]);
  }

  Back() {
    this.location.back();
  }
  JumpPage(ActionJsonParam): Promise<any> {
    ActionJsonParam = this.JsonParamFormat(ActionJsonParam);
    let actionJsonParam = JSON.parse(ActionJsonParam);
    return this.router.navigate([actionJsonParam.route]);
  }


  JsonParamFormat(query) {

    let sqlreplace = query.replace(/\{\$req?.(.*?)\}/gi, function (txt, key) {
      let reqParam;
      this.route.params.forEach((params: Params) => {
        reqParam = params[key];
      });
      return reqParam;
    }.bind(this));

    sqlreplace = sqlreplace.replace(/\{\$data?.(.*?)\}/gi, function (txt, key) {
      let reqParam;
      reqParam = this.formData[key];
      return reqParam;
    }.bind(this));

    return sqlreplace
  };

  dataTableAdd(index) {
    let newItem = {};
    this.pageListControlArr[index].map((item) => {
      let itemColVal;
      if (item.defaultValue) {
        switch (trim(item.defaultValue)) {
          case '{$sys.random}': { itemColVal = item.defaultValue.replace(/\{\$sys.random\}/gi, getRandom()); break; }
          case '{$sys.userid}': { itemColVal = item.defaultValue.replace(/\{\$sys.userid\}/gi, this.commonService.UserInfo.UserID); break; }
          case '{$sys.datetime}': { itemColVal = item.defaultValue.replace(/\{\$sys.datetime\}/gi, moment().format('YYYY-MM-DD HH:mm:ss')); break; }
          case '{$sys.date}': { itemColVal = item.defaultValue.replace(/\{\$sys.date\}/gi, moment().format('YYYY-MM-DD')); break; }
          case '{$sys.time}': { itemColVal = item.defaultValue.replace(/\{\$sys.time\}/gi, moment().format('HH:mm:ss')); break; }
        }

        if (!itemColVal)  //上面没有替换掉才再替换这一段
        {
          itemColVal = item.defaultValue.replace(/\{\$data?.(.*?)\}/gi, function (txt, key) {
            let reqParam;
            reqParam = this.formData[key];
            return reqParam;
          }.bind(this));
        }

        if (!itemColVal)  //上面没有替换掉才再替换这一段
        {
          itemColVal = item.defaultValue;
        }

      }
      newItem[item.colName] = itemColVal;
    })
    newItem['DgnOperatorType'] = 'ADD';
    if (this.formDataArr.length == 0) {
      this.dataTableControlArr.map(() => {
        this.formDataArr.push([]);
      })

    }
    this.formDataArr[index].push(newItem);
  }
  dataTableEdit(dataTable, rowData) {
    let routeUrl;
    routeUrl = dataTable.DataTableEditRouteUrl;
    routeUrl = routeUrl.replace(/\{\$row?.(.*?)\}/gi, function (txt, key) {
      let reqParam;
      reqParam = rowData[key];
      return reqParam;
    }.bind(this));
    this.router.navigate([routeUrl], '');
  }

  dataTableDelete(index, rowData) {
    if (rowData.ID) {
      this.formDataArr[index][this.formDataArr[index].indexOf(rowData)]['DgnOperatorType'] = 'DELETE';
    }
    else {
      this.formDataArr[index].splice(this.formDataArr[index].indexOf(rowData), 1);
    }
  }


  treeNodeSelect(index, node) {
    // this.router.navigate(['/page/' + this.pageid, node.data]);
  }

  lazyLoadData(event) {
    //in a real application, make a remote request to load data using state metadata from event
    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    //imitate db connection over a network
    this.pageSize = event.rows;
    this.currentPage = event.first;


    this.filterCondition = event.filters;
    this.pageService.readFormListData(this.pageInfo.ApiID, this.pageSize, this.currentPage, this.filterCondition, this.sorter)
      .then((data) => {
      //  this.formListData = data;
        return data;
      })
  }

  pageInit(): Promise<any> { //单表头
    let promise  = Promise.resolve() ;
    this.formDataArr = [];
    this.formTotalCountArr=[];
    this.pageListControlArr = [];
    return promise.then  <any>(() => {
      if (this.pageConfig.item1.length === 0)
      { throw new Error("页面未配置控件"); }
      this.pageInfo = this.pageConfig.item0[0];
      this.pageControl = this.pageConfig.item1;
      this.buttons = this.pageConfig.item2;
      this.buttonAction = this.pageConfig.item3;
      this.pageListControl = this.pageConfig.item4;
      this.dataTableControlArr = this.pageControl.filter((control) => {
        return control.controlType == 'DataTable'
      })
      this.treeControlArr = this.pageControl.filter((control) => {
        return control.controlType == 'Tree'
      })

      if (this.dataTableControlArr[0].IsLazyLoad == 0)  //非懒加载则一次性全部加载，默认不能超过10000条数据。
      { this.pageSize = 10000; }
      return this.pageService.readFormListData(this.pageInfo.ApiID, this.pageSize, this.currentPage, this.filterCondition, this.sorter)

    })
      .then(( data) => {
        for (let item in data) {
          if (item !== 'item0' && item !== 'item2' && item !== 'item4') //排除TotalCount 暂定页面最多3个datatable
           {
            this.formDataArr.push(data[item]);
          }
          else
          {
            this.formTotalCountArr.push(data[item][0]);  
          }
        }
        if (this.dataTableControlArr.length == 0)
        { return }
        this.dataTableControlArr.map((datatable, index) => {
          let tempArr = this.pageListControl.filter((datatablecol) => {
            return datatablecol.ControlID == datatable.ControlID;
          })
          this.pageListControlArr.push(tempArr);
        })
      })
      .then((data) => {
        if (this.treeControlArr.length == 0)
        { return }
        let treeControl = this.treeControlArr[0];
        return this.pageService.readTreeMenu(treeControl.ApiID, treeControl.TreeRootValue, treeControl.colName, treeControl.ParentColName);
      })
      .then((data) => {
        this.treeMenuDataArr = data;
      })
      .catch(error => { return Promise.reject(error.message ? error.message : error); })
  }

}
