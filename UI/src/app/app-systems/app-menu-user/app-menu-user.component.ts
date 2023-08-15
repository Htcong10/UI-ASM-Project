import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {delay, filter} from 'rxjs/operators';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {NavigationEnd, Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import * as API from '../../services/apiURL';
import {AppComponent} from '../../app.component';
import {iServiceBase, ShareData} from 'src/app/modules/compoents-customer-module/components-customer';
import {AppMainComponent} from '../../app.main.component';
import {MenuItem} from 'primeng/api';
import {AppNotificationModel} from '../../modules/quan-tri-toa-nha-module/model/app-notification.model';
@UntilDestroy()
@Component({
    selector: 'app-menu-user',
    templateUrl: './app-menu-user.component.html',
    styleUrls: ['./app-menu-user.component.scss']
})
export class AppMenuUserComponent implements AfterViewInit, OnInit  {
    email: string;
    username: string;
    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;
    items: MenuItem[];
    userName: any;
    userFullName: any;
    lstNotifi: any;
    numNotifi : number;
     fullName: any;
    constructor(private observer: BreakpointObserver, private router: Router, public app: AppComponent,
                private shareData: ShareData,
                private iServiceBase: iServiceBase,
                public appMain: AppMainComponent,) {
    }

    async ngOnInit() {
        this.getInfoCurrentUser();
        await this.onSearchNotifi();
        this.items = [
            {label: 'Angular.io', icon: 'pi pi-external-link', url: 'http://angular.io'},
            {label: 'Theming', icon: 'pi pi-bookmark', routerLink: ['/theming']}
        ];
    }

    async getInfoCurrentUser() {
        try {
            let response = await this.iServiceBase.getDataAsync(API.PHAN_HE.USER, API.API_USER.GET_INFO_CURRENT_USER);
            if (!!response && !!response.userName) {
                this.shareData.userInfo = response;
                this.email = response.email;
                this.username = response.userName;
                this.shareData.userRoles = response.appRoles;
                //Lưu vào Session để lần sau dùng các thím ạ
                sessionStorage.setItem('USER_CURRENT', JSON.stringify(response));
                localStorage.setItem('USER_CURRENT', JSON.stringify(response));
                // sessionStorage.setItem('USER_ROLES', JSON.stringify(response.appRoles));
                //let url = 'https://localhost:7289/api/Resident/GetResidentById';
                const params = response.accountId;
                let responseUser = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN,API.API_CU_DAN.GET_RESIDENT_BY_ID, params);
                if (responseUser && responseUser.state) {
                    this.fullName = responseUser.data.fullName;
                    sessionStorage.setItem('RESIDENT', JSON.stringify(responseUser.data));

                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    async onSearchNotifi() {
        try {
            //let url = 'https://localhost:7032/api/Notification/GetMultiNotifications';
            let type = JSON.parse(sessionStorage.getItem('USER_CURRENT')).accountId;
            let param = {
                type: 3,
                listReciverId: [type.toString()]
            };
            let response = await this.iServiceBase.postDataAsync(API.PHAN_HE.TOANHA,API.API_THONG_BAO.GET_MULTI_NOTIFICATION, param);
            if (response && response.state) {
                this.lstNotifi = response.data;
                this.lstNotifi.sort((a, b) => a.isRead - b.isRead);
                this.numNotifi = this.lstNotifi.filter(c => c.isRead == 0).length;
            }
        } catch (e) {
            console.log('khong load dc');
        }
    }
    async updateChangeNotifi(noti){
        if(!noti.isRead)
        {
            noti.isRead = 1;
            let url = 'https://localhost:7032/api/Notification/UpdateNotificationById';
            let response = await this.iServiceBase.postDataAsyncTest(url, noti);
            if (response && response.state) {
                this.onSearchNotifi();
            }
        }
    }
    logOut(event) {
        //Logout thì xóa đi
        sessionStorage.clear();

        //Xóa hết đi các thứ linh tinh chỉ gán lại các thứ cấn thiết trong localstorage
        this.clearLocalStorage();

        event.preventDefault();

        this.router.navigate(['/login']);
    }

    clearLocalStorage() {
        //get ra các biến không cần xóa
        let IP_API_SERVICE = localStorage.getItem('APISERVICE');
        let IP_API_GATEWAY = localStorage.getItem('APIGATEWAY');
        let VERSION = localStorage.getItem('VERSION');
        let PROJECT_NAME = localStorage.getItem('PROJECT_NAME');

        //clear
        localStorage.clear();

        //Set lại các thứ cần thiết
        localStorage.setItem('APISERVICE', IP_API_SERVICE);
        localStorage.setItem('APIGATEWAY', IP_API_GATEWAY);
        localStorage.setItem('VERSION', VERSION);
        localStorage.setItem('PROJECT_NAME', PROJECT_NAME);
    }
    ngAfterViewInit()
    {
        this.observer
            .observe(['(max-width: 990px)'])
            .pipe(delay(1), untilDestroyed(this))
            .subscribe((res) => {
                if (res.matches) {
                    this.sidenav.mode = 'over';
                    this.sidenav.close();
                } else {
                    this.sidenav.mode = 'side';
                    this.sidenav.open();
                }
            });
    }
}
