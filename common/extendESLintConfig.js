const path = require('path');

const extendESLintConfig = (config) => {
  const importNoUnresolved = config.rules['import/no-unresolved'];
  if (importNoUnresolved ) {
    const originalIgnore = importNoUnresolved[1].ignore;
    if (!originalIgnore.includes('@2uinc/frontend-enterprise-*')) {
      importNoUnresolved[1].ignore = [...originalIgnore, '@2uinc/frontend-enterprise-*'];
    }
  }
};

module.exports =  extendESLintConfig;
