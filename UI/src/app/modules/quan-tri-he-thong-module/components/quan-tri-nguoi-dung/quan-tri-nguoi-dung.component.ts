import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AppUser} from '../../models/appuser.model';
import {iServiceBase} from '../../../compoents-customer-module/functions/iServiceBase';
import * as API from '../../../../services/apiURL';
import {Table} from 'primeng/table';
import {
    iComponentBase,
    mType
} from '../../../compoents-customer-module/functions/iComponentBase.component';
import {AppBreadcrumbService} from '../../../../app-systems/app-breadcrumb/app.breadcrumb.service';
import {ShareData} from '../../../compoents-customer-module/shared-data-services/sharedata.service';
import {AppRole} from '../../models/approle.model';
import {DomSanitizer} from "@angular/platform-browser";
import {AppResident} from '../../../quan-tri-cu-dan-module/models/app-resident.model';
import {AppEmployee} from '../../../quan-tri-nhan-vien-module/model/app-employee-template.model';

@Component({
    selector: 'app-quan-tri-nguoi-dung',
    templateUrl: './quan-tri-nguoi-dung.component.html',
    styleUrls: ['./quan-tri-nguoi-dung.component.scss'],
})

export class QuanTriNguoiDungComponent extends iComponentBase implements OnInit {

    userDialog: boolean;
    listAppUser: AppUser[] = [];
    listAppRole: AppRole[] = [];
    appUser: AppUser;
    selectedUsers: AppUser[] = [];
    selectedRoles: AppRole[] = [];
    loading: boolean;
    submitted: boolean;
    statuses: any[];
    userModel: AppUser = new AppUser();
    headerDialog: string;
    arrayAction: any[];
    userType : any;
    accountDialog: boolean;
    lstUserAccount: any;
    accountSelected: any;
    optionLabel:any;
    @ViewChild('dt') table: Table;
    lstAppResident: AppResident[] = [];
    lstAppEmployee: AppEmployee[]= [];
    lstAccountHolder : any;
    constructor(public breadcrumbService: AppBreadcrumbService,
                private shareData: ShareData,
                public messageService: MessageService,
                private confirmationService: ConfirmationService,
                private iServiceBase: iServiceBase,
                private sanitizer: DomSanitizer
    ) {
        super(messageService, breadcrumbService);
    }

    ngOnInit() {
        this.initlistActionDefault();
        this.loadAllResident();
        this.loadAllEmployee();
        this.loadAllUser();
        this.getAllRole();
    }

    initlistActionDefault() {
        this.arrayAction = [
            {name: 'Tác vụ', value: 'action'},
            {name: 'Sửa', value: 'editUser'},
            {name: 'Xóa', value: 'deleteUser'}
        ];
    }

    onCreateUser() {
        this.submitted = false;
        this.selectedRoles = [];
        this.userModel = new AppUser();
        this.userModel.active = true;
        this.userDialog = true;
    }

    onUpdateUser(user: AppUser) {
        const headerDialog = `Cập nhật người dùng: ${user.fullName}`;
        this.lstAccountHolder = user.userType == '0' ? this.lstAppEmployee : this.lstAppResident;
        this.accountSelected = user.userType == '0' ? this.lstAppEmployee.filter(c => c.employeeId == user.accountId) :
            this.lstAppResident.filter(c => c.residentId == user.accountId)
        this.optionLabel = user.userType == '0' ? 'employeeName' : 'fullName';
        this.submitted = false;
        this.accountDialog = true;
        this.userModel = Object.assign({}, user);
        this.selectedRoles = [];
        for (let i = 0; i < user.appRoles.length; i++) {
            this.selectedRoles.push(this.listAppRole.filter(val => val.id === user.appRoles[i].id)[0]);
        }
    }

