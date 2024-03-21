import {Injector, NgModule} from '@angular/core';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {TrangChuComponent} from './component/trang-chu/trang-chu.component';
import {ComponentModule} from '../components-module/component.modules';
import {ComponentCustomerModule} from '../compoents-customer-module/component-customer.modules';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {YeuCauComponent} from './component/yeu-cau/yeu-cau.component';
import {ThanhToanComponent} from './component/thanh-toan/thanh-toan.component';
import {ThongTinUserComponent} from './component/thong-tin-user/thong-tin-user.component';
import {RepositoriesManagerComponent} from './component/repositories-manager/repositories-manager.component';
import {FileRepositoryComponent} from './component/file-repository/file-repository.component';
import {HighlightModule, HIGHLIGHT_OPTIONS, HighlightOptions, Highlight} from 'ngx-highlightjs';

const routes: Routes = [
    {path: 'TrangChu', component: TrangChuComponent},
    {path: 'YeuCau', component: YeuCauComponent},
    {path: 'ThanhToan', component: ThanhToanComponent},
    {path: 'ThongTin', component: ThongTinUserComponent},
    {path: 'Repository', component: RepositoriesManagerComponent},
    {path: 'FileRepository', component: FileRepositoryComponent}
];

@NgModule({
    declarations: [
        TrangChuComponent,
        YeuCauComponent,
        ThanhToanComponent,
        ThongTinUserComponent,
        RepositoriesManagerComponent,
        FileRepositoryComponent
    ],
    imports: [
        ComponentModule,
        ComponentCustomerModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        HighlightModule
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
