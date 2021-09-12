import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SiteConditionsService } from './services/site-conditions.service';
import { WINDOW_PROVIDERS } from './services/windows.service';
import { BingApiLoaderService } from './services/bing-api-loader.service';
import { BingMapComponent } from './bing-map/bing-map.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    FlexLayoutModule,
  ],
  providers: [SiteConditionsService, WINDOW_PROVIDERS, BingApiLoaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
