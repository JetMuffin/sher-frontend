(function(angular) {
    'use strict';
    angular.module('FileManager').provider('fileManagerConfig', function() {

        var values = {
            appName: 'sher-filemanager',
            defaultLang: 'en',

            listUrl: 'http://192.168.33.1:3030/api/fs',
            uploadUrl: 'http://192.168.33.1:3030/api/fs',
            renameUrl: 'http://192.168.33.1:3030/api/fs',
            copyUrl: 'http://192.168.33.1:3030/api/fs',
            moveUrl: 'http://192.168.33.1:3030/api/fs',
            removeUrl: 'http://192.168.33.1:3030/api/fs',
            editUrl: 'http://192.168.33.1:3030/api/fs',
            getContentUrl: 'http://192.168.33.1:3030/api/fs',
            createFolderUrl: 'http://192.168.33.1:3030/api/fs',
            downloadFileUrl: 'http://192.168.33.1:3030/api/fs',
            downloadMultipleUrl: 'http://192.168.33.1:3030/api/fs',
            compressUrl: 'http://192.168.33.1:3030/api/fs',
            extractUrl: 'http://192.168.33.1:3030/api/fs',
            permissionsUrl: 'http://192.168.33.1:3030/api/fs',

            searchForm: false,
            sidebar: false,
            breadcrumb: true,
            optionButton: true,
            viewTable: true,
            initPath: "",
            allowedActions: {
                upload: true,
                rename: true,
                move: true,
                copy: true,
                edit: true,
                changePermissions: false,
                compress: false,
                compressChooseName: false,
                extract: false,
                download: true,
                downloadMultiple: true,
                preview: true,
                remove: true
            },

            multipleDownloadFileName: 'sher.zip',
            showSizeForDirectories: false,
            useBinarySizePrefixes: false,
            downloadFilesByAjax: true,
            previewImagesInModal: true,
            enablePermissionsRecursive: true,
            compressAsync: false,
            extractAsync: false,

            isEditableFilePattern: /\.(txt|diff?|patch|svg|asc|cnf|cfg|conf|html?|.html|cfm|cgi|aspx?|ini|pl|py|md|css|cs|js|jsp|log|htaccess|htpasswd|gitignore|gitattributes|env|json|atom|eml|rss|markdown|sql|xml|xslt?|sh|rb|as|bat|cmd|cob|for|ftn|frm|frx|inc|lisp|scm|coffee|php[3-6]?|java|c|cbl|go|h|scala|vb|tmpl|lock|go|yml|yaml|tsv|lst)$/i,
            isImageFilePattern: /\.(jpe?g|gif|bmp|png|svg|tiff?)$/i,
            isExtractableFilePattern: /\.(gz|tar|rar|g?zip)$/i,
            tplPath: 'app/components/file-manager/templates'
        };

        return {
            $get: function() {
                return values;
            },
            set: function (constants) {
                angular.extend(values, constants);
            }
        };

    });
})(angular);
