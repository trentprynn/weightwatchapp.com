import { DatePipe } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTableDataSource } from '@angular/material/table'
import { ChartConfiguration } from 'chart.js'
import { BaseChartDirective } from 'ng2-charts'
import { UserService } from 'src/app/user/services/user.service'
import { WeightLogEntry } from '../models/weight-log-entry.type'
import { WeightLogService } from '../services/weight-log.service'

@Component({
  selector: 'app-weight-log-card',
  templateUrl: './weight-log-card.component.html',
})
export class WeightLogCardComponent implements OnInit {
  currentUser = this.userService.currentUser
  currentUserLoading = this.userService.currentUserLoading

  weightLog: WeightLogEntry[] | undefined = undefined
  weightLogLoading: boolean = false
  weightLogFetchError: string | null = null

  addWeightLogForm = new FormGroup({
    weight: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
  })
  addWeightLogLoading: boolean = false

  displayedColumns: string[] = ['weight', 'createdAt', 'action']
  weightTableData = new MatTableDataSource<WeightLogEntry>()
  chartView: boolean = true

  @ViewChild(BaseChartDirective) weightChart?: BaseChartDirective | undefined = undefined
  weightChartData: ChartConfiguration['data'] = {
    // filled out at run time when data is loaded
    datasets: [
      {
        data: [],
      },
    ],
    labels: [],
  }

  constructor(
    private userService: UserService,
    private weightLogService: WeightLogService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.fetchWeightLogEntries()
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

            this.updateChartAndTable()
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

  deleteWeightLogEntry(weightLogEntry: WeightLogEntry) {
    if (
      confirm(
        `Are you sure you want to delete data point weight ${weightLogEntry.weight} on ${this.datePipe.transform(
          weightLogEntry.createdAt
        )}?`
      )
    ) {
      this.weightLogService.deleteWeightLogEntry(weightLogEntry.weightActivityLogId).subscribe({
        next: (deletedEntry: WeightLogEntry) => {
          if (this.weightLog) {
            this.weightLog = this.weightLog.filter((w) => w.weightActivityLogId !== deletedEntry.weightActivityLogId)
            this.updateChartAndTable()
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

  private updateChartAndTable() {
    if (this.weightLog && this.weightLog.length > 0) {
      this.weightChartData.datasets[0] = {
        data: this.weightLog.map((w) => w.weight),

        pointBackgroundColor: 'rgba(0,0,0)',
        pointHoverBackgroundColor: 'rgba(114, 163, 216)',
        label: 'weight',
        fill: 'origin',
      }

      this.weightChartData.labels = this.weightLog.map((w) => this.datePipe.transform(w.createdAt))

      this.weightChart?.update()

      this.weightTableData.data = this.weightLog
    }
  }

  private fetchWeightLogEntries() {
    this.weightLogLoading = true
    this.weightLogService
      .fetchWeightLogEntries()
      .subscribe({
        next: (entries) => {
          this.weightLog = entries
          this.updateChartAndTable()
        },
        error: (error: HttpErrorResponse) => {
          this.weightLogFetchError = error.error.message
        },
      })
      .add(() => {
        this.weightLogLoading = false
      })
  }
}
