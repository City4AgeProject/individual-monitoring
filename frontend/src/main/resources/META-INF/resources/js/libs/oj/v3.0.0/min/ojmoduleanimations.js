/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","knockout","jquery","promise","ojs/ojanimation"],function(a,g,c){a.ka={};a.ka.y9=function(a,c){for(var e=g.virtualElements.firstChild(a);e;)1==e.nodeType?c.push(e):8==e.nodeType&&this.y9(e,c),e=g.virtualElements.nextSibling(e)};a.ka.jxa=function(a,c){a._ojOldRoot=c};a.ka.YCa=function(a){return a._ojOldRoot};a.ka.sza=function(b){if(b.isInitial)return!1;if(1==b.node.nodeType)return!0;if(8==b.node.nodeType){var c=[];a.ka.y9(b.node,c);if(c&&1==c.length)return a.ka.jxa(b,c[0]),!0}return!1};
a.ka.mCa=function(b){var c;1==b.node.nodeType?c=b.node:8==b.node.nodeType&&(c=a.ka.YCa(b));return c};a.ka.rW=function(a){var d=c(document.createElement("div")),e={position:"absolute",height:a.offsetHeight+"px",width:a.offsetWidth+"px",left:a.offsetLeft+"px",top:a.offsetTop+"px"};d.appendTo(a.offsetParent);d.css(e);d.addClass("oj-animation-host-viewport");a=document.createElement("div");a.className="oj-animation-host";d.append(a);return a};a.ka.yla=function(b,c,e){return{canAnimate:a.ka.sza,prepareAnimation:function(f){var g=
{};f=a.ka.mCa(f);c&&!e&&(g.newViewParent=a.ka.rW(f));b&&(g.oldViewParent=a.ka.rW(f));c&&e&&(g.newViewParent=a.ka.rW(f));return g},animate:function(e){var g=e.oldViewParent,k=e.newViewParent,l=[];g&&b&&l.push(a.ga.Hn(g,"close",b));k&&c&&l.push(a.ga.Hn(k,"open",c));return Promise.all(l).then(function(){a.ka.yIa(e)})}}};o_("ModuleAnimations.createAnimation",a.ka.yla,a);a.ka.Zha=function(a,c){var e=a[c];e&&(e=e.parentNode)&&e.parentNode&&e.parentNode.removeChild(e)};a.ka.yIa=function(b){b.removeOldView();
b.insertNewView();a.ka.Zha(b,"newViewParent");a.ka.Zha(b,"oldViewParent")};a.ka.gCa=function(b){null==a.ka.$Z&&(a.ka.$Z=a.sc.Gd("oj-animation-module-effects"));return a.ka.$Z?a.ka.$Z[b]:null};a.ka.qo=function(b){return(b=a.ka.gCa(b))?a.ka.yla(b.oldViewEffect,b.newViewEffect,b.newViewOnTop):null};a.ka.bY=function(b){null==a.ka.d_&&(a.ka.d_=a.sc.Gd("oj-animation-navigate-methods"));return a.ka.d_?a.ka.d_[b]:null};a.ka.PHa=function(b,c){var e=a.ka.bY(c);return a.ModuleAnimations[e]?null==a.ModuleAnimations[e].canAnimate||
a.ModuleAnimations[e].canAnimate(b):!1};a.ka.QHa=function(b,c){var e=a.ka.bY(c);return a.ModuleAnimations[e]&&a.ModuleAnimations[e].prepareAnimation?a.ModuleAnimations[e].prepareAnimation(b):null};a.ka.OHa=function(b,c){var e=a.ka.bY(c);return a.ModuleAnimations[e]&&a.ModuleAnimations[e].animate?a.ModuleAnimations[e].animate(b):Promise.resolve()};a.ka.hN=function(b){return{canAnimate:function(c){return a.ka.PHa(c,b)},prepareAnimation:function(c){return a.ka.QHa(c,b)},animate:function(c){return a.ka.OHa(c,
b)}}};a.ka.wla=a.ka.qo("coverLeft");o_("ModuleAnimations.coverLeft",a.ka.wla,a);a.ka.xla=a.ka.qo("coverRight");o_("ModuleAnimations.coverRight",a.ka.xla,a);a.ka.Upa=a.ka.qo("revealLeft");o_("ModuleAnimations.revealLeft",a.ka.Upa,a);a.ka.Vpa=a.ka.qo("revealRight");o_("ModuleAnimations.revealRight",a.ka.Vpa,a);a.ka.xOa="rtl"===a.Q.Oj()?a.ka.xla:a.ka.wla;o_("ModuleAnimations.coverStart",a.ka.xOa,a);a.ka.lTa="rtl"===a.Q.Oj()?a.ka.Upa:a.ka.Vpa;o_("ModuleAnimations.revealEnd",a.ka.lTa,a);a.ka.yOa=a.ka.qo("coverUp");
o_("ModuleAnimations.coverUp",a.ka.yOa,a);a.ka.kTa=a.ka.qo("revealDown");o_("ModuleAnimations.revealDown",a.ka.kTa,a);a.ka.d5=a.ka.qo("zoomIn");o_("ModuleAnimations.zoomIn",a.ka.d5,a);a.ka.e5=a.ka.qo("zoomOut");o_("ModuleAnimations.zoomOut",a.ka.e5,a);a.ka.kPa=a.ka.qo("fade");o_("ModuleAnimations.fade",a.ka.kPa,a);a.ka.CSa=a.ka.qo("pushStart");o_("ModuleAnimations.pushStart",a.ka.CSa,a);a.ka.BSa=a.ka.qo("pushEnd");o_("ModuleAnimations.pushEnd",a.ka.BSa,a);a.ka.cpa=a.ka.hN("navChild");o_("ModuleAnimations.navChild",
a.ka.cpa,a);a.ka.dpa=a.ka.hN("navParent");o_("ModuleAnimations.navParent",a.ka.dpa,a);a.ka.dPa=a.ka.cpa;o_("ModuleAnimations.drillIn",a.ka.dPa,a);a.ka.ePa=a.ka.dpa;o_("ModuleAnimations.drillOut",a.ka.ePa,a);a.ka.dSa=a.ka.hN("navSiblingEarlier");o_("ModuleAnimations.navSiblingEarlier",a.ka.dSa,a);a.ka.eSa=a.ka.hN("navSiblingLater");o_("ModuleAnimations.navSiblingLater",a.ka.eSa,a);a.ka.TTa=function(b){return new function(){function c(a){return function(b){return e[a].call(e,b)}}var e,f=this;this.canAnimate=
function(g){var k=b(g);e=null==k?null:a.ModuleAnimations[k];if(!e)return!1;for(var k=["prepareAnimation","animate"],l=0;l<k.length;l++){var m=k[l];f[m]=c(m)}return c("canAnimate")(g)}}};o_("ModuleAnimations.switcher",a.ka.TTa,a)});