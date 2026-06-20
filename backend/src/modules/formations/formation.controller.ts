import { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";

export const createFormationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { etablissement, diplome, specialite, dateDebut, dateFin } = req.body;
    const userId = req.user.id;

    const student = await prisma.student.findUniqueOrThrow({ where: { userId } });

    const formation = await prisma.formation.upsert({
      where: {
        etablissement_diplome_specialite: {
          etablissement,
          diplome,
          specialite
        }
      },
      update: {},
      create: {
        etablissement,
        diplome,
        specialite,
        dateDebut: dateDebut ? new Date(dateDebut) : null,
        dateFin: dateFin ? new Date(dateFin) : null
      }
    });

    const studentFormation = await prisma.studentFormation.create({
      data: {
        studentId: student.id,
        formationId: formation.id
      },
      include: { Formation: true }
    });

    res.status(201).json(studentFormation.Formation);
  } catch (error) {
    next(error);
  }
};

export const getMyFormationsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const student = await prisma.student.findUniqueOrThrow({
      where: { userId },
      include: {
        StudentFormation: {
          include: { Formation: true }
        }
      }
    });

    const formations = student.StudentFormation.map(sf => sf.Formation);
    res.json(formations);
  } catch (error) {
    next(error);
  }
};

export const updateFormationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { etablissement, diplome, specialite, dateDebut, dateFin } = req.body;

    const updated = await prisma.formation.update({
      where: { id: Number(id) },
      data: {
        etablissement,
        diplome,
        specialite,
        dateDebut: dateDebut ? new Date(dateDebut) : null,
        dateFin: dateFin ? new Date(dateFin) : null
      }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteFormationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const student = await prisma.student.findUniqueOrThrow({ where: { userId } });

    await prisma.studentFormation.delete({
      where: {
        studentId_formationId: {
          studentId: student.id,
          formationId: Number(id)
        }
      }
    });

    res.json({ message: "Formation supprimée" });
  } catch (error) {
    next(error);
  }
};
