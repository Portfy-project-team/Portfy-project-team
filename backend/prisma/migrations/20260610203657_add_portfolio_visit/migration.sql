/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Prof" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "etablissement" TEXT,
ADD COLUMN     "linkedin" TEXT;

-- AlterTable
ALTER TABLE "Professionnel" ADD COLUMN     "descriptionEntreprise" TEXT,
ADD COLUMN     "localisation" TEXT,
ADD COLUMN     "secteur" TEXT,
ADD COLUMN     "siteEntreprise" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "anneeEntree" INTEGER,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "diplomePrevu" INTEGER,
ADD COLUMN     "disponibilite" TEXT,
ADD COLUMN     "etablissement" TEXT,
ADD COLUMN     "formationType" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "niveau" TEXT,
ADD COLUMN     "skillsTexte" TEXT;

-- CreateTable
CREATE TABLE "PortfolioVisit" (
    "id" SERIAL NOT NULL,
    "profId" INTEGER NOT NULL,
    "portfolioId" INTEGER NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitCount" INTEGER NOT NULL DEFAULT 1,
    "bookmarked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PortfolioVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioVisit_profId_portfolioId_key" ON "PortfolioVisit"("profId", "portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_nom_key" ON "Skill"("nom");

-- AddForeignKey
ALTER TABLE "PortfolioVisit" ADD CONSTRAINT "PortfolioVisit_profId_fkey" FOREIGN KEY ("profId") REFERENCES "Prof"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioVisit" ADD CONSTRAINT "PortfolioVisit_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
