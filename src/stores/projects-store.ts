import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Project, ProjectsState } from './types';

interface ProjectsActions {
  // CRUD operations
  createProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (id: string, projectData: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Promise<Project | null>;
  
  // Bulk operations
  loadProjects: () => Promise<void>;
  createMultipleProjects: (projects: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<Project[]>;
  deleteMultipleProjects: (ids: string[]) => Promise<void>;
  
  // Project management
  setActiveProject: (project: Project | null) => void;
  addWorkflowToProject: (projectId: string, workflowId: string) => Promise<void>;
  removeWorkflowFromProject: (projectId: string, workflowId: string) => Promise<void>;
  addTeamMemberToProject: (projectId: string, userId: string) => Promise<void>;
  removeTeamMemberFromProject: (projectId: string, userId: string) => Promise<void>;
  
  // Project status management
  updateProjectStatus: (projectId: string, status: Project['status']) => Promise<void>;
  archiveProject: (projectId: string) => Promise<void>;
  restoreProject: (projectId: string) => Promise<void>;
  
  // Project analytics and insights
  getProjectAnalytics: (projectId: string) => Promise<{
    totalWorkflows: number;
    activeWorkflows: number;
    completedWorkflows: number;
    teamMembers: number;
    lastActivity: Date;
  }>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type ProjectsStore = ProjectsState & ProjectsActions;

const initialState: ProjectsState = {
  projects: [],
  activeProject: null,
  isLoading: false,
  error: null,
};

export const useProjectsStore = create<ProjectsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // CRUD operations
      createProject: async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await projectsApi.createProject(projectData);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newProject: Project = {
            ...projectData,
            id: `project-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            projects: [...state.projects, newProject],
            isLoading: false,
            error: null,
          }));

          return newProject;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create project',
          });
          throw error;
        }
      },

      updateProject: async (id: string, projectData: Partial<Project>) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await projectsApi.updateProject(id, projectData);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedProject: Project = {
            ...projectData,
            id,
            updatedAt: new Date(),
          } as Project;

          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === id ? { ...project, ...updatedProject } : project
            ),
            activeProject: state.activeProject?.id === id ? updatedProject : state.activeProject,
            isLoading: false,
            error: null,
          }));

          return updatedProject;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update project',
          });
          throw error;
        }
      },

      deleteProject: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await projectsApi.deleteProject(id);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            projects: state.projects.filter((project) => project.id !== id),
            activeProject: state.activeProject?.id === id ? null : state.activeProject,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete project',
          });
          throw error;
        }
      },

      getProject: async (id: string) => {
        const { projects } = get();
        const project = projects.find((p) => p.id === id);
        
        if (project) {
          return project;
        }

        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await projectsApi.getProject(id);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // For now, return null if not found in local state
          set({
            isLoading: false,
            error: null,
          });
          
          return null;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch project',
          });
          return null;
        }
      },

      // Bulk operations
      loadProjects: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await projectsApi.getProjects();
          
          // Simulate API call with mock data
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Import mock data from dummy folder
          const { mockProjects } = await import('@/dummy');

          set({
            projects: mockProjects,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load projects',
          });
        }
      },

      createMultipleProjects: async (projects: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[]) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await projectsApi.createMultipleProjects(projects);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const newProjects: Project[] = projects.map((projectData) => ({
            ...projectData,
            id: `project-${Date.now()}-${Math.random()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));

          set((state) => ({
            projects: [...state.projects, ...newProjects],
            isLoading: false,
            error: null,
          }));

          return newProjects;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create projects',
          });
          throw error;
        }
      },

      deleteMultipleProjects: async (ids: string[]) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await projectsApi.deleteMultipleProjects(ids);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            projects: state.projects.filter((project) => !ids.includes(project.id)),
            activeProject: state.activeProject && ids.includes(state.activeProject.id) 
              ? null 
              : state.activeProject,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete projects',
          });
          throw error;
        }
      },

      // Project management
      setActiveProject: (project: Project | null) => {
        set({ activeProject: project });
      },

      addWorkflowToProject: async (projectId: string, workflowId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await projectsApi.addWorkflowToProject(projectId, workflowId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId
                ? { 
                    ...project, 
                    workflows: [...project.workflows, workflowId],
                    updatedAt: new Date()
                  }
                : project
            ),
            activeProject: state.activeProject?.id === projectId
              ? { 
                  ...state.activeProject, 
                  workflows: [...state.activeProject.workflows, workflowId],
                  updatedAt: new Date()
                }
              : state.activeProject,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to add workflow to project',
          });
          throw error;
        }
      },

      removeWorkflowFromProject: async (projectId: string, workflowId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await projectsApi.removeWorkflowFromProject(projectId, workflowId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId
                ? { 
                    ...project, 
                    workflows: project.workflows.filter((id) => id !== workflowId),
                    updatedAt: new Date()
                  }
                : project
            ),
            activeProject: state.activeProject?.id === projectId
              ? { 
                  ...state.activeProject, 
                  workflows: state.activeProject.workflows.filter((id) => id !== workflowId),
                  updatedAt: new Date()
                }
              : state.activeProject,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to remove workflow from project',
          });
          throw error;
        }
      },

      addTeamMemberToProject: async (projectId: string, userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await projectsApi.addTeamMemberToProject(projectId, userId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId
                ? { 
                    ...project, 
                    team: [...project.team, userId],
                    updatedAt: new Date()
                  }
                : project
            ),
            activeProject: state.activeProject?.id === projectId
              ? { 
                  ...state.activeProject, 
                  team: [...state.activeProject.team, userId],
                  updatedAt: new Date()
                }
              : state.activeProject,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to add team member to project',
          });
          throw error;
        }
      },

      removeTeamMemberFromProject: async (projectId: string, userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await projectsApi.removeTeamMemberFromProject(projectId, userId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId
                ? { 
                    ...project, 
                    team: project.team.filter((id) => id !== userId),
                    updatedAt: new Date()
                  }
                : project
            ),
            activeProject: state.activeProject?.id === projectId
              ? { 
                  ...state.activeProject, 
                  team: state.activeProject.team.filter((id) => id !== userId),
                  updatedAt: new Date()
                }
              : state.activeProject,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to remove team member from project',
          });
          throw error;
        }
      },

      // Project status management
      updateProjectStatus: async (projectId: string, status: Project['status']) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await projectsApi.updateProjectStatus(projectId, status);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId
                ? { ...project, status, updatedAt: new Date() }
                : project
            ),
            activeProject: state.activeProject?.id === projectId
              ? { ...state.activeProject, status, updatedAt: new Date() }
              : state.activeProject,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update project status',
          });
          throw error;
        }
      },

      archiveProject: async (projectId: string) => {
        return await get().updateProjectStatus(projectId, 'on-hold');
      },

      restoreProject: async (projectId: string) => {
        return await get().updateProjectStatus(projectId, 'active');
      },

      // Project analytics and insights
      getProjectAnalytics: async (projectId: string) => {
        const { projects } = get();
        const project = projects.find((p) => p.id === projectId);
        
        if (!project) {
          throw new Error('Project not found');
        }

        // TODO: Replace with actual API call
        // const response = await projectsApi.getProjectAnalytics(projectId);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock analytics data
        return {
          totalWorkflows: project.workflows.length,
          activeWorkflows: Math.floor(project.workflows.length * 0.7), // Mock: 70% active
          completedWorkflows: Math.floor(project.workflows.length * 0.3), // Mock: 30% completed
          teamMembers: project.team.length,
          lastActivity: project.updatedAt,
        };
      },

      // Utility actions
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'projects-store',
    }
  )
);
