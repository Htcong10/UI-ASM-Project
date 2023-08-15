import { Component, OnInit } from '@angular/core';
import { AppHoGDinhModel } from '../../models/app-hogdinh.model';
import { iServiceBase } from '../../../compoents-customer-module/functions/iServiceBase';
import { iComponentBase, mType } from '../../../compoents-customer-module/functions/iComponentBase.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as API from '../../../../services/apiURL';
import { ShareData } from '../../../compoents-customer-module/shared-data-services/sharedata.service';
import { AppResident } from '../../models/app-resident.model';

@Component({
    selector: 'app-danh-muc-goi-cuoc',
    templateUrl: './danh-muc-ho-gdinh.component.html',
    styleUrls: ['./danh-muc-ho-gdinh.component.scss']
})
export class DanhMucHoGdinhComponent extends iComponentBase implements OnInit {
    lstHoGDinh: AppHoGDinhModel[] = [];
    selectedHoGDinh: AppHoGDinhModel[] = [];
    HoGDinh: AppHoGDinhModel = new AppHoGDinhModel();
    loading: boolean;
    lstAppResident: AppResident[] = [];
    headerDialog: string;
    isDisplayDialog = false;
    confirmDel = false;
    selectedMembers: any;
    hostName: any;
    constructor(private iServiceBase: iServiceBase,
        public messageService: MessageService,
        private confirmService: ConfirmationService,
        private shareData: ShareData,
    ) {
        super(messageService);
    }

    async ngOnInit() {
        this.loadMember();
    }

    async loadAllResident() {
        this.loading = true;
        try {
            /*let url = "https://localhost:7289/api/Resident/GetAllResident";
            let response = await this.iServiceBase.postDataAsyncTest(url,null);*/
            const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.GET_ALL_RESIDENT, null);
            if (response && response.state) {
                this.lstAppResident = response.data;
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
            const response = await this.iServiceBase.postData(API.PHAN_HE.CUDAN, API.API_HO_GDINH.GET_ALL_HOUSEH, null).toPromise();
            if (response && response.state) {
                this.lstHoGDinh = response.data
            }
        } catch (e) {
            console.log('khong load duoc data');
        }
        this.loading = false;
    }
    async loadMember() {
        await this.loadAllHoGDinh();
        await this.loadAllResident();
        if (this.lstHoGDinh) {
            this.lstHoGDinh.forEach(e => {
                e.thanhvien = this.lstAppResident.filter(c => e.memberId.includes(c.residentId.toString()))
            })
        }
    }

    onDisplayDialog(header: string) {
        this.headerDialog = header;
        this.isDisplayDialog = true;
    }

    onHideDialog() {
        this.HoGDinh = new AppHoGDinhModel();
        this.isDisplayDialog = false;
    }

    onCreateHoGDinh() {
        this.HoGDinh = new AppHoGDinhModel();
        this.hostName = null;
        this.selectedMembers = null;
        this.HoGDinh.active = true;
        this.onDisplayDialog('Thêm mới hộ gia đình');
    }

    async createUpdateApi(HoGDinhModel: AppHoGDinhModel, type: number) {
        let url;
        let message;
        let response;
        this.loading = true;
        switch (type) {
            case 1: // insert
                url = API.API_HO_GDINH.ADD_HOUSEH;
                message = 'Thêm hộ gia đình mới';
                response = await this.iServiceBase.postData(API.PHAN_HE.CUDAN, url, HoGDinhModel).toPromise();
                break;
            case 2: // update
                message = 'Chỉnh sửa hộ gia đình';
                response = await this.updateAllHo(HoGDinhModel);
                break;
            default:
                console.error('tác vụ không có');
                break;
        }
        if (response && response.state) {
            // //cập nhật lại cho cư dân
            // let lstmemId = HoGDinhModel.memberId.split(',');
            // let lstResident = this.lstAppResident.filter(function (e) {
            //     return lstmemId.indexOf(e.residentId.toString()) > -1;
            // });
            // lstResident.forEach(e => e.householdId = HoGDinhModel.householdId)
            // const responseResident = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.UPDATE_LIST_RESIDENT, lstResident);
            this.showMessage(mType.success, 'Thông báo', message + ' thành công', 'notify');
            this.onHideDialog();
        }
        else {
            this.showMessage(mType.error, 'Thông báo', message + ' không thành công', 'notify');
        }
        this.loading = false;
        this.loadMember();
    }

