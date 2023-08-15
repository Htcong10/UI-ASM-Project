import { Component, OnInit } from '@angular/core';
import { AppDepartmentModel }  from '../../model/app-department.model';
import { iServiceBase } from '../../../compoents-customer-module/functions/iServiceBase';
import { iComponentBase, mType } from '../../../compoents-customer-module/functions/iComponentBase.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as API from '../../../../services/apiURL';
import { ShareData } from '../../../compoents-customer-module/shared-data-services/sharedata.service';
import { AppEmployee } from '../../model/app-employee-template.model';


@Component({
    selector: 'app-danh-muc-phong-ban',
    templateUrl: './danh-muc-phong-ban.component.html',
    styleUrls: ['./danh-muc-phong-ban.component.scss']
})
export class DanhMucPhongBanComponent extends iComponentBase implements OnInit {

    lstDepartment: any[] = [];
    lstDepartmentGroup: any[] = [];
    selectedDepartment: AppDepartmentModel[] = [];
    Department: AppDepartmentModel = new AppDepartmentModel();
    loading: boolean;
    lstAppEmployee: AppEmployee[] = [];
    headerDialog: string;
    isDisplayDialog = false;
    confirmDel = false;
    selectedMembers: any;
    hostName: any;
    active: boolean;
    constructor(private iServiceBase: iServiceBase,
        public messageService: MessageService,
        private confirmService: ConfirmationService,
        private shareData: ShareData,
    ) {
        super(messageService);
    }

    async ngOnInit() {
        await this.loadAllDepartment();
        await this.loadAllEmployee();
        this.loadMember();
    }

