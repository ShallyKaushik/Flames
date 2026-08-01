import Organization from "../models/organization.model.js";

const createOrganization = (data) =>
    Organization.create(data);

const getOrganizations = () =>
    Organization.find()
        .sort({ createdAt: -1 })
        .populate("createdBy", "fullName username");

const getOrganizationById = (id) =>
    Organization.findById(id);

const updateOrganization = (id, data) =>
    Organization.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

const deleteOrganization = (id) =>
    Organization.findByIdAndDelete(id);

export {
    createOrganization,
    getOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
};
