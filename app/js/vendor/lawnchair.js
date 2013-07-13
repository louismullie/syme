var Lawnchair=function(c,f){if(!(this instanceof Lawnchair))return new Lawnchair(c,f);if(!JSON)throw"JSON unavailable! Include http://www.json.org/json2.js to fix.";if(arguments.length<=2&&arguments.length>0){f=typeof arguments[0]==="function"?arguments[0]:arguments[1];c=typeof arguments[0]==="function"?{}:arguments[0]}else throw"Incorrect # of ctor args!";if(typeof f!=="function")throw"No callback was provided";this.record=c.record||"record";this.name=c.name||"records";var d;if(c.adapter)for(var a=
0,b=Lawnchair.adapters.length;a<b;a++){if(Lawnchair.adapters[a].adapter===c.adapter){d=Lawnchair.adapters[a].valid()?Lawnchair.adapters[a]:undefined;break}}else{a=0;for(b=Lawnchair.adapters.length;a<b;a++)if(d=Lawnchair.adapters[a].valid()?Lawnchair.adapters[a]:undefined)break}if(!d)throw"No valid adapter.";for(var e in d)this[e]=d[e];a=0;for(b=Lawnchair.plugins.length;a<b;a++)Lawnchair.plugins[a].call(this);this.init(c,f)};Lawnchair.adapters=[];
Lawnchair.adapter=function(c,f){f.adapter=c;var d="adapter valid init keys save batch get exists all remove nuke".split(" "),a=this.prototype.indexOf,b;for(b in f)if(a(d,b)===-1)throw"Invalid adapter! Nonstandard method: "+b;Lawnchair.adapters.splice(0,0,f)};Lawnchair.plugins=[];Lawnchair.plugin=function(c){for(var f in c)f==="init"?Lawnchair.plugins.push(c[f]):this.prototype[f]=c[f]};
Lawnchair.prototype={isArray:Array.isArray||function(c){return Object.prototype.toString.call(c)==="[object Array]"},indexOf:function(c,f,d,a){if(c.indexOf)return c.indexOf(f);d=0;for(a=c.length;d<a;d++)if(c[d]===f)return d;return-1},lambda:function(c){return this.fn(this.record,c)},fn:function(c,f){return typeof f=="string"?new Function(c,f):f},uuid:function(){var c=function(){return((1+Math.random())*65536|0).toString(16).substring(1)};return c()+c()+"-"+c()+"-"+c()+"-"+c()+"-"+c()+c()+c()},each:function(c){var f=
this.lambda(c);if(this.__results){c=0;for(var d=this.__results.length;c<d;c++)f.call(this,this.__results[c],c)}else this.all(function(a){for(var b=0,e=a.length;b<e;b++)f.call(this,a[b],b)});return this}};
Lawnchair.adapter("dom",function(){var c=window.localStorage,f=function(d){return{key:d+"._index_",all:function(){var a=c.getItem(this.key);if(a)a=JSON.parse(a);a===null&&c.setItem(this.key,JSON.stringify([]));return JSON.parse(c.getItem(this.key))},add:function(a){var b=this.all();b.push(a);c.setItem(this.key,JSON.stringify(b))},del:function(a){for(var b=this.all(),e=[],g=0,h=b.length;g<h;g++)b[g]!=a&&e.push(b[g]);c.setItem(this.key,JSON.stringify(e))},find:function(a){for(var b=this.all(),e=0,g=
b.length;e<g;e++)if(a===b[e])return e;return false}}};return{valid:function(){return!!c},init:function(d,a){this.indexer=f(this.name);a&&this.fn(this.name,a).call(this,this)},save:function(d,a){var b=d.key?this.name+"."+d.key:this.name+"."+this.uuid();this.indexer.find(b)===false&&this.indexer.add(b);delete d.key;c.setItem(b,JSON.stringify(d));d.key=b.slice(this.name.length+1);a&&this.lambda(a).call(this,d);return this},batch:function(d,a){for(var b=[],e=0,g=d.length;e<g;e++)this.save(d[e],function(h){b.push(h)});
a&&this.lambda(a).call(this,b);return this},keys:function(d){if(d){var a=this.name,b=this.indexer.all().map(function(e){return e.replace(a+".","")});this.fn("keys",d).call(this,b)}return this},get:function(d,a){if(this.isArray(d)){for(var b=[],e=0,g=d.length;e<g;e++){var h=this.name+"."+d[e];if(h=c.getItem(h)){h=JSON.parse(h);h.key=d[e];b.push(h)}}a&&this.lambda(a).call(this,b)}else{h=this.name+"."+d;if(h=c.getItem(h)){h=JSON.parse(h);h.key=d}a&&this.lambda(a).call(this,h)}return this},exists:function(d,
a){var b=this.indexer.find(this.name+"."+d)===false?false:true;this.lambda(a).call(this,b);return this},all:function(d){for(var a=this.indexer.all(),b=[],e,g,h=0,i=a.length;h<i;h++){g=a[h];e=JSON.parse(c.getItem(g));e.key=g.replace(this.name+".","");b.push(e)}d&&this.fn(this.name,d).call(this,b);return this},remove:function(d,a){var b=this.name+"."+(d.key?d.key:d);this.indexer.del(b);c.removeItem(b);a&&this.lambda(a).call(this);return this},nuke:function(d){this.all(function(a){for(var b=0,e=a.length;b<
e;b++)this.remove(a[b]);d&&this.lambda(d).call(this)});return this}}}());
Lawnchair.adapter("window-name",function(c,f){var d=window.top.name?JSON.parse(window.top.name):{};return{valid:function(){return typeof window.top.name!="undefined"},init:function(a,b){d[this.name]=d[this.name]||{index:[],store:{}};c=d[this.name].index;f=d[this.name].store;this.fn(this.name,b).call(this,this)},keys:function(a){this.fn("keys",a).call(this,c);return this},save:function(a,b){var e=a.key||this.uuid();a.key&&delete a.key;this.exists(e,function(g){g||c.push(e);f[e]=a;window.top.name=JSON.stringify(d);
a.key=e;b&&this.lambda(b).call(this,a)});return this},batch:function(a,b){for(var e=[],g=0,h=a.length;g<h;g++)this.save(a[g],function(i){e.push(i)});b&&this.lambda(b).call(this,e);return this},get:function(a,b){var e;if(this.isArray(a)){e=[];for(var g=0,h=a.length;g<h;g++)e.push(f[a[g]])}else if(e=f[a])e.key=a;b&&this.lambda(b).call(this,e);return this},exists:function(a,b){this.lambda(b).call(this,!!f[a]);return this},all:function(a){for(var b=[],e=0,g=c.length;e<g;e++){var h=f[c[e]];h.key=c[e];
b.push(h)}this.fn(this.name,a).call(this,b);return this},remove:function(a,b){for(var e=this.isArray(a)?a:[a],g=0,h=e.length;g<h;g++){delete f[e[g]];c.splice(this.indexOf(c,e[g]),1)}window.top.name=JSON.stringify(d);b&&this.lambda(b).call(this);return this},nuke:function(a){storage={};c=[];window.top.name=JSON.stringify(d);a&&this.lambda(a).call(this);return this}}}());

