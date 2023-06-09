import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {animate, AnimationEvent, style, transition, trigger} from '@angular/animations';
import {MegaMenuItem, MessageService} from 'primeng/api';
import {AppComponent} from '../../app.component';
import {AppMainComponent} from '../../app.main.component';
import {Router} from "@angular/router";
import {Subscription} from 'rxjs';
import {AppBreadcrumbService} from '../app-breadcrumb/app.breadcrumb.service';
import {
    iComponentBase,
    iServiceBase,
    ShareData
} from 'src/app/modules/compoents-customer-module/components-customer';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    animations: [
        trigger('topbarActionPanelAnimation', [
            transition(':enter', [
                style({opacity: 0, transform: 'scaleY(0.8)'}),
                animate('.12s cubic-bezier(0, 0, 0.2, 1)', style({opacity: 1, transform: '*'})),
            ]),
            transition(':leave', [
                animate('.1s linear', style({opacity: 0}))
            ])
        ])
    ]
})
export class AppTopBarComponent extends iComponentBase implements OnInit {
    label: any;
    userCurrent: any;
    userName: any;
    userFullName: any;
    subscription: Subscription;
    constructor(public appMain: AppMainComponent,
                public app: AppComponent,
                private router: Router,
                private iServiceBase: iServiceBase,
                private shareData: ShareData,
                public messageService: MessageService,
                public breadcrumbService: AppBreadcrumbService
    ) {
        super(messageService);
        this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
            console.log('response',response)
            this.label = response[response.length-1]?.label;
        });
    }

    activeItem: number;

    model: MegaMenuItem[] = [
        {
            label: 'UI KIT',
            items: [
                [
                    {
                        label: 'UI KIT 1',
                        items: [
                            {
                                label: 'Form Layout',
                                icon: 'pi pi-fw pi-id-card',
                                routerLink: ['uikit/formlayout']
                            },
                            {
                                label: 'Input',
                                icon: 'pi pi-fw pi-check-square',
                                routerLink: ['uikit/input']
                            },
                            {
                                label: 'Float Label',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['uikit/floatlabel']
                            },
                            {
                                label: 'Button',
                                icon: 'pi pi-fw pi-mobile',
                                routerLink: ['uikit/button']
                            },
                            {label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['uikit/file']}
                        ]
                    }
                ],
                [
                    {
                        label: 'UI KIT 2',
                        items: [
                            {
                                label: 'Table',
                                icon: 'pi pi-fw pi-table',
                                routerLink: ['uikit/table']
                            },
                            {label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['uikit/list']},
                            {
                                label: 'Tree',
                                icon: 'pi pi-fw pi-share-alt',
                                routerLink: ['uikit/tree']
                            },
                            {
                                label: 'Panel',
                                icon: 'pi pi-fw pi-tablet',
                                routerLink: ['uikit/panel']
                            },
                            {
                                label: 'Chart',
                                icon: 'pi pi-fw pi-chart-bar',
                                routerLink: ['uikit/charts']
                            }
                        ]
                    }
                ],
                [
                    {
                        label: 'UI KIT 3',
                        items: [
                            {
                                label: 'Overlay',
                                icon: 'pi pi-fw pi-clone',
                                routerLink: ['uikit/overlay']
                            },
                            {
                                label: 'Media',
                                icon: 'pi pi-fw pi-image',
                                routerLink: ['uikit/media']
                            },
                            {label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['uikit/menu']},
                            {
                                label: 'Message',
                                icon: 'pi pi-fw pi-comment',
                                routerLink: ['uikit/message']
                            },
                            {
                                label: 'Misc',
                                icon: 'pi pi-fw pi-circle-off',
                                routerLink: ['uikit/misc']
                            }
                        ]
                    }
                ]
            ]
        },
        {
            label: 'utilities',
            items: [
                [
                    {
                        label: 'utilities 1',
                        items: [
                            {
                                label: 'Display',
                                icon: 'pi pi-fw pi-desktop',
                                routerLink: ['utilities/display']
                            },
                            {
                                label: 'Elevation',
                                icon: 'pi pi-fw pi-external-link',
                                routerLink: ['utilities/elevation']
                            }
                        ]
                    },
                    {
                        label: 'utilities 2',
                        items: [
                            {
                                label: 'FlexBox',
                                icon: 'pi pi-fw pi-directions',
                                routerLink: ['utilities/flexbox']
                            }
                        ]
                    }
                ],
                [
                    {
                        label: 'utilities 3',
                        items: [
                            {
                                label: 'Icons',
                                icon: 'pi pi-fw pi-search',
                                routerLink: ['utilities/icons']
                            }
                        ]
                    },
                    {
                        label: 'utilities 4',
                        items: [
                            {
                                label: 'Text',
                                icon: 'pi pi-fw pi-pencil',
                                routerLink: ['utilities/text']
                            },
                            {
                                label: 'Widgets',
                                icon: 'pi pi-fw pi-star-o',
                                routerLink: ['utilities/widgets']
                            }
                        ]
                    }
                ],
                [
                    {
                        label: 'utilities 5',
                        items: [
                            {
                                label: 'Grid System',
                                icon: 'pi pi-fw pi-th-large',
                                routerLink: ['utilities/grid']
                            },
                            {
                                label: 'Spacing',
                                icon: 'pi pi-fw pi-arrow-right',
                                routerLink: ['utilities/spacing']
                            },
                            {
                                label: 'Typography',
                                icon: 'pi pi-fw pi-align-center',
                                routerLink: ['utilities/typography']
                            }
                        ]
                    }
                ],
            ]
        }
    ];

    @ViewChild('searchInput') searchInputViewChild: ElementRef;

    onSearchAnimationEnd(event: AnimationEvent) {
        switch (event.toState) {
            case 'visible':
                this.searchInputViewChild.nativeElement.focus();
                break;
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
        localStorage.setItem("APISERVICE", IP_API_SERVICE);
        localStorage.setItem("APIGATEWAY", IP_API_GATEWAY);
        localStorage.setItem("VERSION", VERSION);
        localStorage.setItem("PROJECT_NAME", PROJECT_NAME);
    }


    ngOnInit() {
        //Lấy thong tin user ra nào
        this.userCurrent = JSON.parse(sessionStorage.getItem('USER_CURRENT'));

        if (this.userCurrent) {
            this.userName = this.userCurrent.userName;
            this.userFullName = this.userCurrent.fullName;
        }
    }
}
