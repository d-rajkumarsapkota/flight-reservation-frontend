import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';


import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlightService } from './services/flight-endpoints.service';
import { InHourMinPipe } from './pipes/in-hour-min.pipe';


@NgModule({
  declarations: [
    AppComponent,
    InHourMinPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule    
  ],
  providers: [
    FlightService    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
