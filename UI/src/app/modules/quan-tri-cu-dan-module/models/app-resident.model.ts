import {AbstractAuditing} from "../../compoents-customer-module/models/abstract-auditing.model";

export class AppResident extends AbstractAuditing {
    residentId: number;
    fullName: string;
    address: string;
    birthday: Date;
    createdBy: string;
    phoneNumber: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
    gender: number;
    email: string;
    householdId: number;
    status: number;
}
