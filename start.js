const tsConfigPaths = require('tsconfig-paths');
const tsConfig = require('./tsconfig.json');

// Register the paths from tsconfig.json
tsConfigPaths.register({
  baseUrl: './dist',
  paths: {
    '@/*': ['*'],
    '@config/*': ['config/*'],
    '@models/*': ['models/*'],
    '@controllers/*': ['controllers/*'],
    '@services/*': ['services/*'],
    '@repositories/*': ['repositories/*'],
    '@middlewares/*': ['middlewares/*'],
    '@routes/*': ['routes/*'],
    '@utils/*': ['utils/*']
  }
});

// Now require the main application
require('./dist/index.js');
