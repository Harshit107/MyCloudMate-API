const ProjectService = require("../services/project.service");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { validateProjectInput } = require("../utils/validator");

class ProjectController {
  /**
   * POST /project/create
   */
  static createProject = asyncHandler(async (req, res) => {
    const { projectName } = validateProjectInput(req.body);
    const project = await ProjectService.createProject(req.user._id, projectName);

    return ApiResponse.success(
      res,
      "Project created successfully",
      project,
      201,
      // Backward compatibility fields for legacy clients
      { _id: project._id }
    );
  });

  /**
   * GET /project/get
   */
  static getProjects = asyncHandler(async (req, res) => {
    const data = await ProjectService.getUserProjectsAndFiles(req.user._id);

    return ApiResponse.success(
      res,
      "Projects and files retrieved successfully",
      data,
      200,
      // Backward compatibility field for legacy clients expecting response.message
      { message: data }
    );
  });

  /**
   * POST /project/delete
   */
  static deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.body;
    const result = await ProjectService.deleteProject(req.user._id, projectId);

    return ApiResponse.success(res, "Project deleted successfully", result, 200);
  });
}

module.exports = ProjectController;
