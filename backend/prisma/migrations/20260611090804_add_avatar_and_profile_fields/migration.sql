/*
  Warnings:

  - You are about to drop the column `profId` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[etablissement,diplome,specialite]` on the table `Formation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nom]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.
  - Made the column `etablissement` on table `Formation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `diplome` on table `Formation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `specialite` on table `Formation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `entreprise` on table `Stage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateDebut` on table `Stage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateFin` on table `Stage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "StatutValidation" ADD VALUE 'SUBMITTED';

-- DropForeignKey
ALTER TABLE "Stage" DROP CONSTRAINT "Stage_profId_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "avatarUrl" TEXT;

-- AlterTable
ALTER TABLE "Formation" ALTER COLUMN "etablissement" SET NOT NULL,
ALTER COLUMN "diplome" SET NOT NULL,
ALTER COLUMN "specialite" SET NOT NULL;

-- AlterTable
ALTER TABLE "Prof" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "etablissement" TEXT,
ADD COLUMN     "linkedin" TEXT;

-- AlterTable
ALTER TABLE "Professionnel" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "descriptionEntreprise" TEXT,
ADD COLUMN     "localisation" TEXT,
ADD COLUMN     "secteur" TEXT,
ADD COLUMN     "siteEntreprise" TEXT;

-- AlterTable
ALTER TABLE "Stage" DROP COLUMN "profId",
ADD COLUMN     "encadrantId" INTEGER,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "technologies" TEXT[],
ALTER COLUMN "entreprise" SET NOT NULL,
ALTER COLUMN "dateDebut" SET NOT NULL,
ALTER COLUMN "dateFin" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "anneeEntree" INTEGER,
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "diplomePrevu" INTEGER,
ADD COLUMN     "disponibilite" TEXT,
ADD COLUMN     "etablissement" TEXT,
ADD COLUMN     "formationType" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "niveau" TEXT,
ADD COLUMN     "skillsTexte" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "Formation_etablissement_diplome_specialite_key" ON "Formation"("etablissement", "diplome", "specialite");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_nom_key" ON "Skill"("nom");

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_encadrantId_fkey" FOREIGN KEY ("encadrantId") REFERENCES "Prof"("id") ON DELETE SET NULL ON UPDATE CASCADE;
