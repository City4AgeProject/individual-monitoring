/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
/*
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
*/
define(["ojs/ojcore","jquery","promise","ojs/ojcomponentcore","ojs/ojpopupcore","ojs/ojanimation","ojs/ojbutton","jqueryui-amd/widgets/draggable","jqueryui-amd/widgets/mouse"],function(a,g){(function(){a.ab("oj.ojResizable",g.oj.baseComponent,{version:"1.0.0",widgetEventPrefix:"oj",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",containment:!1,ghost:!1,
grid:!1,handles:"e,s,se",helper:!1,resize:null,start:null,stop:null},f_:function(a){return parseInt(a,10)||0},yh:function(a){return!isNaN(parseInt(a,10))},Jea:function(a,b){if("hidden"===g(a).css("overflow"))return!1;var d=b&&"left"===b?"scrollLeft":"scrollTop",e=!1;if(0<a[d])return!0;a[d]=1;e=0<a[d];a[d]=0;return e},_ComponentCreate:function(){this._super();var a,b,d,e,f,h=this;a=this.options;b=this.element.mouse.bind(this.element);b();this.kt=b("instance");this.kt._mouseCapture=function(a){this.element&&
this.element.focus();return h.FHa(a)};this.kt._mouseStart=function(a){return h.IHa(a)};this.kt._mouseDrag=function(a){return h.GHa(a)};this.kt._mouseStop=function(a){return h.NG(a)};this.element.addClass("oj-resizable");g.extend(this,{DR:this.element,DO:[],dq:null});this.handles=a.handles||(g(".oj-resizable-handle",this.element).length?{vWa:".oj-resizable-n",$Va:".oj-resizable-e",SR:".oj-resizable-s",ij:".oj-resizable-w",BWa:".oj-resizable-se",GWa:".oj-resizable-sw",wWa:".oj-resizable-ne",xWa:".oj-resizable-nw"}:
"e,s,se");if(this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),a=this.handles.split(","),this.handles={},b=0;b<a.length;b++)d=g.trim(a[b]),f="oj-resizable-"+d,e=g("\x3cdiv class\x3d'oj-resizable-handle "+f+"'\x3e\x3c/div\x3e"),this.handles[d]=".oj-resizable-"+d,this.element.append(e);this.ZJa=function(){for(var a in this.handles)this.handles[a].constructor===String&&(this.handles[a]=this.element.children(this.handles[a]).first().show())};this.ZJa();this.jFa=
g(".oj-resizable-handle",this.element);this.jFa.mouseover(function(){h.Qpa||(this.className&&(e=this.className.match(/oj-resizable-(se|sw|ne|nw|n|e|s|w)/i)),h.axis=e&&e[1]?e[1]:"se")});this.kt._mouseInit()},_destroy:function(){this.kt&&this.kt._mouseDestroy();try{this.kt.destroy(),this.kt=null}catch(a){}g(this.DR).removeClass("oj-resizable oj-resizable-disabled oj-resizable-resizing").removeData("resizable").removeData("oj-resizable").unbind(".resizable").find(".oj-resizable-handle").remove();return this},
FHa:function(a){var b,d,e=!1;for(b in this.handles)if(d=g(this.handles[b])[0],d===a.target||g.contains(d,a.target))e=!0;return!this.options.disabled&&e},IHa:function(a){var b,d,e;e=this.options;b=this.element.position();var f=this.element;this.Qpa=!0;/absolute/.test(f.css("position"))?f.css({position:"absolute",top:f.css("top"),left:f.css("left")}):f.is(".oj-draggable")&&f.css({position:"absolute",top:b.top,left:b.left});this.aKa();b=this.f_(this.helper.css("left"));d=this.f_(this.helper.css("top"));
e.containment&&(b+=g(e.containment).scrollLeft()||0,d+=g(e.containment).scrollTop()||0);this.offset=this.helper.offset();this.position={left:b,top:d};this.size={width:f.width(),height:f.height()};this.ep={width:f.width(),height:f.height()};this.Zv={left:b,top:d};this.VR={width:f.outerWidth()-f.width(),height:f.outerHeight()-f.height()};this.tSa={left:a.pageX,top:a.pageY};this.Aq=this.ep.width/this.ep.height||1;e=g(".oj-resizable-"+this.axis).css("cursor");g("body").css("cursor","auto"===e?this.axis+
"-resize":e);f.addClass("oj-resizable-resizing");this.C_("start",a);this.ywa(a);this.mya(a);return!0},GHa:function(a){var b,d=this.helper,e={},f=this.tSa;b=a.pageX-f.left||0;var f=a.pageY-f.top||0,h=this.Nl[this.axis];this.ED={top:this.position.top,left:this.position.left};this.FD={width:this.size.width,height:this.size.height};if(!h)return!1;b=h.apply(this,[a,b,f]);this.pNa(a.shiftKey);a.shiftKey&&(b=this.nNa(b,a));b=this.rKa(b,a);this.cNa(b);this.C_("resize",a);this.xwa(a,this.ui());this.lya(a,
this.ui());this.position.top!==this.ED.top&&(e.top=this.position.top+"px");this.position.left!==this.ED.left&&(e.left=this.position.left+"px");this.size.width!==this.FD.width&&(e.width=this.size.width+"px");this.size.height!==this.FD.height&&(e.height=this.size.height+"px");d.css(e);!this.dq&&this.DO.length&&this.RIa();g.isEmptyObject(e)||this._trigger("resize",a,this.ui());return!1},NG:function(a){this.Qpa=!1;g("body").css("cursor","auto");this.element.removeClass("oj-resizable-resizing");this.C_("stop",
a);this.zwa(a);this.nya(a);return!1},pNa:function(a){var b,d,e,f;f=this.options;f={minWidth:this.yh(f.minWidth)?f.minWidth:0,maxWidth:this.yh(f.maxWidth)?f.maxWidth:Infinity,minHeight:this.yh(f.minHeight)?f.minHeight:0,maxHeight:this.yh(f.maxHeight)?f.maxHeight:Infinity};a&&(a=f.minHeight*this.Aq,d=f.minWidth/this.Aq,b=f.maxHeight*this.Aq,e=f.maxWidth/this.Aq,a>f.minWidth&&(f.minWidth=a),d>f.minHeight&&(f.minHeight=d),b<f.maxWidth&&(f.maxWidth=b),e<f.maxHeight&&(f.maxHeight=e));this.sNa=f},cNa:function(a){this.offset=
this.helper.offset();this.yh(a.left)&&(this.position.left=a.left);this.yh(a.top)&&(this.position.top=a.top);this.yh(a.height)&&(this.size.height=a.height);this.yh(a.width)&&(this.size.width=a.width)},nNa:function(a){var b=this.position,d=this.size,e=this.axis;this.yh(a.height)?a.width=a.height*this.Aq:this.yh(a.width)&&(a.height=a.width/this.Aq);"sw"===e&&(a.left=b.left+(d.width-a.width),a.top=null);"nw"===e&&(a.top=b.top+(d.height-a.height),a.left=b.left+(d.width-a.width));return a},rKa:function(a){var b=
this.sNa,d=this.axis,e=this.yh(a.width)&&b.maxWidth&&b.maxWidth<a.width,f=this.yh(a.height)&&b.maxHeight&&b.maxHeight<a.height,g=this.yh(a.width)&&b.minWidth&&b.minWidth>a.width,k=this.yh(a.height)&&b.minHeight&&b.minHeight>a.height,l=this.Zv.left+this.ep.width,m=this.position.top+this.size.height,p=/sw|nw|w/.test(d),d=/nw|ne|n/.test(d);g&&(a.width=b.minWidth);k&&(a.height=b.minHeight);e&&(a.width=b.maxWidth);f&&(a.height=b.maxHeight);g&&p&&(a.left=l-b.minWidth);e&&p&&(a.left=l-b.maxWidth);k&&d&&
(a.top=m-b.minHeight);f&&d&&(a.top=m-b.maxHeight);a.width||a.height||a.left||!a.top?a.width||a.height||a.top||!a.left||(a.left=null):a.top=null;return a},RIa:function(){if(this.DO.length){var a,b,d,e,f,g=this.helper||this.element;for(a=0;a<this.DO.length;a++){f=this.DO[a];if(!this.DC)for(this.DC=[],d=[f.css("borderTopWidth"),f.css("borderRightWidth"),f.css("borderBottomWidth"),f.css("borderLeftWidth")],e=[f.css("paddingTop"),f.css("paddingRight"),f.css("paddingBottom"),f.css("paddingLeft")],b=0;b<
d.length;b++)this.DC[b]=(parseInt(d[b],10)||0)+(parseInt(e[b],10)||0);f.css({height:g.height()-this.DC[0]-this.DC[2]||0,width:g.width()-this.DC[1]-this.DC[3]||0})}}},aKa:function(){this.element.offset();this.helper=this.element},Nl:{e:function(a,b){return{width:this.ep.width+b}},w:function(a,b){return{left:this.Zv.left+b,width:this.ep.width-b}},n:function(a,b,d){return{top:this.Zv.top+d,height:this.ep.height-d}},s:function(a,b,d){return{height:this.ep.height+d}},se:function(a,b,d){return g.extend(this.Nl.s.apply(this,
arguments),this.Nl.e.apply(this,[a,b,d]))},sw:function(a,b,d){return g.extend(this.Nl.s.apply(this,arguments),this.Nl.w.apply(this,[a,b,d]))},ne:function(a,b,d){return g.extend(this.Nl.n.apply(this,arguments),this.Nl.e.apply(this,[a,b,d]))},nw:function(a,b,d){return g.extend(this.Nl.n.apply(this,arguments),this.Nl.w.apply(this,[a,b,d]))}},C_:function(a,b){"resize"!==a&&this._trigger(a,b,this.ui())},ywa:function(){function a(b){g(b).each(function(){var a=g(this);a.data("oj-resizable-alsoresize",{width:parseInt(a.width(),
10),height:parseInt(a.height(),10),left:parseInt(a.css("left"),10),top:parseInt(a.css("top"),10)})})}var b=this.options;"object"!==typeof b.alsoResize||b.alsoResize.parentNode?a(b.alsoResize):b.alsoResize.length?(b.alsoResize=b.alsoResize[0],a(b.alsoResize)):g.each(b.alsoResize,function(b){a(b)})},xwa:function(a,b){function d(a,c){g(a).each(function(){var a=g(this),d=g(this).data("oj-resizable-alsoresize"),e={};g.each(c&&c.length?c:a.parents(b.DR[0]).length?["width","height"]:["width","height","top",
"left"],function(a,b){var c=(d[b]||0)+(k[b]||0);c&&0<=c&&(e[b]=c||null)});a.css(e)})}var e=this.options,f=this.ep,h=this.Zv,k={height:this.size.height-f.height||0,width:this.size.width-f.width||0,top:this.position.top-h.top||0,left:this.position.left-h.left||0};"object"!==typeof e.alsoResize||e.alsoResize.nodeType?d(e.alsoResize,null):g.each(e.alsoResize,function(a,b){d(a,b)})},zwa:function(){g(this).removeData("oj-resizable-alsoresize")},mya:function(){var a,b,d,e,f,h=this,k=h.element;d=h.options.containment;
if(k=d instanceof g?d.get(0):/parent/.test(d)?k.parent().get(0):d)h.PP=g(k),/document/.test(d)||d===document?(h.QP={left:0,top:0},h.sla={left:0,top:0},h.aw={element:g(document),left:0,top:0,width:g(document).width(),height:g(document).height()||document.body.parentNode.scrollHeight}):(a=g(k),b=[],g(["Top","Right","Left","Bottom"]).each(function(d,e){b[d]=h.f_(a.css("padding"+e))}),h.QP=a.offset(),h.sla=a.position(),h.tla={height:a.innerHeight()-b[3],width:a.innerWidth()-b[1]},d=h.QP,e=h.tla.height,
f=h.tla.width,f=h.Jea(k,"left")?k.scrollWidth:f,e=h.Jea(k)?k.scrollHeight:e,h.aw={element:k,left:d.left,top:d.top,width:f,height:e})},lya:function(a,b){var d,e,f,g;d=this.options;e=this.QP;g=this.position;var k=a.shiftKey;f={top:0,left:0};var l=this.PP,m=!0;l[0]!==document&&/static/.test(l.css("position"))&&(f=e);g.left<(this.dq?e.left:0)&&(this.size.width+=this.dq?this.position.left-e.left:this.position.left-f.left,k&&(this.size.height=this.size.width/this.Aq,m=!1),this.position.left=d.helper?e.left:
0);g.top<(this.dq?e.top:0)&&(this.size.height+=this.dq?this.position.top-e.top:this.position.top,k&&(this.size.width=this.size.height*this.Aq,m=!1),this.position.top=this.dq?e.top:0);this.offset.left=this.aw.left+this.position.left;this.offset.top=this.aw.top+this.position.top;d=Math.abs((this.dq?this.offset.left-f.left:this.offset.left-e.left)+this.VR.width);e=Math.abs((this.dq?this.offset.top-f.top:this.offset.top-e.top)+this.VR.height);f=this.PP.get(0)===this.element.parent().get(0);g=/relative|absolute/.test(this.PP.css("position"));
f&&g&&(d-=Math.abs(this.aw.left));d+this.size.width>=this.aw.width&&(this.size.width=this.aw.width-d,k&&(this.size.height=this.size.width/this.Aq,m=!1));e+this.size.height>=this.aw.height&&(this.size.height=this.aw.height-e,k&&(this.size.width=this.size.height*this.Aq,m=!1));m||(this.position.left=b.ED.left,this.position.top=b.ED.top,this.size.width=b.FD.width,this.size.height=b.FD.height)},nya:function(){var a=this.options,b=this.QP,d=this.sla,e=this.PP,f=g(this.helper),h=f.offset(),k=f.outerWidth()-
this.VR.width,f=f.outerHeight()-this.VR.height;this.dq&&!a.animate&&/relative/.test(e.css("position"))&&g(this).css({left:h.left-d.left-b.left,width:k,height:f});this.dq&&!a.animate&&/static/.test(e.css("position"))&&g(this).css({left:h.left-d.left-b.left,width:k,height:f})},ui:function(){return{DR:this.DR,element:this.element,helper:this.helper,position:this.position,size:this.size,ep:this.ep,Zv:this.Zv,FD:this.FD,ED:this.ED}}})})();(function(){a.ab("oj.ojDialog",g.oj.baseComponent,{version:"1.0.0",
widgetEventPrefix:"oj",options:{cancelBehavior:"icon",dragAffordance:"title-bar",initialVisibility:"hide",modality:"modal",position:{my:"center",at:"center",of:window,collision:"fit",KWa:function(a){var b=g(this).css(a).offset().top;0>b&&g(this).css("top",a.top-b)}},resizeBehavior:"resizable",role:"dialog",title:null,beforeClose:null,beforeOpen:null,close:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null,animateStart:null,animateEnd:null},_ComponentCreate:function(){this._super();
this.sSa={display:this.element[0].style.display,width:this.element[0].style.width,height:this.element[0].style.height};this.Zv={parent:this.element.parent(),index:this.element.parent().children().index(this.element)};this.j4=this.element.attr("title");this.options.title=this.options.title||this.j4;this.gza();this.element.show().removeAttr("title").addClass("oj-dialog-content oj-dialog-default-content").appendTo(this.Ic);this.FJ=!1;if(this.element.find(".oj-dialog").length){var a=this;this.element.find(".oj-dialog-header").each(function(b,
d){var e=g(d);if(!e.closest(".oj-dialog-body").length)return a.iv=e,a.FJ=!0,!1})}else this.iv=this.element.find(".oj-dialog-header"),this.iv.length&&(this.FJ=!0);this.FJ?(this.Tya(this.iv),this.iv.prependTo(this.Ic),this.Gs=this.iv.find(".oj-dialog-title"),"icon"===this.options.cancelBehavior&&(this.dM(this.iv),this.Gs.length&&this.Gs.insertAfter(this.Gq)),this.Gs.length&&(this.Gs.uniqueId(),this.Ic.attr({"aria-labelledby":this.Gs.attr("id")}))):this.eza();this.At=this.element.children(".oj-dialog-footer");
this.Sya(this.At);this.At.length&&(this.At.addClass("oj-helper-clearfix"),this.At.appendTo(this.Ic));"title-bar"===this.options.dragAffordance&&g.fn.draggable&&this.OB();this.y0(this.Ic);this.zo=!1},V6:function(){"show"===this.options.initialVisibility&&this.open()},_destroy:function(){this.uza&&window.clearTimeout(this.uza);this.isOpen()&&this.fu();this.rq("none");this.ys&&(this.ys("instance")&&this.ys("destroy"),this.ys=null);this.At.length&&(this.At.removeClass("oj-helper-clearfix"),g("#"+this.fha).replaceWith(this.At));
this.nM();if(this.FJ){this.Gs.removeUniqueId();var a=this.Ic.find(".oj-dialog-header");a&&g("#"+this.gha).replaceWith(a)}this.Qqa&&(this.Qqa.remove(),this.Qqa=null);this.element.removeUniqueId().removeClass("oj-dialog-content oj-dialog-default-content").css(this.sSa);this.Ic&&this.Ic.stop(!0,!0);this.element.unwrap();this.j4&&this.element.attr("title",this.j4);this.Bt&&(this.Bt.remove(),this.Bt=null);delete this.Do;delete this.zo;this._super()},widget:function(){return this.Ic},disable:g.noop,enable:g.noop,
close:function(c){if(!this.Ju("close",[c])&&this.isOpen()&&(!1!==this._trigger("beforeClose",c)||this.Sx)){this.rq("close");this.zo=!1;this.MAa=null;this.opener.filter(":focusable").focus().length||g(this.document[0].activeElement).blur();if("modal"===this.options.modality){var b=Array.prototype.forEach;b.call(this.element[0].parentElement.getElementsByClassName("oj-helper-element-in-dialog-with-accesskey"),function(a){a.classList.remove("oj-helper-element-in-dialog-with-accesskey")});b.call(document.getElementsByClassName("oj-helper-element-with-accesskey"),
function(a){a.setAttribute("accesskey",a.getAttribute("data-ojAccessKey"));a.removeAttribute("data-ojAccessKey");a.classList.remove("oj-helper-element-with-accesskey")})}b={};b[a.Y.Oa.Te]=this.Ic;b[a.Y.Oa.Qz]={closeEvent:c};a.Y.jc().close(b)}},dF:function(c){var b=c[a.Y.Oa.Te];c=(a.sc.Gd("oj-dialog-option-defaults")||{}).animation;if(!this.Sx&&c&&c.close){var d=b.attr("style");return a.ga.Hn(b[0],"close",c.close,this).then(function(){b.attr("style",d);b.hide()})}b.hide()},Fp:function(c){c=c[a.Y.Oa.Qz];
var b;c&&(b=c.closeEvent);this._trigger("close",b)},isOpen:function(){return this.zo},open:function(c){if(!this.Ju("open",[c])&&!1!==this._trigger("beforeOpen",c))if(this.isOpen())this.mX();else{this.rq("open");this.zo=!0;this.opener=g(this.document[0].activeElement);"resizable"===this.options.resizeBehavior&&this.wga();c="rtl"===this.rd();c=a.Fa.cp(this.options.position,c);if("modal"===this.options.modality){var b=Array.prototype.forEach,d=this.element[0].parentElement.querySelectorAll("[accesskey]");
b.call(d,function(a){a.classList.add("oj-helper-element-in-dialog-with-accesskey")});d=document.querySelectorAll("[accesskey]");b.call(d,function(a){a.classList.contains("oj-helper-element-in-dialog-with-accesskey")||(a.classList.add("oj-helper-element-with-accesskey"),a.setAttribute("data-ojAccessKey",a.getAttribute("accesskey")),a.removeAttribute("accesskey"))})}b={};b[a.Y.Oa.Te]=this.Ic;b[a.Y.Oa.Zz]=this.opener;b[a.Y.Oa.wr]=c;b[a.Y.Oa.wl]=this.options.modality;b[a.Y.Oa.qr]=this.sB();b[a.Y.Oa.Gt]=
"oj-dialog-layer";b[a.Y.Oa.Ft]=a.Y.Ft.oT;a.Y.jc().open(b)}},eF:function(c){var b=c[a.Y.Oa.Te];c=c[a.Y.Oa.wr];b.show();b.position(c);if((c=(a.sc.Gd("oj-dialog-option-defaults")||{}).animation)&&c.open)return a.ga.Hn(b[0],"open",c.open,this)},VE:function(){this._trigger("open");this.mX()},refresh:function(){this._super()},mX:function(){var c=this.MAa;c&&0<c.length&&a.Q.Bv(this.Ic[0],c[0])||(c||(c=this.element.find("[autofocus]")),c.length||(c=this.element.find(":tabbable")),c.length||this.At.length&&
(c=this.At.find(":tabbable")),c.length||this.Gq&&(c=this.Gq.filter(":focusable")),c.length||(c=this.Ic),c.eq(0).focus(),this._trigger("focus"))},_keepFocus:function(a){a.preventDefault();a=this.document[0].activeElement;this.Ic[0]===a||g.contains(this.Ic[0],a)||this.mX()},yh:function(a){return!isNaN(parseInt(a,10))},gza:function(){this.Vfa=!1;this.element.uniqueId();this.TW=this.element.attr("id");this.Xd?(this.Ic=g(this.Xd),this.Ic.uniqueId(),this.Mka=this.Ic.attr("id")):(this.Mka="ojDialogWrapper-"+
this.TW,this.Ic=g("\x3cdiv\x3e"),this.Ic.insertBefore(this.element));this.Ic.addClass("oj-dialog oj-component").hide().attr({tabIndex:-1,role:this.options.role,id:this.Mka,"data-oj-context":""});this._on(this.Ic,{keyup:function(){},keydown:function(a){if("none"!=this.options.cancelBehavior&&!a.isDefaultPrevented()&&a.keyCode&&a.keyCode===g.ui.keyCode.ESCAPE)a.preventDefault(),a.stopImmediatePropagation(),this.close(a);else if(a.keyCode===g.ui.keyCode.TAB){var b=this.Ic.find(":tabbable"),d=b.filter(":first"),
e=b.filter(":last");a.shiftKey?a.shiftKey&&(a.target===d[0]||a.target===this.Ic[0]?(e.focus(),a.preventDefault()):(d=b.index(document.activeElement),1==d&&b[0]&&(b[0].focus(),a.preventDefault()))):a.target===e[0]||a.target===this.Ic[0]?(d.focus(),a.preventDefault()):(d=b.index(document.activeElement),0==d&&b[1]&&(b[1].focus(),a.preventDefault()))}}});this.element.find("[aria-describedby]").length||this.Ic.attr({"aria-describedby":this.element.uniqueId().attr("id")})},y0:function(a){var b=this;this._focusable({applyHighlight:!0,
setupHandlers:function(d,e){b._on(a,{focus:function(a){d(g(a.currentTarget))},blur:function(a){e(g(a.currentTarget))}})}})},nM:function(){this.Gq&&(this.Gq.remove(),this.Gq=null)},dM:function(a){this.Gq=g("\x3cbutton\x3e\x3c\button\x3e").addClass("oj-dialog-header-close-wrapper");this.Gq.ojButton({display:"icons",chroming:"half",label:this.R("labelCloseIcon"),icons:{start:"oj-component-icon oj-fwk-icon-cross"}}).attr("tabindex","1").appendTo(a);this._on(this.Gq,{click:function(a){a.preventDefault();
a.stopImmediatePropagation();this.close(a)},keydown:function(a){if(a.keyCode&&a.keyCode===g.ui.keyCode.SPACE||a.keyCode===g.ui.keyCode.ENTER)a.preventDefault(),a.stopImmediatePropagation(),this.close(a)}})},eza:function(){var a;this.Bt=g("\x3cdiv\x3e").addClass("oj-dialog-header oj-helper-clearfix").prependTo(this.Ic);this._on(this.Bt,{mousedown:function(a){g(a.target);a=g(a.target).parent().parent();var c=!1;a&&(c=a.hasClass("oj-dialog-header-close-wrapper"));c||this.Ic.focus()}});"icon"===this.options.cancelBehavior&&
this.dM(this.Bt);a=g("\x3cspan\x3e").uniqueId().addClass("oj-dialog-title").appendTo(this.Bt);this.tC(a);this.Ic.attr({"aria-labelledby":a.attr("id")})},tC:function(a){this.options.title||a.html("\x26#160;");a.text(this.options.title)},OB:function(){function a(b){return{position:b.position,offset:b.offset}}var b=this,d=this.options;this.Ic.draggable({RVa:!1,cancel:".oj-dialog-content, .oj-dialog-header-close",handle:".oj-dialog-header",containment:"document",start:function(d,f){g(this).addClass("oj-dialog-dragging");
b.YG();b._trigger("dragStart",d,a(f))},drag:function(d,f){b.YG();b._trigger("drag",d,a(f))},stop:function(e,f){var h=f.offset.left-b.document.scrollLeft(),k=f.offset.top-b.document.scrollTop();d.position={my:"left top",at:"left"+(0<=h?"+":"")+h+" top"+(0<=k?"+":"")+k,of:window};g(this).removeClass("oj-dialog-dragging");b.YG();b._trigger("dragStop",e,a(f))}});this.Ic.addClass("oj-draggable")},wga:function(){function a(b){return{originalPosition:b.Zv,originalSize:b.ep,position:b.position,size:b.size}}
var b=this;this.Ic.css("position");this.ys=this.Ic.ojResizable.bind(this.Ic);this.ys({cancel:".oj-dialog-content",containment:"document",handles:"n,e,s,w,se,sw,ne,nw",start:function(d,e){b.Vfa=!0;g(this).addClass("oj-dialog-resizing");b._trigger("resizeStart",d,a(e))},resize:function(d,e){b._trigger("resize",d,a(e))},stop:function(d,e){b.Vfa=!1;g(this).removeClass("oj-dialog-resizing");b._trigger("resizeStop",d,a(e))}})},u_:function(){var c="rtl"===this.rd(),c=a.Fa.cp(this.options.position,c);this.Ic.position(c);
this.YG()},YG:function(){a.Y.jc().cS(this.Ic,a.Y.ic.vr)},_setOption:function(c,b,d){var e;e=this.Ic;if("disabled"!==c)switch(this._super(c,b,d),c){case "dragAffordance":(c=e.hasClass("oj-draggable"))&&"none"===b&&(e.draggable("destroy"),this.Ic.removeClass("oj-draggable"));c||"title-bar"!==b||this.OB();break;case "position":this.u_();break;case "resizeBehavior":e=!1;this.ys&&(e=!0);e&&"resizable"!=b&&(this.ys("instance")&&this.ys("destroy"),this.ys=null);e||"resizable"!==b||this.wga();break;case "title":this.tC(this.Bt.find(".oj-dialog-title"));
break;case "role":e.attr("role",b);break;case "modality":this.isOpen()&&(e={},e[a.Y.Oa.Te]=this.Ic,e[a.Y.Oa.wl]=b,a.Y.jc().EC(e));break;case "cancelBehavior":"none"===b||"escape"===b?this.nM():"icon"===b&&(this.FJ?(this.nM(),this.dM(this.iv),this.Gs=this.iv.find(".oj-dialog-title"),this.Gs.length&&this.Gs.insertAfter(this.Gq)):(this.nM(),this.dM(this.Bt),this.uqa=this.Bt.find(".oj-dialog-title"),this.uqa.length&&this.uqa.insertAfter(this.Gq)))}},Sya:function(a){this.fha="ojDialogPlaceHolderFooter-"+
this.TW;this.tIa=g("\x3cdiv\x3e").hide().attr({id:this.fha});this.tIa.insertBefore(a)},Tya:function(a){this.gha="ojDialogPlaceHolderHeader-"+this.TW;this.uIa=g("\x3cdiv\x3e").hide().attr({id:this.gha});this.uIa.insertBefore(a)},getNodeBySubId:function(a){if(null==a)return this.element?this.element[0]:null;a=a.subId;switch(a){case "oj-dialog-header":case "oj-dialog-body":case "oj-dialog-footer":case "oj-dialog-content":case "oj-dialog-header-close-wrapper":case "oj-resizable-n":case "oj-resizable-e":case "oj-resizable-s":case "oj-resizable-w":case "oj-resizable-se":case "oj-resizable-sw":case "oj-resizable-ne":case "oj-resizable-nw":a=
"."+a;if(!this.widget().find(a))break;return this.widget().find(a)[0]}return null},getSubIdByNode:function(a){if(null!=a){a=g(a);if(a.hasClass("oj-dialog-header"))return{subId:"oj-dialog-header"};if(a.hasClass("oj-dialog-footer"))return{subId:"oj-dialog-footer"};if(a.hasClass("oj-dialog-content"))return{subId:"oj-dialog-content"};if(a.hasClass("oj-dialog-header-close-wrapper"))return{subId:"oj-dialog-header-close-wrapper"};if(a.hasClass("oj-resizable-n"))return{subId:"oj-resizable-n"};if(a.hasClass("oj-resizable-e"))return{subId:"oj-resizable-e"};
if(a.hasClass("oj-resizable-s"))return{subId:"oj-resizable-s"};if(a.hasClass("oj-resizable-w"))return{subId:"oj-resizable-w"};if(a.hasClass("oj-resizable-se"))return{subId:"oj-resizable-se"};if(a.hasClass("oj-resizable-sw"))return{subId:"oj-resizable-sw"};if(a.hasClass("oj-resizable-ne"))return{subId:"oj-resizable-ne"};if(a.hasClass("oj-resizable-nw"))return{subId:"oj-resizable-nw"}}return null},Ey:function(){this.element.remove()},sB:function(){if(!this.Do){var c=this.Do={};c[a.Y.ic.bA]=this.fu.bind(this);
c[a.Y.ic.cA]=this.Ey.bind(this);c[a.Y.ic.vr]=this.YG.bind(this);c[a.Y.ic.fK]=this.eF.bind(this);c[a.Y.ic.dK]=this.VE.bind(this);c[a.Y.ic.eK]=this.dF.bind(this);c[a.Y.ic.cK]=this.Fp.bind(this)}return this.Do},fu:function(){this.Sx=!0;this.close();delete this.Sx},rq:function(c){var b=this.Lo;b&&(b.destroy(),delete this.Lo);0>["open","close"].indexOf(c)||(this.Lo=new a.zl(this.element,c,"ojDialog",this.$h()))},Ju:function(a,b){var d=this.Lo;return d?d.w3(this,a,a,b):!1}});a.Components.gp({ojDialog:{resizeBehavior:a.Components.cf(function(){return(a.sc.Gd("oj-dialog-option-defaults")||
{}).resizeBehavior}),cancelBehavior:a.Components.cf(function(){return(a.sc.Gd("oj-dialog-option-defaults")||{}).cancelBehavior}),dragAffordance:a.Components.cf(function(){return(a.sc.Gd("oj-dialog-option-defaults")||{}).dragAffordance})}})})();a.U.ob("oj-dialog","baseComponent",{properties:{cancelBehavior:{type:"string"},dragAffordance:{type:"string"},initialVisibility:{type:"string"},modality:{type:"string"},position:{type:"Object"},resizeBehavior:{type:"string"},role:{type:"string"},title:{type:"string"},
widget:{}},methods:{close:{},destroy:{},isOpen:{},open:{},refresh:{},whenReady:{}},extension:{Ng:"div",mb:"ojDialog"}});a.U.register("oj-dialog",{metadata:a.U.getMetadata("oj-dialog")})});