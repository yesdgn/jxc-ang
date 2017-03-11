import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Dropdown } from './df-control-dropdown';
import { ControlBase } from './df-control-base';
import { Textbox } from './df-control-textbox';
import { Textarea } from './df-control-textarea';
import { Checkbox } from './df-control-checkbox';
import { Radio } from './df-control-radio';
import { SlideToggle } from './df-control-slide-toggle';
import { Slider } from './df-control-slider';
import { Datepicker } from './df-control-datepicker';
import { ButtonToggle } from './df-control-button-toggle';
import { Autocomplete } from './df-control-autocomplete';

@Injectable()
export class PageService {
  constructor(private commonService: CommonService) { }

  readFormData(apiID, dataID): Promise<any> {
    return this.commonService.readFormData(apiID, dataID)
      .then((data) => {
        if (data.item0.length === 0)
        { throw new Error("数据不存在"); }
        return data;
      })
      .catch(error => { return Promise.reject(error.message ? error.message : error); })
  }

  readFormLoadItems(pageID, dataID): Promise<any> {
    return this.commonService.readFormLoadItems(pageID, dataID)
      .then()
      .catch(error => { return Promise.reject(error.message ? error.message : error); })
  }

  getFormControl(pageControlData, formData, formLoadItems) {
    let controls: ControlBase<any>[] = [];
    //要保证formLoadItems的API SQL排序和页面控件API SQL排序相同，否则可能将其它控件的数据加载到另一个控件上。
    let i = 0;
    pageControlData.map((item) => {
      switch (item.controlType.toUpperCase()) {
        case "TEXTBOX":
          controls.push(new Textbox({
            key: item.key,
            label: item.label,
            required: item.required,
            className: item.className,
            order: item.order,
            type: item.type,
            value: formData[item.colName] != null && formData[item.colName] != undefined && !isNaN(formData[item.colName]) ? String(formData[item.colName]) : formData[item.colName],
            readonly: item.readonly
          }))

          break;
        case "DATEPICKER":
          controls.push(new Datepicker({
            key: item.key,
            label: item.label,
            required: item.required,
            className: item.className,
            order: item.order,
            type: item.type,
            value: formData[item.colName],
            readonly: item.readonly
          }))

          break;
        case "TEXTAREA":
          controls.push(new Textarea({
            key: item.key,
            label: item.label,
            required: item.required,
            className: item.className,
            order: item.order,
            value: formData[item.colName],
            readonly: item.readonly
          }))
          break;
        case "CHECKBOX":
          controls.push(new Checkbox({
            key: item.key,
            label: item.label,
            required: item.required,
            className: item.className,
            order: item.order,
            readonly: item.readonly,
            value: formData[item.colName] == '1' || formData[item.colName] === 'Y' || formData[item.colName] === true ? true : false
          }))
          break;
        case "DROPDOWN":
          let options = [];
          if (formLoadItems["item" + i]) {
            formLoadItems["item" + i].map((item) => {
              if (!isNaN(item.id)) //字符数字类型转换成数字类型 要不然下拉无法匹配上
              {
                item.id = +item.id;
              }
              options.push({ key: item.id, value: item.name })
            })
          }
          controls.push(new Dropdown({
            key: item.key,
            label: item.label,
            required: item.required,
            className: item.className,
            order: item.order,
            options: options,
            readonly: item.readonly,
            value: !isNaN(formData[item.colName]) ? +formData[item.colName] : formData[item.colName]
          }))
          i = i + 1;
          break;
        case "RADIO":
          let radioOptions = [];
          if (formLoadItems["item" + i]) {
            formLoadItems["item" + i].map((item) => {
              // if (!isNaN(item.id)) //字符数字类型转换成数字类型 要不然下拉无法匹配上
              // {
              //   item.id=+item.id;
              // }
              radioOptions.push({ key: item.id, value: item.name })
            })
          }
          controls.push(new Radio({
            key: item.key,
            label: item.label,
            required: item.required,
            className: item.className,
            order: item.order,
            readonly: item.readonly,
            options: radioOptions,
            value: formData[item.colName]
          }))
          i = i + 1;
          break;
        case "AUTOCOMPLETE":
          let AutocompleteOptions = [];
          if (formLoadItems["item" + i]) {
            formLoadItems["item" + i].map((item) => {
              if (!isNaN(item.id)) //字符数字类型转换成数字类型 要不然下拉无法匹配上
              {
                item.id = +item.id;
              }
              AutocompleteOptions.push({ key: item.id, value: item.name })
            })
          } 
          
          controls.push(new Autocomplete({
            key: item.key,
            label: item.label,
            required: item.required,
            className: item.className,
            order: item.order,
            options: AutocompleteOptions,
            readonly: item.readonly,
            value: !isNaN(formData[item.colName]) ? +formData[item.colName] : formData[item.colName]
          }))
          i = i + 1;
          break;
        case "SLIDETOGGLE":
          controls.push(new SlideToggle({
            key: item.key,
            label: item.label,
            required: item.required,
            className: item.className,
            order: item.order,
            readonly: item.readonly,
            value: formData[item.colName] == '1' || formData[item.colName] === 'Y' || formData[item.colName] === true ? true : false
          }))
          break;
        case "BUTTONTOGGLE":
          let buttonToggleOptions = [];
          if (formLoadItems["item" + i]) {
            formLoadItems["item" + i].map((item) => {
              // if (!isNaN(item.id)) //字符数字类型转换成数字类型 要不然下拉无法匹配上
              // {
              //   item.id=+item.id;
              // }
              buttonToggleOptions.push({ key: item.id, value: item.name })
            })
          }
          controls.push(new ButtonToggle({
            key: item.key,
            label: item.label,
            required: item.required,
            className: item.className,
            order: item.order,
            readonly: item.readonly,
            options: buttonToggleOptions,
            value: formData[item.colName]
          }))
          i = i + 1;
          break;
        case "SLIDER":
          controls.push(new Slider({
            key: item.key,
            label: item.label,
            required: item.required,
            className: item.className,
            order: item.order,
            min: item.min,
            max: item.max,
            step: item.step,
            value: formData[item.colName],
            readonly: item.readonly
          }))

          break;
        case "DATATABLE":
          break;
        case "TREE":
          break;
        case "TREESELECT":
          break;
        default:
          console.error('不支持的控件类型:' + item.controlType);
          break;
      }
    })
    return controls.sort((a, b) => a.order - b.order);
  }

