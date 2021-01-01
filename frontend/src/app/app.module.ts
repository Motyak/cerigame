import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { LoginformComponent } from './loginform/loginform.component';
import { TopbarComponent } from './topbar/topbar.component';

import { AuthentificationService } from './authentification.service';
import { ThemecardComponent } from './themecard/themecard.component';
import { ThemeselectionComponent } from './themeselection/themeselection.component';
import { QuizzComponent } from './quizz/quizz.component';
import { DiffselectionComponent } from './diffselection/diffselection.component';
import { ProfileComponent } from './profile/profile.component';
import { PlayerslistComponent } from './playerslist/playerslist.component';


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
    RouterModule.forRoot([
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginformComponent},
      {path: 'theme-selection', component: ThemeselectionComponent},
      {path: 'diff-selection', component: DiffselectionComponent},
      {path: 'quizz', component: QuizzComponent},
      {path: 'profile', component: ProfileComponent},
    ]),
  ],
  providers: [AuthentificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
