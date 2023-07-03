import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../../../app.component';
import {Customer} from '../../../../demo/domain/customer';
import {Product} from '../../../../demo/domain/product';
import {ProductService} from '../../../../demo/service/productservice';

@Component({
  selector: 'app-thanh-toan',
  templateUrl: './thanh-toan.component.html',
  styleUrls: ['./thanh-toan.component.scss']
})
export class ThanhToanComponent implements OnInit {
    header : string;
    isNotPay : boolean = true;
    products: any[];
  constructor(public app: AppComponent,private productService: ProductService,) { }

  ngOnInit(): void {
      this.header = "Chưa thanh toán";
      this.isNotPay = true;
      this.productService.getPayMent().then(data => this.products = data.filter(c=> c.status == 0));
  }
    onChuaThanhToan(){
      this.header = "Chưa thanh toán";
      this.isNotPay = true;
        this.productService.getPayMent().then(data => this.products = data.filter(c=> c.status == 0));
    }
    onDaThanhToan(){
        this.header = "Đã thanh toán";
        this.isNotPay = true;
        this.productService.getPayMent().then(data => this.products = data.filter(c=> c.status == 1));
    }
}
