import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {delay, filter} from 'rxjs/operators';
import {untilDestroyed} from '@ngneat/until-destroy';
import {NavigationEnd, Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import * as API from '../../services/apiURL';
import {AppComponent} from '../../app.component';
import {iServiceBase, ShareData} from 'src/app/modules/compoents-customer-module/components-customer';
import {AppMainComponent} from '../../app.main.component';

@Component({
    selector: 'app-menu-user',
    templateUrl: './app-menu-user.component.html',
    styleUrls: ['./app-menu-user.component.scss']
})
export class AppMenuUserComponent implements AfterViewInit, OnInit  {
    email: string;
    username: string;
    isSidebarLocked: boolean = true;
    isSidebarClosed: boolean = false;
    searchQuery: string;

    constructor(private observer: BreakpointObserver, private router: Router, public app: AppComponent,
                private shareData: ShareData,
                private iServiceBase: iServiceBase,
                public appMain: AppMainComponent,) {
    }

    ngOnInit(): void {
        this.getInfoCurrentUser();

    }

    toggleLock() {
        this.isSidebarLocked = !this.isSidebarLocked;
        if (!this.isSidebarLocked) {
            this.isSidebarClosed = false;
        }
    }

    toggleSidebar() {
        this.isSidebarClosed = !this.isSidebarClosed;
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
                // sessionStorage.setItem('USER_ROLES', JSON.stringify(response.appRoles));
            }
        } catch (e) {
            console.log(e);
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
        // Selecting the sidebar and buttons
        const sidebar = document.querySelector(".sidebar");
        const sidebarOpenBtn = document.querySelector("#sidebar-open");
        const sidebarCloseBtn = document.querySelector("#sidebar-close");
        const sidebarLockBtn = document.querySelector("#lock-icon");

        // Function to toggle the lock state of the sidebar
        const toggleLock = () => {
            sidebar.classList.toggle("locked");
            // If the sidebar is not locked
            if (!sidebar.classList.contains("locked")) {
                sidebar.classList.add("hoverable");
                sidebarLockBtn.classList.replace("pi-lock", "pi-unlock");

            } else {
                sidebar.classList.remove("hoverable");
                sidebarLockBtn.classList.replace("pi-unlock", "pi-lock");
            }
        };

        // Function to hide the sidebar when the mouse leaves
        const hideSidebar = () => {
            if (sidebar.classList.contains("hoverable")) {
                sidebar.classList.add("close");
            }
        };

        // Function to show the sidebar when the mouse enters
        const showSidebar = () => {
            if (sidebar.classList.contains("hoverable")) {
                sidebar.classList.remove("close");
            }
        };

        // Function to show and hide the sidebar
        const toggleSidebar = () => {
            sidebar.classList.toggle("close");
        };

        // this.observer
        //     .observe(['(max-width: 992px)'])
        //     .pipe(delay(1), untilDestroyed(this))
        //     .subscribe((res) => {
        //         if (res.matches) {
        //             sidebar.classList.add("close");
        //             sidebar.classList.add("hoverable");
        //             sidebar.classList.remove("locked");
        //         } else {
        //             sidebar.classList.add("close");
        //             sidebar.classList.add("hoverable");
        //             sidebar.classList.remove("locked");
        //         }
        //     });
        // Adding event listeners to buttons and sidebar for the corresponding actions
        sidebarLockBtn.addEventListener("click", toggleLock);
        sidebar.addEventListener("mouseleave", hideSidebar);
        sidebar.addEventListener("mouseenter", showSidebar);
        sidebarOpenBtn.addEventListener("click", toggleSidebar);
        sidebarCloseBtn.addEventListener("click", toggleSidebar);
    }
}
