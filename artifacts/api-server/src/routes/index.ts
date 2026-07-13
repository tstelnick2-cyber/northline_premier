import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import usersRouter from "./users";
import filesRouter from "./files";
import messagesRouter from "./messages";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(usersRouter);
router.use(filesRouter);
router.use(messagesRouter);

export default router;
