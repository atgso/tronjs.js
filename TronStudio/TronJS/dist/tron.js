﻿/*
 * @overview Global TronJS Scripts Loader - a tiny implementation of Promises/A+ and CommonJS contributors.
 * @copyright Copyright (c) 2014 evio studio and PJBlog5 project
 * @license   Licensed under MIT license
 *            See https://github.com/cevio/tronjs.js
 * @version   6.1.223
 */// JavaScript Document
if ( ![].indexOf ){
	Array.prototype.indexOf = function( value ){
		var j = -1;
		for ( var i = 0 ; i < this.length ; i++ ){
			if ( value === this[i] ){
				j = i;
				break;
			}
		}
		return j;
	};
	Array.prototype.lastIndexOf = function( value ){
		var j = -1;
		for ( var i = this.length - 1 ; i > -1 ; i-- ){
			if ( value === this[i] ){
				j = i;
				break;
			}
		}
		return j;
	};
};

if ( ![].forEach ){
	Array.prototype.forEach = function( callback ){
		for ( var i = 0 ; i < this.length ; i++ ){
			if ( typeof callback === 'function' ){
				callback.call(this, this[i], i);
			}
		}
	};
};

if ( typeof JSON === "undefined" ){ window.JSON = new Object(); };

window.readVariableType = function( object, type ){
	return Object.prototype.toString.call(object).toLowerCase() === "[object " + type + "]"; 
};