  toFormGroup(controls: ControlBase<any>[]) {
    let group: any = {};
    controls.forEach(control => {
      group[control.key] = control.required ? new FormControl(control.value || '', Validators.required)
        : new FormControl(control.value || '');
    });
    return new FormGroup(group);
  }

  saveFormData(formDataArray, apiID): Promise<any> {
    return this.commonService.saveFormData(apiID, formDataArray)
      .then()
      .catch(error => { return Promise.reject(error.message ? error.message : error); })
  }

  deleteFormData(dataid, apiID): Promise<any> {
    return this.commonService.deleteFormData(apiID, dataid)
      .then()
      .catch(error => { return Promise.reject(error.message ? error.message : error); })
  }
  deleteUser(dataid, apiID): Promise<any> {
    return this.commonService.deleteUser(apiID, dataid)
      .then()
      .catch(error => { return Promise.reject(error.message ? error.message : error); })
  }
  readTreeMenu(apiid, rootValue, nodeColName, parentNodeColName): Promise<any> {
    return this.commonService.readTreeMenu(apiid, rootValue, nodeColName, parentNodeColName)
      .then()
      .catch(error => { return Promise.reject(error.message ? error.message : error); })
  }
  readFormListData(apiID, pageSize, currentPage, filterCondition, sorter): Promise<any> {
    return this.commonService.readFormListData(apiID, pageSize, currentPage, filterCondition, sorter)
      .then( )
      .catch(error => { return Promise.reject(error.message ? error.message : error); })

  }
}
