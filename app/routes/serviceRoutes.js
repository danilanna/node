import express from 'express';
import ServiceController from '../controllers/serviceController';
import { checkPermission } from '../middlewares/middlewares';

const routes = express.Router();

const serviceController = new ServiceController();

routes.get('/api/services', checkPermission, async (req, res) => {
  try {
    const services = await serviceController.find(req.query);

    res.json(services);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

routes.post('/api/services', checkPermission, async (req, res) => {
  try {
    const service = await serviceController.create(req.body);

    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

routes.get('/api/services/:id', checkPermission, async (req, res) => {
  try {
    const services = await serviceController.findById(req.params.id);

    res.json(services);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

routes.put('/api/services/:id', checkPermission, async (req, res) => {
  try {
    await serviceController.update(req.params.id, req.body);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

routes.delete('/api/services/:id', checkPermission, async (req, res) => {
  try {
    await serviceController.remove(req.params.id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default routes;
