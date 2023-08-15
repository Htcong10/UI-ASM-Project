import {Component, OnInit} from '@angular/core';
import {ShareData} from '../../../compoents-customer-module/shared-data-services/sharedata.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {iServiceBase} from '../../../compoents-customer-module/functions/iServiceBase';
import * as API from '../../../../services/apiURL';
import {AppResident} from '../../../quan-tri-cu-dan-module/models/app-resident.model';
import {AppHoGDinhModel} from '../../../quan-tri-cu-dan-module/models/app-hogdinh.model';
import {mType} from '../../../compoents-customer-module/functions/iComponentBase.component';
import {AppUser} from '../../../quan-tri-he-thong-module/models/appuser.model';

@Component({
    selector: 'app-thong-tin-user',
    templateUrl: './thong-tin-user.component.html',
    styleUrls: ['./thong-tin-user.component.scss']
})
export class ThongTinUserComponent implements OnInit {
    residentId: number;
    residentModel: AppResident;
    houseModel: AppHoGDinhModel;
    account: AppUser;
    loading: boolean;
    role: any;
    showDialog: boolean = false;
    headerDialog: string;
    accountDialog: boolean = false;
    oldPassword: any;
    newPassword: any;
    constructor(
        private shareData: ShareData,
        public messageService: MessageService,
        private confirmationService: ConfirmationService,
        private iServiceBase: iServiceBase,
        private datePipe: DatePipe) {
    }

    async ngOnInit() {
        this.residentModel = JSON.parse(sessionStorage.getItem('RESIDENT'));
        this.account = JSON.parse(sessionStorage.getItem('USER_CURRENT'));
        this.role = this.account.appRoles[0];
        await this.getInfoHouseHold();
    }


    async getInfoHouseHold() {
        if (this.residentModel != null) {
            this.loading = true;
            try {
                let param = {
                    paramId: this.residentModel.householdId,
                    pageSize: 1,
                    page: 1
                };
                const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_HO_GDINH.GET_HOUSEH_BY_RESIDENTID, param);
                if (response && response.state) {
                    this.houseModel = response.data[0];

                }
                this.loading = false;
            } catch (e) {
                console.log('khong load dc');
            }
        }
    }

    async changeInfo() {
        this.showDialog = true;
    }

    async changePassword() {
        this.headerDialog = 'Thay đổi mật khẩu';
        this.accountDialog = true;
    }
    async onSaveUser(){
        if(this.newPassword.length <= 0 || this.newPassword == null)
        {
            this.showMessage(mType.warn, "Thông báo", "Chưa nhập mật khẩu mới!", 'notify');
            return;
        }

        if(this.account.confirmPassword.length <= 0 || this.account.confirmPassword == null)
        {
            this.showMessage(mType.warn, "Thông báo", "Chưa xác nhận mật khẩu!", 'notify');
            return;
        }
        if(this.account.confirmPassword !== this.newPassword)
        {
            this.showMessage(mType.warn, "Thông báo", "Xác nhận mật khẩu không thành công!", 'notify');
            return;
        }
        this.account.password = this.newPassword;
        this.account.lastModifiedBy = this.shareData.userInfo.userName;
        this.account.lastModifiedDate = new Date();
        const response = await this.iServiceBase.putDataAsync(API.PHAN_HE.QTHT, API.API_QTHT.CHANGE_PASSWORD, this.account);
        if (response && response.success) {
            this.showMessage(mType.success, 'Thông báo', 'Cập nhật mật khẩu thành công!', 'notify');
            this.accountDialog = false;
        } else {
            this.showMessage(mType.error, 'Thông báo', 'Cập nhật mật khẩu không thành công do lỗi :' + response.message, 'notify');
        }
    }
    async onCancelUser(){
        this.accountDialog = false;
        this.newPassword = '';
        this.account.confirmPassword = '';
    }
    showMessage(iType: mType, strheader, strmessage, key?: string) {
        if (iType == 0) {
            if (key != undefined) {
                this.messageService.add({key, severity: 'success', summary: strheader, detail: strmessage});
            } else {
                this.messageService.add({severity: 'success', summary: strheader, detail: strmessage});
            }

        }

        if (iType == 1) {
            if (key != undefined) {
                this.messageService.add({key, severity: 'info', summary: strheader, detail: strmessage});
            } else {
                this.messageService.add({severity: 'info', summary: strheader, detail: strmessage});
            }
        }

        if (iType == 2) {
            if (key != undefined) {
                this.messageService.add({key, severity: 'warn', summary: strheader, detail: strmessage});
            } else {
                this.messageService.add({severity: 'warn', summary: strheader, detail: strmessage});
            }
        }

        if (iType == 3) {
            if (key != undefined) {
                this.messageService.add({key, severity: 'error', summary: strheader, detail: strmessage});
            } else {
                this.messageService.add({severity: 'error', summary: strheader, detail: strmessage});
            }
        }
    }
}
