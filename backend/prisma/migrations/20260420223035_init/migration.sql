/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_c` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Admin` table. All the data in the column will be lost.
  - The `id` column on the `Admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Badge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_attribution` on the `Badge` table. All the data in the column will be lost.
  - The `id` column on the `Badge` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Commentaire` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_c` on the `Commentaire` table. All the data in the column will be lost.
  - You are about to drop the column `profId` on the `Commentaire` table. All the data in the column will be lost.
  - You are about to drop the column `professionnelId` on the `Commentaire` table. All the data in the column will be lost.
  - You are about to drop the column `skillId` on the `Commentaire` table. All the data in the column will be lost.
  - You are about to drop the column `status_c` on the `Commentaire` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Commentaire` table. All the data in the column will be lost.
  - The `id` column on the `Commentaire` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `projetId` column on the `Commentaire` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Formation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_debut` on the `Formation` table. All the data in the column will be lost.
  - You are about to drop the column `date_fin` on the `Formation` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Formation` table. All the data in the column will be lost.
  - The `id` column on the `Formation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contenu` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `lu` on the `Notification` table. All the data in the column will be lost.
  - The `id` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `studentId` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Portfolio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_c` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `objectif_pro` on the `Portfolio` table. All the data in the column will be lost.
  - The `id` column on the `Portfolio` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Prof` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `annee_niv` on the `Prof` table. All the data in the column will be lost.
  - You are about to drop the column `date_c` on the `Prof` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Prof` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Prof` table. All the data in the column will be lost.
  - The `id` column on the `Prof` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Professionnel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_c` on the `Professionnel` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Professionnel` table. All the data in the column will be lost.
  - You are about to drop the column `status_v` on the `Professionnel` table. All the data in the column will be lost.
  - The `id` column on the `Professionnel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Projet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_soumission` on the `Projet` table. All the data in the column will be lost.
  - You are about to drop the column `status_v` on the `Projet` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Projet` table. All the data in the column will be lost.
  - The `id` column on the `Projet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `profId` column on the `Projet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `RefreshToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `adminId` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `profId` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `professionnelId` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `RefreshToken` table. All the data in the column will be lost.
  - The `id` column on the `RefreshToken` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Skill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `Skill` table. All the data in the column will be lost.
  - The `id` column on the `Skill` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Stage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_debut` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `date_fin` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `status_v` on the `Stage` table. All the data in the column will be lost.
  - The `id` column on the `Stage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `duree` column on the `Stage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `profId` column on the `Stage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_c` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `Student` table. All the data in the column will be lost.
  - The `id` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `StudentSkill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StudentSkill` table. All the data in the column will be lost.
  - The `niveau` column on the `StudentSkill` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Activite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LetterRecommandation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LoginLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordResetToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recommandation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentBadge` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Prof` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Professionnel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portfolioId` to the `Commentaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `studentId` on the `Portfolio` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `userId` to the `Prof` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Professionnel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portfolioId` to the `Projet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `studentId` on the `Stage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `userId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `studentId` on the `StudentSkill` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `skillId` on the `StudentSkill` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'PROF', 'PRO', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatutValidation" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StatutCommentaire" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VisibiliteLettre" AS ENUM ('PUBLIC', 'PRIVATE', 'DOWNLOADABLE');

-- CreateEnum
CREATE TYPE "VisibilitePortfolio" AS ENUM ('PUBLIC', 'PRIVATE', 'LINK_ONLY');

-- CreateEnum
CREATE TYPE "NiveauSkill" AS ENUM ('DEBUTANT', 'INTERMEDIAIRE', 'AVANCE', 'EXPERT');

-- CreateEnum
CREATE TYPE "TypeNotification" AS ENUM ('PROJECT_SUBMITTED', 'PROJECT_VALIDATED', 'PROJECT_REJECTED', 'STAGE_VALIDATED', 'STAGE_REJECTED', 'ACTIVITY_VALIDATED', 'ACTIVITY_REJECTED', 'COMMENT_RECEIVED', 'RECOMMENDATION_RECEIVED', 'LETTER_RECEIVED');

