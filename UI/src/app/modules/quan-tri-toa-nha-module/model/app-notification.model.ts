import {AbstractAuditing} from '../../compoents-customer-module/models/abstract-auditing.model';

export class AppNotificationModel extends AbstractAuditing{
    notificationId: number;
    title: string;
    messages: string;
    isRead:number;
    notificationType: number;
    notificationForm: number;
    receiverId: string;
    nguoiNhan : any;
    doiTuong : any;
}
