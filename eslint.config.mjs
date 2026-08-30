import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * eslint-config-next 16 ships native flat configs. The FlatCompat bridge that
 * older Next templates use throws a circular-reference error against them.
 */
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "screenshots/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
