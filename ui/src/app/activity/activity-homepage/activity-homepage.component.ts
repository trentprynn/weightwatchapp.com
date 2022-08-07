import { DatePipe } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTableDataSource } from '@angular/material/table'
import { ActivityLog } from '../models/activity-log-entry.type'
import { Activity } from '../models/activity.type'
import { ActivityLogService } from '../services/activity-log.service'
import { ActivityService } from '../services/activity.service'

@Component({
  selector: 'app-activity-homepage',
  templateUrl: './activity-homepage.component.html',
})
export class ActivityHomepageComponent implements OnInit {
  activities: Activity[] | undefined = undefined
  activitiesLoading: boolean = false
  activitiesFetchError: string | null = null

  activityLogs: ActivityLog[] | undefined = undefined
  activityLogsLoading: boolean = false
  activityLogsFetchError: string | null = null

  activityLogTableDisplayColumns: string[] = ['activityName', 'activityDate', 'length', 'action']
  activityLogTableData = new MatTableDataSource<ActivityLog>()

  addActivityLogForm = new FormGroup({
    activity: new FormControl<Activity | null>(null, { validators: [Validators.required], nonNullable: true }),
    activityLengthMinutes: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
    activityDate: new FormControl<Date>(new Date(), { validators: [Validators.required], nonNullable: true }),
  })
  addActivityLogLoading: boolean = false

  addActivityForm = new FormGroup({
    activityName: new FormControl<string>('', { validators: [Validators.required], nonNullable: true }),
    activityIconName: new FormControl<string>('', { validators: [Validators.required], nonNullable: true }),
  })
  addActivityLoading: boolean = false

  constructor(
    private activityService: ActivityService,
    private activityLogService: ActivityLogService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.fetchActivities()
    this.fetchActivityLogs()
  }

  addActivity() {
    if (this.addActivityForm.valid) {
      this.addActivityLoading = true
      this.activityService
        .createActivity(
          this.addActivityForm.controls.activityName.value,
          this.addActivityForm.controls.activityIconName.value
        )
        .subscribe({
          next: (newActivity: Activity) => {
            if (this.activities) {
              this.activities.push(newActivity)
            } else {
              this.activities = [newActivity]
            }
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open(error.error.message, 'ok', {
              duration: 5000,
            })
          },
        })
        .add(() => {
          this.addActivityLoading = false
        })
    }
  }

  deleteActivity(activity: Activity) {
    if (
      confirm(
        `Are you sure you want to delete your activity "${activity.name}"? Doing this will delete all activity logs associated with it. This cannot be undone.`
      )
    ) {
      this.activityService.deleteActivity(activity.activityId).subscribe({
        next: (deletedActivity) => {
          if (this.activities) {
            this.activities = this.activities.filter((a) => a.activityId !== deletedActivity.activityId)
          }

          this.fetchActivityLogs()
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.error.message, 'ok', {
            duration: 5000,
          })
        },
      })
    }
  }

  addActivityLog() {
    if (this.addActivityLogForm.valid) {
      const activityId = (this.addActivityLogForm.controls.activity.value as Activity).activityId
      const activityLengthSeconds = (this.addActivityLogForm.controls.activityLengthMinutes.value as number) * 60
      const activityDate = this.addActivityLogForm.controls.activityDate.value

      this.addActivityLogLoading = true
      this.activityLogService
        .addActivityLog(activityId, activityDate, activityLengthSeconds)
        .subscribe({
          next: (_) => {
            this.fetchActivityLogs(false)
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open(error.error.message, 'ok', {
              duration: 5000,
            })
          },
        })
        .add(() => {
          this.addActivityLogLoading = false
        })
    }
  }

  deleteActivityLog(activityLog: ActivityLog) {
    if (
      confirm(
        `Are you sure you want to delete your activity log for "${
          activityLog.activity.name
        }" on ${this.datePipe.transform(activityLog.createdAt)}? This cannot be undone.`
      )
    ) {
      this.activityLogService.deleteActivityLog(activityLog.activityLogId).subscribe({
        next: (_) => {
          this.fetchActivityLogs(false)
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.error.message, 'ok', {
            duration: 5000,
          })
        },
      })
    }
  }

  private fetchActivities() {
    this.activitiesLoading = true
    this.activityService
      .fetchActivities()
      .subscribe({
        next: (activities) => {
          this.activities = activities
        },
        error: (error: HttpErrorResponse) => {
          this.activitiesFetchError = error.error.message
        },
      })
      .add(() => {
        this.activitiesLoading = false
      })
  }

  private fetchActivityLogs(setLoading: boolean = true) {
    this.activityLogsLoading = setLoading
    this.activityLogService
      .fetchActivityLogs()
      .subscribe({
        next: (logs) => {
          this.activityLogs = logs
          this.activityLogTableData.data = this.activityLogs
        },
        error: (error: HttpErrorResponse) => {
          this.activityLogsFetchError = error.error.message
        },
      })
      .add(() => {
        this.activityLogsLoading = false
      })
  }
}