-- CreateEnum
CREATE TYPE "TypeProjet" AS ENUM ('MODULE', 'INTEGRATION', 'HACKATHON', 'PERSONNEL', 'STAGE');

-- DropForeignKey
ALTER TABLE "Activite" DROP CONSTRAINT "Activite_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Commentaire" DROP CONSTRAINT "Commentaire_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "Commentaire" DROP CONSTRAINT "Commentaire_profId_fkey";

-- DropForeignKey
ALTER TABLE "Commentaire" DROP CONSTRAINT "Commentaire_professionnelId_fkey";

-- DropForeignKey
ALTER TABLE "Commentaire" DROP CONSTRAINT "Commentaire_projetId_fkey";

-- DropForeignKey
ALTER TABLE "Commentaire" DROP CONSTRAINT "Commentaire_skillId_fkey";

-- DropForeignKey
ALTER TABLE "Commentaire" DROP CONSTRAINT "Commentaire_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Formation" DROP CONSTRAINT "Formation_studentId_fkey";

-- DropForeignKey
ALTER TABLE "LetterRecommandation" DROP CONSTRAINT "LetterRecommandation_profId_fkey";

-- DropForeignKey
ALTER TABLE "LoginLog" DROP CONSTRAINT "LoginLog_adminId_fkey";

-- DropForeignKey
ALTER TABLE "LoginLog" DROP CONSTRAINT "LoginLog_profId_fkey";

-- DropForeignKey
ALTER TABLE "LoginLog" DROP CONSTRAINT "LoginLog_professionnelId_fkey";

-- DropForeignKey
ALTER TABLE "LoginLog" DROP CONSTRAINT "LoginLog_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_studentId_fkey";

-- DropForeignKey
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_adminId_fkey";

-- DropForeignKey
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_profId_fkey";

-- DropForeignKey
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_professionnelId_fkey";

-- DropForeignKey
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Projet" DROP CONSTRAINT "Projet_profId_fkey";

-- DropForeignKey
ALTER TABLE "Projet" DROP CONSTRAINT "Projet_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Recommandation" DROP CONSTRAINT "Recommandation_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "Recommandation" DROP CONSTRAINT "Recommandation_profId_fkey";

-- DropForeignKey
ALTER TABLE "Recommandation" DROP CONSTRAINT "Recommandation_professionnelId_fkey";

-- DropForeignKey
ALTER TABLE "Recommandation" DROP CONSTRAINT "Recommandation_studentId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_adminId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_profId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_professionnelId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Stage" DROP CONSTRAINT "Stage_profId_fkey";

-- DropForeignKey
ALTER TABLE "Stage" DROP CONSTRAINT "Stage_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentBadge" DROP CONSTRAINT "StudentBadge_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "StudentBadge" DROP CONSTRAINT "StudentBadge_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentSkill" DROP CONSTRAINT "StudentSkill_skillId_fkey";

-- DropForeignKey
ALTER TABLE "StudentSkill" DROP CONSTRAINT "StudentSkill_studentId_fkey";

-- DropIndex
DROP INDEX "Admin_email_key";

-- DropIndex
DROP INDEX "Prof_email_key";

-- DropIndex
DROP INDEX "Professionnel_email_key";

