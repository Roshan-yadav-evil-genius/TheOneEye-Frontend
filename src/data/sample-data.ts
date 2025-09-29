// Sample data for workflow node testing

export const sampleInputData = `[
  {
    "row_number": 2,
    "Name": "Kenneth Smith",
    "Age": 51,
    "master": {
      "c1": 1,
      "c2": 2,
      "nested": {
        "deepkey": "deepValue"
      }
    }
  },
  {
    "row_number": 3,
    "Name": "Jane Doe",
    "Age": 28,
    "master": {
      "c1": 3,
      "c2": 4,
      "nested": {
        "deepkey": "anotherValue"
      }
    }
  }
]`;

export const sampleOutputData = `[
  {
    "row_number": 2,
    "Name": "Kenneth Smith",
    "Age": 51,
    "master": {
      "c1": 1,
      "c2": 2,
      "nested": {
        "deepkey": "deepValue"
      }
    },
    "filtered": true,
    "result": "Age is greater than 50"
  },
  {
    "row_number": 3,
    "Name": "Jane Doe",
    "Age": 28,
    "master": {
      "c1": 3,
      "c2": 4,
      "nested": {
        "deepkey": "anotherValue"
      }
    },
    "filtered": false,
    "result": "Age is not greater than 50"
  }
]`;

// Schema definitions for the data
export const inputSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      row_number: { type: "number" },
      Name: { type: "string" },
      Age: { type: "number" },
      master: {
        type: "object",
        properties: {
          c1: { type: "number" },
          c2: { type: "number" },
          nested: {
            type: "object",
            properties: {
              deepkey: { type: "string" }
            }
          }
        }
      }
    }
  }
};

export const outputSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      row_number: { type: "number" },
      Name: { type: "string" },
      Age: { type: "number" },
      master: {
        type: "object",
        properties: {
          c1: { type: "number" },
          c2: { type: "number" },
          nested: {
            type: "object",
            properties: {
              deepkey: { type: "string" }
            }
          }
        }
      },
      filtered: { type: "boolean" },
      result: { type: "string" }
    }
  }
};
