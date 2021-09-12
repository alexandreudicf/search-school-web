import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, Optional, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Action } from 'rxjs/internal/scheduler/Action';
import { delay, filter, take, timeout } from 'rxjs/operators';
import { School } from '../models/school';
import { SiteConditionsService } from '../services/site-conditions.service';

@Component({
  selector: 'app-bing-map',
  templateUrl: './bing-map.component.html',
  styleUrls: ['./bing-map.component.scss']
})
export class BingMapComponent implements OnChanges, AfterViewInit {

  @ViewChild('streetsideMap') streetsideMapViewChild?: ElementRef;

  @Input()
  loadPins = false;

  @Input()
  myAddress: string = '';

  @Output() selectedLocation = new EventEmitter<Microsoft.Maps.Location>();


  get center() {
    return this.service.center$;
  }
  streetsideMap!: Microsoft.Maps.Map;

  log: string[] = [];

  constructor(
    private service: SiteConditionsService,
    @Inject(MAT_DIALOG_DATA) @Optional() private data?: { originAddress: string, latitude: number, longitude: number }) {
    this.log.push('Constructor');
  }

  ngOnChanges() {
    this.log.push('OnChanges');
  }

  ngAfterViewInit() {


    this.log.push('AfterViewInit');

    if (!this.streetsideMap) {
      this.createStreetSideMap();
    }

    /*this.service.center$.pipe(
      filter(coords => !!coords),
      take(1)
    ).subscribe(coords => {
      const [lat, lon] = coords;
      this.log.push(`Got coords from service: ${coords}`);
      const position = new Microsoft.Maps.Location(lat, lon);
      //this.streetsideMap.setView({ center: position });

      this.log.push(`current Center: ${this.streetsideMap.getCenter()}`);
    });*/


    if (this.loadPins && this.myAddress) {
      this.bindUser();
    }
  }

  bindUser(schools?: School[]) {
    setTimeout(() => Microsoft.Maps.loadModule('Microsoft.Maps.Search', () => {
      let searchManager = new Microsoft.Maps.Search.SearchManager(this.streetsideMap);
      searchManager.geocode({
        where: this.myAddress,
        callback: (r) => {
          this.streetsideMap.entities.clear();

          if (schools) {
            schools.forEach(element => {
              const position = new Microsoft.Maps.Location(element.latitude, element.longitude);
              var pin = new Microsoft.Maps.Pushpin(position, { title: element.abrNome, subTitle: element.nome });
              this.streetsideMap.entities.push(pin);
            });
            return;
          }

          if (r && r.results && r.results.length > 0) {
            this.streetsideMap.setView({ bounds: r.results[0].bestView });
            this.selectedLocation.emit(r.results[0].location);
          }
        },
        errorCallback: function (e) {
          //If there is an error, alert the user about it.
          alert("No results found.");
        }
      });
    }), 100);

    //Load the spatial math module
    /* Microsoft.Maps.loadModule("Microsoft.Maps.SpatialMath", () => {
      //Request the user's location
      navigator.geolocation.getCurrentPosition((position) => {
        var loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);

        //Create an accuracy circle
        var path = Microsoft.Maps.SpatialMath.getRegularPolygon(loc, position.coords.accuracy, 36);
        var poly = new Microsoft.Maps.Polygon(path);
        this.streetsideMap.entities.push(poly);

        //Add a pushpin at the user's location.
        var pin = new Microsoft.Maps.Pushpin(loc);
        this.selectedLocation.emit(loc);
        this.streetsideMap.entities.push(pin);

        //Center the map on the user's location.
        this.streetsideMap.setView({ center: loc, zoom: 17 });
      });
    }); */
  }


  createStreetSideMap() {
    this.streetsideMap = new Microsoft.Maps.Map(
      this.streetsideMapViewChild!.nativeElement,
      {
        streetsideOptions: {
          overviewMapMode: Microsoft.Maps.OverviewMapMode.minimized,
          showExitButton: false
        }
      }
    );

    //Load the Bing Spatial Data Services module.
    /*Microsoft.Maps.loadModule('Microsoft.Maps.SpatialDataService', () => {
      //Add an event handler for when the map moves.
      Microsoft.Maps.Events.addHandler(this.streetsideMap, 'viewchangeend', this.getNearByLocations);

      //Trigger an initial search.
      this.getNearByLocations();
    });*/

    //Load the directions module.
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', () => {
      //Create an instance of the directions manager.
      var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(this.streetsideMap);

      //Create waypoints to route between.
      var seattleWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: this.data?.originAddress });
      directionsManager.addWaypoint(seattleWaypoint);

      var workWaypoint = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(this.data?.latitude, this.data?.longitude) });
      directionsManager.addWaypoint(workWaypoint);

      //Specify the element in which the itinerary will be rendered.
      //directionsManager.setRenderOptions({ itineraryContainer: '#directionsItinerary' });

      //Calculate directions.
      directionsManager.calculateDirections();
    });

    /*Microsoft.Maps.loadModule('Microsoft.Maps.Search', () => {
      let searchManager = new Microsoft.Maps.Search.SearchManager(this.streetsideMap);
      searchManager.geocode({
        where: 'Porto Alegre, RS',
        callback: (r) => {
          //Add the first result to the map and zoom into it.

          if (this.data) {
            this.data.forEach(element => {
              const position = new Microsoft.Maps.Location(element.latitude, element.longitude);
              var pin = new Microsoft.Maps.Pushpin(position, {});
              this.streetsideMap.entities.push(pin);
            });
          }

          if (r && r.results && r.results.length > 0) {
            var pin = new Microsoft.Maps.Pushpin(r.results[0].location);
            //this.streetsideMap.entities.push(pin);

            this.streetsideMap.setView({ bounds: r.results[0].bestView });
          }
        },
        errorCallback: function (e) {
          //If there is an error, alert the user about it.
          alert("No results found.");
        }
      });
    });*/
  }

  getNearByLocations() {
    //Remove any existing data from the map.
    this.streetsideMap.entities.clear();

    //Create a query to get nearby data.
    var queryOptions = {
      queryUrl: 'www.google.com',
      spatialFilter: {
        spatialFilterType: 'nearby',
        location: this.streetsideMap.getCenter(),
        radius: 25
      },
      //Filter to retrieve Gas Stations.
      filter: new Microsoft.Maps.SpatialDataService.Filter('EntityTypeID', 'eq', 5540)
    };

    //Process the query.
    Microsoft.Maps.SpatialDataService.QueryAPIManager.search(queryOptions, this.streetsideMap, (data) => {
      //Add results to the map.
      this.streetsideMap.entities.push(data);
    });
  }

}
