import {AbstractAuditing} from '../../compoents-customer-module/models/abstract-auditing.model';

export class AppUser extends AbstractAuditing {

    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    password: string;
    confirmPassword: string;
    address: string;
    phone: string;
    userId: any;
    userName: string;
    avatarImage: string;
    avatar: any;
    appRoles: any;
    lstRoleId: any[];
    userType : string;
    accountId: number;
}
