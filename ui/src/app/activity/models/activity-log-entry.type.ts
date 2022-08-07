import { Activity } from './activity.type'

export type ActivityLog = {
  activityLogId: string
  lengthInSeconds: number
  createdAt: Date
  updatedAt: Date
  userId: string
  activityId: string
  activity: Activity
}
