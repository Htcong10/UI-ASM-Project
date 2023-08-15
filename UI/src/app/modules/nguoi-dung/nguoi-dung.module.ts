import {Injector, NgModule} from '@angular/core';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import { TrangChuComponent } from './component/trang-chu/trang-chu.component';
import {ComponentModule} from '../components-module/component.modules';
import {ComponentCustomerModule} from '../compoents-customer-module/component-customer.modules';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import { YeuCauComponent } from './component/yeu-cau/yeu-cau.component';
import { ThanhToanComponent } from './component/thanh-toan/thanh-toan.component';
import { ThongTinUserComponent } from './component/thong-tin-user/thong-tin-user.component';

const routes: Routes = [
    {path: 'TrangChu', component: TrangChuComponent},
    {path:'YeuCau',component: YeuCauComponent},
    {path:'ThanhToan',component: ThanhToanComponent},
    {path:'ThongTin',component: ThongTinUserComponent},
]

@NgModule({
  declarations: [
    TrangChuComponent,
    YeuCauComponent,
    ThanhToanComponent,
    ThongTinUserComponent
  ],
    imports: [
        ComponentModule,
        ComponentCustomerModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    exports: [],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    entryComponents: [],
    bootstrap: []
})
export class NguoiDungModule {
    constructor(private injector: Injector) {
    }
}
