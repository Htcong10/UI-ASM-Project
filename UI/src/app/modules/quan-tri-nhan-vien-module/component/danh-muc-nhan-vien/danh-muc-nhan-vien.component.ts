import {Component, OnInit, ViewChild} from '@angular/core';
import {AppEmployee} from '../../model/app-employee-template.model';
import {iServiceBase} from '../../../compoents-customer-module/functions/iServiceBase';
import * as API from '../../../../services/apiURL';
import {File} from '@angular/compiler-cli/src/ngtsc/file_system/testing/src/mock_file_system';
import {ShareData} from '../../../compoents-customer-module/shared-data-services/sharedata.service';
import {
    iComponentBase,
    mType
} from '../../../compoents-customer-module/functions/iComponentBase.component';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DomSanitizer} from '@angular/platform-browser';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/app-systems/app-breadcrumb/app.breadcrumb.service';
import { DatePipe } from '@angular/common';
import { AppDepartmentModel } from '../../model/app-department.model';

@Component({
    selector: 'app-danh-muc-nhan-vien',
    templateUrl: './danh-muc-nhan-vien.component.html',
    styleUrls: ['./danh-muc-nhan-vien.component.scss']
})
export class DanhMucNhanVienComponent extends iComponentBase implements OnInit {

    lstAppEmployee: AppEmployee[] = [];
    lstDepartment :  AppDepartmentModel []= [];
    selectedEmployees: AppEmployee[] = [];
    employeeDialog: boolean = false;
    headerDialog: string = '';
    lstGender: any[] = [];
    lstPosition: any[] = [];
    departmentSelected : AppDepartmentModel = new AppDepartmentModel();
    employeeModel: AppEmployee = new AppEmployee();
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
        this.onInitListNhomEmployee();
    }

    async ngOnInit() {
        this.loadAllEmployee();
    }

    async loadAllEmployee(){
        this.loading = true;
        try {
            let url = "https://localhost:44317/api/Employee/GetAllEmployee";
            let response = await this.iServiceBase.postDataAsyncTest(url,null);
            //const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.NHANVIEN, API.API_NHAN_VIEN.GET_ALL_EMPLOYEE,null);
            if (response && response.state){
               this.lstAppEmployee = response.data;
            }
            await this.loadAllDepartment();
            this.lstAppEmployee.forEach( e => {
                let phongBan = this.lstDepartment.filter(c => c.departmentId == e.departmentId);
                e.department = phongBan ? phongBan[0] : null
            })
            this.loading = false;
        }catch (e) {
            console.log('khong load dc');
        }
    }

    async loadAllDepartment(){
        try {
            this.lstDepartment = [];
            let url = "https://localhost:44317/api/Department/GetAllDepartment";
            let response = await this.iServiceBase.postDataAsyncTest(url,null);
            //const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.NHANVIEN, API.API_PHONG_BAN.GET_ALL_DEPARTMENT,null);
            if (response && response.state){
               response.data.forEach(e => {
                this.lstDepartment.push(e);
               })
            }
        }catch (e) {
            this.showMessage(mType.error, 'Thông báo', e , 'notify');
        }
    }
    onInitListNhomEmployee() {
        this.lstGender = [
            {label: 'Nam', value: 0},
            {label: 'Nữ', value: 1}
        ];
        this.lstPosition = [
            {label : 'Trưởng phòng' ,value: 'Trưởng phòng' },
            {label : 'Phó phòng' ,value: 'Phó phòng' },
            {label : 'Chuyên viên' ,value: 'Chuyên viên' },
            {label : 'Quản lý' ,value: 'Quản lý' },
            {label : 'Trưởng nhóm' ,value: 'Trưởng nhóm' }
        ]
    }

    onDisplayDialog(header: string){
        this.headerDialog = header;
        this.employeeDialog = true;
    }

    onHideDialog(){
        this.employeeModel = new AppEmployee();
        this.employeeDialog = false;
    }

     onCreateEmployee() {
        this.employeeModel = new AppEmployee();
        this.departmentSelected = null;
        this.active = true;
        this.birthday = null;
        this.submitted = false;
        this.onDisplayDialog('Thêm mới nhân viên');
    }

    async createEmployee(employee: AppEmployee){
        const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.NHANVIEN, API.API_NHAN_VIEN.ADD_EMPLOYEE, employee);
        if (response && response.state){
            this.showMessage(mType.success, 'Thông báo', 'Thêm nhân viên thành công', 'notify');
            this.loadAllEmployee();
        }else{
            this.showMessage(mType.error, 'Thông báo', 'Thêm nhân viên không thành công do lỗi' + response.Message, 'notify');
        }
    }

    onDeleteListEmployee() {
        this.confirmationService.confirm({
            message: 'Bạn có chắc muốn xoá danh sách Cư dân này chứ??',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteListEmployee();
            }
        });
    }

    async deleteListEmployee(){
        const params = this.selectedEmployees.map(b => b.employeeId);
        const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.NHANVIEN, API.API_NHAN_VIEN.DELETE_EMPLOYEE, params);
        if (response && response.state){
            this.showMessage(mType.success, 'Thông báo', 'Xoá danh sách Cư dân thành công', 'notify');
            this.loadAllEmployee();
        }else{
            this.showMessage(mType.error, 'Thông báo', 'Xoá danh sách Cư dân không thành công', 'notify');
        }
    }

    onUpdateEmployee(employee) {
        this.departmentSelected = new AppDepartmentModel();
        this.employeeModel = employee;
        this.active = this.employeeModel.status == 1 ? true : false;
        this.birthday = new Date(this.employeeModel.birthday);
        this.departmentSelected = this.lstDepartment.filter(c => c.departmentId == employee.departmentId)[0];
        this.onDisplayDialog('Chỉnh sửa nhân viên');
        this.submitted = false;
    }
    setActive(event : any){
        this.active = event.checked;
        this.employeeModel.status = event.checked ? 1 : 0;
    }
    async updateEmployee(employee: AppEmployee){
        let url = "https://localhost:44317/api/Employee/UpdateEmployeeById";
        let response = await this.iServiceBase.postDataAsyncTest(url,employee);
        //const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.NHANVIEN, API.API_NHAN_VIEN.UPDATE_EMPLOYEE, employee);
        if (response && response.state){
            this.showMessage(mType.success, 'Thông báo', 'Chỉnh sửa Cư dân thành công', 'notify');
            this.loadAllEmployee();
        }else{
            this.showMessage(mType.error, 'Thông báo', 'Chỉnh sửa Cư dân không thành công', 'notify');
        }
    }

    onDeleteEmployee(employee, event) {
        this.confirmationService.confirm({
            target: event.target,
            message: 'Bạn có chắc muốn xoá nhân viên này chứ ' + employee.fullName  + '?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteEmployee(employee);
            }
        });
    }

    async deleteEmployee(employee: AppEmployee){
        const param = employee.employeeId;
        const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.NHANVIEN, API.API_NHAN_VIEN.DELETE_EMPLOYEE, param);
        if (response && response.state){
            this.showMessage(mType.success, 'Thông báo', 'Xoá nhân viên thành công', 'notify');
            this.loadAllEmployee();
        }else{
            this.showMessage(mType.error, 'Thông báo', 'Xoá nhân viên không thành công', 'notify');
        }
    }

    onSaveEmployee() {
        if (this.validateData()){
           let result = this.onBindingData();
           if (result.employeeId && result.employeeId > 0){
               this.updateEmployee(result);
           }else{
               this.createEmployee(result);
           }
           this.onHideDialog();
        }
    }
    private onBindingData(): AppEmployee {
        let data = new AppEmployee();
        if (this.shareData && this.shareData.userInfo){
            data.employeeName = this.employeeModel.employeeName;
            data.phoneNumber = this.employeeModel.phoneNumber;
            data.email = this.employeeModel.email;
            data.status = this.active ? 1 : 0;
            data.gender = this.employeeModel.gender;
            this.birthday.setDate(this.birthday.getDate() + 1);
            data.birthday = new Date(this.birthday);
            data.address = this.employeeModel.address;
            data.departmentId = this.departmentSelected.departmentId;
            data.position = this.employeeModel.position;
            // update
            if (this.employeeModel.employeeId && this.employeeModel.employeeId > 0){
                data.employeeId = this.employeeModel.employeeId;
                data.createdBy = this.employeeModel.createdBy;
                data.createdDate = this.employeeModel.createdDate;
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
        if (!this.employeeModel.employeeName || this.employeeModel.employeeName == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập tên nhân viên!", 'notify');
            return false;
        }
        if (!this.birthday) {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập ngày sinh!", 'notify');
            return false;
        }
        if (!this.employeeModel.address || this.employeeModel.address == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập địa chỉ!", 'notify');
            return false;
        }
        if (!this.employeeModel.phoneNumber || this.employeeModel.phoneNumber == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập số điện thoại! ", 'notify');
            return false;
        }
        if (!this.employeeModel.email || this.employeeModel.email == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập emai! ", 'notify');
            return false;
        }
        if (!this.departmentSelected) {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập phòng ban! ", 'notify');
            return false;
        }
        if (this.employeeModel.gender < 0) {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập giới tính! ", 'notify');
            return false;
        }
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (re.test(this.employeeModel.email) == false) {
            this.showMessage(mType.warn, "Thông báo", "Bạn nhập email chưa đúng! ", 'notify');
            return false;
        }
        var reg = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (reg.test(this.employeeModel.phoneNumber) == false) {
            this.showMessage(mType.warn, "Thông báo", "Số điện thoại bạn nhập không đúng! ", 'notify');
            return false;
        }
        return true;
    }

    onCancelEmployee() {
        this.employeeModel = new AppEmployee();
        this.onHideDialog();
        this.submitted = false;
    }


}
