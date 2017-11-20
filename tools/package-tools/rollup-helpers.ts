import { buildConfig } from './build-config';

// There are no type definitions available for these imports.
const rollup = require('rollup');
const rollupNodeResolutionPlugin = require('rollup-plugin-node-resolve');
const stripBanner = require('rollup-plugin-strip-banner');

const ROLLUP_GLOBALS = {
  // Import tslib rather than having TypeScript output its helpers multiple times.
  // See https://github.com/Microsoft/tslib
  'tslib': 'tslib',

  // Angular dependencies
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
  '@angular/platform-browser/animations': 'ng.platformBrowser.animations',

  '@stomp/ng2-stompjs': 'ng2-stompjs',

  // Rxjs dependencies
  'rxjs/BehaviorSubject': 'Rx',
  'rxjs/Observable': 'Rx',
  'rxjs/Subject': 'Rx',
  'rxjs/Subscription': 'Rx',
  'rxjs/add/observable/combineLatest': 'Rx.Observable',
  'rxjs/add/observable/forkJoin': 'Rx.Observable',
  'rxjs/add/observable/fromEvent': 'Rx.Observable',
  'rxjs/add/observable/merge': 'Rx.Observable',
  'rxjs/add/observable/of': 'Rx.Observable',
  'rxjs/add/observable/throw': 'Rx.Observable',
  'rxjs/add/operator/auditTime': 'Rx.Observable.prototype',
  'rxjs/add/operator/catch': 'Rx.Observable.prototype',
  'rxjs/add/operator/debounceTime': 'Rx.Observable.prototype',
  'rxjs/add/operator/do': 'Rx.Observable.prototype',
  'rxjs/add/operator/filter': 'Rx.Observable.prototype',
  'rxjs/add/operator/finally': 'Rx.Observable.prototype',
  'rxjs/add/operator/first': 'Rx.Observable.prototype',
  'rxjs/add/operator/let': 'Rx.Observable.prototype',
  'rxjs/add/operator/map': 'Rx.Observable.prototype',
  'rxjs/add/operator/share': 'Rx.Observable.prototype',
  'rxjs/add/operator/startWith': 'Rx.Observable.prototype',
  'rxjs/add/operator/switchMap': 'Rx.Observable.prototype',
  'rxjs/add/operator/takeUntil': 'Rx.Observable.prototype',
  'rxjs/add/operator/toPromise': 'Rx.Observable.prototype',

  // Other dependencies
  '@stomp/stompjs': 'stompjs'
};

export type BundleConfig = {
  input: string;
  dest: string;
  format: string;
  moduleName: string;
};

/** Creates a rollup bundle of a specified JavaScript file. */
export function createRollupBundle(config: BundleConfig): Promise<any> {
  const bundleOptions: any = {
    context: 'this',
    external: Object.keys(ROLLUP_GLOBALS),
    input: config.input
  };

  const writeOptions = {
    // Keep the moduleId empty because we don't want to force developers to a specific moduleId.
    moduleId: '',
    name: config.moduleName || 'ng2-stompjs',
    banner: buildConfig.licenseBanner,
    format: config.format,
    file: config.dest,
    globals: ROLLUP_GLOBALS,
    sourcemap: true
  };

  // When creating a UMD, we want to exclude tslib from the `external` bundle option so that it
  // is inlined into the bundle.
  if (config.format === 'umd') {
    bundleOptions.plugins = [rollupNodeResolutionPlugin(), stripBanner()];

    const external = Object.keys(ROLLUP_GLOBALS);
    external.splice(external.indexOf('tslib'), 1);
    bundleOptions.external = external;
  } else {
    bundleOptions.plugins = [stripBanner()];
  }

  return rollup.rollup(bundleOptions).then((bundle: any) => bundle.write(writeOptions));
}
