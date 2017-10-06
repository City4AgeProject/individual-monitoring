/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(a,g){(function(){a.ab("oj.ojToolbar",g.oj.baseComponent,{widgetEventPrefix:"oj",options:{chroming:"half"},Og:function(c,b){this._super(c,b);"disabled"in b&&a.F.warn("Caller attempted to set the 'disabled' option on Toolbar, but Toolbar does not support the 'disabled' option.  See API doc.")},_ComponentCreate:function(){this._super();this.element.attr(a.Components.Bp,this.widgetName).addClass("oj-toolbar oj-component").attr("role","toolbar");
this.hb(!0)},bi:function(a,b,d){a=this.element.find(":oj-button[tabindex\x3d0]");this.di(b,d,{launcher:a,position:{of:"keyboard"===d?a.ojButton("widget"):b}})},_setOption:function(c,b){"disabled"===c?a.F.warn("Caller attempted to set the 'disabled' option on Toolbar, but Toolbar does not support the 'disabled' option.  See API doc.  Ignoring the call."):(this._superApply(arguments),"chroming"===c&&(this.gS.ojButtonset("refresh"),this.g5.ojButton("refresh")))},refresh:function(){this._super();this.hb(!1)},
hb:function(a){var b=this;this.im="rtl"===this.rd();this.lg=this.element.find(":oj-button").unbind("keydown"+this.eventNamespace).bind("keydown"+this.eventNamespace,function(a){b.Lx(a,g(this))}).unbind("click"+this.eventNamespace).bind("click"+this.eventNamespace,function(){g(this).ojButton("option","disabled")||b.Ay(g(this))}).unbind("focus"+this.eventNamespace).bind("focus"+this.eventNamespace,function(){b.Ay(g(this))});this.gS=this.element.find(":oj-buttonset").ojButtonset("refresh");this.g5=this.lg.not(this.gS.find(":oj-button")).ojButton("refresh");
this.nr=this.lg.filter(function(){return!g(this).ojButton("option","disabled")});this.sZ(a)},sZ:function(a){var b=g(this.ay);this.ay=void 0;this.lg.attr("tabindex","-1");a=a||!b.is(this.nr)?this.nr.first():b;this.Ay(a)},TZ:function(a){var b=this.nr;return a.map(function(a,c){if("radio"!=c.type||c.checked||""==c.name)return c;var f=c.name;f?(f=f.replace(/'/g,"\\'"),f=b.filter(":radio[name\x3d'"+f+"']:oj-button")):f=b.filter(c).filter(":oj-button");f=f.filter(":checked");return f.length?f[0]:c})},Ay:function(a){a=
this.TZ(a);var b=a[0],d=this.ay;b!==d&&(g(d).attr("tabindex","-1"),a.attr("tabindex","0"),this.ay=b)},Lx:function(a,b){switch(a.which){case g.ui.keyCode.UP:case g.ui.keyCode.DOWN:if("radio"!=b.attr("type"))break;case g.ui.keyCode.LEFT:case g.ui.keyCode.RIGHT:a.preventDefault();var d=this.nr,e=d.length;if(2>e)break;var f=d.index(b);d.eq((f+(a.which==g.ui.keyCode.DOWN||a.which==g.ui.keyCode.RIGHT^this.im?1:-1)+e)%e).focus()}},_destroy:function(){this.element.removeClass("oj-toolbar oj-component").removeAttr(a.Components.Bp).removeAttr("role");
this.lg.attr("tabindex","0");this.gS.ojButtonset("refresh");this.g5.ojButton("refresh")}})})();a.Components.gp({ojToolbar:{chroming:a.Components.cf(function(){return(a.sc.Gd("oj-toolbar-option-defaults")||{}).chroming})}});a.U.ob("oj-toolbar","baseComponent",{properties:{chroming:{type:"string"},disabled:{}},methods:{destroy:{},refresh:{},widget:{}},extension:{mb:"ojToolbar"}});a.U.register("oj-toolbar",{metadata:a.U.getMetadata("oj-toolbar")})});