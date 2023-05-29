import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenProviderInterceptor } from './core/interceptors/token-provider.interceptor';
import { DemoMaterialModule } from './material-module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { FiscalModule } from './modules/fiscal/fiscal.module';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { DynamicTableFormComponent } from './shared/components/dynamic-table-form/dynamic-table-form.component';
import { PipesModule } from './shared/pipes/pipes.module';
import { SharedModule } from './shared/shared.module';
import { TiComponent } from './modules/ti/ti.component';
import { UnauthorizedInterceptor } from './core/interceptors/unauthorized.interceptor';
import { ErrorInterceptor } from './core/interceptors/errorinterceptor.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DynamicTableFormComponent,
    TiComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    PipesModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    SharedModule,
    AttendanceModule,
    FiscalModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: true
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenProviderInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [  ]

})
export class AppModule { }
