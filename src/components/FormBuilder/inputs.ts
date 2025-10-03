// Re-export widget types from centralized types
export { WidgetConfig, WidgetType, WidgetDefinition } from '@/types/forms';

export const WIDGET_DEFINITIONS: WidgetDefinition[] = [
  {
    type: 'text',
    label: 'Text Input',
    icon: 'Type',
    description: 'Single line text input',
    defaultConfig: {
      placeholder: 'Enter text...',
      required: false,
    },
  },
  {
    type: 'email',
    label: 'Email Input',
    icon: 'Mail',
    description: 'Email address input with validation',
    defaultConfig: {
      placeholder: 'Enter email...',
      required: false,
    },
  },
  {
    type: 'password',
    label: 'Password Input',
    icon: 'Lock',
    description: 'Password input field',
    defaultConfig: {
      placeholder: 'Enter password...',
      required: false,
    },
  },
  {
    type: 'number',
    label: 'Number Input',
    icon: 'Hash',
    description: 'Numeric input field',
    defaultConfig: {
      placeholder: 'Enter number...',
      required: false,
    },
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: 'AlignLeft',
    description: 'Multi-line text input',
    defaultConfig: {
      placeholder: 'Enter text...',
      required: false,
    },
  },
  {
    type: 'select',
    label: 'Select Dropdown',
    icon: 'ChevronDown',
    description: 'Dropdown selection',
    defaultConfig: {
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: false,
    },
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: 'CheckSquare',
    description: 'Single checkbox',
    defaultConfig: {
      required: false,
    },
  },
  {
    type: 'radio',
    label: 'Radio Group',
    icon: 'Circle',
    description: 'Radio button group',
    defaultConfig: {
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: false,
    },
  },
  {
    type: 'date',
    label: 'Date Picker',
    icon: 'Calendar',
    description: 'Date selection input',
    defaultConfig: {
      required: false,
    },
  },
  {
    type: 'file',
    label: 'File Upload',
    icon: 'Upload',
    description: 'File upload input',
    defaultConfig: {
      required: false,
    },
  },
];

export const generateWidgetId = (): string => {
  return `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
