/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","promise","ojs/ojdatasource-common"],function(a,g){a.Wb=function(a,b){this.Init();this.Na=a;this.Gf=b;this.Nz()};o_("Cube",a.Wb,a);a.f.xa(a.Wb,a.f,"oj.Cube");a.Wb.prototype.Init=function(){a.Wb.O.Init.call(this)};a.Wb.prototype.Ss=function(){var a=this.oda(),b=[];Array.prototype.push.apply(b,a?a.Ss():this.Ci);for(a=2;a<this.Ci.length;a++)b.push(this.Ci[a]);return b};a.f.j("Cube.prototype.getAxes",{Ss:a.Wb.prototype.Ss});a.Wb.prototype.dY=function(){return this.Ci};a.Wb.prototype.Ws=
function(a){var b=this.oda();a=b.ZHa(a);for(a=b=b.Kka(a,0,[]);Array.isArray(a)&&1===a.length;)if(a=a[0],!Array.isArray(a))return a;return b};a.f.j("Cube.prototype.getValues",{Ws:a.Wb.prototype.Ws});a.Wb.prototype.setPage=function(a){this.r_=a instanceof Array?a:[a]};a.Wb.prototype.upa=function(c,b,d,e,f){var g=this.Gf,k=this.Pba(c);if(!k)return!1;c=null;d<g.length?c=this.Pba(d):(c={axis:d,levels:[]},g.push(c));d=k.levels;g=c.levels;c=b<d.length?d[b]:null;if(!c)return!1;e>=g.length?(g.push(c),d.splice(b,
1)):f===a.Wb.bT.SWAP?(d[b]=g[e],g[e]=c):(f===a.Wb.bT.AFTER&&e++,g.splice(e,0,c),g===d&&e<b&&b++,d.splice(b,1));this.Nz();return!0};a.f.j("Cube.prototype.pivot",{upa:a.Wb.prototype.upa});a.Wb.prototype.Pba=function(a){for(var b=0;b<this.Gf.length;b++)if(this.Gf[b].axis===a)return this.Gf[b];return null};a.Wb.prototype.pQ=function(){return this.Gf};a.f.j("Cube.prototype.getLayout",{pQ:a.Wb.prototype.pQ});a.Wb.bT={BEFORE:"before",AFTER:"after",SWAP:"swap"};o_("Cube.PivotType",a.Wb.bT,a);a.Wb.prototype.Kka=
function(a,b,d){var e=[];if(0===a.length)return b=d.slice(0),this.Ul(b);var f=a.slice(1),g=a[0].start;a=a[0].count;for(d[b]=g;d[b]<g+a;d[b]++)e.push(this.Kka(f,b+1,d));return e};a.Wb.prototype.ZHa=function(a){var b=[];if(!a)return b;for(var d=Math.min(a.length,this.Ci.length),e=0;e<d;e++){var f=a[e];f instanceof Object&&(f.hasOwnProperty("start")||f.hasOwnProperty("count"))?f.hasOwnProperty("start")?f.hasOwnProperty("count")?b.push(this.LM(f.start,f.count,e)):b.push(this.LM(f.start,1,e)):b.push(this.LM(0,
f.count,e)):b.push(this.LM(f,1,e))}return b};a.Wb.prototype.LM=function(a,b,d){d=this.Ss()[d].getExtent();if(a>=d||0>a)a=0;b=Math.min(b,d-a);return{start:a,index:a,count:b}};a.Wb.prototype.Ul=function(c){var b=this.zya(c);return b&&(b=b.yw(),0<b.length&&(b=this.p[b[0].key]))?new a.nj(b.value,c,b.FP,b.rows,b.dw):new a.nj(null,c,void 0,[])};a.Wb.prototype.Bra=function(){var a=this.pCa();this.r_=[];for(var b=0;b<a.length;b++)this.as(a[b].axis,a[b].levels),this.r_.push({axis:a[b].axis,index:0});if(0===
a.length)for(a=this.dY(),b=0;b<a.length;b++)this.as(a[b].axis,a[b].levels)};a.Wb.prototype.pCa=function(){for(var a=[],b=0;b<this.Gf.length;b++)1<this.Gf[b].axis&&a.push(this.Gf[b]);return a};a.Wb.prototype.dY=function(){for(var a=[],b=0;b<this.Gf.length;b++)2>this.Gf[b].axis&&a.push(this.Gf[b]);return a};a.Wb.prototype.Nz=function(){this.Ci=[];this.p=[];this.tW=[];this.Bra();if(null!==this.Na)for(var c=0;c<this.Na.length;c++){for(var b=new a.Mn,d=2;d<this.Ci.length;d++)b=this.Ci[d].h6(this.Na[c],
b);for(var b=b.yw(),e=0;e<b.length;e++){var d=b[e].key,f=this.tW[d];f||(f=this.tW[d]=this.CS(this.dY()));for(var g=new a.Mn,k=f.Ci.length,d=0;d<k;d++)g=f.Ci[d].h6(this.Na[c],g);g=d=g.yw();if(void 0!==b[e].Jla)for(g=[],k=0;k<d.length;k++)g.push(b[e]);f.jMa(d,g,this.Na[c])}}};a.Wb.prototype.jMa=function(a,b,d){for(var e=0;e<a.length;e++)this.p[a[e].key]=this.vwa(b[e],this.p[a[e].key],d)};a.Wb.prototype.oda=function(){return this.tW[this.MBa(this.r_)]};a.Wb.prototype.MBa=function(c){var b=new a.Mn;if(c&&
0<c.length){c.sort(function(a,b){return a.axis-b.axis});for(var d=this.Ci,e=0;e<c.length;e++)b=d[c[e].axis].PJ(c[e].index,b)}return b.yw()[0].key};a.Wb.bga=function(a){return a?void 0!==a.value&&null!==a.value:!1};a.Wb.prototype.De=function(a,b,d,e,f){d.push(e);e={};for(var g in f)f.hasOwnProperty(g)&&(e[g]=f[g]);e.value=a;e.FP=b;e.rows=d;return e};a.Wb.yh=function(c){return a.Ra.od(c.value)?!1:!isNaN(c.value)};a.Wb.prototype.vwa=function(c,b,d){var e=this.ES(c.Jla),f=e.AC,g=a.Wb.bga(b),k=a.Wb.bga(c),
l=g&&a.Wb.yh(b),m=k&&a.Wb.yh(c);switch(f){case a.mj.SUM:return g&&k?l&&m?this.De(b.value+c.value,f,b.rows,d,{}):this.De(NaN,f,b.rows,d,{}):k&&!g?m?this.De(c.value,f,[],d,{}):this.De(NaN,f,[],d,{}):b;case a.mj.AVERAGE:return g&&k?l&&m?this.De((b.OD+c.value)/(b.rows.length+1),f,b.rows,d,{OD:b.OD+c.value}):this.De(NaN,f,b.rows,d,{OD:b.OD}):k&&!g?m?this.De(c.value,f,[],d,{OD:c.value}):this.De(NaN,f,[],d,{OD:NaN}):b;case a.mj.VARIANCE:case a.mj.STDDEV:return g&&k?l&&m?(g=b.value+(c.value-b.value)/(b.rows.length+
1),this.De(g,f,b.rows,d,{dw:b.dw+(c.value-b.value)*(c.value-g)})):this.De(NaN,f,b.rows,d,{dw:NaN}):k&&!g?m?this.De(c.value,f,[],d,{dw:0}):this.De(NaN,f,[],d,{dw:NaN}):b;case a.mj.NONE:return this.De(null,f,g?b.rows:[],d,{});case a.mj.FIRST:return g?this.De(b.value,f,b.rows,d,{}):k?this.De(c.value,f,[],d,{}):b;case a.mj.MIN:return g&&k?l&&m?this.De(Math.min(b.value,c.value),f,b.rows,d,{}):this.De(NaN,f,b.rows,d,{}):k&&!g?m?this.De(c.value,f,[],d,{}):this.De(NaN,f,[],d,{}):b;case a.mj.MAX:return g&&
k?l&&m?this.De(Math.max(b.value,c.value),f,b.rows,d,{}):this.De(NaN,f,b.rows,d,{}):k&&!g?m?this.De(c.value,f,[],d,{}):this.De(NaN,f,[],d,{}):b;case a.mj.COUNT:return g&&k?this.De(b.value+1,f,b.rows,d,{}):k&&!g?this.De(1,f,[],d,{}):b;case a.mj.CUSTOM:return c=e.fd.call(this,g?b.value:void 0,k?c.value:void 0),this.De(c,f,g?b.rows:[],d,{})}};a.Wb.prototype.as=function(c,b){c>=this.Ci.length&&Array.prototype.push.apply(this.Ci,Array(c-this.Ci.length+1));this.Ci[c]||(this.Ci[c]=new a.si(b,c,this));return this.Ci[c]};
a.Wb.prototype.zya=function(c){for(var b=this.Ss(),d=new a.Mn,e=0;e<c.length;e++)d=b[e].PJ(c[e],d);return d};a.Wb.prototype.eA=function(){a.u.Ke()};a.Wb.prototype.CS=function(){a.u.Ke()};a.Wb.prototype.DS=function(){a.u.Ke()};a.Wb.prototype.ES=function(){a.u.Ke();return{}};a.mj={SUM:"sum",AVERAGE:"avg",STDDEV:"stddev",VARIANCE:"variance",NONE:"none",FIRST:"first",MIN:"min",MAX:"max",COUNT:"count",CUSTOM:"custom"};o_("CubeAggType",a.mj,a);a.Hd=function(a,b,d,e){this.Init();this.Yf=[];this.iy=e;this.mza=
d;this.p={};this.p.value=a;this.p.label=b};o_("CubeAxisValue",a.Hd,a);a.f.xa(a.Hd,a.f,"oj.CubeAxisValue");a.Hd.prototype.Init=function(){a.Hd.O.Init.call(this)};a.Hd.prototype.az=function(){return this.mza};a.f.j("CubeAxisValue.prototype.getLevel",{az:a.Hd.prototype.az});a.Hd.prototype.getDepth=function(){return 1};a.f.j("CubeAxisValue.prototype.getDepth",{getDepth:a.Hd.prototype.getDepth});a.Hd.prototype.Lma=function(){for(var a=[],b=this.iy;b&&b.iy;)a.unshift(b),b=b.iy;return a};a.f.j("CubeAxisValue.prototype.getParents",
{Lma:a.Hd.prototype.Lma});a.Hd.prototype.getChildren=function(){return this.Yf};a.f.j("CubeAxisValue.prototype.getChildren",{getChildren:a.Hd.prototype.getChildren});a.Hd.prototype.getExtent=function(){if(-1<this.fB)return this.fB;if(this.Yf&&0!==this.Yf.length)for(var a=this.fB=0;a<this.getChildren().length;a++)this.fB+=this.getChildren()[a].getExtent();else this.fB=1;return this.fB};a.f.j("CubeAxisValue.prototype.getExtent",{getExtent:a.Hd.prototype.getExtent});a.Hd.prototype.getStart=function(){if(-1<
this.Nk)return this.Nk;if(!this.iy)return 0;for(var a=this.iy.getStart(),b=this.iy.sda(this);b;)a+=b.getExtent(),b=this.iy.sda(b);return this.Nk=a};a.f.j("CubeAxisValue.prototype.getStart",{getStart:a.Hd.prototype.getStart});a.Hd.prototype.fg=function(){return this.p.value};a.f.j("CubeAxisValue.prototype.getValue",{fg:a.Hd.prototype.fg});a.Hd.prototype.M2=function(){return this.p.label?this.p.label:this.fg()};a.f.j("CubeAxisValue.prototype.getLabel",{M2:a.Hd.prototype.M2});a.Hd.prototype.Cra=function(a){var b=
this.eBa();if(null===b)return null;if(b.fD())return this.tBa(a);if(a=a[b.attribute])for(b=0;b<this.Yf.length;b++)if(this.Yf[b].fg()===a)return this.Yf[b];return null};a.Hd.prototype.tBa=function(a){for(var b=0;b<this.Yf.length;b++){var d=this.Yf[b].fg();if(a.hasOwnProperty(d)&&a[d]===d)return this.Yf[b]}return null};a.Hd.prototype.eBa=function(){return this.Yf&&0<this.Yf.length?this.Yf[0].az():null};a.Hd.prototype.Dra=function(a){return this.aX(a,0,this.Yf.length-1)};a.Hd.prototype.aX=function(a,
b,d){if(b>d)return null;var e=Math.floor((b+d)/2),f=this.Yf[e],g=f.getStart();return g>a?this.aX(a,b,e-1):g+f.getExtent()-1<a?this.aX(a,e+1,d):f};a.Hd.prototype.lS=function(c,b,d){for(var e=0;e<this.Yf.length;e++)if(this.Yf[e].fg()===c)return this.Yf[e];c=new a.Hd(c,b,d,this);this.Yf.push(c);return c};a.Hd.prototype.Era=function(){var a={};a[this.az().attribute]=this.fg();return a};a.Hd.prototype.sda=function(a){for(var b=0;b<this.Yf.length;b++)if(this.Yf[b]===a){if(0<b)return this.Yf[b-1];break}return null};
a.si=function(c,b,d){this.Init();this.axis=b;this.mga=[];for(b=0;b<c.length;b++)this.mga.push(d.DS(c[b],this));this.wF=d;this.eh=new a.Hd(null,null,null,null)};o_("CubeAxis",a.si,a);a.f.xa(a.si,a.f,"oj.CubeAxis");a.si.prototype.Init=function(){a.si.O.Init.call(this)};a.si.prototype.Mq=function(){return this.mga};a.f.j("CubeAxis.prototype.getLevels",{Mq:a.si.prototype.Mq});a.si.prototype.getExtent=function(){return this.eh.getExtent()};a.f.j("CubeAxis.prototype.getExtent",{getExtent:a.si.prototype.getExtent});
a.si.prototype.Ws=function(a){for(var b=[],d=this.eh;d;)(d=d.Dra(a))&&b.push(d);return b};a.f.j("CubeAxis.prototype.getValues",{Ws:a.si.prototype.Ws});a.si.prototype.fm=function(a){a=a?JSON.parse(a):{};for(var b=this.eh,d=null;b;)d=b,b=b.Cra(a);return d?d.getStart():-1};a.f.j("CubeAxis.prototype.getIndex",{fm:a.si.prototype.fm});a.si.prototype.PJ=function(a,b){return this.F5(a,this.Mq().length-1,b)};a.si.prototype.F5=function(a,b,d){a=this.Ws(a);b=this.Mq()[b];for(var e=0;e<a.length;e++){var f=a[e];
f.az().fD()?d.kS(f.fg()):d.qT(f);if(f.az()===b)break}return d};a.si.prototype.h6=function(a,b){return this.wF.eA(this,0,this.eh,a,b,!0)};a.nj=function(a,b,d,e,f){this.Init();this.p={};this.p.value=a;this.p.oRa=b;this.p.FP=d;this.p.rows=e;this.p.dw=f};o_("CubeDataValue",a.nj,a);a.f.xa(a.nj,a.f,"oj.CubeDataValue");a.nj.prototype.Init=function(){a.nj.O.Init.call(this)};a.nj.prototype.fg=function(){switch(this.p.FP){case a.mj.STDDEV:return Math.sqrt(this.Vda());case a.mj.VARIANCE:return this.Vda();default:return this.p.value}};
a.f.j("CubeDataValue.prototype.getValue",{fg:a.nj.prototype.fg});a.nj.prototype.Dma=function(){return this.p.oRa};a.f.j("CubeDataValue.prototype.getIndices",{Dma:a.nj.prototype.Dma});a.nj.prototype.Sma=function(){return this.p.rows};a.f.j("CubeDataValue.prototype.getRows",{Sma:a.nj.prototype.Sma});a.nj.prototype.fma=function(){return this.p.FP};a.f.j("CubeDataValue.prototype.getAggregation",{fma:a.nj.prototype.fma});a.nj.prototype.Vda=function(){if(isNaN(this.p.dw))return NaN;var a=this.p.rows.length;
return 1<a?this.p.dw/(a-1):0};a.Ln=function(c,b){var d=b.row?b.row.start:0,e=b.row?b.row.count:0,f=b.column?b.column.start:0,g=b.column?b.column.count:0;a.u.Is(d,null);a.u.Is(e,null);a.u.Is(f,null);a.u.Is(g,null);this.wF=c;this.M0={row:d,column:f};this.eh=this.wF.Ws([{start:f,count:g},{start:d,count:e}]);g=(d=Array.isArray(this.eh))?this.eh.length:1;0<g&&(e=d?this.eh[0].length:1);this.uya={row:e,column:g}};o_("CubeCellSet",a.Ln,a);a.Ln.prototype.getData=function(a){var b=a.row;a=a.column;return(b=
Array.isArray(this.eh)?this.eh[a-this.M0.column][b-this.M0.row]:this.eh)?b.fg():null};a.f.j("CubeCellSet.prototype.getData",{getData:a.Ln.prototype.getData});a.Ln.prototype.getMetadata=function(a){var b={keys:{}};b.keys.row=this.eca(a,"row",2);b.keys.column=this.eca(a,"column",1);return b};a.f.j("CubeCellSet.prototype.getMetadata",{getMetadata:a.Ln.prototype.getMetadata});a.Ln.prototype.eca=function(c,b,d){var e=this.wF.Ss();return void 0!==c[b]&&e.length>=d?(d=new a.Mn,d=e[a.ad.raa(b)].PJ(c[b],d),
d.yw()[0].key):null};a.Ln.prototype.getStart=function(a){return this.M0[a]};a.f.j("CubeCellSet.prototype.getStart",{getStart:a.Ln.prototype.getStart});a.Ln.prototype.getCount=function(a){return this.uya[a]};a.f.j("CubeCellSet.prototype.getCount",{getCount:a.Ln.prototype.getCount});a.qj=function(c,b,d){this.Init();this.mu=d;this.tV();a.qj.O.constructor.call(this,c,b)};o_("DataValueAttributeCube",a.qj,a);a.f.xa(a.qj,a.Wb,"oj.DataValueAttributeCube");a.qj.prototype.Na=null;a.qj.prototype.Init=function(){a.qj.O.Init.call(this)};
a.qj.prototype.Nz=function(){a.qj.O.Nz.call(this)};a.qj.prototype.ES=function(a){return this.XA[a]};a.qj.prototype.DS=function(c,b){return c.dataValue?new a.gk(null,b,!0):new a.gk(c.attribute,b,!1)};a.qj.prototype.CS=function(c){return new a.qj(null,c,this.mu)};a.qj.prototype.eA=function(a,b,d,e,f,g){if(b>=a.Mq().length)return f;var k=a.Mq()[b];if(k.fD())return this.KIa(a,d,e,b,f);d=d.lS(e[k.attribute],null,k);g&&f.qT(d);return this.eA(a,b+1,d,e,f,g)};a.qj.prototype.KIa=function(a,b,d,e,f){for(var g=
!0,k=0;k<this.mu.length;k++){var l=this.mu[k].attribute,m=this.mu[k].label;d.hasOwnProperty(l)&&(m=b.lS(l,m,a.Mq()[e]),f.kS(l,d[l]),this.eA(a,e+1,m,d,f,g),g=!1)}return f};a.qj.prototype.tV=function(){this.XA=[];for(var c=0;c<this.mu.length;c++){var b=this.mu[c];this.XA[b.attribute]=b.aggregation?{AC:b.aggregation,fd:b.callback}:{AC:a.mj.SUM,fd:b.callback}}};a.Mn=function(){this.JZ=[];this.p=[]};a.Mn.prototype.qT=function(a){this.JZ.push(a)};a.Mn.prototype.kS=function(a,b){this.p.push({name:a,value:b})};
a.Mn.prototype.yw=function(){var a=[],b=this.cxa();if(0===this.p.length)a.push({key:JSON.stringify(b)});else for(var d=0;d<this.p.length;d++){var e=g.extend(!0,{},b);e[this.p[d].name]=this.p[d].name;a.push({key:JSON.stringify(e),Jla:this.p[d].name,value:this.p[d].value})}return a};a.Mn.prototype.cxa=function(){for(var a={},b=0;b<this.JZ.length;b++){var d=this.JZ[b].Era(),e;for(e in d)d.hasOwnProperty(e)&&(a[e]=d[e])}return a};a.Nh=function(a,b,d,e){this.wF=b;this.cF=a;this.Nk=void 0===d?0:d;this.sya=
void 0===e?this.cF.getExtent():Math.min(e,this.cF.getExtent()-d);this.Aba=d+e-1};o_("CubeHeaderSet",a.Nh,a);a.Nh.prototype.getData=function(a,b){var d=this.Ul(a,b);return d?d.M2():null};a.f.j("CubeHeaderSet.prototype.getData",{getData:a.Nh.prototype.getData});a.Nh.prototype.getMetadata=function(c,b){var d=new a.Mn,d=this.cF.F5(c,b,d);return(d=d.yw())&&0<d.length?{key:d[0].key}:null};a.f.j("CubeHeaderSet.prototype.getMetadata",{getMetadata:a.Nh.prototype.getMetadata});a.Nh.prototype.getLevelCount=
function(){return this.cF.Mq().length};a.f.j("CubeHeaderSet.prototype.getLevelCount",{getLevelCount:a.Nh.prototype.getLevelCount});a.Nh.prototype.getExtent=function(a,b){var d=this.Ul(a,b),e=d.getExtent(),d=d.getStart(),f=d+e-1,g=a<d+e-1;d<this.Nk&&(e-=this.Nk-d);f>this.Aba&&(e-=f-this.Aba);return{extent:e,more:{before:a>d,after:g}}};a.f.j("CubeHeaderSet.prototype.getExtent",{getExtent:a.Nh.prototype.getExtent});a.Nh.prototype.getDepth=function(a,b){return this.Ul(a,b).getDepth()};a.f.j("CubeHeaderSet.prototype.getDepth",
{getDepth:a.Nh.prototype.getDepth});a.Nh.prototype.getCount=function(){return this.sya};a.f.j("CubeHeaderSet.prototype.getCount",{getCount:a.Nh.prototype.getCount});a.Nh.prototype.getStart=function(){return this.Nk};a.f.j("CubeHeaderSet.prototype.getStart",{getStart:a.Nh.prototype.getStart});a.Nh.prototype.Ul=function(a,b){void 0===b&&(b=0);var d=this.cF.Ws(a);return d&&d.length>b?d[b]:null};a.ad=function(c){a.ad.O.constructor.call(this,c)};o_("CubeDataGridDataSource",a.ad,a);a.f.xa(a.ad,a.Dt,"oj.CubeDataGridDataSource");
a.ad.prototype.aqa=function(a){this.data=a;this.Vba()};a.f.j("CubeDataGridDataSource.prototype.setCube",{aqa:a.ad.prototype.aqa});a.ad.prototype.setPage=function(a){this.data.setPage(a);this.Vba()};a.f.j("CubeDataGridDataSource.prototype.setPage",{setPage:a.ad.prototype.setPage});a.ad.prototype.Vba=function(){this.handleEvent("change",{source:this,operation:"refresh"})};a.ad.prototype.getCount=function(a){return(a=this.as(a))?a.getExtent():0};a.f.j("CubeDataGridDataSource.prototype.getCount",{getCount:a.ad.prototype.getCount});
a.ad.prototype.getCountPrecision=function(){return"exact"};a.f.j("CubeDataGridDataSource.prototype.getCountPrecision",{getCountPrecision:a.ad.prototype.getCountPrecision});a.ad.prototype.fetchHeaders=function(c,b,d){var e=new a.Nh(this.as(c.axis),this.data,c.start,c.count);b.success.call(d?d.success:void 0,e,c)};a.f.j("CubeDataGridDataSource.prototype.fetchHeaders",{fetchHeaders:a.ad.prototype.fetchHeaders});a.ad.prototype.fetchCells=function(c,b,d){for(var e={},f=0;f<c.length;f++){var g=void 0===
c[f].start?0:c[f].start;if("row"===c[f].axis){var k=void 0===c[f].count?this.data.Ss()[1].getExtent():c[f].count;e.row={start:g,count:k}}"column"===c[f].axis&&(k=void 0===c[f].count?this.data.Ss()[0].getExtent():c[f].count,e.column={start:g,count:k})}e=new a.Ln(this.data,e);b.success.call(d?d.success:void 0,e,c)};a.f.j("CubeDataGridDataSource.prototype.fetchCells",{fetchCells:a.ad.prototype.fetchCells});a.ad.prototype.keys=function(a){var b={},b=this.Ec(a,"row",b),b=this.Ec(a,"column",b);return Promise.resolve(b)};
a.f.j("CubeDataGridDataSource.prototype.keys",{keys:a.ad.prototype.keys});a.ad.prototype.Ec=function(c,b,d){var e=this.as(b);c=c[b];var f=new a.Mn,f=e?e.PJ(c,f):"";d[b]=f.yw()[0].key;return d};a.ad.prototype.indexes=function(a){var b={},b=this.Hi(a,"row",b),b=this.Hi(a,"column",b);return Promise.resolve(b)};a.f.j("CubeDataGridDataSource.prototype.indexes",{indexes:a.ad.prototype.indexes});a.ad.prototype.Hi=function(a,b,d){d[b]=this.as(b).fm(a[b]);return d};a.ad.prototype.sort=function(){a.u.Ke()};
a.f.j("CubeDataGridDataSource.prototype.sort",{sort:a.ad.prototype.sort});a.ad.prototype.move=function(){a.u.Ke()};a.f.j("CubeDataGridDataSource.prototype.move",{move:a.ad.prototype.move});a.ad.prototype.moveOK=function(){return"invalid"};a.f.j("CubeDataGridDataSource.prototype.moveOK",{moveOK:a.ad.prototype.moveOK});a.ad.prototype.getCapability=function(a){switch(a){case "sort":return"none";case "move":return"none"}return null};a.f.j("CubeDataGridDataSource.prototype.getCapability",{getCapability:a.ad.prototype.getCapability});
a.ad.raa=function(a){return"row"===a?1:0};a.ad.prototype.as=function(c){c=a.ad.raa(c);var b=this.data.Ss();return b.length>c?b[c]:null};a.pj=function(c,b,d){this.Init();this.mu=d;this.tNa=d.valueAttr;this.ZGa=d.labelAttr;var e=d.defaultAggregation;this.Saa=e?a.pj.vBa(e):{AC:a.mj.SUM};this.fV=d.aggregation;this.tV();a.pj.O.constructor.call(this,c,b)};o_("DataColumnCube",a.pj,a);a.f.xa(a.pj,a.Wb,"oj.DataColumnCube");a.pj.prototype.Init=function(){a.pj.O.Init.call(this)};a.pj.prototype.Nz=function(){a.pj.O.Nz.call(this)};
a.pj.prototype.ES=function(a){return this.XA[a]?this.XA[a]:this.Saa};a.pj.prototype.CS=function(c){return new a.pj(null,c,this.mu)};a.pj.prototype.DS=function(c,b){return c.attribute===this.ZGa?new a.gk(c.attribute,b,!0):new a.gk(c.attribute,b,!1)};a.pj.prototype.eA=function(a,b,d,e,f,g){if(b>=a.Mq().length)return f;var k=a.Mq()[b],l=e[k.attribute];d=d.lS(l,null,k);k.fD()?f.kS(l,e[this.tNa]):f.qT(d);return this.eA(a,b+1,d,e,f,g)};a.pj.vBa=function(c){return a.Ra.od(c)?{AC:c}:{AC:c.aggregation,fd:c.callback}};
a.pj.prototype.tV=function(){this.XA=[];if(this.fV)for(var a=0;a<this.fV.length;a++){var b=this.fV[a],d=b.aggregation;this.XA[b.value]=d?{AC:d,fd:b.callback}:this.Saa}};a.gk=function(a,b,d){this.Init();this.attribute=a;this.a$=b;this.axis=b.axis;this.Raa=d};o_("CubeLevel",a.gk,a);a.f.xa(a.gk,a.f,"oj.CubeLevel");a.gk.prototype.Init=function(){a.gk.O.Init.call(this)};a.gk.prototype.fg=function(a){if(a=this.a$.Ws(a))for(var b=0;b<a.length;b++)if(a[b].az()===this)return a[b];return null};a.f.j("CubeLevel.prototype.getValue",
{fg:a.gk.prototype.fg});a.gk.prototype.fD=function(){return this.Raa};a.f.j("CubeLevel.prototype.isDataValue",{fD:a.gk.prototype.fD});a.gk.prototype.Raa=!1;a.gk.prototype.a$=null});