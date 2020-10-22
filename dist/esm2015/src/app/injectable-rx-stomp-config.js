/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import { RxStompConfig } from '@stomp/rx-stomp';
/**
 * Part of `\@stomp/ng2-stompjs`.
 *
 * This class is Injectable version of {\@link RxStompConfig} with exactly same functionality.
 * Please see {\@link RxStompConfig} for details.
 *
 * See: {\@link /guide/ng2-stompjs/ng2-stomp-with-angular7.html}
 * for a step-by-step guide.
 *
 * If all fields of configuration are fixed and known in advance you would typically define
 * a `const` and inject it using value.
 *
 * If some fields will be known by later, it can be injected using a factory function.
 *
 * Occasionally it may need to be combined with Angular's APP_INITIALIZER mechanism.
 */
export class InjectableRxStompConfig extends RxStompConfig {
}
InjectableRxStompConfig.decorators = [
    { type: Injectable }
];
function InjectableRxStompConfig_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    InjectableRxStompConfig.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    InjectableRxStompConfig.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0YWJsZS1yeC1zdG9tcC1jb25maWcuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3RvbXAvbmcyLXN0b21wanMvIiwic291cmNlcyI6WyJzcmMvYXBwL2luamVjdGFibGUtcngtc3RvbXAtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQmhELE1BQU0sOEJBQStCLFNBQVEsYUFBYTs7O1lBRHpELFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSeFN0b21wQ29uZmlnIH0gZnJvbSAnQHN0b21wL3J4LXN0b21wJztcblxuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvbmcyLXN0b21wanNgLlxuICpcbiAqIFRoaXMgY2xhc3MgaXMgSW5qZWN0YWJsZSB2ZXJzaW9uIG9mIHtAbGluayBSeFN0b21wQ29uZmlnfSB3aXRoIGV4YWN0bHkgc2FtZSBmdW5jdGlvbmFsaXR5LlxuICogUGxlYXNlIHNlZSB7QGxpbmsgUnhTdG9tcENvbmZpZ30gZm9yIGRldGFpbHMuXG4gKlxuICogU2VlOiB7QGxpbmsgL2d1aWRlL25nMi1zdG9tcGpzL25nMi1zdG9tcC13aXRoLWFuZ3VsYXI3Lmh0bWx9XG4gKiBmb3IgYSBzdGVwLWJ5LXN0ZXAgZ3VpZGUuXG4gKlxuICogSWYgYWxsIGZpZWxkcyBvZiBjb25maWd1cmF0aW9uIGFyZSBmaXhlZCBhbmQga25vd24gaW4gYWR2YW5jZSB5b3Ugd291bGQgdHlwaWNhbGx5IGRlZmluZVxuICogYSBgY29uc3RgIGFuZCBpbmplY3QgaXQgdXNpbmcgdmFsdWUuXG4gKlxuICogSWYgc29tZSBmaWVsZHMgd2lsbCBiZSBrbm93biBieSBsYXRlciwgaXQgY2FuIGJlIGluamVjdGVkIHVzaW5nIGEgZmFjdG9yeSBmdW5jdGlvbi5cbiAqXG4gKiBPY2Nhc2lvbmFsbHkgaXQgbWF5IG5lZWQgdG8gYmUgY29tYmluZWQgd2l0aCBBbmd1bGFyJ3MgQVBQX0lOSVRJQUxJWkVSIG1lY2hhbmlzbS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEluamVjdGFibGVSeFN0b21wQ29uZmlnIGV4dGVuZHMgUnhTdG9tcENvbmZpZyB7fVxuIl19