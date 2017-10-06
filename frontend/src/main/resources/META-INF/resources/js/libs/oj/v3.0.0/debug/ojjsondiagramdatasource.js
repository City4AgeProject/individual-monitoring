/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'ojs/ojdatasource-common'], function(oj)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

///////////// JsonDiagramDataSource //////////////////   

/**
 * @export
 * @class oj.JsonDiagramDataSource
 * @extends oj.DiagramDataSource
 * @classdesc JSON implementation of the oj.DiagramDataSource
 * @param {Object} data JSON data object with following properties:
 * <table>
 * <tbody>
 * <tr><td><b>nodes</b></td><td>An optional array of nodes</td></tr>
 * <tr><td><b>links</b></td><td>An optional array of links</td></tr>
 * </tbody>
 * </table>
 * @param {Object=} options the options set on this data source
 * @param {Function=} options.childData Function callback to retrieve nodes and links for the specified parent.
 *                      Function will return a Promise that resolves into an object with the following structure:</p>
 * <table>
 * <tbody>
 * <tr><td><b>nodes</b></td><td>An array of objects for the child nodes for the given parent</td></tr>
 * <tr><td><b>links</b></td><td>An array of objects for the links for the given parent</td></tr>
 * </tbody>
 * </table>
 * @constructor
 */
oj.JsonDiagramDataSource = function(data, options) {
    this.childDataCallback = options ? options['childData'] : null;
    this._nodesMapById = {};
    oj.JsonDiagramDataSource.superclass.constructor.call(this, data);
};

// Subclass from oj.DiagramDataSource
oj.Object.createSubclass(oj.JsonDiagramDataSource, oj.DiagramDataSource, "oj.JsonDiagramDataSource");

/**
 * Returns child data for the given parent.
 * The data include all immediate child nodes along with links whose endpoints
 * both descend from the current parent node. 
 * If all the links are available upfront, they can be returned as part of the
 * top-level data (since all nodes descend from the diagram root).
 * If lazy-fetching links is desirable, the most
 * optimal way to return links is as part of the data of the
 * nearest common ancestor of the link's endpoints.
 *
 * @param {Object|null} parentData An object that contains data for the parent node.
 *                     If parentData is null, the method retrieves data for top level nodes.
 * @return {Promise} Promise resolves to a component object with the following structure:<p>
 * <table>
 * <tbody>
 * <tr><td><b>nodes</b></td><td>An array of objects for the child nodes for the given parent</td></tr>
 * <tr><td><b>links</b></td><td>An array of objects for the links for the given parent</td></tr>
 * </tbody>
 * </table>
 * @export
 * @method
 * @name getData
 * @memberof! oj.JsonDiagramDataSource
 * @instance
 */
oj.JsonDiagramDataSource.prototype.getData = function(parentData) {
  if (parentData) { //retrieve child data
    var childData = parentData['nodes'];
    if (childData === undefined && this.childDataCallback) {
      childData = this.childDataCallback(parentData);
      this._updateLocalData(this._nodesMapById[parentData['id']], childData);
      return childData;
    }
    else {
      this._updateNodesMap({'nodes': childData});
      return Promise.resolve({'nodes': childData});
    }
  }
  else { // retrieve top level data
    if (this.data) {
      this._updateNodesMap(this.data);
      return Promise.resolve(this.data);
    }
    else if (this.childDataCallback){
      var childData = this.childDataCallback();
      this._updateLocalData(null, childData);
      return childData;
    }
    else {
      return Promise.resolve(null);
    }
  }
};

/**
 * Internal method that updates a map of nodes that is used to improve performace
 * @param {Object} data data that might contain diagram nodes
 * @private
 */
oj.JsonDiagramDataSource.prototype._updateNodesMap = function(data) {
  // if callback for additional data is not specified - no need to keep map of nodes
  if (!this.childDataCallback || !data['nodes'])
    return;
  var nodes = data['nodes'];
  for (var i = 0; i < nodes.length; i++) {
    this._nodesMapById[nodes[i]['id']] = nodes[i];
  }
};

/**
 * Internal method that updates local data copy
 * @param {Object} parentData parent node that has to be updated
 * @param {Promise} childData
 * @private
 */
oj.JsonDiagramDataSource.prototype._updateLocalData = function(parentData, childData) {
  if (childData instanceof Promise) {
    var thisRef = this;
    childData.then(
      function(data) {
        if (Array.isArray(data['nodes'])) {
          if (parentData) {
            parentData['nodes'] = data['nodes'];
          }
          else {
            thisRef.data['nodes'] = data['nodes'];
          }
          thisRef._updateNodesMap(data);
        }
        if (Array.isArray(data['links'])) {
          thisRef.data['links'] = Array.isArray(thisRef.data['links']) ? 
                                  thisRef.data['links'].concat(data['links']) : data['links'];
        }
        thisRef.handleEvent('ADD', {'data':data, 
                                    'parentId':parentData ? parentData['id'] : null,
                                    'index':0});
      },
      function(reason) {}
    );
  }
};

/**
 * Retrieves number of child nodes
 * @param {Object} nodeData A data object for the node in question.
 *                          See node properties section.
 * @return {number} Number of child nodes if child count is available.
 *                  The method returns 0 for leaf nodes.
 *                  The method returns -1 if the child count is unknown
 *                  (e.g. if the children have not been fetched).
 * @export
 * @method
 * @name getChildCount
 * @memberof! oj.JsonDiagramDataSource
 * @instance
 */
oj.JsonDiagramDataSource.prototype.getChildCount= function(nodeData) {
  if (nodeData) {
    var childData = nodeData['nodes'];
    var count = Array.isArray(childData) ? childData.length :
                childData === undefined && this.childDataCallback ? -1 :
                0;
    return count;
  }
  return -1;
};

/**
 * Indicates whether the specified object contains links
 * that should be discovered in order to display promoted links.
 *
 * @param {Object} nodeData A data object for the container node in question.
 *                          See node properties section.
 * @return {string} the valid values are "connected", "disjoint", "unknown"
 * @export
 * @method
 * @name getDescendantsConnectivity
 * @memberof! oj.JsonDiagramDataSource
 * @instance
 */
oj.JsonDiagramDataSource.prototype.getDescendantsConnectivity = function(nodeData){
  return "unknown";
};

});
