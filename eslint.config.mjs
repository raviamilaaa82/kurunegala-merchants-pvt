import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
    ...nextVitals,
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;


// import js from "@eslint/js";

// export default [
//     js.configs.recommended,
// ];




// import { defineConfig, globalIgnores } from 'eslint/config';
// import nextVitals from 'eslint-config-next/core-web-vitals';

// const eslintConfig = defineConfig([
//     ...nextVitals,
//     globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
// ]);

// export default eslintConfig;