-- CreateTable
CREATE TABLE "WeightActivityLog" (
    "weightActivityLogId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WeightActivityLog_pkey" PRIMARY KEY ("weightActivityLogId")
);

-- AddForeignKey
ALTER TABLE "WeightActivityLog" ADD CONSTRAINT "WeightActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
