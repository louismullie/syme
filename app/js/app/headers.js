SERVER_URL = window.location.origin;
window.URL = window.URL || window.webkitURL;

Blob.prototype.slice = Blob.prototype.slice || 
                       Blob.prototype.webkitSlice;
    
Syme = {
  globals: {
    updatedPosts: {},
    updatedComments: {}
  },
  Settings: {
    appWorkerPath: 'workers/app.js'
  },
  version: '0.3.0'

};