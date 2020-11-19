import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FlightService } from './services/flight-endpoints.service';
import { Flight } from './models/flights.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  public FlightData: Flight[];
  public FlightRangeData: Flight[];

  bookingForm: FormGroup;
  isFormSubmitted = false;
  uniqueStops = [];
  uniqueAirline = [];
  filterStop = [];
  filterAirline = [];
  toLocation: string;
  fromLocation: string;
  disableMore: boolean;
  loading = false;
  isSameToFromCity = false;

  // Show more results variables
  resultsCount: number;
  end = 10;

  // Datepicker variables
  bsValue = new Date();
  minDate: Date;


  constructor(
    private formBuilder: FormBuilder,
    private flightService: FlightService,
  ) {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }

  ngOnInit(): void {

    this.bookingForm = this.formBuilder.group({
      depature: [
        '', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(3)
        ]
      ],
      arrival: [
        '', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(3)
        ]
      ],
      departDate: [this.bsValue],
      arrivalDate: [this.bsValue]
    });

  }

  // Getter to get the form control in html
  get f() { return this.bookingForm.controls; }


  // Show more results function
  getMoreFlights(): void {
    this.end = this.end + 10;
    this.FlightRangeData = this.FlightData.filter(d => !this.filterStop.includes(d.Stops));
    this.FlightRangeData = this.FlightRangeData.filter(d => !this.filterAirline.includes(d.AirlineName));
    this.resultsCount = this.FlightRangeData.length;
    this.disableMore = (this.end >= this.resultsCount);
    this.FlightRangeData.slice(0, this.end);
  }



  submitBooking(): void {

    this.isSameToFromCity = false; 
    this.isFormSubmitted = true;    
    
    if (this.bookingForm.invalid) return;

    this.toLocation = this.bookingForm.value.depature;
    this.fromLocation = this.bookingForm.value.arrival;

    if(this.toLocation != '' && this.fromLocation != '' && this.toLocation.toUpperCase() == this.fromLocation.toUpperCase()) {
      this.isSameToFromCity = true;
      return;
    }

    this.FlightRangeData = [];
    this.loading = true;
    

    this.subscription = this.flightService.getFlightDetails()
      .subscribe(
        (data: Flight[]) => {
          this.FlightData = data;
          this.resultsCount = this.FlightData.length;
        },
        err => err,
        () => {
          this.FlightRangeData = this.FlightData.slice(0, this.end);
          this.uniqueStops = this.FlightData.map(flight => flight.Stops).filter((value, index, self) => {
            return self.indexOf(value) === index
          });
          this.uniqueStops.sort();

          this.uniqueAirline = this.FlightData.map(flight => flight.AirlineName).filter((value, index, self) => {
            return self.indexOf(value) === index
          });
          this.uniqueAirline.sort();

          this.loading = false;
        });

  }


  // Method to handle the filter criteria
  filterFlightSearch(field: string, value: string): void {

    this.loading = true;

    if (field == 'Stops') {
      if (!this.filterStop.includes(value)) {
        this.filterStop.push(value);
      } else {
        var index = this.filterStop.indexOf(value);
        if (index > -1) {
          this.filterStop.splice(index, 1);
        }
      }
    } else {
      if (!this.filterAirline.includes(value)) {
        this.filterAirline.push(value);
      } else {
        var index = this.filterAirline.indexOf(value);
        if (index > -1) {
          this.filterAirline.splice(index, 1);
        }
      }
    }

    this.FlightRangeData = this.FlightData.filter(d => !this.filterStop.includes(d.Stops));
    this.FlightRangeData = this.FlightRangeData.filter(d => !this.filterAirline.includes(d.AirlineName));
    this.resultsCount = this.FlightRangeData.length;
    this.disableMore = (this.end >= this.resultsCount);
    this.FlightRangeData.slice(0, this.end);

    this.loading = false;

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
