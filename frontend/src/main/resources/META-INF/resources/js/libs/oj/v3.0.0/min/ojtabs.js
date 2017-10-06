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
define(["ojs/ojcore","jquery","ojs/ojcomponentcore","ojs/ojconveyorbelt","ojs/ojmenu","jqueryui-amd/widgets/sortable","ojs/ojtouchproxy"],function(a,g){(function(){var c={cut:"ojtabscut","paste-before":"ojtabspastebefore","paste-after":"ojtabspasteafter",remove:"ojtabsremove"},b={cut:"labelCut","paste-before":"labelPasteBefore","paste-after":"labelPasteAfter",remove:"labelRemove"};a.ab("oj.ojTabs",g.oj.baseComponent,{widgetEventPrefix:"oj",delay:300,options:{selected:0,disabledTabs:null,truncation:"auto",
selectOn:"click",orientation:"horizontal",edge:"top",removable:!1,reorderable:!1,beforeSelect:null,select:null,beforeDeselect:null,deselect:null,beforeRemove:null,remove:null,beforeReorder:null,reorder:null},_ComponentCreate:function(){var a=this.options;this._super();this.x4=!1;this.Li=!0;this.x0(a.edge);this.Nfa=0==this.element.children("ul").length;this.cza();this.tha();this.Xa={};this.Xa.qi=!1;this.Xa.HJ=[];this.Xa.Qf=null;this.Xa.ll=null;this.Xa.nm=null;this.Eu();this.ah();a=this.Nca(a.selected);
void 0===a&&(a=0);this.KF(a);this.Li=void 0},KF:function(a,b){this.jO(a)&&(a=this.cY(a));this.SE(void 0===a?void 0:g(this.kc[a]),b)},bi:function(a,b,c){if(this.zGa(b.target)&&(!this.VH||!this.VH.kP)){var h="keyboard"===c;if("contextmenu"==b.type||h||"touch"==c){var k=g(b.target).closest("li");a={launcher:k};this.Xa.tab=h?this.nb:a.launcher;if(this.Xa.tab){if(this.Xa.GJ){if(((h=k.hasClass("oj-disabled"))||0==this.lB(k).length)&&1==this.Xa.Qf.children().length){b.preventDefault();return}h||!this.FZ(k)?
this.Xa.GJ.addClass("oj-disabled"):this.Xa.GJ.removeClass("oj-disabled")}if(this.Xa.ll||this.Xa.nm)k=!this.Xa.TP,this.Xa.ll.hasClass("oj-disabled")!=k&&(k?(this.Xa.ll.addClass("oj-disabled"),this.Xa.nm.addClass("oj-disabled")):(this.Xa.ll.removeClass("oj-disabled"),this.Xa.nm.removeClass("oj-disabled")),this.Xa.Qf.ojMenu("refresh"));this.di(b,c,a)}else b.preventDefault()}}},tMa:function(a){if(!this.wea(a)){var b=g(this.document[0].activeElement).closest("li"),c=this.WF(),h=c.index(b),k=c.length;switch(a.keyCode){case g.ui.keyCode.RIGHT:case g.ui.keyCode.DOWN:h=
(h+1)%k;break;case g.ui.keyCode.UP:case g.ui.keyCode.LEFT:h=((0==h?k:h)-1)%k;break;case g.ui.keyCode.END:h=k-1;break;case g.ui.keyCode.HOME:h=0;break;case 46:(b=this.nb)&&0<this.lB(b).length&&(a.preventDefault(),this.NO(b,null,a));return;default:return}a.preventDefault();clearTimeout(this.zNa);var l=g(c[h]);l.focus();if(!a.ctrlKey){b.attr("aria-selected","false");l.attr("aria-selected","true");var m=this;this.zNa=this._delay(function(){m&&m.kc&&m.SE(l,a)},this.delay)}}},pIa:function(a){g(a.target).closest(".oj-tabs-selected").attr("id")===
this.element.children(".oj-tabs-selected").attr("id")&&!this.wea(a)&&a.ctrlKey&&a.keyCode===g.ui.keyCode.UP&&(a.preventDefault(),this.nb.focus())},wea:function(a){var b=this.lY();if(a.ctrlKey&&a.keyCode===g.ui.keyCode.PAGE_UP)return this.SE(this.aca(b,!1)),!0;if(a.ctrlKey&&a.keyCode===g.ui.keyCode.PAGE_DOWN)return this.SE(this.aca(b,!0)),!0},jO:function(a){return 0<=a&&a<this.kc.length?g(this.kc[a]).hasClass("oj-disabled"):!1},aca:function(a,b){var c=this.WF(),h=c.index(this.kc[a]),k=c.length,c=g(c[b?
(h+1)%k:((0==h?k:h)-1)%k]);c.focus();return c},cY:function(a){for(var b=a+1,c=this.kc.length-1;b<=c;){if(!this.jO(b))return b;b++}for(b=a-1;0<=b;){if(!this.jO(b))return b;b--}},ae:function(){return"top"==this.options.edge||"bottom"==this.options.edge},_setOption:function(a,b,c){"selected"===a?(b=this.rY(b),void 0!==b&&this.SE(b)):"disabledTabs"===a?(null===b&&(b=[]),Array.isArray(b)&&(this.bja(b),a=this.lY(),this.jO(a)&&this.KF(a),this.refresh())):"removable"===a||"truncation"===a?b!=this.options[a]&&
(this._super(a,b,c),this.refresh()):"reorderable"===a?b!==this.options.reorderable&&(this._super(a,b,c),this.refresh()):"orientation"===a?this.SW||(a=this.$ga(b))&&this.x0(a)&&this.refresh():"edge"===a?this.x0(b)&&(this.SW=!0,this._super(a,b,c),this.refresh()):"selectOn"===a?(this.qC(!0),this._super(a,b,c),this.Ho()):("contextMenu"===a&&(this.ox(),b&&this.Eu(b)),this._super(a,b,c),"translations"===a&&c&&"removeCueText"===c.subkey&&this.ie&&this.lB(this.ie).attr("aria-label",b?b.removeCueText:""))},
refresh:function(){this._super();this.tha();this.ah();if(!this.element.children(".oj-tabs-selected").length){var a=this.cY(-1);0<=a&&this.KF(a)}},ah:function(){var a=this.element.children(".oj-tabs-selected");this.nb=a.length?this.ie.children(".oj-selected"):g();this.xya();this.Ho();this.kc.not(this.nb).attr({"aria-selected":"false",tabIndex:"-1"});this.lm.not(this.zu(this.nb)).hide().attr({"aria-expanded":"false","aria-hidden":"true"});this.nb.length?(this.nb.addClass("oj-selected").attr({"aria-selected":"true",
tabIndex:"0"}),a.show().attr("aria-expanded","true").removeAttr("aria-hidden")):g(this.kc[0]).attr("tabIndex","0");this.ae()&&(0<this.kc.length?(this.RMa(),this.Rva()):this.sY(),this.Uva());void 0===this.options.selected||0==this.lY()?this.element.addClass("oj-first-child-selected"):this.element.removeClass("oj-first-child-selected");this.TLa()},Rva:function(){var a=this.ie.uniqueId().attr("id");this.Ls=this.sY().parent().ojConveyorBelt({orientation:"horizontal",contentParent:"#"+a}).attr("data-oj-internal",
"");a=this.Ls.parent();if(a.hasClass("oj-tabs-conveyorbelt-wrapper")){var b="0 1 "+this.rBa()+"px";a.css("flex",b);a.css("-webkit-flex",b);a.css("-ms-flex",b)}},tha:function(){var a=this,b=this.options.edge;this.hba();this.bza();this.ie=this.element.children("ul").addClass("oj-tabs-nav oj-helper-clearfix").attr("role","tablist");var c=this.ie.index(),h,k;this.element.children(".oj-tabs-facet").each(function(){var a=g(this);a.index()<c?(a.addClass("oj-start"),h=a):(k||(k=a),a.removeClass("oj-start"))});
this.element.children(".oj-tabs-panel");"start"==b||"top"==b?h?h.after(this.ie):this.element.prepend(this.ie):k?k.before(this.ie):this.element.append(this.ie);this.kc=g();this.lm=g();this.ie.children("li").each(function(){var b=g(this).addClass("oj-tabs-tab").attr({role:"tab",tabIndex:"-1"}).removeAttr("aria-hidden"),c=b.children();c.addClass("oj-tabs-tab-content");c=c.children();c.addClass("oj-tabs-anchor").attr({role:"presentation",tabIndex:"-1"});c.children().addClass("oj-tabs-title").removeAttr("aria-hidden");
a.kc=a.kc.add(b);var c=c.uniqueId().attr("id"),e=b.attr("data-content"),f=a.element.find(a.uy(e));b.attr({"aria-controls":e,"aria-labelledby":c});a.lm=a.lm.add(f);f.attr("aria-labelledby",c).attr("role","tabpanel")});"start"!=b&&"end"!=b||a.ie.addClass("oj-tabs-nav-root");this.Li&&this.bja(this.options.disabledTabs)},Ho:function(){var b=this,c={keydown:this.tMa},f=this.options.selectOn,h=!1;f&&g.each(f.split(" "),function(f,g){"click"==g&&(h=!0);a.Q.SQ(g)&&(c[g]=b.eB)});var k=this.WF();this._on(k,
c);h||this._on(k,{click:function(a){a.preventDefault()}});this.lm.on("keydown"+this.eventNamespace,this.pIa.bind(this));if(this.options.removable){var f={click:this.SJa},l=this.lB(k);this._on(l,f);this.Uf(l);this.nk(l)}this._focusable({element:k,applyHighlight:!0});this.Uf(k);this.nk({element:k,afterToggle:function(a){"mousedown"===a&&k.filter(".oj-focus-highlight").blur()}})},qC:function(a){var b=this.WF();a||this.dx(this.lB(b));this.dx(b);this.lm&&this.lm.off("keydown"+this.eventNamespace)},eB:function(a,
b){var c=this.nb,h=g(a.currentTarget).closest("li"),k=c&&h[0]===c[0],l=this.zu(h),m=c&&c.length?this.zu(c):g(),c={fromTab:c,fromContent:m,toTab:h,toContent:l};a.preventDefault();var p=b?b:a;h.hasClass("oj-disabled")||this.x4||k||m&&m.length&&!1===this._trigger("beforeDeselect",p,c)||!this.Li&&!1===this._trigger("beforeSelect",p,c)||(this.Li?this.options.selected=this.wN(h):this.option("selected",this.wN(h),{_context:{originalEvent:p,kb:!0}}),this.nb=h,l.addClass("oj-tabs-selected"),m&&m.length&&m.removeClass("oj-tabs-selected"),
this.FMa(p,c))},FMa:function(b,c){var f=c.toTab.closest("li"),h=c.toContent,k=c.fromContent;this.x4=!0;var l=c.fromTab.closest("li").removeClass("oj-selected");k.hide();0<k.length&&a.Components.ew(k[0]);f.addClass("oj-selected");this.ae()&&0<this.kc.length&&(0==f.index()?this.element.addClass("oj-first-child-selected"):this.element.removeClass("oj-first-child-selected"));h.show();0<h.length&&a.Components.xt(h[0]);this.x4=!1;this.Li||(this._trigger("deselect",b,c),this._trigger("select",b,c));k.attr({"aria-expanded":"false",
"aria-hidden":"true"});l.attr("aria-selected","false");h.length&&k.length?l.attr("tabIndex","-1"):h.length&&this.kc.filter(function(){return"0"===g(this).attr("tabIndex")}).attr("tabIndex","-1");h.attr("aria-expanded","true").removeAttr("aria-hidden");f.attr({"aria-selected":"true",tabIndex:"0"})},SE:function(a,b){if(void 0!==a){var c;this.nb&&a[0]===this.nb[0]||(c=a.find(".oj-tabs-anchor")[0],this.eB({target:c,currentTarget:c,preventDefault:g.noop},b))}},xya:function(){if(this.options.removable&&
this.ae()){var a=this.R("removeCueText"),b=this;this.WF().each(function(c){if(b.FZ(g(this))){var h=g(this).find("\x3e :first-child");h.addClass("oj-removable");c="ojtabs-id_rm_"+c;g(this).attr("aria-describedby",c);g("\x3ca href\x3d'#'\x3e").addClass("oj-tabs-icon oj-component-icon oj-clickable-icon-nocontext oj-tabs-close-icon").attr({id:c,tabIndex:"-1","aria-label":a,role:"presentation"}).appendTo(h)}})}},WF:function(){return g(this.kc.not(".oj-disabled"))},lB:function(a){return a.find(".oj-tabs-close-icon")},
hba:function(){this.kc&&this.qC();this.Hea&&(a.Q.Gn(this.element[0],this.Bh),this.Hea=!1,this.n_=void 0);this.K0&&(a.Q.Ne()&&this.cka(),this.ie.sortable("instance")&&this.ie.sortable("destroy"),this.K0=void 0);var b=this.element.children(".oj-tabs-nav-root"),c=!b.hasClass("oj-tabs-nav");if(this.kc&&(this.lB(this.kc).remove(),b.length)){var f=b,h=!0,k=this.ie;b.children().each(function(){var a=g(this);if(a.hasClass("oj-tabs-conveyorbelt-wrapper"))a=k;else if(!a.hasClass("oj-tabs-facet"))return;h=!1;
f.after(a);f=a});h&&c&&b.after(k)}this.Ls&&(this.Ls.ojConveyorBelt("destroy"),this.Ls.remove(),this.nb=this.Ls=null);c&&b.remove();this.ie=this.kc=null},_destroy:function(){this.ox();this.ae()?this.element.removeClass("oj-tabs oj-component oj-tabs-horizontal oj-tabs-top oj-tabs-bottom oj-first-child-selected"):this.element.removeClass("oj-tabs oj-component oj-tabs-vertical oj-tabs-start oj-tabs-end oj-helper-clearfix");var a=this,b,c,h,k;this.kc.each(function(l){b=g(this);b.removeAttr("tabIndex").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-controls").removeAttr("aria-disabled").removeAttr("aria-describedby").removeAttr("role").removeAttr("data-content").removeClass("oj-active oj-disabled oj-selected oj-tabs-gen-id oj-tabs-tab").removeUniqueId().css("display",
"");c=b.children("div").removeClass("oj-tabs-tab-content");h=c.children("a").removeClass("oj-tabs-anchor").removeAttr("tabIndex").removeAttr("role");k=h.children();k.removeClass("oj-tabs-title").removeAttr("aria-hidden");a.Nfa?k.prependTo(a.lm.get(l)):c.hasClass("oj-tabs-gen-div")&&h.hasClass("oj-tabs-gen-a")?(k.prependTo(b),c.remove()):h.hasClass("oj-tabs-gen-a")?(k.prependTo(c),h.remove()):c.hasClass("oj-tabs-gen-div")&&(h.prependTo(b),c.remove())});var l=this.ie;this.hba();l.removeAttr("tabIndex").removeAttr("role").removeClass("oj-tabs-nav oj-tabs-nav-root oj-helper-clearfix").removeUniqueId();
this.Nfa&&l.remove();this.lm.each(function(){g(this).removeAttr("tabIndex").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("role").removeClass("oj-active oj-tabs-selected oj-tabs-gen-id oj-tabs-panel").removeUniqueId().css("display","")});this.element.children(".oj-tabs-facet").removeClass("oj-start")},FZ:function(a){var b=this.options.removable;return b&&(!Array.isArray(b)||-1<b.indexOf(a.attr("id")))},NO:function(a,b,c){if(this.FZ(a)){var h=
this.zu(a),k={tab:a,content:h};c=c?c:b?b:{target:a,currentTarget:a,preventDefault:g.noop};if(a&&!1!==this._trigger("beforeRemove",c,k)){b&&b.preventDefault();if(a.hasClass("oj-selected")){b=this.kc.index(a);var l=this.cY(b);void 0===l?(this.nb=void 0,this.option("selected",void 0,{_context:{originalEvent:c,kb:!0}})):(this.KF(l,c),l=this.wN(g(this.kc[l])),"number"===typeof l&&l>b&&l--,this.option("selected",l,{_context:{originalEvent:c,kb:!0}}))}this.qC();this.kc=this.kc.not(a);a.remove();h.remove();
this.w1();this.refresh();this._trigger("remove",c,k)}}},SJa:function(a,b){this.NO(g(a.currentTarget).closest("li"),a,b)},removeTab:function(a){if("string"!==typeof a)throw Error("'"+a+"' is not a tab id");this.NO(this.rY(a),null,null)},DP:function(a,b){var c;if("li"==a.prop("tagName").toLowerCase()){c=a;var g=c.children("div");1==g.length&&g.hasClass("oj-tabs-tab-content")?(g=g.children("a"),1!=g.length&&(c.wrapInner("\x3ca href\x3d'#'\x3e\x3c/a\x3e"),g.addClass("oj-tabs-gen-a"))):(g=c.wrapInner("\x3cdiv\x3e\x3ca href\x3d'#'\x3e\x3c/a\x3e\x3c/div\x3e").children(),
g.addClass("oj-tabs-gen-div oj-tabs-tab-content"),g.children().addClass("oj-tabs-gen-a"))}else c=a.wrap("\x3cli\x3e\x3cdiv\x3e\x3ca href\x3d'#'\x3e\x3c/a\x3e\x3c/div\x3e\x3c/li\x3e").parent().parent().parent(),c.addClass("oj-tabs-gen-li"),c.children().addClass("oj-tabs-gen-div oj-tabs-tab-content");b&&c.attr("data-content",b);return c},addTab:function(a){var b,c,h=-1;a.tab&&a.content?(c=a.content,b=this.DP(a.tab,this.zN(c)),void 0!==a.index&&(h=a.index)):(c=a,b=this.DP(g(a).find("\x3e :first-child"),
this.zN(c)));a=this.element.children(".oj-tabs-nav-root");a=a.hasClass("oj-tabs-nav")?a:a.length?a.find(".oj-tabs-nav"):this.element.children(".oj-tabs-nav");var k=!1;a.length||(a=g("\x3cul\x3e"),k=!0);k&&a.prependTo(this.element);0<=h&&h<a.children().length?(h=a.children(":eq("+h+")"),a=this.element.children(this.uy(h.attr("aria-controls"))),h.before(b),a.before(c)):(b.appendTo(a),c.appendTo(this.element));this.refresh();0==this.nb.length&&this.KF(0);b[0].scrollIntoView(!1)},VLa:function(){this.VH=
a.sg.M1(this.ie)},cka:function(){a.sg.t4(this.ie)},TLa:function(){if(this.options.reorderable){var b=this;a.Q.Ne()&&this.VLa();this.ie.sortable({axis:b.ae()?"x":"y",distance:10,start:function(){b.ie.children(".ui-sortable-placeholder").each(function(){g(this).addClass("oj-sortable-placeholder")})},stop:function(a,c){var g=c.item;b.sba(a,g,g.prev())||b.ie.sortable("cancel")}});this.K0=!0}else this.cka(),this.K0=!1},Og:function(a,b){var c=b.edge;this.SW="top"==c||"bottom"==c||"start"==c||"end"==c;this._super(a,
b)},$ga:function(a){return"horizontal"==a?"top":"vertical"==a?"start":null},x0:function(a){if(this.Li&&!this.SW||!a)a=this.$ga(this.options.orientation);var b=this.options.edge;this.element.removeClass("oj-tabs-top oj-tabs-bottom oj-tabs-start oj-tabs-end");switch(a){case "top":case "bottom":!this.lm||"start"!=b&&"end"!=b||this.element.removeClass("oj-tabs-vertical oj-helper-clearfix");this.element.addClass("oj-tabs oj-component oj-tabs-horizontal");"bottom"==a?this.element.addClass("oj-tabs-bottom"):
this.element.addClass("oj-tabs-top");this.Li?this.options.orientation="horizontal":"horizontal"!=this.options.orientation&&this.option("orientation","horizontal",{_context:{kb:!0},changed:!0});break;case "start":case "end":!this.lm||"top"!=b&&"bottom"!=b||this.element.removeClass("oj-tabs-horizontal");this.element.addClass("oj-tabs oj-component oj-tabs-vertical oj-helper-clearfix");"end"==a?this.element.addClass("oj-tabs-end"):this.element.addClass("oj-tabs-start");this.Li?this.options.orientation=
"vertical":"vertical"!=this.options.orientation&&this.option("orientation","vertical",{_context:{kb:!0},changed:!0});break;default:return!1}this.Li?this.options.edge=a:this.options.edge!=a&&this.option("edge",a,{_context:{kb:!0},changed:!0});return!0},sY:function(){var a=this.ie.parent();a.hasClass("oj-tabs-conveyor")||(a=this.ie.wrap("\x3cdiv\x3e").parent().addClass("oj-tabs-conveyor"),(0<this.element.children(".oj-tabs-facet").length?a.wrap("\x3cdiv\x3e").wrap("\x3cdiv\x3e").parent().parent().addClass("oj-tabs-conveyorbelt-wrapper"):
a).wrap("\x3cdiv\x3e").parent().addClass("oj-tabs-nav-root").uniqueId().attr("id"));return a},UUa:function(a){0>a.id.indexOf("ojtabs-id_")&&g(a).attr("id","ojtabs-id_"+a.id)},getNodeBySubId:function(a){if(null==a)return this.element?this.element[0]:null;var b=a.subId;a=a.index;if("oj-conveyorbelt"!=b&&("number"!==typeof a||0>a||a>=this.lm.length))return null;switch(b){case "oj-conveyorbelt":return this.Ls?this.Ls[0]:null;case "oj-tabs-panel":return this.zu(this.kc[a])[0];case "oj-tabs-tab":return this.kc[a];
case "oj-tabs-title":return g(this.kc[a]).find(".oj-tabs-title")[0];case "oj-tabs-close-icon":case "oj-tabs-close":return g(this.kc[a]).find(".oj-tabs-close-icon")[0]}return null},getSubIdByNode:function(a){for(var b=[],c=0;c<this.kc.length;c++)b.push(this.zu(this.kc[c])[0]);for(var g=c=-1,k=a;k;){if(this.Ls&&k===this.Ls[0])return{subId:"oj-conveyorbelt"};c=Array.prototype.indexOf.call(this.kc,k);if(-1!=c)break;g=b.indexOf(k);if(-1!=g)return{subId:"oj-tabs-panel",index:g};k=k.parentElement}if(-1!=
c)for(b=this.getNodeBySubId({subId:"oj-tabs-title",index:c}),g=this.getNodeBySubId({subId:"oj-tabs-close",index:c}),k=a;k;){if(k===b)return{subId:"oj-tabs-title",index:c};if(k===g)return{subId:"oj-tabs-close",index:c};if(k===this.kc[c])return{subId:"oj-tabs-tab",index:c};k=k.parentElement}return null},rBa:function(){return this.n_+10},Ida:function(){var a=this.element.find(".oj-tabs-conveyorbelt-wrapper");return a.length?a[0].clientWidth:this.element[0].clientWidth},Pfa:function(){return this.n_>
this.Ida()},QCa:function(){var a=Math.floor(this.Ida()/this.kc.length);this.options.removable&&(a-=28);return a},W9:function(){var a=this.QCa();this.ie.find(".oj-tabs-title").each(function(){g(this).css("max-width",""+a+"px").addClass("oj-tabs-title-overflow")})},TJa:function(){this.ie.find(".oj-tabs-title").each(function(){g(this).css("max-width","").removeClass("oj-tabs-title-overflow")})},DVa:function(){},Ji:function(){this.Ufa()&&(this.Pfa()?this.W9():this.TJa())},Ufa:function(){return"auto"==
this.options.truncation||"progressive"==this.options.truncation},RMa:function(){this.ae()&&0<this.kc.length&&(null==this.Bh&&(this.Bh=this.Ji.bind(this)),a.Q.bm(this.element[0],this.Bh),this.Hea=!0,this.n_=this.sY()[0].scrollWidth,this.Ufa()&&this.Pfa()&&this.W9())},Ap:function(){this._super();this.refresh()},$n:function(){this._super();this.refresh()},tk:function(a){return g("\x3ca\x3e").text(this.R(b[a])).attr("href","#").wrap("\x3cli\x3e").parent().attr("id",c[a]).addClass("oj-menu-item")},wHa:function(a){if(!a||
!a.length)return!1;this.Xa.TP=a},Gga:function(a,b,c){if(!b||!b.length||!this.Xa.TP)return!1;var g=this.Xa.TP;this.Xa.TP=!1;this.sba(a,g,b,c)},xHa:function(a,b){if(!b||!b.length)return!1;this.NO(b,null,a)},Vl:function(a,b){var c=b?b.item.attr("id"):void 0;"ojtabscut"===c?this.wHa(this.Xa.tab):"ojtabspastebefore"===c?this.Gga(a,this.Xa.tab,!0):"ojtabspasteafter"===c?this.Gga(a,this.Xa.tab,!1):"ojtabsremove"===c&&this.xHa(a,this.Xa.tab)},Eu:function(a){if(a=a||this.options.contextMenu){if("function"==
g.type(a)){try{a=a()}catch(b){a=null}g.type(a)}a&&g(a).length&&(this.options.contextMenu=a)}this.Xa.qi=!!a;this.Yt()},AL:function(a,b,c){-1==b.indexOf(c)&&(b=this.tk(c),a.append(b),this.Xa.HJ.push(b))},Yt:function(){var a=g(this.options.contextMenu);if(0!=a.length||this.options.reorderable||this.options.removable){var c=this;if(0==a.length){var f=this.options.reorderable?"labelReorder":b.remove,h=this.element.uniqueId().attr("id")+"contextmenu",a=g("\x3cul\x3e");a.css("display","none").attr("id",
h).attr("aria-label",this.R(f));g(document.body).append(a);a.ojMenu();this.options.contextMenu=this.uy(h)}var k=[];a.find("[data-oj-command]").each(function(){if(0===g(this).children("a").length){var a=g(this).attr("data-oj-command").slice(8);g(this).replaceWith(c.tk(a));g(this).addClass("oj-menu-item");k.push(a)}});this.options.reorderable&&(this.AL(a,k,"cut"),this.AL(a,k,"paste-before"),this.AL(a,k,"paste-after"),this.Xa.ll=a.find("#ojtabspastebefore"),this.Xa.nm=a.find("#ojtabspasteafter"));this.options.removable&&
(this.AL(a,k,"remove"),this.Xa.GJ=a.find("#ojtabsremove"));this.Xa.Qf=a;a.ojMenu("refresh");a.on("ojselect",g.proxy(this.Vl,this))}},ox:function(){var a=this.Xa;if(a&&a.Qf){a.Qf.off("ojselect");a.qi||(a.Qf.ojMenu("destroy"),a.Qf.remove());if(a.HJ)for(;0<a.HJ.length;)a.HJ.pop().remove();a.Qf=null}a.ll=null;a.nm=null;a.GJ=null},sba:function(a,b,c,g){var k=this.zu(b),l={tab:b,content:k};if(!1===this._trigger("beforeReorder",a,l))return!1;var m=this.kc.index(b);if(c.length){if(this.kc.index(c)==m)return!0;
m=this.zu(c);g?(c.before(b),m.before(k)):(c.after(b),m.after(k))}else if(0<this.kc.length){if(0==m)return!0;this.kc.first().before(b);this.lm.first().before(k)}this.w1();this.refresh();c.blur();b.focus();this._trigger("reorder",a,l);return!0},wia:function(a){return a?a.replace(/[#!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$\x26"):""},uy:function(a){return a?"#"+this.wia(a):""},zu:function(a){return this.element.find(this.uy(g(a).attr("aria-controls")))},zN:function(a){var b=a.attr("id");b||(b=a.uniqueId().attr("id"),
a.addClass("oj-tabs-gen-id"));return b},rY:function(a){a=this.Nca(a);if(-1!==a)return g(this.kc[a])},Nca:function(b){var c=-1;"number"===typeof b?0<=b&&b<this.kc.length&&(c=b):"string"===typeof b&&(b=this.wia(b),a.Q.SQ(b)&&(b=this.element.find(this.uy(b)),b.length&&(c=this.kc.index(b),-1==c&&(c=this.lm.index(b)))));return c},lY:function(){var a=this.options.selected;return"number"===typeof a?a:this.kc.index(g(this.uy(a)))},wN:function(a){if(a){var b=a.attr("id");return b?b:this.kc.index(a)}},bja:function(a){var b=
(this.ie?this.ie:this.element.children("ul")).children("li");b.removeClass("oj-disabled").removeAttr("aria-disabled");var c=[];if(a&&0<a.length)for(var g,k,l=0;l<a.length;l++)if(k=this.rY(a[l]))k.addClass("oj-disabled"),k.attr("aria-disabled","true"),k.find(".oj-tabs-anchor").removeAttr("href"),g=k.attr("id"),c.push(g?g:b.index(k));this.w1(c)},w1:function(b){if(!b){b=[];var c=this;this.ie.children().each(function(){var a=g(this);a.hasClass("oj-disabled")&&b.push(c.wN(a))})}a.f.gaa(b,this.options.disabledTabs)||
(this.Li?this.options.disabledTabs=b:this.option({disabledTabs:b},{_context:{kb:!0,xd:!0},changed:!0}))},zGa:function(a){var b=!1;this.kc.each(function(){if(this===a||g.contains(this,a))return b=!0,!1});return b},bza:function(){var a=this.oca(),b=this,c=this.element.children("ul");0<c.length&&c.children("li").each(function(c){b.DP(g(this),a[c])})},cza:function(){var a=this.element.children("ul");if(0==a.length){var b=this,c=this.oca(),a=g("\x3cul\x3e");this.element.children().each(function(h){b.DP(g(this).find("\x3e :first-child"),
c[h]).appendTo(a)});a.prependTo(this.element)}},Uva:function(){var a=this.element.children(".oj-tabs-nav-root"),b=this,c=a.children(".oj-tabs-conveyorbelt-wrapper");a.index();this.element.children(".oj-tabs-facet").each(function(){var h=g(this),k=b.zN(h);0==a.find(b.uy(k)).length&&(h.hasClass("oj-start")?c.before(h):h.appendTo(a))})},oca:function(){var a=[],b=this;this.element.children(":not(ul):not(.oj-tabs-facet)").each(function(){var c=g(this);c.addClass("oj-tabs-panel");a.push(b.zN(c))});return a}})})();
a.U.ob("oj-tabs","baseComponent",{properties:{disabledTabs:{type:"Array"},edge:{type:"string"},orientation:{type:"string"},removable:{type:"boolean|Array"},reorderable:{type:"boolean"},selected:{type:"string|number"},selectOn:{type:"string"},truncation:{type:"string"}},methods:{addTab:{},refresh:{},removeTab:{}},extension:{mb:"ojTabs"}});a.U.register("oj-tabs",{metadata:a.U.getMetadata("oj-tabs")})});