    async updateAllHo(HoGDinhModel: AppHoGDinhModel) {
        //cập nhật lại cho hộ khác
        try {
            let lstmemId = HoGDinhModel.memberId ? HoGDinhModel.memberId.split(',') : [];
            let hoGdinhex = this.lstHoGDinh.filter(c => {
                const memIds = c.memberId ? c.memberId.split(',') : [];
                return lstmemId.some(str => memIds.includes(str)) && c.householdId != HoGDinhModel.householdId;
            });
            hoGdinhex.forEach(e => {
                let numMem = e.memberId.split(',');
                e.memberId = numMem.filter(char => !lstmemId.includes(char))
                    .join(',');
                e.numMember = e.memberId.length == 0 ? 0 : e.memberId.split(',').length;
                if (e.memberId.length == 0) {
                    e.hostName = null;
                }
                else {
                    let lstCudan = this.lstAppResident.filter(c => e.memberId.split(',').includes(c.residentId.toString()))
                    e.hostName = lstCudan[0].fullName
                }
            });
            hoGdinhex.push(HoGDinhModel);
            //let url = 'https://localhost:7289/api/HouseHold/UpdateHouseByListId'
            const responseHouse = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_HO_GDINH.UPDATE_LIST_HOUSEH, hoGdinhex);
            //const responseHouse = await this.iServiceBase.postDataAsync(url, hoGdinhex).toPromise();
            return responseHouse;
        }
        catch (e) {
            console.log(e)
        }
    }
    onUpdateHoGDinh(HoGDinh: AppHoGDinhModel) {
        // parse minutes to day
        this.HoGDinh = Object.assign({}, HoGDinh);
        this.selectedMembers = HoGDinh.thanhvien;
        this.hostName = this.selectedMembers.filter(c => c.fullName == HoGDinh.hostName)[0];
        this.onDisplayDialog('Chỉnh sửa hộ gia đình');
    }

    async confirmDelete(messConfirm: string, type: number) {
        this.confirmService.confirm({
            message: messConfirm,
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteHoGDinhAPI(type);
            }
        });
    }

    async onDeleteHoGDinh(HoGDinh: AppHoGDinhModel) {
        this.HoGDinh = HoGDinh;
        this.confirmDelete('Bạn có chắc muốn xoá hộ gia đình này chứ?', 1);
    }

    async onDeleteListHoGDinh() {
        this.confirmDelete('Bạn có chắc muốn xoá danh sách hộ gia đình này chứ?', 2);
    }

    async deleteHoGDinhAPI(type: number) {
        let params;
        let url;
        let message;
        switch (type) {
            case 1: // delete single
                params = this.HoGDinh.householdId;
                url = API.API_HO_GDINH.DELETE_HOUSEH;
                message = 'Xoá hộ gia đình';
                break;
            case 2: // delete list
                params = this.selectedHoGDinh.map(p => p.householdId);
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


    async onSaveHoGDinh() {
        if (this.validateData()) {
            const result = this.onBindingData();
            // type 1 insert
            if (result.householdId && result.householdId > 0) {
                await this.createUpdateApi(result, 2);
            } else {
                await this.createUpdateApi(result, 1);
            }
        }
    }

    onCancelHoGDinh() {
        this.HoGDinh = new AppHoGDinhModel();
        this.onHideDialog();
    }

    private validateData(): boolean {
        if (!this.HoGDinh.householdName || this.HoGDinh.householdName == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập tên hộ!", 'notify');
            return false;
        }
        if (!this.HoGDinh.location) {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập địa chỉ!", 'notify');
            return false;
        }
        if (!this.selectedHoGDinh || this.selectedHoGDinh.length > 0) {
            if (!this.hostName || this.hostName == '') {
                this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập tên chủ hộ!", 'notify');
                return false;
            }
        }
        return true;
    }

    onBindingData(): AppHoGDinhModel {
        const data = new AppHoGDinhModel();
        data.householdName = this.HoGDinh.householdName;
        data.numMember = this.selectedMembers ? this.selectedMembers.length : 0;
        data.memberId = this.selectedMembers ? this.selectedMembers.map(e => e.residentId).join(',') : "";
        data.hostName = this.hostName.fullName;
        data.location = this.HoGDinh.location;
        if (this.HoGDinh.householdId) {
            data.householdId = this.HoGDinh.householdId
        }
        return data;
    }
}
