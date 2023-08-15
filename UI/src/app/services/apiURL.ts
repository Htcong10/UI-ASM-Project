// tslint:disable
export class PHAN_HE {

    public static USER = "User";
    public static ROLE = "Role";
    public static CUDAN = "CuDan";
    public static NHANVIEN = "NhanVien";
    public static TOANHA = "ToaNha"
    public static QTHT = "QTHT";
    public static SMSEMAIL = "smsemail";
    public static DANHMUC = "DanhMuc"
}

// Service User
export class API_USER {
    public static SIGNIN = "signin";
    public static GET_INFO_CURRENT_USER = "getInfoCurrentUser";
    public static REGISTER = "register";
    public static CHECK_EMAIL = "checkEmail"
    public static FORGOT_PASSWORD = "forgotPassword"
    public static REFRESH = "refresh"
}

// Service Role
export class API_ROLE {
    public static GET_DVI_QLY = "getDviqly";
}

// Service Danh Mục
export class API_DANH_MUC {
    public static GET_DVI_QLY = "getDviqly";

    public static GET_ALL_INVOICE_TEMPLATE = "getAllInvoiceTemplate";
    public static INSERT_INVOICE_TEMPLATE = "insertAppInvoiceTemplate";
    public static UPDATE_INVOICE_TEMPLATE = "updateAppInvoiceTemplate";
    public static DELETE_INVOICE_TEMPLATE = "deleteAppInvoiceTemplate";
    public static DELETE_LIST_INVOICE_TEMPLATE = "deleteListAppInvoiceTemplate";
    public static GET_VIEW_INVOICE_TEMPLATE = "getViewInvoiceTemplate";

    public static GET_ALL_SMS_EMAIL_TEMPLATE = "getAllSmsEmailTemplate";
    public static INSERT_SMS_EMAIL_TEMPLATE = "insertAppSmsEmailTemplate";
    public static UPDATE_SMS_EMAIL_TEMPLATE = "updateAppSmsEmailTemplate";
    public static DELETE_SMS_EMAIL_TEMPLATE = "deleteAppSmsEmailTemplate";
    public static DELETE_LIST_SMS_EMAIL_TEMPLATE = "deleteListAppSmsEmailTemplate";
    public static GET_VIEW_SMS_EMAIL_TEMPLATE = "getViewSmsEmailTemplate";

    public static HOUSE_HOLD = "HouseHold";
    public static RESIDENT = "Resident";
    public static RESIDENTOPINIONS = "ResidentOpinion";
    public static RESIDENTREQUIRE = "ResidentRequire";

    public static GET_ALL_APP_PACKAGE = "getAllPackage";
    public static INSERT_APP_PACKAGE = "insertAppPackage";
    public static UPDATE_APP_PACKAGE = "updateAppPackage";
    public static DELETE_APP_PACKAGE = "deleteAppPackage";
    public static DELETE_LIST_APP_PACKAGE = "deleteListAppPackage";
}

// Service QTHT
export class API_QTHT {
    public static GET_ALL_ROLE = "getAllRole";
    public static GET_ALL_MENU = "getAllMenu";
    public static INSERT_APP_ROLE = "insertAppRole";
    public static UPDATE_APP_ROLE = "updateAppRole";
    public static DELETE_APP_ROLE = "deleteAppRole";
    public static DELETE_LIST_APP_ROLE = "deleteListAppRole";
    public static INSERT_APP_MENU = "insertAppMenu";
    public static UPDATE_APP_MENU = "updateAppMenu";
    public static DELETE_APP_MENU = "deleteAppMenu";
    public static DELETE_LIST_APP_MENU = "deleteListAppMenu";
    public static GET_ALL_USER = "getAllUser";
    public static INSERT_APP_USER = "insertAppUser";
    public static UPDATE_APP_USER = "updateAppUser";
    public static DELETE_APP_USER = "deleteAppUser";
    public static DELETE_LIST_APP_USER = "deleteListAppUser";
    public static CHANGE_PASSWORD = "changePassword";

}

// Service Danh Mục
export class API_CU_DAN {

    public static GET_ALL_RESIDENT = "Resident/GetAllResident";
    public static ADD_RESIDENT = "Resident/AddResident";
    public static DELETE_RESIDENT = "Resident/DeleteResidentById";
    public static UPDATE_RESIDENT = "Resident/UpdateResidentById";
    public static UPDATE_LIST_RESIDENT = "Resident/UpdateResidentByListId";
    public static GET_RESIDENT_BY_ID = "Resident/GetResidentById";
    public static GET_RESIDENT_BY_HOUSE = "Resident/GetResidentByHouseId";
    public static GET_REQUIRE_BY_RESIDENT = "ResidentRequire/GetListByResidentId"

}
export class API_HO_GDINH {

