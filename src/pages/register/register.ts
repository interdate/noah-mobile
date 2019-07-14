import { Component, ViewChild } from '@angular/core';
import {ActionSheetController, AlertController, Content, NavController, NavParams, Navbar, Platform} from 'ionic-angular';
import {ApiQuery} from "../../library/api-query";
import * as $ from "jquery";
import {HomePage} from "../home/home";
import {Page} from "../page/page";
declare var setChoosen;
declare var setSelect2;




@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
    @ViewChild(Content) content: Content;
    @ViewChild(Navbar) navBar: Navbar;
    login: any = false;
    user: any = {photos: []};
    form: any = {fields: []};
    errors: any;
    activePhoto: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiQuery,
        public platform: Platform,
        public alertCtrl: AlertController,
        public actionSheetCtrl: ActionSheetController
    ) {
        api.storage.get('status').then((val) => {

            this.login = val;
            this.user = this.navParams.get('user');

            if(!this.navParams.get('user') && this.navParams.get('step')){

                this.user = {step: this.navParams.get('step'), register: this.login ? false : true};

            }
            this.sendForm();

        });


        //AbstractChosen = $;
        //var jQuery = $;
        //jQuery = setChoosen(jQuery);
    }

    changePassFn(field){
        let alert = this.alertCtrl.create({
            title: field.label,
            inputs: field.form,
            buttons: [
                {
                    text: 'ביטול',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'עדכון',
                    handler: data => {
                        let valid = this.passValid(data, field.errors);
                        if (valid === true) {
                            this.savePass(data);
                            // logged in!
                        } else {
                            let mess = this.alertCtrl.create({
                                title: String(valid),
                                buttons: ['אישור']
                            });
                            mess.present();
                            // invalid login
                            return false;
                        }
                    }
                }
            ]
        });
        alert.present();
    }

    savePass(data){
        this.api.showLoad();
        this.api.http.post(this.api.url + '/user/change-password', data, this.api.setHeaders(true)).subscribe((res: any) => {
            this.api.hideLoad();
            if(res.success) {
                this.api.storage.set('password', data.userPass);
                this.api.setHeaders(true, false, data.userPass);
            }
            if(typeof res.alertMess != 'undefined') {
                let alert = this.alertCtrl.create({
                    title: res.alertMess.title,
                    subTitle: res.alertMess.message,
                    buttons: [res.alertMess.button]
                });
                alert.present();
            }
        });
    }

    passValid(data, err){
        console.log(data);
        let res = true;
        if(data.oldPass === '' || data.userPass === '' || data.userPass2 === ''){
            res = err.err2;
        }else if(res === true && this.user.userPass !== data.oldPass){
            res = err.err1;
        }else if(res === true && data.userPass.length < 6 || data.userPass2.length < 6){
            res = err.err3;
        }else if(res === true && data.userPass !== data.userPass2){
            res = err.err4;
        }else if(res === true && data.oldPass === data.userPass){
            res = err.err5;
        }
        // if(this.user.userPass === data.oldPass && data.userPass === data.userPass2){
        //     res = true;
        // }
        return res;
        //this.api.storage.set('password', this.password);
    }

    sendForm(){
        this.api.showLoad();
        var header = this.api.setHeaders((this.login == 'login') ? true : false);
        //console.log(header);
        //alert(this.login);
        if(typeof this.user != 'undefined' && this.user.step != 3 && typeof this.form.fields != 'undefined') {
            //this.user.userCity = $('#userCity').val();
            //this.user.countryOfOriginId = $('#countryOfOriginId').val();
            this.form.fields.forEach(field => {
                if(field.type == 'select'){
                    this.user[field.name] = $('#' + field.name).val();
                }
            });
        }
        this.api.http.post(this.api.url + '/user/register', this.user, header).subscribe(
            (data: any) => {
                //alert(JSON.stringify(data));
                console.log('register: ', data);
                console.log('register: ',JSON.stringify(data));
                this.form = data.form;
                this.user = data.user;
                this.errors = data.errors;

                if(this.user.step == 3 ){
                    this.api.setHeaders(true,this.user.userEmail,this.user.userPass);
                    this.login = 'login';
                    this.api.storage.set('status','login');
                    this.api.storage.set('user_id',this.user.userId);
                    this.api.storage.set('username',this.user.userEmail);
                    this.api.storage.set('password',this.user.userPass);
                    //alert(JSON.stringify(this.user.photos));
                    let that = this;
                    setTimeout(function () {
                        that.api.hideLoad();
                    },1000);
                }else{
                    this.api.hideLoad();
                }
                if(this.user.step == 2 && !this.user.register){
                    this.api.storage.set('username',this.user.userEmail);
                    this.api.setHeaders(true,this.user.userEmail);
                }
                if(this.user.step != 3){
                    this.form.fields.forEach(field => {
                        if(field.type == 'select' /*&& field.name != 'userCity' && field.name != 'countryOfOriginId'*/){
                            this.select2(field);
                        }
                    });
                }
                this.content.scrollToTop(300);
            }, err => {
                this.api.hideLoad();
                console.log('registerError: ', err);
                console.log('registerError: ',JSON.stringify(err));
                //this.api.storage.remove('status');
                this.errors = err._body;
            }
        );
    }

    choosen(sel){
        setChoosen(sel,
            {
                no_results_text: "אין תוצאות",
                width: "100%",
                search_contains: true,
                enable_split_word_search: false
            }
        );

    }

    select2(field){
        setSelect2('#' + field.name,
            {
                placeholder: "בחר מהרשימה"
            }
        );
    }

    stepBack(){
        if(this.user.step == 3){
            this.user.register = false;
        }
        this.user.step = this.user.step - 2;
        this.sendForm();
    }

    setHtml(id,html){
        if($('#' + id).html() == '' && html != '') {
            let div: any = document.createElement('div');
            div.innerHTML = html;
            [].forEach.call(div.getElementsByTagName("a"), (a) => {
                var pageHref = a.getAttribute('onclick');
                if (pageHref) {
                    a.removeAttribute('onclick');
                    a.onclick = () => this.getPage(pageHref);
                }
            });
            $('#' + id).append(div);
        }
    }

    getPage(pageId){
        this.navCtrl.push(Page,{pageId: pageId});
    }

    ionViewDidLoad() {
        // this.navBar.backButtonClick = () => {
        //     this.navCtrl.pop();
        // };
        this.navBar.backButtonClick = (ev:UIEvent) => {
            alert('this will work in Ionic 3+');
        }
    }

    ionViewWillEnter() {
        this.api.activePageName = 'ContactPage';
        $('#back').show();
        $('#logout,#register').hide();
        this.api.storage.get('status').then((val) => {
            this.login = val;
            if(this.login == 'login'){
                $('#contact').hide();
                $('.header').removeClass('not-login');
            }else{
                $('#contact').css({'left': '15px', 'right': 'auto'}).show();
                $('.header').addClass('not-login');
            }
            setTimeout(function () {
                $('.fixed-content,.scroll-content').css({'margin-top': $('.header').innerHeight() + 'px'});
            },10);
        });

    }

    ionViewWillLeave() {
        $('#contact').removeAttr('style');
        if(this.login == 'login'){
            //this.navCtrl.push(HomePage);
            $('.mo-logo').click();
        }

    }

    edit(photo) {
        this.activePhoto = photo;
        let mainOpt = [];

        console.log(photo);

        mainOpt.push({
            text: 'בחר תמונה',
            icon: 'photos',
            handler: () => {
                //this.openGallery();
                this.browserUpload()
            }
        });

        //alert(JSON.stringify(photo));

        if(this.user.noPhoto != photo.url && photo.imgMain == '0') {
            mainOpt.push({
                text: this.form.texts.delete,
                role: 'destructive',
                icon: 'trash',
                handler: () => {
                    this.user.photo = {
                        id: photo.id,
                        action: 'delete'
                    };
                    //this.delete(photo);
                    this.sendForm();
                }
            });
        }

        mainOpt.push({
            text: this.form.texts.cancel,
            role: 'destructive',
            icon: 'close',
            handler: () => {
                console.log('Cancel clicked');
            }
        });


        var status = photo.imgValidated == '1'
            ?
            this.form.texts.approved
            :
            this.form.texts.waiting_for_approval;

        var subTitle = (photo.id == 0) ? '' : this.form.texts.status + ': ' + status;

        let actionSheet = this.actionSheetCtrl.create({
            title: photo.type_title,

            subTitle: subTitle,

            buttons: mainOpt
        });

        actionSheet.present();
    }

    add() {

        let actionSheet = this.actionSheetCtrl.create({
            title: this.form.texts.add_photo,
            buttons: [
                {
                    text: 'בחר תמונה',
                    icon: 'photos',
                    handler: () => {
                        //this.openGallery();
                        this.browserUpload()
                    }
                }, {
                    text: this.form.texts.cancel,
                    role: 'destructive',
                    icon: 'close',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    browserUpload(){
        $('#fileLoader').click();
    }

    uploadPhotoInput(fileLoader){
        this.api.showLoad();
        let that = this;
        let file = fileLoader.files[0];
        let reader = new FileReader();

        if (file) {
            reader.onload = function () {
                that.getOrientation(fileLoader.files[0], function (orientation) {
                    if (orientation > 1) {
                        that.resetOrientation(reader.result, orientation, function (resetBase64Image) {
                            that.uploadPhotoBrowser(resetBase64Image);
                        });
                    } else {
                        that.uploadPhotoBrowser(reader.result);
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    }

    uploadPhotoBrowser(dataUrl){
        if(dataUrl) {
            let that = this;
            that.api.showLoad();
            //resize
            let canvas = document.createElement("canvas");
            let img = document.createElement("img");
            let dataImage = that.getInfoFromBase64(dataUrl);
            img.src = dataUrl;
            img.onload = function() {
                //let ctx = canvas.getContext("2d");
                //ctx.drawImage(img, 0, 0);

                let MAX_WIDTH = 600;
                let MAX_HEIGHT = 600;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                let ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                dataUrl = canvas.toDataURL(dataImage.mime);


                const blob = that.convertBase64ToBlob(dataUrl);
                const fd = new FormData();

                // Prepare form data to send to server
                fd.append('file', blob, 'test.jpg');

                let header = {
                    headers: {
                        Authorization: "Basic " + btoa(encodeURIComponent(that.api.username) + ":" + encodeURIComponent(that.api.password))
                    }
                };
                that.api.setHeaders(true);
                that.api.http.post(that.api.url + '/user/image/' + that.activePhoto.id + '/' + that.activePhoto.type, fd, header).subscribe((res: any) => {

                    //that.photos = res.images.items;
                    that.api.hideLoad();
                    that.sendForm();
                }, (err) => {
                    console.log(JSON.stringify(err));
                    that.api.hideLoad();
                });

                /*
                * fileTransfer.upload(url, this.api.url + '/user/image/' + this.activePhoto.id + '/' + this.activePhoto.type, options).then((entry) => {
            this.api.hideLoad();
            //alert(JSON.stringify(entry));
            console.log('upload' + JSON.stringify(entry));
            this.sendForm();

        }, (err) => {
            //alert(JSON.stringify(err));
            this.api.hideLoad();
            console.log('uploadError' + JSON.stringify(err));

        });
                * */

            }

        }
    }

    private convertBase64ToBlob(base64: string) {
        const info = this.getInfoFromBase64(base64);
        const sliceSize = 512;
        const byteCharacters = window.atob(info.rawBase64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            byteArrays.push(new Uint8Array(byteNumbers));
        }

        return new Blob(byteArrays, { type: info.mime });
    }

    private getInfoFromBase64(base64: string) {
        const meta = base64.split(',')[0];
        const rawBase64 = base64.split(',')[1].replace(/\s/g, '');
        const mime = /:([^;]+);/.exec(meta)[1];
        const extension = /\/([^;]+);/.exec(meta)[1];

        return {
            mime,
            extension,
            meta,
            rawBase64
        };
    }

    getOrientation(file, callback) {
        let reader = new FileReader();
        reader.onload = function (e:any) {

            let view = new DataView(e.target.result);
            if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
            let length = view.byteLength, offset = 2;
            while (offset < length) {
                let marker = view.getUint16(offset, false);
                offset += 2;
                if (marker == 0xFFE1) {
                    if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
                    let little = view.getUint16(offset += 6, false) == 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    let tags = view.getUint16(offset, little);
                    offset += 2;
                    for (let i = 0; i < tags; i++)
                        if (view.getUint16(offset + (i * 12), little) == 0x0112)
                            return callback(view.getUint16(offset + (i * 12) + 8, little));
                }
                else if ((marker & 0xFF00) != 0xFF00) break;
                else offset += view.getUint16(offset, false);
            }
            return callback(-1);
        };
        reader.readAsArrayBuffer(file);
    }
    resetOrientation(srcBase64, srcOrientation, callback) {
        let img = new Image();

        img.onload = function () {
            let width = img.width,
                height = img.height,
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext("2d");

            // set proper canvas dimensions before transform & export
            if (4 < srcOrientation && srcOrientation < 9) {
                canvas.width = height;
                canvas.height = width;
            } else {
                canvas.width = width;
                canvas.height = height;
            }

            // transform context before drawing image
            switch (srcOrientation) {
                case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
                case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
                case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
                case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
                case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
                case 7: ctx.transform(0, -1, -1, 0, height, width); break;
                case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
                default: break;
            }

            // draw image
            ctx.drawImage(img, 0, 0);

            // export base64
            callback(canvas.toDataURL());
        };

        img.src = srcBase64;
    }


    goToHome(){
        //this.navCtrl.push(HomePage);
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
    }


}
