import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BingMapComponent } from '../bing-map/bing-map.component';
import { School } from '../models/school';
import { BingApiLoaderService } from '../services/bing-api-loader.service';
import { SchoolService } from '../services/school.service';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.scss']
})
export class SchoolsComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator?: MatPaginator;

  @ViewChild('bingmap')
  bingMap!: BingMapComponent;

  mapLoaded = false;
  myAddress: string = '';

  dialogRef?: MatDialogRef<DialogComponent>;
  formGroup: FormGroup;
  paginatedList?: School[];
  list?: School[] | null;
  pageEvent?: PageEvent | null | undefined;

  constructor(
    private schoolService: SchoolService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private bingApiLoader: BingApiLoaderService,
    fb: FormBuilder) {
    this.formGroup = fb.group({
      name: null,
      address: [null, Validators.required],
      district: null
    });
  }

  loadMap() {
    this.bingApiLoader.load().then(() => {
      console.log('map loaded');
      this.mapLoaded = true;
    });
  }

  ngOnInit(): void {
  }

  selectedUser(location: Microsoft.Maps.Location) {

    this.schoolService.getSchoolsNearMe(location.latitude, location.longitude)
      .subscribe(result => {
        this.list = result;
        this.pageChanged(this.pageEvent || { pageIndex: 0, pageSize: 5, length: this.list.length });
        this.bingMap.bindUser(result);
      });
  }

  clear() {
    this.mapLoaded = false;
    this.list = null;
    this.formGroup.reset();
  }

  private paginate(array: School[], pageSize: number, pageNumber: number) {
    return array.slice(pageSize * (pageNumber - 1), pageSize * pageNumber);
  }

  pageChanged(pageEvent: PageEvent) {
    this.pageEvent = pageEvent;
    this.paginatedList = this.paginate(this.list!, pageEvent!.pageSize, pageEvent!.pageIndex + 1);

    this.paginator!.length = pageEvent.length;
    this.paginator!.pageIndex = pageEvent.pageIndex;
  }

  onSubmit() {
    const { address } = this.formGroup.value;
    this.myAddress = address;

    if (!this.mapLoaded) {
      this.loadMap();
    } else {
      this.bingMap.bindUser();
    }
  }

  viewRoute(school: School) {
    const { address } = this.formGroup.value;

    if (!address) {
      this.snackBar.open('You should fill out \'Your location\' field before view direction.', 'Ok', { duration: 5000 });
      return;
    }

    this.dialogRef = this.dialog.open(DialogComponent, { data: { originAddress: address, latitude: school.latitude, longitude: school.longitude }, width: '1280px', height: '720px' });
  }
}
