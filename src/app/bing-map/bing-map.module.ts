import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BingMapComponent } from './bing-map.component';

@NgModule({
  declarations: [BingMapComponent],
  imports: [
    CommonModule
  ],
  exports: [BingMapComponent]
})
export class BingMapModule { }
