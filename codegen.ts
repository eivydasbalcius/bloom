
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:10048/graphql",
  documents: "src/gql/queries.ts", 
  generates: {
    "src/gql/generated/": {
      preset: "client",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ]
    }
  }
};

export default config;
