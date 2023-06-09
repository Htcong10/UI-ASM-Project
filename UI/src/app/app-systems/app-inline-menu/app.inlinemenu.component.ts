import { Component, Input } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { AppMainComponent } from '../../app.main.component';
import { AppComponent } from '../../app.component';
import {Router} from '@angular/router';

@Component({
    selector: 'app-inline-menu',
    templateUrl: './app.inlinemenu.component.html',
    animations: [
        trigger('menu', [
            state('hiddenAnimated', style({
                height: '0px',
                paddingBottom: '0px',
                overflow: 'hidden'
            })),
            state('visibleAnimated', style({
                height: '*',
                overflow: 'visible'
            })),
            state('visible', style({
                opacity: 1,
                'z-index': 100
            })),
            state('hidden', style({
                opacity: 0,
                'z-index': '*'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('visible => hidden', animate('.1s linear')),
            transition('hidden => visible', [style({transform: 'scaleY(0.8)'}), animate('.12s cubic-bezier(0, 0, 0.2, 1)')])
        ])
    ]
})
export class AppInlineMenuComponent {

    @Input() key = 'inline-menu';

    @Input() style: any;

    @Input() styleClass: string;

    active: boolean;
    fullName: any;
    constructor(public appMain: AppMainComponent, public app: AppComponent, private router : Router) { }

    onClick(event) {
        this.appMain.onInlineMenuClick(event, this.key);
        event.preventDefault();
    }

    get isTooltipDisabled() {
        return !(this.appMain.isSlim() && !this.appMain.isMobile());
    }

    get tabIndex() {
        return !this.appMain.inlineMenuActive  ? '-1' : null;
    }

    isHorizontalActive() {
       return this.appMain.isHorizontal() && !this.appMain.isMobile();
    }
    logOut(event) {
        //Logout thì xóa đi
        sessionStorage.clear();
        //Xóa hết đi các thứ linh tinh chỉ gán lại các thứ cấn thiết trong localstorage
        this.ClearLocalStorage();

        event.preventDefault();

        this.router.navigate(['/login']);
    }
    ClearLocalStorage() {
        //get ra các biến không cần xóa
        //clear

        //Set lại các thứ cần thiết
    }
}
