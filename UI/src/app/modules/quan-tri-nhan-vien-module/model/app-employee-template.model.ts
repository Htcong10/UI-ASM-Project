import {AbstractAuditing} from '../../compoents-customer-module/models/abstract-auditing.model';

export class AppEmployee extends AbstractAuditing{
    employeeId: number;
    employeeName: string;
    address: string;
    phoneNumber: string;
    birthday: Date;
    departmentId: number;
    department : any;
    position: string;
    gender: number;
    email: string;
    status : number;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
    createdBy: string;
    disabled
}
