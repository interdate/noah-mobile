import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import {ApiQuery} from '../library/api-query';

import { IonicStorageModule } from '@ionic/storage';
import { RecoveryPageModule } from "../pages/recovery/recovery.module";
import {ContactPageModule} from "../pages/contact/contact.module";
import {RegisterPageModule} from "../pages/register/register.module";
import {PageModule} from "../pages/page/page.module";
import {SearchPageModule} from "../pages/search/search.module";
import {ResultsPageModule} from "../pages/results/results.module";
import {ProfilePageModule} from "../pages/profile/profile.module";
import {HeilbaumPhotoswipeModule} from "heilbaum-ionic-photoswipe";
import {InboxPageModule} from "../pages/inbox/inbox.module";
import {ChatPageModule} from "../pages/chat/chat.module";
import {ArenaPageModule} from "../pages/arena/arena.module";
import {NotificationPageModule} from "../pages/notification/notification.module";
import {InvitationsPageModule} from "../pages/invitations/invitations.module";
import {DatingPageModule} from "../pages/dating/dating.module";
import { Facebook } from '@ionic-native/facebook';
import { HttpClientModule } from '@angular/common/http';
import {RegisterPage} from "../pages/register/register";
import {InboxPage} from "../pages/inbox/inbox";
import {Deeplinks} from "@ionic-native/deeplinks";
import {ArenaPage} from "../pages/arena/arena";
import {ChatPage} from "../pages/chat/chat";
import {ContactPage} from "../pages/contact/contact";
import {DatingPage} from "../pages/dating/dating";
import {InvitationsPage} from "../pages/invitations/invitations";
import {Page} from "../pages/page/page";
import {ProfilePage} from "../pages/profile/profile";
import {RecoveryPage} from "../pages/recovery/recovery";
import {ResultsPage} from "../pages/results/results";
import {SearchPage} from "../pages/search/search";
import {NotificationPage} from "../pages/notification/notification";



@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ApiQuery,
        LoginPage
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp, {
            menuType: 'overlay',
            preloadModules: true
        }, {
            links: [
                { component: HomePage, name: 'בית', segment: '' },
                { component: RegisterPage, name: 'פרופיל שלי', segment: 'edit/:step' },
                { component: InboxPage, name: 'תיבת הודעות', segment: 'inbox'},
                { component: ArenaPage, name: 'התיבה', segment: 'hativa' },
                { component: ChatPage, name: 'סיחה', segment: 'chat' },
                { component: ContactPage, name: 'צור קשר', segment: 'contact' },
                { component: DatingPage, name: 'הזמנה לדיית', segment: 'dating' },
                { component: InvitationsPage, name: 'הזמנות לדיית', segment: 'invitation' },
                { component: Page, name: 'עמוד', segment: 'page' },
                { component: ProfilePage, name: 'פרופיל', segment: 'profile/:id' },
                { component: RecoveryPage, name: 'שחזור סיסמה', segment: 'recovery' },
                { component: ResultsPage, name: 'תוצאות', segment: 'results' },
                { component: SearchPage, name: 'חיפוש', segment: 'search' },
                { component: LoginPage, name: 'כניסה', segment: 'login' },
                { component: NotificationPage, name: 'התיבה שלי', segment: 'notifications' }
            ]
        }),
        IonicStorageModule.forRoot(),
        RecoveryPageModule,
        ContactPageModule,
        RegisterPageModule,
        SearchPageModule,
        ResultsPageModule,
        ProfilePageModule,
        HeilbaumPhotoswipeModule,
        InboxPageModule,
        ChatPageModule,
        ArenaPageModule,
        NotificationPageModule,
        InvitationsPageModule,
        DatingPageModule,
        PageModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage
    ],
    providers: [
        Facebook,
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        ApiQuery,
        Deeplinks
    ]
})
export class AppModule {}
