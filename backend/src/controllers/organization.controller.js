import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
    createOrganizationService,
    getOrganizationsService,
    updateOrganizationService,
    deleteOrganizationService,
} from "../services/organization.service.js";

const createOrganization = asyncHandler(async (req, res) => {
    const org = await createOrganizationService(req.body, req.user);
    return res.status(201).json(
        new ApiResponse(201, org, "Organization created successfully")
    );
});

const getOrganizations = asyncHandler(async (req, res) => {
    const orgs = await getOrganizationsService();
    return res.status(200).json(
        new ApiResponse(200, orgs, "Organizations fetched successfully")
    );
});

const updateOrganization = asyncHandler(async (req, res) => {
    const org = await updateOrganizationService(req.params.orgId, req.body);
    return res.status(200).json(
        new ApiResponse(200, org, "Organization updated successfully")
    );
});

const deleteOrganization = asyncHandler(async (req, res) => {
    await deleteOrganizationService(req.params.orgId);
    return res.status(200).json(
        new ApiResponse(200, {}, "Organization deleted successfully")
    );
});

export {
    createOrganization,
    getOrganizations,
    updateOrganization,
    deleteOrganization,
};
