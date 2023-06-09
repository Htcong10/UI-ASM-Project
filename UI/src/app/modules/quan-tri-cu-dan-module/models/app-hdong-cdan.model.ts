import {AbstractAuditing} from '../../compoents-customer-module/models/abstract-auditing.model';

export class AppHDongCDanModel extends AbstractAuditing{
     contractId: number;
     hostName: string | null;
     hostId: number;
     startDate: Date;
     endDate: Date;
     createdBy: string;
     createdDate: Date;
     updatedBy: string;
     updatedDate: Date;
     monthlyFee: number;
     householdId: number;
     fileUpload: string;
     otherFees: number;
     apartmentId: number;
     status: number;
     canHo: any;
     thanhVien: any;
}
