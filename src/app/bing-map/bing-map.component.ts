import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, Optional, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  infoBox?: Microsoft.Maps.Infobox;

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

    if (this.loadPins && this.myAddress) {
      this.bindPinsOrSetView();
    }
  }

  bindPinsOrSetView(schools?: School[]) {
    setTimeout(() => Microsoft.Maps.loadModule('Microsoft.Maps.Search', () => {

      //Create an infobox at the center of the map but don't show it.
      this.infoBox = new Microsoft.Maps.Infobox(this.streetsideMap.getCenter(), {
        visible: false
      });

      //Assign the infobox to a map instance.
      this.infoBox.setMap(this.streetsideMap);

      let searchManager = new Microsoft.Maps.Search.SearchManager(this.streetsideMap);
      searchManager.geocode({
        where: this.myAddress,
        callback: (r) => {
          this.streetsideMap.entities.clear();

          if (schools) {
            schools.forEach(element => {
              const position = new Microsoft.Maps.Location(element.latitude, element.longitude);
              var pin = new Microsoft.Maps.Pushpin(position, { title: element.abrNome, subTitle: element.nome });

              //Store some metadata with the pushpin.
              pin.metadata = {
                title: element.abrNome,
                description: element.nome,
              };
              //Add a click event handler to the pushpin.
              Microsoft.Maps.Events.addHandler(pin, 'click', (e) => this.pushpinClicked(this.infoBox!, e));

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
  }

  pushpinClicked(infoBox: Microsoft.Maps.Infobox, e) {
    //Make sure the infobox has metadata to display.
    if (e.target.metadata) {
      //Set the infobox options with the metadata of the pushpin.
      infoBox?.setOptions({
        location: e.target.getLocation(),
        title: e.target.metadata.title,
        description: e.target.metadata.description,
        visible: true
      });
    }
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

    //Load the directions module.
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', () => {
      //Create an instance of the directions manager.
      var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(this.streetsideMap);

      //Create waypoints to route between.
      var seattleWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: this.data?.originAddress });
      directionsManager.addWaypoint(seattleWaypoint);

      var workWaypoint = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(this.data?.latitude, this.data?.longitude) });
      directionsManager.addWaypoint(workWaypoint);

      //Calculate directions.
      directionsManager.calculateDirections();
    });
  }

}
