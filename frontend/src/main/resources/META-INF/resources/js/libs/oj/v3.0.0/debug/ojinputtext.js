/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojeditablevalue'], 
       /*
        * @param {Object} oj 
        * @param {jQuery} $
        */
       function(oj, $)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.inputBase
 * @augments oj.editableValue
 * @abstract
 * @since 0.6
 * 
 * @classdesc
 * <h3 id="inputBaseOverview-section">
 *   Abstract inputBase component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputBaseOverview-section"></a>
 * </h3>
 * 
 * <p>Description: The inputBase component takes care of general needs of other input components [i.e. text + password]
 * 
 * @param {Object=} options a map of option-value pairs to set on the component
 */
oj.__registerWidget("oj.inputBase", $['oj']['editableValue'], 
{
  version : "1.0.0", 
  widgetEventPrefix : "oj",
  
  /**
   * Convenience Array which one can extend to set the attribute to a mandatory value if it doesn't exist or is set to something else 
   * [
   * {
   *    "attr"              : string - attribute associated to the task
   *    "setMandatory"      : value it must be set to [i.e. type="text"]
   * }
   * ]
   * 
   * Examples:
   * 1) [{"attr": "type", "setMandatory": "text"}]
   * 
   * @expose
   * @private
   */
  _ATTR_CHECK : [],
  
  /** 
   * Class names to be applied to this.element()
   * 
   * @expose
   * @private
   */
  _CLASS_NAMES : "",
  
  /** 
   * Class names to be applied to this.widget()
   * 
   * Note that if this value is defined then the this.element will be wrapped with a root dom element
   * 
   * @expose
   * @private
   */
  _WIDGET_CLASS_NAMES : "",
  
  /** 
   * Class names to be applied to the dom that wraps the input and trigger elements. It is a child
   * of the root dom element - this.widget().
   * 
   * An element can be wrapped by a root dom element OR by both a root dom element and this extra
   * wrapper dom. the time and date pickers have two wrappers since we want to do an extra
   * wrapping when an input has trigger elements (date icon, for example). This is needed so we
   * can add extra dom to the root dom element for inline messaging.
   * 
   * @expose
   * @private
   */
  _ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES : "",
  
  /** 
   * Array to be used for oj.EditableValueUtils.initializeOptionsFromDom
   * attribute is the html-5 dom attribute name. If option is different, like in the case of 
    readonly (readonly html vs readOnly (camelcase) component option), specify both attribute and option.
   * @expose
   * @private
   */
  _GET_INIT_OPTIONS_PROPS: [{attribute: 'disabled', validateOption: true},
                            {attribute: 'pattern'},
                            {attribute: 'placeholder'},
                            {attribute: 'value'},
                            {attribute: 'readonly', option: 'readOnly', 
                             validateOption: true},
                            {attribute: 'required', coerceDomValue: true, validateOption: true},
                            {attribute: 'title'}],
  
  /**
   * If defined will append a div element containing text to be read out by Jaws when focus is placed on the input element 
   * and the value will be used to locate the translated text to be read out by Jaws.
   * 
   * Note the component must also be wrapped
   * Used in conjunction with the above variable. Used to locate the translated text to be read out by Jaws
   * 
   * @expose
   * @private
   */
  _INPUT_HELPER_KEY: "",
  
  _BLUR_HANDLER_KEY: "blur",
  _KEYDOWN_HANDLER_KEY: "keydown",
  _KEYUP_HANDLER_KEY: "keyup",
  _INPUT_HANDLER_KEY: "input",
  _DROP_HANDLER_KEY: "drop",
  
  options : 
  {
    /** 
     * a converter instance that duck types {@link oj.Converter}. Or an object literal containing 
     * the following properties. 
     * <p>
     * When <code class="prettyprint">converter</code> option changes due to programmatic 
     * intervention, the component performs various tasks based on the current state it is in. </br>
     * 
     * <h4>Steps Performed Always</h4>
     * <ul>
     * <li>Any cached converter instance is cleared and new converter created. The converter hint is 
     * pushed to messaging. E.g., notewindow displays the new hint(s).
     * </li>
     * </ul>
     * 
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if component is valid when <code class="prettyprint">converter</code> option changes, the 
     * display value is refreshed.</li>
     * <li>if component is invalid and is showing messages -
     * <code class="prettyprint">messagesShown</code> option is non-empty, when 
     * <code class="prettyprint">converter</code> option changes, then all messages generated by the 
     * component are cleared and full validation run using its current display value. 
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code> 
     *   option is not updated, and the errors pushed to <code class="prettyprint">messagesShown</code>
     *   option. The display value is not refreshed in this case. </li>
     *   <li>if no errors result from the validation, <code class="prettyprint">value</code> 
     *   option is updated; page author can listen to the <code class="prettyprint">optionChange</code> 
     *   event on the <code class="prettyprint">value</code> option to clear custom errors. The 
     *   display value is refreshed with the formatted value provided by converter.</li>
     * </ul>
     * </li>
     * <li>if component is invalid and has deferred messages -  
     * <code class="prettyprint">messagesHidden</code> option is non-empty, when 
     * <code class="prettyprint">converter</code> option changes, then the display value is 
     * refreshed with the formatted value provided by converter.</li>
     * </ul>
     * </p>
     * 
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>When component messages are cleared in the cases described above, messages created by 
     * the component that are present in both <code class="prettyprint">messagesHidden</code> and 
     * <code class="prettyprint">messagesShown</code> options are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> option is not cleared. Page authors can 
     * choose to clear it explicitly when setting the converter option.</li>
     * </ul>
     * </p>
     * 
     * @property {string} type - the converter type registered with the oj.ConverterFactory. 
     * Supported types are 'number' and 'datetime'. See {@link oj.ConverterFactory} for details. <br/>
     * E.g., <code class="prettyprint">{converter: {type: 'number'}</code>
     * @property {Object=} options - optional Object literal of options that the converter expects. 
     * See {@link oj.IntlNumberConverter} for options supported by the number converter. See 
     * {@link oj.IntlDateTimeConverter} for options supported by the date time converter. <br/>
     * E.g., <code class="prettyprint">{converter: {type: 'number', options: {style: 'decimal'}}</code>
     * 
     * @example <caption>Initialize the component with a number converter instance:</caption>
     * // Initialize converter instance using currency options
     * var options = {style: 'currency', 'currency': 'USD', maximumFractionDigits: 0};
     * var numberConverterFactory = oj.Validation.converterFactory("number");
     * var salaryConverter = numberConverterFactory.createConverter(options);<br/>
     * // set converter instance using converter option
     * $(".selector").ojFoo({ // Foo is InputText, InputPassword, TextArea
     *   value: 25000, 
     *   converter: salaryConverter
     * });
     * 
     * @example <caption>Initialize the component with converter object literal:</caption>
     * $(".selector").ojFoo({ // Foo is InputText, InputPassword, TextArea
     *   value: new Date(),
     *   converter: {
     *     type: 'datetime', 
     *     options : {
     *       formatType: 'date', 
     *       dateFormat: 'long'
     *     }
     *   }
     * });
     * 
     * @expose 
     * @access public
     * @instance
     * @memberof! oj.inputBase
     * @type {Object|undefined}
     */    
    converter: undefined,    
    
    /**
     * The placeholder text to set on the element. Though it is possible to set placeholder 
     * attribute on the element itself, the component will only read the value when the component
     * is created. Subsequent changes to the element's placeholder attribute will not be picked up 
     * and page authors should update the option directly.
     * 
     * @example <caption>Initialize the component with the <code class="prettyprint">placeholder</code> option:</caption>
     * &lt;!-- Foo is InputText, InputPassword, TextArea -->
     * &lt;input id="userId" data-bind="ojComponent: {component: 'ojFoo', placeholder: 'User Name'}" /&gt;
     * 
     * @example <caption>Initialize <code class="prettyprint">placeholder</code> option from html attribute:</caption>
     * &lt;!-- Foo is InputText, InputPassword, TextArea -->
     * &lt;input id="userId" data-bind="ojComponent: {component: 'ojFoo'}" placeholder="User Name" /&gt;
     * 
     * // reading the placeholder option will return "User Name"
     * $(".selector").ojFoo("option", "placeholder"); // Foo is InputText, InputPassword, TextArea<br/>
     * 
     * @default when the option is not set, the element's placeholder attribute is used if it exists. 
     * If the attribute is not set and if a datetime converter is set then the converter hint is 
     * used. See displayOptions for details.
     * 
     * 
     * @expose 
     * @access public
     * @instance
     * @memberof! oj.inputBase
     * @type {string|null|undefined}
     */    
    placeholder: undefined,    
     /**
     * <p>The  <code class="prettyprint">rawValue</code> is the read-only option for retrieving 
     * the current value from the input field in text form.</p>
     * <p>
     * The <code class="prettyprint">rawValue</code> updates on the 'input' javascript event, 
     * so the <code class="prettyprint">rawValue</code> changes as the value of the input is changed. 
     * If the user types in '1,200' into the field, the rawValue will be '1', then '1,', then '1,2', 
     * ..., and finally '1,200'. Then when the user blurs or presses 
     * Enter the <code class="prettyprint">value</code> option gets updated.
     * </p>
     * <p>This is a read-only option so page authors cannot set or change it directly.</p>
     * @expose 
     * @access public
     * @instance
     * @default n/a
      * @memberof! oj.inputBase
     * @type {string|undefined}
     * @since 1.2
     * @readonly
     */
    rawValue: undefined,     
    /** 
     * Dictates component's readOnly state. Note that option value 
     * always supercedes element's attribute value and it is best practice to pass the value as an option than to 
     * set it as an element's attribute.
     * 
     * @example <caption>Initialize component with <code class="prettyprint">readOnly</code> option:</caption>
     * // Foo is InputText, InputPassword, TextArea, etc.
     * $(".selector").ojFoo({"readOnly": true});
     * 
     * @expose 
     * @type {boolean|undefined}
     * @default <code class="prettyprint">false</code>
     * @instance
     * @memberof! oj.inputBase
     */
    readOnly: false,
    /** 
     * Whether the component is required or optional. When required is set to true, an implicit 
     * required validator is created using the validator factory - 
     * <code class="prettyprint">oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED).createValidator()</code>.
     * 
     * Translations specified using the <code class="prettyprint">translations.required</code> option 
     * and the label associated with the component, are passed through to the options parameter of the 
     * createValidator method. 
     * 
     * <p>
     * When <code class="prettyprint">required</code> option changes due to programmatic intervention, 
     * the component may clear messages and run validation, based on the current state it's in. </br>
     *  
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if component is valid when required is set to true, then it runs deferred validation on 
     * the option value. This is to ensure errors are not flagged unnecessarily.
     * <ul>
     *   <li>if there is a deferred validation error, then 
     *   <code class="prettyprint">messagesHidden</code> option is updated. </li>
     * </ul>
     * </li>
     * <li>if component is invalid and has deferred messages when required is set to false, then 
     * component messages are cleared but no deferred validation is run.
     * </li>
     * <li>if component is invalid and currently showing invalid messages when required is set, then 
     * component messages are cleared and normal validation is run using the current display value. 
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code> 
     *   option is not updated and the error pushed to <code class="prettyprint">messagesShown</code>
     *   option. 
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code> 
     *   option is updated; page author can listen to the <code class="prettyprint">optionChange</code> 
     *   event on the <code class="prettyprint">value</code> option to clear custom errors.</li>
     * </ul>
     * </li>
     * </ul>
     * 
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the component are cleared. These include ones in 
     * <code class="prettyprint">messagesHidden</code> and <code class="prettyprint">messagesShown</code>
     *  options.</li>
     * <li><code class="prettyprint">messagesCustom</code> option is not cleared.</li>
     * </ul>
     * 
     * </p>
     * 
     * @ojvalue {boolean} false - implies a value is not required to be provided by the user. 
     * This is the default.
     * @ojvalue {boolean} true - implies a value is required to be provided by user and the 
     * input's label will render a required icon. Additionally a required validator - 
     * {@link oj.RequiredValidator} - is implicitly used if no explicit required validator is set. 
     * An explicit required validator can be set by page authors using the validators option. 
     * 
     * @example <caption>Initialize the component with the <code class="prettyprint">required</code> option:</caption>
     * $(".selector").ojFoo({required: true}); // Foo is InputText, InputPassword, TextArea, etc.<br/>
     * @example <caption>Initialize <code class="prettyprint">required</code> option from html attribute 'required':</caption>
     * &lt;input type="text" value= "foobar" required/><br/>
     * // retreiving the required option returns true
     * $(".selector").ojFoo("option", "required"); // Foo is InputText, InputPassword, TextArea, etc.<br/>
     * 
     * @example <caption>Customize messages and hints used by implicit required validator when 
     * <code class="prettyprint">required</code> option is set:</caption> 
     * &lt;!-- Foo is InputText, InputPassword, TextArea, etc. -->
     * &lt;input type="text" value="foobar" required data-bind="ojComponent: {
     *   component: 'ojFoo', 
     *   value: password, 
     *   translations: {'required': {
     *                 hint: 'custom: enter at least 3 alphabets',
     *                 messageSummary: 'custom: \'{label}\' is Required', 
     *                 messageDetail: 'custom: please enter a valid value for \'{label}\''}}}"/>
     * @expose 
     * @access public
     * @instance
     * @default when the option is not set, the element's required property is used as its initial 
     * value if it exists.
     * @memberof oj.inputBase
     * @type {boolean}
     * @default false
     * @since 0.7
     * @see #translations
     */
    required: false,
        /** 
     * List of validators used by component when performing validation. Each item is either an 
     * instance that duck types {@link oj.Validator}, or is an Object literal containing the 
     * properties listed below. Implicit validators created by a component when certain options 
     * are present (e.g. <code class="prettyprint">required</code> option), are separate from 
     * validators specified through this option. At runtime when the component runs validation, it 
     * combines the implicit validators with the list specified through this option. 
     * <p>
     * Hints exposed by validators are shown in the notewindow by default, or as determined by the 
     * 'validatorHint' property set on the <code class="prettyprint">displayOptions</code> 
     * option. 
     * </p>
     * 
     * <p>
     * When <code class="prettyprint">validators</code> option changes due to programmatic 
     * intervention, the component may decide to clear messages and run validation, based on the 
     * current state it is in. </br>
     * 
     * <h4>Steps Performed Always</h4>
     * <ul>
     * <li>The cached list of validator instances are cleared and new validator hints is pushed to 
     * messaging. E.g., notewindow displays the new hint(s).
     * </li>
     * </ul>
     *  
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if component is valid when validators changes, component does nothing other than the 
     * steps it always performs.</li>
     * <li>if component is invalid and is showing messages -
     * <code class="prettyprint">messagesShown</code> option is non-empty, when 
     * <code class="prettyprint">validators</code> changes then all component messages are cleared 
     * and full validation run using the display value on the component. 
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code> 
     *   option is not updated and the error pushed to <code class="prettyprint">messagesShown</code>
     *   option. 
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code> 
     *   option is updated; page author can listen to the <code class="prettyprint">optionChange</code> 
     *   event on the <code class="prettyprint">value</code> option to clear custom errors.</li>
     * </ul>
     * </li>
     * <li>if component is invalid and has deferred messages when validators changes, it does 
     * nothing other than the steps it performs always.</li>
     * </ul>
     * </p>
     * 
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the component are cleared.  These include ones in 
     * <code class="prettyprint">messagesHidden</code> and <code class="prettyprint">messagesShown</code>
     *  options.</li>
     * <li><code class="prettyprint">messagesCustom</code> option is not cleared.</li>
     * </ul>
     * </p>
     * 
     * @property {string} type - the validator type that has a {@link oj.ValidatorFactory} that can 
     * be retrieved using the {@link oj.Validation} module. For a list of supported validators refer 
     * to {@link oj.ValidatorFactory}. <br/>
     * E.g., <code class="prettyprint">{validators: [{type: 'regExp'}]}</code>
     * @property {Object=} options - optional Object literal of options that the validator expects. 
     * <br/>
     * E.g., <code class="prettyprint">{validators: [{type: 'regExp', options: {pattern: '[a-zA-Z0-9]{3,}'}}]}</code>

     * 
     * @example <caption>Initialize the component with validator object literal:</caption>
     * // Foo is InputText, InputPassword, TextArea, etc.
     * $(".selector").ojFoo({
     *   validators: [{
     *     type: 'length', 
     *     options: {min: 5, max: 10}
     *   }],
     * });
     * 
     * NOTE: oj.Validation.validatorFactory('numberRange') returns the validator factory that is used 
     * to instantiate a range validator for numbers.
     * 
     * @example <caption>Initialize the component with multiple validator instances:</caption>
     * var validator1 = new MyCustomValidator({'foo': 'A'}); 
     * var validator2 = new MyCustomValidator({'foo': 'B'});
     * // Foo is InputText, InputPassword, TextArea, etc.
     * $(".selector").ojFoo({
     *   value: "abc", 
     *   validators: [validator1, validator2]
     * });
     * 
     * @expose 
     * @access public
     * @instance
     * @memberof oj.inputBase
     * @type {Array|undefined}
     */    
    validators: undefined
  },
  
  /**
   * The base method needs to be overriden so that one can perform attribute check/set [i.e. ojInputText can only have type="text"] 
   * 
   * @protected
   * @override
   * @param {Object} element - jQuery selection to save attributes for
   * @instance
   * @memberof! oj.inputBase
   */
  _SaveAttributes : function (element)
  {
    var ret = this._superApply(arguments);
    
    this._processAttrCheck();
    
    return ret;
  },
  
  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.inputBase
   */
  _InitOptions: function(originalDefaults, constructorOptions)
  {
    this._super(originalDefaults, constructorOptions);
    oj.EditableValueUtils.initializeOptionsFromDom(this._GET_INIT_OPTIONS_PROPS, constructorOptions, this);    
  },

  /**
   * 1) Initializes the options
   * 2) If needed wraps the input element, 
   * 
   * @protected
   * @override
   * @instance
   * @memberof! oj.inputBase
   */
  _ComponentCreate : function()
  {
    var node = this.element, 
        ret = this._superApply(arguments),
        savedAttributes = this._GetSavedAttributes(node),
        readOnly = this.options['readOnly'];
    
    this._rtl = this._GetReadingDirection() === "rtl";
    
    // update element state using options
    if (typeof readOnly === "boolean") 
    {
      this.element.prop("readonly", readOnly);
    }
    
    if (this._DoWrapElement())
    {
      this._wrapElementInRootDomElement();
      // may need to do an extra wrapping if the element has triggers
      if (this._DoWrapElementAndTriggers())
      {
        this._WrapElement();
      }
      this._focusable({
        'element': this._wrapper, 
        'applyHighlight': true
      });
    }
    else
    {
      this._focusable({
        'element': this.element, 
        'applyHighlight': true
      });
    }

    
    // remove pattern attribute to not trigger html5 validation + inline bubble
//    if ('pattern' in savedAttributes)
//    {
//      node.removeAttr('pattern');
//    }
    
    this._defaultRegExpValidator = {};
    this._eventHandlers = null;
    return ret;
  },
  
  /**
   * 1) Updates component state based on the option values
   * 2) Adds the classname to the element [intentionally postponing till this process since the component might need to 
   *    reset this.element for some reason]
   * 3) Hooks up the blur handler
   * 4) If necessary appends an input helper to be read out by Jaws accessibility reader
   * 
   * @protected
   * @override
   * @instance
   * @memberof! oj.inputBase
   */        
  _AfterCreate : function () 
  {
    var ret = this._superApply(arguments),
        options = ["disabled", "readOnly"],
        self = this;
    
    this._refreshRequired(this.options['required']);
    
    if(this._CLASS_NAMES) 
    {
      this.element.addClass(this._CLASS_NAMES);
    }
    
    //attach handlers such as blur, keydown, and drop. placed in a function so to detach the handlers as well
    //when the options change
    this._attachDetachEventHandlers();
    
    this._AppendInputHelper();
    
    $.each(options, function(index, ele)
    {
      if(self.options[ele]) 
      {
        self._processDisabledReadOnly(ele, self.options[ele]);
      }
    });
    
    return ret;
  },
  /**
   * Whether the component is required.
   * 
   * @return {boolean} true if required; false
   * 
   * @memberof! oj.inputBase
   * @instance
   * @protected
   * @override
   */
  _IsRequired : function () 
  {
    return this.options['required'];
  },
  /**
   * Performs post processing after required option is set by taking the following steps.
   * 
   * - if component is invalid and has messgesShown -> required: false/true -> clear component errors; 
   * run full validation with UI value (we don't know if the UI error is from a required validator 
   * or something else);<br/>
   * &nbsp;&nbsp;- if there are validation errors, then value not pushed to model; messagesShown is 
   * updated<br/>
   * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to 
   * listen to optionChange(value) to clear custom errors.<br/>
   * 
   * - if component is invalid and has messagesHidden -> required: false -> clear component 
   * errors; no deferred validation is run.<br/>
   * - if component has no error -> required: true -> run deferred validation (we don't want to flag 
   * errors unnecessarily)<br/>
   * - messagesCustom is never cleared<br/>
   * 
   * @param {string} option
   * 
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _AfterSetOptionRequired : oj.EditableValueUtils._AfterSetOptionRequired,
  
  /**
   * When validators option changes, take the following steps.
   * 
   * - Clear the cached normalized list of all validator instances. push new hints to messaging.<br/>
   * - if component is valid -> validators changes -> no change<br/>
   * - if component is invalid has messagesShown -> validators changes -> clear all component 
   * messages and re-run full validation on displayValue. if there are no errors push value to 
   * model;<br/>
   * - if component is invalid has messagesHidden -> validators changes -> do nothing; doesn't change 
   * the required-ness of component <br/>
   * - messagesCustom is not cleared.<br/>
   * 
   * NOTE: The behavior applies to any option that creates implicit validators - min, max, pattern, 
   * etc. Components can call this method when these options change.
   * 
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _AfterSetOptionValidators : oj.EditableValueUtils._AfterSetOptionValidators,
  /**
   * Performs post processing after converter option changes by taking the following steps.
   * 
   * - always push new converter hint to messaging <br/>
   * - if component has no errors -> refresh UI value<br/>
   * - if component is invalid has messagesShown -> clear all component errors and run full 
   * validation using display value. <br/>
   * &nbsp;&nbsp;- if there are validation errors, value is not pushed to model; messagesShown is 
   * updated.<br/>
   * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to 
   * listen to optionChange(value) to clear custom errors.<br/>
   * - if component is invalid has messagesHidden -> refresh UI value. no need to run deferred 
   * validations. <br/>
   * - messagesCustom is never cleared<br/>
   * 
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _AfterSetOptionConverter : oj.EditableValueUtils._AfterSetOptionConverter, 
  /**
   * Clears the cached converter stored in _converter and pushes new converter hint to messaging.
   * Called when convterer option changes 
   * @memberof! oj.inputBase
   * @instance
   * @protected 
   */
  _ResetConverter : oj.EditableValueUtils._ResetConverter,  
  /**
   * Returns the normalized converter instance.
   * 
   * @return {Object} a converter instance or null
   * @memberof! oj.inputBase
   * @instance
   * @protected 
   */
  _GetConverter : oj.EditableValueUtils._GetConverter,    
  /**
   * This returns an array of all validators 
   * normalized from the validators option set on the component. <br/>
   * @return {Array} of validators. 
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _GetNormalizedValidatorsFromOption : oj.EditableValueUtils._GetNormalizedValidatorsFromOption,
  
  _processDisabledReadOnly : function (key, value) 
  {
    if (key === "disabled")
    {
      this.element.prop("disabled", value);
    }
    
    if (key === "readOnly")
    {
      this.element.prop("readonly", value);
      this._refreshStateTheming("readOnly", value);
    }
    
    if(key === "disabled" || key === "readOnly") 
    {
      this._attachDetachEventHandlers();
    }
  },
  
  /**
   * @ignore
   * @protected
   * @override
   */
  _setOption : function (key, value, flags)
  {
    var retVal = this._superApply(arguments);
    
    if(key === "disabled" || key === "readOnly") 
    {
      this._processDisabledReadOnly(key, value);
    }

    if (key === "pattern")
    {
      this._defaultRegExpValidator[oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP] = this._getImplicitRegExpValidator();
      this._AfterSetOptionValidators();
    }
    

    
    return retVal;
  },
  /**
   * Performs post processing after _SetOption() is called. Different options when changed perform
   * different tasks. See _AfterSetOption[OptionName] method for details.
   *
   * @param {string} option
   * @param {Object|string=} previous
   * @param {Object=} flags
   * @protected
   * @memberof! oj.inputBase
   * @instance
   */
  _AfterSetOption : function (option, previous, flags)
  {
    this._superApply(arguments);
    switch (option)
    {         
      case "readOnly":
        this._AfterSetOptionDisabledReadOnly(option, oj.EditableValueUtils.readOnlyOptionOptions);
        break;
      case "required":
        this._AfterSetOptionRequired(option);
        break;
      case "validators":
        this._AfterSetOptionValidators(option);
        break;
      case "converter":
        this._AfterSetOptionConverter(option);
        break;           
      default:
        break;
    }
  },
  /**
   * @ignore
   * @protected
   * @override
   */
  _destroy : function ()
  {
    var ret = this._superApply(arguments);

    this.element.off("blur drop keydown keyup input");
    
    if(this._inputHelper) 
    {
      this._inputHelper.remove();
    }
    
    if(this._DoWrapElement())
    {
      //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
      if (this._DoWrapElementAndTriggers())
        oj.DomUtils.unwrap(this.element, this._wrapper);
      else
        oj.DomUtils.unwrap(this.element);
    }
 
    return ret;
  },
  
  _attachDetachEventHandlers: function () 
  {
    
    if(!this.options["readOnly"] && !this.options["disabled"]) {
      
      this._eventHandlers = {};
      
      var blurHandler = $.proxy(this._onBlurHandler, this),
          keyDownHandler = $.proxy(this._onKeyDownHandler, this),
          keyUpHandler = $.proxy(this._onKeyUpHandler, this),
          inputHandler = $.proxy(this._onInputHandler, this),
          dropHandler = function() 
                        {
                          this.focus();
                        };
      
      this.element.on(this._BLUR_HANDLER_KEY, blurHandler);
      this.element.on(this._KEYDOWN_HANDLER_KEY, keyDownHandler);
      this.element.on(this._KEYUP_HANDLER_KEY, keyUpHandler);
      this.element.on(this._INPUT_HANDLER_KEY, inputHandler);
      
      //other than FF when a drop is dispatched focus is placed back on the element
      //this would cause difference in behavior of the observable change [as set within blur], so in order to provide
      //consisteny placing the focus on the element after the drop
      this.element.on(this._DROP_HANDLER_KEY, dropHandler);
      
      this._eventHandlers[this._BLUR_HANDLER_KEY] = blurHandler;
      this._eventHandlers[this._KEYDOWN_HANDLER_KEY] = keyDownHandler;
      this._eventHandlers[this._KEYUP_HANDLER_KEY] = keyUpHandler;
      this._eventHandlers[this._INPUT_HANDLER_KEY] = inputHandler;
      this._eventHandlers[this._DROP_HANDLER_KEY] = dropHandler;
    }
    else 
    {
      
      //meaning either it is readOnly or is disabled, remove the handlers if they were attached previously
      if(this._eventHandlers) 
      {
        var eventEntries = [this._BLUR_HANDLER_KEY, this._KEYDOWN_HANDLER_KEY, this._KEYUP_HANDLER_KEY,
          this._INPUT_HANDLER_KEY, this._DROP_HANDLER_KEY];
        
        for(var i=0, j=eventEntries.length; i < j; i++) 
        {
          if(this._eventHandlers[eventEntries[i]]) 
          {
            this.element.off(eventEntries[i], this._eventHandlers[eventEntries[i]]);
            delete this._eventHandlers[eventEntries[i]];
          }
        }
      }
    }
    
  },
  
   /**
   * when below listed options are passed to the component, corresponding CSS will be toggled
   * @private
   * @const
   * @type {Object}
   */
  _OPTION_TO_CSS_MAPPING: {
    "readOnly": "oj-read-only"
  }, 
  
  /**
   * Performs the attribute check/set by using _ATTR_CHECK variable [i.e. ojInputText must have type be set to "text"].
   * 
   * @private
   */
  _processAttrCheck : function ()
  {
    
    var attrCheck = this._ATTR_CHECK;
    
    for(var i=0, j=attrCheck.length; i < j; i++) 
    {
      var attr = attrCheck[i]["attr"],
          setMandatoryExists = "setMandatory" in attrCheck[i];
      
      //if it doesn't exist just have to check whether one should set it to a mandatory value
      if(setMandatoryExists)
      {
        this.element.attr(attr, attrCheck[i]["setMandatory"]);
      }
    }
  },
  
  /**
   * Invoked when blur is triggered of the this.element
   * 
   * @ignore
   * @protected
   * @param {Event} event
   */
  _onBlurHandler : function (event) 
  {
    this._SetValue(this._GetDisplayValue(), event);
  },
  
  /**
   * Invoked when keydown is triggered of the this.element
   * 
   * @ignore
   * @protected
   * @param {Event} event
   */
  _onKeyDownHandler : function (event) 
  {
  },

  /**
   * Invoked when keydown is triggered of the this.element
   * 
   * When of keyCode is of Enter, invoke _SetValue on it
   * 
   * @ignore
   * @protected
   * @param {Event} event
   */
  _onKeyUpHandler : function (event) 
  {
    if(event.keyCode === $.ui.keyCode.ENTER) 
    {
      this._SetValue(this._GetDisplayValue(), event);
    }
  },
    
  /**
   * Invoked when the input event happens
   * 
   * @ignore
   * @protected
   * @param {Event} event
   */
  _onInputHandler : function (event) 
  {
    this._SetRawValue(this._GetContentElement().val(), event);
  },
  
  /**
   * Whether the this.element should be wrapped in a root dom element. 
   * Method so that additional conditions can be placed
   * 
   * @ignore
   * @protected
   * @return {boolean}
   */
  _DoWrapElement : function ()
  {
    return this._WIDGET_CLASS_NAMES;
  },

  /**
   * Whether the this.element and triggers should be wrapped. 
   * Method so that additional conditions can be placed
   * 
   * @ignore
   * @protected
   * @return {boolean}
   */
  _DoWrapElementAndTriggers : function ()
  {
    return this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES;
  },
  
  /**
   * Wraps the this.element and adds _WIDGET_CLASS_NAMES classes to the wrapped element
   * 
   * @private
   */
  _wrapElementInRootDomElement : function () 
  {
    //@HTMLUpdateOK
    if (this.OuterWrapper) {
      this._wrapper = $(this.OuterWrapper).addClass(this._WIDGET_CLASS_NAMES);
      this._wrapper.append(this.element);
    } else {
      $(this.element).wrap( $("<div>").addClass(this._WIDGET_CLASS_NAMES) );
      this._wrapper = this.element.parent();
    }
  },
          
  /**
   * Wraps the this.element and adds _ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES classes to the wrapped element.
   * We might need this extra wrapper if the component has input+triggers (like inputDate).
   * 
   * @protected
   * @ignore
   * @return {jQuery}
   */
  _WrapElement : function () 
  {
    //@HTMLUpdateOK
    return $(this.element).wrap( $("<div>").addClass(this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES) ).parent();
  },
  
  /**
   * In some complex components [i.e. datepicker], when the input element receives focus we wish to have Jaws read 
   * out some content.
   * 
   * For those case does this method exist.
   *  
   * @protected
   * @instance
   * @memberOf !oj.inputBase
   */
  _AppendInputHelper : function ()
  {
    if(this._INPUT_HELPER_KEY && this._DoWrapElement()) 
    {
      var describedBy = this.element.attr("aria-describedby") || "",
          helperDescribedById = this._GetSubId(this._INPUT_HELPER_KEY);
      
      describedBy += " " + helperDescribedById;
      this.element.attr("aria-describedby", describedBy);
      this._inputHelper = $("<div class='oj-helper-hidden-accessible' aria-hidden='true' id='" + helperDescribedById + "'>" + this._EscapeXSS(this.getTranslatedString(this._INPUT_HELPER_KEY)) + "</div>");
      
      //@HTMLUpdateOK
      this._AppendInputHelperParent().append(this._inputHelper);
    }
  },
  
  /** 
   * Helper function to escape Cross site script text
   * 
   * @param {string} escapeMe
   * @return {jQuery|string}
   * @ignore
   */
  _EscapeXSS : function (escapeMe) 
  {
    return $("<span>" + escapeMe + "</span>").text();
  },
  
  /**
   * Which parent node the inputHelper should be appended to. Usually do not need to override.
   *  
   * @protected
   * @instance
   * @memberOf !oj.inputBase
   */
  _AppendInputHelperParent : function () 
  {
    return this.widget();
  },
  
  /**
   * Sets up the default regExp validator.
   * 
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.inputBase
   */
  _GetImplicitValidators : function ()
  {
    var ret = this._superApply(arguments);

    // register a default RegExp validator if we have a valid pattern
    if (this.options['pattern'])
    {
      // add validator to the special internalValidators list. These are validators created by 
      // the framework. We don't want these cleared using the option - 'validators'
      this._defaultRegExpValidator[oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP] = this._getImplicitRegExpValidator();
    }
    
    return $.extend(this._defaultRegExpValidator, ret);
  },
  /**
   * Whether the a value can be set on the component. For example, if the component is 
   * disabled or readOnly then setting value on component is a no-op. 
   * 
   * @see #_SetValue
   * @return {boolean}
   * @memberof! oj.inputBase
   * @override
   * @instance
   * @protected
   */
    _CanSetValue: function ()
    {
      var readOnly;
      var superCanSetValue = this._super();

      if (!superCanSetValue)
        return false;

      readOnly = this.options['readOnly'] || false;
      return (readOnly) ? false : true;
    },
    /**
   * Toggles css selector on the widget. E.g., when readOnly option changes, 
   * the oj-read-only selector needs to be toggled.
   * @param {string} option
   * @param {Object|string} value 
   * @private
   */        
  _refreshStateTheming : function (option, value)
  {
    if (Object.keys(this._OPTION_TO_CSS_MAPPING).indexOf(option) != -1) 
    {
      // value is a boolean
      this.widget().toggleClass(this._OPTION_TO_CSS_MAPPING[option], !!value);
    }
  },
  
  /**
   * Returns the regexp validator instance or creates it if needed and caches it.
   * @private
   */
  _getImplicitRegExpValidator : function ()
  {
    if (!this.options['pattern']) 
    {
      return null;
    }
    var regexpOptions = {'pattern': this.options['pattern'], 
                                   'label': this._getLabelText()};
    
    $.extend(regexpOptions, this.options['translations']['regexp'] || {});
    return oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP).createValidator(regexpOptions);
  },
  
  /**
   * This helper function will generate ids using widget's uuid as unique identifier for 
   * wai-aria and other necessary ids
   * 
   * @ignore
   * @protected
   * @param {string} sub
   * @return {string}
   */
  _GetSubId : function (sub)
  {
    return this["uuid"] + "_" + sub;
  },
  
  /**
   * @ignore
   * @protected
   * @return {boolean}
   */
  _IsRTL : function ()
  {
    return this._rtl;
  },
  
  /**
   * <p>Refreshes the component.
   *
   * @expose
   * @memberof oj.inputBase
   * @instance
   */
  refresh: function()
  {
    var retVal = this._superApply(arguments);
    
    this._rtl = this._GetReadingDirection() === "rtl";
    
    this._refreshRequired(this.options['required']);
     
    return retVal;
  },
  /**
   * @memberof! oj.inputBase
   * @instance
   * @private
   */
  _refreshRequired : oj.EditableValueUtils._refreshRequired, 

  getNodeBySubId: function(locator)
  {
    return this._super(locator);
  },

    
  /**
   * Validates the component's display value using the converter and all validators registered on 
   * the component and updates the <code class="prettyprint">value</code> option by performing the 
   * following steps. 
   * 
   * <p>
   * <ol> 
   * <li>All messages are cleared, including custom messages added by the app. </li>
   * <li>If no converter is present then processing continues to next step. If a converter is 
   * present, the UI value is first converted (i.e., parsed). If there is a parse error then 
   * the <code class="prettyprint">messagesShown</code> option is updated and method returns false.</li>
   * <li>If there are no validators setup for the component the <code class="prettyprint">value</code> 
   * option is updated using the display value and the method returns true. Otherwise all 
   * validators are run in sequence using the parsed value from the previous step. The implicit 
   * required validator is run first if the component is marked required. When a validation error is 
   * encountered it is remembered and the next validator in the sequence is run. </li>
   * <li>At the end of validation if there are errors, the <code class="prettyprint">messagesShown</code> 
   * option is updated and method returns false. If there were no errors, then the 
   * <code class="prettyprint">value</code> option is updated and method returns true.</li>
   * </ol>
   * 
   * @returns {boolean} true if component passed validation, false if there were validation errors.
   * 
   * @example <caption>Validate component using its current value.</caption>
   * // validate display value. 
   * $(.selector).ojInputText('validate');
   * 
   * @method
   * @access public
   * @expose
   * @instance
   * @memberof! oj.inputBase
   * @since 0.7
   */
  validate : oj.EditableValueUtils.validate,

  /**
   * Called to find out if aria-required is unsupported.
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _AriaRequiredUnsupported : function()
  {
    return false;
  },
  /**
   * Returns a <code class="prettyprint">jQuery</code> object containing the element visually 
   * representing the component, excluding the label associated with the it. 
   * 
   * <p>This method does not accept any arguments.</p>
   * 
   * @expose
   * @memberof! oj.inputBase
   * @instance
   * @return {jQuery} the root of the component
   * 
   * @example <caption>Invoke the <code class="prettyprint">widget</code> method:</caption>
   * var widget = $( ".selector" ).ojFoo( "widget" ); // Foo is InputText, InputPassword, TextArea
   */       
  widget : function () 
  {
    return this._DoWrapElement() ? this._wrapper : this.element;
  }

}, true);
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojInputPassword
 * @augments oj.inputBase
 * @since 0.6
 *
 * @classdesc
 * <h3 id="inputPasswordOverview-section">
 *   JET ojInputPassword Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputPasswordOverview-section"></a>
 * </h3>
 *
 * <p>Description: The ojInputPassword component enhances a browser input type="password" element.
 * <h3 id="pseudos-section">
 *   Pseudo-selectors
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
 * </h3>
 *
 * <pre class="prettyprint">
 * <code>$( ":oj-inputPassword" )            // selects all JET input on the page
 * </code>
 * </pre>
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate the label to the input component.
 * For inputPassword, you should put an <code>id</code> on the input, and then set
 * the <code>for</code> attribute on the label to be the input's id.
 * </p>
 * <h3 id="label-section">
 *   Label and InputPassword
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * For accessibility, you should associate a label element with the input
 * by putting an <code>id</code> on the input, and then setting the
 * <code>for</code> attribute on the label to be the input's id.
 * </p>
 * <p>
 * The component will decorate its associated label with required and help
 * information, if the <code>required</code> and <code>help</code> options are set.
 * </p>
 * <h3 id="binding-section">
 *   Declarative Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#binding-section"></a>
 * </h3>
 *
 * <pre class="prettyprint">
 * <code>
 *    &lt;input id="passwordId" data-bind="ojComponent: {component: 'ojInputPassword'}" /&gt;
 * </code>
 * </pre>
 *
 * @desc Creates or re-initializes a JET ojInputPassword
 *
 * @param {Object=} options a map of option-value pairs to set on the component
 *
 * @example <caption>Initialize the input element with no options specified:</caption>
 * $( ".selector" ).ojInputPassword();
 *
 * * @example <caption>Initialize the input element with some options:</caption>
 * $( ".selector" ).ojInputPassword( { "disabled": true } );
 *
 * @example <caption>Initialize the input element via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;input id="passwordId" data-bind="ojComponent: {component: 'ojInputPassword'}" /&gt;
 */
