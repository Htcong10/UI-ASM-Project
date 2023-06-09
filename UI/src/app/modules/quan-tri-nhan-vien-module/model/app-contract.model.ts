import {AbstractAuditing} from '../../compoents-customer-module/models/abstract-auditing.model';

export class AppContractModel extends AbstractAuditing{
    laborContractId: number;
    startDate: Date;
    endDate: Date;
    salary : number;
    descript : string;
    employeeId : number;
    nhanVien: any;
    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
    status: number;
    departmentId: number;
    phongBan: any;
}
