import { Router, type IRouter } from "express";
import healthRouter from "./health";
import requirementsRouter from "./requirements";
import brokersRouter from "./brokers";
import laborFlowRouter from "./labor-flow";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(requirementsRouter);
router.use(brokersRouter);
router.use(laborFlowRouter);
router.use(dashboardRouter);

export default router;