    async updateUser(user) {
        const response = await this.iServiceBase.putDataAsync(API.PHAN_HE.QTHT, API.API_QTHT.UPDATE_APP_USER, user);
        if (response && response.success) {
            this.showMessage(mType.success, 'Thông báo', 'Cập nhật người dùng thành công!', 'notify');

            // load again
            await this.loadAllUser();

            this.accountDialog = false;
        } else {
            this.showMessage(mType.error, 'Thông báo', 'Cập nhật người dùng không thành công. Vui lòng xem lại!', 'notify');
        }
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
    onDeleteUser(user: AppUser, event) {
        this.confirmationService.confirm({
            target: event.target,
            message: 'Bạn có chắc muốn xoá người dùng này chứ ' + user.fullName + ' (' + user.userId + ') ' + '?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteUser(user);
            }
        });
    }

    async deleteUser(user: AppUser) {
        try {
            let param = user.userName;

            let response = await this.iServiceBase.postDataAsync(API.PHAN_HE.QTHT, API.API_QTHT.DELETE_APP_USER, param);

            if (response != '') {
                this.showMessage(mType.success, "Thông báo", "Xóa người dùng thành công!", 'notify');

                //lấy lại danh sách All Role
                this.loadAllUser();

            } else {
                this.showMessage(mType.error, "Thông báo", "Xóa người không thành công. Vui lòng xem lại!", 'notify');
            }
        } catch (e) {
            console.log(e);
        }
    }

    async deleteListUser() {
        try {
            let param = this.selectedUsers.map(o => o.id);
            let response = await this.iServiceBase.postDataAsync(API.PHAN_HE.QTHT, API.API_QTHT.DELETE_LIST_APP_USER, param, true);
            if (response) {
                this.showMessage(mType.success, "Thông báo", "Xóa người dùng thành công!", 'notify');
                this.loadAllUser();
            } else {
                this.showMessage(mType.success, "Thông báo", "Xóa người dùng không thành công. Vui lòng xem lại!", 'notify');
            }
        } catch (e) {
            console.log(e);
        }
    }

