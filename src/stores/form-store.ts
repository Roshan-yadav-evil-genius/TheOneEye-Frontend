import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FormConfiguration, FormState } from './types';

interface FormActions {
  // CRUD operations
  createFormConfiguration: (configData: Omit<FormConfiguration, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FormConfiguration>;
  updateFormConfiguration: (id: string, configData: Partial<FormConfiguration>) => Promise<FormConfiguration>;
  deleteFormConfiguration: (id: string) => Promise<void>;
  getFormConfiguration: (id: string) => Promise<FormConfiguration | null>;
  
  // Bulk operations
  loadFormConfigurations: () => Promise<void>;
  createMultipleFormConfigurations: (configs: Omit<FormConfiguration, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<FormConfiguration[]>;
  deleteMultipleFormConfigurations: (ids: string[]) => Promise<void>;
  
  // Form management
  setActiveConfiguration: (config: FormConfiguration | null) => void;
  duplicateConfiguration: (id: string) => Promise<FormConfiguration>;
  exportConfiguration: (id: string) => Promise<string>;
  importConfiguration: (jsonString: string) => Promise<FormConfiguration>;
  
  // Form validation and testing
  validateConfiguration: (config: FormConfiguration) => Promise<{ isValid: boolean; errors: string[] }>;
  testConfiguration: (config: FormConfiguration, testData: Record<string, any>) => Promise<{ success: boolean; result: any; errors: string[] }>;
  
  // Template management
  loadTemplates: () => Promise<FormConfiguration[]>;
  saveAsTemplate: (config: FormConfiguration, templateName: string) => Promise<FormConfiguration>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type FormStore = FormState & FormActions;

const initialState: FormState = {
  configurations: [],
  activeConfiguration: null,
  isLoading: false,
  error: null,
};

export const useFormStore = create<FormStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // CRUD operations
      createFormConfiguration: async (configData: Omit<FormConfiguration, 'id' | 'createdAt' | 'updatedAt'>) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await formApi.createConfiguration(configData);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newConfiguration: FormConfiguration = {
            ...configData,
            id: `form-config-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            configurations: [...state.configurations, newConfiguration],
            isLoading: false,
            error: null,
          }));

          return newConfiguration;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create form configuration',
          });
          throw error;
        }
      },

      updateFormConfiguration: async (id: string, configData: Partial<FormConfiguration>) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await formApi.updateConfiguration(id, configData);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedConfiguration: FormConfiguration = {
            ...configData,
            id,
            updatedAt: new Date(),
          } as FormConfiguration;

          set((state) => ({
            configurations: state.configurations.map((config) =>
              config.id === id ? { ...config, ...updatedConfiguration } : config
            ),
            activeConfiguration: state.activeConfiguration?.id === id ? updatedConfiguration : state.activeConfiguration,
            isLoading: false,
            error: null,
          }));

          return updatedConfiguration;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update form configuration',
          });
          throw error;
        }
      },

      deleteFormConfiguration: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await formApi.deleteConfiguration(id);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            configurations: state.configurations.filter((config) => config.id !== id),
            activeConfiguration: state.activeConfiguration?.id === id ? null : state.activeConfiguration,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete form configuration',
          });
          throw error;
        }
      },

      getFormConfiguration: async (id: string) => {
        const { configurations } = get();
        const config = configurations.find((c) => c.id === id);
        
        if (config) {
          return config;
        }

        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await formApi.getConfiguration(id);
          
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
            error: error instanceof Error ? error.message : 'Failed to fetch form configuration',
          });
          return null;
        }
      },

      // Bulk operations
      loadFormConfigurations: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await formApi.getConfigurations();
          
          // Simulate API call with mock data
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockConfigurations: FormConfiguration[] = [
            {
              id: 'form-config-1',
              name: 'Email Configuration Form',
              description: 'Form for configuring email node settings',
              json: {
                title: 'Email Configuration',
                description: 'Configure email settings for this node',
                elements: [
                  {
                    type: 'text',
                    name: 'recipient',
                    title: 'Recipient Email',
                    isRequired: true,
                    placeholder: 'Enter recipient email address',
                  },
                  {
                    type: 'text',
                    name: 'subject',
                    title: 'Email Subject',
                    isRequired: true,
                    placeholder: 'Enter email subject',
                  },
                  {
                    type: 'comment',
                    name: 'body',
                    title: 'Email Body',
                    isRequired: true,
                    placeholder: 'Enter email content',
                  },
                ],
              },
              nodeId: 'node-1',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
            {
              id: 'form-config-2',
              name: 'Database Query Form',
              description: 'Form for configuring database query parameters',
              json: {
                title: 'Database Query Configuration',
                description: 'Configure database query settings',
                elements: [
                  {
                    type: 'dropdown',
                    name: 'databaseType',
                    title: 'Database Type',
                    isRequired: true,
                    choices: [
                      { value: 'mysql', text: 'MySQL' },
                      { value: 'postgresql', text: 'PostgreSQL' },
                      { value: 'sqlite', text: 'SQLite' },
                    ],
                  },
                  {
                    type: 'text',
                    name: 'query',
                    title: 'SQL Query',
                    isRequired: true,
                    placeholder: 'SELECT * FROM table_name',
                  },
                  {
                    type: 'boolean',
                    name: 'useTransaction',
                    title: 'Use Transaction',
                    defaultValue: false,
                  },
                ],
              },
              nodeId: 'node-2',
              createdAt: new Date('2024-01-02'),
              updatedAt: new Date('2024-01-02'),
            },
          ];

          set({
            configurations: mockConfigurations,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load form configurations',
          });
        }
      },

      createMultipleFormConfigurations: async (configs: Omit<FormConfiguration, 'id' | 'createdAt' | 'updatedAt'>[]) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await formApi.createMultipleConfigurations(configs);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const newConfigurations: FormConfiguration[] = configs.map((configData) => ({
            ...configData,
            id: `form-config-${Date.now()}-${Math.random()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));

          set((state) => ({
            configurations: [...state.configurations, ...newConfigurations],
            isLoading: false,
            error: null,
          }));

          return newConfigurations;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create form configurations',
          });
          throw error;
        }
      },

      deleteMultipleFormConfigurations: async (ids: string[]) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await formApi.deleteMultipleConfigurations(ids);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            configurations: state.configurations.filter((config) => !ids.includes(config.id)),
            activeConfiguration: state.activeConfiguration && ids.includes(state.activeConfiguration.id) 
              ? null 
              : state.activeConfiguration,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete form configurations',
          });
          throw error;
        }
      },

      // Form management
      setActiveConfiguration: (config: FormConfiguration | null) => {
        set({ activeConfiguration: config });
      },

      duplicateConfiguration: async (id: string) => {
        const { configurations } = get();
        const originalConfig = configurations.find((c) => c.id === id);
        
        if (!originalConfig) {
          throw new Error('Configuration not found');
        }

        const duplicatedConfig: Omit<FormConfiguration, 'id' | 'createdAt' | 'updatedAt'> = {
          name: `${originalConfig.name} (Copy)`,
          description: originalConfig.description,
          json: { ...originalConfig.json },
          nodeId: originalConfig.nodeId,
        };

        return await get().createFormConfiguration(duplicatedConfig);
      },

      exportConfiguration: async (id: string) => {
        const { configurations } = get();
        const config = configurations.find((c) => c.id === id);
        
        if (!config) {
          throw new Error('Configuration not found');
        }

        return JSON.stringify(config, null, 2);
      },

      importConfiguration: async (jsonString: string) => {
        try {
          const configData = JSON.parse(jsonString);
          
          // Validate the imported data structure
          if (!configData.name || !configData.json) {
            throw new Error('Invalid configuration format');
          }

          const importedConfig: Omit<FormConfiguration, 'id' | 'createdAt' | 'updatedAt'> = {
            name: configData.name,
            description: configData.description || '',
            json: configData.json,
            nodeId: configData.nodeId,
          };

          return await get().createFormConfiguration(importedConfig);
        } catch (error) {
          throw new Error('Failed to import configuration: ' + (error instanceof Error ? error.message : 'Invalid JSON'));
        }
      },

      // Form validation and testing
      validateConfiguration: async (config: FormConfiguration) => {
        try {
          // TODO: Implement actual validation logic
          // This could include checking for required fields, valid JSON structure, etc.
          
          const errors: string[] = [];
          
          if (!config.name || config.name.trim() === '') {
            errors.push('Configuration name is required');
          }
          
          if (!config.json || typeof config.json !== 'object') {
            errors.push('Configuration JSON is required and must be an object');
          }
          
          if (config.json && !config.json.elements) {
            errors.push('Configuration must have elements array');
          }

          return {
            isValid: errors.length === 0,
            errors,
          };
        } catch (error) {
          return {
            isValid: false,
            errors: [error instanceof Error ? error.message : 'Validation failed'],
          };
        }
      },

      testConfiguration: async (config: FormConfiguration, testData: Record<string, any>) => {
        try {
          // TODO: Implement actual form testing logic
          // This could include rendering the form and validating the test data
          
          const errors: string[] = [];
          
          // Basic validation of test data against form elements
          if (config.json && config.json.elements) {
            for (const element of config.json.elements) {
              if (element.isRequired && (!testData[element.name] || testData[element.name] === '')) {
                errors.push(`Required field '${element.name}' is missing`);
              }
            }
          }

          return {
            success: errors.length === 0,
            result: testData,
            errors,
          };
        } catch (error) {
          return {
            success: false,
            result: null,
            errors: [error instanceof Error ? error.message : 'Testing failed'],
          };
        }
      },

      // Template management
      loadTemplates: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await formApi.getTemplates();
          
          // Simulate API call with mock template data
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockTemplates: FormConfiguration[] = [
            {
              id: 'template-1',
              name: 'Contact Form Template',
              description: 'Standard contact form with name, email, and message fields',
              json: {
                title: 'Contact Form',
                elements: [
                  { type: 'text', name: 'name', title: 'Full Name', isRequired: true },
                  { type: 'text', name: 'email', title: 'Email Address', isRequired: true, inputType: 'email' },
                  { type: 'comment', name: 'message', title: 'Message', isRequired: true },
                ],
              },
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
          ];

          set({
            configurations: [...get().configurations, ...mockTemplates],
            isLoading: false,
            error: null,
          });

          return mockTemplates;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load templates',
          });
          throw error;
        }
      },

      saveAsTemplate: async (config: FormConfiguration, templateName: string) => {
        const templateConfig: Omit<FormConfiguration, 'id' | 'createdAt' | 'updatedAt'> = {
          name: templateName,
          description: `Template based on ${config.name}`,
          json: { ...config.json },
          nodeId: undefined, // Templates don't belong to specific nodes
        };

        return await get().createFormConfiguration(templateConfig);
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
      name: 'form-store',
    }
  )
);
