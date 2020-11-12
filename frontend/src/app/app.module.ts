import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { LoginformComponent } from './loginform/loginform.component';
import { TopbarComponent } from './topbar/topbar.component';

import { AuthentificationService } from './authentification.service';


@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    LoginformComponent,
    TopbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthentificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
