import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {Injector, NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ComponentCustomerModule} from '../compoents-customer-module/component-customer.modules';
import {ComponentModule} from '../components-module/component.modules';
import {RouterModule, Routes} from "@angular/router";
import { DanhMucCanHoComponent } from './component/danh-muc-can-ho/danh-muc-can-ho.component';
import { DanhMucThietBiComponent } from './component/danh-muc-thiet-bi/danh-muc-thiet-bi.component';
import { DanhMucThongBaoComponent } from './component/danh-muc-thong-bao/danh-muc-thong-bao.component';


const routes: Routes = [
    {path: 'Canho', component: DanhMucCanHoComponent},
    {path: 'Thietbi',component: DanhMucThietBiComponent},
    {path: 'Thongbao',component: DanhMucThongBaoComponent}
]

@NgModule({
    imports: [
        ComponentModule,
        ComponentCustomerModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
    DanhMucCanHoComponent,
    DanhMucThietBiComponent,
    DanhMucThongBaoComponent
  ],
    exports: [],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    entryComponents: [],
    bootstrap: []
})
export class QuanTriToaNhaModule {
    constructor(private injector: Injector) {
    }
}
