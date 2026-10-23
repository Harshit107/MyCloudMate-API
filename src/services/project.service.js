const ProjectList = require("../modal/ProjectList");
const FileData = require("../modal/FileData");
const AppError = require("../utils/appError");

class ProjectService {
  /**
   * Create a new project for a user
   * @param {string} userId
   * @param {string} projectName
   */
  static async createProject(userId, projectName) {
    if (!projectName || projectName.trim().length === 0) {
      throw AppError.badRequest("Project name is required", "INVALID_PROJECT_NAME");
    }

    const newProject = new ProjectList({
      userId,
      projectName: projectName.trim(),
      isDeleted: false,
    });
    await newProject.save();

    return {
      _id: newProject._id,
      projectName: newProject.projectName,
      userId: newProject.userId,
      createdAt: newProject.createdAt,
    };
  }

  /**
   * Get all active projects and files for the user
   * @param {string} userId
   */
  static async getUserProjectsAndFiles(userId) {
    const [projects, files] = await Promise.all([
      ProjectList.find({ userId, isDeleted: false }).sort({ createdAt: -1 }),
      FileData.find({ userId, isDeleted: false }).sort({ createdAt: -1 }),
    ]);

    return {
      projects,
      files,
    };
  }

  /**
   * Soft-delete a project with ownership verification & cascade to files
   * @param {string} userId
   * @param {string} projectId
   */
  static async deleteProject(userId, projectId) {
    if (!projectId) {
      throw AppError.badRequest("Project ID is required", "MISSING_PROJECT_ID");
    }

    const project = await ProjectList.findOne({ _id: projectId, userId, isDeleted: false });
    if (!project) {
      throw AppError.notFound("Project not found or unauthorized", "PROJECT_NOT_FOUND");
    }

    if (project.projectName === "Default Project") {
      throw AppError.forbidden("Default Project cannot be deleted", "CANNOT_DELETE_DEFAULT_PROJECT");
    }

    project.isDeleted = true;
    await project.save();

    // Cascade soft delete to all files associated with this project
    await FileData.updateMany({ projectId, userId }, { isDeleted: true });

    return {
      projectId: project._id,
      projectName: project.projectName,
      isDeleted: true,
    };
  }
}

module.exports = ProjectService;
