const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

// Configuration
const BACKEND_URL = 'http://localhost:8080';
const SWAGGER_ENDPOINT = '/swagger/doc.json';
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'lib');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Fetch data from URL
function fetchData(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Convert Swagger 2.0 to OpenAPI 3.0 with proper reference handling
function convertSwaggerToOpenAPI(swaggerSpec) {
  const openapi = {
    openapi: "3.0.0",
    info: {
      title: swaggerSpec.info.title,
      description: swaggerSpec.info.description,
      version: swaggerSpec.info.version,
      contact: swaggerSpec.info.contact || {}
    },
    servers: [
      {
        url: "/"
      }
    ],
    paths: {},
    components: {
      securitySchemes: {},
      schemas: {}
    }
  };

  // Convert security definitions
  if (swaggerSpec.securityDefinitions) {
    Object.keys(swaggerSpec.securityDefinitions).forEach(key => {
      const def = swaggerSpec.securityDefinitions[key];
      openapi.components.securitySchemes[key] = {
        type: def.type,
        name: def.name,
        in: def.in
      };
    });
  }

  // Convert definitions to schemas first (so references can be resolved)
  if (swaggerSpec.definitions) {
    Object.keys(swaggerSpec.definitions).forEach(key => {
      openapi.components.schemas[key] = convertSchemaReferences(swaggerSpec.definitions[key]);
    });
  }

  // Convert paths
  Object.keys(swaggerSpec.paths).forEach(path => {
    const pathItem = swaggerSpec.paths[path];
    openapi.paths[path] = {};
    
    Object.keys(pathItem).forEach(method => {
      const operation = pathItem[method];
      openapi.paths[path][method] = {
        tags: operation.tags || [],
        summary: operation.summary || '',
        security: operation.security || [],
        parameters: [],
        requestBody: undefined,
        responses: {}
      };

      // Convert parameters
      if (operation.parameters) {
        operation.parameters.forEach(param => {
          if (param.in === 'body') {
            // Convert body parameter to requestBody
            openapi.paths[path][method].requestBody = {
              description: param.description || '',
              required: param.required || false,
              content: {
                'application/json': {
                  schema: convertSchemaReferences(param.schema)
                }
              }
            };
          } else {
            // Convert other parameters
            openapi.paths[path][method].parameters.push({
              name: param.name,
              in: param.in,
              description: param.description || '',
              required: param.required || false,
              schema: convertSchemaReferences(param.schema || { type: param.type || 'string' })
            });
          }
        });
      }

      // Convert responses
      if (operation.responses) {
        Object.keys(operation.responses).forEach(statusCode => {
          const response = operation.responses[statusCode];
          openapi.paths[path][method].responses[statusCode] = {
            description: response.description || '',
            content: {
              'application/json': {
                schema: convertSchemaReferences(response.schema)
              }
            }
          };
        });
      }
    });
  });

  return openapi;
}

// Convert schema references from Swagger 2.0 to OpenAPI 3.0 format
function convertSchemaReferences(schema) {
  if (!schema) return schema;
  
  // Handle $ref conversion
  if (schema.$ref && schema.$ref.startsWith('#/definitions/')) {
    return {
      $ref: schema.$ref.replace('#/definitions/', '#/components/schemas/')
    };
  }
  
  // Handle nested schemas
  if (schema.properties) {
    const converted = { ...schema };
    Object.keys(schema.properties).forEach(key => {
      converted.properties[key] = convertSchemaReferences(schema.properties[key]);
    });
    return converted;
  }
  
  // Handle array items
  if (schema.items) {
    return {
      ...schema,
      items: convertSchemaReferences(schema.items)
    };
  }
  
  // Handle allOf, anyOf, oneOf
  if (schema.allOf) {
    return {
      ...schema,
      allOf: schema.allOf.map(s => convertSchemaReferences(s))
    };
  }
  
  if (schema.anyOf) {
    return {
      ...schema,
      anyOf: schema.anyOf.map(s => convertSchemaReferences(s))
    };
  }
  
  if (schema.oneOf) {
    return {
      ...schema,
      oneOf: schema.oneOf.map(s => convertSchemaReferences(s))
    };
  }
  
  return schema;
}

// Main function
async function updateApiSpecs() {
  try {
    console.log('🔄 Fetching latest Swagger specification from backend...');
    
    const swaggerUrl = `${BACKEND_URL}${SWAGGER_ENDPOINT}`;
    const swaggerData = await fetchData(swaggerUrl);
    const swaggerSpec = JSON.parse(swaggerData);
    
    console.log('✅ Successfully fetched Swagger specification');
    
    // Save Swagger 2.0 file
    const swaggerPath = path.join(OUTPUT_DIR, 'swagger.json');
    fs.writeFileSync(swaggerPath, JSON.stringify(swaggerSpec, null, 2));
    console.log(`💾 Saved Swagger 2.0 to: ${swaggerPath}`);
    
    // Convert to OpenAPI 3.0
    console.log('🔄 Converting Swagger 2.0 to OpenAPI 3.0...');
    const openapiSpec = convertSwaggerToOpenAPI(swaggerSpec);
    
    // Save OpenAPI 3.0 file
    const openapiPath = path.join(OUTPUT_DIR, 'openapi.json');
    fs.writeFileSync(openapiPath, JSON.stringify(openapiSpec, null, 2));
    console.log(`💾 Saved OpenAPI 3.0 to: ${openapiPath}`);
    
    // Generate TypeScript types
    console.log('🔄 Generating TypeScript types...');
    try {
      execSync('npx openapi-typescript ./src/lib/openapi.json -o ./src/lib/api-types.ts', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ TypeScript types generated successfully');
    } catch (error) {
      console.error('❌ Error generating TypeScript types:', error.message);
      console.log('You can try running manually: npm run generate-types');
    }
    
    console.log('🎉 API specifications and types updated successfully!');
    console.log('\nNext steps:');
    console.log('1. View API docs at: http://localhost:8080/swagger/index.html');
    console.log('2. Import types from: ./src/lib/api-types.ts');
    
  } catch (error) {
    console.error('❌ Error updating API specifications:', error.message);
    console.log('\nMake sure your backend is running at:', BACKEND_URL);
    process.exit(1);
  }
}

// Run the script
updateApiSpecs();
