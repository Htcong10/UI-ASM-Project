import {AbstractAuditing} from '../../compoents-customer-module/models/abstract-auditing.model';

export class AppHoGDinhModel extends AbstractAuditing{
    householdId: number;
    hostName: string;
    numMember: number;
    memberId: string;
    householdName: string;
    location: string;
    thanhvien: any;
}
