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
define(["ojs/ojcore","jquery","ojs/ojdatasource-common","ojs/ojmodel"],function(a,g){a.Ud=function(c,b){this.data={};if(!(c instanceof a.t))throw Error(a.ha.Md._ERR_DATA_INVALID_TYPE_SUMMARY+"\n"+a.ha.Md._ERR_DATA_INVALID_TYPE_DETAIL);a.Ud.O.constructor.call(this,c,b);this.oe=c;this.Ova();this.Init();if(null!=b&&("enabled"==b.startFetch||null==b.startFetch)||null==b)this.KH=!0};o_("CollectionTableDataSource",a.Ud,a);a.f.xa(a.Ud,a.ha,"oj.CollectionTableDataSource");a.Ud.prototype.bn=null;a.f.j("CollectionTableDataSource.prototype.comparator",
{bn:a.Ud.prototype.bn});a.Ud.prototype.Init=function(){a.Ud.O.Init.call(this)};a.f.j("CollectionTableDataSource.prototype.Init",{Init:a.Ud.prototype.Init});a.Ud.prototype.at=function(c,b){b=b||{};b.deferred=!0;var d=this.oe.at(c,b),e=this;e.wG=!0;var f;return new Promise(function(b,g){null!=d?d.then(function(a){e.wG=!1;f={data:a.attributes,index:c,key:a.id};b(f)},function(b){e.wG=!1;a.ha.O.handleEvent.call(e,a.ha.aa.ERROR,b);g(b)}):b(null)})};a.f.j("CollectionTableDataSource.prototype.at",{at:a.Ud.prototype.at});
a.Ud.prototype.fetch=function(a){a=a||{};return"init"!=a.fetchType||this.KH?this.sh(a):Promise.resolve()};a.f.j("CollectionTableDataSource.prototype.fetch",{fetch:a.Ud.prototype.fetch});a.Ud.prototype.get=function(c,b){b=b||{};b.deferred=!0;var d=this.oe.get(c,b),e=this,f;return new Promise(function(b,c){null!=d?d.then(function(a){f={data:a.attributes,index:a.index,key:a.id};b(f)},function(b){a.ha.O.handleEvent.call(e,a.ha.aa.ERROR,b);c(b)}):b(null)})};a.f.j("CollectionTableDataSource.prototype.get",
{get:a.Ud.prototype.get});a.Ud.prototype.sort=function(a){null==a?a=this.sortCriteria:this.sortCriteria=a;var b=this.comparator,d=this;return new Promise(function(e){null==b?(d.oe.comparator=a.key,d.oe.sortDirection="ascending"==a.direction?1:-1):d.oe.comparator=b;d.oe.sort(null);e({header:a.key,direction:a.direction})})};a.f.j("CollectionTableDataSource.prototype.sort",{sort:a.Ud.prototype.sort});a.Ud.prototype.totalSize=function(){var a=0<=this.oe.totalResults?this.oe.totalResults:-1;if(-1<a){var b=
this.oe.size();return b>a?b:a}if(0<this.YW)a=this.YW;else if("atLeast"==this.totalSizeConfidence())return this.oe.size();return a};a.f.j("CollectionTableDataSource.prototype.totalSize",{totalSize:a.Ud.prototype.totalSize});a.Ud.prototype.totalSizeConfidence=function(){return 0<=this.oe.totalResults?"actual":this.oe.hasMore?"atLeast":"unknown"};a.f.j("CollectionTableDataSource.prototype.totalSizeConfidence",{totalSizeConfidence:a.Ud.prototype.totalSizeConfidence});a.Ud.prototype.Ova=function(){var c=
this;this.oe.on(a.sa.aa.SYNC,function(b){if(b instanceof a.T)a.ha.O.handleEvent.call(c,a.ha.aa.CHANGE,{data:[b.attributes],keys:[b.id],indexes:[b.index]});else if(b instanceof a.t&&!c.wG&&!c.Efa){var d=b.offset,e=b.lastFetchCount||b.lastFetchSize;0<e||c.oe.Eb()?(c.Aa=d,c.Ab=e,c.wG=!0,b.Yz(d,d+e).then(function(a){c.wG=!1;var b=[],e=[],g,m;for(g=0;g<a.length;g++)null!=a[g]&&(m=a[g].clone(),b.push(m.attributes),e.push(m.id));c.oo.call(c,{silent:!1},{data:b,keys:e,startIndex:d},null)})):(b=c.uB(),c.oo.call(c,
{silent:!1},b,null))}});this.oe.on(a.sa.aa.ALLADDED,function(b,d){var e=[],f=[],g=[],k,l;for(k=0;k<d.length;k++)l=d[k].clone(),e.push(l.attributes),f.push(l.id),g.push(l.index);a.ha.O.handleEvent.call(c,a.ha.aa.ADD,{data:e,keys:f,indexes:g})});this.oe.on(a.sa.aa.ALLREMOVED,function(b,d){var e=[],f=[],g=[],k,l;for(k=0;k<d.length;k++)l=d[k].clone(),e.push(l.attributes),f.push(l.id),g.push(l.index);a.ha.O.handleEvent.call(c,a.ha.aa.REMOVE,{data:e,keys:f,indexes:g})});this.oe.on(a.sa.aa.RESET,function(b){a.ha.O.handleEvent.call(c,
a.ha.aa.RESET,b)});this.oe.on(a.sa.aa.SORT,function(b,d){if(null==d||!d.add){var e={};null==b||null==!b.comparator||g.isFunction(b.comparator)||(e.header=b.comparator,e.direction=1===b.sortDirection?"ascending":"descending");a.ha.O.handleEvent.call(c,a.ha.aa.SORT,e)}});this.oe.on(a.sa.aa.CHANGE,function(b){a.ha.O.handleEvent.call(c,a.ha.aa.CHANGE,{data:[b.attributes],keys:[b.id],indexes:[b.index]})});this.oe.on(a.sa.aa.DESTROY,function(b){a.ha.O.handleEvent.call(c,a.ha.aa.DESTROY,b)});this.oe.on(a.sa.aa.REFRESH,
function(b){a.ha.O.handleEvent.call(c,a.ha.aa.REFRESH,b)});this.oe.on(a.sa.aa.ERROR,function(b,d,e){a.ha.O.handleEvent.call(c,a.ha.aa.ERROR,b,d,e)});this.oe.on(a.sa.aa.REQUEST,function(b){a.ha.O.handleEvent.call(c,a.ha.aa.REQUEST,b)})};a.Ud.prototype.sh=function(a){this.JH(a);a=a||{};var b=this;this.Rfa=0<a.pageSize?!0:!1;this.Aa=null==a.startIndex?this.Aa:a.startIndex;this.Ab=0<a.pageSize?a.pageSize:-1;a.pageSize=this.Ab;a.startIndex=this.Aa;a.refresh=!0;return new Promise(function(d,e){var f=b.Ab;
b.Rfa||(f=25);b.oe.KD(b.Aa,f).then(function(e){var f;if(b.Rfa||b.oe.Eb()){f=[];var g=[],m,p;for(m=0;m<e.models.length;m++)p=e.models[m].clone(),f[m]=p.attributes,g[m]=p.id;f={data:f,keys:g,startIndex:b.Aa};e.models.length<b.Ab?0>b.totalSize()&&(b.YW=b.Aa+e.models.length):b.YW=null}else f=b.uB();b.oo.call(b,a,f,null);d(f)},function(d){b.oo.call(b,a,null,d);e(d)})})};a.Ud.prototype.JH=function(c){this.Efa=!0;c.silent||a.ha.O.handleEvent.call(this,a.ha.aa.REQUEST,{startIndex:c.startIndex})};a.Ud.prototype.oo=
function(c,b,d){this.Efa=!1;null!=d?a.ha.O.handleEvent.call(this,a.ha.aa.ERROR,d):c.silent||a.ha.O.handleEvent.call(this,a.ha.aa.SYNC,b)};a.Ud.prototype.uB=function(){var a=this.oe.size()-1,b=[],d=[],e,f,g;for(e=0;e<=a;e++)f=this.oe.at(e),g=f.clone(),f=this.an(g,g.attributes),b[e]=f,d[e]=g.id;return{data:b,keys:d,startIndex:this.Aa}};a.Ud.prototype.getCapability=function(){return null};a.f.j("CollectionTableDataSource.prototype.getCapability",{getCapability:a.Ud.prototype.getCapability});a.Ud.prototype.an=
function(a,b){var d={},e;for(e in b)b.hasOwnProperty(e)&&function(){var b=e;Object.defineProperty(d,e,{get:function(){return a.get(b)},set:function(d){a.set(b,d,{silent:!0})},enumerable:!0})}();return d}});