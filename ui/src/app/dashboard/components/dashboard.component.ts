import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { curveBumpX } from 'd3-shape'
import { zip } from 'rxjs'
import { NgxChartsDataFormat, NgxChartsDataSeriesEntry } from 'src/app/shared/types/ngx-charts-data.types'
import { UserService } from 'src/app/user/services/user.service'
import { WeightLogEntry } from 'src/app/weight-log/models/weight-log-entry.type'
import { WeightLogService } from 'src/app/weight-log/services/weight-log.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  currentUser = this.userService.currentUser
  currentUserLoading = this.userService.currentUserLoading

  weightLog: WeightLogEntry[] | undefined = undefined
  weightLogFormatted: NgxChartsDataFormat[] | undefined = undefined
  weightLogLoading: boolean = false
  weightLogFetchError: string | null = null

  addWeightLogForm = new FormGroup({
    weight: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
  })
  addWeightLogLoading: boolean = false

  curve: any = curveBumpX

  constructor(
    private userService: UserService,
    private weightLogService: WeightLogService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchWeightLogEntries()
  }

  private formatLogEntriesForNgxCharts(weightLog: WeightLogEntry[]) {
    this.weightLogFormatted = [
      {
        name: 'weight',
        series: weightLog.map((w) => {
          return {
            id: w.weightActivityLogId,
            name: w.createdAt,
            value: w.weight,
          }
        }),
      },
    ]
  }

  private fetchWeightLogEntries() {
    this.weightLogLoading = true
    zip(this.weightLogService.fetchWeightLogEntries(), this.currentUser)
      .subscribe({
        next: (data) => {
          const entries = data[0]
          const user = data[1]

          this.weightLog = entries

          this.formatLogEntriesForNgxCharts(this.weightLog)
        },
        error: (error: HttpErrorResponse) => {
          this.weightLogFetchError = error.error.message
        },
      })
      .add(() => {
        this.weightLogLoading = false
      })
  }

  pointSelected(data: NgxChartsDataSeriesEntry) {
    if (data.id) {
      if (confirm(`Are you sure you want to delete data point with weight ${data.value} at ${data.name}?`)) {
        this.weightLogService.deleteWeightLogEntry(data.id).subscribe({
          next: (deletedEntry: WeightLogEntry) => {
            if (this.weightLog) {
              this.weightLog = this.weightLog.filter((w) => w.weightActivityLogId !== deletedEntry.weightActivityLogId)
              this.formatLogEntriesForNgxCharts(this.weightLog)
            }
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open(error.error.message, 'ok', {
              duration: 5000,
            })
          },
        })
      }
    }
  }

  addWeightLog() {
    if (this.addWeightLogForm.valid) {
      // check if the user is trying to add a weight log entry when they've already added one today. If they have,
      // show them a warning letting them know it's better to do it once per day but allow them to continue adding the
      // log if they wish to
      if (this.weightLog && this.weightLog.length > 0) {
        if (this.weightLog[this.weightLog.length - 1].createdAt.toDateString() === new Date().toDateString()) {
          if (
            confirm(
              `You're trying to add a weight log when you've already added one today. In general it's better to track your weight once per day at a consistent time. Are you sure you want to do this?`
            ) !== true
          ) {
            return
          }
        }
      }

      this.addWeightLogLoading = true
      this.weightLogService
        .createWeightLogEntry(this.addWeightLogForm.controls.weight.value as number)
        .subscribe({
          next: (newEntry: WeightLogEntry) => {
            if (this.weightLog) {
              this.weightLog.push(newEntry)
            } else {
              this.weightLog = [newEntry]
            }

            this.formatLogEntriesForNgxCharts(this.weightLog)
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open(error.error.message, 'ok', {
              duration: 5000,
            })
          },
        })
        .add(() => {
          this.addWeightLogLoading = false
        })
    }
  }
}