/**
 * indexed db adapter
 * === 
 * - originally authored by Vivian Li
 *
 */ 

Lawnchair.adapter('indexed-db', (function(){

  function fail(e, i) { console.error('error in indexed-db adapter!', e, i); }

  var STORE_NAME = 'lawnchair';

  // update the STORE_VERSION when the schema used by this adapter changes
  // (for example, if you change the STORE_NAME above)
  var STORE_VERSION = 2;

  var getIDB = function() {
    return window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB;
  };
  var getIDBTransaction = function() {
      return window.IDBTransaction || window.webkitIDBTransaction ||
          window.mozIDBTransaction || window.oIDBTransaction ||
          window.msIDBTransaction;
  };
  var getIDBKeyRange = function() {
      return window.IDBKeyRange || window.webkitIDBKeyRange ||
          window.mozIDBKeyRange || window.oIDBKeyRange ||
          window.msIDBKeyRange;
  };
  var getIDBDatabaseException = function() {
      return window.IDBDatabaseException || window.webkitIDBDatabaseException ||
          window.mozIDBDatabaseException || window.oIDBDatabaseException ||
          window.msIDBDatabaseException;
  };
  var useAutoIncrement = function() {
      // using preliminary mozilla implementation which doesn't support
      // auto-generated keys.  Neither do some webkit implementations.
      return !!window.indexedDB;
  };


  // see https://groups.google.com/a/chromium.org/forum/?fromgroups#!topic/chromium-html5/OhsoAQLj7kc
  var READ_WRITE = (getIDBTransaction() &&
                    'READ_WRITE' in getIDBTransaction()) ?
    getIDBTransaction().READ_WRITE : 'readwrite';

  return {
    
    valid: function() { return !!getIDB(); },
    
    init:function(options, callback) {
        this.idb = getIDB();
        this.waiting = [];
        this.useAutoIncrement = useAutoIncrement();
        var request = this.idb.open(this.name, STORE_VERSION);
        var self = this;
        var cb = self.fn(self.name, callback);
        var win = function() {
            // manually clean up event handlers on request; this helps on chrome
            request.onupgradeneeded = request.onsuccess = request.error = null;
            return cb.call(self, self);
        };
        
        var upgrade = function(from, to) {
            // don't try to migrate dbs, just recreate
            try {
                self.db.deleteObjectStore('teststore'); // old adapter
            } catch (e1) { /* ignore */ }
            try {
                self.db.deleteObjectStore(STORE_NAME);
            } catch (e2) { /* ignore */ }

            // ok, create object store.
            var params = {};
            if (self.useAutoIncrement) { params.autoIncrement = true; }
            self.db.createObjectStore(STORE_NAME, params);
            self.store = true;
        };
        request.onupgradeneeded = function(event) {
            self.db = request.result;
            self.transaction = request.transaction;
            upgrade(event.oldVersion, event.newVersion);
            // will end up in onsuccess callback
        };
        request.onsuccess = function(event) {
           self.db = request.result; 
            
            if(self.db.version != (''+STORE_VERSION)) {
              // DEPRECATED API: modern implementations will fire the
              // upgradeneeded event instead.
              var oldVersion = self.db.version;
              var setVrequest = self.db.setVersion(''+STORE_VERSION);
              // onsuccess is the only place we can create Object Stores
              setVrequest.onsuccess = function(event) {
                  var transaction = setVrequest.result;
                  setVrequest.onsuccess = setVrequest.onerror = null;
                  // can't upgrade w/o versionchange transaction.
                  upgrade(oldVersion, STORE_VERSION);
                  transaction.oncomplete = function() {
                      for (var i = 0; i < self.waiting.length; i++) {
                          self.waiting[i].call(self);
                      }
                      self.waiting = [];
                      win();
                  };
              };
              setVrequest.onerror = function(e) {
                  setVrequest.onsuccess = setVrequest.onerror = null;
                  console.log("Failed to create objectstore " + e);
                  fail(e);
              };
            } else {
                self.store = true;
                for (var i = 0; i < self.waiting.length; i++) {
                      self.waiting[i].call(self);
                }
                self.waiting = [];
                win();
            }
        }
        request.onerror = function(ev) {
            console.log(ev);
            if (request.errorCode === getIDBDatabaseException().VERSION_ERR) {
                // xxx blow it away
                self.idb.deleteDatabase(self.name);
                // try it again.
                return self.init(options, callback);
            }
            console.error('Failed to open database');
        };
    },

    save:function(obj, callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.save(obj, callback);
            });
            return;
         }
         
         var self = this, request;
         var win  = function (e) {
             // manually clean up event handlers; helps free memory on chrome.
             request.onsuccess = request.onerror = null;
             if (callback) { obj.key = e.target.result; self.lambda(callback).call(self, obj) }
         };

         var trans = this.db.transaction(STORE_NAME, READ_WRITE);
         var store = trans.objectStore(STORE_NAME);
         if (obj.key) {
             request = store.put(obj, obj.key);
         } else if (this.useAutoIncrement) {
             request = store.put(obj); // use autoIncrementing key.
         } else {
             request = store.put(obj, this.uuid()); // use randomly-generated key
         }
         
         request.onsuccess = win;
         request.onerror = fail;
         
         return this;
    },
    
    batch: function (objs, callback) {
        
        var results = []
        ,   done = objs.length
        ,   self = this

        var putOne = function(i) {
            self.save(objs[i], function(obj) {
                results[i] = obj;
                if ((--done) > 0) { return; }
                if (callback) {
                    self.lambda(callback).call(self, results);
                }
            });
        };

        for (var i = 0, l = objs.length; i < l; i++) 
            putOne(i);
        
        return this
    },
    

    get:function(key, callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.get(key, callback);
            });
            return;
        }
        
        
        var self = this;
        var win  = function (e) {
            var r = e.target.result;
            if (callback) {
                if (r) { r.key = key; }
                self.lambda(callback).call(self, r);
            }
        };
        
        if (!this.isArray(key)){
            var req = this.db.transaction(STORE_NAME).objectStore(STORE_NAME).get(key);

            req.onsuccess = function(event) {
                req.onsuccess = req.onerror = null;
                win(event);
            };
            req.onerror = function(event) {
                console.log("Failed to find " + key);
                req.onsuccess = req.onerror = null;
                fail(event);
            };
        
        } else {

            // note: these are hosted.
            var results = []
            ,   done = key.length
            ,   keys = key

            var getOne = function(i) {
                self.get(keys[i], function(obj) {
                    results[i] = obj;
                    if ((--done) > 0) { return; }
                    if (callback) {
                        self.lambda(callback).call(self, results);
                    }
                });
            };
            for (var i = 0, l = keys.length; i < l; i++) 
                getOne(i);
        }

        return this;
    },

    exists:function(key, callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.exists(key, callback);
            });
            return;
        }

        var self = this;

        var req = this.db.transaction(STORE_NAME).objectStore(STORE_NAME).openCursor(getIDBKeyRange().only(key));

        req.onsuccess = function(event) {
            req.onsuccess = req.onerror = null;
            // exists iff req.result is not null
            // XXX but firefox returns undefined instead, sigh XXX
            var undef;
            self.lambda(callback).call(self, event.target.result !== null &&
                                             event.target.result !== undef);
        };
        req.onerror = function(event) {
            req.onsuccess = req.onerror = null;
            console.log("Failed to test for " + key);
            fail(event);
        };

        return this;
    },

    all:function(callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.all(callback);
            });
            return;
        }
        var cb = this.fn(this.name, callback) || undefined;
        var self = this;
        var objectStore = this.db.transaction(STORE_NAME).objectStore(STORE_NAME);
        var toReturn = [];
        objectStore.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
               toReturn.push(cursor.value);
               cursor['continue']();
          }
          else {
              if (cb) cb.call(self, toReturn);
          }
        };
        return this;
    },

    keys:function(callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.keys(callback);
            });
            return;
        }
        var cb = this.fn(this.name, callback) || undefined;
        var self = this;
        var objectStore = this.db.transaction(STORE_NAME).objectStore(STORE_NAME);
        var toReturn = [];
        // in theory we could use openKeyCursor() here, but no one actually
        // supports it yet.
        objectStore.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
               toReturn.push(cursor.key);
               cursor['continue']();
          }
          else {
              if (cb) cb.call(self, toReturn);
          }
        };
        return this;
    },

    remove:function(keyOrArray, callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.remove(keyOrArray, callback);
            });
            return;
        }
        var self = this;
        if (this.isArray(keyOrArray)) {
            // batch remove
            var i, done = keyOrArray.length;
            var removeOne = function(i) {
                self.remove(keyOrArray[i], function() {
                    if ((--done) > 0) { return; }
                    if (callback) {
                        self.lambda(callback).call(self);
                    }
                });
            };
            for (i=0; i < keyOrArray.length; i++)
                removeOne(i);
            return this;
        }
        var request;
        var win  = function () {
            request.onsuccess = request.onerror = null;
            if (callback) self.lambda(callback).call(self)
        };
        var key = keyOrArray.key ? keyOrArray.key : keyOrArray;
        request = this.db.transaction(STORE_NAME, READ_WRITE).objectStore(STORE_NAME)['delete'](key);
        request.onsuccess = win;
        request.onerror = fail;
        return this;
    },

    nuke:function(callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.nuke(callback);
            });
            return;
        }
        
        var self = this
        ,   win  = callback ? function() { self.lambda(callback).call(self) } : function(){};
        
        try {
            this.db
                .transaction(STORE_NAME, READ_WRITE)
                .objectStore(STORE_NAME).clear().onsuccess = win;
            
        } catch(e) {
            fail();
        }
        return this;
    }
    
  };
  
})());

