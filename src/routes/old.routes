import { Router } from 'express';
import {
  getAllApplications,
  getSingleApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/application.controller';

const router = Router();

// Route Definitions
// router.get('/applications', getAllApplications);
// router.post('/applications', createApplication);
// router.get('/applications/:id', getSingleApplication);
// router.put('/applications/:id', updateApplication);
// router.delete('/applications/:id', deleteApplication);

router.route('/applications').get(getAllApplications).post(createApplication);
router
  .route('/applications/:id')
  .get(getSingleApplication)
  .put(updateApplication)
  .delete(deleteApplication);

export default router;