oj.__registerWidget("oj.ojInputPassword", $['oj']['inputBase'],
{
  version : "1.0.0",
  defaultElement : "<input>",
  widgetEventPrefix : "oj",

  /**
   * @expose
   * @private
   */
  _ATTR_CHECK : [{"attr": "type", "setMandatory": "password"}],

  /**
   * @expose
   * @private
   */
  _CLASS_NAMES : "oj-inputpassword-input",

  /**
   * @expose
   * @private
   */
  _WIDGET_CLASS_NAMES : "oj-inputpassword oj-form-control oj-component",

  options :
  {
    /**
     * Regular expression pattern which will be used to validate the component's value. Note that option value
     * always supercedes element's attribute value and it is best practice to pass the value as an option than to
     * set it as an element's attribute.
     * <p>
     * When pattern is set to true, an implicit regExp validator is created using the validator
     * factory -
     * <code class="prettyprint">oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP).createValidator()</code>.
     * </p>
     *
     * <p>
     * Note: It is recommended that the <code class="prettyprint">title</code> option be used to
     * describe the pattern expected for the value entered by end-user.
     * </p>
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">pattern</code> option:</caption>
     * $(".selector").ojInputPassword({pattern: "[a-zA-Z0-9]{3,}"});<br/>
     * @example <caption>Initialize <code class="prettyprint">pattern</code> option from the html attribute 'pattern':</caption>
     * &lt;input type="text" id="username" value= "" pattern="[a-zA-Z0-9]{3,}"
     *           title="Enter at least 3 alphanumeric characters"/><br/>
     * // reading the pattern option will return "[a-zA-Z0-9]{3,}"
     * $(".selector").ojInputPassword("option", "pattern");<br/>
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputPassword
     * @type {string|undefined}
     */
    pattern: ""

    // Events

    /**
     * Triggered when the ojInputPassword is created.
     *
     * @event
     * @name create
     * @memberof oj.ojInputPassword
     * @instance
     * @property {Event} event <code class="prettyprint">jQuery</code> event object
     * @property {Object} ui Currently empty
     *
     * @example <caption>Initialize the ojInputPassword with the <code class="prettyprint">create</code> callback specified:</caption>
     * $( ".selector" ).ojInputPassword({
     *     "create": function( event, ui ) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
     * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
     */
    // create event declared in superclass, but we still want the above API doc
  },

  getNodeBySubId: function(locator)
  {
    var node = this._superApply(arguments), subId;
    if (!node)
    {
      subId = locator['subId'];
      if (subId === "oj-inputpassword-input") {
        node = this.element ? this.element[0] : null;
      }
    }
    // Non-null locators have to be handled by the component subclasses
    return node || null;
  },

  /**
   * @override
   * @instance
   * @memberof! oj.ojInputPassword
   * @protected
   * @return {string}
   */
  _GetDefaultStyleClass : function ()
  {
    return "oj-inputpassword";
  }

});

