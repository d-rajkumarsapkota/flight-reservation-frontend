import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from '../models/flights.model';


@Injectable()
export class FlightService {
    constructor(private http: HttpClient) { }

    getFlightDetails(): Observable<Flight[]> {
        return this.http.get<Flight[]>('http://nmflightapi.azurewebsites.net/api/flight');
    }
}