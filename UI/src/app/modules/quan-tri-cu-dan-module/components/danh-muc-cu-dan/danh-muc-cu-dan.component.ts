import {Component, OnInit, ViewChild} from '@angular/core';
import {AppResident} from '../../models/app-resident.model';
import {Table} from 'primeng/table';
import {AppBreadcrumbService} from '../../../../app-systems/app-breadcrumb/app.breadcrumb.service';
import {iComponentBase, iServiceBase, mType, ShareData} from 'src/app/modules/compoents-customer-module/components-customer';
import {ConfirmationService, MessageService} from 'primeng/api';
import * as API from '../../../../services/apiURL';
import { AppHoGDinhModel } from '../../models/app-hogdinh.model';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-danh-muc-ngan-hang',
    templateUrl: './danh-muc-cu-dan.component.html',
    styleUrls: ['./danh-muc-cu-dan.component.scss']
})
export class DanhMucCuDanComponent extends iComponentBase implements OnInit {
    lstAppResident: AppResident[] = [];
    lstHouseHold :  AppHoGDinhModel []= [];
    selectedResidents: AppResident[] = [];
    residentDialog: boolean = false;
    headerDialog: string = '';
    lstGender: any[] = [];
    householdSelected : AppHoGDinhModel = new AppHoGDinhModel();
    residentModel: AppResident = new AppResident();
    loading: boolean;
    submitted: boolean;
    birthday: Date;
    active: boolean;
    @ViewChild('dt') table: Table;

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
        this.loadAllResident();
        await this.loadAllHouseHold();
    }

    async loadAllResident(){
        this.loading = true;
        try {
            /*let url = "https://localhost:7289/api/Resident/GetAllResident";
            let response = await this.iServiceBase.postDataAsyncTest(url,null);*/
            const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.GET_ALL_RESIDENT,null);
            if (response && response.state){
               this.lstAppResident = response.data;
            }
            this.loading = false;
        }catch (e) {
            console.log('khong load dc');
        }
    }

    async loadAllHouseHold(){
        try {
            this.lstHouseHold = [];
           /* let url = "https://localhost:7289/api/HouseHold/GetAllHouse";
            let response = await this.iServiceBase.postDataAsyncTest(url,null);*/
            const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_HO_GDINH.GET_ALL_HOUSEH,null);
            if (response && response.state){
               response.data.forEach(e => {
                this.lstHouseHold.push(e);
               })
            }
        }catch (e) {
            this.showMessage(mType.error, 'Thông báo', e , 'notify');
        }
    }
    onInitListNhomResident() {
        this.lstGender = [
            {label: 'Nam', value: 0},
            {label: 'Nữ', value: 1}
        ];

    }

    onDisplayDialog(header: string){
        this.headerDialog = header;
        this.residentDialog = true;
    }

    onHideDialog(){
        this.residentModel = new AppResident();
        this.residentDialog = false;
    }

     onCreateResident() {
        this.residentModel = new AppResident();
        this.householdSelected = null;
        this.active = true;
        this.birthday = null;
        this.submitted = false;
        this.onDisplayDialog('Thêm mới cư dân');
    }

    async createResident(resident: AppResident){
        const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.ADD_RESIDENT, resident);
        if (response && response.state){
            this.showMessage(mType.success, 'Thông báo', 'Thêm cư dân thành công', 'notify');
            this.loadAllResident();
        }else{
            this.showMessage(mType.error, 'Thông báo', 'Thêm cư dân không thành công do lỗi' + response.Message, 'notify');
        }
    }

    onDeleteListResident() {
        this.confirmationService.confirm({
            message: 'Bạn có chắc muốn xoá danh sách Cư dân này chứ??',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteListResident();
            }
        });
    }

    async deleteListResident(){
        const params = this.selectedResidents.map(b => b.residentId);
        const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.DELETE_RESIDENT, params);
        if (response && response.state){
            this.showMessage(mType.success, 'Thông báo', 'Xoá danh sách Cư dân thành công', 'notify');
            this.loadAllResident();
        }else{
            this.showMessage(mType.error, 'Thông báo', 'Xoá danh sách Cư dân không thành công', 'notify');
        }
    }

    onUpdateResident(resident) {
        this.householdSelected = new AppHoGDinhModel();
        this.residentModel = resident;
        this.active = this.residentModel.status == 1 ? true : false;
        this.birthday = new Date(this.residentModel.birthday);
        this.householdSelected = this.lstHouseHold.filter(c => c.householdId == resident.householdId)[0];
        this.onDisplayDialog('Chỉnh sửa cư dân');
        this.submitted = false;
    }
    setActive(event : any){
        this.active = event.checked;
        this.residentModel.status = event.checked ? 1 : 0;
    }
    async updateResident(resident: AppResident){
        const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.UPDATE_RESIDENT, resident);
        if (response && response.state){
            this.showMessage(mType.success, 'Thông báo', 'Chỉnh sửa Cư dân thành công', 'notify');
            this.loadAllResident();
        }else{
            this.showMessage(mType.error, 'Thông báo', 'Chỉnh sửa Cư dân không thành công', 'notify');
        }
    }

    onDeleteResident(resident, event) {
        this.confirmationService.confirm({
            target: event.target,
            message: 'Bạn có chắc muốn xoá cư dân này chứ ' + resident.fullName  + '?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteResident(resident);
            }
        });
    }

    async deleteResident(resident: AppResident){
        const param = resident.residentId;
        const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.DELETE_RESIDENT, param);
        if (response && response.state){
            this.showMessage(mType.success, 'Thông báo', 'Xoá cư dân thành công', 'notify');
            this.loadAllResident();
        }else{
            this.showMessage(mType.error, 'Thông báo', 'Xoá cư dân không thành công', 'notify');
        }
    }

    onSaveResident() {
        if (this.validateData()){
           let result = this.onBindingData();
           if (result.residentId && result.residentId > 0){
               this.updateResident(result);
           }else{
               this.createResident(result);
           }
           this.onHideDialog();
        }
    }
    private onBindingData(): AppResident {
        let data = new AppResident();
        if (this.shareData && this.shareData.userInfo){
            data.fullName = this.residentModel.fullName;
            data.phoneNumber = this.residentModel.phoneNumber;
            data.email = this.residentModel.email;
            data.status = this.active ? 1 : 0;
            data.gender = this.residentModel.gender;
            this.birthday.setDate(this.birthday.getDate() + 1);
            data.birthday = new Date(this.birthday);
            data.address = this.residentModel.address;
            data.householdId = this.householdSelected.householdId;
            // update
            if (this.residentModel.residentId && this.residentModel.residentId > 0){
                data.residentId = this.residentModel.residentId;
                data.createdBy = this.residentModel.createdBy;
                data.createdDate = this.residentModel.createdDate;
                data.updatedBy = this.shareData.userInfo.userName;
                data.updatedDate = new Date();
            }else{
                data.createdBy = this.shareData.userInfo.userName;
                data.createdDate = new Date();
            }
        }
        return data;
    }

    private validateData() {
        if (!this.residentModel.fullName || this.residentModel.fullName == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập tên cư dân!", 'notify');
            return false;
        }
        if (!this.birthday) {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập ngày sinh!", 'notify');
            return false;
        }
        if (!this.residentModel.address || this.residentModel.address == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập địa chỉ!", 'notify');
            return false;
        }
        if (!this.residentModel.phoneNumber || this.residentModel.phoneNumber == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập số điện thoại! ", 'notify');
            return false;
        }
        if (!this.residentModel.email || this.residentModel.email == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập emai! ", 'notify');
            return false;
        }
        if (this.residentModel.gender < 0) {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập giới tính! ", 'notify');
            return false;
        }
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (re.test(this.residentModel.email) == false) {
            this.showMessage(mType.warn, "Thông báo", "Bạn nhập email chưa đúng! ", 'notify');
            return false;
        }
        var reg = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (reg.test(this.residentModel.phoneNumber) == false) {
            this.showMessage(mType.warn, "Thông báo", "Số điện thoại bạn nhập không đúng! ", 'notify');
            return false;
        }
        return true;
    }

    onCancelResident() {
        this.residentModel = new AppResident();
        this.onHideDialog();
        this.submitted = false;
    }

}
