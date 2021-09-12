import { Component, OnInit } from '@angular/core';
import { BingApiLoaderService } from '../../services/bing-api-loader.service';
import { SiteConditionsService } from '../../services/site-conditions.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  mapLoaded = false;

  constructor(private bingApiLoader: BingApiLoaderService) {
    this.bingApiLoader.load().then(() => {
      console.log('map loaded');
      this.mapLoaded = true;
    });
  }
  ngOnInit(): void {
  }

}
