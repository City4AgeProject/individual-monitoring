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
define(["ojs/ojcore","jquery","ojs/ojeditablevalue","jqueryui-amd/widgets/draggable","ojs/ojtouchproxy"],function(a,g){(function(){a.ab("oj.ojSlider",g.oj.editableValue,{defaultElement:"\x3cinput\x3e",version:"1.0.1",widgetEventPrefix:"oj",options:{distance:0,max:100,min:0,orientation:"horizontal",readOnly:!1,disabled:!1,step:1,type:"fromMin",value:0,rawValue:void 0},Rga:5,$Ua:null,Hja:null,Zg:function(){return"rtl"===a.Q.Oj()},_ComponentCreate:function(){this._super();this.nfa=!1;this.element.is("INPUT")?
(this.nfa=!0,this.element[0].style&&(this.lMa=this.element[0].style.cssText),this.lfa=this.element.css("display"),this.element.css("display","none"),this.Ug=this.Xd?g(this.Xd):g(this.element).wrap("\x3cdiv\x3e \x3c/div\x3e").parent()):this.Ug=this.element;this.iaa()},iaa:function(){this.Lga=[];this.Fj=null;var a="oj-slider ",a=this.He()?a+"oj-slider-vertical":a+"oj-slider-horizontal",a=a+" oj-component oj-form-control";this.options.LR&&(a+=" oj-read-only");this.options.disabled&&(a+=" oj-disabled");
this.Ug.removeClass();this.Ug.addClass(a);this.zh="range"===this.options.type?!0:!1;this.C$();this.$ya();this.vya();this.ixa();this.Wya();this.dza();this.yC();this.Ho()},Mg:function(){this._super();this.OB();var a,b=this.uta();if(b){a=this.Ug.find(".oj-slider-thumb");var d=b.attr("id");d||(d=b.attr("for"));a.attr("aria-labelledby",d);1<b.length&&1<a.length&&a[1].attr("aria-labelledby",String(d))}else if(b=this.Xd?this.Ug.attr("aria-label"):this.element.attr("aria-label"))a=this.Ug.find(".oj-slider-thumb"),
a.attr("aria-label",b)},uta:function(){var a=this.YAa();if(null!==a&&0!==a.length)return a;a=this.XAa();return null!==a&&0!==a.length?a:null},XAa:function(){var a;a=this.Xd?this.Ug.prop("id"):this.element.prop("id");if(void 0!==a){var b=g("label[for\x3d'"+a+"']");if(0<b.length)return b;a="span[for\x3d'"+a+"']";if(0!==g(a).length)return g(a)}return null},YAa:function(){var a;a=this.Xd?this.Ug.attr("aria-labelledby"):this.element.attr("aria-labelledby");if(void 0!==a){var b=g("label[id\x3d'"+a+"']");
if(0<b.length)return b;a=g("span[id\x3d'"+a+"']");if(0<a.length)return a}return null},widget:function(){return this.Ug},rk:function(a){this.Hja=a},Zh:function(){return this.Hja},XM:function(){if(this.Xd)return this.Ug[0].id||this.Ug.uniqueId(),this.Ug[0].id;this.element[0].id||this.element.uniqueId();return this.element[0].id},tY:function(a){return this.XM()+"-thumb"+a},fca:function(){return this.XM()+"-barValue"},ZAa:function(){return this.XM()+"-barBack"},MCa:function(){return this.XM()+"-sliderWrapper"},
dza:function(){var a,b,d="",e="class\x3d'oj-slider-thumb ui-state-default' tabindex\x3d'0' role\x3d'slider'"+("aria-valuemin \x3d '"+this.Od()+"' ")+("aria-valuemax \x3d '"+this.vf()+"' ")+"\x3e\x3c/span\x3e",f=[];b=this.zh?2:1;for(a=0;a<b;a++)d="\x3cspan "+("id\x3d'"+this.tY(a)+"' ")+e,f.push(d);this.Gj=g(f.join("")).appendTo(this.uq);this.Ko=this.Gj.eq(0);var h=this;a=0;this.Gj.each(function(){g(this).data("oj-slider-thumb-index",a++);h.He()&&g(this).attr("aria-orientation","vertical");h.options.disabled?
(g(this).attr("aria-disabled","true"),g(this).removeAttr("tabindex")):g(this).removeAttr("aria-disabled");h.options.readOnly?g(this).attr("title","read only"):g(this).removeAttr("title")})},$ya:function(){var a=this.MCa(),b=this.Ug.find("#"+a);b.length&&b.remove();this.uq=g("\x3cdiv\x3e\x3c/div\x3e");g(this.uq).attr("id",a);this.uq.addClass("oj-slider-container");this.element.after(this.uq);this.uq[0].style.cssText=this.lMa},vya:function(){var a=this.ZAa(),b=this.Ug.find("#"+a);b.length&&b.remove();
this.mf=g("\x3cdiv\x3e\x3c/div\x3e");g(this.mf).attr("id",a);this.mf.addClass("oj-slider-bar");this.uq.append(this.mf);var d=this;this.mf.on("mousedown"+d.eventNamespace,function(a){d.fia(a);d.NG(a);d.OF().focus()})},ixa:function(){this.options.type&&(null==this.options.value?(this.options.value=this.zh?[this.Od(),this.vf()]:this.Od(),this.option("value",this.options.value,{_context:{xd:!0,kb:!0}})):this.zh&&2!==this.options.value.length&&(this.options.value=[0<this.options.value.length?this.options.value[0]:
this.Od(),this.vf()],this.option("value",this.options.value,{_context:{xd:!0,kb:!0}})))},Wya:function(){var a=this.options,b="";if(a.type){this.Xc=g("\x3cdiv\x3e\x3c/div\x3e");g(this.Xc).attr("id",this.fca());this.uq.append(this.Xc);var b="oj-slider-range oj-slider-bar-value",d=this;this.Xc.on("mousedown"+d.eventNamespace,function(a){d.fia(a);d.NG(a);d.OF().focus()});this.Xc=this.uq.find("#"+this.fca());var e="";"fromMin"===a.type?e=" oj-slider-range-min":"fromMax"===a.type&&(e=" oj-slider-range-max");
this.Xc.addClass(b+e)}else this.Xc&&this.Xc.remove(),this.Xc=null},A0:function(c){this.VH=a.sg.M1(c)},Q0:function(c){a.sg.t4(c)},Ho:function(){this.sp()&&this.Uf(this.Ug);this.Gj.toArray().forEach(function(a){a=g(a);this.dx(a);this._on(a,this.zMa);this.A0(a);this._focusable({element:a,applyHighlight:!0})},this)},_GetMessagingLauncherElement:function(){return this.Ug},Xf:function(){return this.OF()},gba:function(){this.Gj.toArray().forEach(function(a){a=g(a);this.Q0(a)},this);this.Xc&&this.Xc.remove();
this.uq&&this.uq.remove();this.Xd?(this.Ug.removeUniqueId(),this.Yw(this.Ug)):(this.element.removeUniqueId(),this.Yw(this.element))},YMa:function(){a.Q.unwrap(this.element,this.Ug);this.element.css("display",this.lfa);this.EA(this.element)},_destroy:function(){this.gba();this.YMa();return this._super()},fia:function(a){var b,d,e=this.options,f=0,h=this;this.eaa=this.Ko;if(e.disabled||e.readOnly)return!1;b=this.lCa({x:a.pageX,y:a.pageY});d=this.vf()-this.Od()+1;this.zh&&this.Gj.each(function(a){var c=
Math.abs(b-h.hs(a));if(d>c||d===c&&(a===h.$Ga||h.hs(a)===e.min))d=c,this.eaa=g(this),f=a});this.Fj=f;if(!this.eaa)return!0;this.Gj.hasClass("ui-state-hover")||this.tq(a,f,b);this.OF().addClass("oj-active").focus();this.Xc.addClass("oj-active");return!0},KFa:function(a,b){var d=this.options;if(d.disabled||d.readOnly)return!1;b.removeClass("oj-focus-highlight");b.addClass("oj-active").focus();this.Xc.addClass("oj-active");return!0},HHa:function(a,b){var d=this.kda(b);this.tq(a,this.Fj,d,!0);d=100*this.Dca(b);
this.zh?this.ija(d,this.Fj):this.fja(d);return!1},NG:function(a,b){this.Gj.removeClass("oj-active");this.Xc.removeClass("oj-active");var d=this.kda(b);this.tq(a,this.Fj,d);this.Nl(a,this.Fj,!1);this.Fj=null;return!1},He:function(){return"vertical"===this.options.orientation},lda:function(a){1<a&&(a=1);0>a&&(a=0);this.He()&&(a=1-a);return a},lCa:function(a){var b=this.IBa(a);a=this.vf()-this.Od();this.Zg()&&!this.He()&&(b=1-b);return this.$l(this.Od()+b*a)},IBa:function(a){var b;this.He()?(b=this.mf.height(),
a=a.y-this.mf.offset().top):(b=this.mf.width(),a=a.x-this.mf.offset().left);return 0===b?1:b=this.lda(a/b)},OF:function(){return this.zh?g(this.Gj[this.Fj]):this.Ko},Dca:function(a){var b;(b=a)||(b=this.OF());this.He()?(a=b.outerHeight()/2,a=b.offset().top+a,b=this.mf.height(),a-=this.mf.offset().top):(a=b.outerWidth()/2,a=b.offset().left+a,b=this.mf.width(),a-=this.mf.offset().left);return 0===b?1:b=this.lda(a/b)},kda:function(a){var b;a=this.Dca(a);b=this.vf()-this.Od();this.Zg()&&!this.He()&&(a=
1-a);return this.$l(this.Od()+a*b)},nCa:function(a){return this.hs(a?0:1)},hCa:function(a,b,d){return 2===this.options.value.length&&(0===a&&b>d||1===a&&b<d)?d:b},tq:function(a,b,d,e){var f;this.zh?(f=this.nCa(b),d=this.hCa(b,d,f),d!==this.hs(b)&&this.uLa(a,b,d,e)):d!==this.tN()&&(this.HLa(a,d,e),e||this.nfa&&this.element.val(d))},HLa:function(a,b,d){this.wO=this.$l(b);this.Ml(this.wO,a);d||(this.bc(this.wO,a),this.yC())},Nl:function(a,b,d){this.zh?(this.jga=this.iCa(b,this.Lga[b]),this.Ml(this.jga,
a),d||this.bc(this.jga,a)):(this.Ml(this.wO,a),d||this.bc(this.wO,a));this.$Ga=b},iCa:function(a,b){var d,e;d=this.options.value.slice();for(e=0;e<d.length;e+=1)d[e]=this.$l(d[e]);a===this.Fj&&(d[a]=b);return d},tN:function(){return this.Uda()},hs:function(a){return this.XCa(a)},uLa:function(a,b,d,e){this.Lga[b]=this.$l(d);this.Nl(a,b,e);e||this.yC()},_setOption:function(a,b,d){var e;if("value"===a)if(Array.isArray(b))if(isNaN(b[0]))this.zh=!1,e=this.lq(a,b[0]),this.Qr(e,this.Od(),this.vf());else{this.zh=
!0;e=b;for(var f=0;f<e.length;f+=1)this.Qr(e[f],this.Od(),this.vf())}else this.zh=!1,e=this.lq(a,b),this.Qr(e,this.Od(),this.vf());if("max"===a||"min"===a)if(e=this.lq(a,b),"min"===a)if(this.QV(e,this.vf()),this.zh)for(f=0;f<e.length;f+=1)this.Qr(this.hs(f),e,this.vf());else this.Qr(this.tN(),e,this.vf());else{if("max"===a)if(this.QV(this.Od(),e),this.zh)for(f=0;f<e.length;f+=1)this.Qr(this.hs(f),this.Od(),e);else this.Qr(this.tN(),this.Od(),e)}else e="step"===a?this.WG(b):b;"disabled"!==a&&this._super(a,
e,d);"readOnly"===a&&(this.options.LR=e);"disabled"===a&&(this.options.disabled=e);switch(a){case "value":this.yC();this.OB();break;case "min":case "max":this.C$();this.yC();this.OB();break;case "orientation":case "readonly":case "step":case "type":case "disabled":this.YIa()}},YIa:function(){this.gba();this.iaa();this.Mg()},Uda:function(){var a=this.options.value;return a=this.$l(a)},XCa:function(a){return this.$l(this.options.value[a])},$l:function(a){if(a<=this.Od())return this.Od();if(a>=this.vf())return this.vf();
var b=0<this.options.step?this.options.step:1,d=(a-this.Od())%b;a-=d;2*Math.abs(d)>=b&&(a+=0<d?b:-b);return parseFloat(a.toFixed(5))},C$:function(){var a=this.Od();this.max=0!==(this.options.max-a)/this.options.step%1?this.options.max-(this.options.max-a)%this.options.step:this.options.max},Od:function(){return this.options.min},vf:function(){return this.max},Eca:function(){var a;a=0<this.options.step?(this.vf()-this.Od())/this.options.step:100;a=(this.He()?this.mf.height():this.mf.width())/a;1>a&&
(a=1);return this.He()?[1,a]:[a,1]},uY:function(a){return(this.hs(a)-this.Od())/(this.vf()-this.Od())},yC:function(){var a,b,d,e;this.zh?this.Gj.toArray().forEach(function(b,h){var k=g(b);a=100*this.uY(h);this.Zg()&&!this.He()&&(a=100-a);this.He()?k.css({top:100-a+"%"}):k.css({left:a+"%"});k.hasClass("oj-active")||(k.attr("aria-valuenow",this.hs(h)),k.attr("aria-valuemin",d),k.attr("aria-valuemax",e));this.ija(a,h)},this):(b=this.Uda(),d=this.Od(),e=this.vf(),a=e!==d?(b-d)/(e-d)*100:0,this.Zg()&&
!this.He()&&(a=100-a),this.He()?this.Ko.css({top:100-a+"%"}):this.Ko.css({left:a+"%"}),g(this.Ko).hasClass("oj-active")||(g(this.Ko).attr("aria-valuenow",b),g(this.Ko).attr("aria-valuemin",d),g(this.Ko).attr("aria-valuemax",e)),this.fja(a))},fja:function(a){var b=this.options.type;this.He()?("fromMin"===b&&this.Xc.css({height:a+"%"}),"fromMax"===b&&this.Xc.css({height:100-a+"%"})):this.Zg()?("fromMin"===b&&this.Xc.css({width:100-a+"%"}),"fromMax"===b&&this.Xc.css({width:a+"%"})):("fromMin"===b&&this.Xc.css({width:a+
"%"}),"fromMax"===b&&this.Xc.css({width:100-a+"%"}))},ija:function(a,b){var d=this.Xc.attr("id");if(0===b)switch(d=100*this.uY(1),this.options.type){case "fromMin":this.He()?this.Xc.css({height:a+"%"}):this.Xc.css({width:a+"%"});break;case "range":this.He()?(this.Xc.css({top:100-d+"%"}),this.Xc.css({height:d-a+"%"})):this.Zg()?(this.Xc.css({left:100-d+"%"}),this.Xc.css({width:d-(100-a)+"%"})):(this.Xc.css({left:a+"%"}),this.Xc.css({width:d-a+"%"}))}else{var e=100*this.uY(0);switch(this.options.type){case "fromMax":this.He()?
this.Xc.css({height:100-a+"%"}):this.Xc.css({width:100-a+"%"});break;case "range":this.He()?document.getElementById(d)&&(this.Xc.css({top:100-a+"%"}),this.Xc.css({height:a-e+"%"})):this.Zg()?document.getElementById(d)&&(this.Xc.css({left:a+"%"}),this.Xc.css({width:-a+100-e+"%"})):document.getElementById(d)&&this.Xc.css({width:a-parseInt(document.getElementById(d).style.left,10)+"%"})}}},zMa:{keydown:function(a){var b,d,e,f=g(a.target).data("oj-slider-thumb-index");this.Fj=f;switch(a.keyCode){case g.ui.keyCode.HOME:case g.ui.keyCode.END:case g.ui.keyCode.PAGE_UP:case g.ui.keyCode.PAGE_DOWN:case g.ui.keyCode.UP:case g.ui.keyCode.RIGHT:case g.ui.keyCode.DOWN:case g.ui.keyCode.LEFT:a.preventDefault(),
g(a.target).addClass("oj-active")}e=this.options.step;b=this.zh?d=this.hs(f):d=this.tN();switch(a.keyCode){case g.ui.keyCode.HOME:d=this.Od();break;case g.ui.keyCode.END:d=this.vf();break;case g.ui.keyCode.PAGE_UP:d=this.$l(b+(this.vf()-this.Od())/this.Rga);break;case g.ui.keyCode.PAGE_DOWN:d=this.$l(b-(this.vf()-this.Od())/this.Rga);break;case g.ui.keyCode.UP:if(b===this.vf())return;d=this.$l(b+e);break;case g.ui.keyCode.RIGHT:if(!this.Zg()||this.He()){if(b===this.vf())return;b+=e}else{if(b===this.Od())return;
b-=e}d=this.$l(b);break;case g.ui.keyCode.DOWN:if(b===this.Od())return;d=this.$l(b-e);break;case g.ui.keyCode.LEFT:if(!this.Zg()||this.He()){if(b===this.Od())return;b-=e}else{if(b===this.vf())return;b+=e}d=this.$l(b)}this.tq(a,f,d)},keyup:function(a){switch(a.keyCode){case g.ui.keyCode.HOME:case g.ui.keyCode.END:case g.ui.keyCode.PAGE_UP:case g.ui.keyCode.PAGE_DOWN:case g.ui.keyCode.UP:case g.ui.keyCode.RIGHT:case g.ui.keyCode.DOWN:case g.ui.keyCode.LEFT:var b=g(a.target).data("oj-slider-thumb-index");
this.Fj=b;this.Nl(a,b,!1);g(a.target).removeClass("oj-active");this.yC(!0);this.Fj=null}}},Og:function(c,b){var d=this.options,e=this;this._superApply(arguments);a.oa.Sq([{ra:"disabled",Qe:!0},{ra:"value"},{ra:"title"},{ra:"min"},{ra:"max"},{ra:"step"}],b,this,function(a){for(var b=["value","step","min","max"],c=0;c<b.length;c++){var f=b[c],g=f in a?a[f]:d[f];null!=g&&("step"===f?a[f]=e.WG(g):"min"===f||"max"===f?a[f]=e.lq(f,g):"value"===f&&(Array.isArray(g)?a[f]=g:a[f]=e.lq(f,g)))}});if(void 0===
d.value)throw Error(this.R("noValue"));this.QV(d.min,d.max);if(Array.isArray(d.value))for(var f=0;f<d.value.length;f+=1)this.Qr(d.value[f],d.min,d.max);else this.Qr(d.value,d.min,d.max)},Qr:function(a,b,d){if(null!=b&&a<b)throw Error(this.R("valueRange"));if(null!=d&&a>d)throw Error(this.R("valueRange"));},QV:function(a,b){if(null!=a&&null!=b&&a>b)throw Error(this.R("maxMin"));},getNodeBySubId:function(a){if(null==a)return this.element?this.element[0]:null;a=a.subId;return"oj-slider-thumb-0"===a?
this.widget().find(".oj-slider-thumb")[0]:"oj-slider-thumb-1"===a?this.widget().find(".oj-slider-thumb")[1]:"oj-slider-bar"===a||"oj-slider-bar-value"===a?this.widget().find("."+a)[0]:null},getSubIdByNode:function(a){if(null!=a){if(a.id===this.tY(0)&&g(a).hasClass("oj-slider-thumb"))return{subId:"oj-slider-thumb-0"};if(a.id===this.tY(1)&&g(a).hasClass("oj-slider-thumb"))return{subId:"oj-slider-thumb-1"};if(g(a).hasClass("oj-slider-bar"))return{subId:"oj-slider-bar"};if(g(a).hasClass("oj-slider-bar-value"))return{subId:"oj-slider-bar-value"}}return null},
_GetDefaultStyleClass:function(){return"oj-slider"},lq:function(a,b){var d;d=null!==b?+b:b;if(isNaN(d))throw Error(this.R("optionNum",{option:a}));return d},WG:function(a){if(null===a)return 1;a=this.lq("step",a);if(0>=a)throw Error(this.R("invalidStep"));if(null===a||0>=a)a=1;return a},gVa:function(){return this.mf.offset().left+this.mf.width()},pVa:function(){return this.mf.offset().left},D$:function(a){var b=this.Eca(),d=a[0].style,e=this;a.draggable({axis:this.He()?"y":"x",grid:b,disabled:!1,
start:function(b){a[0]===g(e.Gj)[0]?e.Fj=0:a[0]===g(e.Gj)[1]&&(e.Fj=1);e.KFa(b,a)},drag:function(b,h){var k=h.position;e.He()?(d.left="",k.left=""):(d.top="",k.top="");e.HHa(b,a);e.He()?(0>k.top&&(k.top=0),k.top>e.mf.height()&&(k.top=e.mf.height())):(0>k.left&&(k.left=0),k.left>e.mf.width()&&(k.left=e.mf.width()));if(e.zh){var l;l=0===e.Fj?g(e.Gj[1]):g(e.Gj[0]);if(e.He()){var m=a.outerHeight()/2,p=e.mf.offsetParent().offset().top;l=l.offset().top+m-p}else m=a.outerWidth()/2,p=e.mf.offsetParent().offset().left,
l=l.offset().left+m-p;0===e.Fj?e.He()?k.top<l&&(k.top=l):e.Zg()?k.left<l&&(k.left=l):k.left>l&&(k.left=l):e.He()?k.top>l&&(k.top=l):e.Zg()?k.left>l&&(k.left=l):k.left<l&&(k.left=l)}},stop:function(b){this.style.width="";this.style.height="";e.NG(b,a)}})},OB:function(){this.options.disabled||(this.zh?this.Gj.toArray().forEach(function(a){a=g(a);this.D$(a)},this):this.D$(this.Ko))},aVa:function(){this.zh?this.Gj.toArray().forEach(function(a){a=g(a);a.is(".ui-draggable")&&a.draggable("disable")},this):
this.Ko.is(".ui-draggable")&&this.Ko.draggable("disable")}})})();(function(){var c=/^\[.*\]/;a.U.ob("oj-slider","editableValue",{properties:{distance:{type:"number"},max:{type:"number"},min:{type:"number"},orientation:{type:"string"},rawValue:{type:"number|Array\x3cNumber\x3e",readOnly:!0,writeback:!0},step:{type:"number"},type:{type:"string"},value:{type:"number|Array\x3cNumber\x3e",writeback:!0}},methods:{},extension:{Ng:"input",mb:"ojSlider"}});a.U.register("oj-slider",{metadata:a.U.getMetadata("oj-slider"),
parseFunction:function(a,d,e,f){return"rawValue"!==d&&"value"!==d||!c.test(a)?f(a):JSON.parse(a)}})})()});