import { CommonModule, DatePipe } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { MaterialSharedModule } from './material/material-shared.module'
@NgModule({
  providers: [DatePipe],
  declarations: [],
  imports: [
    MaterialSharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NgxChartsModule,
  ],
  exports: [
    MaterialSharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NgxChartsModule,
  ],
})
export class SharedModule {}
