YUI.add("queue-base",function(B){function A(){var C=this instanceof A?this:new A();return C._init(arguments);}A.defaults={};A.prototype={_defaults:null,active:false,_init:function(D){D=B.Array(D,0,true);var C=D.shift();this._q=[];this._defaults=B.merge(A.defaults,{context:this},(B.Lang.isObject(C)?C:{}));this.publish("executeCallback",{defaultFn:this._defExecFn});this.publish("shiftCallback",{defaultFn:this._defShiftFn});return this.add.apply(this,D);},run:function(){this.active=true;var C=this._q.shift();while(C&&this.active){this._defExecFn(C);C=this._q.shift();}if(!this.size()){this.active=false;}return this;},_defExecFn:function(C){if(B.Lang.isFunction(C.fn)){C.fn.apply(C.context,B.Array(C.args));}},add:function(){var F=B.Array(arguments,0,true),D,C,G,E=[];for(D=0,C=F.length;D<C;++D){G=this._prepareCallback(F[D]);if(B.Lang.isObject(G)){this._q.push(G);E.push(G);}}this.fire("addCallback",E);return this;},_prepareCallback:function(C){if(B.Lang.isFunction(C)){C={fn:C};}if(B.Lang.isObject(C)){C=B.merge(this._defaults,C);}return C;},pause:function(){this.active=false;return this;},stop:function(){this.active=false;this._q=[];return this;},size:function(){return this._q.length;},publish:function(){},fire:function(){}};B.Queue=A;},"@VERSION@");