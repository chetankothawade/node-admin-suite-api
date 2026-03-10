import { sendResponse, handleError } from "../utils/response.js";
import { cmsService } from "../services/cms.service.js";

/**
 * @desc List CMS pages with pagination/search
 * @route GET /cms/list
 * @access Authenticated
 */
export const listCms = async (req, res) => {
  try {
    const data = await cmsService.listCms(req.query);
    return sendResponse(res, 200, true, "cms.list.success", data);
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Get cms error:" });
  }
};

/**
 * @desc Create CMS page
 * @route POST /cms/create
 * @access Authenticated
 */
export const createCms = async (req, res) => {
  try {
    const cms = await cmsService.createCms(req.body);
    return sendResponse(res, 201, true, "cms.create.success", { cms });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "CMS Create Error:" });
  }
};

/**
 * @desc Update CMS page by UUID
 * @route PUT /cms/update/:uuid
 * @access Authenticated
 */
export const updateCms = async (req, res) => {
  try {
    const cms = await cmsService.updateCms(req.params.uuid, req.body);
    return sendResponse(res, 200, true, "cms.update.success", { cms });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "CMS Update Error:" });
  }
};

/**
 * @desc Delete CMS page by UUID
 * @route DELETE /cms/delete/:uuid
 * @access Authenticated
 */
export const deleteCms = async (req, res) => {
  try {
    await cmsService.deleteCms(req.params.uuid);
    return sendResponse(res, 200, true, "cms.delete.success");
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "CMS Delete Error:" });
  }
};

/**
 * @desc Get CMS page by UUID
 * @route GET /cms/get/:uuid
 * @access Authenticated
 */
export const getCms = async (req, res) => {
  try {
    const cms = await cmsService.getCms(req.params.uuid);
    return sendResponse(res, 200, true, "cms.get.success", { cms });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "CMS Get Error:" });
  }
};

/**
 * @desc Get CMS page by UUID (raw query version)
 * @route GET /cms/get/:uuid
 * @access Authenticated
 */
export const getCms1 = async (req, res) => {
  try {
    const cms = await cmsService.getCms1(req.params.uuid);
    return sendResponse(res, 200, true, "cms.get.success", { cms });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "CMS Get Error:" });
  }
};

/**
 * @desc Update CMS status by UUID
 * @route PUT /cms/status/:uuid
 * @access Authenticated
 */
export const cmsStatus = async (req, res) => {
  try {
    const cms = await cmsService.cmsStatus(req.params.uuid, req.body.status);
    return sendResponse(res, 200, true, "cms.status.success", { cms });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "CMS Status Update Error:" });
  }
};