(function(){
	window.Class = function(){
		var ProtectMethods = ['__constructor__', 'initialize'],
			argc = arguments,
			that = this;

		var factory = function(){
			this.__constructor__ = 'ECM.CLASS.FACTORY';
			return typeof this.initialize === 'function' ? this.initialize.apply(this, arguments) : this;
		};
		
		this.constructor = factory;
		this.constructor.__constructor__ = this.__constructor__ = 'ECM.CLASS';
		
		this.constructor.extend = function( object ){
			if ( object.__constructor__ && object.__constructor__ === 'ECM.CLASS' ){
				if ( object.prototype ){
					for ( var i in object.prototype ){
						if ( ProtectMethods.indexOf(i) === -1 ){
							that.constructor.prototype[i] = object.prototype[i];
						}
					}
				}
			};
			
			return that.constructor;
		}
		
		this.constructor.toggle = function( objects ){
			if ( !objects ){ return that.constructor; };
			if ( readVariableType(objects) !== 'array' ){
				objects = [objects];
			};
			
			for ( var i = 0 ; i < objects.length ; i++ ){
				that.constructor.extend(objects[i]);
			}
			
			return that.constructor;
		}
		
		this.constructor.add = function(key, value){
			if ( !value ){
				for ( var i in key ){
					that.constructor.add(i, key[i]);
				}
			}else{
				that.constructor.prototype[key] = value;
			}
			
			return that.constructor;
		}

		if ( argc.length === 2 ){
			this.constructor.extend(argc[0]);
			this.constructor.add(argc[1]);
		}else if ( argc.length === 1 ){
			if ( argc[0] && argc[0].__constructor__ && argc[0].__constructor__ === 'ECM.CLASS' ){
				this.constructor.extend(argc[0]);
			}else{
				if ( typeof argc[0] === 'function' ){
					this.constructor.add('initialize', argc[0]);
				}else{
					this.constructor.add(argc[0]);
				}
			}
		}
		
		return this.constructor;
	};
})();(function() {
    "use strict";

    function $$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function $$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function $$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var $$utils$$_isArray;

    if (!Array.isArray) {
      $$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      $$utils$$_isArray = Array.isArray;
    }

    var $$utils$$isArray = $$utils$$_isArray;
    var $$utils$$now = Date.now || function() { return new Date().getTime(); };
    function $$utils$$F() { }

    var $$utils$$o_create = (Object.create || function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      $$utils$$F.prototype = o;
      return new $$utils$$F();
    });

    var $$asap$$len = 0;

    var $$asap$$default = function asap(callback, arg) {
      $$asap$$queue[$$asap$$len] = callback;
      $$asap$$queue[$$asap$$len + 1] = arg;
      $$asap$$len += 2;
      if ($$asap$$len === 2) {
        // If len is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        $$asap$$scheduleFlush();
      }
    };

    var $$asap$$browserGlobal = (typeof window !== 'undefined') ? window : {};
    var $$asap$$BrowserMutationObserver = $$asap$$browserGlobal.MutationObserver || $$asap$$browserGlobal.WebKitMutationObserver;

    // test for web worker but not in IE10
    var $$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function $$asap$$useNextTick() {
      return function() {
        process.nextTick($$asap$$flush);
      };
    }

    function $$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new $$asap$$BrowserMutationObserver($$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function $$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = $$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function $$asap$$useSetTimeout() {
      return function() {
        setTimeout($$asap$$flush, 1);
      };
    }

    var $$asap$$queue = new Array(1000);

    function $$asap$$flush() {
      for (var i = 0; i < $$asap$$len; i+=2) {
        var callback = $$asap$$queue[i];
        var arg = $$asap$$queue[i+1];

        callback(arg);

        $$asap$$queue[i] = undefined;
        $$asap$$queue[i+1] = undefined;
      }

      $$asap$$len = 0;
    }

    var $$asap$$scheduleFlush;

    // Decide what async method to use to triggering processing of queued callbacks:
    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      $$asap$$scheduleFlush = $$asap$$useNextTick();
    } else if ($$asap$$BrowserMutationObserver) {
      $$asap$$scheduleFlush = $$asap$$useMutationObserver();
    } else if ($$asap$$isWorker) {
      $$asap$$scheduleFlush = $$asap$$useMessageChannel();
    } else {
      $$asap$$scheduleFlush = $$asap$$useSetTimeout();
    }

    function $$$internal$$noop() {}
    var $$$internal$$PENDING   = void 0;
    var $$$internal$$FULFILLED = 1;
    var $$$internal$$REJECTED  = 2;
    var $$$internal$$GET_THEN_ERROR = new $$$internal$$ErrorObject();

    function $$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function $$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.')
    }

    function $$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        $$$internal$$GET_THEN_ERROR.error = error;
        return $$$internal$$GET_THEN_ERROR;
      }
    }

    function $$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function $$$internal$$handleForeignThenable(promise, thenable, then) {
       $$asap$$default(function(promise) {
        var sealed = false;
        var error = $$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            $$$internal$$resolve(promise, value);
          } else {
            $$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          $$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          $$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function $$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === $$$internal$$FULFILLED) {
        $$$internal$$fulfill(promise, thenable._result);
      } else if (promise._state === $$$internal$$REJECTED) {
        $$$internal$$reject(promise, thenable._result);
      } else {
        $$$internal$$subscribe(thenable, undefined, function(value) {
          $$$internal$$resolve(promise, value);
        }, function(reason) {
          $$$internal$$reject(promise, reason);
        });
      }
    }

    function $$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        $$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = $$$internal$$getThen(maybeThenable);

        if (then === $$$internal$$GET_THEN_ERROR) {
          $$$internal$$reject(promise, $$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          $$$internal$$fulfill(promise, maybeThenable);
        } else if ($$utils$$isFunction(then)) {
          $$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          $$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function $$$internal$$resolve(promise, value) {
      if (promise === value) {
        $$$internal$$reject(promise, $$$internal$$selfFullfillment());
      } else if ($$utils$$objectOrFunction(value)) {
        $$$internal$$handleMaybeThenable(promise, value);
      } else {
        $$$internal$$fulfill(promise, value);
      }
    }

    function $$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      $$$internal$$publish(promise);
    }

    function $$$internal$$fulfill(promise, value) {
      if (promise._state !== $$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = $$$internal$$FULFILLED;

      if (promise._subscribers.length === 0) {
      } else {
        $$asap$$default($$$internal$$publish, promise);
      }
    }

    function $$$internal$$reject(promise, reason) {
      if (promise._state !== $$$internal$$PENDING) { return; }
      promise._state = $$$internal$$REJECTED;
      promise._result = reason;

      $$asap$$default($$$internal$$publishRejection, promise);
    }

    function $$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + $$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + $$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        $$asap$$default($$$internal$$publish, parent);
      }
    }

    function $$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          $$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function $$$internal$$ErrorObject() {
      this.error = null;
    }

    var $$$internal$$TRY_CATCH_ERROR = new $$$internal$$ErrorObject();

    function $$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        $$$internal$$TRY_CATCH_ERROR.error = e;
        return $$$internal$$TRY_CATCH_ERROR;
      }
    }

    function $$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = $$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = $$$internal$$tryCatch(callback, detail);

        if (value === $$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          $$$internal$$reject(promise, $$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== $$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        $$$internal$$resolve(promise, value);
      } else if (failed) {
        $$$internal$$reject(promise, error);
      } else if (settled === $$$internal$$FULFILLED) {
        $$$internal$$fulfill(promise, value);
      } else if (settled === $$$internal$$REJECTED) {
        $$$internal$$reject(promise, value);
      }
    }

    function $$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          $$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          $$$internal$$reject(promise, reason);
        });
      } catch(e) {
        $$$internal$$reject(promise, e);
      }
    }

    function $$$enumerator$$makeSettledResult(state, position, value) {
      if (state === $$$internal$$FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
        return {
          state: 'rejected',
          reason: value
        };
      }
    }

    function $$$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor($$$internal$$noop, label);
      this._abortOnReject = abortOnReject;

      if (this._validateInput(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._init();

        if (this.length === 0) {
          $$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            $$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        $$$internal$$reject(this.promise, this._validationError());
      }
    }

    $$$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return $$utils$$isArray(input);
    };

    $$$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    $$$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var $$$enumerator$$default = $$$enumerator$$Enumerator;

    $$$enumerator$$Enumerator.prototype._enumerate = function() {
      var length  = this.length;
      var promise = this.promise;
      var input   = this._input;

      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    $$$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var c = this._instanceConstructor;
      if ($$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== $$$internal$$PENDING) {
          entry._onerror = null;
          this._settledAt(entry._state, i, entry._result);
        } else {
          this._willSettleAt(c.resolve(entry), i);
        }
      } else {
        this._remaining--;
        this._result[i] = this._makeResult($$$internal$$FULFILLED, i, entry);
      }
    };

    $$$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === $$$internal$$PENDING) {
        this._remaining--;

        if (this._abortOnReject && state === $$$internal$$REJECTED) {
          $$$internal$$reject(promise, value);
        } else {
          this._result[i] = this._makeResult(state, i, value);
        }
      }

      if (this._remaining === 0) {
        $$$internal$$fulfill(promise, this._result);
      }
    };

    $$$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };

    $$$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      $$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt($$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt($$$internal$$REJECTED, i, reason);
      });
    };

    var $$promise$all$$default = function all(entries, label) {
      return new $$$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
    };

    var $$promise$race$$default = function race(entries, label) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor($$$internal$$noop, label);

      if (!$$utils$$isArray(entries)) {
        $$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        $$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        $$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
        $$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    };

    var $$promise$resolve$$default = function resolve(object, label) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor($$$internal$$noop, label);
      $$$internal$$resolve(promise, object);
      return promise;
    };

    var $$promise$reject$$default = function reject(reason, label) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor($$$internal$$noop, label);
      $$$internal$$reject(promise, reason);
      return promise;
    };

    var $$es6$promise$promise$$counter = 0;

    function $$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function $$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var $$es6$promise$promise$$default = $$es6$promise$promise$$Promise;

    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise’s eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @constructor
    */
    function $$es6$promise$promise$$Promise(resolver, label) {
      this._id = $$es6$promise$promise$$counter++;
      this._label = label;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if ($$$internal$$noop !== resolver) {
        if (!$$utils$$isFunction(resolver)) {
          $$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof $$es6$promise$promise$$Promise)) {
          $$es6$promise$promise$$needsNew();
        }

        $$$internal$$initializePromise(this, resolver);
      }
    }

    $$es6$promise$promise$$Promise.all = $$promise$all$$default;
    $$es6$promise$promise$$Promise.race = $$promise$race$$default;
    $$es6$promise$promise$$Promise.resolve = $$promise$resolve$$default;
    $$es6$promise$promise$$Promise.reject = $$promise$reject$$default;

    $$es6$promise$promise$$Promise.prototype = {
      constructor: $$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection, label) {
        var parent = this;
        var state = parent._state;

        if (state === $$$internal$$FULFILLED && !onFulfillment || state === $$$internal$$REJECTED && !onRejection) {
          return this;
        }

        parent._onerror = null;

        var child = new this.constructor($$$internal$$noop, label);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          $$asap$$default(function(){
            $$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          $$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection, label) {
        return this.then(null, onRejection, label);
      }
    };

    var $$es6$promise$polyfill$$default = function polyfill() {
      var local;

      if (typeof global !== 'undefined') {
        local = global;
      } else if (typeof window !== 'undefined' && window.document) {
        local = window;
      } else {
        local = self;
      }

      var es6PromiseSupport =
        "Promise" in local &&
        // Some of these methods are missing from
        // Firefox/Chrome experimental implementations
        "resolve" in local.Promise &&
        "reject" in local.Promise &&
        "all" in local.Promise &&
        "race" in local.Promise &&
        // Older version of the spec had a resolver object
        // as the arg rather than a function
        (function() {
          var resolve;
          new local.Promise(function(r) { resolve = r; });
          return $$utils$$isFunction(resolve);
        }());

      if (!es6PromiseSupport) {
        local.Promise = $$es6$promise$promise$$default;
      }
    };

    var es6$promise$umd$$ES6Promise = {
      Promise: $$es6$promise$promise$$default,
      polyfill: $$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = es6$promise$umd$$ES6Promise;
    }
	if ( this['ES6Promise'] && window && !window.Promise ){
		window.Promise = es6$promise$umd$$ES6Promise.Promise;
		window.polyfill = es6$promise$umd$$ES6Promise.polyfill;
	};
}).call(this);;(function( host, head, isIE ){var _host = host.origin ? host.origin : host.href.split('/').slice(0, 3).join('/'),
	_base = _host,
	_file = host.href.split('?')[0];

var SLASH_RE = /\\\\/g,
	regx_root = /^\/.+/,
	regx_http = /^http\:\/\//i,
	regx_parent = /^\.\.\/.+/,
	regx_self = /^\.\/.+/,
	regx_local = /^\:.+/,
	REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g;

function GlobalModules(){
	this.exports 		= {};					// 全局接口
	this.length 		= 0;					// 接口数量
	this.maps 			= {};					// 接口映射
	this.Promise 		= Promise.resolve();	// Window.Require Promise
	this.LoadedModules	= [];					// 单模块加载时候分析出的模块集合 文件是模块的载体 原则
};

function GlobalModule(){
	this.exports 		= {};					// 单模块接口
	this.__modename		= null;					// 单模块自定义文件名
	this.__filename		= null;					// 单模块所在文件地址
	this.__dirname		= null;					// 单模块所在文件夹地址
	this.dependencies 	= [];					// 单模块依赖关系
	this.factory		= function(){};			// 单模块主函数
	this.async			= false;				// 单模块中依赖关系加载模式 true: 串行 false 并行
	this.inDefine		= false;				// 单模块是否被打包过
};

var library = new Class(function(){
	this.httpDomain	= _host;					// 当前加载页面的host地址
	this.httpBase	= _base;					// 当前加载页面的基址
	this.httpFile	= _file;					// 当前加载页面的文件地址
});

// 设置模块加载的映射关系
library.add('onMap', function( ShortSelector, AbsoluteHttpPath ){
	window.modules.maps[ShortSelector] = AbsoluteHttpPath;
	return this;
});

//  设置模块加载的基址
library.add('setBase', function( HttpBaseSelector ){
	if ( HttpBaseSelector && HttpBaseSelector.length > 0 ){
		if ( /^http:/i.test(HttpBaseSelector) ){
			this.httpBase = HttpBaseSelector;
			this.httpDomain = HttpBaseSelector.split('/').slice(0, 3).join('/');
		}
		else{
			this.httpBase += '/' + HttpBaseSelector;
		}
	};
		
	if ( /\/$/.test(this.httpBase) ){
		this.httpBase = this.httpBase.replace(/\/$/, '');
	};
		
	return this;
});

// 接口转移方法
library.add('proxy', function( fn, context ){
	return function(){
		var args = arguments;
		return fn.apply(context, args);
	};
});

// 模块加载状态码
GlobalModules.prototype.status = {
	pending		: 0,							// 模块准备中
	analyzed	: 1,							// 模块分析中
	required	: 2,							// 依赖关系处理完毕
	compiled	: 3								// 编译完毕
}

GlobalModules.prototype.debug = false;			// 是否调试

window.Library = new library();					// 全局Library库对象
window.modules = new GlobalModules();			// 全局模块存储空间对象

window.modules.debug = false;function unique(arr){
	var obj = {};
	var ret = [];

	for ( var i = 0, len = arr.length; i < len; i++ ) {
		var item = arr[i];
		if ( obj[item] !== 1 ){
		  obj[item] = 1;
		  ret.push(item);
		}
	}

	return ret;
};

function parseDependencies( code ){
	var ret = [], m;
		
	REQUIRE_RE.lastIndex = 0
	code = code.replace(SLASH_RE, "");

	while ((m = REQUIRE_RE.exec(code))) {
		if (m[2]) ret.push(m[2]);
	}

	return unique(ret);
};

function getInteractiveScript(){
	if(window.document.currentScript) {
		return window.document.currentScript;
	}
	
	var stack;
	try {
		a.b.c(); //强制报错,以便捕获e.stack
	} catch(e) {//safari的错误对象只有line,sourceId,sourceURL
		stack = e.stack;
		if(!stack && window.opera){
			//opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
			stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
		}
	}
	if(stack) {
		/**e.stack最后一行在所有支持的浏览器大致如下:
		*chrome23:
		* at http://113.93.50.63/data.js:4:1
		*firefox17:
		*@http://113.93.50.63/query.js:4
		*opera12:
		*@http://113.93.50.63/data.js:4
		*IE10:
		*  at Global code (http://113.93.50.63/data.js:4:1)
		*/
		stack = stack.split( /[@ ]/g).pop();//取得最后一行,最后一个空格或@之后的部分
		stack = stack[0] == "(" ? stack.slice(1,-1) : stack;
		var url = stack.replace(/(:\d+)?:\d+$/i, "");//去掉行号与或许存在的出错字符起始位置
		var nodes = head.getElementsByTagName("script");
		for ( var j = 0 ; j < nodes.length ; j++ ){
			if ( nodes[j].src.toLowerCase() == url.toLowerCase() ){
				return nodes[j];
			}
		}
	}
	
	var nodes = head.getElementsByTagName("script"); //只在head标签中寻找
	for(var i = 0, node; node = nodes[i++];) {
		if(node.readyState === "interactive") {
			return node;
		}
	}
};

function getCurrentScript() {
	var interactiveScript = getInteractiveScript();
	if ( !interactiveScript ){
		interactiveScript = Array.prototype.slice.call(document.scripts, 0).shift().src;
	};
	return interactiveScript;
};

function RequireContrast( str, dirname ){
	if ( window.modules.maps[str] ){ 
		str = window.modules.maps[str]; 
	};

	if ( regx_root.test(str) ){ 
		str = Library.httpDomain + str; 
	}

	else if ( regx_http.test(str) ){ 
		str = str; 
	}

	else if ( regx_parent.test(str) ){
		str = ResolveParentSelector(dirname + '/' + str); 
	}

	else if ( regx_self.test(str) ){ str = dirname + '/' + str.replace(/^\.\//, ''); }

	else if ( regx_local.test(str) ){ 
		str = str.replace(/^:/, '').replace(/^\//, ''); 
		str = Library.httpBase + '/' + str; 
	}

	else{ str = dirname + '/' + str.replace(/^\.\//, ''); };
	
	return str;
};

function RequireResolve( str, dirname ){
	str = RequireContrast(str, dirname);
	
	if ( !str ) return;

	if ( /\.css$/i.test(str) ){ str = str; }
	else if ( /\.js$/i.test(str) ){ str = str; }
	else{ str += '.js'; }
	
	return str;
};

function DefineResolve( str, base, localModuleDir ){
	if ( window.modules.maps[str] ){ 
		str = window.modules.maps[str]; 
	};
	
	if ( regx_root.test(str) ){ 
		str = localModuleDir + str; 
	}

	else if ( regx_http.test(str) ){ 
		str = str; 
	}

	else if ( regx_parent.test(str) ){
		str = ResolveParentSelector(localModuleDir + '/' + str); 
	}

	else if ( regx_self.test(str) ){ str = localModuleDir + '/' + str.replace(/^\.\//, ''); }

	else{ str = base + '/' + str.replace(/^\.\//, ''); }

	if ( /\.css$/i.test(str) ){ str = str; }
	else if ( /\.js$/i.test(str) ){ str = str; }
	else{ str += '.js'; }
	
	return str;
};

function ResolveParentSelector( p ){
	var parentNode = p.replace(Library.httpDomain, "");
		
	if ( /^\//.test(parentNode) ){
		parentNode = parentNode.replace(/^\//, "");
	}
	
	var parentArrays = parentNode.split("/"),
		index = parentArrays.indexOf("..");
		
	if ( index > -1 ){
		index--;
		
		if ( index < 0 ){
			index = 0;
			parentArrays.splice(0, 1);
		}
		else{
			parentArrays.splice(index, 2);
		}
		
		var x = parentArrays.join("/");
		
		if ( !regx_http.test(x) ){
			x = Library.httpDomain + "/" + x;
		}
		
		return ResolveParentSelector(x);
	}else{
		
		var b = parentArrays.join("/");
		
		if ( !regx_http.test(b) ){
			b = Library.httpDomain + "/" + b;
		}
		
		return b;
		
	}
};

function getEmpty(json){
	var j = 0;
	for ( var i in json ){
		j++;
	}
	
	return j === 0;
};

function LoadScript( url ){
	return new Promise(function( resolve ){
		var node = document.createElement("script");
		node.onload = node.onerror = node.onreadystatechange = function(){
			if ( /loaded|complete|undefined/i.test(node.readyState) ) {
				node.onload = node.onerror = node.onreadystatechange = null;
				resolve(node);
			}
		}
		node.async = true;
		node.src = url;
		head.insertBefore( node, head.firstChild );
	});
};

function LoadCss( href, before, media ){
	return new Promise(function(resolve){
		var ss = window.document.createElement( "link" );
		var ref = before || window.document.getElementsByTagName( "script" )[ 0 ];
		var sheets = window.document.styleSheets;
			ss.rel = "stylesheet";
			ss.href = href;
			ss.media = "only x";
			ref.parentNode.insertBefore( ss, ref );
		
		var dtime = new Date().getTime();
		function toggleMedia(){
			if ( new Date().getTime() - dtime > 30000 ){
				reject(ss);
				return;
			};
			var defined;
			for( var i = 0; i < sheets.length; i++ ){
				if( sheets[ i ].href && sheets[ i ].href.indexOf( href ) > -1 ){
					defined = true;
				}
			}
			if( defined ){
				ss.media = media || "all";
				resolve(ss);
			}
			else {
				setTimeout( toggleMedia );
			}
		}
		
		toggleMedia();
	});
};

function request( url ){
	if ( /\.css(?:\?|$)/i.test(url) ){
		return LoadCss(url);
	}else{
		return LoadScript(url);
	}
};

function getDirName( filename ){
	return filename.split('/').slice(0, -1).join('/');
};

function SetModuleStatus( module, status ){
	window.modules.exports[module.__modename].status = window.modules.status[status];
};

function GetModuleStatus( module ){
	return window.modules.exports[module.__modename].status;
};

function GetExportsBySelectors( selectors ){
	var newSelectors = [];
	selectors.forEach(function( selector ){
		var _exports = null;
		try{
			_exports = window.modules.exports[selector].module.exports;
		}catch(e){}
		newSelectors.push(_exports);
	});
	return newSelectors;
};

function GetExportsBySelector( selector ){
	try{
		return window.modules.exports[selector].module.exports;
	}catch(e){
		return null;
	}
};

function debug(){
	if ( window.modules.debug ){
		console.log.apply(console, arguments);
	}
}// window.define 函数主体
window.define = window.define || function(){
	
	var id = null,
		dependencies = [],
		factory = null,
		async = false,
		inDefineModule = false;
	
	// 配置参数到具体参数	
	for ( var i = 0 ; i < arguments.length ; i++ ){
		var defineArgc = arguments[i];

		if ( readVariableType(defineArgc, 'function') ){
			factory = defineArgc;
		}
		else if ( readVariableType(defineArgc, 'boolean') ){
			async = defineArgc;
		}
		else if ( readVariableType(defineArgc, 'array') ){
			dependencies = defineArgc;
		}
		else if ( readVariableType(defineArgc, 'string') ){
			id = defineArgc;
		}else{
			factory = defineArgc;
		}
	};
	
	// 马上获取文件具体执行地址
	var InteractiveScript = getCurrentScript();
	
	// 如果没有找到节点，那么这里处理
	if ( !InteractiveScript ){
		throw 'can not find node';
		return;
	};
	
	// 实例化一个具体的模块对象
	var InstantiationModule = new GlobalModule();
	
	// 获取factory中的具体依赖对象
	var InstantiationDependencies = [];
	if ( factory && typeof factory === 'function' ){
		InstantiationDependencies = parseDependencies(factory.toString());
	};
	if ( InstantiationDependencies.length > 0 ){
		dependencies = dependencies.concat(InstantiationDependencies);
	};
	
	// 处理模块具体信息
	InstantiationModule.__filename 		= InteractiveScript.src;
	InstantiationModule.__dirname  		= getDirName(InstantiationModule.__filename);
	InstantiationModule.dependencies	= dependencies;
	InstantiationModule.factory			= factory;
	InstantiationModule.async			= async;
	
	// 处理模块自定义地址
	if ( id && id.length > 0 ){
		InstantiationModule.__modename	= id;
		// 进行地址转换， 转换为绝对地址
		debug('pending[inDefine]:', InstantiationModule.__modename);
		InstantiationModule.__modename = RequireResolve(InstantiationModule.__modename, InstantiationModule.__dirname);
		debug('pending[inDefine]:', InstantiationModule.__modename);
		// 确定具有自定义的文件名
		inDefineModule = true;
		// 同时设置该模块不需要实际加载
		InstantiationModule.inDefine = true; 
	}else{
		InstantiationModule.__modename = InstantiationModule.__filename;
	};
	
	// 如果之前有注册过这个模块就退出
	if ( window.modules.exports[InstantiationModule.__modename] ){
		return;
	};
	
	window.modules.exports[InstantiationModule.__modename] = {};
	window.modules.exports[InstantiationModule.__modename].inDefine = InstantiationModule.inDefine;
	SetModuleStatus(InstantiationModule, 'pending');
	debug('pending:', InstantiationModule.__modename);
	
	// 处理依赖关系绝对地址
	var EachDependencies = [];
	debug('pending[dependencies]:', InstantiationModule.__modename, InstantiationModule.dependencies);
	if ( InstantiationModule.dependencies.length > 0 ){
		InstantiationModule.dependencies.forEach(function( DepSelector ){
			if ( inDefineModule ){
				EachDependencies.push(DefineResolve(DepSelector, InstantiationModule.__dirname, getDirName(InstantiationModule.__modename)));
			}else{
				EachDependencies.push(RequireResolve(DepSelector, InstantiationModule.__dirname));
			};
		});
		InstantiationModule.dependencies = EachDependencies;
	};
	
	SetModuleStatus(InstantiationModule, 'analyzed');
	debug('analyzed:', InstantiationModule.__modename);
	
	// 判断游览器运行？
	if ( !window.define.amd[InstantiationModule.__filename] ){
		// 浏览器中直接运行
		debug('run on brower:', InstantiationModule.__modename, InstantiationModule);
		onBrowerExecuteScript(InstantiationModule);
	}else{
		// 采用模块加载运行
		debug('require[regist]:', InstantiationModule.__modename);
		window.modules.LoadedModules.push(InstantiationModule);
		if ( isIE ){
			InteractiveScript.LoadedModules = Array.prototype.slice.call(window.modules.LoadedModules, 0);
		};
	}
};

// Window.Define.AMD  规范列表
window.define.amd = {};

// 在浏览器中直接运行模块函数
function onBrowerExecuteScript( ExecuteModule ){
	requireDependencies(ExecuteModule);
}var require = new Class(function( AbsoluteHttpSelector ){
	this.AbsoluteHttpSelector = AbsoluteHttpSelector;
	return this.compile();
});

require.add('compile', function(){
	var url = this.AbsoluteHttpSelector;
	return new Promise(function(resolve){
		window.define.amd[url] = true;
		debug('require[pending]:', url);
		
		if ( window.modules.exports[url] && window.modules.exports[url].inDefine ){
			if ( window.modules.exports[url].status < 3 ){
				debug('require[inDefine][wait]:', url);
				delay(url, resolve);
			}else{
				resolve();
			}
		}else{
			if ( window.modules.exports[url] && window.modules.exports[url].status < 3 ){
				debug('require[inDefine][wait]:', url);
				delay(url, resolve);
			}else{
				if ( !window.modules.exports[url] ){
					request(url).then(function( node ){
						var modules = node.LoadedModules,
							PromiseModules = [];
							
						if ( !modules ){ modules = window.modules.LoadedModules; };
						if ( modules.length === 0 ){
							var _modules = new GlobalModule();
								_modules.__filename = node.src ? node.src : node.href;
								_modules.__modename = _modules.__filename;
								_modules.__dirname = getDirName(_modules.__modename);
								window.modules.exports[_modules.__modename] = {};
								SetModuleStatus(_modules, 'analyzed');
								modules = [_modules];
						}
						
						modules = Array.prototype.slice.call(modules, 0);
						window.modules.LoadedModules = [];
						
						modules.forEach(function(module){
							PromiseModules.push(requireDependencies(module));
						});
						
						debug('require[loaded]:', url, PromiseModules);
	
						Promise.all(PromiseModules).then(function(){
							var __filename__ = node.src ? node.src : node.href;
							if ( /\.js$/.test(__filename__) ){
								node.parentNode.removeChild(node);
							};
							resolve();
							debug('require[compiled]:', url, modules);
						});
					});
				}else{
					resolve();
				}
			};
		};
	});
});

var delay = function(url, callback){
	setTimeout(function(){
		debug('waiting:', url);
		if ( window.modules.exports[url].status === 3 ){
			debug('waited:', url);
			callback();
		}else{
			delay(url, callback);
		}
	}, 1);
}

window.require = function(deps, callback){
	return window.modules.Promise = window.modules.Promise.then(function(){
		if ( !readVariableType(deps, 'array') ){ deps = [deps]; };
	
		var KeepPromiseQueens = [], 
			selectors = [];

		for ( var i = 0 ; i < deps.length ; i++ ){
			var dep = RequireResolve(deps[i], getDirName(Library.httpFile));
			KeepPromiseQueens.push( new require(dep) );
			selectors.push(dep);
		};

		return Promise.all(KeepPromiseQueens).then(function(){
			var defineLoadExports = GetExportsBySelectors(selectors);
			typeof callback === 'function' && callback.apply(null, defineLoadExports);
			
			return Promise.resolve(defineLoadExports);
		});
	});
}// 单define模块依赖关系处理
function requireDependencies( modules ){
	var dependencies 	= modules.dependencies,
		MaskModule 		= modules;
	
	debug('dependencies[pending]:', modules.__modename, dependencies);
		
	return new Promise(function( resolve ){
		if ( dependencies.length > 0 ){
			if ( !MaskModule.async ){
				debug('dependencies[doing][cmd]:', MaskModule.__modename);
				var Promises = [];
				dependencies.forEach(function( moduleSelector ){
					debug('dependencies[getting][cmd]:', moduleSelector);
					Promises.push( new require(moduleSelector) );
				});
				Promise.all(Promises).then(function(){
					debug('dependencies[getted][cmd]:', MaskModule.__modename);
					SetModuleStatus(MaskModule, 'required');
					CompileInFactory(MaskModule, GetExportsBySelectors(dependencies));
					resolve();
				});
			}else{
				debug('dependencies[doing][amd]:', modules.__modename);
				var argcs = [];
				var promiseAMD = function(z, deps, callback){
					if ( z + 1 > deps.length ){
						callback();
					}else{
						debug('dependencies[getting][amd]:', deps[z]);
						var PromiseRequire = new require(deps[z]);									
						PromiseRequire.then(function(){
							argcs.push(GetExportsBySelector(deps[z]));
							debug('dependencies[getted][amd]:', MaskModule.__modename);
							promiseAMD(++z, deps, callback);
						});
					}
				};
				promiseAMD(0, dependencies, function(){
					debug('dependencies[done]:', MaskModule.__modename);
					SetModuleStatus(MaskModule, 'required');
					CompileInFactory(MaskModule, argcs);
					resolve();
				});
			}
		}else{
			debug('dependencies[done]:', modules.__modename, []);
			SetModuleStatus(modules, 'required');
			CompileInFactory(modules);
			resolve();
		}
	});
};function CompileInFactory( modules, depicals ){
	var factory = modules.factory,
		inRequire = function( selector ){
			selector = RequireResolve(selector, modules.__dirname);
			return GetExportsBySelector(selector);
		};
	
	debug('compile[pending]:', modules.__modename);
	
	var ret = null,
		depicals = depicals ? depicals : [];

	modules.require = inRequire;
	modules.resolve = function( selector ){
		return RequireResolve.call(modules, selector, modules.__dirname);
	};
	modules.contrast = function( selector ){
		return RequireContrast.call(modules, selector, modules.__dirname);
	};
	
	debug('compile[extend]:', modules.__modename);
	
	window.modules.exports[modules.__modename].module = modules;
	
	try{
		depicals = depicals.concat([inRequire, modules.exports, modules]);
		if ( typeof factory === 'function' ){
			ret = factory.apply(modules, depicals ) || null;
		}else{
			ret = factory;
		}
		
		debug('compile[success]:', modules.__modename, ret);
	}catch(e){
		ret = window.modules.exports[modules.__modename].module.exports;
		debug('compile[error]:', modules.__modename, e.message);
	}

	if ( ret ){
		window.modules.exports[modules.__modename].module.exports = ret;
	};
	
	SetModuleStatus(modules, 'compiled');
	debug('compile[end]:', modules.__modename, ret);
};})( 
	window.location, 
	head = document.head || document.getElementsByTagName('head')[0] || document.documentElement,
	window.navigator.userAgent.indexOf('MSIE') > -1
);(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());