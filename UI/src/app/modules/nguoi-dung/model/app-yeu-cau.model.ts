import {AbstractAuditing} from '../../compoents-customer-module/models/abstract-auditing.model';

export class AppRequireModel extends AbstractAuditing{
    requireId: number;
    title: string;
    descript: string;
    status:string;
    residentId: number;
    apartmentId: number;
    staffId: string;
    nguoiNhan : any;
    doiTuong : any;
    rating : number;
    lstGalleria : any;
    galleria:string;
    fileDinhKem : string;
}
