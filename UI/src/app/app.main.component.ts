import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MenuService} from './app-systems/app-menu/app.menu.service';
import {MegaMenuItem, PrimeNGConfig} from 'primeng/api';
import {AppComponent} from './app.component';
import {ShareData} from './modules/compoents-customer-module/shared-data-services/sharedata.service';
import {MatSidenav} from '@angular/material/sidenav';
import {BreakpointObserver} from '@angular/cdk/layout';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {delay, filter} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {parseJson} from '@angular/cli/utilities/json-file';

@UntilDestroy()
@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppMainComponent implements AfterViewInit, OnInit {
    topbarMenuActive: boolean;

    menuActive: boolean;

    staticMenuDesktopInactive: boolean;

    mobileMenuActive: boolean;

    menuClick: boolean;

    mobileTopbarActive: boolean;

    topbarRightClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: string;

    documentClickListener: () => void;

    configActive: boolean;

    configClick: boolean;

    rightMenuActive: boolean;

    menuHoverActive = false;

    searchClick = false;

    search = false;

    currentInlineMenuKey: string;
    inlineMenuActive: any[] = [];
    inlineMenuClick: boolean;
    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;
    checkTypeUser : boolean = true;
    constructor(public renderer: Renderer2, private menuService: MenuService, private primengConfig: PrimeNGConfig,
                public app: AppComponent, private observer: BreakpointObserver, private router: Router) {
    }

    ngOnInit() {

        let type = JSON.parse(sessionStorage.getItem('USER_ROLES')).roleKey;
        if(type == 'ROLE_USER')
            this.checkTypeUser = false;
        this.menuActive = this.isStatic() && !this.isMobile();
    }

    ngAfterViewInit() {
        // hides the horizontal submenus or top menu if outside is clicked
        this.documentClickListener = this.renderer.listen('body', 'click', () => {
            if (!this.topbarItemClick) {
                this.activeTopbarItem = null;
                this.topbarMenuActive = false;
            }

            if (!this.menuClick && (this.isHorizontal() || this.isSlim())) {
                this.menuService.reset();
            }

            if (this.configActive && !this.configClick) {
                this.configActive = false;
            }

            if (!this.menuClick) {
                if (this.mobileMenuActive) {
                    this.mobileMenuActive = false;
                }

                if (this.isOverlay()) {
                    this.menuActive = false;
                }

                this.menuHoverActive = false;
                this.unblockBodyScroll();
            }

            if (!this.searchClick) {
                this.search = false;
            }

            if (this.inlineMenuActive[this.currentInlineMenuKey] && !this.inlineMenuClick) {
                this.inlineMenuActive[this.currentInlineMenuKey] = false;
            }

            this.inlineMenuClick = false;
            this.searchClick = false;
            this.configClick = false;
            this.topbarItemClick = false;
            this.topbarRightClick = false;
            this.menuClick = false;
        });
        this.observer
            .observe(['(max-width: 1000px)'])
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

    onMenuButtonClick(event) {
        this.menuActive = !this.menuActive;
        this.topbarMenuActive = false;
        this.topbarRightClick = true;
        this.menuClick = true;
        if (this.isDesktop()) {
            this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
        } else {
            this.mobileMenuActive = !this.mobileMenuActive;
            if (this.mobileMenuActive) {
                this.blockBodyScroll();
            } else {
                this.unblockBodyScroll();
            }
        }
        event.preventDefault();
    }

    onTopbarMobileButtonClick(event) {
        this.mobileTopbarActive = !this.mobileTopbarActive;
        event.preventDefault();
    }

    onRightMenuButtonClick(event) {
        this.rightMenuActive = !this.rightMenuActive;
        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        if (this.inlineMenuActive[this.currentInlineMenuKey] && !this.inlineMenuClick) {
            this.inlineMenuActive[this.currentInlineMenuKey] = false;
        }
    }

    onSearchKeydown(event) {
        if (event.keyCode === 27) {
            this.search = false;
        }
    }

    onInlineMenuClick(event, key) {
        if (key !== this.currentInlineMenuKey) {
            this.inlineMenuActive[this.currentInlineMenuKey] = false;
        }

        this.inlineMenuActive[key] = !this.inlineMenuActive[key];
        this.currentInlineMenuKey = key;
        this.inlineMenuClick = true;
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        if (item === 'search') {
            this.search = !this.search;
            this.searchClick = !this.searchClick;
        }

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    onRTLChange(event) {
        this.app.isRTL = event.checked;
    }

    onRippleChange(event) {
        this.app.ripple = event.checked;
        this.primengConfig.ripple = event.checked;
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return window.innerWidth <= 991;
    }

    isOverlay() {
        return this.app.menuMode === 'overlay';
    }

    isStatic() {
        return this.app.menuMode === 'static';
    }

    isHorizontal() {
        return this.app.menuMode === 'horizontal';
    }

    isSlim() {
        return this.app.menuMode === 'slim';
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    // ngOnDestroy() {
    //     if (this.documentClickListener) {
    //         this.documentClickListener();
    //     }
    // }
    protected readonly ChannelMergerNode = ChannelMergerNode;
}
