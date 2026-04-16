module.exports = {
  "import-export-entries": {
    enabled: true,
  },
  "drag-drop-content-types": {
    enabled: true,
  },
  superfields: {
    enabled: true,
  },
  i18n: {
    enabled: true,
    config: {
      defaultLocale: "ru",
      locales: ["ru", "en"], // Add other locales if needed
    },
  },
  // migrations: {
  //   enabled: true,
  //   config: {
  //     autoStart: true,
  //     migrationFolderPath: "migrations",
  //   },
  // },
  upload: {
    config: {
      sizeLimit: 300 * 1024 * 1024,
      provider: "local",
      breakpoints: {
        large: 1200,
        medium: 800,
        small: 480,
      },
    },
  },
  transformer: {
    enabled: true,
    config: {
      prefix: "/api/",
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      },
    },
  },
};
