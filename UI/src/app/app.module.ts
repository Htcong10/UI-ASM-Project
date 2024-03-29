import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';

import {AppCodeModule} from './app-systems/app-code/app.code.component';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';
import {AppConfigComponent} from './app-systems/app-config/app.config.component';
import {AppMenuComponent} from './app-systems/app-menu/app.menu.component';
import {AppMenuitemComponent} from './app-systems/app-menuitem/app.menuitem.component';
import {AppInlineMenuComponent} from './app-systems/app-inline-menu/app.inlinemenu.component';
import {AppRightMenuComponent} from './app-systems/app-rightmenu/app.rightmenu.component';
import {AppBreadcrumbComponent} from './app-systems/app-breadcrumb/app.breadcrumb.component';
import {AppTopBarComponent} from './app-systems/app-topbar/app.topbar.component';
import {AppFooterComponent} from './app-systems/app-footer/app.footer.component';
import {DashboardComponent} from './demo/view/dashboard.component';
import {DashboardAnalyticsComponent} from './demo/view/dashboardanalytics.component';
import {FormLayoutDemoComponent} from './demo/view/formlayoutdemo.component';
import {FloatLabelDemoComponent} from './demo/view/floatlabeldemo.component';
import {InvalidStateDemoComponent} from './demo/view/invalidstatedemo.component';
import {InputDemoComponent} from './demo/view/inputdemo.component';
import {ButtonDemoComponent} from './demo/view/buttondemo.component';
import {TableDemoComponent} from './demo/view/tabledemo.component';
import {ListDemoComponent} from './demo/view/listdemo.component';
import {TreeDemoComponent} from './demo/view/treedemo.component';
import {PanelsDemoComponent} from './demo/view/panelsdemo.component';
import {OverlaysDemoComponent} from './demo/view/overlaysdemo.component';
import {MediaDemoComponent} from './demo/view/mediademo.component';
import {MenusDemoComponent} from './demo/view/menusdemo.component';
import {MessagesDemoComponent} from './demo/view/messagesdemo.component';
import {MiscDemoComponent} from './demo/view/miscdemo.component';
import {EmptyDemoComponent} from './demo/view/emptydemo.component';
import {ChartsDemoComponent} from './demo/view/chartsdemo.component';
import {FileDemoComponent} from './demo/view/filedemo.component';
import {DocumentationComponent} from './demo/view/documentation.component';
import {DisplayComponent} from './utilities/display.component';
import {ElevationComponent} from './utilities/elevation.component';
import {FlexboxComponent} from './utilities/flexbox.component';
import {GridComponent} from './utilities/grid.component';
import {IconsComponent} from './utilities/icons.component';
import {WidgetsComponent} from './utilities/widgets.component';
import {SpacingComponent} from './utilities/spacing.component';
import {TypographyComponent} from './utilities/typography.component';
import {TextComponent} from './utilities/text.component';
import {AppCrudComponent} from './pages/app.crud.component';
import {AppCalendarComponent} from './pages/app.calendar.component';
import {AppInvoiceComponent} from './pages/app.invoice.component';
import {AppHelpComponent} from './pages/app.help.component';
import {AppNotfoundComponent} from './pages/app.notfound.component';
import {AppErrorComponent} from './pages/app.error.component';
import {AppAccessdeniedComponent} from './pages/app.accessdenied.component';
import {AppLoginComponent} from './pages/app.login.component';
import {AppTimelineDemoComponent} from './pages/app.timelinedemo.component';
import {AppWizardComponent} from './pages/app.wizard.component';
import {AppLandingComponent} from './pages/app.landing.component';

import {CountryService} from './demo/service/countryservice';
import {CustomerService} from './demo/service/customerservice';
import {EventService} from './demo/service/eventservice';
import {IconService} from './demo/service/iconservice';
import {NodeService} from './demo/service/nodeservice';
import {PhotoService} from './demo/service/photoservice';
import {ProductService} from './demo/service/productservice';

import {MenuService} from './app-systems/app-menu/app.menu.service';
import {AppBreadcrumbService} from './app-systems/app-breadcrumb/app.breadcrumb.service';
import {AppContactusComponent} from './pages/app.contactus.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ComponentModule} from './modules/components-module/component.modules';
import {ComponentCustomerModule} from './modules/compoents-customer-module/component-customer.modules';
import {QuanTriHeThongModule} from './modules/quan-tri-he-thong-module/quan-tri-he-thong.module';
import {ShareData} from './modules/compoents-customer-module/components-customer';
import {CacheData} from './modules/compoents-customer-module/shared-data-services/cachedata.service';
import {LoadingInterceptor} from './modules/compoents-customer-module/Interceptors/LoadingInterceptor';
import {MyHttpInterceptor} from './modules/compoents-customer-module/Interceptors/MyHttpInterceptor';
import {QuanTriToaNhaModule} from './modules/quan-tri-toa-nha-module/quan-tri-toa-nha.module';
import {QuanTriCuDanModule} from './modules/quan-tri-cu-dan-module/quan-tri-cu-dan.module';
import {QuanTriNhanVienModule} from './modules/quan-tri-nhan-vien-module/quan-tri-nhan-vien.module';
import {AppMenuUserComponent} from './app-systems/app-menu-user/app-menu-user.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {HIGHLIGHT_OPTIONS, HighlightOptions} from "ngx-highlightjs";


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppCodeModule,
        ComponentModule,
        ComponentCustomerModule,
        QuanTriHeThongModule,
        QuanTriToaNhaModule,
        QuanTriCuDanModule,
        QuanTriNhanVienModule,
        NgxSpinnerModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuUserComponent,
        AppMenuitemComponent,
        AppInlineMenuComponent,
        AppRightMenuComponent,
        AppBreadcrumbComponent,
        AppTopBarComponent,
        AppFooterComponent,
        DashboardComponent,
        DashboardAnalyticsComponent,
        FormLayoutDemoComponent,
        FloatLabelDemoComponent,
        InvalidStateDemoComponent,
        InputDemoComponent,
        ButtonDemoComponent,
        TableDemoComponent,
        ListDemoComponent,
        TreeDemoComponent,
        PanelsDemoComponent,
        OverlaysDemoComponent,
        MediaDemoComponent,
        MenusDemoComponent,
        MessagesDemoComponent,
        MessagesDemoComponent,
        MiscDemoComponent,
        ChartsDemoComponent,
        EmptyDemoComponent,
        FileDemoComponent,
        DocumentationComponent,
        DisplayComponent,
        ElevationComponent,
        FlexboxComponent,
        GridComponent,
        IconsComponent,
        WidgetsComponent,
        SpacingComponent,
        TypographyComponent,
        TextComponent,
        AppCrudComponent,
        AppCalendarComponent,
        AppLoginComponent,
        AppLandingComponent,
        AppInvoiceComponent,
        AppHelpComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
        AppTimelineDemoComponent,
        AppWizardComponent,
        AppContactusComponent,
        AppMenuUserComponent
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, MenuService, AppBreadcrumbService, DatePipe,
        {provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: <HighlightOptions>{
                lineNumbers: true,
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
                themePath: 'node_modules/highlight.js/styles/github-dark-dimmed.css',
                languages: {
                    typescript: () => import('highlight.js/lib/languages/typescript'),
                    css: () => import('highlight.js/lib/languages/css'),
                    xml: () => import('highlight.js/lib/languages/xml'),
                },
            },
        },
        ShareData, CacheData, AppConfigComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
