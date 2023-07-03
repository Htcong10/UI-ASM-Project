import {Component, OnInit, ViewChild} from '@angular/core';
import {Product} from '../../../../demo/domain/product';
import {ConfirmationService, MessageService, SelectItem} from 'primeng/api';
import {ProductService} from '../../../../demo/service/productservice';
import {AppBreadcrumbService} from '../../../../app-systems/app-breadcrumb/app.breadcrumb.service';
import {AppRequireModel} from '../../model/app-yeu-cau.model';
import {iServiceBase} from '../../../compoents-customer-module/functions/iServiceBase';
import {DatePipe} from '@angular/common';
import {ShareData} from '../../../compoents-customer-module/shared-data-services/sharedata.service';
import {FileUpload} from 'primeng/fileupload';
import {mType} from '../../../compoents-customer-module/functions/iComponentBase.component';
import {saveAs} from 'file-saver';
import {AppApartmentModel} from '../../../quan-tri-toa-nha-module/model/app-apartment.model';
@Component({
  selector: 'app-yeu-cau',
  templateUrl: './yeu-cau.component.html',
  styleUrls: ['./yeu-cau.component.scss']
})
export class YeuCauComponent implements OnInit {
    products: Product[];

    sortOptions: SelectItem[];

    sortOrder: number;
    lstGalleria: any;
    galleriaResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];
    sortField: string;
    lstAppRequire: AppRequireModel[] = [];
    isShowDialog: boolean;
    selectedRequire : AppRequireModel;
    requireModel : AppRequireModel = new AppRequireModel();
    loading: boolean;
    submitted: boolean;
    headerDialog: string = '';
    lstStatus :any;
    @ViewChild("fileUploader") fileInput: FileUpload;
    uploadedFiles: any;
    lstUrlFile: any;
    isShowGalleria: boolean = false;
    constructor(private productService: ProductService, private breadcrumbService: AppBreadcrumbService,
                private shareData: ShareData,
                public messageService: MessageService,
                private confirmationService: ConfirmationService,
                private iServiceBase: iServiceBase,
                private datePipe: DatePipe) {
        this.breadcrumbService.setItems([
            { label: 'UI Kit' },
            { label: 'List', routerLink: ['/uikit/list'] }
        ]);
        this.lstStatus =
            [
                {label: 'Chờ xử lý', value: 'Chờ xử lý'},
                {label: 'Đã gửi yêu cầu đến bộ phận xử lý', value: 'Đã gửi yêu cầu đến bộ phận xử lý'},
                {label: 'Đang xử lý', value: 'Đang xử lý'},
                {label: 'Hoàn thành', value: 'Hoàn thành'}
            ];
        this.sortOptions = [
            {label: 'Ngày cũ đến mới', value: '!createdDate'},
            {label: 'Ngày mới đến cũ', value: 'createdDate'}
        ];
    }

    async ngOnInit() {
        await this.loadAllRequire();
        this.loaDataShow()
        this.productService.getProducts().then(data => this.products = data);
    }
    async loadAllRequire() {
        try {
            let url = 'https://localhost:44395/api/ResidentRequire/GetListByResidentId';
            let param ={
                fromDate : null,
                toDate : null,
                status: null,
                residentId : JSON.parse(sessionStorage.getItem('USER_CURRENT')).accountId
            }
            let response = await this.iServiceBase.postDataAsyncTest(url, param);
            if (response && response.state) {
                this.lstAppRequire = response.data;
            }
        } catch (e) {
            console.log('khong load dc');
        }
    }
    loaDataShow() {
       if(this.lstAppRequire.length > 0)
       {
           this.lstAppRequire.forEach(e =>
           {
               e.lstGalleria = e.galleria ? e.galleria.split(';') : [];
           })
       }
    }
    onSortChange(event) {
        const value = event.value;
        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }
    async taiFile(file) {
        let url = 'https://localhost:44310/api/Apartment/getBase64File';
        let param = {
            filePath: file
        };
        let response = await this.iServiceBase.postDataAsyncTest(url, param);
        if (response.state) {
            const myFile = this.base64ToFile(response.data[0].base64, file, response.data[0].contentType);
            saveAs(myFile, file);
        }
    }

    async deleteFile(file) {
        this.isShowDialog = false;
        this.confirmationService.confirm({
            message: "Bạn có chắc chắn muốn xóa file không ?",
            header: 'Xác nhận',
            key:'confirm1',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let url = 'https://localhost:44310/api/Apartment/deleteFileFromPath';
                let param = {
                    filePath: file
                };
                this.iServiceBase.postDatatest(url, param).pipe().subscribe(response =>
                {
                    if (response.state) {
                        this.showMessage(mType.success, 'Thông báo', 'Xóa file thành công', 'notify');
                    } else {
                        this.showMessage(mType.warn, 'Thông báo', 'Xóa file không thành công do' + response.message, 'notify');
                    }
                });
            },
            reject:() =>{
                this.isShowDialog = true;
            }
        });

    }
    private base64ToFile(base64Data, tempfilename, contentType) {
        contentType = contentType || '';
        const sliceSize = 1024;
        const byteCharacters = atob(base64Data);
        const bytesLength = byteCharacters.length;
        const slicesCount = Math.ceil(bytesLength / sliceSize);
        const byteArrays = new Array(slicesCount);

        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            const begin = sliceIndex * sliceSize;
            const end = Math.min(begin + sliceSize, bytesLength);

            const bytes = new Array(end - begin);
            for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new File(byteArrays, tempfilename, {type: contentType});
    }
    showMessage(iType: mType, strheader, strmessage, key?: string) {
        if (iType == 0) {
            if (key != undefined) {
                this.messageService.add({key, severity: 'success', summary: strheader, detail: strmessage});
            } else {
                this.messageService.add({severity: 'success', summary: strheader, detail: strmessage});
            }

        }

        if (iType == 1) {
            if (key != undefined) {
                this.messageService.add({key, severity: 'info', summary: strheader, detail: strmessage});
            } else {
                this.messageService.add({severity: 'info', summary: strheader, detail: strmessage});
            }
        }

        if (iType == 2) {
            if (key != undefined) {
                this.messageService.add({key, severity: 'warn', summary: strheader, detail: strmessage});
            } else {
                this.messageService.add({severity: 'warn', summary: strheader, detail: strmessage});
            }
        }

        if (iType == 3) {
            if (key != undefined) {
                this.messageService.add({key, severity: 'error', summary: strheader, detail: strmessage});
            } else {
                this.messageService.add({severity: 'error', summary: strheader, detail: strmessage});
            }
        }
    }
    onBeforeUpload(event) {
        console.log('vao', event);
    }

    ViewFile(b64Data, contentType) {
        const byteCharacters = atob(b64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: contentType});
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.target = '_blank';
        anchor.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
        }, 10);
    }

    async onShowImage(image) {
        let url = 'https://localhost:44310/api/Apartment/getBase64File';
        let param = {
            filePath: image
        };
        let response = await this.iServiceBase.postDataAsyncTest(url, param);
        if (response.state) {
            this.ViewFile(response.data[0].base64, response.data[0].contentType);
        }
    }
    onCreateRequire(){
        this.requireModel = new AppRequireModel();
        this.submitted = false;
        this.uploadedFiles = [];
        this.lstUrlFile = [];
        this.onDisplayDialog('Thêm mới yêu cầu');
    }
    onDisplayDialog(header: string) {
        this.headerDialog = header;
        this.isShowDialog = true;
    }
    async onUpdateModel(model) {
        this.requireModel = model;
        this.uploadedFiles = [];
        this.lstUrlFile = [];
        this.onDisplayDialog('Chỉnh sửa yêu cầu');
        this.submitted = false;
    }

    async onFileSelected(event) {
        if (this.validateData()) {
            if (event.files && event.files.length) {
                for (const e of event.files) {
                    let fileinput: any;
                    let resultFile: any;
                    const File: File = e;
                    const reader = new FileReader();
                    reader.readAsDataURL(File);
                    await new Promise<void>((resolve, reject) => {
                        reader.onload = () => {
                            fileinput = reader.result.toString();
                            resultFile = fileinput.substring(fileinput.lastIndexOf(',') + 1);
                            this.uploadedFiles.push({
                                fileName: e.name,
                                fileBase64: resultFile
                            });
                            this.fileInput.clear();
                            resolve(); // Khi xử lý file này hoàn tất, tiếp tục với file tiếp theo
                        };
                        reader.onerror = reject; // Xử lý lỗi nếu có
                    });
                }
                if (this.uploadedFiles.length) {
                    let url = 'https://localhost:44310/api/Apartment/UploadFile';
                    let response = await this.iServiceBase.postDataAsyncTest(url, this.uploadedFiles);
                    if (response && response.state) {
                        this.showMessage(mType.success, 'Thông báo', 'Tải file lên thành công', 'notify');
                    }
                }
            }
        }
    }
    private validateData() {
        if (!this.requireModel.title || this.requireModel.title == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập tiêu đề!", 'notify');
            return false;
        }
        if (!this.requireModel.descript || this.requireModel.descript == '') {
            this.showMessage(mType.warn, "Thông báo", "Bạn chưa nhập nội dung!", 'notify');
            return false;
        }
        return true;
    }
    onDisplayGalleria(model) {
        this.lstGalleria = [];
        if (!model.length) {
            this.showMessage(mType.warn, 'Thông báo', 'Thư viện ảnh trống', 'notify');
            return;
        }
        this.headerDialog = 'Thư viện ảnh';
        this.isShowGalleria = true;
        this.lstGalleria = model;
    }
    onSaveRequire()
    {
        if (this.validateData()) {
            let result = this.onBindingData();
            if (result.requireId && result.requireId >= 0) {
                this.updateModel(result);
            } else {
                this.createModel(result);
            }
            this.onHideDialog();
        }
    }
    async updateModel(model: AppRequireModel) {
        let url = 'https://localhost:44395/api/ResidentRequire/UpdateRequireById';
        let response = await this.iServiceBase.postDataAsyncTest(url, model);
        //const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.UPDATE_RESIDENT, resident);
        if (response && response.state) {
            this.showMessage(mType.success, 'Thông báo', 'Chỉnh sửa yêu cầu thành công', 'notify');
            await this.loaDataShow();
            this.loaDataShow();
        } else {
            this.showMessage(mType.error, 'Thông báo', 'Chỉnh sửa yêu cầu không thành công', 'notify');
        }
    }
    async createModel(model: AppRequireModel) {
        let url = 'https://localhost:44395/api/ResidentRequire/AddRequire';
        let response = await this.iServiceBase.postDataAsyncTest(url, model);
        if (response && response.state) {
            this.showMessage(mType.success, 'Thông báo', 'Thêm yêu cầu thành công', 'notify');
            await this.loaDataShow();
            this.loaDataShow();
        } else {
            this.showMessage(mType.error, 'Thông báo', 'Thêm yêu cầu không thành công do lỗi' + response.Message, 'notify');
        }
    }
    private onBindingData(): AppRequireModel {
        let data = new AppRequireModel();
        data.title = this.requireModel.title;
        data.status = "Chờ xử lý";
        data.residentId = this.shareData.userInfo.accountId;
        data.descript = this.requireModel.descript;
        data.fileDinhKem = this.requireModel.fileDinhKem ? this.requireModel.fileDinhKem :
            (this.uploadedFiles ? this.uploadedFiles[0].fileName : "");
        let lstFile = this.uploadedFiles ? this.uploadedFiles.map(c => c.fileName).join(';') : "";
        data.galleria = this.requireModel.galleria ?
            this.requireModel.galleria.concat(';',lstFile) : lstFile;
        if (this.requireModel.requireId && this.requireModel.requireId >= 0) {
            data.requireId = this.requireModel.requireId;
            data.createdBy = this.requireModel.createdBy;
            data.createdDate = this.requireModel.createdDate;
            data.updatedBy = this.shareData.userInfo.userName;
            data.updatedDate = new Date();
        }
        else {
            data.createdBy = this.shareData.userInfo.userName;
            data.createdDate = new Date();
        }
        return data;
    }
    onCancelRequire() {
        this.requireModel = new AppRequireModel();
        this.onHideDialog();
        this.submitted = false;
    }
    onHideDialog() {
        this.isShowDialog = false;
    }
}
