import { CommonModule, DatePipe } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { NgChartsModule } from 'ng2-charts'
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
    NgChartsModule,
  ],
  exports: [
    MaterialSharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NgChartsModule,
  ],
})
export class SharedModule {}
