// Utility functions to convert between SurveyJS JSON format and our custom format

import { FormConfiguration, FormField, FormFieldType } from "./types";

/**
 * Converts SurveyJS JSON format to our custom form configuration format
 */
export function convertSurveyJSJsonToCustomFormat(surveyJSJson: any): FormConfiguration {
  if (!surveyJSJson || typeof surveyJSJson !== 'object') {
    throw new Error('Invalid SurveyJS JSON format');
  }

  const elements: FormField[] = [];

  // Handle different SurveyJS structures
  if (surveyJSJson.elements && Array.isArray(surveyJSJson.elements)) {
    // Direct elements array
    elements.push(...surveyJSJson.elements.map(convertSurveyJSElement));
  } else if (surveyJSJson.pages && Array.isArray(surveyJSJson.pages)) {
    // Pages structure
    surveyJSJson.pages.forEach((page: any) => {
      if (page.elements && Array.isArray(page.elements)) {
        elements.push(...page.elements.map(convertSurveyJSElement));
      }
    });
  } else if (surveyJSJson.questions && Array.isArray(surveyJSJson.questions)) {
    // Questions structure
    elements.push(...surveyJSJson.questions.map(convertSurveyJSElement));
  }

  return {
    title: surveyJSJson.title || surveyJSJson.name || '',
    description: surveyJSJson.description || '',
    elements,
    showProgressBar: surveyJSJson.showProgressBar || false,
    showQuestionNumbers: surveyJSJson.showQuestionNumbers || false,
    completeText: surveyJSJson.completeText || 'Complete',
    pageNextText: surveyJSJson.pageNextText || 'Next',
    pagePrevText: surveyJSJson.pagePrevText || 'Previous',
    startSurveyText: surveyJSJson.startSurveyText || 'Start Survey',
    // Preserve additional metadata
    logo: surveyJSJson.logo,
    locale: surveyJSJson.locale,
    showTitle: surveyJSJson.showTitle,
    showDescription: surveyJSJson.showDescription,
  };
}

/**
 * Converts a single SurveyJS element to our custom field format
 */
function convertSurveyJSElement(element: any): FormField {
  const field: FormField = {
    type: mapSurveyJSTypeToCustomType(element.type),
    name: element.name || element.valueName || '',
    title: element.title || element.name || '',
    description: element.description || '',
    placeholder: element.placeholder || '',
    isRequired: element.isRequired || false,
    defaultValue: element.defaultValue || element.defaultValueExpression || undefined,
  };

  // Handle specific field type properties
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'tel':
    case 'url':
      if (element.inputType) {
        field.inputType = element.inputType;
      }
      if (element.min) field.min = element.min;
      if (element.max) field.max = element.max;
      if (element.step) field.step = element.step;
      if (element.minLength) field.minLength = element.minLength;
      if (element.maxLength) field.maxLength = element.maxLength;
      if (element.pattern) field.pattern = element.pattern;
      break;

    case 'comment':
      if (element.rows) field.rows = element.rows;
      if (element.minLength) field.minLength = element.minLength;
      if (element.maxLength) field.maxLength = element.maxLength;
      break;

    case 'dropdown':
    case 'radio':
      if (element.choices && Array.isArray(element.choices)) {
        field.choices = element.choices.map((choice: any) => ({
          value: choice.value || choice.text || '',
          text: choice.text || choice.value || '',
        }));
      }
      break;

    case 'checkbox':
    case 'boolean':
      // Checkbox fields are already handled by the base mapping
      break;

    case 'file':
      // File fields are already handled by the base mapping
      break;

    case 'date':
    case 'time':
    case 'datetime':
      if (element.min) field.min = element.min;
      if (element.max) field.max = element.max;
      if (element.step) field.step = element.step;
      break;
  }

  // Handle validation
  if (element.validators && Array.isArray(element.validators)) {
    const requiredValidator = element.validators.find((v: any) => v.type === 'required');
    if (requiredValidator) {
      field.isRequired = true;
      if (requiredValidator.text) {
        field.validation = {
          message: requiredValidator.text,
        };
      }
    }
  }

  // Handle conditional logic
  if (element.visibleIf || element.enableIf) {
    // For now, we'll store the condition but not implement the logic
    // This could be extended in the future
    field.conditional = {
      dependsOn: '', // Would need to parse the condition
      condition: element.visibleIf || element.enableIf,
      value: true,
    };
  }

  return field;
}