Lawnchair.adapter('html5-filesystem', (function(global){

    var StorageInfo = global.StorageInfo || global.webkitStorageInfo || {};
    var TEMPORARY = global.TEMPORARY || StorageInfo.TEMPORARY;
    var PERSISTENT = global.PERSISTENT || StorageInfo.PERSISTENT;
    var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder;
    // BlobBuilder is depricated, use Blob
    if(BlobBuilder){
        throw('this browser has not depricated BlobBuilder. you probably want to update.');
    }else{
        console.log('this modern browser has depricated BlobBuilder, use Blob instead')
        // see: https://developer.mozilla.org/en-US/docs/DOM/Blob#Blob_constructor_example_usage
    }
    var requestFileSystem = global.requestFileSystem || global.webkitRequestFileSystem || global.moz_requestFileSystem;

    var FileError = global.FileError;

    var fail = function( e ) {
      console.log(e);
        var msg;
        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = 'Unknown Error';
                break;
        };
        if ( console ) console.error( e, msg );
    };

    var ls = function( reader, callback, entries ) {
        var result = entries || [];
        reader.readEntries(function( results ) {
            if ( !results.length ) {
                if ( callback ) callback( result.map(function(entry) { return entry.name; }) );
            } else {
                ls( reader, callback, result.concat( Array.prototype.slice.call( results ) ) );
            }
        }, fail );
    };

    var filesystems = {};

    var root = function( store, callback ) {
        var directory = filesystems[store.name];
        if ( directory ) {
            callback( directory );
        } else {
            setTimeout(function() {
                root( store, callback );
            }, 10 );
        }
    };

    return {
      
        // boolean; true if the adapter is valid for the current environment
        valid: function() {
            return !!requestFileSystem;
        },

        // constructor call and callback. 'name' is the most common option
        init: function( options, callback ) {
            var me = this;
            var error = function(e) { fail(e); if ( callback ) me.fn( me.name, callback ).call( me, me ); };
            window.webkitStorageInfo.requestQuota(
              (options.storage === 'TEMPORARY' ? window.TEMPORARY : window.PERSISTENT),
              (options.size || 1024*1024*1024), function () {
                requestFileSystem( (options.storage === 'TEMPORARY' ? window.TEMPORARY : window.PERSISTENT), (options.size || 1024*1024*1024), function( fs ) {
                    console.log(fs.root);
                    fs.root.getDirectory( options.name, { create: true }, function( directory ) {
                        filesystems[options.name] = directory;
                        if ( callback ) me.fn( me.name, callback ).call( me, me );
                    }, error );
                }, error );
                
            },error);
            
        },

        // returns all the keys in the store
        keys: function( callback ) {
            var me = this;
            root( this, function( store ) {
                ls( store.createReader(), function( entries ) {
                    if ( callback ) me.fn( 'keys', callback ).call( me, entries );
                });
            });
            return this;
        },

        // save an object
        save: function( obj, callback ) {
            var me = this;
            var key = obj.key || this.uuid();
            obj.key = key;
            var error = function(e) { fail(e); if ( callback ) me.lambda( callback ).call( me ); };
            root( this, function( store ) {
                store.getFile( key, {create:true}, function( file ) {
                    file.createWriter(function( writer ) {
                        writer.onerror = error;
                        writer.onwriteend = function() {
                            if ( callback ) me.lambda( callback ).call( me, obj );
                        };
                        // Old, depricated
                        if(BlobBuilder){
                            var builder = new BlobBuilder();
                            builder.append( JSON.stringify( obj ) );
                            writer.write( builder.getBlob( 'application/json' ) );
                        }else{
                        // new, kinky
                            writer.write( new Blob([JSON.stringify(obj)] , {'type': 'application/json'}) );
                        }
                    }, error );
                }, error );
            });
            return this;
        },

        // batch save array of objs
        batch: function( objs, callback ) {
            var me = this;
            var saved = [];
            for ( var i = 0, il = objs.length; i < il; i++ ) {
                me.save( objs[i], function( obj ) {
                    saved.push( obj );
                    if ( saved.length === il && callback ) {
                        me.lambda( callback ).call( me, saved );
                    }
                });
            }
            return this;
        },

        // retrieve obj (or array of objs) and apply callback to each
        get: function( key /* or array */, callback ) {
            var me = this;
            if ( this.isArray( key ) ) {
                var values = [];
                for ( var i = 0, il = key.length; i < il; i++ ) {
                    me.get( key[i], function( result ) {
                        if ( result ) values.push( result );
                        if ( values.length === il && callback ) {
                            me.lambda( callback ).call( me, values );
                        }
                    });
                }
            } else {
                var error = function(e) { fail( e ); if ( callback ) me.lambda( callback ).call( me ); };
                root( this, function( store ) {
                    store.getFile( key, {create:false}, function( entry ) {
                        entry.file(function( file ) {
                            var reader = new FileReader();

                            reader.onerror = error;

                            reader.onload = function(e) {
                                if ( callback ) me.lambda( callback ).call( me, JSON.parse( e.target.result ) );
                            };

                            reader.readAsText( file );
                        }, error );
                    }, error );
                });
            }
            return this;
        },

        // check if an obj exists in the collection
        exists: function( key, callback ) {
            var me = this;
            root( this, function( store ) {
                store.getFile( key, {create:false}, function() {
                    if ( callback ) me.lambda( callback ).call( me, true );
                }, function() {
                    if ( callback ) me.lambda( callback ).call( me, false );
                });
            });
            return this;
        },

        // returns all the objs to the callback as an array
        all: function( callback ) {
            var me = this;
            if ( callback ) {
                this.keys(function( keys ) {
                    if ( !keys.length ) {
                        me.fn( me.name, callback ).call( me, [] );
                    } else {
                        me.get( keys, function( values ) {
                            me.fn( me.name, callback ).call( me, values );
                        });
                    }
                });
            }
            return this;
        },

        // remove a doc or collection of em
        remove: function( key /* or object */, callback ) {
            var me = this;
            var error = function(e) { fail( e ); if ( callback ) me.lambda( callback ).call( me ); };
            root( this, function( store ) {
                store.getFile( (typeof key === 'string' ? key : key.key ), {create:false}, function( file ) {
                    file.remove(function() {
                        if ( callback ) me.lambda( callback ).call( me );
                    }, error );
                }, error );
            });
            return this;
        },

        // destroy everything
        nuke: function( callback ) {
            var me = this;
            var count = 0;
            this.keys(function( keys ) {
                if ( !keys.length ) {
                    if ( callback ) me.lambda( callback ).call( me );
                } else {
                    for ( var i = 0, il = keys.length; i < il; i++ ) {
                        me.remove( keys[i], function() {
                            count++;
                            if ( count === il && callback ) {
                                me.lambda( callback ).call( me );
                            }
                        });
                    }
                }
            });
            return this;
        }
    };
}(this)));