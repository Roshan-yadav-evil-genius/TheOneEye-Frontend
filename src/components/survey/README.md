# SurveyJS Form Creator Integration

This directory contains the SurveyJS form creator integration for the node creation system. The form creator allows users to design custom forms for each workflow node using a visual drag-and-drop interface.

## Components

### 1. SurveyCreatorComponent (`survey-creator.tsx`)
A React wrapper around the SurveyJS Creator component that provides:
- Visual form designer with drag-and-drop interface
- Real-time JSON schema generation
- Tabbed interface (Designer, Test Survey, JSON Editor, Logic)
- Event handlers for form changes and saves
- Configurable tab visibility

**Props:**
- `initialJson`: Initial form configuration JSON
- `onJsonChanged`: Callback when form JSON changes
- `onSurveySaved`: Callback when form is saved
- `readOnly`: Enable read-only mode
- `showDesignerTab`: Show/hide designer tab
- `showTestSurveyTab`: Show/hide test survey tab
- `showJSONEditorTab`: Show/hide JSON editor tab
- `showLogicTab`: Show/hide logic tab

### 2. SurveyPreview (`survey-preview.tsx`)
A component for previewing and testing forms:
- Renders forms from JSON configuration
- Supports form completion and value change events
- Read-only mode support
- Real-time form validation

**Props:**
- `json`: Form configuration JSON
- `onComplete`: Callback when form is completed
- `onValueChanged`: Callback when form values change
- `readOnly`: Enable read-only mode

### 3. FormConfigurationManager (`form-configuration-manager.tsx`)
A comprehensive form management component that combines:
- SurveyJS Creator integration
- Form preview functionality
- JSON export/import capabilities
- Form statistics display
- Tabbed interface for different views

**Features:**
- **Designer Tab**: Visual form builder
- **Preview Tab**: Live form preview
- **JSON Tab**: Raw JSON editor/viewer
- **Export/Import**: Download/upload form configurations
- **Statistics**: Shows question count and form complexity

## Integration with Node Creation

The form creator is integrated into the node creation process through the `CreateNodePage` component:

1. **Tabbed Interface**: Node creation now has two tabs:
   - **Node Details**: Basic node information (name, type, category, etc.)
   - **Form Configuration**: SurveyJS form creator

2. **State Management**: Form configuration is stored in the node's `formConfiguration` field

3. **JSON Schema**: The form creator outputs a JSON schema that can be used with SurveyJS to render the form

## Sample Form Configurations

The system includes pre-built form configurations for common node types in `sample-form-configurations.ts`:

- **Email**: Email configuration forms
- **Database**: Database connection and query forms
- **API**: API endpoint and request configuration
- **Logic**: Conditional logic and branching forms
- **File**: File operation configuration

## Usage Example

```tsx
import { FormConfigurationManager } from "@/components/survey/form-configuration-manager";

function MyComponent() {
  const [formConfig, setFormConfig] = useState({});

  const handleFormChange = (json) => {
    setFormConfig(json);
  };

  return (
    <FormConfigurationManager
      initialJson={formConfig}
      onJsonChanged={handleFormChange}
      onSave={handleFormChange}
    />
  );
}
```

## JSON Schema Structure

The form creator generates JSON schemas compatible with SurveyJS. Example structure:

```json
{
  "title": "Form Title",
  "description": "Form description",
  "elements": [
    {
      "type": "text",
      "name": "fieldName",
      "title": "Field Label",
      "isRequired": true,
      "placeholder": "Enter value"
    }
  ]
}
```

## Supported Form Elements

The SurveyJS Creator supports a wide variety of form elements:
- Text inputs (single line, multi-line, email, password, etc.)
- Choice questions (dropdown, radio, checkbox, etc.)
- Rating scales
- Date/time pickers
- File uploads
- Matrix questions
- Dynamic panels
- Custom HTML elements

## Styling

The components use SurveyJS's default styling with CSS imports:
- `survey-core/survey-core.css`: Core SurveyJS styles
- `survey-creator-core/survey-creator-core.css`: Creator-specific styles

## Future Enhancements

Potential improvements for the form creator system:
1. **Template Library**: Pre-built form templates for common use cases
2. **Conditional Logic**: Advanced conditional logic builder
3. **Validation Rules**: Custom validation rule builder
4. **Theme Customization**: Custom styling and theming options
5. **Form Analytics**: Usage analytics and form performance metrics
6. **Collaboration**: Multi-user form editing capabilities
7. **Version Control**: Form versioning and change tracking
