import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TProject, TProjectsState } from './types';

interface TProjectsActions {
  // CRUD operations
  createTProject: (projectData: Omit<TProject, 'id' | 'createdAt' | 'updatedAt'>) => Promise<TProject>;
  updateTProject: (id: string, projectData: Partial<TProject>) => Promise<TProject>;
  deleteTProject: (id: string) => Promise<void>;
  getTProject: (id: string) => Promise<TProject | null>;
  
  // Bulk operations
  loadTProjects: () => Promise<void>;
  createMultipleTProjects: (projects: Omit<TProject, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<TProject[]>;
  deleteMultipleTProjects: (ids: string[]) => Promise<void>;
  
  // TProject management
  setActiveTProject: (project: TProject | null) => void;
  addWorkflowToTProject: (projectId: string, workflowId: string) => Promise<void>;
  removeWorkflowFromTProject: (projectId: string, workflowId: string) => Promise<void>;
  addTeamMemberToTProject: (projectId: string, userId: string) => Promise<void>;
  removeTeamMemberFromTProject: (projectId: string, userId: string) => Promise<void>;
  
  // TProject status management
  updateTProjectStatus: (projectId: string, status: TProject['status']) => Promise<void>;
  archiveTProject: (projectId: string) => Promise<void>;
  restoreTProject: (projectId: string) => Promise<void>;
  
  // TProject analytics and insights
  getTProjectAnalytics: (projectId: string) => Promise<{
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

type TProjectsStore = TTProjectsState & TProjectsActions;

const initialState: TTProjectsState = {
  projects: [],
  activeTProject: null,
  isLoading: false,
  error: null,
};

export const useTProjectsStore = create<TProjectsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // CRUD operations
      createTProject: async (projectData: Omit<TProject, 'id' | 'createdAt' | 'updatedAt'>) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await projectsApi.createTProject(projectData);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newTProject: TProject = {
            ...projectData,
            id: `project-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            projects: [...state.projects, newTProject],
            isLoading: false,
            error: null,
          }));

          return newTProject;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create project',
          });
          throw error;
        }
      },

      updateTProject: async (id: string, projectData: Partial<TProject>) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await projectsApi.updateTProject(id, projectData);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedTProject: TProject = {
            ...projectData,
            id,
            updatedAt: new Date(),
          } as TProject;

          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === id ? { ...project, ...updatedTProject } : project
            ),
            activeTProject: state.activeTProject?.id === id ? updatedTProject : state.activeTProject,
            isLoading: false,
            error: null,
          }));

          return updatedTProject;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update project',
          });
          throw error;
        }
      },

      deleteTProject: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await projectsApi.deleteTProject(id);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            projects: state.projects.filter((project) => project.id !== id),
            activeTProject: state.activeTProject?.id === id ? null : state.activeTProject,
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

      getTProject: async (id: string) => {
        const { projects } = get();
        const project = projects.find((p) => p.id === id);
        
        if (project) {
          return project;
        }

        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await projectsApi.getTProject(id);
          
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
      loadTProjects: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await projectsApi.getTProjects();
          
          // Simulate API call with mock data
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Import mock data from data folder
          const { mockProjects } = await import('@/data');

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

      createMultipleTProjects: async (projects: Omit<TProject, 'id' | 'createdAt' | 'updatedAt'>[]) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await projectsApi.createMultipleTProjects(projects);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const newTProjects: TProject[] = projects.map((projectData) => ({
            ...projectData,
            id: `project-${Date.now()}-${Math.random()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));

          set((state) => ({
            projects: [...state.projects, ...newTProjects],
            isLoading: false,
            error: null,
          }));

          return newTProjects;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create projects',
          });
          throw error;
        }
      },

      deleteMultipleTProjects: async (ids: string[]) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await projectsApi.deleteMultipleTProjects(ids);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            projects: state.projects.filter((project) => !ids.includes(project.id)),
            activeTProject: state.activeTProject && ids.includes(state.activeTProject.id) 
              ? null 
              : state.activeTProject,
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

      // TProject management
      setActiveTProject: (project: TProject | null) => {
        set({ activeTProject: project });
      },

      addWorkflowToTProject: async (projectId: string, workflowId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await projectsApi.addWorkflowToTProject(projectId, workflowId);
          
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
            activeTProject: state.activeTProject?.id === projectId
              ? { 
                  ...state.activeTProject, 
                  workflows: [...state.activeTProject.workflows, workflowId],
                  updatedAt: new Date()
                }
              : state.activeTProject,
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

      removeWorkflowFromTProject: async (projectId: string, workflowId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await projectsApi.removeWorkflowFromTProject(projectId, workflowId);
          
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
            activeTProject: state.activeTProject?.id === projectId
              ? { 
                  ...state.activeTProject, 
                  workflows: state.activeTProject.workflows.filter((id) => id !== workflowId),
                  updatedAt: new Date()
                }
              : state.activeTProject,
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

      addTeamMemberToTProject: async (projectId: string, userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await projectsApi.addTeamMemberToTProject(projectId, userId);
          
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
            activeTProject: state.activeTProject?.id === projectId
              ? { 
                  ...state.activeTProject, 
                  team: [...state.activeTProject.team, userId],
                  updatedAt: new Date()
                }
              : state.activeTProject,
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

      removeTeamMemberFromTProject: async (projectId: string, userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await projectsApi.removeTeamMemberFromTProject(projectId, userId);
          
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
            activeTProject: state.activeTProject?.id === projectId
              ? { 
                  ...state.activeTProject, 
                  team: state.activeTProject.team.filter((id) => id !== userId),
                  updatedAt: new Date()
                }
              : state.activeTProject,
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

      // TProject status management
      updateTProjectStatus: async (projectId: string, status: TProject['status']) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await projectsApi.updateTProjectStatus(projectId, status);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId
                ? { ...project, status, updatedAt: new Date() }
                : project
            ),
            activeTProject: state.activeTProject?.id === projectId
              ? { ...state.activeTProject, status, updatedAt: new Date() }
              : state.activeTProject,
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

      archiveTProject: async (projectId: string) => {
        return await get().updateTProjectStatus(projectId, 'on-hold');
      },

      restoreTProject: async (projectId: string) => {
        return await get().updateTProjectStatus(projectId, 'active');
      },

      // TProject analytics and insights
      getTProjectAnalytics: async (projectId: string) => {
        const { projects } = get();
        const project = projects.find((p) => p.id === projectId);
        
        if (!project) {
          throw new Error('TProject not found');
        }

        // TODO: Replace with actual API call
        // const response = await projectsApi.getTProjectAnalytics(projectId);
        
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
