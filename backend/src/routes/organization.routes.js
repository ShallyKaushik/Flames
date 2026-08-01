import { Router } from "express";
import {
    createOrganization,
    getOrganizations,
    updateOrganization,
    deleteOrganization,
} from "../controllers/organization.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import verifyAdmin from "../middlewares/admin.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { organizationValidationRules } from "../validators/organization.validator.js";

const router = Router();

router.get("/", verifyJWT, getOrganizations);

router.use(verifyJWT, verifyAdmin);

router.post("/", organizationValidationRules, validate, createOrganization);
router.put("/:orgId", organizationValidationRules, validate, updateOrganization);
router.delete("/:orgId", deleteOrganization);

export default router;
