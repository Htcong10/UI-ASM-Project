import {Component, OnInit, ViewChild} from '@angular/core';
import {AppResident} from '../../../quan-tri-cu-dan-module/models/app-resident.model';
import {AppHoGDinhModel} from '../../../quan-tri-cu-dan-module/models/app-hogdinh.model';
import {Table} from 'primeng/table';
import {AppBreadcrumbService} from '../../../../app-systems/app-breadcrumb/app.breadcrumb.service';
import {ShareData} from '../../../compoents-customer-module/shared-data-services/sharedata.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {iComponentBase, mType} from '../../../compoents-customer-module/functions/iComponentBase.component';
import * as API from '../../../../services/apiURL';
import {iServiceBase} from '../../../compoents-customer-module/functions/iServiceBase';
import {AppNotificationModel} from '../../model/app-notification.model';

@Component({
    selector: 'app-danh-muc-thong-bao',
    templateUrl: './danh-muc-thong-bao.component.html',
    styleUrls: ['./danh-muc-thong-bao.component.scss']
})
export class DanhMucThongBaoComponent extends iComponentBase implements OnInit {

    lstAppResident: AppResident[] = [];
    lstAppNoti: AppNotificationModel[] = [];
    lstHouseHold: AppHoGDinhModel [] = [];
    notifiDialog: boolean = false;
    headerDialog: string = '';
    lstType: any[] = [];
    lstReciver: any;
    selectedReciver: any;
    type: number;
    showFind: boolean = false;
    notifiModel: AppNotificationModel = new AppNotificationModel();
    loading: boolean;
    submitted: boolean;
    @ViewChild('dt') table: Table;
    lstAppEmployee: any;
    labelName: any;
    selectedNotifi: any;
    active: any;
    selectedReciverCreate: any;
    lstForm : any;
    constructor(public breadcrumbService: AppBreadcrumbService,
                private shareData: ShareData,
                public messageService: MessageService,
                private confirmationService: ConfirmationService,
                private iServiceBase: iServiceBase,
                private datePipe: DatePipe) {
        super(messageService, breadcrumbService);
        this.onInitListNhomResident();
    }

    async ngOnInit() {
        this.lstForm = [
            {label: 'Chung', value: 0},
            {label: 'Tiền điện', value: 1},
            {label: 'Dịch vụ', value: 2},
            {label: 'Yêu cầu', value: 3}
        ];
        await this.loadAllEmployee();
        await this.loadAllHouseHold();
        await this.loadAllResident();
    }

    async loadAllResident() {
        try {
            let url = 'https://localhost:44395/api/Resident/GetAllResident';
            let response = await this.iServiceBase.postDataAsyncTest(url, null);
            if (response && response.state) {
                this.lstAppResident = response.data;
            }
        } catch (e) {
            console.log('khong load dc');
        }
    }

    async loadAllHouseHold() {
        try {
            this.lstHouseHold = [];
            let url = 'https://localhost:44395/api/HouseHold/GetAllHouse';
            let response = await this.iServiceBase.postDataAsyncTest(url, null);
            if (response && response.state) {
                response.data.forEach(e => {
                    this.lstHouseHold.push(e);
                });
            }
        } catch (e) {
            this.showMessage(mType.error, 'Thông báo', e, 'notify');
        }
    }

    async loadAllEmployee() {
        try {
            let url = 'https://localhost:44317/api/Employee/GetAllEmployee';
            let response = await this.iServiceBase.postDataAsyncTest(url, null);
            //const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.NHANVIEN, API.API_NHAN_VIEN.GET_ALL_EMPLOYEE,null);
            if (response && response.state) {
                this.lstAppEmployee = response.data;
            }
        } catch (e) {
            console.log('khong load dc');
        }
    }

    onInitListNhomResident() {
        this.lstType = [
            {label: 'Tất cả', value: -1},
            {label: 'Nhân viên', value: 0},
            {label: 'Hộ gia đình', value: 1},
            {label: 'Cư dân', value: 2}
        ];
    }

    async changeListReciver(event,model) {
        switch (!model ? event.value : model.notificationType) {
            case -1: {
                this.type = -1;
                this.showFind = true;
                break;
            }
            case 0: {
                this.lstReciver = this.lstAppEmployee;
                this.labelName = 'employeeName';
                this.type = 0;
                this.showFind = false;
                break;
            }
            case 1: {
                this.lstReciver = this.lstHouseHold;
                this.labelName = 'householdName';
                this.type = 1;
                this.showFind = false;
                break;
            }
            case 2: {
                this.lstReciver = this.lstAppResident;
                this.labelName = 'fullName';
                this.type = 2;
                this.showFind = false;
                break;
            }
        }
    }

