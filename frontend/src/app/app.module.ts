import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { LoginformComponent } from './loginform/loginform.component';
import { TopbarComponent } from './topbar/topbar.component';

import { AuthentificationService } from './authentification.service';
import { ThemecardComponent } from './themecard/themecard.component';
import { ThemeselectionComponent } from './themeselection/themeselection.component';
import { QuizzComponent } from './quizz/quizz.component';
import { DiffselectionComponent } from './diffselection/diffselection.component';


@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    LoginformComponent,
    TopbarComponent,
    ThemecardComponent,
    ThemeselectionComponent,
    QuizzComponent,
    DiffselectionComponent,
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
