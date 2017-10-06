/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojcomponentcore","ojs/ojdvt-base","ojs/internal-deps/dvt/DvtNBox"],function(a,g,c,b,d){a.ab("oj.ojNBox",g.oj.dvtBaseComponent,{widgetEventPrefix:"oj",qh:function(a,b,c){return d.NBox.newInstance(a,b,c)},Gl:function(a){var b=a.subId;if("oj-nbox-cell"==b)b="cell["+a.row+","+a.column+"]";else if("oj-nbox-dialog"==b)b="dialog";else if("oj-nbox-dialog-close-button"==b)b="dialog#closeButton";else if("oj-nbox-dialog-node"==b)b="dialog#node["+a.index+"]";else if("oj-nbox-group-node"==
b)b=a.row&&a.column?"cell["+a.row+","+a.column+"]#groupNode[":"groupNode[",b+=a.groupCategory+"]";else if("oj-nbox-node"==b){var c,b="";c=a.id;var d=this.Ha.getAutomation();c&&d?c=d.getNodeIndexFromId(c):(c=a.index,a.row&&a.column&&(b="cell["+a.row+","+a.column+"]#"));b+="node["+c+"]"}else"oj-nbox-overflow"==b?b="cell["+a.row+","+a.column+"]#overflow":"oj-nbox-tooltip"==b&&(b="tooltip");return b},xi:function(a){var b={};if(0==a.indexOf("node")){b.subId="oj-nbox-node";a=this.Jl(a);var c=this.Ha.getAutomation();
c&&(b.id=c.getNodeIdFromIndex(a))}else if(0==a.indexOf("cell")){var c=this.EK(a),d=c.indexOf(",");b.row=c.substring(0,d);b.column=c.substring(d+1);c=a.indexOf("#");0<a.indexOf("#groupNode")?(b.subId="oj-nbox-group-node",b.groupCategory=this.EK(a.substring(c))):0<a.indexOf("#overflow")?b.subId="oj-nbox-overflow":b.subId="oj-nbox-cell"}else 0==a.indexOf("dialog")?0<a.indexOf("#closeButton")?b.subId="oj-nbox-dialog-close-button":b.subId="oj-nbox-dialog":0==a.indexOf("groupNode")?(b.subId="oj-nbox-group-node",
b.groupCategory=this.EK(a)):"tooltip"==a&&(b.subId="oj-nbox-tooltip");return b},rg:function(){var a=this._super();a.push("oj-nbox");return a},ok:function(){var a=this._super();a["oj-nbox-columns-title"]={path:"styleDefaults/columnsTitleStyle",property:"CSS_TEXT_PROPERTIES"};a["oj-nbox-rows-title"]={path:"styleDefaults/rowsTitleStyle",property:"CSS_TEXT_PROPERTIES"};a["oj-nbox-column-label"]={path:"styleDefaults/columnLabelStyle",property:"CSS_TEXT_PROPERTIES"};a["oj-nbox-row-label"]={path:"styleDefaults/rowLabelStyle",
property:"CSS_TEXT_PROPERTIES"};a["oj-nbox-cell"]={path:"styleDefaults/cellDefaults/style",property:"CSS_BACKGROUND_PROPERTIES"};a["oj-nbox-cell oj-minimized"]={path:"styleDefaults/cellDefaults/minimizedStyle",property:"CSS_BACKGROUND_PROPERTIES"};a["oj-nbox-cell oj-maximized"]={path:"styleDefaults/cellDefaults/maximizedStyle",property:"CSS_BACKGROUND_PROPERTIES"};a["oj-nbox-cell-label"]={path:"styleDefaults/cellDefaults/labelStyle",property:"CSS_TEXT_PROPERTIES"};a["oj-nbox-cell-countlabel"]={path:"styleDefaults/cellDefaults/bodyCountLabelStyle",
property:"CSS_TEXT_PROPERTIES"};a["oj-nbox-cell-countlabel oj-nbox-cell-header"]={path:"styleDefaults/cellDefaults/countLabelStyle",property:"CSS_TEXT_PROPERTIES"};a["oj-nbox-node"]={path:"styleDefaults/nodeDefaults/color",property:"background-color"};a["oj-nbox-node oj-hover"]={path:"styleDefaults/nodeDefaults/hoverColor",property:"border-color"};a["oj-nbox-node oj-selected"]={path:"styleDefaults/nodeDefaults/selectionColor",property:"border-color"};a["oj-nbox-node-label"]={path:"styleDefaults/nodeDefaults/labelStyle",
property:"CSS_TEXT_PROPERTIES"};a["oj-nbox-node-secondarylabel"]={path:"styleDefaults/nodeDefaults/secondaryLabelStyle",property:"CSS_TEXT_PROPERTIES"};a["oj-nbox-node-categorylabel"]={path:"styleDefaults/__categoryNodeDefaults/labelStyle",property:"CSS_TEXT_PROPERTIES"};a["oj-nbox-dialog"]=[{path:"styleDefaults/__drawerDefaults/background",property:"background-color"},{path:"styleDefaults/__drawerDefaults/borderColor",property:"border-color"}];a["oj-nbox-dialog-label"]={path:"styleDefaults/__drawerDefaults/labelStyle",
property:"CSS_TEXT_PROPERTIES"};a["oj-nbox-dialog-countlabel"]={path:"styleDefaults/__drawerDefaults/countLabelStyle",property:"CSS_TEXT_PROPERTIES"};return a},Il:function(){return["optionChange"]},xj:function(){var a=this.options.translations,b=this._super();b["DvtUtilBundle.NBOX"]=a.componentName;b["DvtNBoxBundle.HIGHLIGHTED_COUNT"]=a.highlightedCount;b["DvtNBoxBundle.OTHER"]=a.labelOther;b["DvtNBoxBundle.GROUP_NODE"]=a.labelGroup;b["DvtNBoxBundle.SIZE"]=a.labelSize;b["DvtNBoxBundle.ADDITIONAL_DATA"]=
a.labelAdditionalData;return b},Em:function(a){if("adfPropertyChange"===a.type){a=a.properties;for(var b in a){var c=a[b];"_drawer"==b?this.options[b]=c?{id:c}:null:"maximizedRow"!=b&&"maximizedColumn"!=b||this.Ue(b,c)}}else this._super(a)},Yn:function(){null==this.options._resources&&(this.options._resources={});var b=this.options._resources;b.overflow_dwn={src:a.qa.tb("resources/internal-deps/dvt/nbox/overflow_dwn.png"),width:34,height:9};b.overflow_ovr={src:a.qa.tb("resources/internal-deps/dvt/nbox/overflow_ovr.png"),
width:34,height:9};b.overflow_ena={src:a.qa.tb("resources/internal-deps/dvt/nbox/overflow_ena.png"),width:34,height:9};b.overflow_dis={src:a.qa.tb("resources/internal-deps/dvt/nbox/overflow_dis.png"),width:34,height:9};b.close_dwn={src:a.qa.tb("resources/internal-deps/dvt/nbox/close_dwn.png"),width:16,height:16};b.close_ovr={src:a.qa.tb("resources/internal-deps/dvt/nbox/close_ovr.png"),width:16,height:16};b.close_ena={src:a.qa.tb("resources/internal-deps/dvt/nbox/close_ena.png"),width:16,height:16}},
getNodeBySubId:function(a){return this._super(a)},getSubIdByNode:function(a){return this._super(a)},getRowsTitle:function(){var a=this.Ha.getAutomation();return a?a.getData("rowsTitle"):null},getRowCount:function(){var a=this.Ha.getAutomation();return a?a.getData("rowCount"):null},getRow:function(a){var b=this.Ha.getAutomation();return b?b.getData("row",a):null},getColumnsTitle:function(){var a=this.Ha.getAutomation();return a?a.getData("columnsTitle"):null},getColumnCount:function(){var a=this.Ha.getAutomation();
return a?a.getData("columnCount"):-1},getColumn:function(a){var b=this.Ha.getAutomation();return b?b.getData("column",a):null},getCell:function(a,b){var c=this.Ha.getAutomation(),d=c?c.getCell(a,b):null;d&&(d.getGroupNode=function(a){return c.getCellGroupNode(d,a)},d.getNode=function(a){return c.getCellNode(d,a)});return d},getGroupBehavior:function(){var a=this.Ha.getAutomation();return a?a.getData("groupBehavior"):null},getGroupNode:function(a){return this.Ha.getAutomation().getGroupNode(a)},getDialog:function(){var a=
this.Ha.getAutomation(),b=a?a.getDialog():null;b&&(b.getNode=function(b){return a.getDialogNode(b)});return b},getContextByNode:function(a){return(a=this.getSubIdByNode(a))&&"oj-nbox-tooltip"!==a.subId&&"oj-nbox-dialog-close-button"!==a.subId&&"oj-nbox-overflow"!==a.subId?a:null},Hl:function(){return{root:["cells","rows","columns","nodes"]}}});a.U.ob("oj-n-box","dvtBaseComponent",{properties:{animationOnDataChange:{type:"string",enumValues:["auto","none"]},animationOnDisplay:{type:"string",enumValues:["auto",
"none"]},cellContent:{type:"string",enumValues:["counts","auto"]},cellMaximize:{type:"string",enumValues:["off","on"]},cells:{type:"Array\x3cobject\x3e"},columns:{type:"Array\x3cobject\x3e"},columnsTitle:{type:"string"},countLabel:{},groupAttributes:{type:"Array\x3cstring\x3e"},groupBehavior:{type:"string",enumValues:["acrossCells","none","withinCell"]},hiddenCategories:{type:"Array\x3cstring\x3e",writeback:!0},highlightedCategories:{type:"Array\x3cstring\x3e",writeback:!0},highlightMatch:{type:"string",
enumValues:["any","all"]},hoverBehavior:{type:"string",enumValues:["dim","none"]},labelTruncation:{type:"string",enumValues:["ifRequired","on"]},maximizedColumn:{type:"string",writeback:!0},maximizedRow:{type:"string",writeback:!0},nodes:{type:"Array\x3cobject\x3e"},otherColor:{type:"string"},otherThreshold:{type:"number"},rows:{type:"Array\x3cobject\x3e"},rowsTitle:{type:"string"},selection:{type:"Array\x3cstring\x3e",writeback:!0},selectionMode:{type:"string",enumValues:["none","single","multiple"]},
styleDefaults:{type:"object",properties:{animationDuration:{type:"number"},cellDefaults:{type:"object",properties:{labelHalign:{type:"string",enumValues:["center","end","start"]},labelStyle:{type:"object"},showCount:{type:"string",enumValues:["on","off","auto"]},svgStyle:{type:"object"}}},columnLabelStyle:{type:"object"},columnsTitleStyle:{type:"object"},hoverBehaviorDelay:{type:"number"},nodeDefaults:{type:"object",properties:{borderColor:{type:"string"},borderWidth:{type:"number"},color:{type:"string"},
iconDefaults:{type:"object",properties:{borderColor:{type:"string"},borderRadius:{type:"string"},borderWidth:{type:"number"},color:{type:"string"},height:{type:"number"},opacity:{type:"number"},pattern:{type:"string",enumValues:"smallChecker smallCrosshatch smallDiagonalLeft smallDiagonalRight smallDiamond smallTriangle largeChecker largeCrosshatch largeDiagonalLeft largeDiagonalRight largeDiamond largeTriangle none".split(" ")},shape:{type:"string"},source:{type:"string"},width:{type:"number"}}},
indicatorColor:{type:"string"},indicatorIconDefaults:{type:"object",properties:{borderColor:{type:"string"},borderRadius:{type:"string"},borderWidth:{type:"number"},color:{type:"string"},height:{type:"number"},opacity:{type:"number"},pattern:{type:"string",enumValues:"smallChecker smallCrosshatch smallDiagonalLeft smallDiagonalRight smallDiamond smallTriangle largeChecker largeCrosshatch largeDiagonalLeft largeDiagonalRight largeDiamond largeTriangle none".split(" ")},shape:{type:"string"},source:{type:"string"},
width:{type:"number"}}},labelStyle:{type:"object"},secondaryLabelStyle:{type:"object"}}},rowLabelStyle:{type:"object"},rowsTitleStyle:{type:"object"}}},tooltip:{type:"object",properties:{renderer:{}}},touchResponse:{type:"string",enumValues:["touchStart","auto"]},translations:{properties:{componentName:{type:"string"},highlightedCount:{type:"string"},labelAdditionalData:{type:"string"},labelGroup:{type:"string"},labelOther:{type:"string"},labelSize:{type:"string"}}}},events:{},methods:{getCell:{},
getColumn:{},getColumnCount:{},getColumnsTitle:{},getContextByNode:{},getDialog:{},getGroupBehavior:{},getGroupNode:{},getRow:{},getRowCount:{},getRowsTitle:{}},extension:{mb:"ojNBox"}});a.U.register("oj-n-box",{metadata:a.U.getMetadata("oj-n-box")})});