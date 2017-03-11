import { Component, Input, OnChanges } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MdDialog, MdDialogRef, MdSnackBarConfig } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../common.service';
import { ControlBase } from './df-control-base';
import { DFormMService } from './df-form-m.service';
import { PageService } from './df-page.service';
import { DgnDialog } from '../shared-component/dialog.component';
import { getRandom } from '../dgn';
import { trim, omit } from 'lodash';
import * as moment from 'moment';
import { TreeNode} from 'primeng/primeng';
@Component({
  selector: 'dynamic-form-m',
  templateUrl: 'df-form-m.component.html',
  styleUrls: ['./df-form-m.component.css']
})
export class DFormMComponent implements OnChanges {
  @Input() pageConfig;
  private controls: ControlBase<any>[] = [];
  private buttons;
  private buttonAction;
  private pageListControl;
  private pageListControlArr = [];
  private dataTableControlArr;
  private formData;
  private formDataArr = [];
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
  selectedNodes: TreeNode;
  dialogRef: MdDialogRef<DgnDialog>;
  private progressValue=0;
  private tabCount=0;
  constructor(private pageService: PageService, private formControlService: DFormMService, private route: ActivatedRoute, private router: Router
    , private location: Location, private commonService: CommonService, public dialog: MdDialog) {
  }
  ngOnChanges() {
    //会在该组件的输入属性变化时执行。主要是为了从新增状态路由到更新状态时能重新加载数据，用ngOnInit的话只能加载一次。
    this.route.params.forEach((params: Params) => {
      this.pageid = params['pageid'];
      this.dataid = params['dataid'];
    });
    this.progressValue=5;
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
        case 'BackToList':
          return this.BackToList();
        case 'Back':
          return this.Back();
        case 'New':
          return this.New();
        case 'Delete':
          return this.Delete(action.RelationApi);
        case 'JumpPage':
          return this.JumpPage(action.ActionJsonParam);
      }
    })
  }

  Save(apiID): Promise<any> {
    if (!this.form.valid)
    { return; }
    console.log(this.form);
    
    let excludeColName = [];
    this.pageControl.map((item) => {
      if (item.ExcludeSave == 1) { excludeColName.push(item.colName); }
    })
    let form0 = this.form.value;
    form0.DgnOperatorType = this.dataid == 0 ? "ADD" : "UPDATE";
    let form0_s = omit(form0, excludeColName);  //排除表头不需要保存的列。
    let formDataArray = [];
    formDataArray.push(form0_s);
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

  Delete(apiID): Promise<any> {
    if (this.dataid == 0) {
      this.commonService.globalMessage('未保存数据不需要删除');
      return
    }
    return this.pageService.deleteFormData(this.primaryKey, apiID)
      .then((data) => {
        if (data[0].result == 'success') {
          this.router.navigate(['/page/' + this.pageid]);
        }
        else {
          this.commonService.globalMessage(data[0].resultDescribe);
        }
      })
      .catch(error => {
        this.commonService.globalMessage(error);
      })
  }

  New(): Promise<any> {
  //  console.log(this.selectedNodes);
    console.log(this.formDataArr[1]);
    
    return this.router.navigate(['/page/' + this.pageid, 0]);
  }
  BackToList(): Promise<any> {
    return this.router.navigate(['/page/' + this.pageid, '']);
  }
  Back() {
    this.location.back();
  }
  JumpPage(ActionJsonParam): Promise<any> {
    ActionJsonParam = this.JsonParamFormat(ActionJsonParam);
    let actionJsonParam = JSON.parse(ActionJsonParam);
    return this.router.navigate([actionJsonParam.route]);
  }

  DeleteUser(apiID): Promise<any> {
    return this.pageService.deleteUser(this.primaryKey, apiID)
      .then((data) => {
        this.commonService.globalMessage(data[0].resultDescribe);
        this.router.navigate(['/page/' + this.pageid]);
      })
      .catch(error => {
        this.commonService.globalMessage(error);
      })
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
    this.router.navigate(['/page/' + this.pageid, node.data]);
  }

  pageInit(): Promise<any> { // 表单页
    let promise = Promise.resolve();
    this.formDataArr = [];
    this.pageListControlArr = [];
    this.treeControlArr=[];
    this.dataTableControlArr=[];
    this.treeMenuDataArr=[];
    this.tabCount=0;
    return promise.then(() => {
      if (this.pageConfig.item1.length === 0)
      { throw new Error("页面未配置控件"); }
      this.pageInfo = this.pageConfig.item0[0];
      this.pageControl = this.pageConfig.item1;
      this.buttons = this.pageConfig.item2;
      this.buttonAction = this.pageConfig.item3;
      this.pageListControl = this.pageConfig.item4;
      this.dataTableControlArr = this.pageControl.filter((control) => {
        return control.controlType == 'DataTable' || control.controlType == 'TreeSelect'
      })
      this.treeControlArr = this.pageControl.filter((control) => {
        return  (control.controlType == 'Tree' || control.controlType == 'TreeSelect')
      })
      this.progressValue =20;
      if (this.dataid == 0) {
        let defaultvalue = {};
        this.pageControl.map((item) => {
          if (item.IsPrimaryKey == 1) {
            this.primaryKeyCol = item.colName;
          }
          let controlDefaultvalue = item.defaultValue;
          if (item.defaultValue) {
            switch (trim(item.defaultValue)) {
              case '{$sys.userid}': { controlDefaultvalue = item.defaultValue.replace(/\{\$sys.userid\}/gi, this.commonService.UserInfo.UserID); break; }
              case '{$sys.random}': { controlDefaultvalue = item.defaultValue.replace(/\{\$sys.random\}/gi, getRandom()); break; }
              case '{$sys.datetime}': { controlDefaultvalue = item.defaultValue.replace(/\{\$sys.datetime\}/gi, moment().format('YYYY-MM-DD HH:mm:ss')); break; }
              case '{$sys.date}': { controlDefaultvalue = item.defaultValue.replace(/\{\$sys.date\}/gi, moment().format('YYYY-MM-DD')); break; }
              case '{$sys.time}': { controlDefaultvalue = item.defaultValue.replace(/\{\$sys.time\}/gi, moment().format('HH:mm:ss')); break; }
            }
          }
          defaultvalue[item.colName] = controlDefaultvalue;
        })
        if (!this.primaryKeyCol) {
          return Promise.reject('没有配置主键列');
        }
        let defaultValue1 = { "item0": [] };
        defaultValue1.item0.push(defaultvalue);
        return (defaultValue1);
      }
      else {
        this.pageControl.map((item) => {
          if (item.IsPrimaryKey == 1) { this.primaryKeyCol = item.colName; }
        })
        if (!this.primaryKeyCol) {
          return Promise.reject('没有配置主键列');
        }
        return this.pageService.readFormData(this.pageInfo.ApiID, this.dataid)
      }
      
    })
      .then((data) => {
        this.progressValue =30;
        for (let item in data) {
          if (item !== 'item0') {
            this.formDataArr.push(data[item]);
          }
        }
        this.formData = data.item0[0];
        this.primaryKey = this.formData[this.primaryKeyCol];
        return this.pageService.readFormLoadItems(this.pageid, this.dataid);
      })
      .then((data) => {
        this.progressValue =40;
        this.formLoadItems = data;
        return this.pageService.getFormControl(this.pageControl, this.formData, this.formLoadItems);
      })
      .then((data) => {
        this.progressValue =50;
        this.controls = data;
        this.form = this.pageService.toFormGroup(this.controls);
        //因为控件生成时加载的checkbox数据 当数据为false时在保存时得到的值会是“” 只有像下面这样处理一下才会是false
        this.controls.map((control) => {
          if (control.controlType === 'checkbox') {
            let controlobj = {};
            controlobj[control.key] = control.value;
            this.form.patchValue(controlobj);
          }
        })
      })
      .then((data) => {
        this.progressValue =60;
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
        this.progressValue =70;
        if (this.treeControlArr.length == 0)
        { return }
        let treeControl = this.treeControlArr[0];
        return this.pageService.readTreeMenu(treeControl.ApiID, treeControl.TreeRootValue, treeControl.colName, treeControl.ParentColName);
      })
      .then((data) => {
        this.progressValue =100;
        this.treeMenuDataArr = data;
        this.tabCount=this.dataTableControlArr.length;
        // if 
        // this.selectedNodes=
         console.log(this.formDataArr[1]);
      })
      .catch(error => { return Promise.reject(error.message ? error.message : error); })
  }

}
