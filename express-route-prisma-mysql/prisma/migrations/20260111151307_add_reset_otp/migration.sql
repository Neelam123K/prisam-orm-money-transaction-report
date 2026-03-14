/*
  Warnings:

  - You are about to drop the `PasswordReset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `PasswordReset` DROP FOREIGN KEY `PasswordReset_userId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `otpExpiry` DATETIME(3) NULL,
    ADD COLUMN `resetOtp` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `PasswordReset`;
