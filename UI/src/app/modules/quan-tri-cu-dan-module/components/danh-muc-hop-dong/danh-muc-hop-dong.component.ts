import {Component, OnInit} from '@angular/core';
import {iServiceBase} from '../../../compoents-customer-module/functions/iServiceBase';
import {iComponentBase, mType} from '../../../compoents-customer-module/functions/iComponentBase.component';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ShareData} from '../../../compoents-customer-module/shared-data-services/sharedata.service';
import {AppHoGDinhModel} from '../../models/app-hogdinh.model';
import * as API from '../../../../services/apiURL';
import {AppHDongCDanModel} from '../../models/app-hdong-cdan.model';
import {AppResident} from '../../models/app-resident.model';
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-danh-muc-goi-tai-khoan',
    templateUrl: './danh-muc-hop-dong.component.html',
    styleUrls: ['./danh-muc-hop-dong.component.scss']
})
export class DanhMucGoiTaiKhoan extends iComponentBase implements OnInit {

    lstHoGDinh: any[] = [];
    t
    lstHDongCDanGroup: any[] = [];
    selectedHDong: AppHDongCDanModel[] = [];
    lstAppResident: AppResident[] = [];
    lstApartment: any[] = [];
    HDongCDan: AppHDongCDanModel = new AppHDongCDanModel();
    loading: boolean;
    lstAppHDongCDan: AppHDongCDanModel[] = [];
    headerDialog: string;
    isDisplayDialog = false;
    confirmDel = false;
    selectedHost: any;
    startDate: Date;
    endDate: Date;
    selectedHoGDinh: any;
    selectedApart: any;
    hostName: any;
    active: boolean;

    constructor(private iServiceBase: iServiceBase,
                public messageService: MessageService,
                private confirmService: ConfirmationService,
                private shareData: ShareData,
                public http: HttpClient
    ) {
        super(messageService);
    }

    async ngOnInit() {
        this.loadMember();
    }

    async loadAllHDongCDan() {
        this.loading = true;
        try {
            /*let url = "https://localhost:7032/api/Contract/GetAllContract";
            let response = await this.iServiceBase.postDataAsyncTest(url,null);*/
            const response  = await this.iServiceBase.postDataAsync(API.PHAN_HE.TOANHA, API.API_HOP_DONG_CDAN.GET_ALL_CONTRACT,null);
            if (response && response.state) {
                this.lstAppHDongCDan = response.data;
            }
            this.loading = false;
        } catch (e) {
            console.log('khong load dc');
        }
    }

