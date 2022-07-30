import { NgModule } from '@angular/core'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox'
import { MatChipsModule } from '@angular/material/chips'
import { MatRippleModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatDialogConfig, MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule, MAT_MENU_DEFAULT_OPTIONS } from '@angular/material/menu'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio'
import { MatSelectModule, MAT_SELECT_CONFIG } from '@angular/material/select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSlideToggleModule, MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/slide-toggle'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatSortModule } from '@angular/material/sort'
import { MatStepperModule } from '@angular/material/stepper'
import { MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
  declarations: [],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatMenuModule,
    MatTableModule,
    MatCardModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    MatStepperModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatListModule,
    MatChipsModule,
    MatTabsModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatSortModule,
  ],
  exports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatMenuModule,
    MatTableModule,
    MatCardModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    MatStepperModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatListModule,
    MatChipsModule,
    MatTabsModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatSortModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
      },
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    {
      provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    {
      provide: MAT_MENU_DEFAULT_OPTIONS,
      useValue: { yPosition: 'below' },
    },
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { disableOptionCentering: true },
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        ...new MatDialogConfig(),
        autoFocus: false,
        width: '600px',
        closeOnNavigation: true,
      } as MatDialogConfig,
    },
  ],
})
export class MaterialSharedModule {}
