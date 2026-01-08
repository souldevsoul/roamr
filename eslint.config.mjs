import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Brand checking rule - prevent "esimfly" mentions
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/esimfly/i]",
          message: "Use 'ROAMR' instead of 'esimfly'"
        },
        {
          selector: "TemplateElement[value.raw=/esimfly/i]",
          message: "Use 'ROAMR' instead of 'esimfly'"
        }
      ]
    }
  }
]);

export default eslintConfig;
