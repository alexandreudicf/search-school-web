import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';
import { WINDOW } from './windows.service';

@Injectable()
export class BingApiLoaderService {
  private promise: any;
  private url = 'https://www.bing.com/api/maps/mapcontrol?callback=__onBingLoaded&key=AsL0Wcn7Krx9GHjg7GVmhPf1jP4M1CbyJfRWHZDCgfawhpi_12DjmoIumekYGgHC';

  constructor(@Inject(DOCUMENT) private _documentRef: Document, @Inject(WINDOW) private _windowRef: Window) { }

  public load() {
    // First time 'load' is called?
    if (!this.promise) {

      // Make promise to load
      this.promise = new Promise(resolve => {

        // Set callback for when bing maps is loaded.
        this._windowRef['__onBingLoaded'] = () => {
          resolve('Bing Maps API loaded');
        };

        // const node = document.createElement('script');
        const node = this._documentRef.createElement('script');
        node.src = this.url;
        node.type = 'text/javascript';
        node.async = true;
        node.defer = true;
        this._documentRef.getElementsByTagName('head')[0].appendChild(node);
      });
    }

    // Always return promise. When 'load' is called many times, the promise is already resolved.
    return this.promise;
  }
}
