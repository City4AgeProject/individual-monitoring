/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
/*
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
*/
define(["ojs/ojcore","jquery","hammerjs","ojs/ojjquery-hammer","promise","ojs/ojcomponentcore","ojs/ojpopupcore"],function(a,g,c){(function(){a.ab("oj.ojMenu",g.oj.baseComponent,{defaultElement:"\x3cul\x3e",delay:300,role:"menu",widgetEventPrefix:"oj",options:{menuSelector:"ul",openOptions:{display:"auto",initialFocus:"menu",launcher:null,position:{my:"start top",at:"start bottom",collision:"flipfit"}},submenuOpenOptions:{position:{my:"start top",at:"end top",collision:"flipfit"}},beforeOpen:null,
close:null,open:null,select:null},_ComponentCreate:function(){this._super();var a=this;this._focusForTesting=this.Fi;this._nextForTesting=this.Mga;this._selectForTesting=this.Fo;this.Ly=this.element;this.e4=!1;if(h&&"ul"!==this.element[0].tagName.toLowerCase())throw Error("Cancel item supported for \x3cul\x3e menus only.");this.ULa();this.element.uniqueId().addClass("oj-menu oj-component").hide().attr({role:this.role,tabIndex:"0","data-oj-context":""});this._on(!0,{"mousedown .oj-menu-item":function(a){this.options.disabled&&
a.preventDefault()},click:function(a){this.options.disabled&&a.preventDefault()},keydown:function(a){!this.options.disabled||a.keyCode!==g.ui.keyCode.ESCAPE&&a.keyCode!==g.ui.keyCode.TAB||(a.keyCode===g.ui.keyCode.TAB&&a.preventDefault(),this.Ie&&this.MF(a))}});this.options.disabled&&this.element.addClass("oj-disabled").attr("aria-disabled","true");var b=function(a){if(!this.B2){this.B2=!0;var b=g(a.currentTarget);try{this.Zba=!0,this.Fi(a,b)}finally{this.Zba=!1}}}.bind(this),c=function(a){a&&a.target&&
!g(a.target).is(":visible")||this.Pl(a,"eventSubtree")}.bind(this);this._on({"mousedown .oj-menu-item \x3e a":function(a){a.preventDefault()},"click .oj-disabled \x3e a":function(a){a.preventDefault()},click:function(){this.e4=!1},touchstart:function(){this.B2=!1},mouseover:function(){this.B2=!1},"click .oj-menu-item:has(a)":function(a){var b=g(a.target).closest(".oj-menu-item");!this.e4&&b.not(".oj-disabled").length&&(this.e4=!0,a.preventDefault(),this.nb&&this.nb.closest(b).length&&this.nb.get(0)!=
b.get(0)||(b.has(".oj-menu").length?this.pf(a):(this.Fo(a),this.element.is(":focus")||(this.element.trigger("focus",[!0]),this.nb&&1===this.nb.parents(".oj-menu").length&&clearTimeout(this.zf)))))},"mouseenter .oj-menu-item":b,"touchstart .oj-menu-item":b,mouseleave:c,"mouseleave .oj-menu":c,focus:function(a,b){if(!b){var c=this.nb||this.element.children(".oj-menu-item").eq(0);this.Fi(a,c)}},keydown:this.Lu,keyup:function(a){if(a.keyCode==g.ui.keyCode.ENTER||a.keyCode==g.ui.keyCode.SPACE)this.xL=
!1}});this._focusable({applyHighlight:!e,recentPointer:function(){return a.Zba},setupHandlers:function(b,c){a.jB=b;a.yx=c}});this.Gka=g.proxy(this.$H,this);this.hb()},JA:function(a){if(arguments.length)d=a;else return d},$V:function(a){if(("focus"===a.type||"mousedown"===a.type||"touchstart"===a.type||93==a.which||121==a.which&&a.shiftKey||93==a.keyCode)&&("mousedown"!==a.type||!d)){var c=b.slice(0,b.length);g.each(c,function(b,c){!g(a.target).closest(c.element).length&&("keydown"===a.type||"mousedown"===
a.type&&3===a.which||!g(a.target).closest(c.Ie).length||c.bHa&&("mousedown"===a.type&&3!==a.which||"touchstart"===a.type))&&(c.Pl(a,"eventSubtree"),c.Ie&&c.gx(a))})}},_setOption:function(a,b){this._superApply(arguments);switch(a){case "translations.labelCancel":case "translations":this.K$&&this.K$.text(this.options.translations.labelCancel)}},_destroy:function(){this.element.is(":visible")&&this.gx();clearTimeout(this.zf);delete this.zf;this.element.removeAttr("aria-activedescendant").removeClass("oj-component").find(".oj-menu").addBack().removeClass("oj-menu oj-menu-submenu oj-menu-icons oj-menu-text-only").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show();
this.element.find(".oj-menu-item").removeClass("oj-menu-item").removeAttr("role").children("a").removeAttr("aria-disabled").removeUniqueId().removeClass("oj-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var a=g(this);a.data("oj-ojMenu-submenu-icon")&&a.remove()});this.element.find("a").removeAttr("aria-expanded");this.element.find(".oj-menu-divider").removeClass("oj-menu-divider").removeAttr("role");0<=b.indexOf(this)&&b.splice(b.indexOf(this),
1);delete this.Do;delete this.Gka;var a=this.eu;isNaN(a)||(delete this.eu,window.clearTimeout(a));this.SL&&this.SL.remove();this.element.pi("destroy");this._super()},Lu:function(a){function b(a){return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$\x26")}var c,d,e,f,h=!0;switch(a.keyCode){case g.ui.keyCode.HOME:this.sO("first","first",a);break;case g.ui.keyCode.END:this.sO("last","last",a);break;case g.ui.keyCode.UP:this.HIa(a);break;case g.ui.keyCode.DOWN:this.Mga(a);break;case g.ui.keyCode.LEFT:case g.ui.keyCode.RIGHT:a.keyCode===
g.ui.keyCode.RIGHT^this.im?this.nb&&!this.nb.is(".oj-disabled")&&this.pf(a):this.Pl(a,"active");break;case g.ui.keyCode.ENTER:case g.ui.keyCode.SPACE:this.HDa(a);this.xL=!0;var k=this;setTimeout(function(){k.xL=!1},100);break;case g.ui.keyCode.TAB:a.preventDefault();this.Ie&&this.MF(a);break;case g.ui.keyCode.ESCAPE:this.Ie?(d=this.element.attr("aria-activedescendant"),e="#"+this.element.attr("id")+"\x3e*\x3ea",d&&!g("#"+d).is(e)?this.Pl(a,"active"):this.MF(a)):this.Pl(a,"active");break;default:h=
!1,c=this.IR||"",d=String.fromCharCode(a.keyCode),e=!1,clearTimeout(this.lPa),d===c?e=!0:d=c+d,f=new RegExp("^"+b(d),"i"),c=this.Ly.children(".oj-menu-item").filter(function(){return f.test(g(this).children("a").text())}),c=e&&-1!==c.index(this.nb.next())?this.nb.nextAll(".oj-menu-item"):c,c.length||(d=String.fromCharCode(a.keyCode),f=new RegExp("^"+b(d),"i"),c=this.Ly.children(".oj-menu-item").filter(function(){return f.test(g(this).children("a").text())})),c.length?(this.Fi(a,c),1<c.length?(this.IR=
d,this.lPa=this._delay(function(){delete this.IR},1E3)):delete this.IR):delete this.IR}h&&a.preventDefault()},HDa:function(a){this.nb&&!this.nb.is(".oj-disabled")&&(this.nb.children("a[aria-haspopup\x3d'true']").length?this.pf(a):this.Fo(a))},refresh:function(){this._super();this.hb();var a=this.element;if(a.is(":visible")){var b=a.data("oj-menu-position");b&&(b.of instanceof g.Event||b.of instanceof Window||g(b.of).is(":visible"))&&(a.position(b),a.find(".oj-menu").each(function(){var a=g(this);
a.is(":visible")&&(b=a.data("oj-menu-position"))&&a.position(b)}))}},hb:function(){this.im="rtl"===this.rd();var a=this,b=this.element.find(this.options.menuSelector),c=b.add(this.element),d=c.children();this.pFa=!!b.length;d.filter(".oj-menu-divider").has("a").removeClass("oj-menu-divider oj-menu-item").removeAttr("role");var e=d.filter(":not(.oj-menu-item):has(a)"),f=e.children("a");this.hfa(e);this.Xea(f);e=d.filter(function(a,b){var c=g(b);return c.is(":not(.oj-menu-item)")&&!/[^\-\u2014\u2013\s]/.test(c.text())});
this.dfa(e);this.IFa(d,e);d.filter(".oj-disabled").children("a").attr("aria-disabled","true");d.filter(":not(.oj-disabled)").children("a").removeAttr("aria-disabled");b.filter(":not(.oj-menu)").addClass("oj-menu oj-menu-submenu oj-menu-dropdown").hide().attr({role:this.role,"aria-hidden":"true"}).each(function(){var b=g(this),c=a.pY(b),d=g("\x3cspan\x3e");d.addClass("oj-menu-submenu-icon oj-component-icon").data("oj-ojMenu-submenu-icon",!0);c.attr("aria-haspopup","true").attr("aria-expanded","false").append(d);
c=c.attr("id");b.attr("aria-labelledby",c)});c.each(function(){var a=g(this),b=a.children().children().children(".oj-menu-item-icon:not(.oj-menu-cancel-icon)").length;a.toggleClass("oj-menu-icons",!!b).toggleClass("oj-menu-text-only",!b)});this.nb&&!g.contains(this.element[0],this.nb[0])&&this.sV()},hfa:function(a){a.addClass("oj-menu-item").attr("role","presentation")},Xea:function(a){a.uniqueId().attr({tabIndex:"-1",role:"menuitem"})},dfa:function(a){a.addClass("oj-menu-divider").attr("role","separator")},
IFa:function(a,b){a.removeClass("oj-menu-item-before-divider oj-menu-item-after-divider");b.prev().addClass("oj-menu-item-before-divider");b.next().addClass("oj-menu-item-after-divider")},pY:function(a){return a.prev("a")},CVa:function(){return"menuitem"},NM:function(a,b){var c=a.prev(".oj-menu-divider").add(a.next(".oj-menu-divider"));b&&(c=c.add(a));return c},Fi:function(a,b){a&&"focus"===a.type||clearTimeout(this.zf);b=b.first();this.uga(b,a);var c=b.parent(),d=c.closest(".oj-menu-item");c.find(".oj-focus-ancestor").removeClass("oj-focus-ancestor");
this.NM(d,!0).addClass("oj-focus-ancestor");a&&"keydown"===a.type?this.Sr():this.zf=this._delay(function(){delete this.zf;this.Sr()},this.delay);c=b.children(".oj-menu");c.length&&a&&/^mouse/.test(a.type)&&!this.nb.hasClass("oj-disabled")&&this.hMa(c);this.Ly=b.parent()},uga:function(a,b){if(!a.is(this.nb)){var c=this.nb?this.nb:g(),d=a.children("a");this.nb=a;this.element.attr("aria-activedescendant",d.attr("id"));this.yx(c);this.jB(a);this.NM(c).removeClass("oj-focus");this.NM(a).addClass("oj-focus");
this._trigger("_activeItem",b,{previousItem:c,item:a,privateNotice:"The _activeItem event is private.  Do not use."})}},uJa:function(a){if(this.nb){var b=this.nb;this.nb=null;this.element.removeAttr("aria-activedescendant");this.yx(b);this.NM(b).removeClass("oj-focus");this._trigger("_activeItem",a,{previousItem:b,item:g(),privateNotice:"The _activeItem event is private.  Do not use."})}},sV:function(a){clearTimeout(this.zf);this.uJa(a)},MF:function(a,b){this.Ie.focus();this.gx(a,b)},gx:function(b,
c){if(!this.Ju("close","__dismiss",[b,c])){var d=this.element.is(":visible");this.rq("close");var e={};e[a.Y.Oa.Te]=this.element;e[a.Y.Oa.Qz]={event:b,selectUi:c,isOpen:d};a.Y.jc().close(e)}},dF:function(b){var c=b[a.Y.Oa.Te];if((b=(a.sc.Gd("oj-menu-option-defaults")||{}).animation)&&b.close)return a.ga.Hn(c,"close",b.close).then(function(){c.hide()});c.hide()},Fp:function(c){var d=c[a.Y.Oa.Qz];c=d.event;var e=d.selectUi,d=d.isOpen;this.element.removeData("oj-menu-position");this.Ie=void 0;this.tja=
!1;e&&(c=this.k1("select",c,e).event);d&&this._trigger("close",c,{});this.lu=null;0<=b.indexOf(this)&&b.splice(b.indexOf(this),1)},getCurrentOpenOptions:function(){return g.extend(!0,{},this.lu||this.options.openOptions)},open:function(c,d,e){if(!this.Ju("open","open",[c,d,e])){d=g.extend({},this.options.openOptions,d);d.position=g.extend({},d.position);e=g.extend({},this.options.submenuOpenOptions,e);var f=this.lu;this.lu=d;a.Fa.YHa(c);this.bHa=this.wL;var h=this.k1("beforeOpen",c,{openOptions:d});
if(h.proceed)if(this.element.is(":visible")&&(this.lu=f,this.gx(h.event),this.lu=d),f=d.launcher,(f="string"===g.type(f)?g(f):f)&&f.length){h=this.tGa(d.display);this.GMa(h);var k,n;if(h){if(this.element.addClass("oj-menu-dropdown").removeClass("oj-menu-sheet"),n=l,k=a.Fa.cp(d.position,this.im),k.of=a.Fa.jSa(k.of,f,c),null==k.of){a.F.warn("position.of passed to Menu.open() is 'event', but the event is null.  Ignoring the call.");this.lu=null;return}}else this.element.addClass("oj-menu-sheet").removeClass("oj-menu-dropdown"),
n=m,k={my:"bottom",at:p,of:window,collision:"flipfit"};var r=this.element[0],t=b.slice(0,b.length);g.each(t,function(a,b){b.element[0]!==r&&(b.Pl(c,"eventSubtree"),b.Ie&&b.gx(c))});this.mMa=a.Fa.cp(e.position,this.im);e=this.Gka;g.isFunction(k.using)&&k.using!==e&&(k.origUsing=k.using);k.using=e;this.element.data("oj-menu-position",k);this.rq("open");e={};e[a.Y.Oa.Te]=this.element;e[a.Y.Oa.Zz]=f;e[a.Y.Oa.wr]=k;e[a.Y.Oa.qr]=this.sB();e[a.Y.Oa.Gt]="oj-menu-layer";e[a.Y.Oa.wl]=n;e[a.Y.Oa.Qz]={event:c,
initialFocus:d.initialFocus,launcher:f,isDropDown:h};a.Y.jc().open(e)}else a.F.warn("When calling Menu.open(), must specify openOptions.launcher via the component option, method param, or beforeOpen listener.  Ignoring the call."),this.lu=null;else this.lu=f}},eF:function(b){var c=b[a.Y.Oa.Te];b=b[a.Y.Oa.wr];c.show();c.position(b);if((b=(a.sc.Gd("oj-menu-option-defaults")||{}).animation)&&b.open)return a.ga.Hn(c,"open",b.open)},VE:function(c){var d=c[a.Y.Oa.Qz];c=d.event;var e=d.initialFocus,f=d.launcher,
d=d.isDropDown,g="firstItem"===e;(g||"menu"===e)&&this.element.focus();g?this.Fi(c,this.element.children().first()):this.sV(c);this.Ie=f;this.tja=!d;b.push(this);this._trigger("open",c,{})},hMa:function(a){clearTimeout(this.zf);"true"===a.attr("aria-hidden")&&(this.zf&&clearTimeout(this.zf),this.zf=this._delay(function(){delete this.zf;this.Sr();this.Xga(a)},this.delay))},Xga:function(a){var c=g.extend({of:this.nb},this.mMa);clearTimeout(this.zf);this.element.find(".oj-menu").not(a.parents(".oj-menu")).hide().attr("aria-hidden",
"true").removeData("oj-menu-position");a.show().removeAttr("aria-hidden").position(c).data("oj-menu-position",c);this.pY(a).attr("aria-expanded","true");!this.Ie&&0>b.indexOf(this)&&b.push(this)},vL:function(a,b,c){function d(){delete e.zf;var c=b?e.element:g(a&&a.target).closest(e.element.find(".oj-menu"));c.length||(c=e.element);e.Sr(c);e.sV(a);e.Ly=c}clearTimeout(this.zf);var e=this;c?this.zf=this._delay(d,c):d()},Sr:function(a){a||(a=this.nb?this.nb.parent():this.element);var c=a.find(".oj-menu");
c.hide().attr("aria-hidden","true").removeData("oj-menu-position");this.pY(c).attr("aria-expanded","false");a.find(".oj-focus-ancestor").removeClass("oj-focus-ancestor");this.Ie||0<=b.indexOf(this)&&a===this.element&&b.splice(b.indexOf(this),1)},Pl:function(b,c){if(null==c||"active"===c){var d=this.Ly&&this.Ly.closest(".oj-menu-item",this.element);d&&d.length&&(this.Sr(),this.Fi(b,d))}else"all"===c||"eventSubtree"===c?this.vL(b,"all"===c,this.delay):a.F.warn("Invalid param "+c+" passed to Menu._collapse().  Ignoring the call.")},
pf:function(a){var b=this.nb&&this.nb.children(".oj-menu ").children(".oj-menu-item").first();b&&b.length&&(this.Xga(b.parent()),this.zf&&clearTimeout(this.zf),this.zf=this._delay(function(){delete this.zf;this.Fi(a,b)}))},Mga:function(a){this.sO("next","first",a)},HIa:function(a){this.sO("prev","last",a)},yVa:function(){return this.nb&&!this.nb.prevAll(".oj-menu-item").length},zVa:function(){return this.nb&&!this.nb.nextAll(".oj-menu-item").length},sO:function(a,b,c){var d;this.nb&&(d="first"===
a||"last"===a?this.nb["first"===a?"prevAll":"nextAll"](".oj-menu-item").eq(-1):this.nb[a+"All"](".oj-menu-item").eq(0));d&&d.length&&this.nb||(d=this.Ly.children(".oj-menu-item")[b]());this.Fi(c,d)},Fo:function(b){if(!this.nb&&b&&b.target){var c=g(b.target).closest(".oj-menu-item");c.closest(this.element).length&&this.uga(c,b)}this.nb?this.nb.has(".oj-menu").length||this.nb.is(".oj-disabled")?a.F.warn("Selecting a disabled menu item or parent menu item is not allowed."):(c=this.nb.is(this.TL)?void 0:
{item:this.nb},this.vL(b,!0),this.Ie&&this.MF(b,c)):a.F.warn("Menu._select() called when no menu item is focused and no menu item can be inferred from event param.")},Ey:function(){this.element.remove()},sB:function(){if(!this.Do){var b=this.Do={};b[a.Y.ic.bA]=this.baa.bind(this);b[a.Y.ic.cA]=this.Ey.bind(this);b[a.Y.ic.vr]=this.refresh.bind(this);b[a.Y.ic.aA]=this.$V.bind(this);b[a.Y.ic.fK]=this.eF.bind(this);b[a.Y.ic.dK]=this.VE.bind(this);b[a.Y.ic.eK]=this.dF.bind(this);b[a.Y.ic.cK]=this.Fp.bind(this)}return this.Do},
baa:function(){this.Sr(this.element);this.gx(null)},$H:function(b,c){var d=c.element.element;d.css(b);(d=d.data("oj-menu-position"))&&(d=d.origUsing)&&d(b,c);a.Fa.p3(c)&&(this.eu=this._delay(g.proxy(this.baa,this),1))},getNodeBySubId:function(a){switch(a&&a.subId){case n:return this.LV?this.TL[0]:null;default:return this._super(a)}},getSubIdByNode:function(a){return this.TL&&this.TL.is(a)?n:this._super(a)},tGa:function(a){if(this.pFa)return!0;switch(a){case "dropDown":return!0;case "sheet":return!1;
case "auto":return r.matches;default:throw Error("Invalid value for Menu openOptions.display: "+a);}},GMa:function(a){h&&(a?this.LV&&(this.ica().detach().eq(0).prev().removeClass("oj-menu-item-before-divider"),this.LV=!1):(this.ica().appendTo(this.element).eq(0).prev().addClass("oj-menu-item-before-divider"),this.LV=!0))},ica:function(){if(!this.SL){var a=g("\x3cli\x3e\x3c/li\x3e",this.document[0]),b=g("\x3ca href\x3d'#'\x3e\x3c/a\x3e",this.document[0]).text(this.options.translations.labelCancel);
g("\x3cspan class\x3d'oj-menu-item-icon oj-component-icon oj-menu-cancel-icon'\x3e\x3c/span\x3e",this.document[0]).prependTo(b);var c=g("\x3cli\x3e\x3c/li\x3e",this.document[0]).addClass("oj-menu-item-cancel oj-menu-item-after-divider").append(b);this.dfa(a);this.Xea(b);this.hfa(c);this.K$=b;this.TL=c;this.SL=g([a[0],c[0]])}return this.SL},ULa:function(){k&&(this.element.pi(t),this._on({swipedown:function(a){this.tja&&"touch"===a.gesture.pointerType&&(this.vL(a,!0),this.MF(a))}}))},rq:function(b){var c=
this.Lo;c&&(c.destroy(),delete this.Lo);0>["open","close"].indexOf(b)||(this.Lo=new a.zl(this.element,b,"ojMenu",this.$h()))},Ju:function(a,b,c){var d=this.Lo;return d?d.w3(this,a,b,c):!1}});var b=[],d=!1,e=-1<navigator.userAgent.indexOf("Macintosh")&&-1<navigator.userAgent.indexOf("Safari")&&-1===navigator.userAgent.indexOf("Chrome"),f=a.sc.Gd("oj-menu-config")||{},h="menuItem"===f.sheetCancelAffordance,k="dismiss"===f.sheetSwipeDownBehavior,l=f.dropDownModality||"modeless",m=f.sheetModality||"modal",
p="bottom-"+(f.sheetMarginBottom||0),t=k&&{recognizers:[[c.Swipe,{direction:c.DIRECTION_DOWN}]]},r=function(){var a=f.dropDownThresholdWidth;null==a&&(a="768px");return window.matchMedia("(min-width: "+a+")")}(),n="oj-menu-cancel-command"})();a.U.ob("oj-menu","baseComponent",{properties:{disabled:{type:"boolean"},menuSelector:{type:"string"},openOptions:{type:"Object"},submenuOpenOptions:{type:"Object"}},methods:{destroy:{},getCurrentOpenOptions:{},getSubIdByNode:{},open:{},refresh:{},widget:{}},
extension:{Ng:"ul",mb:"ojMenu"}});a.U.register("oj-menu",{metadata:a.U.getMetadata("oj-menu")})});