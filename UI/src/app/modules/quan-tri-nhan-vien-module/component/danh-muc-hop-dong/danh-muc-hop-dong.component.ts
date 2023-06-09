import {Component, OnInit} from '@angular/core';
import {iServiceBase} from '../../../compoents-customer-module/functions/iServiceBase';
import {iComponentBase, mType} from '../../../compoents-customer-module/functions/iComponentBase.component';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ShareData} from '../../../compoents-customer-module/shared-data-services/sharedata.service';
import * as API from '../../../../services/apiURL';
import {HttpClient} from "@angular/common/http";
import {AppContractModel} from '../../model/app-contract.model';
import {AppEmployee} from '../../model/app-employee-template.model';
import {AppDepartmentModel} from '../../model/app-department.model';

@Component({
    selector: 'app-danh-muc-hdong-nviênn',
    templateUrl: './danh-muc-hop-dong.component.html',
    styleUrls: ['./danh-muc-hop-dong.component.scss']
})
export class DanhMucHopDongComponent extends iComponentBase implements OnInit {

    selectedHDong: AppContractModel[] = [];
    lstAppEmployee: AppEmployee[] = [];
    HDongNvien: AppContractModel = new AppContractModel();
    loading: boolean;
    lstAppHDong: AppContractModel[] = [];
    headerDialog: string;
    lstDepartment : AppDepartmentModel[] = [];
    isDisplayDialog = false;
    confirmDel = false;
    selectedEmploy: any;
    selectedDepart: any;
    startDate: Date;
    endDate: Date;
    active: boolean;
    lstAppEmployeeNot : any;
    disable : boolean = false;
    constructor(private iServiceBase: iServiceBase,
                public messageService: MessageService,
                private confirmService: ConfirmationService,
                private shareData: ShareData,
                public http: HttpClient
    ) {
        super(messageService);
    }

    async ngOnInit() {
        this.loadAllHDong();
    }

    async loadAllHDong() {
        this.loading = true;
        try {
            let url = "https://localhost:44317/api/LaborContract/GetAllLaborContract";
            let response = await this.iServiceBase.postDataAsyncTest(url,null);
            //const response  = await this.iServiceBase.postDataAsync(API.PHAN_HE.TOANHA, API.API_HOP_DONG_CDAN.GET_ALL_CONTRACT,null);
            if (response && response.state) {
                this.lstAppHDong = response.data;
            }
            if(this.lstAppHDong)
            {
                await this.loadAllEmployee();
                await this.loadAllDepartment();
                this.lstAppHDong.forEach( e =>
                {
                    let nhanVien =  this.lstAppEmployee.filter(c => c.employeeId == e.employeeId)[0];
                    let phongBan =  this.lstDepartment.filter(c => c.departmentId == e.departmentId)[0];
                    e.nhanVien = nhanVien ? nhanVien : null;
                    e.phongBan = phongBan ? phongBan : null;
                })
                this.lstAppEmployeeNot = this.lstAppHDong.map(c => c.employeeId);
                this.disableOptions();
            }
            this.loading = false;
        } catch (e) {
            console.log('khong load dc');
        }
    }

    async loadAllEmployee() {
        this.loading = true;
        try {
            let url = "https://localhost:44317/api/Employee/GetAllEmployee";
            let response = await this.iServiceBase.postDataAsyncTest(url,null);
            //const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.GET_ALL_RESIDENT,null);;
            if (response && response.state) {
                this.lstAppEmployee = response.data;
            }
            this.loading = false;
        } catch (e) {
            console.log('khong load dc');
        }
    }

