import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routes/app-routes.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { AppComponent } from './app-component/app.component';
import { LoginModule } from '../pages/login/login.module';
import { ProfileModule } from '../pages/profile/profile.module';

@NgModule({
    declarations: [AppComponent],
    exports: [BrowserModule, BrowserAnimationsModule],
    providers: [],
    bootstrap: [AppComponent],
    imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, HttpClientModule, BrowserModule, RouterOutlet, LoginModule,ProfileModule]
})
export class AppModule { }
