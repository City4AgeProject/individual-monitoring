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
define(["ojs/ojcore","jquery","promise","ojs/ojcomponentcore","ojs/ojanimation"],function(a,g){(function(){var c=0;a.ab("oj.ojCollapsible",g.oj.baseComponent,{widgetEventPrefix:"oj",options:{expanded:!1,disabled:null,expandOn:"click",expandArea:"header",beforeExpand:null,expand:null,beforeCollapse:null,collapse:null},_ComponentCreate:function(){this._super();this.element.addClass("oj-collapsible oj-component");this.pha();this.ah();this.Li=!0;this.VW(this.mW(this.element[0],this.options.expanded?"ojexpand":
"ojcollapse"));this.Li=void 0},mW:function(a,c){return{type:c,target:a,currentTarget:a,preventDefault:g.noop}},bi:function(a,c,e){this.di(c,e,{launcher:this.PF().first()})},Fya:function(){var a=this.options.expanded?"oj-collapsible-open-icon":"oj-collapsible-close-icon";(this.Tm()?g("\x3cspan\x3e"):g("\x3ca href\x3d'#'\x3e")).addClass("oj-component-icon oj-clickable-icon-nocontext oj-collapsible-header-icon "+a).attr("aria-labelledby",this.header.attr("id")).prependTo(this.header)},cba:function(){this.header.children(".oj-collapsible-header-icon").remove()},
_destroy:function(){this.Kp();this.element.removeClass("oj-collapsible oj-component oj-expanded oj-collapsed oj-disabled");this.Tm()&&this.bX(this.header).removeAttr("tabIndex");this.header.removeClass("oj-collapsible-header").each(function(){/^oj-collapsible/.test(this.id)&&this.removeAttribute("id")});this.JF().removeAttr("role").removeAttr("aria-controls").removeAttr("aria-expanded").removeAttr("aria-disabled");this.cba();this.content.css("display","").removeAttr("aria-hidden").removeAttr("tabIndex").removeClass("oj-component-content oj-collapsible-content").each(function(){/^oj-collapsible/.test(this.id)&&
this.removeAttribute("id")})},Kp:function(){this.qC();this.content&&(a.Q.unwrap(this.content),this.mr=null)},Tm:function(){return this.element.hasClass("oj-disabled")},Aca:function(){return"header"==this.options.expandArea?"\x3e .oj-collapsible-header":"\x3e .oj-collapsible-header \x3e .oj-collapsible-header-icon"},PF:function(){return this.header.find(".oj-collapsible-header-icon")},_setOption:function(a,c,e){"expanded"===a?c!==this.options.expanded&&(c?this.expand(!0):this.collapse(!0)):"disabled"===
a?(this.header.add(this.header.next()),this.element.toggleClass("oj-disabled",!!c)):"expandOn"===a||"expandArea"===a?(this.qC(),this._super(a,c,e),this.Ho()):this._super(a,c,e)},Lu:function(a){if(!a.altKey&&!a.ctrlKey){var c=g.ui.keyCode;switch(a.keyCode){case c.SPACE:case c.ENTER:this.hka(a)}}},refresh:function(){this._super();this.Kp();this.pha();this.cba();this.ah()},pha:function(){this.header=this.element.children(":first-child").addClass("oj-collapsible-header");this.content=this.header.next().addClass("oj-collapsible-content oj-component-content");
this.content.wrap("\x3cdiv\x3e\x3c/div\x3e");this.mr=this.content.parent().addClass("oj-collapsible-wrapper");this.options.disabled&&this.element.addClass("oj-disabled");this.Tm()&&this.bX(this.header).attr("tabIndex",-1)},ah:function(){var a=this.header,d=this.content,e=this.options,f="oj-collapsible-"+(this.element.attr("id")||++c),g=a.attr("id"),k=d.attr("id");g||a.attr("id",f+"-header");k||(k=f+"-content",d.attr("id",k));this.Fya();a=this.JF();a.attr("role","button").attr("aria-controls",k).attr("aria-expanded",
e.expanded);this.Tm()&&a.attr("aria-disabled","true");e.expanded?d.removeAttr("aria-hidden"):(this.mr.css({"max-height":0,"overflow-y":"hidden",display:"none"}),d.attr("aria-hidden","true"));this.Ho()},Ho:function(){var b={keydown:this.Lu},c=this.options.expandOn;if(c){var e=this;g.each(c.split(" "),function(c,d){a.Q.SQ(d)&&(b[d]=e.hka)})}c=this.element.find(this.Aca());this._on(c,b);this._on(this.mr,{transitionend:this.fv,webkitTransitionEnd:this.fv,otransitionend:this.fv,oTransitionEnd:this.fv});
this.Tm()||(this._on(this.element,{ojfocus:this.Yba,ojfocusout:this.Yba}),this._focusable({element:this.PF(),applyHighlight:!0}),this.Uf(c),this.nk(c))},qC:function(){var a=this.element.find(this.Aca());this.Yw(a);this.FE(a);this._off(a);this.mr&&this._off(this.mr);this._off(this.element.add(this.content))},hka:function(a){this.Tm()||a.isDefaultPrevented()||(this.options.expanded?this.collapse(!0,a):this.expand(!0,a),a.preventDefault(),a.stopPropagation(),this.PF().focus())},QL:function(a){var c=
a.css("transitionProperty"),e=a.css("transitionDelay");a=a.css("transitionDuration");e=e.split(",");a=a.split(",");for(var c=c.split(",").length,f=e.length,g=a.length,k=0,l=0;l<c;l++){var m=a[l%g],m=-1<m.indexOf("ms")?parseFloat(m):1E3*parseFloat(m);if(0<m)var p=e[l%f],p=-1<p.indexOf("ms")?parseFloat(p):1E3*parseFloat(p),k=Math.max(k,p+m)}return k+100},sia:function(a){var c=this;this.j1=setTimeout(function(){c.fv()},c.QL(a))},VW:function(b){if(!(this.Tm()||b.target!==this.element[0]||!this.Li&&b.isDefaultPrevented&&
b.isDefaultPrevented())){var c=this.element,e=this.content,f=this.mr,g="ojexpand"===b.type,k=this;b.preventDefault();this.Li||this.wxa(g);this.Li||document.hidden||this.element.hasClass("oj-collapsible-skip-animation")?(g||(f.css("max-height",0),f.hide()),k.P9(g,b)):(f.iI=f.outerHeight(),this.fo||(this.fo=a.Context.getContext(c[0]).Mj().Jj({description:"The collapsible id\x3d'"+this.element.attr("id")+"' is animating."})),this.pka=!1,g?(f.show(),setTimeout(function(){f.iI+=e.outerHeight();f.addClass("oj-collapsible-transition").css({"max-height":f.iI});
k.sia(f)},0)):(f.removeClass("oj-collapsible-transition"),f.css({"max-height":f.iI,"overflow-y":"hidden"}),0==f.iI?k.fv():setTimeout(function(){f.addClass("oj-collapsible-transition").css({"max-height":0});k.sia(f)},20)))}},Yba:function(a){if(this.Tm())return null;"ojfocusout"==a.type?(this.JF().attr("tabIndex",-1),a.preventDefault(),a.stopPropagation()):"ojfocus"==a.type&&(this.JF().attr("tabIndex",0).focus(),a.preventDefault(),a.stopPropagation())},JF:function(){return this.bX(this.header).first()},
bX:function(a){return this.Tm()?a.find("span"):a.find("a,:input")},expand:function(a,c){if(!this.Tm()){var e={header:this.header,content:this.content};a&&!1===this._trigger("beforeExpand",c,e)||this.VW(this.mW(this.element[0],"ojexpand"))}},collapse:function(a,c){if(!this.Tm()){var e={header:this.header,content:this.content};a&&!1===this._trigger("beforeCollapse",c,e)||this.VW(this.mW(this.element[0],"ojcollapse"))}},fv:function(a){this.j1&&(clearTimeout(this.j1),this.j1=void 0);this.pka||this.Tm()||
("max-height"==(a&&a.originalEvent?a.originalEvent.propertyName:null)&&(a.preventDefault(),a.stopPropagation(),this.pka=!0),this.options.expanded?this.mr.css({"max-height":9999,"overflow-y":""}):this.mr.hide(),this.mr.removeClass("oj-collapsible-transition"),this.P9(this.options.expanded,a))},P9:function(b,c){var e=this.element,f=this.mr;b?(e.removeClass("oj-collapsed"),e.addClass("oj-expanded"),a.Components.xt(f[0])):(e.removeClass("oj-expanded"),e.addClass("oj-collapsed"),a.Components.ew(f[0]));
this.PF().toggleClass("oj-collapsible-open-icon",b).toggleClass("oj-collapsible-close-icon",!b||!1).end();b?this.content.removeAttr("aria-hidden"):this.content.attr("aria-hidden","true");this.JF().attr("aria-expanded",b);this.fo&&(this.fo(),this.fo=null);e={header:this.header,content:this.content};this.Li||(b?this._trigger("expand",c,e):this._trigger("collapse",c,e))},wxa:function(a){this.option("expanded",a,{_context:{xd:!0,kb:!0}})},getNodeBySubId:function(a){if(null==a)return this.element?this.element[0]:
null;switch(a.subId){case "oj-collapsible-content":return this.content[0];case "oj-collapsible-header":return this.header[0];case "oj-collapsible-disclosure":case "oj-collapsible-header-icon":return this.PF()[0]}return null},getSubIdByNode:function(a){for(var c=this.getNodeBySubId({subId:"oj-collapsible-disclosure"});a;){if(a===this.content[0])return{subId:"oj-collapsible-content"};if(a===this.header[0])return{subId:"oj-collapsible-header"};if(a===c)return{subId:"oj-collapsible-disclosure"};a=a.parentElement}return null}})})();
a.U.ob("oj-collapsible","baseComponent",{properties:{disabled:{type:"boolean"},expandArea:{type:"string",enumValues:["header","disclosureIcon"]},expanded:{type:"boolean",writeback:!0}},events:{beforeCollapse:{},beforeExpand:{},collapse:{},expand:{}},extension:{mb:"ojCollapsible"}});a.U.register("oj-collapsible",{metadata:a.U.getMetadata("oj-collapsible")})});