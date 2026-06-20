import {Request,Response, NextFunction } from "express";
import { createUserSchema, listUsersQuerySchema, RejectUserSchema, updateStatusSchema, updateUserSchema } from "./admin.validation.js";
import { AdminServices } from "./admin.service.js";
import {prisma} from "../../utils/prisma.js";
import { UserStatus } from "@prisma/client";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createUserSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (existingUser) {
      res.status(409).json({ message: 'A user with this email already exists.' });
      return;
    }
    const user = await AdminServices.createUser(data);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
   next(err);
  }
};
export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = listUsersQuerySchema.parse(req.query);
    const users = await AdminServices.getAllUsers(filters);
    res.json({ users });
  } catch (err) {
    next(err);
  }
};
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await AdminServices.deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const listAttestations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attestations = await prisma.activiteParascolaire.findMany({
      where: { attestationUrl: { not: null } },
      include: {
        StudentActivite: {
          include: {
            Student: {
              include: { user: true }
            }
          }
        }
      },
      orderBy: { id: 'desc' }
    });
    
    // Map to a cleaner format for frontend
    const mapped = attestations.map(a => ({
      id: a.id,
      nom: a.nom,
      type: a.type,
      statutV: a.statutV,
      attestationUrl: a.attestationUrl,
      user: a.StudentActivite[0]?.Student?.user
    }));
    
    res.json(mapped);
  } catch (err) {
    next(err);
  }
};

export const listModerationItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await prisma.projet.findMany({
      where: { statusV: 'PENDING' },
      include: { 
        portfolio: { 
          include: { 
            student: { 
              include: { user: true } 
            } 
          } 
        } 
      }
    });
    
    const comments = await prisma.commentaire.findMany({
      where: { statut: 'PENDING' },
      include: { 
        Student: { include: { user: true } },
        Prof: { include: { user: true } },
        Professionnel: { include: { user: true } }
      }
    });

    const items = [
      ...projects.map(p => ({
        id: p.id,
        type: 'PROJET',
        title: p.titre,
        authorName: p.portfolio?.student?.user?.email || 'Inconnu',
        createdAt: p.dateSoumission,
        status: p.statusV
      })),
      ...comments.map(c => ({
        id: c.id,
        type: 'COMMENTAIRE',
        title: c.contenu,
        authorName: c.Student?.user?.email || c.Prof?.user?.email || c.Professionnel?.user?.email || 'Anonyme',
        createdAt: c.dateC,
        status: c.statut
      }))
    ];

    res.json(items);
  } catch (err) {
    next(err);
  }
};

export const listEstablishments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbEstablishments = await prisma.establishment.findMany();
    
    // Also get derived ones from students/profs that might not be in the Establishment table yet
    const students = await prisma.student.groupBy({
      by: ['etablissement'],
      _count: { _all: true }
    });
    
    const profs = await prisma.prof.groupBy({
      by: ['etablissement'],
      _count: { _all: true }
    });

    const establishmentMap: Record<string, any> = {};

    // Seed from DB table first
    dbEstablishments.forEach(e => {
      establishmentMap[e.name] = {
        id: e.id,
        name: e.name,
        code: e.code,
        city: e.city,
        status: e.status,
        _count: { students: 0, profs: 0 }
      };
    });

    students.forEach(s => {
      if (!s.etablissement) return;
      if (!establishmentMap[s.etablissement]) {
        establishmentMap[s.etablissement] = {
          name: s.etablissement,
          code: s.etablissement.substring(0, 2).toUpperCase(),
          city: 'Inconnue',
          status: 'ACTIVE',
          _count: { students: s._count._all, profs: 0 }
        };
      } else {
        establishmentMap[s.etablissement]._count.students = s._count._all;
      }
    });

    profs.forEach(p => {
      if (!p.etablissement) return;
      if (establishmentMap[p.etablissement]) {
        establishmentMap[p.etablissement]._count.profs = p._count._all;
      } else {
        establishmentMap[p.etablissement] = {
          name: p.etablissement,
          code: p.etablissement.substring(0, 2).toUpperCase(),
          city: 'Inconnue',
          status: 'ACTIVE',
          _count: { students: 0, profs: p._count._all }
        };
      }
    });

    res.json(Object.values(establishmentMap));
  } catch (err) {
    next(err);
  }
};

