import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'
import { WeightLogCardComponent } from './components/weight-log-card.component'

@NgModule({
  declarations: [WeightLogCardComponent],
  imports: [SharedModule],
  providers: [],
  exports: [WeightLogCardComponent],
})
export class WeightLogModule {}