    async loadAllDepartment() : Promise<any>{
        this.loading = true;
        try {
            let url = "https://localhost:44317/api/Department/GetAllDepartment";
            let response = await this.iServiceBase.postDataAsyncTest(url,null);
            //const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.TOANHA, API.API_HOP_CAN_HO.GET_ALL_APARTMENT,null);
            if (response && response.state) {
                this.lstDepartment = response.data;
            }
            this.loading = false;
        } catch (e) {
            console.log('khong load dc');
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
        this.HDongNvien = new AppContractModel();
        this.isDisplayDialog = false;
    }

    onCreateHDongCDan() {
        this.HDongNvien = new AppContractModel();
        this.selectedDepart = null;
        this.selectedEmploy = null;
        this.HDongNvien.active = true;
        this.startDate = null;
        this.endDate = null;
        this.disable = false;
        this.onDisplayDialog('Thêm mới hợp đồng nhân viên');
    }

    async createUpdateApi(HdongModel: AppContractModel, type: number) {
        let url;
        let message;
        let response;
        this.loading = true;
        switch (type) {
            case 1: // insert
                url = "https://localhost:44317/api/LaborContract/AddLaborContract";
                message = 'Thêm hợp đồng nhân viên mới';
                break;
            case 2: // update
                url = "https://localhost:44317/api/LaborContract/UpdateLaborContractById";
                message = 'Chỉnh sửa hợp đồng nhân viên';
                break;
            default:
                console.error('tác vụ không có');
                break;
        }
        response = await this.iServiceBase.postDataAsyncTest(url, HdongModel);
        if (response && response.state) {
            this.showMessage(mType.success, 'Thông báo', message + ' thành công', 'notify');
            this.onHideDialog();
        } else {
            this.showMessage(mType.error, 'Thông báo', message + ' không thành công', 'notify');
        }
        this.loading = false;
        this.loadAllHDong();
    }
    setActive(event : any){
        this.active = event.checked;
        this.HDongNvien.status = event.checked ? 1 : 0;
    }
    onUpdateHDongCDan(HDongNvien: AppContractModel) {
        // parse minutes to day
        this.HDongNvien = Object.assign({}, HDongNvien);
        this.selectedDepart = HDongNvien.phongBan;
        this.selectedEmploy = HDongNvien.nhanVien;
        this.startDate = new Date(HDongNvien.startDate);
        this.endDate = new Date(HDongNvien.endDate);
        this.disable = true;
        this.onDisplayDialog('Chỉnh sửa hợp đồng nhân viên');
    }
    disableOptions(): void {
        this.lstAppEmployee.forEach(employee => {
            employee.disabled = this.lstAppEmployeeNot.includes(employee.employeeId);
        });
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

    async onDeleteHDongCDan(HDongNvien: AppContractModel) {
        this.HDongNvien = HDongNvien;
        this.confirmDelete('Bạn có chắc muốn xoá hợp đồng nhân viên này chứ?', 1);
    }

    async onDeleteListHDongCDanh() {
        this.confirmDelete('Bạn có chắc muốn xoá danh sách hợp đồng nhân viên này chứ?', 2);
    }

    async deleteHDongCDanAPI(type: number) {
        let params;
        let url;
        let message;
        switch (type) {
            case 1: // delete single
                params = this.HDongNvien.laborContractId;
                url = "https://localhost:44317/api/LaborContract/DeleteLaborContractById";
                message = 'Xoá hợp đồng nhân viên';
                break;
            case 2: // delete list
                params = this.selectedHDong.map(p => p.laborContractId);
                url = API.API_HO_GDINH.DELETE_HOUSEH;
                message = 'Xoá danh sách hợp đồng nhân viên';
                break;
            default:
                console.error('tác vụ không có ở API');
                break;
        }

        const response = await this.iServiceBase.postDataAsyncTest( url, params);
        if (response && response.state) {
            this.showMessage(mType.success, 'Thông báo', message + ' thành công', 'notify');
            this.loadAllHDong();
        } else {
            this.showMessage(mType.error, 'Thông báo', message + ' không thành công', 'notify');
        }
    }


    async onSaveHDongCDan() {
        if (this.validateData()) {
            const result = this.onBindingData();
            // type 1 insert
            if (result.laborContractId != null && result.laborContractId >= 0) {
                await this.createUpdateApi(result, 2);
            } else {
                await this.createUpdateApi(result, 1);
            }
        }
    }

    onCancelHDongCDan() {
        this.HDongNvien = new AppContractModel();
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
        if (!this.HDongNvien.salary) {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập tiền lương!", 'notify');
            return false;
        }
        if (!this.selectedEmploy) {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa chọn nhân viên!", 'notify');
            return false;
        }
        return true;
    }

    onBindingData(): AppContractModel {
        const data = new AppContractModel();
        data.salary = this.HDongNvien.salary;
        data.status = this.active ? 1 : 0;
        data.employeeId = this.selectedEmploy.employeeId;
        data.departmentId = this.selectedDepart ? this.selectedDepart.departmentId : 0;
        data.startDate = new Date(this.startDate);
        data.endDate = new Date(this.endDate);
        if (this.HDongNvien.laborContractId != null) {
            data.laborContractId = this.HDongNvien.laborContractId;
            data.createdBy = this.HDongNvien.createdBy;
            data.createdDate = this.HDongNvien.createdDate;
            data.updatedBy = this.shareData.userInfo.userName;
            data.updatedDate = new Date();
        } else {
            data.createdBy = this.shareData.userInfo.userName;
            data.createdDate = new Date();
        }
        return data;
    }
}
