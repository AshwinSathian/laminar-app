import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from '../header/header.component';
import { MaterialsLibraryComponent } from '../materials-library/materials-library.component';
import { MaterialsService } from '../services/materials.service';
import { MaterialDetailsComponent } from './components/material-details/material-details.component';
import { MaterialsListComponent } from './components/materials-list/materials-list.component';
import { ViewMaterialComponent } from './components/view-material/view-material.component';
import { MaterialsRoutingModule } from './materials-routing.module';
import { MaterialResolver } from './resolvers/material.resolver';

@NgModule({
  declarations: [
    MaterialDetailsComponent,
    MaterialsListComponent,
    ViewMaterialComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatRippleModule,
    MatListModule,
    MatDividerModule,
    MatSelectModule,
    MatCardModule,
    MaterialsRoutingModule,

    MaterialsLibraryComponent,
    HeaderComponent,
  ],
  providers: [MaterialsService, MaterialResolver],
})
export class MaterialsModule {}
