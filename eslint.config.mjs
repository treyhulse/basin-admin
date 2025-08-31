import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable some of the stricter rules
      "@typescript-eslint/no-unused-vars": "warn", // Change from error to warning
      "@typescript-eslint/no-explicit-any": "warn", // Allow 'any' types with warning
      "react-hooks/exhaustive-deps": "warn", // Change from error to warning
      "prefer-const": "warn", // Change from error to warning
      "no-console": "off", // Allow console.log statements
      "no-debugger": "warn", // Change from error to warning
      
      // Relax some React rules
      "react/no-unescaped-entities": "off", // Allow unescaped entities
      "react/display-name": "off", // Don't require display names for components
      
      // Relax some TypeScript rules
      "@typescript-eslint/ban-ts-comment": "warn", // Allow @ts-ignore with warning
      "@typescript-eslint/no-non-null-assertion": "warn", // Allow ! operator with warning
      
      // Relax some import rules
      "import/no-unused-modules": "off", // Don't check for unused modules
      "import/order": "off", // Don't enforce import order
      
      // Relax some general rules
      "no-unused-expressions": "warn", // Change from error to warning
      "prefer-promise-reject-errors": "warn", // Change from error to warning
    },
  },
];

export default eslintConfig;
