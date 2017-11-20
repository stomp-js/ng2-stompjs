
'use strict';

const path = require('path');

module.exports = function(config) {
   config.set({
      basePath: path.join(__dirname, '..'),
      files: [{
            pattern: 'test/base.spec.ts'
         },
         {
            pattern: 'src/**/*.+(ts|html)'
         }
      ],
      frameworks: ['jasmine', 'karma-typescript'],
      karmaTypescriptConfig: {
         tsconfig: 'src/tsconfig-test.json',
         bundlerOptions: {
            directories: [
               path.resolve(process.cwd(), 'node_modules'),
               path.resolve(process.cwd(), 'src')
            ],
            entrypoints: /\.spec\.ts$/,
            transforms: [
               require("karma-typescript-angular2-transform")
            ]
         },
         coverageOptions: {
            exclude: /(\.d|\.spec|\.module|\.routing|index|barrels|public_api)\.ts/i,
            instrumentation: true
         },
         reports: {
            'cobertura': {
               'directory': 'coverage',
               'subdirectory': '.',
               'filename': 'coverage.xml'
            },
            'lcovonly':  {
               'directory': 'coverage',
               'subdirectory': '.',
               'filename': 'lcovUT.info'
            },
            'html': {
               'directory': 'coverage',
               'subdirectory': '.'
            },
            'text-summary': null,
            'json': './coverage/coverage',
         }
      },

      preprocessors: {
         "src/**/*.ts": ["karma-typescript"],
         "test/**/*.ts": ["karma-typescript"]
      },
      reporters: ['mocha', 'karma-typescript'],

      logLevel: config.LOG_INFO,
      autoWatch: false,
      singleRun: true,
      failOnEmptyTestSuite: false,
      browsers: ['Chrome'],
      phantomJsLauncher: {
         exitOnResourceError: true
      }
   });
};
