YUI.add("queue-base",function(B){function A(){var C=this instanceof A?this:new A();return C._init(arguments);}A.defaults={};A.prototype={_defaults:null,active:false,_init:function(D){D=B.Array(D,0,true);var C=D.shift();this._q=[];this._defaults=B.merge(A.defaults,{context:this},(B.Lang.isObject(C)?C:{}));this.publish("executeCallback",{defaultFn:this._defExecFn});this.publish("shiftCallback",{defaultFn:this._defShiftFn});return this.add.apply(this,D);},run:function(){this.active=true;var C=this._q.shift();while(C&&this.active){this._defExecFn(C);C=this._q.shift();}if(!this.size()){this.active=false;}return this;},_defExecFn:function(C){if(B.Lang.isFunction(C.fn)){C.fn.apply(C.context,B.Array(C.args));}},add:function(){var F=B.Array(arguments,0,true),D,C,G,E=[];for(D=0,C=F.length;D<C;++D){G=this._prepareCallback(F[D]);if(B.Lang.isObject(G)){this._q.push(G);E.push(G);}}this.fire("addCallback",E);return this;},_prepareCallback:function(C){if(B.Lang.isFunction(C)){C={fn:C};}if(B.Lang.isObject(C)){C=B.merge(this._defaults,C);}return C;},pause:function(){this.active=false;return this;},stop:function(){this.active=false;this._q=[];return this;},size:function(){return this._q.length;},publish:function(){},fire:function(){}};B.Queue=A;},"@VERSION@");YUI.add("queue-full",function(C){var B="executeCallback",A="shiftCallback";C.mix(C.Queue.defaults,{iterations:1,timeout:-1,until:function(){this.iterations|=0;return this.iterations<=0;}},true);C.mix(C.Queue.prototype,{_tId:0,run:function(){var D=this._q[0];if(D&&this.isReady()){this._processCallback(D);}else{if(!D){this.active=false;this.fire("complete");}}return this;},isReady:function(){return !this._tId;},_processCallback:function(D){this.active=true;if(D.timeout<0){this._processSync(D);}else{this._processAsync(D);}},_processSync:function(D){while(this.active&&this.isReady()&&!D.until()){D.iterations--;this._tId=-1;this.fire(B,D);this._tId=0;}if(this.isReady()){this.fire(A);}if(this.active){this.run();}},_processAsync:function(E){var D=this;if(E.until()){this.fire(A);this.run();}else{this._tId=setTimeout(function(){E.iterations--;D.fire(B,E);D._tId=0;if(D.active){D.run();}},E.timeout);}},_defShiftFn:function(){this._q.shift();},pause:function(){clearTimeout(this._tId);this._tId=0;this.active=false;this.fire("pause");return this;},stop:function(){clearTimeout(this._tId);this._tId=0;this.active=false;this._q=[];this.fire("stop");return this;},getCallback:function(E){for(var F=0,D=this._q.length;F<D;++F){if(this._q[F].name===E){return this._q[F];}}return null;},promote:function(D){if(!this.isReady()){var E=this.after(A,function(){this._promote(D);E.detach();},this);}else{this._promote(D);}return this;},_promote:function(E){var F,D,G;for(F=0,D=this._q.length;F<D;++F){if(this._q[F]===E||this._q[F].name===E){G=this._q.splice(F,1)[0];this._q.unshift(G);this.fire("promoteCallback",G);break;}}},remove:function(D){if(!this.isReady()){var E=this.after(A,function(){this._remove(D);E.detach();},this);}else{this._remove(D);}return this;},_remove:function(E){for(var F=0,D=this._q.length;F<D;++F){if(this._q[F]===E||this._q[F].name===E){this.fire("removeCallback",this._q.splice(F,1));D--;}}}},true);C.augment(C.Queue,C.Event.Target,true);},"@VERSION@",{requires:["queue-base","event"]});YUI.add("queue-io",function(B){var A=B.Queue.prototype._init;B.mix(B.Queue.prototype,{_init:function(){this.before("executeCallback",this._bindIOListeners);this.after("executeCallback",this._detachIOStartListener);return A.apply(this,arguments);},_waiting:null,_ioStartSub:null,_ioSuccessSub:null,_ioFailureSub:null,_ioAbortSub:null,_shiftSub:null,isReady:function(){return !this._tId&&!this._waiting;},_bindIOListeners:function(C){if(C.waitForIOResponse){this._ioStartSub=B.on("io:start",B.bind(this._ioStartHandler,this));this._ioSuccessSub=B.on("io:success",B.bind(this._ioEndHandler,this));this._ioFailureSub=B.on("io:failure",B.bind(this._ioEndHandler,this));this._ioAbortSub=B.on("io:abort",B.bind(this._ioEndHandler,this));this._shiftSub=this.before("shiftCallback",this._detachIOListeners);}},_detachIOStartListener:function(C){if(this._ioStartSub){this._ioStartSub.detach();}},_ioStartHandler:function(C){this._waiting=this._waiting||{};this._waiting[C]=true;},_ioEndHandler:function(E){var D=!this._waiting,C=this;if(!D){delete this._waiting[E];D=!B.Object.keys(this._waiting).length;}if(D){this._waiting=null;setTimeout(function(){C.run();},0);}},_detachIOListeners:function(){this._ioSuccessSub.detach();this._ioFailureSub.detach();this._ioAbortSub.detach();this._shiftSub.detach();}},true);},"@VERSION@",{requires:["queue-full","io-base"]});YUI.add("queue",function(A){},"@VERSION@",{use:["queue-base","queue-full","queue-io"]});