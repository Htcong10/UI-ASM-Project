import {AbstractAuditing} from '../../compoents-customer-module/models/abstract-auditing.model';

export class AppApartmentModel extends AbstractAuditing{
    apartmentId: number;
    status: number;
    apartmentName: string;
    acreage: number;
    monthlyFee: number;
    householdId: number;
    bedroom : number;
    bathroom : number;
    location: number;
    buldingId: number;
    fileDinhKem: string;
    galleria:string;
    lstGalleria: any;
}
