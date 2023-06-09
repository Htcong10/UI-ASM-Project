import {AbstractAuditing} from '../../compoents-customer-module/models/abstract-auditing.model';

export class AppDepartmentModel extends AbstractAuditing{
    departmentId: number;
    status: number;
    departmentName: string;
    departmenAdress: string;
    managerName: string;
    email: string;
    numberEmploy: number;
    descript : string;
    memberId : string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
    createdBy: string;
}
