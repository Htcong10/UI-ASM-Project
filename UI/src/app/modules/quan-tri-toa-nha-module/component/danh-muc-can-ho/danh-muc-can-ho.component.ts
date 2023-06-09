import {Component, OnInit, ViewChild} from '@angular/core';
import {PhotoService} from '../../../../demo/service/photoservice';
import {iServiceBase} from '../../../compoents-customer-module/functions/iServiceBase';
import {AppApartmentModel} from '../../model/app-apartment.model';
import {mType} from '../../../compoents-customer-module/functions/iComponentBase.component';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {saveAs} from 'file-saver';
import {FileUpload} from 'primeng/fileupload';

@Component({
    selector: 'app-danh-muc-can-ho',
    templateUrl: './danh-muc-can-ho.component.html',
    styleUrls: ['./danh-muc-can-ho.component.scss']
})
export class DanhMucCanHoComponent implements OnInit {
    isShowDialog: boolean = false;
    lstGalleria: any;
    carouselResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];
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
    headerDialog: string;
    loading: boolean;
    submitted: boolean;
    lstApart: AppApartmentModel[] = [];
    apartmentModel: AppApartmentModel = new AppApartmentModel();
    lstBuilding: any;
    active: boolean;
    uploadedFiles: any;
    lstUrlFile: any;
    isShowGalleria: boolean = false;
    lstData: any;
    @ViewChild("fileUploader") fileInput: FileUpload;

    constructor(private sanitizer: DomSanitizer, public messageService: MessageService,
                private confirmationService: ConfirmationService, private photoService: PhotoService, private iServiceBase: iServiceBase) {

    }

    async ngOnInit() {
        this.lstBuilding = [
            {label: 'Tòa nhà A', value: 0},
            {label: 'Tòa nhà B', value: 1},
            {label: 'Tòa nhà C', value: 2},

        ];
        await this.loadAllApartment();
        this.loaDataShow();
    }

    async loadAllApartment() {
        this.loading = true;
        try {
            let url = 'https://localhost:44310/api/Apartment/GetAllApartment';
            let response = await this.iServiceBase.postDataAsyncTest(url, null);
            //const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.GET_ALL_RESIDENT,null);
            if (response && response.state) {
                this.lstApart = response.data;
            }
            this.loading = false;
        } catch (e) {
            console.log('khong load dc');
        }
    }

    loaDataShow() {
        const result = [];
        for (const item of this.lstApart) {
            item.lstGalleria = item.galleria ? item.galleria.split(';') : [];
            const buildingLabel = this.lstBuilding.find(c => c.value == item.buldingId)?.label;
            const existingItem = result.find(group => group.label === buildingLabel);
            if (existingItem) {
                existingItem.value.push(item);
            } else {
                result.push({
                    label: buildingLabel,
                    value: [item]
                });
            }
        }
        this.lstData = result;
    }

    onCreateApartment() {
        this.apartmentModel = new AppApartmentModel();
        this.active = true;
        this.submitted = false;
        this.onDisplayDialog('Thêm mới cư dân');
    }

    async onUpdateModel(model) {
        this.active = model.status == 1 ? true : false;
        this.apartmentModel = model;
        this.uploadedFiles = [];
        this.lstUrlFile = [];
        this.onDisplayDialog('Chỉnh sửa căn hộ');
        this.submitted = false;
    }

    onDisplayDialog(header: string) {
        this.headerDialog = header;
        this.isShowDialog = true;
    }

    onDisplayGalleria(model) {
        if (!model.length) {
            this.showMessage(mType.warn, 'Thông báo', 'Thư viện ảnh trống', 'notify');
            return;
        }
        this.headerDialog = 'Thư viện ảnh';
        this.isShowGalleria = true;
        this.lstGalleria = model;
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
                        this.loadAllApartment();
                        this.loaDataShow();
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

    onCancelResident() {
        this.apartmentModel = new AppApartmentModel();
        this.onHideDialog();
        this.submitted = false;
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

    onHideDialog() {
        this.apartmentModel = new AppApartmentModel();
        this.isShowDialog = false;
    }

    onSaveApartment() {
        if (this.validateData()) {
            let result = this.onBindingData();
            if (result.apartmentId && result.apartmentId >= 0) {
                this.updateModel(result);
            } else {
                this.createModel(result);
            }
            this.onHideDialog();
        }
    }

    async createModel(model: AppApartmentModel) {
        let url = 'https://localhost:44310/api/Apartment/AddApartment';
        let response = await this.iServiceBase.postDataAsyncTest(url, model);
        if (response && response.state) {
            this.showMessage(mType.success, 'Thông báo', 'Thêm cư dân thành công', 'notify');
            await this.loadAllApartment();
            this.loaDataShow();
        } else {
            this.showMessage(mType.error, 'Thông báo', 'Thêm cư dân không thành công do lỗi' + response.Message, 'notify');
        }
    }

    async updateModel(model: AppApartmentModel) {
        let url = 'https://localhost:44310/api/Apartment/UpdateApartmentById';
        let response = await this.iServiceBase.postDataAsyncTest(url, model);
        //const response = await this.iServiceBase.postDataAsync(API.PHAN_HE.CUDAN, API.API_CU_DAN.UPDATE_RESIDENT, resident);
        if (response && response.state) {
            this.showMessage(mType.success, 'Thông báo', 'Chỉnh sửa Cư dân thành công', 'notify');
            await this.loadAllApartment();
            this.loaDataShow();
        } else {
            this.showMessage(mType.error, 'Thông báo', 'Chỉnh sửa Cư dân không thành công', 'notify');
        }
    }

    onDeleteModel(model, event) {
        this.confirmationService.confirm({
            target: event.target,
            message: 'Bạn có chắc muốn xoá cư dân này chứ ' + model.apartmentName + '?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteModel(model);
            }
        });
    }

    async deleteModel(model: AppApartmentModel) {
        const param = model.apartmentId;
        let url = 'https://localhost:44310/api/Apartment/DeleteApartmentById';
        let response = await this.iServiceBase.postDataAsyncTest(url, param);
        if (response && response.state) {
            this.showMessage(mType.success, 'Thông báo', 'Xoá cư dân thành công', 'notify');
            this.loadAllApartment();
        } else {
            this.showMessage(mType.error, 'Thông báo', 'Xoá cư dân không thành công', 'notify');
        }
    }

    private onBindingData(): AppApartmentModel {
        let data = new AppApartmentModel();
        data.apartmentName = this.apartmentModel.apartmentName;
        data.status = this.active ? 1 : 0;
        //data.householdId = this.selectedHousehole.householdId;
        data.bathroom = this.apartmentModel.bathroom;
        data.bedroom = this.apartmentModel.bedroom;
        data.acreage = this.apartmentModel.acreage;
        data.monthlyFee = this.apartmentModel.monthlyFee;
        data.buldingId = this.apartmentModel.buldingId;
        data.fileDinhKem = this.apartmentModel.fileDinhKem ? this.apartmentModel.fileDinhKem : this.uploadedFiles[0].fileName;
        let lstFile = this.uploadedFiles.map(c => c.fileName).join(';');
        data.galleria = this.apartmentModel.galleria ?
            this.apartmentModel.galleria.concat(';',lstFile) : lstFile;
        data.location = this.apartmentModel.buldingId;
        if (this.apartmentModel.apartmentId && this.apartmentModel.apartmentId >= 0) {
            data.apartmentId = this.apartmentModel.apartmentId;
        }
        return data;
    }

    private validateData() {
        if (!this.apartmentModel.apartmentName || this.apartmentModel.apartmentName == '') {
            this.showMessage(mType.warn, 'Thông báo', 'Bạn chưa nhập tên căn hộ!', 'notify');
            return false;
        }
        if (!this.apartmentModel.bathroom || this.apartmentModel.bathroom <= 0) {
            this.showMessage(mType.warn, 'Thông báo', 'Số phòng tắm phải lớn hơn 0!', 'notify');
            return false;
        }
        if (!this.apartmentModel.bedroom || this.apartmentModel.bedroom <= 0) {
            this.showMessage(mType.warn, 'Thông báo', 'Số phòng ngủ phải lớn hơn 0!', 'notify');
            return false;
        }
        if (!this.apartmentModel.monthlyFee || this.apartmentModel.monthlyFee <= 0) {
            this.showMessage(mType.warn, 'Thông báo', 'Giá trị căn hộ phải lớn hơn 0!', 'notify');
            return false;
        }
        if (this.apartmentModel.buldingId == null) {
            this.showMessage(mType.warn, 'Thông báo', 'Bạn chưa chọn tòa nhà! ', 'notify');
            return false;
        }
        return true;
    }

    setActive(event: any) {
        this.active = event.checked;
        this.apartmentModel.status = event.checked ? 1 : 0;
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
}

