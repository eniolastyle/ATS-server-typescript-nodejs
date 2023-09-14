import { Request, Response } from 'express';
import { Application } from '../models/application.model';

const applications: Application[] = [
  {
    id: 1,
    name: 'Ali Ahmad',
    position: 'Software Engineer',
    status: 'Pending',
  },
  {
    id: 2,
    name: 'AbdulLahi Abu',
    position: 'Product Manager',
    status: 'Accepted',
  },
];

// Get all Apps
export const getAllApplications = (req: Request, res: Response) => {
  res.status(200).json(applications);
};

// Get single Apps
export const getSingleApplication = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const application = applications.find((app) => app.id === id);

  if (!application) {
    res.status(404).json({ error: 'Application not found' });
  } else {
    res.status(200).json(application);
  }
};

// Create single Apps
export const createApplication = (req: Request, res: Response) => {
  const { name, position, status } = req.body;
  const id = applications.length + 1;
  const newApplication: Application = { id, name, position, status };
  applications.push(newApplication);
  res.status(201).json(newApplication);
};

// Update App
export const updateApplication = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedApplication: Application = req.body;

  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Application not found' });
  } else {
    applications[index] = { ...applications[index], ...updatedApplication };
    res.json({
      message: 'Application udated successfully',
      application: applications[index],
    });
  }
};

// Delete App
export const deleteApplication = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Application not found' });
  } else {
    applications.splice(index, 1);
    res.json({ message: 'Application deleted successfully.' });
  }
};
