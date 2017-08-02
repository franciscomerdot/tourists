import { Component, NgZone } from '@angular/core';
import { PlacesService } from "../../services/PlacesService";
import { Place } from "../../models/Place";

@Component({
  selector: 'map',
  template: `
    <agm-map [latitude]="lat"
             [longitude]="lng"
             [zoom]="16">
      <agm-marker [latitude]="lat" 
                  [longitude]="lng" 
                  [iconUrl]="personMapIconPath"
                  [title]="'This is you'"></agm-marker>

      <agm-marker *ngFor="let place of places" 
                  [latitude]="place.location.latitude" 
                  [longitude]="place.location.longitude" 
                  [iconUrl]="restauranMapIconPath"
                  [title]="place.name"></agm-marker>
    </agm-map>
  `,
  styles: ['agm-map {  height: 800px; }'],
  providers: [PlacesService]
})
export class MapComponent {

  private _placesService:PlacesService;

  lat:number
  lng:number
  personMapIconPath:string;
  restauranMapIconPath:string;
  places:Place[];

  constructor(placesService: PlacesService, _ngZone: NgZone) {

    this._placesService = placesService;
    
    this.restauranMapIconPath = "/assets/images/restaurantMap.png";
    this.personMapIconPath = "/assets/images/personMap.png";
    
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        placesService.getPlacesArround(position.coords.latitude, position.coords.longitude, places => {
          this.places = places;
        })
      }, error => {        
        console.error(error);
        alert('You must allow the browser, the access to your location, try another browser.')
      });
    } else {
      alert('Must manually specify the location because, this device do not support geolocation or dont have acces to it .:(')
    }
   }
}