    async onSearchNotifi(notifi: AppNotificationModel) {
        let url = 'https://localhost:44310/api/Notification/GetMultiNotifications';
        let recvierId;
        if (this.type != -1 && !notifi) {
            if (!this.selectedReciver || this.selectedReciver.length <= 0) {
                this.showMessage(mType.warn, 'Thông báo', 'Bạn chưa chọn thành viên!', 'notify');
                return;
            }
        }
        if(notifi)
            this.selectedReciver = this.selectedReciverCreate;
        this.loading = true;
        try {
            switch (this.type) {
                case 0: {
                    recvierId = this.selectedReciver.map(c => c.employeeId.toString());
                    break;
                }
                case 1: {
                    recvierId = this.selectedReciver.map(c => c.householdId.toString());
                    break;
                }
                case 2: {
                    recvierId = this.selectedReciver.map(c => c.residentId.toString());
                    break;
                }
            }
            let param = {
                type: this.type,
                listReciverId: recvierId
            };
            let response = await this.iServiceBase.postDataAsyncTest(url, param);
            if (response && response.state) {
                this.lstAppNoti = response.data;
            }
            this.loading = false;
        } catch (e) {
            console.log('khong load dc');
        }
    }
    async loadMember(notifi: AppNotificationModel) {
        await this.onSearchNotifi(notifi);
        if (this.lstAppNoti) {
            this.lstAppNoti.forEach(e => {
                let lstId = e.receiverId.split(',');
                if(e.notificationType == -1)
                    e.nguoiNhan = 'Tất cả';
                else {
                    let reciverList = e.notificationType == 0 ? this.lstAppEmployee : (e.notificationType == 1 ? this.lstHouseHold : this.lstAppEmployee);
                    e.nguoiNhan = this.getReceiversByType(reciverList,e.notificationType,lstId);
                }
                e.doiTuong = this.lstType.filter(c => c.value == e.notificationType)[0].label;
            })
        }
    }
    onDisplayDialog(header: string) {
        this.headerDialog = header;
        this.notifiDialog = true;
    }

    onHideDialog() {
        this.notifiModel = new AppNotificationModel();
        this.notifiDialog = false;
    }

    onCreateNotifi() {
        this.notifiModel = new AppNotificationModel();
        this.selectedReciverCreate = null;
        this.type = null;
        this.submitted = false;
        this.onDisplayDialog('Thêm mới cư dân');
    }

    async createNotifi(notifi: AppNotificationModel) {
        let url = 'https://localhost:44310/api/Notification/AddNotification';
        let response = await this.iServiceBase.postDataAsyncTest(url, notifi);
        if (response && response.state) {
            this.showMessage(mType.success, 'Thông báo', 'Thêm cư dân thành công', 'notify');
            this.onSearchNotifi(notifi);
        } else {
            this.showMessage(mType.error, 'Thông báo', 'Thêm cư dân không thành công do lỗi' + response.Message, 'notify');
        }
    }

