import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../common.service';
@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css']
})
export class MainmenuComponent implements OnInit {
  private menuData;
  constructor(private commonService: CommonService) { }

  ngOnInit() {
     this.commonService.readMainMenu().then((data)=>{
       this.menuData=data;
     }) 
     
  }

}