    async loadAllEmployee() {
        this.loading = true;
        try {
           /* let url = "https://localhost:7052/api/Employee/GetAllEmployee";
            let response = await this.iServiceBase.postDataAsyncTest(url,null);*/
            const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.NHANVIEN, API.API_NHAN_VIEN.GET_ALL_EMPLOYEE, null);
            if (response && response.state) {
                this.lstAppEmployee = response.data;
            }
            this.loading = false;
        } catch (e) {
            console.log('khong load dc');
        }
    }
    async loadAllDepartment() {
        this.lstDepartment = [];
        this.loading = true;
        try {
            /*let url = "https://localhost:7052/api/Department/GetAllDepartment";
            let response = await this.iServiceBase.postDataAsyncTest(url,null);*/
            const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.NHANVIEN, API.API_PHONG_BAN.GET_ALL_DEPARTMENT, null);
            if (response && response.state) {
                this.lstDepartment = response.data
            }
        } catch (e) {
            console.log('khong load duoc data');
        }
        this.loading = false;
    }
    loadMember() {
        this.lstDepartmentGroup = [];
        if (this.lstDepartment) {
            this.lstDepartment.forEach(e => {
                if (e.memberId) {
                    this.lstDepartmentGroup.push({
                        ...e,
                        thanhVien: this.lstAppEmployee.filter(c => e.memberId.includes(c.employeeId.toString()))
                    })
                }
                else {
                    this.lstDepartmentGroup.push({
                        ...e,
                        thanhVien: []
                    })
                }
            })
        }
    }
    onInitDepartmentType() {
        this.lstDepartmentGroup = [
            { label: 'Bảo hiểm sinh tử', value: '0' },
            { label: 'Bảo hiểm từ kỳ', value: '1' },
            { label: 'Bảo hiểm hưu trí', value: '2' },
        ];
    }

    onDisplayDialog(header: string) {
        this.headerDialog = header;
        this.isDisplayDialog = true;
    }

    onHideDialog() {
        this.Department = new AppDepartmentModel();
        this.isDisplayDialog = false;
    }

    onCreateDepartment() {
        this.Department = new AppDepartmentModel();
        this.hostName = null;
        this.selectedMembers = null;
        this.Department.active = true;
        this.onDisplayDialog('Thêm mới phòng ban');
    }

    async createUpdateApi(DepartmentModel: AppDepartmentModel, type: number) {
        let url;
        let message;
        let response;
        switch (type) {
            case 1: // insert
                url = API.API_PHONG_BAN.ADD_DEPARTMENT
                message = 'Thêm phòng ban mới';
                response = await this.iServiceBase.postDataAsync(API.PHAN_HE.NHANVIEN,url,DepartmentModel);
               // response = await this.iServiceBase.postDataAsync(API.PHAN_HE.NHANVIEN, url, DepartmentModel);
                break;
            case 2: // update
                url = API.API_PHONG_BAN.UPDATE_DEPARTMENT;
                message = 'Chỉnh sửa phòng ban';
                //response = await this.iServiceBase.postDataAsyncTest(url,DepartmentModel);
                response = await this.updateAll(DepartmentModel);
                break;
            default:
                console.error('tác vụ không có');
                break;
        }
        if (response && response.state) {
            this.showMessage(mType.success, 'Thông báo', message + ' thành công', 'notify');
            this.onHideDialog();
            await this.loadAllDepartment();
            await this.loadAllEmployee();
            this.loadMember();
        } else {
            this.showMessage(mType.error, 'Thông báo', message + ' không thành công', 'notify');
        }
    }
    async updateAll(DepartmentModel: AppDepartmentModel) {
        try {
            let lstmemId = DepartmentModel.memberId ? DepartmentModel.memberId.split(',') : [];
            let departex = this.lstDepartment.filter(c => {
                const memIds = c.memberId ? c.memberId.split(',') : [];
                return lstmemId.some(str => memIds.includes(str)) && c.departmentId != DepartmentModel.departmentId;
            });
            departex.forEach(e => {
                let numMem = e.memberId.split(',');
                e.memberId = numMem.filter(char => !lstmemId.includes(char))
                    .join(',');
                e.numberEmploy = e.memberId.length;
                if (e.memberId.length == 0) {
                    e.managerName = null;
                }
                else {
                    e.managerName = this.lstAppEmployee.filter(c => e.memberId.includes(c.employeeId.toString()))[0].employeeName
                }
            });
            departex.push(DepartmentModel);
            //let url = "https://localhost:7052/api/Department/UpdateDepartmentByListId";
            const responseDepart = await this.iServiceBase.postDataAsync(API.PHAN_HE.NHANVIEN,API.API_PHONG_BAN.UPDATE_LIST_DEPARTMENT,departex);
            //const responseHouse = await this.iServiceBase.postDataAsync(API.PHAN_HE.NHANVIEN, API.API_PHONG_BAN.UPDATE_LIST_DEPARTMENT, hoGdinhex);
            return responseDepart;
        }
        catch (e) {
            console.log(e)
        }
    }
    onUpdateDepartment(Department: AppDepartmentModel) {
        // parse minutes to day
        this.Department = Object.assign({}, Department);
        this.selectedMembers = this.lstAppEmployee.filter(c => c.departmentId == Department.departmentId);
        this.hostName = this.selectedMembers.filter(c => c.employeeName == Department.managerName)[0];
        this.active = Department.status == 1 ? true : false;
        this.onDisplayDialog('Chỉnh sửa phòng ban');
    }

    async confirmDelete(messConfirm: string, type: number) {
        this.confirmService.confirm({
            message: messConfirm,
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteDepartmentAPI(type);
            }
        });
    }

    setActive(event: any) {
        this.active = event.checked;
        this.Department.status = event.checked ? 1 : 0;
    }
    async onDeleteDepartment(Department: AppDepartmentModel) {
        this.Department = Department;
        this.confirmDelete('Bạn có chắc muốn xoá phòng ban này chứ?', 1);
    }

    async onDeleteListDepartment() {
        this.confirmDelete('Bạn có chắc muốn xoá danh sách phòng ban này chứ?', 2);
    }

    async deleteDepartmentAPI(type: number) {
        let params;
        let url;
        let message;
        switch (type) {
            case 1: // delete single
                params = this.Department.departmentId;
                url = API.API_PHONG_BAN.DELETE_DEPARTMENT;
                message = 'Xoá phòng ban';
                break;
            case 2: // delete list
                params = this.selectedDepartment.map(p => p.departmentId);
                url = API.API_PHONG_BAN.DELETE_DEPARTMENT;
                message = 'Xoá danh sách phòng ban';
                break;
            default:
                console.error('tác vụ không có ở API');
                break;
        }

        const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.NHANVIEN, url, params);
        if (response && response.state) {
            this.showMessage(mType.success, 'Thông báo', message + ' thành công', 'notify');
            await this.loadAllDepartment();
            await this.loadAllEmployee();
            this.loadMember();
        } else {
            this.showMessage(mType.error, 'Thông báo', message + ' không thành công', 'notify');
        }
    }


    async onSaveDepartment() {
        if (this.validateData()) {
            const result = this.onBindingData();
            // type 1 insert
            if (result.departmentId && result.departmentId > 0) {
                await this.createUpdateApi(result, 2);
            } else {
                await this.createUpdateApi(result, 1);
            }
        }
    }

    onCancelDepartment() {
        this.Department = new AppDepartmentModel();
        this.onHideDialog();
    }

    private validateData(): boolean {
        if (!this.Department.departmentName || this.Department.departmentName == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập tên hộ!", 'notify');
            return false;
        }
        if (!this.selectedDepartment || this.selectedDepartment.length > 0) {
            if (!this.hostName || this.hostName == '') {
                this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập tên chủ hộ!", 'notify');
                return false;
            }
        }
        return true;
    }

    onBindingData(): AppDepartmentModel {
        const data = new AppDepartmentModel();
        data.departmentName = this.Department.departmentName;
        data.numberEmploy = this.selectedMembers ? this.selectedMembers.length : 0;
        data.memberId = this.selectedMembers ? this.selectedMembers.map(e => e.employeeId).join(',') : "";
        data.managerName = this.hostName ? this.hostName.employeeName : "";
        data.email = this.Department.email;
        data.status = this.active ? 1 : 0;
        data.descript = this.Department.descript;
        data.departmenAdress = this.Department.departmenAdress
        if (this.Department.departmentId) {
            data.departmentId = this.Department.departmentId;
            data.createdBy = this.Department.createdBy;
            data.createdDate = this.Department.createdDate;
            data.updatedBy = this.shareData.userInfo.userName;
            data.updatedDate = new Date();
        }
        else {
            data.createdBy = this.shareData.userInfo.userName;
            data.createdDate = new Date();
        }
        return data;
    }
}