    onDeleteListNotifi() {
        this.confirmationService.confirm({
            message: 'Bạn có chắc muốn xoá danh sách Cư dân này chứ??',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteListNotifi();
            }
        });
    }

    async deleteListNotifi() {
        const params = this.selectedNotifi.map(b => b.residentId);
        const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.DELETE_RESIDENT, params);
        if (response && response.state) {
            this.showMessage(mType.success, 'Thông báo', 'Xoá danh sách Cư dân thành công', 'notify');
            this.loadAllResident();
        } else {
            this.showMessage(mType.error, 'Thông báo', 'Xoá danh sách Cư dân không thành công', 'notify');
        }
    }
    getReceiversByType(lstReceiver: any, type: number, lstId : any): any {
        switch (type) {
            case 0: {
                return lstReceiver.filter(c => lstId.includes(c.employeeId.toString()));
                break;
            }
            case 1: {
                return lstReceiver.filter(c => lstId.includes(c.householdId.toString()));
                break;
            }
            case 2: {
                return lstReceiver.filter(c => lstId.includes(c.residentId.toString()));
                break;
            }
        }
    }
    onUpdateNotifi(model) {
        this.notifiModel = model;
        this.changeListReciver(null,model);
        this.selectedReciverCreate = this.getReceiversByType(this.lstReciver,model.notificationType,model.receiverId);
        this.onDisplayDialog('Chỉnh sửa cư dân');
        this.submitted = false;
    }

    setActive(event: any) {
        this.active = event.checked;
        this.notifiModel.isRead = event.checked ? 1 : 0;
    }

    async updateNotifi(model: AppNotificationModel) {
        let url = 'https://localhost:44310/api/Notification/AddNotification';
        let response = await this.iServiceBase.postDataAsyncTest(url, model);
        //const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.UPDATE_RESIDENT, model);
        if (response && response.state) {
            this.showMessage(mType.success, 'Thông báo', 'Chỉnh sửa Cư dân thành công', 'notify');
            this.onSearchNotifi(model);
        } else {
            this.showMessage(mType.error, 'Thông báo', 'Chỉnh sửa Cư dân không thành công', 'notify');
        }
    }


    onDeleteNotifi(model, event) {
        this.confirmationService.confirm({
            target: event.target,
            message: 'Bạn có chắc muốn xoá cư dân này chứ ' + model.title + '?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteNotifi(model);
            }
        });
    }

    async deleteNotifi(model: AppNotificationModel) {
        const param = model.notificationId;
        const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.DELETE_RESIDENT, param);
        if (response && response.state) {
            this.showMessage(mType.success, 'Thông báo', 'Xoá cư dân thành công', 'notify');
            this.loadAllResident();
        } else {
            this.showMessage(mType.error, 'Thông báo', 'Xoá cư dân không thành công', 'notify');
        }
    }

    onSaveNotifi() {
        if (this.validateData()) {
            let result = this.onBindingData();
            if (result.notificationId && result.notificationId > 0) {
                this.updateNotifi(result);
            } else {
                this.createNotifi(result);
            }
            this.onHideDialog();
        }
    }

    private onBindingData(): AppNotificationModel {
        let data = new AppNotificationModel();
        if (this.shareData && this.shareData.userInfo) {
            data.title = this.notifiModel.title;
            data.messages = this.notifiModel.messages;
            data.notificationType = this.notifiModel.notificationType;
            data.isRead = this.active ? 1 : 0;
            data.notificationForm = this.notifiModel.notificationForm;
            switch (this.notifiModel.notificationType) {
                case 0: {
                    data.receiverId = this.selectedReciverCreate.map(c => c.employeeId.toString()).join(',');
                    break;
                }
                case 1: {
                    data.receiverId = this.selectedReciverCreate.map(c => c.householdId.toString()).join(',');
                    break;
                }
                case 2: {
                    data.receiverId = this.selectedReciverCreate.map(c => c.residentId.toString()).join(',');
                    break;
                }
            }
            // update
            if (this.notifiModel.notificationId && this.notifiModel.notificationId > 0) {
                data.notificationId = this.notifiModel.notificationId;
                data.createdBy = this.notifiModel.createdBy;
                data.createdDate = this.notifiModel.createdDate;
                data.updatedBy = this.shareData.userInfo.userName;
                data.updatedDate = new Date();
            } else {
                data.createdBy = this.shareData.userInfo.userName;
                data.createdDate = new Date();
            }
        }
        return data;
    }

    private validateData() {
        if (!this.notifiModel.title || this.notifiModel.title == '') {
            this.showMessage(mType.warn, 'Thông báo', 'Bạn chưa nhập tiêu đề!', 'notify');
            return false;
        }
        if (!this.notifiModel.messages || this.notifiModel.messages == '') {
            this.showMessage(mType.warn, 'Thông báo', 'Bạn chưa nhập nội dung', 'notify');
            return false;
        }
        if (this.notifiModel.notificationType == null || this.notifiModel.notificationType == undefined) {
            this.showMessage(mType.warn, 'Thông báo', 'Bạn chưa chọn loại đối tượng! ', 'notify');
            return false;
        }
        if (!this.notifiModel.notificationForm) {
            this.showMessage(mType.warn, 'Thông báo', 'Bạn chưa chọn loại thông báo! ', 'notify');
            return false;
        }
        if (!this.selectedReciverCreate || this.selectedReciverCreate.length <= 0) {
            this.showMessage(mType.warn, 'Thông báo', 'Bạn chưa chọn đối tượng! ', 'notify');
            return false;
        }
        return true;
    }

    onCancelNotifi() {
        this.notifiModel = new AppNotificationModel();
        this.onHideDialog();
        this.submitted = false;
    }
}
