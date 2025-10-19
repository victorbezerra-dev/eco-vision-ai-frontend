import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UrbanDegradationMapComponent } from './urban-degradation-map/urban-degradation-map.component';
import { ZipUploaderComponent } from './zip-uploader/zip-uploader.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { StatsPieCardComponent } from './stats-card/stats-pie-card.component';

@NgModule({
  imports: [
    CommonModule,
    NgxFileDropModule,
    RouterModule,
    NgbModule
  ],
  declarations: [
    ZipUploaderComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    UrbanDegradationMapComponent,
    StatsPieCardComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    UrbanDegradationMapComponent,
    ZipUploaderComponent,
    StatsPieCardComponent
  ]
})
export class ComponentsModule { }
