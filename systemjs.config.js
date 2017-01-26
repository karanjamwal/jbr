/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'npm:': 'node_modules/'
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            app: 'app',
            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            // other libraries
            'rxjs': 'npm:rxjs',
            'angular2-in-memory-web-api': 'npm:angular2-in-memory-web-api',
            'angular2-modal': 'npm:angular2-modal',
            'angular2-modal/plugins/bootstrap': 'npm:angular2-modal/bundles',
            'ng2-file-upload': 'npm:ng2-file-upload',
            'ng2-select': 'npm:ng2-select',
            'pdfjs-dist': 'npm:pdfjs-dist',
            'ng2-img-fallback': 'npm:ng2-img-fallback',
            'crypto-js': 'npm:crypto-js',
            'angular2-cookie': 'npm:angular2-cookie',
            'socket.io-client':'npm:socket.io-client/dist/socket.io.min.js'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js',
            },
            'rxjs': {
                main: './Rx.js',
                defaultExtension: 'js',
            },
            'angular-in-memory-web-api': {
                main: './index.js',
                defaultExtension: 'js',
            },
            'angular2-modal': {
                main: 'bundles/angular2-modal.umd',
                defaultExtension: 'js',
            },
            'angular2-modal/plugins/bootstrap': {
                main: 'angular2-modal.bootstrap.umd',
                defaultExtension: 'js',
            },
            'ng2-file-upload': {
                main: 'ng2-file-upload',
                defaultExtension: 'js',
            },
            'ng2-select': {
                main: 'ng2-select',
                defaultExtension: 'js',
            },
            'pdfjs-dist': {
                defaultExtension: 'js',
            },
            'ng2-img-fallback': {
                main: 'dist/index.js',
            },
            'crypto-js': {
                main: 'index.js',
                defaultExtension: 'js',
            },
            'angular2-cookie': {
                main: 'core',
                defaultExtension: 'js',
            } 
        }
    });
})(this);