// Fragments:

/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *    <tr>
 *       <td>Input</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Sets focus to input. If hints, title or messages exist in a notewindow,
 *       popup the notewindow.</td>
 *     </tr>
 *    {@ojinclude "name":"labelTouchDoc"}
 *   </tbody>
 *  </table>
 *
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputPassword
 */

 /**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>Tab In</kbd></td>
 *       <td>Set focus to the input. 
 *       If hints, title or messages exist in a notewindow, 
 *        pop up the notewindow.</td>
 *     </tr> 
 *     {@ojinclude "name":"labelKeyboardDoc"}   
 *   </tbody>
 * </table>
 *
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputPassword
 */


//////////////////     SUB-IDS     //////////////////
/**
 * <p>Sub-ID for the ojInputPassword component's input element.</p>
 *
 * @ojsubid oj-inputpassword-input
 * @memberof oj.ojInputPassword
 * @deprecated This sub-ID is not needed.  Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
 *
 * @example <caption>Get the node for the input element:</caption>
 * var node = $( ".selector" ).ojInputPassword( "getNodeBySubId", {'subId': 'oj-inputpassword-input'} );
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojTextArea
 * @augments oj.inputBase
 * @since 0.6
 *
 * @classdesc
 * <h3 id="textAreaOverview-section">
 *   JET ojTextArea Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#textAreaOverview-section"></a>
 * </h3>
 *
 * <p>Description: The ojTextArea component enhances a browser textarea element.
 * <h3 id="pseudos-section">
 *   Pseudo-selectors
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
 * </h3>
 *
 * <pre class="prettyprint">
 * <code>$( ":oj-textarea" )            // selects all JET textarea on the page
 * </code>
 * </pre>
  * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate the label to the textarea
 * component. For textarea, you should put an <code>id</code> on the textarea,
 * and then set the <code>for</code> attribute on the label to be the textarea's id.
 * </p>
 * <h3 id="label-section">
 *   Label and TextArea
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * For accessibility, you should associate a label element with the textarea
 * by putting an <code>id</code> on the textarea, and then setting the
 * <code>for</code> attribute on the label to be the textarea's id.
 * </p>
 * <p>
 * The component will decorate its associated label with required and help
 * information, if the <code>required</code> and <code>help</code> options are set.
 * </p>
 * <h3 id="binding-section">
 *   Declarative Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#binding-section"></a>
 * </h3>
 *
 * <pre class="prettyprint">
 * <code>
 *    &lt;textarea id="textAreaId" data-bind="ojComponent: {component: 'ojTextArea'}" &gt;&lt;/textarea&gt;
 * </code>
 * </pre>
 *
 * @desc Creates or re-initializes a JET ojTextArea.
 *
 * @param {Object=} options a map of option-value pairs to set on the component
 *
 * @example <caption>Initialize the textarea with no options specified:</caption>
 * $( ".selector" ).ojTextArea();
 *
 * * @example <caption>Initialize the textarea with some options:</caption>
 * $( ".selector" ).ojTextArea( { "disabled": true } );
 *
 * @example <caption>Initialize the textarea via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;textarea id="textAreaId" data-bind="ojComponent: {component: 'ojTextArea'}" &gt;&lt;/textarea&gt;
 */
