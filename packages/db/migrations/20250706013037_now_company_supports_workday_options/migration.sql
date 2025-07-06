-- CreateEnum
CREATE TYPE "CompanyWorkdayType" AS ENUM ('DEFAULT', 'ADD_SAT', 'ADD_SUN', 'ADD_WEEKEND');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "workdayOption" "CompanyWorkdayType" NOT NULL DEFAULT 'DEFAULT';

-- AlterTable
ALTER TABLE "WorkdayRecord" ADD COLUMN     "isNormalWeekend" BOOLEAN NOT NULL DEFAULT false;
