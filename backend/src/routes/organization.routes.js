import { Router } from "express";
import {
    createOrganization,
    getOrganizations,
    updateOrganization,
    deleteOrganization,
} from "../controllers/organization.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { organizationValidationRules } from "../validators/organization.validator.js";

const router = Router();

router.get("/", verifyJWT, getOrganizations);

router.use(verifyJWT, isAdmin);

router.post("/", validate(organizationValidationRules), createOrganization);
router.put("/:orgId", validate(organizationValidationRules), updateOrganization);
router.delete("/:orgId", deleteOrganization);

export default router;
