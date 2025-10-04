// Sample form configurations for different node types
// These can be used as starting points for form creation

export const sampleFormConfigurations = {
  // Email node form configuration
  email: {
    title: "Email Configuration",
    description: "Configure email settings for this node",
    elements: [
      {
        type: "text",
        name: "recipient",
        title: "Recipient Email",
        isRequired: true,
        inputType: "email",
        placeholder: "Enter recipient email address"
      },
      {
        type: "text",
        name: "subject",
        title: "Email Subject",
        isRequired: true,
        placeholder: "Enter email subject"
      },
      {
        type: "comment",
        name: "body",
        title: "Email Body",
        isRequired: true,
        placeholder: "Enter email content"
      },
      {
        type: "dropdown",
        name: "priority",
        title: "Email Priority",
        choices: [
          { value: "low", text: "Low" },
          { value: "normal", text: "Normal" },
          { value: "high", text: "High" }
        ],
        defaultValue: "normal"
      }
    ]
  },

  // Database node form configuration
  database: {
    title: "Database Configuration",
    description: "Configure database connection and query settings",
    elements: [
      {
        type: "dropdown",
        name: "connectionType",
        title: "Connection Type",
        isRequired: true,
        choices: [
          { value: "mysql", text: "MySQL" },
          { value: "postgresql", text: "PostgreSQL" },
          { value: "sqlite", text: "SQLite" },
          { value: "mongodb", text: "MongoDB" }
        ]
      },
      {
        type: "text",
        name: "host",
        title: "Host",
        isRequired: true,
        placeholder: "localhost"
      },
      {
        type: "text",
        name: "port",
        title: "Port",
        inputType: "number",
        placeholder: "3306"
      },
      {
        type: "text",
        name: "database",
        title: "Database Name",
        isRequired: true,
        placeholder: "Enter database name"
      },
      {
        type: "text",
        name: "username",
        title: "Username",
        isRequired: true,
        placeholder: "Enter username"
      },
      {
        type: "text",
        name: "password",
        title: "Password",
        inputType: "password",
        isRequired: true
      },
      {
        type: "comment",
        name: "query",
        title: "SQL Query",
        isRequired: true,
        placeholder: "SELECT * FROM table_name WHERE condition = ?"
      }
    ]
  },

  // API node form configuration
  api: {
    title: "API Configuration",
    description: "Configure API endpoint and request settings",
    elements: [
      {
        type: "dropdown",
        name: "method",
        title: "HTTP Method",
        isRequired: true,
        choices: [
          { value: "GET", text: "GET" },
          { value: "POST", text: "POST" },
          { value: "PUT", text: "PUT" },
          { value: "DELETE", text: "DELETE" },
          { value: "PATCH", text: "PATCH" }
        ],
        defaultValue: "GET"
      },
      {
        type: "text",
        name: "url",
        title: "API URL",
        isRequired: true,
        placeholder: "https://api.example.com/endpoint"
      },
      {
        type: "comment",
        name: "headers",
        title: "Request Headers (JSON)",
        placeholder: '{"Content-Type": "application/json", "Authorization": "Bearer token"}'
      },
      {
        type: "comment",
        name: "body",
        title: "Request Body (JSON)",
        placeholder: '{"key": "value"}'
      },
      {
        type: "text",
        name: "timeout",
        title: "Timeout (seconds)",
        inputType: "number",
        defaultValue: "30"
      }
    ]
  },

  // Logic node form configuration
  logic: {
    title: "Logic Configuration",
    description: "Configure conditional logic and branching",
    elements: [
      {
        type: "text",
        name: "condition",
        title: "Condition Expression",
        isRequired: true,
        placeholder: "data.field == 'value'"
      },
      {
        type: "comment",
        name: "trueAction",
        title: "Action when condition is true",
        placeholder: "Describe what happens when condition is met"
      },
      {
        type: "comment",
        name: "falseAction",
        title: "Action when condition is false",
        placeholder: "Describe what happens when condition is not met"
      },
      {
        type: "dropdown",
        name: "operator",
        title: "Comparison Operator",
        choices: [
          { value: "==", text: "Equals (==)" },
          { value: "!=", text: "Not Equals (!=)" },
          { value: ">", text: "Greater Than (>)" },
          { value: "<", text: "Less Than (<)" },
          { value: ">=", text: "Greater or Equal (>=)" },
          { value: "<=", text: "Less or Equal (<=)" },
          { value: "contains", text: "Contains" },
          { value: "startsWith", text: "Starts With" },
          { value: "endsWith", text: "Ends With" }
        ],
        defaultValue: "=="
      }
    ]
  },

  // File node form configuration
  file: {
    title: "File Configuration",
    description: "Configure file operations and settings",
    elements: [
      {
        type: "dropdown",
        name: "operation",
        title: "File Operation",
        isRequired: true,
        choices: [
          { value: "read", text: "Read File" },
          { value: "write", text: "Write File" },
          { value: "append", text: "Append to File" },
          { value: "delete", text: "Delete File" },
          { value: "copy", text: "Copy File" },
          { value: "move", text: "Move File" }
        ]
      },
      {
        type: "text",
        name: "filePath",
        title: "File Path",
        isRequired: true,
        placeholder: "/path/to/file.txt"
      },
      {
        type: "text",
        name: "encoding",
        title: "File Encoding",
        choices: [
          { value: "utf8", text: "UTF-8" },
          { value: "ascii", text: "ASCII" },
          { value: "base64", text: "Base64" }
        ],
        defaultValue: "utf8"
      },
      {
        type: "comment",
        name: "content",
        title: "File Content (for write/append operations)",
        placeholder: "Enter content to write to file"
      }
    ]
  }
};

// Helper function to get sample configuration by node category
export const getSampleConfiguration = (category: string) => {
  return sampleFormConfigurations[category as keyof typeof sampleFormConfigurations] || null;
};

// Helper function to get all available sample configurations
export const getAllSampleConfigurations = () => {
  return Object.keys(sampleFormConfigurations);
};