    public static GET_ALL_HOUSEH = "HouseHold/GetAllHouse";
    public static ADD_HOUSEH = "HouseHold/AddHouse";
    public static DELETE_HOUSEH = "HouseHold/DeleteHouseById";
    public static UPDATE_HOUSEH = "HouseHold/UpdateHouseById";
    public static UPDATE_LIST_HOUSEH = "HouseHold/UpdateHouseByListId";
    public static GET_HOUSEH_BY_RESIDENTID = "HouseHold/GetListHouseByResident";
}
export class API_NHAN_VIEN {

    public static GET_ALL_EMPLOYEE = "Employee/GetAllEmployee";
    public static ADD_EMPLOYEE = "Employee/AddEmployee";
    public static DELETE_EMPLOYEE = "Employee/DeleteEmployeeById";
    public static UPDATE_EMPLOYEE = "Employee/UpdateEmployeeById";
    public static UPDATE_LIST_EMPLOYEE = "Employee/UpdateHouseByListId";
    public static GET_EMPLOYEE_BY_DEPARTID = "Employee/GetListEmployeeByParam";
}
export class API_PHONG_BAN {

    public static GET_ALL_DEPARTMENT = "Department/GetAllDepartment";
    public static ADD_DEPARTMENT = "Department/AddDepartment";
    public static DELETE_DEPARTMENT = "Department/DeleteDepartmentById";
    public static UPDATE_DEPARTMENT = "Department/UpdateDepartmentById";
    public static UPDATE_LIST_DEPARTMENT = "Department/UpdateDepartmentByListId";
    public static GET_DEPARTMENT_BY_EMPLOYID = "Department/GetListDepartmentByParam";
}
export class API_HOP_DONG_CDAN {

    public static GET_ALL_CONTRACT = "Contract/GetAllContract";
    public static ADD_CONTRACT = "Contract/AddContract";
    public static DELETE_CONTRACT = "Contract/DeleteContractById";
    public static UPDATE_CONTRACT = "Contract/UpdateContractById";
    public static GET_CONTRACT_BY_PARAMID = "Contract/GetListContractByParam";
}
export class API_HOP_DONG_NVIEN {

    public static GET_ALL_LABOR_CONTRACT = "Nhanvien/GetAllLaborContract";
    public static ADD_LABOR_CONTRACT = "Nhanvien/AddLaborContract";
    public static DELETE_LABOR_CONTRACT = "Nhanvien/DeleteLaborContractById";
    public static UPDATE_LABOR_CONTRACT = "Nhanvien/UpdateLaborContractById";
    public static GET_LABOR_CONTRACT_BY_PARAMID = "Nhanvien/GetListLaborContractByParam";
}
export class API_THONG_BAO {

    public static GET_ALL_NOTIFICATION = "Notification/GetAllNotifications";
    public static ADD_NOTIFICATION = "Notification/AddNotification";
    public static DELETE_NOTIFICATION = "Notification/DeleteNotificationById";
    public static UPDATE_NOTIFICATION = "Notification/UpdateNotificationById";
    public static GET_NOTIFICATION_BY_PARAMID = "Notification/GetListNotificationsByParam"
    public static GET_MULTI_NOTIFICATION = "Notification/GetMultiNotifications"

}
export class API_HOP_CAN_HO {

    public static GET_ALL_APARTMENT = "Apartment/GetAllApartment";
    public static ADD_APARTMENT = "Apartment/AddApartment";
    public static DELETE_APARTMENT = "Apartment/DeleteApartmentById";
    public static UPDATE_APARTMENT= "Apartment/UpdateApartmentById";
    public static GET_APARTMENT_BY_PARAMID = "Apartment/GetListApartmentByParam";
    public static UPLOAD_FILE = "Apartment/UploadFile";
}
export class API_HOP_YEU_CAU_CDAN {

    public static GET_ALL_REQUIRE = "ResidentRequire/AddRequire";
    public static ADD_REQUIRE = "ResidentRequire/GetAllRequire";
    public static DELETE_REQUIRE = "ResidentRequire/DeleteRequireById";
    public static UPDATE_REQUIRE= "ResidentRequire/UpdateRequireById";
    public static GET_REQUIRE_BY_RESIDENTID = "ResidentRequire/GetListByResidentId";
    public static UPLOAD_FILE = "ResidentRequire/UploadFile";
    public static GET_BASE64 = "ResidentRequire/getBase64File"
}
export class SERVICE_GATEWAY {
    public static USER = "ServiceReport-Report-context-root/resources/serviceReport/";
    public static ROLE = "ServiceCommon-busCommon-context-root/resources/sercommon/";
    public static DANHMUC = "ServiceDichVu-DichVu-context-root/resources/serviceDichVu/";
}