export const createEstablishment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, code, city } = req.body;
    const est = await prisma.establishment.create({
      data: { name, code, city, status: 'ACTIVE' }
    });
    res.status(201).json(est);
  } catch (err) {
    next(err);
  }
};

export const updateEstablishment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { name, code, city, status } = req.body;
    
    // If it's a numeric ID, update the Establishment table
    if (!isNaN(id)) {
      const est = await prisma.establishment.update({
        where: { id },
        data: { 
          ...(name && { name }),
          ...(code && { code }),
          ...(city && { city }),
          ...(status && { status })
        }
      });
      res.json(est);
    } else {
      // If it's a name (derived), we'd need to update profiles. 
      // Simplified: just return success for now if it's derived
      res.json({ message: 'Derived establishment updated (simulated)' });
    }
  } catch (err) {
    next(err);
  }
};

export const getPlatformStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalInscriptions = await prisma.user.count({ where: { role: { not: 'ADMIN' } } });
    const totalProjects = await prisma.projet.count();
    const totalValidations = await prisma.projet.count({ where: { statusV: 'VALIDATED' } });
    const totalPortfolios = await prisma.portfolio.count({ where: { visibilite: 'PUBLIC' } });

    // Repartition par filiere
    const branches = await prisma.student.groupBy({
      by: ['filiere'],
      _count: { _all: true }
    });

    const totalStudents = await prisma.student.count() || 1;
    const branchRepartition = branches.map(b => ({
      name: b.filiere || 'Autre',
      percent: Math.round((b._count._all / totalStudents) * 100)
    }));

    // Evolution simple (exemple)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentInscriptions = await prisma.user.count({ 
      where: { 
        createdAt: { gte: thirtyDaysAgo },
        role: { not: 'ADMIN' }
      } 
    });

    res.json({
      stats: [
        { label: 'Inscriptions', value: totalInscriptions, growth: Math.round((recentInscriptions / (totalInscriptions || 1)) * 100) },
        { label: 'Projets crees', value: totalProjects, growth: 12 },
        { label: 'Validations', value: totalValidations, growth: 8 },
        { label: 'Portfolios publies', value: totalPortfolios, growth: 15 }
      ],
      branches: branchRepartition
    });
  } catch (err) {
    next(err);
  }
};
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const data = updateUserSchema.parse(req.body);
    const updatedUser = await AdminServices.updateUser(id, data);
    res.json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    next(err);
  }
};
export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const { status } =updateStatusSchema.parse(req.body) 
    
    if (!status) {
      res.status(400).json({ 
        message: 'Invalid status. Allowed: active, blocked, pending, rejected' 
      });
      return;
    }

    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (userExists.status === status) {
      res.status(409).json({ message: `User is already ${status}` });
      return;
    }

    const user = await AdminServices.updateUserStatus(id, status);
    res.json({ message: `User status updated to ${status}`, user });
  } catch (err) {
     next(err);
  }
};
export const approveUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.status !== UserStatus.PENDING) {
      res.status(409).json({ message: 'Only pending users can be approved' });
      return;
    }

    const updatedUser = await AdminServices.approveUser(id);
    res.json({ message: 'User approved', user: updatedUser });
  } catch (err) {
    next(err);
  }
};
export const rejectUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.status !== UserStatus.PENDING) {
      res.status(409).json({ message: 'Only pending users can be rejected' });
      return;
    }

    const { reason } = RejectUserSchema.parse(req.body);
    const rejectedUser = await AdminServices.rejectUser(id, reason);
    res.json({ message: 'User rejected', reason, user: rejectedUser });
  } catch (err) {
    next(err);
  }
};