oj.__registerWidget("oj.ojTextArea", $['oj']['inputBase'],
{
  version : "1.0.0",
  defaultElement : "<textarea>",
  widgetEventPrefix : "oj",

  /**
   * @expose
   * @private
   */
  _ATTR_CHECK : [],

  /**
   * @expose
   * @private
   */
  _CLASS_NAMES : "oj-textarea-input",

  /**
   * @expose
   * @private
   */
  _WIDGET_CLASS_NAMES : "oj-textarea oj-form-control oj-component",

  options :
  {
    /**
     * Regular expression pattern which will be used to validate the component's value. Note that
     * option value always supercedes element's attribute value and it is best practice to pass the
     * value as an option than to set it as an element's attribute.
     * <p>
     * When pattern is set to true, an implicit regExp validator is created using the validator
     * factory -
     * <code class="prettyprint">oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP).createValidator()</code>.
     * </p>
     *
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">pattern</code> option:</caption>
     * $(".selector").ojTextArea({pattern: "[a-zA-Z0-9]{3,}"});<br/>
     * @example <caption>Initialize <code class="prettyprint">pattern</code> option from the html attribute 'pattern':</caption>
     * &lt;input type="text" id="username" value= "" pattern="[a-zA-Z0-9]{3,}"
     *           title="Enter at least 3 alphanumeric characters"/><br/>
     * // reading the pattern option will return "[a-zA-Z0-9]{3,}"
     * $(".selector").ojTextArea("option", "pattern");<br/>
     *
     * @expose
     * @instance
     * @memberof! oj.ojTextArea
     * @type {string|undefined}
     */
    pattern: ""

    // Events

    /**
     * Triggered when the ojTextArea is created.
     *
     * @event
     * @name create
     * @memberof oj.ojTextArea
     * @instance
     * @property {Event} event <code class="prettyprint">jQuery</code> event object
     * @property {Object} ui Currently empty
     *
     * @example <caption>Initialize the ojTextArea with the <code class="prettyprint">create</code> callback specified:</caption>
     * $( ".selector" ).ojTextArea({
     *     "create": function( event, ui ) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
     * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
     */
    // create event declared in superclass, but we still want the above API doc
  },

  getNodeBySubId: function(locator)
  {
    var node = this._superApply(arguments), subId;
    if (!node)
    {
      subId = locator['subId'];
      if (subId === "oj-textarea-input") {
        node = this.element ? this.element[0] : null;
      }
    }
    // Non-null locators have to be handled by the component subclasses
    return node || null;
  },

  /**
   * @instance
   * @memberof! oj.ojTextArea
   * @override
   * @protected
   * @return {string}
   */
  _GetDefaultStyleClass : function ()
  {
    return "oj-textarea";
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojTextArea
   */
  _GetTranslationsSectionName: function()
  {
    return "oj-inputBase";
  }

});

  // Fragments:

	/**
	 * <table class="keyboard-table">
	 *   <thead>
	 *     <tr>
	 *       <th>Target</th>
	 *       <th>Gesture</th>
	 *       <th>Action</th>
	 *     </tr>
	 *   </thead>
	 *   <tbody>
	 *    <tr>
	 *       <td>TextArea</td>
	 *       <td><kbd>Tap</kbd></td>
	 *       <td>Sets focus to textarea. If hints, title or messages exist in a notewindow,
   *       popup the notewindow.</td>
	 *     </tr>
	 *    {@ojinclude "name":"labelTouchDoc"}
	 *   </tbody>
	 *  </table>
	 *
	 *
	 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
	 * @memberof oj.ojTextArea
	 */

   /**
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Target</th>
   *       <th>Key</th>
   *       <th>Action</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>TextArea</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the textarea. 
   *       If hints, title or messages exist in a notewindow, 
   *        pop up the notewindow.</td>
   *     </tr> 
   *     {@ojinclude "name":"labelKeyboardDoc"}   
   *   </tbody>
   * </table>
   *
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojTextArea
   */


//////////////////     SUB-IDS     //////////////////
/**
 * <p>Sub-ID for the ojTextArea component's textarea element.</p>
 * 
 * @ojsubid oj-textarea-input
 * @memberof oj.ojTextArea
 * @deprecated This sub-ID is not needed.  Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
 *
 * @example <caption>Get the node for the input element:</caption>
 * var node = $( ".selector" ).ojTextArea( "getNodeBySubId", {'subId': 'oj-textarea-input'} );
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojInputText
 * @augments oj.inputBase
 * @since 0.6
 *
 * @classdesc
 * <h3 id="inputTextOverview-section">
 *   JET ojInputText Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputTextOverview-section"></a>
 * </h3>
 *
 * <p>Description: The ojInputText component enhances a browser input type="text" element.
 * <h3 id="pseudos-section">
 *   Pseudo-selectors
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
 * </h3>
 *
 * <pre class="prettyprint">
 * <code>$( ":oj-inputText" )            // selects all JET input on the page
 * </code>
 * </pre>
  * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate the label to the input component.
 * For inputText, you should put an <code>id</code> on the input, and then set
 * the <code>for</code> attribute on the label to be the input's id.
 * </p>
 * <h3 id="label-section">
 *   Label and InputText
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * For accessibility, you should associate a label element with the input
 * by putting an <code>id</code> on the input, and then setting the
 * <code>for</code> attribute on the label to be the input's id.
 * </p>
 * <p>
 * The component will decorate its associated label with required and help
 * information, if the <code>required</code> and <code>help</code> options are set.
 * </p>
 * <h3 id="binding-section">
 *   Declarative Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#binding-section"></a>
 * </h3>
 *
 * <pre class="prettyprint">
 * <code>
 *    &lt;input id="textId" data-bind="ojComponent: {component: 'ojInputText'}" /&gt;
 * </code>
 * </pre>
 *
 * @desc Creates or re-initializes a JET ojInputText
 *
 * @param {Object=} options a map of option-value pairs to set on the component
 *
 * @example <caption>Initialize the input element with no options specified:</caption>
 * $( ".selector" ).ojInputText();
 *
 * * @example <caption>Initialize the input element with some options:</caption>
 * $( ".selector" ).ojInputText( { "disabled": true } );
 *
 * @example <caption>Initialize the input element via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;input id="textId" data-bind="ojComponent: {component: 'ojInputText'}" /&gt;
 */
oj.__registerWidget("oj.ojInputText", $['oj']['inputBase'],
{
  version : "1.0.0",
  defaultElement : "<input>",
  widgetEventPrefix : "oj",

  /**
   * @expose
   * @private
   */
  _ATTR_CHECK : [{"attr": "type", "setMandatory": "text"}],

  /**
   * @expose
   * @private
   */
  _CLASS_NAMES : "oj-inputtext-input",

  /**
   * @expose
   * @private
   */
  _WIDGET_CLASS_NAMES : "oj-inputtext oj-form-control oj-component",

  options :
  {
    /**
     * Regular expression pattern which will be used to validate the component's value. Note that option value
     * always supercedes element's attribute value and it is best practice to pass the value as an option than to
     * set it as an element's attribute.
     * <p>
     * When pattern is set to true, an implicit regExp validator is created using the validator
     * factory -
     * <code class="prettyprint">oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP).createValidator()</code>.
     * </p>
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">pattern</code> option:</caption>
     * $(".selector").ojInputText({pattern: "[a-zA-Z0-9]{3,}"});<br/>
     * @example <caption>Initialize <code class="prettyprint">pattern</code> option from the html attribute 'pattern':</caption>
     * &lt;input type="text" id="username" value= "" pattern="[a-zA-Z0-9]{3,}"
     *           title="Enter at least 3 alphanumeric characters"/><br/>
     * // reading the pattern option will return "[a-zA-Z0-9]{3,}"
     * $(".selector").ojInputText("option", "pattern");<br/>
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputText
     * @type {string|undefined}
     */
    pattern: ""

    // Events

    /**
     * Triggered when the ojInputText is created.
     *
     * @event
     * @name create
     * @memberof oj.ojInputText
     * @instance
     * @property {Event} event <code class="prettyprint">jQuery</code> event object
     * @property {Object} ui Currently empty
     *
     * @example <caption>Initialize the ojInputText with the <code class="prettyprint">create</code> callback specified:</caption>
     * $( ".selector" ).ojInputText({
     *     "create": function( event, ui ) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
     * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
     */
    // create event declared in superclass, but we still want the above API doc
  },

  getNodeBySubId: function(locator)
  {
    var node = this._superApply(arguments), subId;
    if (!node)
    {
      subId = locator['subId'];
      if (subId === "oj-inputtext-input") {
        node = this.element ? this.element[0] : null;
      }
    }
    // Non-null locators have to be handled by the component subclasses
    return node || null;
  },

  /**
   * @override
   * @instance
   * @memberof! oj.ojInputText
   * @protected
   * @return {string}
   */
  _GetDefaultStyleClass : function ()
  {
    return "oj-inputtext";
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputText
   */
  _GetTranslationsSectionName: function()
  {
    return "oj-inputBase";
  }

});

  // Fragments:

	/**
	 * <table class="keyboard-table">
	 *   <thead>
	 *     <tr>
	 *       <th>Target</th>
	 *       <th>Gesture</th>
	 *       <th>Action</th>
	 *     </tr>
	 *   </thead>
	 *   <tbody>
	 *    <tr>
	 *       <td>Input</td>
	 *       <td><kbd>Tap</kbd></td>
	 *       <td>Sets focus to input. If hints, title or messages exist in a notewindow,
   *       popup the notewindow.</td>
	 *     </tr>
	 *    {@ojinclude "name":"labelTouchDoc"}
	 *   </tbody>
	 *  </table>
	 *
	 *
	 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
	 * @memberof oj.ojInputText
	 */

   /**
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Target</th>
   *       <th>Key</th>
   *       <th>Action</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>Input</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the input. 
   *       If hints, title or messages exist in a notewindow, 
   *        pop up the notewindow.</td>
   *     </tr> 
   *     {@ojinclude "name":"labelKeyboardDoc"}   
   *   </tbody>
   * </table>
   *
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojInputText
   */

//////////////////     SUB-IDS     //////////////////
/**
 * <p>Sub-ID for the ojInputText component's input element.</p>
 * 
 * @ojsubid oj-inputtext-input
 * @memberof oj.ojInputText
 * @deprecated This sub-ID is not needed.  Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
 *
 * @example <caption>Get the node for the input element:</caption>
 * var node = $( ".selector" ).ojInputText( "getNodeBySubId", {'subId': 'oj-inputtext-input'} );
 */

(function() {
var inputBaseMeta = {
  "properties": {
    "converter": {
      "type": "Object"
    },
    "placeholder": {
      "type": "string"
    },
    "rawValue": {
      "type": "string",
      "readOnly": true,
      "writeback": true
    },
    "readonly": {
      "type": "boolean"
    },
    "required": {
      "type": "boolean"
    },
    "validators": {
      "type": "Array"
    }
  },
  "methods": {
    "refresh": {},
    "widget": {},
    "validate": {}
  },
  "extension": {
    _INNER_ELEM: 'input',
    _WIDGET_NAME: "inputBase"
  }
};
oj.CustomElementBridge.registerMetadata('inputBase', 'editableValue', inputBaseMeta);
})();

(function() {
var ojInputPasswordMeta = {
  "properties": {
    /*"pattern": {
      "type": "string"
    },*/
    "value": {
      "type": "string",
      "writeback": true
    }
  },
  "methods": {},
  "events": {
    "create": {},
    "destroy": {}
  },
  "extension": {
    _ALIASED_PROPS: {"readonly": "readOnly"},
    _INNER_ELEM: 'input',
    _WIDGET_NAME: "ojInputPassword",
    _TRANSFER_ATTRS: ['aria-label', 'autocomplete', 'autofocus', 'inputmode', 'name']
  }
};
oj.CustomElementBridge.registerMetadata('oj-input-password', 'inputBase', ojInputPasswordMeta);
oj.CustomElementBridge.register('oj-input-password', {'metadata': oj.CustomElementBridge.getMetadata('oj-input-password')});
})();

(function() {
var ojInputTextMeta = {
  "properties": {
    /*"pattern": {
      "type": "string"
    },*/
    "value": {
      "type": "string",
      "writeback": true
    }
  },
  "methods": {},
  "events": {
    "create": {},
    "destroy": {}
  },
  "extension": {
    _ALIASED_PROPS: {"readonly": "readOnly"},
    _INNER_ELEM: 'input',
    _WIDGET_NAME: "ojInputText",
    _TRANSFER_ATTRS: ['aria-label', 'autocomplete', 'autofocus', 'inputmode', 'list', 'name', 'spellcheck']
  }
};
oj.CustomElementBridge.registerMetadata('oj-input-text', 'inputBase', ojInputTextMeta);
oj.CustomElementBridge.register('oj-input-text', {'metadata': oj.CustomElementBridge.getMetadata('oj-input-text')});
})();

(function() {
var ojTextAreaMeta = {
  "properties": {
    /*"pattern": {
      "type": "string"
    },*/
    "value": {
      "type": "string",
      "writeback": true
    }
  },
  "methods": {},
  "events": {
    "create": {},
    "destroy": {}
  },
  "extension": {
    _ALIASED_PROPS: {"readonly": "readOnly"},
    _INNER_ELEM: 'textarea',
    _WIDGET_NAME: "ojTextArea",
    _TRANSFER_ATTRS: ['aria-label', 'autocomplete', 'autofocus', 'inputmode', 'name', 'spellcheck', 'rows']
  }
};
oj.CustomElementBridge.registerMetadata('oj-text-area', 'inputBase', ojTextAreaMeta);
oj.CustomElementBridge.register('oj-text-area', {'metadata': oj.CustomElementBridge.getMetadata('oj-text-area')});
})();
});