-- DropIndex
DROP INDEX "Student_email_key";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "date_c",
DROP COLUMN "email",
DROP COLUMN "password",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "nom" DROP NOT NULL,
ALTER COLUMN "prenom" DROP NOT NULL,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Badge" DROP CONSTRAINT "Badge_pkey",
DROP COLUMN "date_attribution",
ADD COLUMN     "nom" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "icone" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "couleur" DROP NOT NULL,
ADD CONSTRAINT "Badge_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Commentaire" DROP CONSTRAINT "Commentaire_pkey",
DROP COLUMN "date_c",
DROP COLUMN "profId",
DROP COLUMN "professionnelId",
DROP COLUMN "skillId",
DROP COLUMN "status_c",
DROP COLUMN "studentId",
ADD COLUMN     "authorProId" INTEGER,
ADD COLUMN     "authorProfId" INTEGER,
ADD COLUMN     "authorStudentId" INTEGER,
ADD COLUMN     "dateC" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "statut" "StatutCommentaire" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "contenu" DROP NOT NULL,
DROP COLUMN "portfolioId",
ADD COLUMN     "portfolioId" INTEGER NOT NULL,
DROP COLUMN "projetId",
ADD COLUMN     "projetId" INTEGER,
ADD CONSTRAINT "Commentaire_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Formation" DROP CONSTRAINT "Formation_pkey",
DROP COLUMN "date_debut",
DROP COLUMN "date_fin",
DROP COLUMN "studentId",
ADD COLUMN     "dateDebut" TIMESTAMP(3),
ADD COLUMN     "dateFin" TIMESTAMP(3),
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "etablissement" DROP NOT NULL,
ALTER COLUMN "diplome" DROP NOT NULL,
ALTER COLUMN "specialite" DROP NOT NULL,
ADD CONSTRAINT "Formation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_pkey",
DROP COLUMN "contenu",
DROP COLUMN "createdAt",
DROP COLUMN "lu",
ADD COLUMN     "adminId" INTEGER,
ADD COLUMN     "dateC" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "entityId" INTEGER,
ADD COLUMN     "entityType" TEXT,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "link" TEXT,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "proId" INTEGER,
ADD COLUMN     "profId" INTEGER,
ADD COLUMN     "type" "TypeNotification" NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "studentId",
ADD COLUMN     "studentId" INTEGER,
ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_pkey",
DROP COLUMN "date_c",
DROP COLUMN "objectif_pro",
ADD COLUMN     "dateCr" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "objective" TEXT,
ADD COLUMN     "scoreCredibilite" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "visibilite" "VisibilitePortfolio" NOT NULL DEFAULT 'PUBLIC',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "studentId",
ADD COLUMN     "studentId" INTEGER NOT NULL,
ADD CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Prof" DROP CONSTRAINT "Prof_pkey",
DROP COLUMN "annee_niv",
DROP COLUMN "date_c",
DROP COLUMN "email",
DROP COLUMN "password",
ADD COLUMN     "nom" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "departement" DROP NOT NULL,
ALTER COLUMN "specialite" DROP NOT NULL,
ALTER COLUMN "prenom" DROP NOT NULL,
ADD CONSTRAINT "Prof_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Professionnel" DROP CONSTRAINT "Professionnel_pkey",
DROP COLUMN "date_c",
DROP COLUMN "email",
DROP COLUMN "status_v",
ADD COLUMN     "statusV" "StatutValidation" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "entreprise" DROP NOT NULL,
ALTER COLUMN "poste" DROP NOT NULL,
ALTER COLUMN "nom" DROP NOT NULL,
ALTER COLUMN "prenom" DROP NOT NULL,
ADD CONSTRAINT "Professionnel_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Projet" DROP CONSTRAINT "Projet_pkey",
DROP COLUMN "date_soumission",
DROP COLUMN "status_v",
DROP COLUMN "studentId",
ADD COLUMN     "dateSoumission" TIMESTAMP(3),
ADD COLUMN     "githubLink" TEXT,
ADD COLUMN     "noteProf" TEXT,
ADD COLUMN     "portfolioId" INTEGER NOT NULL,
ADD COLUMN     "resultats" TEXT,
ADD COLUMN     "screenshots" TEXT,
ADD COLUMN     "statusV" "StatutValidation" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "type" "TypeProjet",
ADD COLUMN     "youtubeLink" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "titre" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "technologie" DROP NOT NULL,
DROP COLUMN "profId",
ADD COLUMN     "profId" INTEGER,
ADD CONSTRAINT "Projet_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_pkey",
DROP COLUMN "adminId",
DROP COLUMN "profId",
DROP COLUMN "professionnelId",
DROP COLUMN "studentId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_pkey",
DROP COLUMN "date",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "categorie" DROP NOT NULL,
ADD CONSTRAINT "Skill_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Stage" DROP CONSTRAINT "Stage_pkey",
DROP COLUMN "date_debut",
DROP COLUMN "date_fin",
DROP COLUMN "status_v",
ADD COLUMN     "dateDebut" TIMESTAMP(3),
ADD COLUMN     "dateFin" TIMESTAMP(3),
ADD COLUMN     "rapportUrl" TEXT,
ADD COLUMN     "statutV" "StatutValidation" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "duree",
ADD COLUMN     "duree" INTEGER,
ALTER COLUMN "mission" DROP NOT NULL,
ALTER COLUMN "entreprise" DROP NOT NULL,
DROP COLUMN "studentId",
ADD COLUMN     "studentId" INTEGER NOT NULL,
DROP COLUMN "profId",
ADD COLUMN     "profId" INTEGER,
ADD CONSTRAINT "Stage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
DROP COLUMN "date_c",
DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "photo",
ADD COLUMN     "dateC" TIMESTAMP(3),
ADD COLUMN     "filiere" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "nom" DROP NOT NULL,
ALTER COLUMN "prenom" DROP NOT NULL,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StudentSkill" DROP CONSTRAINT "StudentSkill_pkey",
DROP COLUMN "id",
ADD COLUMN     "dateAjout" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "niveau",
ADD COLUMN     "niveau" "NiveauSkill" NOT NULL DEFAULT 'DEBUTANT',
DROP COLUMN "studentId",
ADD COLUMN     "studentId" INTEGER NOT NULL,
DROP COLUMN "skillId",
ADD COLUMN     "skillId" INTEGER NOT NULL,
ADD CONSTRAINT "StudentSkill_pkey" PRIMARY KEY ("studentId", "skillId");

