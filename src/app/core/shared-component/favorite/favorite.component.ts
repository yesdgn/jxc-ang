import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../common.service';
@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  private favorite;
  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.commonService.readFavorite().then((data)=>{
      this.favorite=data;
    })
  }

}
