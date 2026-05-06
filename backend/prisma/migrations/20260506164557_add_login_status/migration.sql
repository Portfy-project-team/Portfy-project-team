-- CreateEnum
CREATE TYPE "LoginStatus" AS ENUM ('SUCCESS', 'FAILED', 'LOGOUT');

-- AlterTable
ALTER TABLE "LoginLog" ADD COLUMN     "status" "LoginStatus" NOT NULL DEFAULT 'SUCCESS';