-- DropTable
DROP TABLE "Activite";

-- DropTable
DROP TABLE "LetterRecommandation";

-- DropTable
DROP TABLE "LoginLog";

-- DropTable
DROP TABLE "PasswordResetToken";

-- DropTable
DROP TABLE "Recommandation";

-- DropTable
DROP TABLE "StudentBadge";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioSkill" (
    "portfolioId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,
    "importance" INTEGER,

    CONSTRAINT "PortfolioSkill_pkey" PRIMARY KEY ("portfolioId","skillId")
);

-- CreateTable
CREATE TABLE "ProjetSkill" (
    "projetId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "ProjetSkill_pkey" PRIMARY KEY ("projetId","skillId")
);

-- CreateTable
CREATE TABLE "PortfolioBadge" (
    "portfolioId" INTEGER NOT NULL,
    "badgeId" INTEGER NOT NULL,
    "dateAttribution" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioBadge_pkey" PRIMARY KEY ("portfolioId","badgeId")
);

-- CreateTable
CREATE TABLE "ProjetBadge" (
    "projetId" INTEGER NOT NULL,
    "badgeId" INTEGER NOT NULL,

    CONSTRAINT "ProjetBadge_pkey" PRIMARY KEY ("projetId","badgeId")
);

-- CreateTable
CREATE TABLE "StudentFormation" (
    "studentId" INTEGER NOT NULL,
    "formationId" INTEGER NOT NULL,

    CONSTRAINT "StudentFormation_pkey" PRIMARY KEY ("studentId","formationId")
);

