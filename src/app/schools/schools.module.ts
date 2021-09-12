import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { SchoolsRoutingModule } from './schools-routing.module';
import { SchoolsComponent } from './schools.component';
import { SchoolService } from '@app/services/school.service';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { BingMapModule } from '../bing-map/bing-map.module';
import { DialogComponent } from './dialog/dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    SchoolsComponent,
    DialogComponent
  ],
  imports: [
    CommonModule,
    SchoolsRoutingModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    MatDialogModule,
    BingMapModule,
    MatSnackBarModule,
    MatCardModule,
    MatPaginatorModule,
    MatSelectModule
  ],
  providers: [SchoolService]
})
export class SchoolsModule { }
