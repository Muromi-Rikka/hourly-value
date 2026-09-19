import { rentonReact } from "@renton/eslint-config-react";
import shadcnLint from "@shadcn/lint";

export default rentonReact({
  stylistic: {
    quotes: "double",
    semi: true,
  },
}, {
  files: ["pnpm-workspace.yaml"],
  name: "trapar/pnpm-workspace-yaml-trust-policy",
  rules: {
    "pnpm/yaml-enforce-settings": "off",
  },
}, {
  files: ["src/components/react-bits/**"],
  name: "trapar/react-bits-vendor",
  rules: {
    "react-hooks/exhaustive-deps": "off",
    "react/exhaustive-deps": "off",
    "react/naming-convention-ref-name": "off",
    "react/no-array-index-key": "off",
    "react/no-forward-ref": "off",
    "react/no-unknown-property": "off",
    "react/set-state-in-effect": "off",
    "style/indent": "off",
    "unicorn/consistent-function-scoping": "off",
    "unicorn/filename-case": "off",
    "unicorn/name-replacements": "off",
    "unicorn/no-for-each": "off",
    "unicorn/no-top-level-side-effects": "off",
    "unicorn/no-unsafe-string-replacement": "off",
    "unicorn/prefer-await": "off",
    "unicorn/prefer-number-coercion": "off",
    "unicorn/prefer-number-properties": "off",
    "unicorn/prefer-simple-condition-first": "off",
  },
}, {
  plugins: { shadcn: shadcnLint },
});