/**
 * Maps SurveyJS field types to our custom field types
 */
function mapSurveyJSTypeToCustomType(surveyJSType: string): FormFieldType {
  const typeMap: Record<string, FormFieldType> = {
    'text': 'text',
    'comment': 'comment',
    'dropdown': 'dropdown',
    'checkbox': 'checkbox',
    'radiogroup': 'radio',
    'boolean': 'boolean',
    'file': 'file',
    'multipletext': 'text', // Convert to text for simplicity
    'matrix': 'text', // Convert to text for simplicity
    'matrixdropdown': 'text', // Convert to text for simplicity
    'matrixdynamic': 'text', // Convert to text for simplicity
    'paneldynamic': 'text', // Convert to text for simplicity
    'panel': 'text', // Convert to text for simplicity
    'html': 'text', // Convert to text for simplicity
    'expression': 'text', // Convert to text for simplicity
    'rating': 'number', // Convert to number
    'ranking': 'text', // Convert to text for simplicity
    'imagepicker': 'text', // Convert to text for simplicity
    'image': 'text', // Convert to text for simplicity
    'buttongroup': 'radio', // Convert to radio
    'signaturepad': 'text', // Convert to text for simplicity
    'date': 'date',
    'datetime': 'datetime',
    'time': 'time',
  };

  return typeMap[surveyJSType] || 'text';
}

/**
 * Converts our custom form configuration back to SurveyJS JSON format
 */
export function convertCustomFormatToSurveyJSJson(config: FormConfiguration): any {
  const surveyJSJson: any = {
    title: config.title || '',
    description: config.description || '',
    showProgressBar: config.showProgressBar || false,
    showQuestionNumbers: config.showQuestionNumbers || false,
    completeText: config.completeText || 'Complete',
    pageNextText: config.pageNextText || 'Next',
    pagePrevText: config.pagePrevText || 'Previous',
    startSurveyText: config.startSurveyText || 'Start Survey',
    elements: config.elements.map(convertCustomFieldToSurveyJS),
  };

  return surveyJSJson;
}

/**
 * Converts a custom field to SurveyJS element format
 */
function convertCustomFieldToSurveyJS(field: FormField): any {
  const element: any = {
    type: mapCustomTypeToSurveyJSType(field.type),
    name: field.name,
    title: field.title,
    description: field.description,
    placeholder: field.placeholder,
    isRequired: field.isRequired || false,
  };

  if (field.defaultValue !== undefined) {
    element.defaultValue = field.defaultValue;
  }

  // Handle specific field type properties
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'tel':
    case 'url':
      if (field.inputType) element.inputType = field.inputType;
      if (field.min !== undefined) element.min = field.min;
      if (field.max !== undefined) element.max = field.max;
      if (field.step !== undefined) element.step = field.step;
      if (field.minLength !== undefined) element.minLength = field.minLength;
      if (field.maxLength !== undefined) element.maxLength = field.maxLength;
      if (field.pattern) element.pattern = field.pattern;
      break;

    case 'comment':
      if (field.rows) element.rows = field.rows;
      if (field.minLength !== undefined) element.minLength = field.minLength;
      if (field.maxLength !== undefined) element.maxLength = field.maxLength;
      break;

    case 'dropdown':
    case 'radio':
      if (field.choices) {
        element.choices = field.choices.map(choice => ({
          value: choice.value,
          text: choice.text,
        }));
      }
      break;

    case 'date':
    case 'time':
    case 'datetime':
      if (field.min !== undefined) element.min = field.min;
      if (field.max !== undefined) element.max = field.max;
      if (field.step !== undefined) element.step = field.step;
      break;
  }

  // Handle validation
  if (field.isRequired && field.validation?.message) {
    element.validators = [
      {
        type: 'required',
        text: field.validation.message,
      },
    ];
  }

  return element;
}

/**
 * Maps our custom field types to SurveyJS field types
 */
function mapCustomTypeToSurveyJSType(customType: FormFieldType): string {
  const typeMap: Record<FormFieldType, string> = {
    'text': 'text',
    'email': 'text',
    'password': 'text',
    'number': 'text',
    'tel': 'text',
    'url': 'text',
    'comment': 'comment',
    'dropdown': 'dropdown',
    'checkbox': 'checkbox',
    'boolean': 'boolean',
    'radio': 'radiogroup',
    'file': 'file',
    'date': 'date',
    'time': 'time',
    'datetime': 'datetime',
  };

  return typeMap[customType] || 'text';
}