    onDeleteListUser() {
        console.log(123);
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn xóa những người dùng đã chọn ?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteListUser();
            }
        });
    }
    async isShowDialogSignup(){
        this.accountSelected = null;
        switch (this.userType)
        {
            case '0':
            {
                await this.loadAllEmployee();
                this.lstAccountHolder = this.lstAppEmployee;
                this.optionLabel = 'employeeName'
                this.accountDialog = true;
                this.userDialog = false;
                break;
            }
            case '1':
            {
                await this.loadAllResident();
                this.lstAccountHolder = this.lstAppResident;
                this.optionLabel = 'fullName';
                this.accountDialog = true;
                this.userDialog = false;
                break;
            }
        }
    }
    async loadAllUser() {
        this.listAppUser = [];
        this.selectedRoles = [];
        try {
            this.loading = true;

            const response = await this.iServiceBase.getDataAsync(API.PHAN_HE.QTHT, API.API_QTHT.GET_ALL_USER);

            if (response && response.length) {
                this.listAppUser = response;

                if (this.listAppUser && this.listAppUser.length) {
                    this.listAppUser.forEach(user => {
                        if (user.avatarImage) {
                            user.avatar = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${user.avatarImage}`);
                        }
                    });
                }
            }

            this.loading = false;
        } catch (e) {
            console.log(e);
            this.loading = false;
        }
    }
    createAcountName(){
        if(this.userType == '0')
            this.userModel.userName = this.createAccountFromFullName(this.accountSelected.employeeName,this.accountSelected.employeeId);
        if(this.userType == '1')
            this.userModel.userName = this.createAccountFromFullName(this.accountSelected.fullName,this.accountSelected.residentId);
    }
    createAccountFromFullName(fullName: string, id: number): string {
        let tenKhongDau = this.removeVietnameseTones(fullName)
        // Xử lý tên đầy đủ
        const nameParts = tenKhongDau.split(' ');
        const ten = nameParts[nameParts.length -1].toLowerCase();
        // Lấy chữ cái đầu tiên của mỗi phần tên và chuyển thành chữ thường
        const initials = nameParts.map(part => part.charAt(0).toLowerCase());

        // Kết hợp chữ cái đầu tiên và id để tạo tài khoản
        const account = `${ten}.${initials[0]}${initials[1]}${id}`;

        return account;
    }
    closeDiaglogClick() {
        this.userDialog = false;
    }
    async getAllRole() {
        this.listAppRole = [];
        try {
            this.loading = true;
            const response = await this.iServiceBase.getDataAsync(API.PHAN_HE.QTHT, API.API_QTHT.GET_ALL_ROLE);
            if (response && response.length) {
                this.listAppRole = response;
                //console.log(this.listAppRole);
            }
            this.loading = false;
        } catch (e) {
            console.log(e);
            this.loading = false;
        }
    }

    bindingDataUserModel(): AppUser {
        const result = new AppUser();
        if (this.shareData && this.shareData.userInfo) {
            result.lstRoleId = [];
            this.selectedRoles.forEach(each => {
                result.lstRoleId.push(each.id);
            });

            // update
            if (this.userModel.id && this.userModel.id > 0) {
                result.id = this.userModel.id;
                result.userId = this.userModel.userId;
                result.fullName = this.userType == '0' ? this.accountSelected.employeeName : this.accountSelected.fullName;
                result.userName = this.userModel.userName;
                result.email = this.accountSelected.email;
                result.password = this.userModel.password;
                result.confirmPassword = this.userModel.confirmPassword;
                result.phone = this.accountSelected.phoneNumber;
                result.address = this.accountSelected.address;
                result.createdBy = this.userModel.createdBy;
                result.createdDate = this.userModel.createdDate;
                result.active = this.userModel.active;
                result.lastModifiedBy = this.shareData.userInfo.userName;
                result.lastModifiedDate = new Date();
            } else {
                result.fullName = this.userType == '0' ? this.accountSelected.employeeName : this.accountSelected.fullName;
                result.userName = this.userModel.userName;
                result.email = this.accountSelected.email;
                result.password = this.userModel.password;
                result.confirmPassword = this.userModel.confirmPassword;
                result.phone = this.accountSelected.phoneNumber;
                result.address = this.accountSelected.address;
                result.active = this.userModel.active;
                result.userId = result.userName;
                result.createdBy = this.shareData.userInfo.userName;
                result.createdDate = new Date();
                result.userType = this.userType;
                result.accountId = this.userType == '0' ? this.accountSelected.employeeId : this.accountSelected.residentId;
            }
        }
        return result;
    }

    async createUser(userEnity) {
        try {
            let param = userEnity;
            let respone = await this.iServiceBase.postDataAsync(API.PHAN_HE.QTHT, API.API_QTHT.INSERT_APP_USER, param, true);
            if (respone && respone.success) {
                this.showMessage(mType.success, "Thông báo", "Thêm mới người dùng thành công!", 'notify');
                this.userDialog = false;
                this.loadAllUser();
                this.accountDialog = false;
            } else {
                this.showMessage(mType.error, "Thông báo", "Thêm mới nggưi dùng không thành công. Vui lòng xem lại!", 'notify');
            }
        } catch (e) {
            console.log(e);
        }
    }

    onSaveUser() {
        const userEnity = this.bindingDataUserModel();
        if (this.validateUserModel()) {
            if (userEnity && userEnity.id && userEnity.id > 0) {
                this.updateUser(userEnity);
            } else {
                this.createUser(userEnity);
            }
        }

    }

    onCancelUser() {
        this.accountDialog = false;
        this.submitted = false;
    }

    validateUserModel(): boolean {
        if (!this.userModel.userName || this.userModel.userName == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập tên đăng nhập!", 'notify');
            return false;
        }
        if (!this.userModel.password || this.userModel.password == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập mật khẩu!", 'notify');
            return false;
        }
        if (!this.userModel.confirmPassword || this.userModel.confirmPassword == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập lại mật khẩu!", 'notify');
            return false;
        }
        if (this.userModel.password !== this.userModel.confirmPassword) {
            this.showMessage(mType.warn, "Thông báo", "Mật khẩu không giống nhau! ", 'notify');
            return false;
        }
        if (!this.selectedRoles || this.selectedRoles.length === 0) {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa chọn phân quyền! ", 'notify');
            return false;
        }
        return true;
    }
    removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
        str = str.replace(/đ/g,"d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g," ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        return str;
    }
}


