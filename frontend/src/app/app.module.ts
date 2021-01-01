import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { LoginformComponent } from './loginform/loginform.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ThemecardComponent } from './themecard/themecard.component';
import { ThemeselectionComponent } from './themeselection/themeselection.component';
import { QuizzComponent } from './quizz/quizz.component';
import { DiffselectionComponent } from './diffselection/diffselection.component';
import { ProfileComponent } from './profile/profile.component';
import { PlayerslistComponent } from './playerslist/playerslist.component';

import { HttpService } from './http.service';
import { WebsocketService } from './websocket.service';
import { PersistenceService } from './persistence.service';
import { AuthenticationService } from './authentication.service';



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
    ProfileComponent,
    PlayerslistComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    HttpService,
    WebsocketService,
    PersistenceService,
    AuthenticationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
