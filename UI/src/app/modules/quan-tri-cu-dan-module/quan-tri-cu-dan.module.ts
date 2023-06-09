import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {Injector, NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ComponentCustomerModule} from '../compoents-customer-module/component-customer.modules';
import {ComponentModule} from '../components-module/component.modules';
import {RouterModule, Routes} from '@angular/router';
import {DanhMucCuDanComponent} from './components/danh-muc-cu-dan/danh-muc-cu-dan.component';
import {DanhMucHoGdinhComponent} from './components/danh-muc-ho-gdinh/danh-muc-ho-gdinh.component';
import {DanhMucGoiTaiKhoan } from './components/danh-muc-hop-dong/danh-muc-hop-dong.component';
import {DanhMucYeuCauComponent } from './components/danh-muc-yeu-cau/danh-muc-yeu-cau.component';


const routes: Routes = [
    {path: 'CuDan', component: DanhMucCuDanComponent},
    {path: 'HoGDinh', component: DanhMucHoGdinhComponent},
    {path: 'HDongCuDan', component: DanhMucGoiTaiKhoan},
];

@NgModule({
    imports: [
        ComponentModule,
        ComponentCustomerModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        DanhMucCuDanComponent,
        DanhMucHoGdinhComponent,
        DanhMucGoiTaiKhoan,
        DanhMucYeuCauComponent,
    ],
    exports: [],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    entryComponents: [],
    bootstrap: []
})
export class QuanTriCuDanModule {
    constructor(private injector: Injector) {
    }
}