-- CreateTable
CREATE TABLE "ActiviteParascolaire" (
    "id" SERIAL NOT NULL,
    "nom" TEXT,
    "description" TEXT,
    "type" TEXT,
    "statutV" "StatutValidation" NOT NULL DEFAULT 'PENDING',
    "attestationUrl" TEXT,
    "adminId" INTEGER,

    CONSTRAINT "ActiviteParascolaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentActivite" (
    "studentId" INTEGER NOT NULL,
    "activiteId" INTEGER NOT NULL,

    CONSTRAINT "StudentActivite_pkey" PRIMARY KEY ("studentId","activiteId")
);

-- CreateTable
CREATE TABLE "LettreRecommandation" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "contenu" TEXT,
    "visibilite" "VisibiliteLettre" NOT NULL DEFAULT 'PRIVATE',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profId" INTEGER NOT NULL,

    CONSTRAINT "LettreRecommandation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LettreStudent" (
    "lettreId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "LettreStudent_pkey" PRIMARY KEY ("lettreId","studentId")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" SERIAL NOT NULL,
    "message" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "StatutValidation" NOT NULL DEFAULT 'PENDING',
    "portfolioId" INTEGER NOT NULL,
    "authorStudentId" INTEGER,
    "authorProfId" INTEGER,
    "authorProId" INTEGER,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE INDEX "Notification_studentId_idx" ON "Notification"("studentId");

-- CreateIndex
CREATE INDEX "Notification_profId_idx" ON "Notification"("profId");

-- CreateIndex
CREATE INDEX "Notification_proId_idx" ON "Notification"("proId");

-- CreateIndex
CREATE INDEX "Notification_adminId_idx" ON "Notification"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_studentId_key" ON "Portfolio"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Prof_userId_key" ON "Prof"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Professionnel_userId_key" ON "Professionnel"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prof" ADD CONSTRAINT "Prof_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professionnel" ADD CONSTRAINT "Professionnel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_profId_fkey" FOREIGN KEY ("profId") REFERENCES "Prof"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSkill" ADD CONSTRAINT "StudentSkill_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSkill" ADD CONSTRAINT "StudentSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioSkill" ADD CONSTRAINT "PortfolioSkill_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioSkill" ADD CONSTRAINT "PortfolioSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetSkill" ADD CONSTRAINT "ProjetSkill_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetSkill" ADD CONSTRAINT "ProjetSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioBadge" ADD CONSTRAINT "PortfolioBadge_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioBadge" ADD CONSTRAINT "PortfolioBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetBadge" ADD CONSTRAINT "ProjetBadge_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetBadge" ADD CONSTRAINT "ProjetBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_authorStudentId_fkey" FOREIGN KEY ("authorStudentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_authorProfId_fkey" FOREIGN KEY ("authorProfId") REFERENCES "Prof"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_authorProId_fkey" FOREIGN KEY ("authorProId") REFERENCES "Professionnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_profId_fkey" FOREIGN KEY ("profId") REFERENCES "Prof"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFormation" ADD CONSTRAINT "StudentFormation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFormation" ADD CONSTRAINT "StudentFormation_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiviteParascolaire" ADD CONSTRAINT "ActiviteParascolaire_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActivite" ADD CONSTRAINT "StudentActivite_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActivite" ADD CONSTRAINT "StudentActivite_activiteId_fkey" FOREIGN KEY ("activiteId") REFERENCES "ActiviteParascolaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LettreRecommandation" ADD CONSTRAINT "LettreRecommandation_profId_fkey" FOREIGN KEY ("profId") REFERENCES "Prof"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LettreStudent" ADD CONSTRAINT "LettreStudent_lettreId_fkey" FOREIGN KEY ("lettreId") REFERENCES "LettreRecommandation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LettreStudent" ADD CONSTRAINT "LettreStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_authorStudentId_fkey" FOREIGN KEY ("authorStudentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_authorProfId_fkey" FOREIGN KEY ("authorProfId") REFERENCES "Prof"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_authorProId_fkey" FOREIGN KEY ("authorProId") REFERENCES "Professionnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_profId_fkey" FOREIGN KEY ("profId") REFERENCES "Prof"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_proId_fkey" FOREIGN KEY ("proId") REFERENCES "Professionnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