    async loadAllResident() {
        this.loading = true;
        try {
            /*let url = "https://localhost:7289/api/Resident/GetAllResident";
            let response = await this.iServiceBase.postDataAsyncTest(url,null);*/
            const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.GET_ALL_RESIDENT,null);;
            if (response && response.state) {
                this.lstAppResident = response.data;
            }
            this.loading = false;
        } catch (e) {
            console.log('khong load dc');
        }
    }

    async loadAllApartment() : Promise<any>{
        this.loading = true;
        try {
            /*let url = "https://localhost:7032/api/Apartment/GetAllApartment";
            let response = await this.iServiceBase.postDataAsyncTest(url,null);*/
            const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.TOANHA, API.API_HOP_CAN_HO.GET_ALL_APARTMENT,null);
            if (response && response.state) {
                this.lstApartment = response.data;
            }
            this.loading = false;
        } catch (e) {
            console.log('khong load dc');
        }
    }

    async loadAllHoGDinh() {
        this.lstHoGDinh = [];
        this.loading = true;
        try {
            /*let url = "https://localhost:7289/api/HouseHold/GetAllHouse";
            let response = await this.iServiceBase.postDataAsyncTest(url,null);*/
            let response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_HO_GDINH.GET_ALL_HOUSEH,null);
            if (response && response.state) {
                this.lstHoGDinh = response.data
            }
        } catch (e) {
            console.log('khong load duoc data');
        }
        this.loading = false;
    }

    async loadMember() {
        await this.loadAllHDongCDan();
        await this.loadAllHoGDinh();
        await this.loadAllApartment();
        await this.loadAllResident();
        if (this.lstAppHDongCDan) {
            if (this.lstHoGDinh) {
                this.lstAppHDongCDan.forEach(h => {
                    let hoGdinh = this.lstHoGDinh.filter(c => c.householdId == h.householdId)[0];
                    let canHo = this.lstApartment.filter(c => c.apartmentId == h.apartmentId)[0];
                    h.canHo = canHo ? canHo : [];
                    h.thanhVien = hoGdinh.memberId ? this.lstAppResident.filter(c => hoGdinh.memberId.includes(c.residentId.toString())) : [];
                })
            }
        }
    }

    onBasicUpload(event) {
        this.messageService.add({severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode'});
    }

    onDisplayDialog(header: string) {
        this.headerDialog = header;
        this.isDisplayDialog = true;
    }

    onHideDialog() {
        this.HDongCDan = new AppHDongCDanModel();

        this.isDisplayDialog = false;
    }

    onCreateHDongCDan() {
        this.HDongCDan = new AppHDongCDanModel();
        this.hostName = null;
        this.selectedHost = null;
        this.selectedHoGDinh = null;
        this.selectedApart = null;
        this.HDongCDan.active = true;
        this.startDate = null;
        this.endDate = null;
        this.onDisplayDialog('Thêm mới hộ gia đình');
    }

    async createUpdateApi(HoGDinhModel: AppHDongCDanModel, type: number) {
        let url;
        let message;
        let response;
        this.loading = true;
        switch (type) {
            case 1: // insert
                url = API.API_HOP_DONG_CDAN.ADD_CONTRACT;
                message = 'Thêm hộ gia đình mới';
                response = await this.iServiceBase.postData(API.PHAN_HE.TOANHA, url, HoGDinhModel).toPromise();
                break;
            case 2: // update
                url = API.API_HOP_DONG_CDAN.UPDATE_CONTRACT;
                message = 'Chỉnh sửa hộ gia đình';
                response = await this.iServiceBase.postData(API.PHAN_HE.TOANHA, url, HoGDinhModel).toPromise();
                break;
            default:
                console.error('tác vụ không có');
                break;
        }
        if (response && response.state) {
            // //cập nhật lại cho cư dân
            // let lstmemId = HoGDinhModel.memberId.split(',');
            // let lstHDongCDan = this.lstAppHDongCDan.filter(function (e) {
            //     return lstmemId.indexOf(e.residentId.toString()) > -1;
            // });
            // lstHDongCDan.forEach(e => e.householdId = HoGDinhModel.householdId)
            // const responseHDongCDan = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.UPDATE_LIST_RESIDENT, lstHDongCDan);
            this.showMessage(mType.success, 'Thông báo', message + ' thành công', 'notify');
            this.onHideDialog();
        } else {
            this.showMessage(mType.error, 'Thông báo', message + ' không thành công', 'notify');
        }
        this.loading = false;
        this.loadMember();
    }

    onUpdateHDongCDan(HDongCDan: AppHDongCDanModel) {
        // parse minutes to day
        this.HDongCDan = Object.assign({}, HDongCDan);
        this.selectedHoGDinh = this.lstHoGDinh.filter(c => c.householdId == HDongCDan.householdId)[0];
        this.selectedApart = this.lstApartment.filter(c => c.apartmentId == HDongCDan.apartmentId)[0];
        this.startDate = new Date(HDongCDan.startDate);
        this.endDate = new Date(HDongCDan.endDate);
        this.onDisplayDialog('Chỉnh sửa hộ gia đình');
    }

    async confirmDelete(messConfirm: string, type: number) {
        this.confirmService.confirm({
            message: messConfirm,
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteHDongCDanAPI(type);
            }
        });
    }

    async onDeleteHDongCDan(HDongCDan: AppHDongCDanModel) {
        this.HDongCDan = HDongCDan;
        this.confirmDelete('Bạn có chắc muốn xoá hộ gia đình này chứ?', 1);
    }

    async onDeleteListHDongCDanh() {
        this.confirmDelete('Bạn có chắc muốn xoá danh sách hộ gia đình này chứ?', 2);
    }

    async deleteHDongCDanAPI(type: number) {
        let params;
        let url;
        let message;
        switch (type) {
            case 1: // delete single
                params = this.HDongCDan.householdId;
                url = API.API_HO_GDINH.DELETE_HOUSEH;
                message = 'Xoá hộ gia đình';
                break;
            case 2: // delete list
                params = this.selectedHDong.map(p => p.householdId);
                url = API.API_HO_GDINH.DELETE_HOUSEH;
                message = 'Xoá danh sách hộ gia đình';
                break;
            default:
                console.error('tác vụ không có ở API');
                break;
        }

        const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, url, params);
        if (response && response.state) {
            this.showMessage(mType.success, 'Thông báo', message + ' thành công', 'notify');
            this.loadMember();
        } else {
            this.showMessage(mType.error, 'Thông báo', message + ' không thành công', 'notify');
        }
    }


    async onSaveHDongCDan() {
        if (this.validateData()) {
            const result = this.onBindingData();
            // type 1 insert
            if (result.contractId != null && result.contractId >= 0) {
                await this.createUpdateApi(result, 2);
            } else {
                await this.createUpdateApi(result, 1);
            }
        }
    }

    onCancelHDongCDan() {
        this.HDongCDan = new AppHDongCDanModel();
        this.onHideDialog();
    }

    private validateData(): boolean {
        if (!this.startDate) {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập ngày hiệu lực!", 'notify');
            return false;
        }
        if (!this.endDate) {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập ngày hết hiệu lực!", 'notify');
            return false;
        }
        if (!this.HDongCDan.monthlyFee) {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập giá thuê!", 'notify');
            return false;
        }
        if (!this.selectedHoGDinh) {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập hộ gia đình!", 'notify');
            return false;
        }
        return true;
    }

    onBindingData(): AppHDongCDanModel {
        const data = new AppHDongCDanModel();
        data.monthlyFee = this.HDongCDan.monthlyFee;
        data.fileUpload = this.HDongCDan.fileUpload;
        data.otherFees = this.HDongCDan.otherFees ? this.HDongCDan.otherFees : 0;
        data.status = this.active ? 1 : 0;
        data.hostName = this.lstAppResident.filter(c => c.fullName == this.selectedHoGDinh.hostName)[0].fullName;
        data.hostId = this.lstAppResident.filter(c => c.fullName == this.selectedHoGDinh.hostName)[0].residentId;
        data.householdId = this.selectedHoGDinh.householdId;
        data.apartmentId = this.selectedApart ? this.selectedApart.apartmentId : 0;
        data.startDate = new Date(this.startDate);
        data.endDate = new Date(this.endDate);
        if (this.HDongCDan.contractId != null) {
            data.contractId = this.HDongCDan.contractId;
            data.createdBy = this.HDongCDan.createdBy;
            data.createdDate = this.HDongCDan.createdDate;
            data.updatedBy = this.shareData.userInfo.userName;
            data.updatedDate = new Date();
        } else {
            data.createdBy = this.shareData.userInfo.userName;
            data.createdDate = new Date();
        }
        return data;
    }
}
