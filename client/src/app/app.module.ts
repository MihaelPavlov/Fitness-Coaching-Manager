import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routes/app-routes.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { AppComponent } from './app-component/app.component';
import { HeaderComponent } from '../features/layout/header/header.component';
import { MenuContainerComponent } from '../features/layout/menu-container/menu-container.component';
import { LandingModule } from '../pages/landing/landing.module';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { httpRequestInterceptorProvider } from '../shared/interceptors/request.interceptor';

@NgModule({
    declarations: [AppComponent, AppLayoutComponent,HeaderComponent, MenuContainerComponent],
    exports: [BrowserModule, BrowserAnimationsModule],
    imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, HttpClientModule, BrowserModule, RouterOutlet, LandingModule],
    providers: [httpRequestInterceptorProvider],
    bootstrap: [AppComponent],
})
export class AppModule { }
