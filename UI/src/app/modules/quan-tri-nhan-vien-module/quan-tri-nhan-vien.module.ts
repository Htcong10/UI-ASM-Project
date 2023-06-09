import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {Injector, NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ComponentCustomerModule} from '../compoents-customer-module/component-customer.modules';
import {ComponentModule} from '../components-module/component.modules';
import {RouterModule, Routes} from "@angular/router";
import {DanhMucHopDongComponent, DanhMucNhanVienComponent, DanhMucPhongBanComponent} from './quan-tri-nhan-vien';

const routes: Routes = [
    {path: 'NhanVien', component: DanhMucNhanVienComponent},
    {path: 'PhongBan', component: DanhMucPhongBanComponent},
    {path: 'HDongNVien', component: DanhMucHopDongComponent},
]

@NgModule({
    imports: [
        ComponentModule,
        ComponentCustomerModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        DanhMucNhanVienComponent,
        DanhMucPhongBanComponent,
        DanhMucHopDongComponent
    ],
    exports: [],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    entryComponents: [],
    bootstrap: []
})
export class QuanTriNhanVienModule {
    constructor(private injector: Injector) {
    }
}
