import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class HttpService {
  counter = 0;
  get(url: string) {
    let subject = new Subject();

    setTimeout(() => {
      subject.next({
        next: "next"+this.counter,
        previous: "prev"+this.counter,
        results: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,19,20]
      });
      this.counter += 1;
      subject.complete();
    }, 1000);

    return subject;
  }
}

export class HyperlinkedPagination<T> {
  next: string = undefined
  previous: string = undefined
  results: T[];

  constructor(private http: HttpService, private classType: any) {}

  private cast(jsonObj: any) {
    if (this.classType) {
      return new this.classType(jsonObj);
    } else {
      return jsonObj as T;
    }
  }

  public getNextResults(): Promise<T[]> {
    return new Promise<T[]>( (resolve, reject) => {
      if (this.next) {
        this.http.get(this.next).subscribe((resp: HyperlinkedPagination<T>) => {
          this.next = resp.next;
          this.previous = resp.previous;
          let data = [];
          for (let i=0; i<resp.results.length; i++) {
            data.push(this.cast(resp.results[i]));
          }
          resolve(data);
        }, err => {
          reject(err);
        });
      } else {
        resolve([]);
      }
    });
  }
}

@Injectable()
export class ListService {
  constructor(private http: HttpService) {}

  getList(): HyperlinkedPagination<number> {
    let pagination = new HyperlinkedPagination<number>(this.http, undefined);
    pagination.next = "some url";
    return pagination;
  }
}