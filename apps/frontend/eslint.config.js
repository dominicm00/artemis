import reactConfig from "@artemis/eslint-config/react";

export default [
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...reactConfig,
];
