import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import * as $ from "jquery";
import {ApiQuery} from "../../library/api-query";
import {HomePage} from "../home/home";
//import set = Reflect.set;



@IonicPage()
@Component({
    selector: 'page-dating',
    templateUrl: 'dating.html',
})
export class DatingPage {
    @ViewChild(Content) content: Content;
    public form: any;
    public invite: any = {countryRegionId:''};
    public errors: any = {};
    public pageData: any;
    public inviteDate: any;
    public inviteTime: any;
    public chooseRes: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiQuery,
        private alertCtrl: AlertController
    ) {
        this.api.showLoad();
        this.api.http.post(this.api.url + '/user/invite/' + this.navParams.get('userId'),{},this.api.setHeaders(true)).subscribe(
            (data: any) => {
                //alert(JSON.stringify(data));
                console.log('register: ', data);
                this.form = data.form;
                this.invite = data.invite;
                if (data.errors) {
                    this.errors = data.errors;
                }
                this.pageData = this.form.pageData;
                this.content.scrollToTop(300);
                this.api.hideLoad();
            }, err => {
                console.log('register: ', err);
                //this.api.storage.remove('status');
                this.errors = err._body;
                this.api.hideLoad();
            }
        );
    }

    setHtmlById(id, html, regionName = ''){
        setTimeout(function () {
            html = html.replace("[COUNT]",$('#restorans ul li').length);
            html = html.replace("[AREA]", regionName);

            if($('#' + id).html() != html) {
                $('#' + id).html(html);
                // let div: any = document.createElement('div');
                // div.innerHTML = html;
                // $('#' + id).append(div);
            }
        },10);

    }

    goToHome(){
        //this.navCtrl.push(HomePage);
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
    }

    clickByElement(el){
        $(el).click();
    }

    chooseDate(field){
        var res = this.inviteDate.split("-");

        this.invite[field.name_y] = res[0];
        this.invite[field.name_m] = res[1];
        this.invite[field.name_d] = res[2];
    }

    chooseTime(field){
        var res = this.inviteTime.split(":");
        this.invite[field.name_h] = res[0];
        this.invite[field.name_min] = res[1];
    }

    restoranSel(field){
        this.api.showLoad('טוען מסעדות רלוונטיות עבורך');
        console.log(1);
        if(this.invite && this.invite.countryRegionId != ''
            && this.invite.d != "" && this.invite.m != "" && this.invite.y != ''
            && this.invite.h != "" && this.invite.min != "") {
            this.chooseRes = field;
            let regionName = '';
            let regVal = this.invite.countryRegionId;
            this.form.fields[0].options.forEach(function (area) {
                //console.log(JSON.stringify(area));
                if (area.val == regVal) {
                    regionName = area.label;
                }
            });
            //console.log(regionName, regVal);
            //console.log(this.invite.countryRegionId);
            this.setHtmlById('rest-html', this.chooseRes.data.html, regionName);
            $('#form').hide();
            $('#restorans').show();
            this.content.scrollToTop(300);
        }else{
            //לא מולאו כל השדות הדרושים, נא מלא את הטופס שוב. שדות חובה: איזור, מיקום תאריך
            let mess = 'שדות חובה:';
            if(this.invite.countryRegionId == ''){
                mess += ' איזור,';
            }
            if(this.invite.d == "" || this.invite.m == "" || this.invite.y == ''){
                mess += ' תאריך הפגישה,';
            }
            if(this.invite.h == "" || this.invite.min == ""){
                mess += ' שעת הפגישה,';
            }
            mess = mess.slice(0, -1);
            let alert = this.alertCtrl.create({
                title: 'לא מולאו כל השדות הדרושים',
                subTitle: 'נא מלא את הטופס שוב',
                message: mess,
                buttons: ['סגור']
            });
            alert.present();
        }
        this.api.hideLoad();

    }

    selectRestoran(restoran){
        this.invite.countryRegionId = restoran.countryRegionId;
        var that = this;
        setTimeout(function(){
            that.invite.restoran = restoran.placeId;
        },20);

        $('#form').show();
        $('#restorans').hide();
        this.content.scrollToTop(300);
    }

    ionViewWillEnter() {
        this.api.activePageName = 'DatingPage';
        $('#back').show();
        $('#register,#logout,#contact').hide();
    }

    sendInvite(){
        this.api.showLoad();
        this.errors = {};
        this.api.http.post(this.api.url + '/user/invite/' + this.navParams.get('userId'),this.invite,this.api.setHeaders(true)).subscribe(
            (data: any) => {
                console.log('invite: ', data);
                this.api.hideLoad();
                this.form = data.form;
                this.invite = data.invite;
                if (data.errors) {
                    this.errors = data.errors;
                    this.content.scrollToTop(300);
                }
                this.pageData = this.form.pageData;

            }, err => {
                console.log('send invite: ', err);
                //this.api.storage.remove('status');
                this.errors = err._body;
                this.api.hideLoad();
            }
        );
    }

}
