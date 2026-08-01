import ApiError from "../utils/ApiError.js";
import {
    createOrganization,
    getOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
} from "../repositories/organization.repository.js";

const createOrganizationService = async (data, user) => {
    return await createOrganization({
        ...data,
        createdBy: user._id,
    });
};

const getOrganizationsService = async () => {
    return await getOrganizations();
};

const updateOrganizationService = async (orgId, data) => {
    const org = await getOrganizationById(orgId);
    if (!org) {
        throw new ApiError(404, "Organization not found");
    }
    return await updateOrganization(orgId, data);
};

const deleteOrganizationService = async (orgId) => {
    const org = await getOrganizationById(orgId);
    if (!org) {
        throw new ApiError(404, "Organization not found");
    }
    await deleteOrganization(orgId);
    return true;
};

export {
    createOrganizationService,
    getOrganizationsService,
    updateOrganizationService,
    deleteOrganizationService,
};
