import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Subject } from 'rxjs';
import { ListService, HttpService, HyperlinkedPagination } from './service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HttpService, ListService]
})
export class HomePage {
  items: number[] = [];
  pagination: HyperlinkedPagination<number>;

  constructor(public navCtrl: NavController, public listService: ListService) {
    this.pagination = this.listService.getList();
  }

  ionViewDidLoad() {
    this.pagination.getNextResults().then(data => {
      this.items = this.items.concat(data);
    });
  }

  doInfinite(infiniteScroll) {
    this.pagination.getNextResults().then(data => {
      this.items = this.items.concat(data);
      infiniteScroll.complete();
    });
  }

}
