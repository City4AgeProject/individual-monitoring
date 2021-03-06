/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'hammerjs', 'ojs/ojeditablevalue',
        'ojs/ojinputtext', 'ojs/ojvalidation-datetime', 'ojs/ojpopup', 'ojs/ojbutton', 'ojs/ojanimation'],
       function(oj, $, Hammer, compCore, inputText, validation)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/**
 * @private
 */
var _config = oj.ThemeUtils.parseJSONFromFontFamily('oj-datepicker-config') || {};

/**
 * @private
 */
var _matchMedia = (function() {
  var dateTimePickerDropDownThresholdWidth = _config['dateTimePickerDropDownThresholdWidth'];
  var queryString;
  if(dateTimePickerDropDownThresholdWidth)
  {
    queryString = "(min-width: " + dateTimePickerDropDownThresholdWidth + ")";
  }

  return window.matchMedia(queryString || oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP) || "(min-width: 768px)");
})();

/**
 * @private
 */
var _isLargeScreen = _matchMedia.matches;

window.addEventListener('resize', function() {
  _isLargeScreen = _matchMedia.matches;
}, false);

/**
 * @private
 */
function _getNativePickerDate(converter, isoString)
{
  isoString = converter.parse(isoString);

  var valueParams = oj.IntlConverterUtils._dateTime(isoString, ["date", "fullYear", "month", "hours", "minutes", "seconds"], true);
  var date = new Date();

  date.setFullYear(valueParams["fullYear"]);
  date.setDate(valueParams["date"]);
  date.setMonth(valueParams["month"]);
  date.setHours(valueParams["hours"]);
  date.setMinutes(valueParams["minutes"]);
  date.setSeconds(valueParams["seconds"]);
  date.setMilliseconds(0);

  return date;
}

/**
 * Placed here to avoid duplicate code for ojdatepicker + ojtimepicker
 *
 * Used for oj.EditableValueUtils.initializeOptionsFromDom
 *
 * @ignore
 */
function coerceIsoString(value)
{
  //reason for coersion is if one refreshes the page; then the input element's value might be the formatted string
  //thought about setting element's value to parsed value on destroy but goes against what destroy is suppose to do
  return this.options["converter"]["parse"](value);
}

/**
 * Placed here to avoid duplicate code for ojdatepicker + ojtimepicker
 *
 * @ignore
 */
function getImplicitDateTimeRangeValidator(options, converter, defaultStyleClass)
{
  var translationKeys = {'oj-inputdatetime': 'datetime', 'oj-inputtime': 'time', 'oj-inputdate': 'date'},
      dateTimeRangeTranslations = options['translations']['dateTimeRange'] || {},
          translations = [{'category': 'hint', 'entries': ['min', 'max', 'inRange']},
                          {'category': 'messageDetail', 'entries': ['rangeUnderflow', 'rangeOverflow']},
                          {'category': 'messageSummary', 'entries': ['rangeUnderflow', 'rangeOverflow']}],
          dateTimeRangeOptions = {'min': options['min'], 'max': options['max'], 'converter': converter,
                                  'translationKey': translationKeys[defaultStyleClass]};

  //note the translations are defined in ojtranslations.js, but it is possible to set it to null, so for sanity
  if(!$.isEmptyObject(dateTimeRangeTranslations))
  {
    for(var i=0, j=translations.length; i < j; i++)
    {
      var category = dateTimeRangeTranslations[translations[i]['category']];

      if(category)
      {
        var translatedContent = {},
            entries = translations[i]['entries'];

        for(var k=0, l=entries.length; k < l; k++)
        {
          translatedContent[entries[k]] = category[entries[k]];
        }

        dateTimeRangeOptions[translations[i]['category']] = translatedContent;
      }
    }
  }

  return oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE).createValidator(dateTimeRangeOptions);
}

/**
 * Shared for ojInputDate + ojInputTime
 *
 * @ignore
 */
function disableEnableSpan(children, val)
{
  var filteredChildren = children.filter("span");
  if (val)
  {
    filteredChildren.addClass("oj-disabled").removeClass("oj-enabled oj-default");
  }
  else
  {
    filteredChildren.removeClass("oj-disabled").addClass("oj-enabled oj-default");
  }
}

/**
 * For dayMetaData
 *
 * @ignore
 */
function _getMetaData(dayMetaData, position, params) {
  if(!dayMetaData || position === params.length) {
    return dayMetaData;
  }

  var nextPos = position + 1;
  return _getMetaData(dayMetaData[params[position]], nextPos, params) || _getMetaData(dayMetaData["*"], nextPos, params);
}

/**
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 *
 * @ignore
 */
function bindHover(dpDiv)
{
  var selector = ".oj-datepicker-prev-icon, .oj-datepicker-prev-icon .oj-clickable-icon-nocontext.oj-component-icon, .oj-datepicker-next-icon," +
    " .oj-datepicker-next-icon .oj-clickable-icon-nocontext.oj-component-icon, .oj-datepicker-calendar td a";
  return dpDiv.delegate(selector, "mouseout", function ()
  {
    $(this).removeClass("oj-hover");
  }).delegate(selector, "mouseover", function ()
  {
    $(this).addClass("oj-hover");
  }).delegate(selector, "focus", function ()
  {
    $(this).addClass("oj-focus");
  }).delegate(selector, "blur", function ()
  {
    $(this).removeClass("oj-focus");
  });
}

/**
 * Binds active state listener that set appropriate style classes. Used in
 * ojInputDate/ojInputDateTime/ojInputTime
 *
 * @ignore
 */
function bindActive(dateTime)
{
  var triggerRootContainer = $(dateTime.element[0]).parent().parent();

  // There are few issues in mobile using hover and active marker classes (iOS and Android, more
  // evident on iOS). Some fix is needed in _activeable(), tracking .
  dateTime._AddActiveable(triggerRootContainer);
}

/**
 * returns if the native picker is supported - depends on renderMode set to 'native' and this
 * cordova plugin being configured... https://github.com/VitaliiBlagodir/cordova-plugin-datepicker
 *
 * @ignore
 */
function isPickerNative(dateTime)
{
  // use bracket notation to avoid closure compiler renaming the variables
  return (dateTime.options['renderMode'] === "native" && window['cordova'] && window['datePicker']);
}

//to display the suffix for the year
var yearDisplay = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter(
{
  "year" : "numeric"
});

/*!
 * JET Input Date @VERSION
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundertion and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Depends:
 *  jquery.ui.widget.js
 */
/**
 * @ojcomponent oj.ojInputDate
 * @augments oj.inputBase
 * @since 0.6
 *
 * @classdesc
 * <h3 id="inputDateOverview-section">
 *   JET ojInputDate Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputDateOverview-section"></a>
 * </h3>
 *
 * <p>Description: ojInputDate provides basic support for datepicker selection.
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="pseudos-section">
 *   Pseudo-selectors
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
 * </h3>
 *
 * <pre class="prettyprint">
 * <code>$( ":oj-inputDate" )            // selects all JET input on the page
 * </code>
 * </pre>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate the label to the input component.
 * For inputDate, you should put an <code>id</code> on the input, and then set
 * the <code>for</code> attribute on the label to be the input's id.
 * </p>
 * <h3 id="label-section">
 *   Label and InputDate
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
 *    &lt;input id="dateId" data-bind="ojComponent: {component: 'ojInputDate'}" /&gt;
 * </code>
 * </pre>
 *
 * @desc Creates or re-initializes a JET ojInputDate
 *
 * @param {Object=} options a map of option-value pairs to set on the component
 *
 * @example <caption>Initialize the input element with no options specified:</caption>
 * $( ".selector" ).ojInputDate();
 *
 * @example <caption>Initialize the input element with some options:</caption>
 * $( ".selector" ).ojInputDate( { "disabled": true } );
 *
 * @example <caption>Initialize the input element via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;input id="dateId" data-bind="ojComponent: {component: 'ojInputDate'}" /&gt;
 */
oj.__registerWidget("oj.ojInputDate", $['oj']['inputBase'],
{
  widgetEventPrefix : "oj",

  //-------------------------------------From base---------------------------------------------------//
  _CLASS_NAMES : "oj-inputdatetime-input",
  _WIDGET_CLASS_NAMES : "oj-inputdatetime-date-only oj-component oj-inputdatetime",
  _ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES : "",
  _INPUT_HELPER_KEY: "inputHelp",
  _ATTR_CHECK : [{"attr": "type", "setMandatory": "text"}],
  _GET_INIT_OPTIONS_PROPS:  [{attribute: "disabled", validateOption: true},
                             {attribute: 'pattern'},
                             {attribute: "title"},
                             {attribute: "placeholder"},
                             {attribute: "value", coerceDomValue: coerceIsoString},
                             {attribute: "required",
                              coerceDomValue: true, validateOption: true},
                             {attribute: 'readonly', option: 'readOnly',
                             validateOption: true},
                             {attribute: "min", coerceDomValue: coerceIsoString},
                             {attribute: "max", coerceDomValue: coerceIsoString}],
  //-------------------------------------End from base-----------------------------------------------//

  _TRIGGER_CLASS : "oj-inputdatetime-input-trigger",
  _TRIGGER_CALENDAR_CLASS : "oj-inputdatetime-calendar-icon",

  _CURRENT_CLASS : "oj-datepicker-current-day",
  _DAYOVER_CLASS : "oj-datepicker-days-cell-over",
  _UNSELECTABLE_CLASS : "oj-datepicker-unselectable",

  _DATEPICKER_DIALOG_DESCRIPTION_ID : "oj-datepicker-dialog-desc",
  _DATEPICKER_DESCRIPTION_ID : "oj-datepicker-desc",
  _CALENDAR_DESCRIPTION_ID : "oj-datepicker-calendar",
  _MAIN_DIV_ID : "oj-datepicker-div",

  _INLINE_CLASS : "oj-datepicker-inline",
  _INPUT_CONTAINER_CLASS : " oj-inputdatetime-input-container",
  _INLINE_WIDGET_CLASS: " oj-inputdatetime-inline",

  _ON_CLOSE_REASON_SELECTION: "selection",  // A selection was made
  _ON_CLOSE_REASON_CANCELLED: "cancelled",  // Selection not made
  _ON_CLOSE_REASON_TAB: "tab",              // Tab key
  _ON_CLOSE_REASON_CLOSE: "close",          // Disable or other closes

  _KEYBOARD_EDIT_OPTION_ENABLED: "enabled",
  _KEYBOARD_EDIT_OPTION_DISABLED: "disabled",

  options :
  {
    /**
     * <p>
     * Note that Jet framework prohibits setting subset of options which are object types.<br/><br/>
     * For example $(".selector").ojInputDate("option", "datePicker", {footerLayout: "today"}); is prohibited as it will
     * wipe out all other sub-options for "datePicker" object.<br/><br/> If one wishes to do this [by above syntax or knockout] one
     * will have to get the "datePicker" object, modify the necessary sub-option and pass it to above syntax.<br/><br/>
     * Default values for the datePicker sub-options can also be overridden with the theming variable
     * <code class="prettyprint">$inputDateTimeDatePickerOptionDefault</code>, which is merged with other defaults.<br/><br/>
     * Note that all of the datePicker sub-options except showOn are not available when renderMode is 'native'.<br/><br/>
     *
     * The properties supported on the datePicker option are:
     *
     * @property {string=} footerLayout Will dictate what content is shown within the footer of the calendar. <br/><br/>
     * The default value is <code class="prettyprint">{datePicker: {footerLayout: "today"}}</code> with possible values being
     * <ul>
     *   <li>"" - Do not show anything</li>
     *   <li>"today" - the today button</li>
     * </ul>
     * <br/>
     * Example <code class="prettyprint">$(".selector").ojInputDate("option", "datePicker.footerLayout", "today");</code>
     *
     * @property {string=} changeMonth Whether the month should be rendered as a button to allow selection instead of text.<br/><br/>
     * The default value is <code class="prettyprint">{datePicker: {changeMonth: "select"}}</code> with possible values being
     * <ul>
     *  <li>"select" - As a button</li>
     *  <li>"none" - As a text</li>
     * </ul>
     * <br/>
     * Example <code class="prettyprint">$(".selector").ojInputDate("option", "datePicker.changeMonth", "none");</code>
     *
     * @property {string=} changeYear Whether the year should be rendered as a button to allow selection instead of text. <br/><br/>
     * The default value is <code class="prettyprint">{datePicker: {changeYear: "select"}}</code> with possible values being
     * <ul>
     *  <li>"select" - As a button</li>
     *  <li>"none" - As a text</li>
     * </ul>
     * <br/>
     * Example <code class="prettyprint">$(".selector").ojInputDate("option", "datePicker.changeYear", "none");</code>
     *
     * @property {number=} currentMonthPos The position in multipe months at which to show the current month (starting at 0). <br/><br/>
     * The default value is <code class="prettyprint">{datePicker: {currentMonthPos: 0}}</code> <br/><br/>
     * Example <code class="prettyprint">$(".selector").ojInputDate("option", "datePicker.currentMonthPos", 1);</code>
     *
     * @property {string=} daysOutsideMonth Dictates the behavior of days outside the current viewing month. <br/><br/>
     * The default value is <code class="prettyprint">{datePicker: {daysOutsideMonth: "hidden"}}</code> with possible values being
     * <ul>
     *  <li>"hidden" - Days outside the current viewing month will be hidden</li>
     *  <li>"visible" - Days outside the current viewing month will be visible</li>
     *  <li>"selectable" - Days outside the current viewing month will be visible + selectable</li>
     * </ul>
     * <br/>
     * Example <code class="prettyprint">$(".selector").ojInputDate("option", "datePicker.daysOutsideMonth", "visible");</code>
     *
     * @property {number=} numberOfMonths The number of months to show at once. Note that if one is using a numberOfMonths > 4 then one should define a CSS rule
     * for the width of each of the months. For example if numberOfMonths is set to 6 then one should define a CSS rule .oj-datepicker-multi-6 .oj-datepicker-group
     * providing the width each month should take in percentage.  <br/><br/>
     * The default value is <code class="prettyprint">{datePicker: {numberOfMonths: 1}}</code> <br/><br/>
     * Example <code class="prettyprint">$(".selector").ojInputDate("option", "datePicker.numberOfMonths", 2);</code>
     *
     * @property {string=} showOn When the datepicker should be shown. <br/><br/>
     * Possible values are
     * <ul>
     *  <li>"focus" - when the element receives focus or when the trigger calendar image is clicked. When the picker is closed, the field regains focus and is editable.</li>
     *  <li>"image" - when the trigger calendar image is clicked</li>
     * </ul>
     * <br/>
     * Example to initialize the inputDate with showOn option specified
     * <code class="prettyprint">$(".selector").ojInputDate("option", "datePicker.showOn", "focus");</code>
     * <br/>
     *
     * @property {string|number=} stepMonths How the prev + next will step back/forward the months. <br/><br/>
     * The default value is <code class="prettyprint">{datePicker: {stepMonths: "numberOfMonths"}}</code>
     * <ul>
     *  <li>"numberOfMonths" - Will use numberOfMonths option value as value</li>
     *  <li>number - Number of months to step back/forward</li>
     * </ul>
     * <br/>
     * Example <code class="prettyprint">$(".selector").ojInputDate("option", "datePicker.stepMonths", 2);</code>
     *
     * @property {number=} stepBigMonths Number of months to step back/forward for the (Alt + Page up) + (Alt + Page down) key strokes.  <br/><br/>
     * The default value is <code class="prettyprint">{datePicker: {stepBigMonths: 12}}</code><br/><br/>
     * Example <code class="prettyprint">$(".selector").ojInputDate("option", "datePicker.stepBigMonths", 3);</code>
     *
     * @property {string=} weekDisplay Whether week of the year will be shown.<br/><br/>
     * The default value is <code class="prettyprint">{datePicker: {weekDisplay: "none"}}</code>
     * <ul>
     *  <li>"number" - Will show the week of the year as a number</li>
     *  <li>"none" - Nothing will be shown</li>
     * </ul>
     * <br/>
     * Example <code class="prettyprint">$(".selector").ojInputDate("option", "datePicker.weekDisplay", "number");</code>
     *
     * @property {string=} yearRange The range of years displayed in the year drop-down: either relative to today's year ("-nn:+nn"),
     * relative to the currently selected year ("c-nn:c+nn"), absolute ("nnnn:nnnn"), or combinations of these formats ("nnnn:-nn"). <br/><br/>
     * The default value is <code class="prettyprint">{datePicker: {yearRange: "c-10:c+10"}}</code><br/><br/>
     * Example <code class="prettyprint">$(".selector").ojInputDate("option", "datePicker.yearRange", "c-5:c+10");</code>
     * </p>
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDate
     * @type {Object}
     *
     * @example <caption>Override defaults in the theme (SCSS) :</caption>
     * $inputDateTimeDatePickerOptionDefault: (footerLayout: 'today', weekDisplay: 'number') !default;
     */
    datePicker:
    {
      /**
       * @expose
       */
      footerLayout : "",  

      /**
       * @expose
       */
      changeMonth : "select",

      /**
       * @expose
       */
      changeYear : "select",

      /**
       * @expose
       */
      currentMonthPos : 0,

      /**
       * @expose
       */
      daysOutsideMonth : "hidden",

      /**
       * @expose
       */
      numberOfMonths : 1,

      /**
       * @expose
       */
      showOn : "focus",

      /**
       * @expose
       */
      stepMonths : "numberOfMonths",

      /**
       * @expose
       */
      stepBigMonths : 12,

      /**
       * @expose
       */
      weekDisplay : "none", // "number" to show week of the year, "none" to not show it

      /**
       * @expose
       */
      yearRange : "c-10:c+10" // Range of years to display in drop-down,
      // either relative to today's year (-nn:+nn), relative to currently displayed year
      // (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)

    },

    /**
     * A datetime converter instance that duck types {@link oj.DateTimeConverter}. Or an object literal
     * containing the properties listed below.
     *
     * The converter used for ojInputDate. Page authors can set a custom converter by creating one using the datetime converter factory
     * and providing custom options -
     * oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter(customOptions).
     *
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
     * <code class="prettyprint">converter</code> option changes then all component messages are
     * cleared and full validation run using the current display value on the component.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   option is not updated, and the error pushed to <code class="prettyprint">messagesShown</code>
     *   option. The display value is not refreshed in this case. </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   option is updated; page author can listen to the <code class="prettyprint">optionChange</code>
     *   event on the <code class="prettyprint">value</code> option to clear custom errors. The
     *   display value is refreshed with the formatted value provided by converter.</li>
     * </ul>
     * </li>
     * <li>if component is invalid and has deferred messages when converter option changes, the
     *   display value is again refreshed with the formatted value provided by converter.</li>
     * </ul>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the component are cleared. This includes both
     * <code class="prettyprint">messagesHidden</code> and <code class="prettyprint">messagesShown</code>
     *  options.</li>
     * <li><code class="prettyprint">messagesCustom</code> option is not cleared.</li>
     * </ul>
     * </p>
     *
     * @property {string} type - the converter type registered with the oj.ConverterFactory.
     * Usually 'datetime'. See {@link oj.DateTimeConverterFactory} for details. <br/>
     * E.g., <code class="prettyprint">{converter: {type: 'datetime'}</code>
     * @property {Object=} options - optional Object literal of options that the converter expects.
     * See {@link oj.IntlDateTimeConverter} for options supported by the jet datetime converter.
     * E.g., <code class="prettyprint">{converter: {type: 'datetime', options: {formatType: 'date'}}</code>
     *
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDate
     * @default <code class="prettyprint">oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter()</code>
     */
    converter : oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter(
    {
      "day" : "2-digit", "month" : "2-digit", "year" : "2-digit"
    }),

    /**
     * Determines if keyboard entry of the text is allowed.
     * When disabled the picker must be used to select a date.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">keyboardEdit</code> option:</caption>
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojInputDate', keyboardEdit: 'disabled'}" /&gt;
     * // Example to set the default in the theme (SCSS)
     * $inputDateTimeKeyboardEditOptionDefault: disabled !default;
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDate
     * @type {string}
     * @ojvalue {string} "enabled"  Allow keyboard entry of the date.
     * @ojvalue {string} "disabled" Changing the date can only be done with the picker.
     * @default Default value depends on the theme. In alta-android, alta-ios and alta-windows themes, the
     * default is <code class="prettyprint">"disabled"</code>
     * and it's <code class="prettyprint">"enabled"</code> for alta web theme.
     */
    keyboardEdit : "enabled",

    /**
     * The maximum selectable date. When set to null, there is no maximum.
     *
     * <ul>
     *  <li> type string - ISOString
     *  <li> null - no limit
     * </ul>
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">max</code> option:</caption>
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojInputDate', max: '2014-09-25'}" /&gt;
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDate
     * @default <code class="prettyprint">null</code>
     */
    max : undefined,

    /**
     * The minimum selectable date. When set to null, there is no minimum.
     *
     * <ul>
     *  <li> type string - ISOString
     *  <li> null - no limit
     * </ul>
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">min</code> option:</caption>
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojInputDate', min: '2014-08-25'}" /&gt;
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDate
     * @default <code class="prettyprint">null</code>
     */
    min : undefined,

    /**
     * <p>Attributes specified here will be set on the picker DOM element when it's launched.
     * <p>The supported attributes are <code class="prettyprint">class</code> and <code class="prettyprint">style</code>, which are appended to the picker's class and style, if any.
     * Note: 1) pickerAttributes is not applied in the native theme.
     * 2) setting this option after component creation has no effect.
     *
     * @example <caption>Initialize the inputDate specifying a set of attributes to be set on the picker DOM element:</caption>
     * $( ".selector" ).ojInputDate({ "pickerAttributes": {
     *   "style": "color:blue;",
     *   "class": "my-class"
     * }});
     *
     * @example <caption>Get the <code class="prettyprint">pickerAttributes</code> option, after initialization:</caption>
     * // getter
     * var inputDate = $( ".selector" ).ojInputDate( "option", "pickerAttributes" );
     *
     * @expose
     * @memberof! oj.ojInputDate
     * @instance
     * @type {?Object}
     * @default <code class="prettyprint">null</code>
     */
    pickerAttributes: null,

    /**
     * The renderMode option allows applications to specify whether to render date picker in JET or
     * as a native picker control.</br>
     *
     * Valid values: jet, native
     *
     * <ul>
     *  <li> jet - Applications get full JET functionality.</li>
     *  <li> native - Applications get the functionality of the native picker. Native picker is
     *  not available when the picker is inline, defaults to jet instead.</li></br>
     *  Note that the native picker support is limited to Cordova plugin published
     *  at 'https://github.com/VitaliiBlagodir/cordova-plugin-datepicker'.</br>
     *  With native renderMode, the functionality that is sacrificed compared to jet renderMode are:
     *    <ul>
     *      <li>Date picker cannot be themed</li>
     *      <li>Accessibility is limited to what the native picker supports</li>
     *      <li>pickerAttributes is not applied</li>
     *      <li>Sub-IDs are not available</li>
     *      <li>hide() function is no-op</li>
     *      <li>translations sub options pertaining to the picker is not available</li>
     *      <li>All of the 'datepicker' sub-options except 'showOn' are not available</li>
     *    </ul>
     * </ul>
     *
     * @expose
     * @memberof! oj.ojInputDate
     * @instance
     * @type {string}
     * @default value depends on the theme. In alta-android, alta-ios and alta-windows themes, the
     * default is "native" and it's "jet" for alta web theme.
     *
     * @example <caption>Get or set the <code class="prettyprint">renderMode</code> option for
     * an ojInputDate after initialization:</caption>
     * // getter
     * var renderMode = $( ".selector" ).ojInputDate( "option", "renderMode" );
     * // setter
     * $( ".selector" ).ojInputDate( "option", "renderMode", "native" );
     * // Example to set the default in the theme (SCSS)
     * $inputDateTimeRenderModeOptionDefault: native !default;
     */
    renderMode : "jet",

    /**
     * Additional info to be used when rendering the day
     *
     * This should be a JavaScript Function reference which accepts as its argument the following JSON format
     * {fullYear: Date.getFullYear(), month: Date.getMonth()+1, date: Date.getDate()}
     *
     * and returns null or all or partial JSON data of
     * {disabled: true|false, className: "additionalCSS", tooltip: 'Stuff to display'}
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDate
     * @type {Function}
     * @default <code class="prettyprint">null</code>
     */
    dayFormatter : null

    /**
     * Additional info to be used when rendering the day
     *
     * This should be in the following JSON format with the year, month, day based on Date.getFullYear(), Date.getMonth()+1, and Date.getDate():
     * {year: {month: {day: {disabled: true|false, className: "additionalCSS", tooltip: 'Stuff to display'}}}
     *
     * There also exists a special '*' character which represents ALL within that field [i.e. * within year, represents for ALL year].
     *
     * Note that this option will override the value of the dayFormatter option. Setting both dayFormatter and dayMetaData options is not supported.
     *
     * @expose
     * @name dayMetaData
     * @instance
     * @memberof! oj.ojInputDate
     * @default <code class="prettyprint">null</code>
     * @example <code class="prettyprint">{2013: {11: {25: {disabled: true, className: 'holiday', tooltip: 'Stuff to display'}, 5: {disabled: true}}}}}</code>
     */

    // DOCLETS
    /**
     * The placeholder text to set on the element. Though it is possible to set placeholder
     * attribute on the element itself, the component will only read the value when the component
     * is created. Subsequent changes to the element's placeholder attribute will not be picked up
     * and page authors should update the option directly.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">placeholder</code> option:</caption>
     * &lt;!-- Foo is InputDate, InputDateTime /&gt;
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojFoo', placeholder: 'Birth Date'}" /&gt;
     *
     * @example <caption>Initialize <code class="prettyprint">placeholder</code> option from html attribute:</caption>
     * &lt;!-- Foo is InputDate, InputDateTime /&gt;
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojFoo'}" placeholder="User Name" /&gt;
     *
     * @default when the option is not set, the element's placeholder attribute is used if it exists.
     * If the attribute is not set then the default can be the converter hint provided by the
     * datetime converter. See displayOptions for details.
     *
     * @access public
     * @instance
     * @expose
     * @name placeholder
     * @instance
     * @memberof! oj.ojInputDate
     */

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
     * @property {Object=} options - optional Object literal of options that the validator expects.
     *
     * @example <caption>Initialize the component with validator object literal:</caption>
     * $(".selector").ojInputDate({
     *   validators: [{
     *     type: 'dateTimeRange',
     *     options : {
     *       max: '2014-09-10',
     *       min: '2014-09-01'
     *     }
     *   }],
     * });
     *
     * NOTE: oj.Validation.validatorFactory('dateTimeRange') returns the validator factory that is used
     * to instantiate a range validator for dateTime.
     *
     * @example <caption>Initialize the component with multiple validator instances:</caption>
     * var validator1 = new MyCustomValidator({'foo': 'A'});
     * var validator2 = new MyCustomValidator({'foo': 'B'});
     * // Foo is InputText, InputNumber, Select, etc.
     * $(".selector").ojFoo({
     *   value: 10,
     *   validators: [validator1, validator2]
     * });
     *
     * @expose
     * @name validators
     * @instance
     * @memberof oj.ojInputDate
     * @type {Array|undefined}
     */

    /**
     * The value of the ojInputDate component which should be an ISOString.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">value</code> option:</caption>
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojInputDate', value: '2014-09-10'}" /&gt;
     * @example <caption>Initialize the component with the <code class="prettyprint">value</code> option specified programmatically
     * using oj.IntlConverterUtils.dateToLocalIso :</caption>
     * $(".selector").ojInputDate({'value': oj.IntlConverterUtils.dateToLocalIso(new Date())});<br/>
     * @example <caption>Get or set the <code class="prettyprint">value</code> option, after initialization:</caption>
     * // Getter: returns Today's date in ISOString
     * $(".selector").ojInputDate("option", "value");
     * // Setter: sets it to a different date
     * $(".selector").ojInputDate("option", "value", "2013-12-01");
     *
     * @expose
     * @name value
     * @instance
     * @memberof! oj.ojInputDate
     * @default When the option is not set, the element's value property is used as its initial value
     * if it exists. This value must be an ISOString.
     */

    // Events

    /**
     * Triggered when the ojInputDate is created.
     *
     * @event
     * @name create
     * @memberof oj.ojInputDate
     * @instance
     * @property {Event} event <code class="prettyprint">jQuery</code> event object
     * @property {Object} ui Currently empty
     *
     * @example <caption>Initialize the ojInputDate with the <code class="prettyprint">create</code> callback specified:</caption>
     * $( ".selector" ).ojInputDate({
     *     "create": function( event, ui ) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
     * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
     */
    // create event declared in superclass, but we still want the above API doc

  },

  /**
   * @ignore
   * @protected
   */
  _InitBase : function ()
  {
    this._triggerNode = null;
    this._inputContainer = null;
    this._redirectFocusToInputContainer = false;
    this._isMobile = false;

    //only case is when of showOn of focus and one hides the element [need to avoid showing]
    this._ignoreShow = false;

    // need this flag to keep track of native picker opened, there is no callback on native API
    //  to find out otherwise.
    this._nativePickerShowing = false;
    this._maxRows = 4;

    this._currentDay = 0;
    this._drawMonth = this._currentMonth = 0;
    this._drawYear = this._currentYear = 0;

    this._datePickerDefaultValidators = {};
    this._nativePickerConverter = null;

    var nodeName = this.element[0].nodeName.toLowerCase();
    this._isInLine = (nodeName === "div" || nodeName === "span");
    this._dpDiv = bindHover($('<div class="oj-datepicker-popup" style="display:none"><div id="' + this._GetSubId(this._MAIN_DIV_ID) + '" role="region" aria-describedby="' + 
      this._GetSubId(this._DATEPICKER_DESCRIPTION_ID) + '" class="oj-datepicker-content"></div></div>'));
    $("body").append(this._dpDiv); //@HTMLUpdateOK

    if(this._isInLine)
    {
      //if inline then there is no input element, so reset _CLASS_NAMES
      // TODO:Jmw trying to understand what to do in the case of inline. If it is dateTime inline, then I don't wrap the date part.
      // But if it is just date inline, I should... but the use case is probably not frequent.
      this._WIDGET_CLASS_NAMES += this._INLINE_WIDGET_CLASS;
      this._CLASS_NAMES = "";
    }
    else
    {
      //append input container class to be applied to the root node as well, since not inline
      //[note the special case where input container class will NOT be on the widget node is when
      //ojInputDateTime is of inline and ojInputTime places container around the input element]
      // jmw. this is now different. It's no longer on the widget. I add a new wrapper dom.
      // Ji will need to help me with this probably.
      // One thing I know I'm not doing is wrapping the calendar if only date. hmm...
      this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES += this._INPUT_CONTAINER_CLASS;
     
      var self = this;
      var animation = _isLargeScreen ? {"open": null, "close": null} : {"close": null};

      //DISABLE FOR NOW, as animation is coming quite clunky (not sure if the css of popup or of animation)
      animation = {"open": null, "close": null};
      this._popUpDpDiv = this._dpDiv.ojPopup({"initialFocus": "none",
                                              "role": "dialog",
                                              "modality": _isLargeScreen ? "modeless" : "modal",
                                              "open": function () {
                                                self._popUpDpDiv.attr("aria-describedby", self._GetSubId(self._DATEPICKER_DIALOG_DESCRIPTION_ID));
                                                if (self.options["datePicker"]["showOn"] === "image")
                                                {
                                                  self._dpDiv.find(".oj-datepicker-calendar").focus();
                                                }
                                              },
                                              "animateStart": function (event, ui)
                                              {
                                                if ('open' === ui["action"])
                                                {
                                                  event.preventDefault();
                                                  oj.AnimationUtils.slideIn(ui.element, {"offsetY": ui.element.offsetHeight + "px"}).then(ui["endCallback"]);
                                                }
                                              },
                                              "animation": animation
                                            }).attr('data-oj-internal', ''); // mark internal component, used in oj.Components.getComponentElementByNode;
      this.element.attr('data-oj-popup-' + this._popUpDpDiv.attr('id') + '-parent', ''); // mark parent of pop up
      window.addEventListener('resize', function() {
        if(oj.Components.isComponentInitialized(self._popUpDpDiv, "ojPopup")) 
        {
          self._popUpDpDiv.ojPopup("option", "modality", (_isLargeScreen ? "modeless" : "modal"));
        }
      }, false);

      var pickerAttrs = this.options.pickerAttributes;
      if (pickerAttrs)
        oj.EditableValueUtils.setPickerAttributes(this._popUpDpDiv.ojPopup("widget"), pickerAttrs);

    }
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDate
   */
  _ComponentCreate : function ()
  {
    this._InitBase();

    var retVal = this._super();

    if(this.options["dayMetaData"])
    {
      this.options["dayFormatter"] = (function(value)
      {
        return function(dateInfo) {
          return _getMetaData(value, 0, [dateInfo["fullYear"], dateInfo["month"], dateInfo["date"]]);
        };
      })(this.options["dayMetaData"]);
    }

    //if isoString has a different timezone then the one provided in the converter, need to perform
    //conversion so pass it through the method
    if(this.options["value"])
    {
      var formatted = this._GetConverter()["format"](this.options["value"]);
      this._SetValue(formatted, {});
    }

    //Need to set the currentDay, currentMonth, currentYear to either the value or the default of today's Date
    //Note that these are days indicator for the datepicker, so it is correct in using today's date even if value
    //hasn't been set
    this._setCurrentDate(this._getDateIso());

    // jmw. Add a wrapper around the element and the trigger. This is needed so that we can
    // add inline messages to the root dom node. We want the input+trigger to be one child and
    // the inline messages to be another child of the root dom node. This way the inline
    // messages can be stacked after the main component, and will grow or shrink in size the same
    // as the main component.
    // doing this in InputBase now. $(this.element).wrap( $("<div>").addClass(this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES));

    if (this._isInLine)
    {
      this.element.append(this._dpDiv); //@HTMLUpdateOK
      this.element.addClass(this._INLINE_CLASS); //by applying the inline class it places margin bottom, to separate in case ojInputTime exists

      // Set display:block in place of inst._dpDiv.show() which won't work on disconnected elements
      // http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
      this._dpDiv.css("display", "block");
    }
    else
    {
      this._processReadOnlyKeyboardEdit();
      this._attachTrigger();
    }

    this._registerSwipeHandler();

    // attach active state change handlers
    bindActive(this);
    return retVal;
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDate
   */
  _AfterCreate : function ()
  {
    var ret = this._superApply(arguments);

    this._disableEnable(this.options["disabled"]);

    var label = this.$label;
    if(this._inputContainer && label && label.length === 1) {
      var icId = this._inputContainer.attr("id");
      var LId = label.attr("id");

      if(!LId) {
        LId = this["uuid"] + "_Label";
        label.attr("id", LId);
      }

      this._inputContainer.attr("aria-labelledby", LId);
    }

    return ret;
  },

  /**
   * @ignore
   * @protected
   * @override
   */
  _setOption : function __setOption(key, value, flags)
  {

    var retVal = null;

    //When a null, undefined, or "" value is passed in set to null for consistency
    //note that if they pass in 0 it will also set it null
    if (key === "value")
    {
      if(!value)
      {
        value = null;
      }

      retVal = this._super(key, value, flags);
      this._setCurrentDate(value);

      if(this._datepickerShowing())
      {
        // _setOption is called after user picks a date from picker, we dont want to bring
        //  focus to input element if the picker is showing still for the non-inline case. For the
        //  case of inline date picker, if there is a time field and already focussed (brought in when
        //  the picker was hidden), we want to update the date picker, but not set focus on it.
        var focusOnCalendar = !(this._isInLine && this._timePicker && this._timePicker[0] === document.activeElement);
        this._updateDatepicker(focusOnCalendar);
      }

      return retVal;
    }

    if (key === "dayMetaData")
    {
      //need to invoke w/ dayFormatter and return for the case where user invoke $("selector").ojInputDate("option", "dayMetaData", {});
      //since that doesn't trigger ComponentBinding

      this._setOption("dayFormatter", function(dateInfo) {
          return _getMetaData(value, 0, [dateInfo["fullYear"], dateInfo["month"], dateInfo["date"]]);
      }, flags);
      return; //avoid setting in this.options and etc
    }

    retVal = this._super(key, value, flags);

    if (key === "disabled")
    {
      this._disableEnable(value);
    }
    else if (key === "max" || key === "min")
    {
      //since validators are immutable, they will contain min + max as local values. B/c of this will need to recreate
      this._datePickerDefaultValidators[oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE] = this._getValidator("min");

      this._AfterSetOptionValidators();
    }
    else if(key === "readOnly")
    {
      this._processReadOnlyKeyboardEdit();

      if (value)
      {
        this._hide(this._ON_CLOSE_REASON_CLOSE);
      }
      this._AfterSetOptionDisabledReadOnly("readOnly", oj.EditableValueUtils.readOnlyOptionOptions);
    }
    else if(key === "keyboardEdit")
    {
      this._processReadOnlyKeyboardEdit();
    }
    else if (key === "dayFormatter")
    {
      //since validators are immutable, they will contain dayFormatter as local values. B/c of this will need to recreate
      this._datePickerDefaultValidators[oj.ValidatorFactory.VALIDATOR_TYPE_DATERESTRICTION] = this._getValidator("dayFormatter");

      this._AfterSetOptionValidators();
    }
    else if(key === "converter")
    {
      this._nativePickerConverter = null;
    }

    if (key === "datePicker" && flags["subkey"] === "currentMonthPos")
    {
      //need to reset up the drawMonth + drawYear
      this._setCurrentDate(this._getDateIso());
    }

    var updateDatePicker = {"max": true, "min": true, "dayFormatter": true, "datePicker": true, "translations": true};

    if(this._datepickerShowing() && key in updateDatePicker)
    {
      this._updateDatepicker();
    }

    return retVal;
  },

  /**
   * @ignore
   */
  _processReadOnlyKeyboardEdit: function()
  {
    var readonly = this.options["readOnly"] ||
            this._isKeyboardEditDisabled();
    this.element.prop("readOnly", !!readonly);
  },

  /**
   * @ignore
   * @return {boolean}
   */
  _isKeyboardEditDisabled: function()
  {
    return this.options["keyboardEdit"] === this._KEYBOARD_EDIT_OPTION_DISABLED;
  },

  /**
   * Need to override due to usage of display: inline-table [as otherwise for webkit the hidden content takes up
   * descent amount of space]
   *
   * @protected
   * @instance
   * @memberOf !oj.ojInputDate
   */
  _AppendInputHelperParent : function ()
  {
    return this._triggerNode;
  },

  /**
   * @ignore
   * @protected
   * @override
   */
  _destroy : function __destroy()
  {
    var retVal = this._super();

    var triggerRootContainer = $(this.element[0]).parent().parent();
    this._RemoveActiveable(triggerRootContainer);

    this.element.off("focus touchstart");
    this._wrapper.off("touchstart");

    if (this._triggerNode)
    {
      this._triggerNode.remove();
    }

    if(this._isInLine)
    {
      //need to remove disabled + readOnly b/c they are set by super classes and datepicker is special in that this.element
      //can be a div element for inline mode
      this.element.removeProp("disabled");
      this.element.removeProp("readonly");
    }
    
    if(this._animationResolve)
    {
      this._animationResolve();
      this._animationResolve = null;
    }

    this._dpDiv.remove();
    return retVal;
  },

  _datepickerShowing: function()
  {
    return this._isInLine || (oj.Components.isComponentInitialized(this._popUpDpDiv, "ojPopup") && this._popUpDpDiv.ojPopup("isOpen")) || this._nativePickerShowing;
  },

  /**
   * @protected
   * @override
   * @ignore
   */
  _WrapElement: function()
  {
    this._inputContainer = this._superApply(arguments);
    this._inputContainer.attr({"role": "combobox", "aria-haspopup": "true", "tabindex": "-1"});
  },

  /**
   * When input element has focus
   * @private
   */
  _onElementFocus : function()
  {
    var showOn = this.options["datePicker"]["showOn"];

    if(this._redirectFocusToInputContainer)
    {
      this._redirectFocusToInputContainer = false;
      this._inputContainer.focus();
    }
    else
    {
      if (showOn === "focus")
      {
        // pop-up date picker when focus placed on the input box
        this.show();
      }
      else
      {
        if(this._datepickerShowing())
        {
          this._hide(this._ON_CLOSE_REASON_CLOSE);
        }
      }
    }
  },

  /**
   * When input element is touched
   *
   * @ignore
   * @protected
   */
  _OnElementTouchStart : function()
  {
    var showOn = this.options["datePicker"]["showOn"];

    // If the focus is already on the text box and can't edit with keyboard
    // and show on is focus then reopen the picker.
    if(showOn === "focus")
    {
      if (this._datepickerShowing())
      {
        this._ignoreShow = true;
        this._hide(this._ON_CLOSE_REASON_CLOSE);
      }
      else
      {
        var inputActive = this.element[0] === document.activeElement;

        this.show();
        this._redirectFocusToInputContainer = true;

        if(inputActive)
        {
          this._inputContainer.focus();
        }
      }
    }
  },

  /**
   * This function will create the necessary calendar trigger container [i.e. image to launch the calendar]
   * and perform any attachment to events
   *
   * @private
   */
  _attachTrigger : function()
  {
    var showOn = this.options["datePicker"]["showOn"];
    var triggerContainer = $("<span>").addClass(this._TRIGGER_CLASS);

    // pop-up date picker when button clicked
    var triggerCalendar =
      $("<span title='" + this._GetCalendarTitle() + "'/>").addClass(this._TRIGGER_CALENDAR_CLASS + " oj-clickable-icon-nocontext oj-component-icon");

    triggerContainer.append(triggerCalendar); //@HTMLUpdateOK

    this.element.on("focus", $.proxy(this._onElementFocus, this));
    this.element.on("touchstart", $.proxy(this._OnElementTouchStart, this));

    var self = this;

    this._wrapper.on("touchstart", function(e)
    {
      self._isMobile = true;
    });

    if (showOn === "image")
    {
      // we need to show the icon that we hid by display:none in the mobile themes
      triggerCalendar.css("display", "block");

      // In iOS theme, we defaulted to use border radius given that showOn=focus is default and
      //  we will not have trigger icon. For showOn=image case, we will show the icon, so
      //  we need to remove the border radius. iOS is the only case we use border radius, so this
      //  setting for all cases is fine.
      if (this._IsRTL())
      {
        this.element.css("border-top-left-radius", 0);
        this.element.css("border-bottom-left-radius", 0);
      }
      else
      {
        this.element.css("border-top-right-radius", 0);
        this.element.css("border-bottom-right-radius", 0);
      }
    }

    triggerCalendar.on("click", function ()
    {
      if (self._datepickerShowing())
      {
        self._hide(self._ON_CLOSE_REASON_CLOSE);
      }
      else
      {
        self.show();
        self._dpDiv.find(".oj-datepicker-calendar").focus();
      }
      return false;
    });

    this._AddHoverable(triggerCalendar);
    this._AddActiveable(triggerCalendar);

    this._triggerIcon = triggerCalendar;
    this._triggerNode = triggerContainer;
    this.element.after(triggerContainer); //@HTMLUpdateOK
  },

  //This handler is when an user keys down with the calendar having focus
  _doCalendarKeyDown : function (event)
  {
    var sel, handled = false,
        kc = $.ui.keyCode,
        isRTL = this._IsRTL();

    if (this._datepickerShowing())
    {
      switch (event.keyCode)
      {
        case 84: //t character
          if (event.altKey && event.ctrlKey)
          {
            this._dpDiv.find(".oj-datepicker-current").focus();
            handled = true;
          }
          break;
        case kc.TAB:
          // Tab key is used to navigate to different buttons/links in the
          // datepicker to make them accessible.  It shouldn't be used to hide
          // the datepicker.
          break;
        case kc.SPACE:
        case kc.ENTER:
          sel = $("td." + this._DAYOVER_CLASS, this._dpDiv);
          if (sel[0])
          {
            this._selectDay(this._currentMonth, this._currentYear, sel[0], event);
          }
          //need to return false so preventing default + stop propagation here
          event.preventDefault();
          event.stopPropagation();
          return false;
        case kc.ESCAPE:
          this._hide(this._ON_CLOSE_REASON_CANCELLED);
          handled = true;
          break;// hide on escape
        case kc.PAGE_UP:
          if(event.ctrlKey && event.altKey)
          {
            this._adjustDate(- this.options["datePicker"]["stepBigMonths"], "M", true);
          }
          else if (event.altKey)
          {
            this._adjustDate( - 1, "Y", true);
          }
          else
          {
            this._adjustDate(- this._getStepMonths(), "M", true);
          }
          handled = true;
          break;// previous month/year on page up/+ ctrl
        case kc.PAGE_DOWN:
          if(event.ctrlKey && event.altKey)
          {
            this._adjustDate(+ this.options["datePicker"]["stepBigMonths"], "M", true);
          }
          else if (event.altKey)
          {
            this._adjustDate(1, "Y", true);
          }
          else
          {
            this._adjustDate(+ this._getStepMonths(), "M", true);
          }
          handled = true;
          break;// next month/year on page down/+ ctrl
        case kc.END:
          this._currentDay = this._getDaysInMonth(this._currentYear, this._currentMonth);
          this._changeCurrentDay();

          handled = true;
          break;
        case kc.HOME:
          this._currentDay = 1;
          this._changeCurrentDay();

          handled = true;
          break;
        case kc.LEFT:
          
          // next month/year on alt +left on Mac
          if (event.originalEvent.altKey)
          {
            this._adjustDate((event.ctrlKey ?  - this.options["datePicker"]["stepBigMonths"] :  - this._getStepMonths()), "M", true);
          }
          else 
          {
            this._adjustDate((isRTL ?  + 1 :  - 1), "D", true);
            // -1 day on ctrl or command +left
          }
          
          handled = true;
          break;
        case kc.UP:
          this._adjustDate( - 7, "D", true);
          handled = true;
          break;// -1 week on ctrl or command +up
        case kc.RIGHT:
          
          // next month/year on alt +right
          if (event.originalEvent.altKey)
          {
            this._adjustDate((event.ctrlKey ?  + this.options["datePicker"]["stepBigMonths"] :  + this._getStepMonths()), "M", true);
          }
          else 
          {
            this._adjustDate((isRTL ?  - 1 :  + 1), "D", true);
            // +1 day on ctrl or command +right
          }
          
          handled = true;
          break;
        case kc.DOWN:
          this._adjustDate( + 7, "D", true);
          handled = true;
          break;// +1 week on ctrl or command +down
        default : ;
      }
    }
    else if (event.keyCode === kc.HOME && event.ctrlKey)
    {
      // display the date picker on ctrl+home
      this.show();
      handled = true;
    }

    if (handled)
    {
      event.preventDefault();
      event.stopPropagation();
    }

  },

  _changeCurrentDay : function() 
  {
    var cOver = $("." + this._DAYOVER_CLASS, this._dpDiv);
    var cDay = this._currentDay + '';

    if(cOver.length === 1)
    {
      cOver.removeClass(this._DAYOVER_CLASS);
    }

    var datePickerCalendar = $('table.oj-datepicker-calendar', this._dpDiv);
    cOver = $('a.oj-enabled:contains(' + this._currentDay + ')', datePickerCalendar)
              .filter(function() { 
                return $(this).text() === cDay; 
              });
    if(cOver.length === 1) {
      var cParent = cOver.parent();
      datePickerCalendar.addClass('oj-focus-highlight');
      datePickerCalendar.attr('aria-activedescendant', cParent.attr("id") + "");
      cParent.addClass(this._DAYOVER_CLASS);
    }
  },

  //This handler is when an user keys down with the Month View having focus
  _doMonthViewKeyDown : function(event)
  {
    var sel, handled = false,
        kc = $.ui.keyCode,
        isRTL = this._IsRTL();

    if (this._datepickerShowing())
    {
      switch (event.keyCode)
      {
        case 84: //t character
          if (event.altKey && event.ctrlKey)
          {
            this._dpDiv.find(".oj-datepicker-current").focus();
            handled = true;
          }
          break;
        case kc.SPACE:
        case kc.ENTER:
          sel = $("td." + this._DAYOVER_CLASS, this._dpDiv);
          if (sel[0])
          {
            this._selectMonthYear(sel[0], 'M');
          }
          //need to return false so preventing default + stop propagation here
          event.preventDefault();
          event.stopPropagation();
          return false;
        case kc.ESCAPE:
          this.hide();
          handled = true;
          break;// hide on escape
        case kc.PAGE_UP:
          if(event.ctrlKey && event.altKey)
          {
            this._adjustDate(- this.options["datePicker"]["stepBigMonths"], "M", true, 'month');
          }
          else if (event.altKey)
          {
            this._adjustDate( - 1, "Y", true, 'month');
          }
          else
          {
            this._adjustDate(- this._getStepMonths(), "M", true, 'month');
          }
          handled = true;
          break;// previous month/year on page up/+ ctrl
        case kc.PAGE_DOWN:
          if(event.ctrlKey && event.altKey)
          {
            this._adjustDate(+ this.options["datePicker"]["stepBigMonths"], "M", true, 'month');
          }
          else if (event.altKey)
          {
            this._adjustDate(1, "Y", true, 'month');
          }
          else
          {
            this._adjustDate(+ this._getStepMonths(), "M", true, 'month');
          }
          handled = true;
          break;// next month/year on page down/+ ctrl
        case kc.END:
          this._currentMonth = 11;
          this._updateDatepicker(true, 'month');
          handled = true;
          break;
        case kc.HOME:
          this._currentMonth = 0;
          this._updateDatepicker(true, 'month');
          handled = true;
          break;
        case kc.LEFT:
          this._adjustDate((isRTL ?  + 1 :  - 1), "M", true, 'month');
          handled = true;
          break;
        case kc.UP:
          this._adjustDate( - 3, "M", true, 'month');
          handled = true;
          break;// -1 week on ctrl or command +up
        case kc.RIGHT:
          this._adjustDate((isRTL ?  - 1 :  + 1), "M", true, 'month');
          handled = true;
          break;
        case kc.DOWN:
          this._adjustDate( + 3, "M", true, 'month');
          handled = true;
          break;// +1 week on ctrl or command +down
        default : ;
      }
    }
    else if (event.keyCode === kc.HOME && event.ctrlKey)
    {
      // display the date picker on ctrl+home
      this.show();
      handled = true;
    }

    if (handled)
    {
      event.preventDefault();
      event.stopPropagation();
    }

  },

  //This handler is when an user keys down with the Year View having focus
  _doYearViewKeyDown : function(event)
  {
    var sel, handled = false,
        kc = $.ui.keyCode,
        isRTL = this._IsRTL();

    if (this._datepickerShowing())
    {
      switch (event.keyCode)
      {
        case 84: //t character
          if (event.altKey && event.ctrlKey)
          {
            this._dpDiv.find(".oj-datepicker-current").focus();
            handled = true;
          }
          break;
        case kc.SPACE:
        case kc.ENTER:
          sel = $("td." + this._DAYOVER_CLASS, this._dpDiv);
          if (sel[0])
          {
            this._selectMonthYear(sel[0], 'Y');
          }
          //need to return false so preventing default + stop propagation here
          event.preventDefault();
          event.stopPropagation();
          return false;
        case kc.ESCAPE:
          this.hide();
          handled = true;
          break;// hide on escape
        case kc.PAGE_UP:
          if (event.altKey)
          {
            this._adjustDate( - 1, "Y", true, 'year');
          }
          handled = true;
          break;// previous month/year on page up/+ ctrl
        case kc.PAGE_DOWN:
          if (event.altKey)
          {
            this._adjustDate(1, "Y", true, 'year');
          }
          handled = true;
          break;// next month/year on page down/+ ctrl
        case kc.END:
          this._currentYear = Math.floor(this._currentYear / 10) * 10 + 9;
          this._updateDatepicker(true, 'year');
          handled = true;
          break;
        case kc.HOME:
          this._currentYear = Math.floor(this._currentYear / 10) * 10;
          this._updateDatepicker(true, 'year');
          handled = true;
          break;
        case kc.LEFT:
          this._adjustDate((isRTL ?  + 1 :  - 1), "Y", true, 'year');
          handled = true;
          break;
        case kc.UP:
          this._adjustDate( - 3, "Y", true, 'year');
          handled = true;
          break;// -1 week on ctrl or command +up
        case kc.RIGHT:
          this._adjustDate((isRTL ?  - 1 :  + 1), "Y", true, 'year');
          handled = true;
          break;
        case kc.DOWN:
          this._adjustDate( + 3, "Y", true, 'year');
          handled = true;
          break;// +1 week on ctrl or command +down
        default : ;
      }
    }
    else if (event.keyCode === kc.HOME && event.ctrlKey)
    {
      // display the date picker on ctrl+home
      this.show();
      handled = true;
    }

    if (handled)
    {
      event.preventDefault();
      event.stopPropagation();
    }

  },

  /**
   * @returns {jQuery} returns the content element of the datepicker
   * 
   * @private
   */
  _getDatepickerContent: function ()
  {
    return $(this._dpDiv.find(".oj-datepicker-content")[0]);
  },

  /**
   * Function to whether it is a datetimepicker with the switcher
   * 
   * @private
   */
  _isDateTimeSwitcher: function()
  {
    return this._dateTimeSwitcherActive;
  },

  /**
   * Thie function will update the calendar display
   *
   * @private
   * @param {boolean=} focusOnCalendar - Whether to put focus in the calendar.
   * @param {string=} view - The view to update to. Default is 'day'.
   * @param {string=} navigation - Type of navigation to animate.
   */
  _updateDatepicker : function (focusOnCalendar, view, navigation)
  {
    this._maxRows = 4;//Reset the max number of rows being displayed (see #7043)
    var generatedHtmlContent;

    if (view === 'year')
    {
      generatedHtmlContent = this._generateViewHTML('Y');
    }
    else if (view === 'month')
    {
      generatedHtmlContent = this._generateViewHTML('M');
    }
    else
    {
      generatedHtmlContent = this._generateViewHTML('D');
    }

    generatedHtmlContent.html = "<div" + (this._isDateTimeSwitcher() ? "" : " class='oj-datepicker-wrapper'") +">" + generatedHtmlContent.html + "</div>";

    this._currentView = view;
    var dpContentDiv = this._getDatepickerContent();

    if (navigation)
    {
      var oldChild = dpContentDiv.children().first();
      oldChild.css({position: 'absolute', left: 0, top: 0});

      dpContentDiv.prepend(generatedHtmlContent.html); //@HTMLUpdateOK
      var newChild = dpContentDiv.children().first();
      var direction = (navigation == 'previous') ? 'end' : 'start';

      if(!this._animationResolve) 
      {
        var busyContext = oj.Context.getContext(this.element[0]).getBusyContext();
        this._animationResolve = busyContext.addBusyState({"description" : "The datepicker id='" + 
          this.element.attr('id') + "' is animating."});
      }
      
      oj.AnimationUtils.startAnimation(newChild[0], 'open', {'effect':'slideIn', 'direction':direction});
      var promise = oj.AnimationUtils.startAnimation(oldChild[0], 'close', {'effect':'slideOut', 'direction':direction, 'persist':'all'});
      var self = this;
      promise.then(function() {
        if (oldChild)
        {
          oldChild.remove();
        }

        self._setupNewView(focusOnCalendar, view, generatedHtmlContent.dayOverId);
        self._animationResolve();
        self._animationResolve = null;
      });
    }
    else
    {
      dpContentDiv.empty().append(generatedHtmlContent.html); //@HTMLUpdateOK
      this._setupNewView(focusOnCalendar, view, generatedHtmlContent.dayOverId);
    }
  },

  _setupNewView : function(focusOnCalendar, view, dayOverId)
  {
    var buttons = $("button", this._dpDiv);

    if(buttons.length > 0)
    {
      if(buttons.length === 1)
      {
        //need to center it as requested by UX
        $(buttons[0]).addClass("oj-datepicker-single-button");
      }

      $.each(buttons, function (index, ele)
      {
        $(ele).ojButton();
      });

    }

    this._attachHandlers();

    if (dayOverId)
    {
      this._dpDiv.find(".oj-datepicker-calendar").attr("aria-activedescendant", dayOverId);
    }

    var numMonths = this._getNumberOfMonths(),
        cols = numMonths[1],
        width = 275;

    this._dpDiv.removeClass("oj-datepicker-multi-2 oj-datepicker-multi-3 oj-datepicker-multi-4").width("");
    if (view === 'year' || view === 'month')
    {
      this._dpDiv.removeClass("oj-datepicker-multi");
    }
    else
    {
      numMonths = this._getNumberOfMonths(),
          cols = numMonths[1];

      if (cols > 1)
      {
        // Try to determine the width dynamically
        var calendar = this._dpDiv.find(".oj-datepicker-calendar");
        var daySelectors = calendar.find("tbody a");
        var cellWidth = parseFloat(daySelectors.css("width"));
        var padding = parseFloat(calendar.css("margin-left"));
        if (!isNaN(cellWidth) && !isNaN(padding))
        {
          width = cellWidth * (this.options["datePicker"]["weekDisplay"] === "number" ? 8 : 7) + (padding * 2);
        }

        this._dpDiv.addClass("oj-datepicker-multi-" + cols).css("width", (width * cols + (this._isInLine ? 2 : 0)) + "px");
      }
      this._dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") + "Class"]("oj-datepicker-multi");
    }

    // #6694 - don't focus the input if it's already focused
    // this breaks the change event in IE
    if (this._datepickerShowing() && this.element.is(":visible") && !this.element.is(":disabled"))
    {
      if (!focusOnCalendar)
      {
        if (!this._isInLine && this.element[0] !== document.activeElement)
        {
          this.element.focus();
        }
      }
      else
      {
        this._placeFocusOnCalendar();
      }
    }

  },

  _placeFocusOnCalendar: function() 
  {
    var calendar = this._dpDiv.find(".oj-datepicker-calendar");
    if (calendar[0] !== document.activeElement)
    {
      $(calendar[0]).focus();
    }
  },

  /**
   * Adjust one of the date sub-fields.
   *
   * @private
   * @param {number} offset
   * @param {string} period
   * @param {boolean=} focusOnCalendar - Whether to put focus in the calendar.
   * @param {string=} view - The view to update to. Default is 'day'.
   * @param {string=} navigation - Type of navigation to animate.
   */
  _adjustDate : function (offset, period, focusOnCalendar, view, navigation)
  {
    if (this.options["disabled"])
    {
      return;
    }

    var currMonth = this._currentMonth;
    var currYear = this._currentYear;
    this._adjustInstDate(offset + (period === "M" ? this.options["datePicker"]["currentMonthPos"] : 0), // undo positioning
                          period);

    if(period === 'D' && currMonth === this._currentMonth && currYear === this._currentYear) 
    {
      //just day update so change day over class
      this._changeCurrentDay();
    }
    else
    {
      this._updateDatepicker(focusOnCalendar, view, navigation);
    }
    
  },

  /**
   * Action for current link. Note that this is of today relative to client's locale so this is ok.
   *
   * @private
   */
  _gotoToday : function ()
  {
    var date = new Date();

    this._currentDay = date.getDate();
    this._drawMonth = this._currentMonth = date.getMonth();
    this._drawYear = this._currentYear = date.getFullYear();

    this._adjustDate(null, null, true, 'day');
  },

  /**
   * Action for selecting a new month/year.
   *
   * @private
   * @param {Object} select
   * @param {string} period
   */
  _selectMonthYear : function (select, period)
  {
    var selected;
    var converterUtils = oj.IntlConverterUtils;
    var value = this._getDateIso();
    var yearAttr = select.getAttribute("data-year");

    if (yearAttr)
    {
      selected = parseInt(yearAttr, 10);
      this._currentYear = this._drawYear = selected;
    }

    if (period === "M")
    {
      selected = parseInt(select.getAttribute("data-month"), 10);
      this._currentMonth = this._drawMonth = selected;
      value = converterUtils._dateTime(value, {"fullYear": this._currentYear, "month": this._currentMonth});
    }
    else
    {
      value = converterUtils._dateTime(value, {"fullYear": this._currentYear});
    }

    //Take care of accessibility. Note that this is using an INTERNAL converter to display only the year portion [no timezone]
    //so is okay
    $("#" + this._GetSubId(this._CALENDAR_DESCRIPTION_ID)).html(this._EscapeXSS(this.options["monthWide"][this._drawMonth]) + " " +
      yearDisplay.format(oj.IntlConverterUtils.dateToLocalIso(new Date(this._drawYear, this._drawMonth, 1)))); //@HTMLUpdateOK

    this._adjustDate(0, 0, true, period === "M" ? 'day' : this._toYearFromView);
  },

  //Action for selecting a day.
  _selectDay : function (month, year, td, event)
  {
    if ($(td).hasClass(this._UNSELECTABLE_CLASS) || this.options["disabled"])
    {
      return;
    }

    if(!this._isDateTimeSwitcher()) 
    {
      this._hide(this._ON_CLOSE_REASON_SELECTION);
    }
    
    this._currentDay = $("a", td).html(); //@HtmlUpdateOk
    this._currentMonth = month;
    this._currentYear = year;

    var converterUtils = oj.IntlConverterUtils,
        value = this.options['value'],
        tempDate = new Date(this._currentYear, this._currentMonth, this._currentDay);

    if (value)
    {

      //need to preserve the time portion when of ojInputDateTime, so update only year, month, and date
      value = converterUtils._dateTime(value, {"fullYear": tempDate.getFullYear(), "month": tempDate.getMonth(),
                "date": tempDate.getDate()});
    }
    else
    {
      //per discussion when date doesn't exist use local isostring
      value = converterUtils.dateToLocalIso(tempDate);
    }

    this._setDisplayAndValue(value, {});

    if(this._isDateTimeSwitcher()) 
    {
      this._placeFocusOnCalendar();
    }
  },

  _setDisplayAndValue: function(isoString, event)
  {
    if(!this._isDateTimeSwitcher()) 
    {
      var formatted = this._GetConverter()["format"](isoString);
      this._SetDisplayValue( formatted ); //need to set the display value, since _SetValue doesn't trigger it per discussion
                                          //need to use formatted value as otherwise it doesn't go through framework's cycle
                                          //in updates
      this._SetValue(formatted, event); //TEMP TILL FIXED PASS IN formatted
    }
    else
    {
      this._switcherDateValue = isoString;
      this._setCurrentDate(isoString);

      if(this._datepickerShowing())
      {
        var focusOnCalendar = !(this._isInLine && this._timePicker && this._timePicker[0] === document.activeElement);
        this._updateDatepicker(focusOnCalendar);
      }
    }
    
  },

  /**
   * Get the default isostring date
   *
   * @ignore
   * @private
   */
  _getDefaultIsoDate: function()
  {
    return oj.IntlConverterUtils.dateToLocalIso(this._getTodayDate());
  },

  /**
   * Updates the internal current + draw values
   *
   * @private
   * @param {string} isoDate
   */
  _setCurrentDate : function (isoDate)
  {
    var newDate = oj.IntlConverterUtils._dateTime(isoDate || this._getDefaultIsoDate(), ["fullYear", "month", "date"],
                                              true);

    this._currentDay = newDate["date"];
    this._currentMonth = newDate["month"];
    if(!this._isMultiMonth())
    {
      //request not to change month
      this._drawMonth = newDate["month"];
    }
    
    this._drawYear = this._currentYear = newDate["fullYear"];

    this._adjustInstDate();
  },

  _getStepMonths : function ()
  {
    var stepMonths = this.options["datePicker"]["stepMonths"];
    return $.isNumeric(stepMonths) ? stepMonths : this.options["datePicker"]["numberOfMonths"];
  },

  // Check if an event is a button activation event
  _isButtonActivated : function(evt)
  {
    // We are using <a role='button'> for the buttons.  They fire click event
    // on Enter keydown.  We just need to check for Space key here.
    return(!this.options["disabled"] &&
           ((evt.type === 'click') ||
            (evt.type === 'keydown' && evt.keyCode === 32)));
  },

  _gotoPrev : function(stepMonths)
  {
    if (this._currentView === 'year')
    {
      this._adjustDate(-10, "Y", true, 'year', 'previous');
    }
    else if (this._currentView === 'month')
    {
      this._adjustDate(-1, "Y", true, 'month', 'previous');
    }
    else
    {
      this._adjustDate( - stepMonths, "M", true, 'day', 'previous');
    }
  },

  _gotoNext: function(stepMonths)
  {
    if (this._currentView === 'year')
    {
      this._adjustDate(+10, "Y", true, 'year', 'next');
    }
    else if (this._currentView === 'month')
    {
      this._adjustDate(+1, "Y", true, 'month', 'next');
    }
    else
    {
      this._adjustDate( + stepMonths, "M", true, 'day', 'next');
    }
  },

  /**
   * Attach the onxxx handlers.  These are declared statically so
   * they work with static code transformers like Caja.
   *
   * @private
   */
  _attachHandlers : function ()
  {
    var stepMonths = this._getStepMonths(), self = this;
    this._dpDiv.find("[data-handler]").map(function ()
    {
      var handler =
      {
        /** @expose */
        prev : function (evt)
        {
          if (self._isButtonActivated(evt))
          {
            self._gotoPrev(stepMonths);
          }
          return false;
        },
        /** @expose */
        next : function (evt)
        {
          if (self._isButtonActivated(evt))
          {
            self._gotoNext(stepMonths);
          }
          return false;
        },
        /** @expose */
        today : function (evt)
        {
          if (self._isButtonActivated(evt))
          {
            self._gotoToday();
          }
          return false;
        },
        /** @expose */
        selectDay : function (evt)
        {
          self._selectDay( + this.getAttribute("data-month"),  + this.getAttribute("data-year"), this, evt);
          return false;
        },
        /** @expose */
        selectMonth : function ()
        {
          self._selectMonthYear(this, "M");
          return false;
        },
        /** @expose */
        selectYear : function ()
        {
          self._selectMonthYear(this, "Y");
          return false;
        },
        /** @expose */
        calendarKey : function (evt)
        {
          if (self._currentView === 'year')
          {
            self._doYearViewKeyDown(evt);
          }
          else if (self._currentView === 'month')
          {
            self._doMonthViewKeyDown(evt);
          }
          else
          {
            self._doCalendarKeyDown(evt);
          }
        },
        /** @expose */
        selectMonthHeader : function (evt)
        {
          if (self._isButtonActivated(evt))
          {
            if (self._currentView === 'month')
            {
              self._updateDatepicker(true, 'day');
            }
            else
            {
              self._updateDatepicker(true, 'month');
            }
          }
          return false;
        },
        /** @expose */
        selectYearHeader : function (evt)
        {
          if (self._isButtonActivated(evt))
          {
            if (self._currentView === 'year')
            {
              self._updateDatepicker(true, 'day');
            }
            else
            {
              // Remember where we are navigating to the Year view from
              self._toYearFromView = self._currentView;
              self._updateDatepicker(true, 'year');
            }
          }
          return false;
        }
      };
      $(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
    });

    // Only show the day focus if the user starts using keyboard
    this._dpDiv.find(".oj-datepicker-calendar").map(function ()
    {
      oj.DomUtils.makeFocusable({
        'element': $(this),
        'applyHighlight': true
      });
    });

    // Avoid problem with hover/active state on header/footer not going away on touch devices
    var buttons = this._dpDiv.find(".oj-datepicker-header a, .oj-datepicker-buttonpane a");
    this._AddHoverable(buttons);
    this._AddActiveable(buttons);
  },

  _registerSwipeHandler : function()
  {
    if (oj.DomUtils.isTouchSupported())
    {
      var self = this;
      var stepMonths = this._getStepMonths();
      var rtl = this._IsRTL();
      var options = {
        'recognizers': [
          [Hammer.Swipe, {'direction': Hammer['DIRECTION_HORIZONTAL']}]
      ]};

      this._dpDiv.ojHammer(options).on(rtl ? 'swiperight' : 'swipeleft', function(evt)
      {
        self._gotoNext(stepMonths);
        return false;
      })
      .on(rtl ? 'swipeleft' : 'swiperight', function(evt) {
        self._gotoPrev(stepMonths);
        return false;
      });
    }
  },

  /**
   * Generate the HTML for the current state of the date picker.
   *
   * @private
   */
  _getMinMaxDateIso : function(minOrMax)
  {
    var minMaxDateIso = this.options[minOrMax];
    if(minMaxDateIso)
    {
      var dateIso = this._getDateIso();
      minMaxDateIso = oj.IntlConverterUtils._minMaxIsoString(minMaxDateIso, dateIso);
    }

    return minMaxDateIso;
  },

  /**
   * Generate the HTML for the header of the date picker.
   *
   * @private
   */
  _generateHeader : function(drawMonth, drawYear, monthControl, enablePrev, enableNext)
  {
    var header;
    var prevText, prev, nextText, next;
    var isRTL = this._IsRTL();

    prevText = this._EscapeXSS(this.getTranslatedString("prevText"));

    prev = (enablePrev ? "<a role='button' href='#' class='oj-datepicker-prev-icon oj-enabled oj-default oj-component-icon oj-clickable-icon-nocontext' data-handler='prev' data-event='click keydown'" + " title='" + prevText + "'></a>" : "<a class='oj-datepicker-prev-icon oj-disabled oj-component-icon oj-clickable-icon-nocontext' title='" + prevText + "'></a>");

    nextText = this._EscapeXSS(this.getTranslatedString("nextText"));

    next = (enableNext ? "<a role='button' href='#' class='oj-datepicker-next-icon oj-enabled oj-default oj-component-icon oj-clickable-icon-nocontext' data-handler='next' data-event='click keydown'" + " title='" + nextText + "'></a>" : "<a class='oj-datepicker-next-icon oj-disabled oj-component-icon oj-clickable-icon-nocontext' title='" + nextText + "'></a>");

    header = "<div class='oj-datepicker-header" + (this.options["disabled"] ? " oj-disabled " : " oj-enabled oj-default ") + "'>";

    header += (/all|left/.test(monthControl) ? (isRTL ? next : prev) : "");
    header += (/all|right/.test(monthControl) ? (isRTL ? prev : next) : "");
    header += this._generateMonthYearHeader(drawMonth, drawYear);

    header += "</div>";

    return header;
  },

  /**
   * Generate the HTML for the footer of the date picker.
   *
   * @protected
   * @ignore
   */
  _generateFooter : function(footerLayoutDisplay, gotoDate)
  {
    var footerLayout = "";
    var currentText = this._EscapeXSS(this.getTranslatedString("currentText"));
    var enabledClass = this.options["disabled"] ? "oj-disabled disabled" : "oj-enabled";
    var todayControl = "<a role='button' href='#' class='oj-datepicker-current oj-priority-secondary " + (this.options["disabled"] ? "oj-disabled' disabled" : "oj-enabled'") + " data-handler='today' data-event='click keydown'" + ">" + currentText + "</a>";

    if(footerLayoutDisplay.length > 1) //keep the code for future multiple buttons
    {
      var todayIndex = footerLayoutDisplay.indexOf("today"),
          loop = 0,
          footerLayoutButtons = [{index: todayIndex, content: (this._isInRange(gotoDate) ? todayControl : "")}];

      //rather than using several if + else statements, sort the content to add by index of the strings
      footerLayoutButtons.sort(function(a, b)
      {
        return a.index - b.index;
      });

      //continue to loop until the index > -1 [contains the string]
      while(loop < footerLayoutButtons.length && footerLayoutButtons[loop].index < 0) { loop++; }

      while(loop < footerLayoutButtons.length)
      {
        footerLayout += footerLayoutButtons[loop++].content;
      }

      if(footerLayout.length > 0)
      {
        footerLayout = "<div class='oj-datepicker-buttonpane'>" + footerLayout + "</div>";
      }
    }

    return footerLayout;
  },

  _isMultiMonth: function() 
  {
    var numMonths = this._getNumberOfMonths();
    return (numMonths[0] !== 1 || numMonths[1] !== 1);
  },

  /**
   * Generate the HTML for the current state of the date picker. Might be ugly in passing so many parameters, but 
   * during the month+year feature apparently the code was duplicated with copy+paste so though not pretty at least 
   * helps to manage main variables and etc
   * 
   * @param {string} view - 'Y', 'M', or 'D' like in other areas of the code
   * @private
   */
  _generateViewHTML : function(view)
  {
    var maxDraw, enablePrev, enableNext, converterUtils = oj.IntlConverterUtils,
        dateParams = ["date", "month", "fullYear"], converter = this._GetConverter(), footerLayout, weekDisplay, tempDate = new Date(),
        today = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()), // clear time
        isRTL = this._IsRTL(), footerLayoutDisplay = this.options["datePicker"]["footerLayout"], numMonths = this._getNumberOfMonths(),
        currentMonthPos = this.options["datePicker"]["currentMonthPos"], 
        isMultiMonth = this._isMultiMonth(),
        minDateIso = this._getMinMaxDateIso("min"), minDateParams,
        maxDateIso = this._getMinMaxDateIso("max"), maxDateParams,
        drawMonth = this._drawMonth - currentMonthPos, drawYear = this._drawYear,
        compareDate = new Date(this._currentYear, this._currentMonth, this._currentDay), valueDateIso = this._getDateIso(),
        valueDateParams = converterUtils._dateTime(valueDateIso, dateParams, true),
        selectedYear = valueDateParams["fullYear"],
        selectedDay = valueDateParams["date"], selectedMonth = valueDateParams["month"],
        valueDate = new Date(selectedYear, selectedMonth, selectedDay),
        wDisabled = this.options["disabled"], weekText = this._EscapeXSS(this.getTranslatedString("weekText"));

    if(minDateIso) {
      //convert it to the correct timezone for comparison, since need to display the month, date, year as displayed in isoString
      minDateIso = converter.parse(minDateIso);
      minDateParams = converterUtils._dateTime(minDateIso, dateParams, true);
    }
    if(maxDateIso) {
      maxDateIso = converter.parse(maxDateIso);
      maxDateParams = converterUtils._dateTime(maxDateIso, dateParams, true);
    }

    valueDateIso = converterUtils._clearTime(valueDateIso);

    //So per discussion calendar will display the year, month, date based on how represented in the isoString
    //meaning 2013-12-01T20:00:00-08:00 and 2013-12-01T20:00:00-04:00 will both display the same content as no
    //conversion will take place. In order to achieve this it will rip out the necessary info by string parsing
    //and in regards to isoString date comparison (i.e. whether one is before the other, will need to use converter's
    //compareISODates passing the MODIFIED printDate isoString)
    if (drawMonth < 0)
    {
      drawMonth += 12;
      drawYear--;
    }

    if(minDateParams)
    {
      var minDraw = new Date(minDateParams["fullYear"], minDateParams["month"], minDateParams["date"]);

      //tech shouldn't this error out? [previous existing jquery logic so keep, maybe a reason]
      if(maxDateParams && converter.compareISODates(maxDateIso, minDateIso) < 0)
      {
        minDraw = new Date(maxDateParams["fullYear"], maxDateParams["month"], maxDateParams["date"]);
      }
      while (new Date(drawYear, drawMonth, this._getDaysInMonth(drawYear, drawMonth)) < minDraw)
      {
        drawMonth++;
        if (drawMonth > 11)
        {
          drawMonth = 0;
          drawYear++;
        }
      }
    }

    if (maxDateParams)
    {
      maxDraw = new Date(maxDateParams["fullYear"], maxDateParams["month"] - (numMonths[0] * numMonths[1]) + 1, maxDateParams["date"]);

      //tech shouldn't this error out? [previous existing jquery logic so keep, maybe a reason]
      if(minDateParams && converter.compareISODates(maxDateIso, minDateIso) < 0)
      {
        maxDraw = new Date(minDateParams["fullYear"], minDateParams["month"], minDateParams["date"]);
      }
      while (new Date(drawYear, drawMonth, 1) > maxDraw)
      {
        drawMonth--;
        if (drawMonth < 0)
        {
          drawMonth = 11;
          drawYear--;
        }
      }
    }
    this._drawMonth = drawMonth;
    this._drawYear = drawYear;

    enablePrev = this._canAdjustMonth( - 1, drawYear, drawMonth) && !wDisabled;
    enableNext = this._canAdjustMonth( + 1, drawYear, drawMonth) && !wDisabled;

    footerLayout = this._generateFooter(footerLayoutDisplay, today);

    weekDisplay = this.options["datePicker"]["weekDisplay"];

    var result;

    if(view === 'D') 
    {
      result = this._generateDayHTMLContent(enablePrev, enableNext, converterUtils, converter, footerLayout, weekDisplay, 
                today, isRTL, numMonths, isMultiMonth, minDateParams, maxDateParams, drawMonth, drawYear, compareDate, valueDateParams, 
                selectedYear, selectedDay, selectedMonth, valueDate, wDisabled, weekText);
    } 
    else if(view === 'M') 
    {
      result = this._generateMonthHTMLContent(enablePrev, enableNext, converter, footerLayout, minDateParams,
                maxDateParams, drawMonth, drawYear, valueDate, wDisabled);
    } 
    else 
    {
      result = this._generateYearHTMLContent(enablePrev, enableNext, converterUtils, footerLayout, minDateParams,
                maxDateParams, drawMonth, drawYear, valueDate, wDisabled);
    }

    return result;
  },

  /**
   * @private
   */
  _generateDayHTMLContent : function(enablePrev, enableNext, converterUtils, converter, footerLayout, 
                              weekDisplay, today, isRTL, numMonths, isMultiMonth, minDateParams,
                              maxDateParams, drawMonth, drawYear, compareDate, valueDateParams,
                              selectedYear, selectedDay, selectedMonth, valueDate, wDisabled, weekText)
  {
    var dayNames = this.options["dayWide"], dayNamesMin = this.options["dayNarrow"],
        firstDay = this.options["firstDayOfWeek"], daysOutsideMonth, html, dow, row, group, col, selected, rowCellId,
        dayOverClass, dayOverId = "", dayOverClassStr, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
        printDate, dRow, tbody, daySettings, otherMonth, unselectable, 
        dayFormatter = this.options["dayFormatter"], currMetaData = null, calculatedWeek;

    daysOutsideMonth = this.options["datePicker"]["daysOutsideMonth"];
    html = "";

    var monthControl = "all";
    for (row = 0;row < numMonths[0];row++)
    {
      group = "";
      this._maxRows = 4;
      for (col = 0;col < numMonths[1];col++)
      {
        monthControl = row === 0 ? "all" : "";
        calender = "";
        if (isMultiMonth)
        {
          calender += "<div class='oj-datepicker-group";
          if (numMonths[1] > 1)
          {
            switch (col)
            {
              case 0:
                calender += " oj-datepicker-group-first";
                monthControl = row === 0 ? (isRTL ? "right" : "left") : "";
                break;
              case numMonths[1] - 1:
                calender += " oj-datepicker-group-last";
                monthControl = row === 0 ? (isRTL ? "left" : "right") : "";
                break;
              default :
                calender += " oj-datepicker-group-middle";
                monthControl = "";
                break;
            }
          }
          calender += "'>";
        }

        calender += this._generateHeader(drawMonth, drawYear, monthControl, enablePrev, enableNext);

        calender += "<table class='oj-datepicker-calendar" + (weekDisplay === "number" ? " oj-datepicker-weekdisplay" : "") + (wDisabled ? " oj-disabled " : " oj-enabled oj-default ") + "' tabindex=-1 data-handler='calendarKey' data-event='keydown' aria-readonly='true' role='grid' " + "aria-labelledby='" + this._GetSubId(this._CALENDAR_DESCRIPTION_ID) + "'><thead role='presentation'>" + "<tr role='row'>";
        thead = (weekDisplay === "number" ? "<th class='oj-datepicker-week-col'>" + this._EscapeXSS(this.getTranslatedString("weekHeader")) + "</th>" : "");
        for (dow = 0;dow < 7;dow++)
        {
          // days of the week
          day = (dow + parseInt(firstDay, 10)) % 7;
          thead += "<th role='columnheader' aria-label='" + dayNames[day] + "'" + ((dow + firstDay + 6) % 7 >= 5 ? " class='oj-datepicker-week-end'" : "") + ">" + "<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
        }
        calender += thead + "</tr></thead><tbody role='presentation'>";
        daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
        if (drawYear === selectedYear && drawMonth === selectedMonth)
        {
          selectedDay = Math.min(selectedDay, daysInMonth);
        }
        leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
        curRows = Math.ceil((leadDays + daysInMonth) / 7);// calculate the number of rows to generate
        numRows = (isMultiMonth ? this._maxRows > curRows ? this._maxRows : curRows : curRows);//If multiple months, use the higher number of rows (see #7043)
        this._maxRows = numRows;
        printDate = new Date(drawYear, drawMonth, 1 - leadDays);
        for (dRow = 0;dRow < numRows;dRow++)
        {
          // create date picker rows
          calender += "<tr role='row'>";

          calculatedWeek = this._GetConverter().calculateWeek(converterUtils.dateToLocalIso(printDate));
          tbody = (weekDisplay === "none" ? "" : "<td class='oj-datepicker-week-col' role='rowheader' aria-label='" + weekText + " " + calculatedWeek + "'>" + calculatedWeek + "</td>");
          for (dow = 0;dow < 7;dow++)
          {
            // create date picker days
            otherMonth = (printDate.getMonth() !== drawMonth);
            selected = printDate.getTime() === valueDate.getTime();
            rowCellId = "oj-dp-" + this["uuid"] + "-" + dRow + "-" + dow + "-" + row + "-" + col;
            dayOverClass = (printDate.getTime() === compareDate.getTime() && drawMonth === this._currentMonth);
            if (dayOverClass)
            {
              dayOverId = rowCellId;
              dayOverClassStr = " " + this._DAYOVER_CLASS;
            }
            else
            {
              dayOverClassStr = "";
            }

            daySettings = [true, ""];
            var pYear = printDate.getFullYear(),
                pMonth = printDate.getMonth(),
                pDate = printDate.getDate();

            if (dayFormatter)
            {
              currMetaData = dayFormatter({"fullYear": pYear, "month": pMonth+1, "date": pDate}); //request to start from 1 rather than 0
              if (currMetaData)
              {
                //has content
                daySettings = [!currMetaData["disabled"], currMetaData["className"] || ""];
                if (currMetaData["tooltip"])
                {
                  daySettings.push(currMetaData["tooltip"]);
                }
              }
            }
            var selectedDate = printDate.getTime() === valueDate.getTime();

            unselectable = (otherMonth && daysOutsideMonth !== "selectable") || !daySettings[0] || this._outSideMinMaxRange(printDate, minDateParams, maxDateParams);
            tbody += "<td role='gridcell' aria-disabled='" + !!unselectable + "' aria-selected='" + selected + "' id='" + rowCellId + "' " + "class='" + ((dow + firstDay + 6) % 7 >= 5 ? " oj-datepicker-week-end" : "") + // highlight weekends
(otherMonth ? " oj-datepicker-other-month" : "") + // highlight days from other months
(dayOverClassStr) + // highlight selected day
(unselectable || wDisabled ? " " + this._UNSELECTABLE_CLASS + " oj-disabled" : " oj-enabled ") + // highlight unselectable days
(otherMonth && daysOutsideMonth === "hidden" ? "" : " " + daySettings[1] + // highlight custom dates
(selected ? " " + this._CURRENT_CLASS : "") + // highlight selected day
(printDate.getTime() === today.getTime() ? " oj-datepicker-today" : "")) + "'" + // highlight today (if different)
((!otherMonth || daysOutsideMonth !== "hidden") && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + // cell title
(unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
(otherMonth && daysOutsideMonth === "hidden" ? "&#xa0;" : // display for other months
(unselectable || wDisabled ? "<span class='oj-disabled'>" + printDate.getDate() + "</span>" : "<a role='button' class='oj-enabled" + (selectedDate ? " oj-selected" : "") + // highlight selected day
(otherMonth ? " oj-priority-secondary" : "") + // distinguish dates from other months
"' " + (dayOverClass ? "" : "tabindex='-1' ") + " href='#'>" + printDate.getDate() + "</a>")) + "</td>";// display selectable date
            printDate.setDate(printDate.getDate() + 1);
          }
          calender += tbody + "</tr>";
        }
        drawMonth++;
        if (drawMonth > 11)
        {
          drawMonth = 0;
          drawYear++;
        }
        calender += "</tbody></table>" + (isMultiMonth ? "</div>" + ((numMonths[0] > 0 && col === numMonths[1] - 1) ? "<div class='oj-datepicker-row-break'></div>" : "") : "");
        group += calender;
      }
      html += group;
    }
    html += footerLayout;
    return {html : html, dayOverId : dayOverId};
  },

  /**
   * Generate the month and year header.
   *
   * @private
   */
  _generateMonthYearHeader : function(drawMonth, drawYear)
  {
    var changeMonth = this.options["datePicker"]["changeMonth"], changeYear = this.options["datePicker"]["changeYear"],
        positionOfMonthToYear = oj.LocaleData.isMonthPriorToYear() ? "before" : "after",
        html = "<div class='oj-datepicker-title' role='header'>", monthHtml = "", converterUtils = oj.IntlConverterUtils,
        monthNames = this.options["monthWide"],
        wDisabled = this.options["disabled"];

    // month selection
    if (monthNames)
    {
      if (changeMonth === "none")
      {
        monthHtml += "<span class='oj-datepicker-month'>" + monthNames[drawMonth] + "</span>";
      }
      else
      {
        monthHtml += "<a role='button' href='#' data-handler='selectMonthHeader' data-event='click keydown' class='oj-datepicker-month " + (wDisabled ? "oj-disabled' disabled" : "oj-enabled'") + ">";
        monthHtml += monthNames[drawMonth] + "</a>";
      }

      if (positionOfMonthToYear === "before")
      {
        html += monthHtml + (!((changeMonth === "select") && (changeYear === "select")) ? "&#xa0;" : "");
      }
    }

    // year selection
    if (!this.yearshtml)
    {
      this.yearshtml = "";
      if (changeYear === "none")
      {
        html += "<span class='oj-datepicker-year'>" + yearDisplay.format(converterUtils.dateToLocalIso(new Date(drawYear, drawMonth, 1))) + "</span>";
      }
      else
      {
        html += "<a role='button' href='#' data-handler='selectYearHeader' data-event='click keydown' class='oj-datepicker-year " + (wDisabled ? "oj-disabled' disabled" : "oj-enabled'") + ">";
        html += yearDisplay.format(converterUtils.dateToLocalIso(new Date(drawYear, drawMonth, 1))) + "</a>";
        this.yearshtml = null;
      }
    }

    if (monthNames)
    {
      if (positionOfMonthToYear === "after")
      {
        html += (!((changeMonth === "select") && (changeYear === "select")) ? "&#xa0;" : "") + monthHtml;
      }
    }

    html += "<span aria-hidden='true' class='oj-helper-hidden-accessible' id='" + this._GetSubId(this._DATEPICKER_DIALOG_DESCRIPTION_ID) + "'>";
    html += this._EscapeXSS(this.getTranslatedString("picker")) + "</span>";
    html += "<span aria-hidden='true' class='oj-helper-hidden-accessible' id='" + this._GetSubId(this._CALENDAR_DESCRIPTION_ID) + "'>";
    html += (monthNames ? (monthNames[drawMonth] + " ") : "") + yearDisplay.format(converterUtils.dateToLocalIso(new Date(drawYear, drawMonth, 1))) + "</span>";

    html += "<span aria-hidden='true' class='oj-helper-hidden-accessible' id='" + this._GetSubId(this._DATEPICKER_DESCRIPTION_ID) + "'>" + this._EscapeXSS(this.getTranslatedString("datePicker")) + "</span>";

    html += "</div>";// Close datepicker_header
    return html;
  },

  /**
   * Adjust one of the date sub-fields.
   *
   * @private
   */
  _adjustInstDate : function (offset, period)
  {
    var year = this._drawYear + (period === "Y" ? offset : 0),
        month = this._drawMonth + (period === "M" ? offset : 0),
        day = Math.min(this._currentDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
        date = new Date(year, month, day);

    this._currentDay = date.getDate();
    this._drawMonth = this._currentMonth = date.getMonth();
    this._drawYear = this._currentYear = date.getFullYear();
  },

  /**
   * Generate the HTML for the month view of the date picker.
   *
   * @private
   */
  _generateMonthHTMLContent : function(enablePrev, enableNext, converter, footerLayout, minDateParams,
                                maxDateParams, drawMonth, drawYear, valueDate, wDisabled)
  {
    var monthNames = this.options["monthWide"], monthNamesShort = this.options["monthAbbreviated"],
        html, dow, selected, rowCellId, dayOverClass, dayOverId = "", dayOverClassStr, calender, 
        printDate, dRow, tbody, unselectable;

    enablePrev = this._canAdjustYear( - 1, drawYear) && !wDisabled;
    enableNext = this._canAdjustYear( + 1, drawYear) && !wDisabled;

    html = "";

    this._maxRows = 4;

    calender = "";

    calender += this._generateHeader(drawMonth, drawYear, "all", enablePrev, enableNext);

    calender += "<table class='oj-datepicker-calendar oj-datepicker-monthview" + (wDisabled ? " oj-disabled " : " oj-enabled oj-default ") + "' tabindex=-1 data-handler='calendarKey' data-event='keydown' aria-readonly='true' role='grid' " + "aria-labelledby='" + this._GetSubId(this._CALENDAR_DESCRIPTION_ID) + "'>";

    calender += "<tbody role='presentation'>";
    printDate = new Date(drawYear, 0, 1);
    for (dRow = 0;dRow < 4;dRow++)
    {
      // create date picker rows
      calender += "<tr role='row'>";

      tbody = "";
      for (dow = 0;dow < 3;dow++)
      {
        var month = dRow * 3 + dow;
        // create date picker days
        selected = printDate.getMonth() === valueDate.getMonth();
        rowCellId = "oj-dp-" + this["uuid"] + "-" + dRow + "-" + dow + "-" + 0 + "-" + 0;
        dayOverClass = (month === this._currentMonth);
        if (dayOverClass)
        {
          dayOverId = rowCellId;
          dayOverClassStr = " " + this._DAYOVER_CLASS;
        }
        else
        {
          dayOverClassStr = "";
        }

        var selectedDate = printDate.getMonth() === valueDate.getMonth();
        var inMinYear = (minDateParams && minDateParams["fullYear"] === drawYear);
        var inMaxYear = (maxDateParams && maxDateParams["fullYear"] === drawYear);

        unselectable = !((!inMinYear || month >= minDateParams["month"]) && (!inMaxYear || month <= maxDateParams["month"]));

        tbody += "<td role='gridcell' aria-disabled='" + !!unselectable + "' aria-selected='" + selected + "' id='" + rowCellId + "' " + "class='" +
(dayOverClassStr) + // highlight selected day
(unselectable || wDisabled ? " " + this._UNSELECTABLE_CLASS + " oj-disabled" : " oj-enabled ") + // highlight unselectable days
(selected ? " " + this._CURRENT_CLASS : "") + "'" + // highlight selected day
(unselectable ? "" : " data-handler='selectMonth' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
((unselectable || wDisabled ? "<span class='oj-disabled'>" + monthNamesShort[month] + "</span>" : "<a role='button' class='oj-enabled" + (selectedDate ? " oj-selected" : "") + // highlight selected day
"' " + (dayOverClass ? "" : "tabindex='-1' ") + " href='#'>" + monthNamesShort[month] + "</a>")) + "</td>";// display selectable date
        printDate.setMonth(printDate.getMonth() + 1);
      }
      calender += tbody + "</tr>";
    }
    drawMonth++;
    if (drawMonth > 11)
    {
      drawMonth = 0;
      drawYear++;
    }
    calender += "</tbody></table>";

    html += calender;

    html += footerLayout;
    return {html : html, dayOverId : dayOverId};
  },

  /**
   * Generate the HTML for the current state of the date picker.
   *
   * @private
   */
  _generateYearHTMLContent : function(enablePrev, enableNext, converterUtils, footerLayout, minDateParams,
                                maxDateParams, drawMonth, drawYear, valueDate, wDisabled)
  {
    var html, dow, selected, rowCellId, dayOverClass, dayOverId = "", dayOverClassStr, calender, thead, 
        printDate, dRow, tbody, unselectable;

    enablePrev = this._canAdjustDecade( - 1, drawYear) && !wDisabled;
    enableNext = this._canAdjustDecade( + 1, drawYear) && !wDisabled;

    html = "";

    this._maxRows = 4;

    calender = "";

    calender += this._generateHeader(drawMonth, drawYear, "all", enablePrev, enableNext);

    calender += "<table class='oj-datepicker-calendar oj-datepicker-yearview" + (wDisabled ? " oj-disabled " : " oj-enabled oj-default ") + "' tabindex=-1 data-handler='calendarKey' data-event='keydown' aria-readonly='true' role='grid' " + "aria-labelledby='" + this._GetSubId(this._CALENDAR_DESCRIPTION_ID) + "'>";

    calender += "<tbody role='presentation'>";

    var yearRange = this._getYearRange(drawYear, minDateParams, maxDateParams);
    var baseYear = (Math.floor(drawYear / 10) * 10);
    printDate = new Date(baseYear, drawMonth, 1);
    for (dRow = 0;dRow < 4;dRow++)
    {
      // create date picker rows
      calender += "<tr role='row'>";

      tbody = "";
      for (dow = 0;dow < 3;dow++)
      {
        if (dRow == 3 && dow == 1)
          break;

        var year = baseYear + (dRow * 3) + dow;
        // create date picker days
        selected = printDate.getFullYear() === valueDate.getFullYear();
        rowCellId = "oj-dp-" + this["uuid"] + "-" + dRow + "-" + dow + "-" + 0 + "-" + 0;
        dayOverClass = (year === this._currentYear);
        if (dayOverClass)
        {
          dayOverId = rowCellId;
          dayOverClassStr = " " + this._DAYOVER_CLASS;
        }
        else
        {
          dayOverClassStr = "";
        }

        var selectedDate = printDate.getFullYear() === valueDate.getFullYear();
        var yearText = yearDisplay.format(converterUtils.dateToLocalIso(new Date(year, drawMonth, 1)));

        unselectable = (year < yearRange['startYear'] || year > yearRange['endYear']);

        tbody += "<td role='gridcell' aria-disabled='" + !!unselectable + "' aria-selected='" + selected + "' id='" + rowCellId + "' " + "class='" +
(dayOverClassStr) + // highlight selected day
(unselectable || wDisabled ? " " + this._UNSELECTABLE_CLASS + " oj-disabled" : " oj-enabled ") + // highlight unselectable days
(selected ? " " + this._CURRENT_CLASS : "") + "'" + // highlight selected day
(unselectable ? "" : " data-handler='selectYear' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
((unselectable || wDisabled ? "<span class='oj-disabled'>" + yearText + "</span>" : "<a role='button' class='oj-enabled" + (selectedDate ? " oj-selected" : "") + // highlight selected day
"' " + (dayOverClass ? "" : "tabindex='-1' ") + " href='#'>" + yearText + "</a>")) + "</td>";// display selectable date
        printDate.setFullYear(printDate.getFullYear() + 1);
      }
      calender += tbody + "</tr>";
    }
    drawMonth++;
    if (drawMonth > 11)
    {
      drawMonth = 0;
      drawYear++;
    }
    calender += "</tbody></table>";

    html += calender;

    html += footerLayout;
    return {html : html, dayOverId : dayOverId};
  },

  /**
   * Determine the selectable years.
   *
   * @private
   */
  _getYearRange : function(drawYear, minDateParams, maxDateParams)
  {
    var years, thisYear, determineYear, year, endYear;

    years = this.options["datePicker"]["yearRange"].split(":");
    thisYear = new Date().getFullYear();
    determineYear = function (value)
    {
      var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) : (value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) : parseInt(value, 10)));
      return (isNaN(year) ? thisYear : year);
    };
    year = determineYear(years[0]);
    endYear = Math.max(year, determineYear(years[1] || ""));
    year = (minDateParams ? Math.max(year, minDateParams["fullYear"]) : year);
    endYear = (maxDateParams ? Math.min(endYear, maxDateParams["fullYear"]) : endYear);

    return {'startYear': year, 'endYear': endYear};
  },

  /**
   * Determine the number of months to show.
   *
   * @private
   */
  _getNumberOfMonths : function ()
  {
    var numMonths = this.options["datePicker"]["numberOfMonths"];
    numMonths = typeof numMonths === "string" ? parseInt(numMonths, 10) : numMonths;
    return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
  },

  /**
   * Find the number of days in a given month.
   *
   * @private
   */
  _getDaysInMonth : function (year, month)
  {
    return 32 - new Date(year, month, 32).getDate();
  },

  /**
   * Find the day of the week of the first of a month.
   *
   * @private
   */
  _getFirstDayOfMonth : function (year, month)
  {
    return new Date(year, month, 1).getDay();
  },

  /**
   * Determines if we should allow a "next/prev" month display change.
   *
   * @private
   */
  _canAdjustMonth : function (offset, curYear, curMonth)
  {
    var numMonths = this._getNumberOfMonths(), date = new Date(curYear, curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1);

    if (offset < 0)
    {
      date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
    }
    return this._isInRange(date);
  },

  /**
   * Determines if we should allow a "next/prev" year display change.
   *
   * @private
   */
  _canAdjustYear : function(offset, curYear)
  {
    var date;

    if (offset < 0)
    {
      date = new Date(curYear + offset, 12, 1);
      date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
    }
    else
    {
      date = new Date(curYear + offset, 1, 1);
    }
    return this._isInRange(date);
  },

  /**
   * Determines if we should allow a "next/prev" decade display change.
   *
   * @private
   */
  _canAdjustDecade : function(offset, curYear)
  {
    var date;
    var baseYear = (Math.floor(curYear / 10) * 10);

    if (offset < 0)
    {
      date = new Date(baseYear + 9 + (offset * 10), 12, 1);
      date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
    }
    else
    {
      date = new Date(baseYear + (offset * 10), 1, 1);
    }
    return this._isInRange(date);
  },

  /**
   * Returns a boolean of whether the print date is outside the min + max range, ignoring time since if of
   * ojInputDateTime should allow selection of date and restrict based on ojInputTime.
   *
   * @private
   */
  _outSideMinMaxRange : function (printDate, minDateParams, maxDateParams)
  {
    var minDate = minDateParams ? new Date(minDateParams["fullYear"], minDateParams["month"], minDateParams["date"]) : null;
    var maxDate = maxDateParams ? new Date(maxDateParams["fullYear"], maxDateParams["month"], maxDateParams["date"]) : null;

    return (minDate !== null && printDate < minDate) || (maxDate !== null && printDate > maxDate);
  },

  /**
   * Is the given date in the accepted range?
   *
   * @param {Object} date constructed using local; however need to compare with min + max using their timezone
   * @private
   */
  _isInRange : function (date)
  {
    var yearSplit, currentYear, converterUtils = oj.IntlConverterUtils,
        converter = this._GetConverter(),
        minDate, maxDate,
        minDateIso = this._getMinMaxDateIso("min"), minYear = null,
        maxDateIso = this._getMinMaxDateIso("max"), maxYear = null, years = this.options["datePicker"]["yearRange"];

    if (years)
    {
      yearSplit = years.split(":");
      currentYear = new Date().getFullYear();
      minYear = parseInt(yearSplit[0], 10);
      maxYear = parseInt(yearSplit[1], 10);
      if (yearSplit[0].match(/[+\-].*/))
      {
        minYear += currentYear;
      }
      if (yearSplit[1].match(/[+\-].*/))
      {
        maxYear += currentYear;
      }
    }

    if(minDateIso)
    {
      //need to convert it to the same timezone as the value, since the calendar and etc
      //all work by using string manipulation of the isoString
      minDateIso = converter.parse(minDateIso);
      var minDateParams = converterUtils._dateTime(minDateIso, ["fullYear", "month", "date"], true);
      minDate = new Date(minDateParams["fullYear"], minDateParams["month"], minDateParams["date"]);
    }
    if(maxDateIso)
    {
      maxDateIso = converter.parse(maxDateIso);
      var maxDateParams = converterUtils._dateTime(maxDateIso, ["fullYear", "month", "date"], true);
      maxDate = new Date(maxDateParams["fullYear"], maxDateParams["month"], maxDateParams["date"]);
    }

    return ((!minDate || date.getTime() >= minDate.getTime()) && (!maxDate || date.getTime() <= maxDate.getTime())
            && (!minYear || date.getFullYear() >= minYear) && (!maxYear || date.getFullYear() <= maxYear));
  },

  /**
   * @protected
   * @override
   * @instance
   * @ignore
   * @memberof! oj.ojInputDate
   */
  _GetCalendarTitle : function ()
  {
    return this._EscapeXSS(this.getTranslatedString("tooltipCalendar" + (this.options["disabled"] ? "Disabled" : "")));
  },

  /**
   * To disable or enable the widget
   *
   * @private
   * @instance
   */
  _disableEnable : function (val)
  {
    if (this._triggerNode)
    {
      disableEnableSpan(this._triggerNode.children(), val);
      this._triggerNode.find("." + this._TRIGGER_CALENDAR_CLASS).attr("title", this._GetCalendarTitle());
    }

    if(val)
    {
      this._hide(this._ON_CLOSE_REASON_CLOSE);
    }

    //need to update the look, note that if it is displaying the datepicker dropdown it would be hidden in _setOption function
    if(this._isInLine)
    {
      this._updateDatepicker();
    }
  },

  /**
   * Invoke super only if it is not inline
   *
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDate
   */
  _AppendInputHelper : function ()
  {
    if (!this._isInLine)
    {
      this._superApply(arguments);
    }
  },

  /**
   * This handler will set the value from the input text element.
   *
   * @ignore
   * @protected
   * @override
   * @param {Event} event
   * @instance
   * @memberof! oj.ojInputDate
   */
  _onBlurHandler : function (event)
  {
    if(this._isInLine)
    {
      return;
    }

    this._superApply(arguments);
  },

  /**
   * This handler will be invoked when keydown is triggered for this.element. When is of inline ignore the keydowns
   *
   * @ignore
   * @protected
   * @override
   * @param {Event} event
   * @instance
   * @memberof! oj.ojInputDate
   */
  _onKeyDownHandler : function (event)
  {
    if(this._isInLine)
    {
      return;
    }

    this._superApply(arguments);

    var kc = $.ui.keyCode,
        handled = false;

    if (this._datepickerShowing())
    {

      switch (event.keyCode)
      {
        case kc.TAB:
          this._hide(this._ON_CLOSE_REASON_TAB);
          break;
        case kc.ESCAPE:
          this._hide(this._ON_CLOSE_REASON_CANCELLED);
          handled = true;
          break;
        case kc.UP: ;
        case kc.DOWN:
          this._dpDiv.find(".oj-datepicker-calendar").focus();
          handled = true;
          break;
        default: ;
      }

    }
    else
    {

      switch (event.keyCode)
      {
        case kc.UP: ;
        case kc.DOWN:
          this._SetValue(this._GetDisplayValue(), event);
          this.show();
          handled = true;
          break;
        default: ;
      }

    }

    if (handled)
    {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  },

  /**
   * Ignore for when of inline, since then this.element would be of div and has a funky nature
   *
   * @param {String} displayValue of the new string to be displayed
   *
   * @memberof! oj.ojInputDate
   * @instance
   * @protected
   * @override
  */
  _SetDisplayValue : function (displayValue)
  {
    if(!this._isInLine)
    {
      this._superApply(arguments);
    }

    this._setCurrentDate(this._getDateIso());

    //so this is a change in behavior from original design. Previously it was decided that app developer
    //would have to invoke refresh to render the calendar after setting the new value programatically; however now it is
    //required to hook it in when _SetDisplayValue is invoked [can't use _SetValue b/c that function is not invoked
    //when developer invokes ("option", "value", oj.IntlConverterUtils.dateToLocalIso(new Date()))
    if(this._datepickerShowing())
    {
      // _SetDisplayValue is called after user picks a date from picker, we dont want to bring
      //  focus to input element if the picker is showing still for the non-inline case. For the
      //  case of inline date picker, if the time picker field already had focus (brought in when
      //  the picker was hidden), we want to update the date picker, but not set focus on it.
      var focusOnCalendar = !(this._isInLine && this._timePicker && this._timePicker[0] === document.activeElement);
      this._updateDatepicker(focusOnCalendar);
    }
  },

  /**
   * Need to override since apparently we allow users to set the converter to null, undefined, and etc and when
   * they do we use the default converter
   *
   * @return {Object} a converter instance or null
   *
   * @memberof! oj.ojInputDate
   * @instance
   * @protected
   * @override
   */
  _GetConverter : function ()
  {
    return this.options['converter'] ?
        this._superApply(arguments) :
        $["oj"]["ojInputDate"]["prototype"]["options"]["converter"];
  },

  /**
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDate
   */
  _GetElementValue : function ()
  {
    return this.options['value'] || "";
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDate
   * @return {string}
   */
  _GetDefaultStyleClass : function ()
  {
    return "oj-inputdate";
  },

  /**
   * Sets up the default dateTimeRange and dateRestriction validators.
   *
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDate
   */
  _GetImplicitValidators : function ()
  {
    var ret = this._superApply(arguments);

    if(this.options['min'] != null || this.options['max'] != null)
    {
      //need to alter how the default validators work as validators are now immutable
      this._datePickerDefaultValidators[oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE] = this._getValidator("min");
    }

    if(this.options["dayFormatter"] != null)
    {
      this._datePickerDefaultValidators[oj.ValidatorFactory.VALIDATOR_TYPE_DATERESTRICTION] = this._getValidator("dayFormatter");
    }

    return $.extend(this._datePickerDefaultValidators, ret);
  },

  /**
   * Notifies the component that its subtree has been removed from the document programmatically after the component has
   * been created
   * @memberof! oj.ojInputDate
   * @instance
   * @protected
   */
  _NotifyDetached: function()
  {
    this._hide(this._ON_CLOSE_REASON_CLOSE);

    // hide sets focus to the input, so we want to call super after hide. If we didn't, then
    // the messaging popup will reopen and we don't want that.
    this._superApply(arguments);
  },

  /**
   * Notifies the component that its subtree has been made hidden programmatically after the component has
   * been created
   * @memberof! oj.ojInputDate
   * @instance
   * @protected
   */
  _NotifyHidden: function()
  {
    this._hide(this._ON_CLOSE_REASON_CLOSE);

    // hide sets focus to the input, so we want to call super after hide. If we didn't, then
    // the messaging popup will reopen and we don't want that.
    this._superApply(arguments);
  },

  _getValidator : function (key)
  {
    var validator = null;

    if(key === "min" || key === "max")
    {

      validator = getImplicitDateTimeRangeValidator(this.options, this._GetConverter(), this._GetDefaultStyleClass());
    }
    else if(key === "dayFormatter")
    {
      var dateRestrictionOptions = {'dayFormatter': this.options["dayFormatter"],
                                    'converter': this._GetConverter() };

      $.extend(dateRestrictionOptions, this.options['translations']['dateRestriction'] || {});
      validator = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATERESTRICTION).createValidator(dateRestrictionOptions);
    }

    return validator;
  },

  /**
   * Gets today's date w/o time
   *
   * @private
   * @return {Object} date
   */
  _getTodayDate : function ()
  {
    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  },

  /**
   * Retrieve the default date shown on opening.
   *
   * @private
   */
  _getDateIso : function ()
  {
    var value = this.options['value'] || this._getDefaultIsoDate();
    if(this._isDateTimeSwitcher() && this._switcherDateValue) 
    {
      value = this._switcherDateValue;
    }

    return value;
  },

  /**
   * Return the subcomponent node represented by the documented locator attribute values. <br/>
   * If the locator is null or no subId string is provided then this method returns the element that
   * this component was initalized with. <br/>
   * If a subId was provided but a subcomponent node cannot be located this method returns null.
   *
   * <p>If the <code class="prettyprint">locator</code> or its <code class="prettyprint">subId</code> is
   * <code class="prettyprint">null</code>, then this method returns the element on which this component was initalized.
   *
   * <p>If a <code class="prettyprint">subId</code> was provided but no corresponding node
   * can be located, then this method returns <code class="prettyprint">null</code>.
   *
   * @expose
   * @override
   * @memberof oj.ojInputDate
   * @instance
   *
   * @param {Object} locator An Object containing, at minimum, a <code class="prettyprint">subId</code>
   * property. See the table for details on its fields.
   *
   * @property {string=} locator.subId - A string that identifies a particular DOM node in this component.
   *
   * <p>The supported sub-ID's are documented in the <a href="#subids-section">Sub-ID's</a> section of this document.
   *
   * @property {number=} locator.index - A zero-based index, used to locate a message content node
   * or a hint node within the popup.
   * @returns {Element|null} The DOM node located by the <code class="prettyprint">subId</code> string passed in
   * <code class="prettyprint">locator</code>, or <code class="prettyprint">null</code> if none is found.
   *
   * @example <caption>Get the node for a certain subId:</caption>
   * var node = $( ".selector" ).ojInputDate( "getNodeBySubId", {'subId': 'oj-some-sub-id'} );
   */
  getNodeBySubId: function(locator)
  {
    var node = null,
        subId = locator && locator['subId'],
        dpDiv = this._dpDiv,
        dpContentDiv = this._getDatepickerContent();

    if(subId)
    {
      switch(subId)
      {
      case "oj-datepicker-content": node = dpContentDiv[0]; break;
      case "oj-inputdatetime-calendar-icon": node = $(".oj-inputdatetime-calendar-icon", this._triggerNode)[0]; break;
      case "oj-datepicker-prev-icon": node = $(".oj-datepicker-prev-icon", dpDiv)[0]; break;
      case "oj-datepicker-next-icon": node = $(".oj-datepicker-next-icon", dpDiv)[0]; break;
      case "oj-datepicker-month": node = $(".oj-datepicker-month", dpDiv)[0]; break;
      case "oj-datepicker-year": node = $(".oj-datepicker-year", dpDiv)[0]; break;
      case "oj-datepicker-current": node = $(".oj-datepicker-current", dpDiv)[0]; break;
      case "oj-inputdatetime-date-input": node = this._isInLine ? null : this.element[0]; break;
      default: node = null;
      }
    }

    // Non-null locators have to be handled by the component subclasses
    return node || this._superApply(arguments);
  },

  /**
   * Returns the subId string for the given child DOM node.  For more details, see
   * <a href="#getNodeBySubId">getNodeBySubId</a>.
   *
   * @expose
   * @override
   * @memberof oj.ojInputDate
   * @instance
   *
   * @param {!Element} node - child DOM node
   * @return {string|null} The subId for the DOM node, or <code class="prettyprint">null</code> when none is found.
   *
   * @example <caption>Get the subId for a certain DOM node:</caption>
   * // Foo is ojInputNumber, ojInputDate, etc.
   * var subId = $( ".selector" ).ojFoo( "getSubIdByNode", nodeInsideComponent );
   */
  getSubIdByNode: function(node)
  {
    var dpDiv = this._dpDiv,
        subId = null,
        checks = [{"selector": ".oj-inputdatetime-calendar-icon", "ele": this._triggerNode},
                  {"selector": ".oj-datepicker-prev-icon", "ele": dpDiv},
                  {"selector": ".oj-datepicker-next-icon", "ele": dpDiv},
                  {"selector": ".oj-datepicker-month", "ele": dpDiv},
                  {"selector": ".oj-datepicker-year", "ele": dpDiv},
                  {"selector": ".oj-datepicker-current", "ele": dpDiv}];

    if(node === dpDiv[0])
    {
      return "oj-datepicker-content";
    }
    if(!this._isInLine && node === this.element[0])
    {
      return "oj-inputdatetime-date-input";
    }

    for(var i=0, j=checks.length; i < j; i++)
    {
      var map = checks[i],
          entry = $(map["selector"], map["ele"]);

      if(entry.length === 1 && entry[0] === node)
      {
        subId = map["selector"].substr(1);
        break;
      }
    }

    return subId || this._superApply(arguments);
  },

  /**
   * Hides the datepicker. Note that this function is a no-op when renderMode is 'native'.
   *
   * @expose
   * @memberof! oj.ojInputDate
   * @instance
   */
  hide : function ()
  {
    return this._hide(this._ON_CLOSE_REASON_CLOSE);
  },

  /**
   * Hides the datepicker
   *
   * @param {string} reason - the reason that the popup is being hidden ("selection", "cancelled", "tab")
   *
   * @protected
   * @ignore
   */
  _hide : function (reason)
  {
    if (!isPickerNative(this) && this._datepickerShowing() && !this._isInLine)
    {
      this._popUpDpDiv.ojPopup("close");
      this._onClose(reason);
    }

    return this;
  },

  /**
   * Sets focus to the right place after the picker is closed
   *
   * @param {string} reason - the reason that the popup is being hidden ("selection", "cancelled", "tab")
   *
   * @protected
   * @ignore
   */
  _onClose : function (reason)
  {
    if(this._isMobile && this.options["datePicker"]["showOn"] === "focus")
    {
      this._inputContainer.focus();
    }
    else
    {
      if(this.options["datePicker"]["showOn"] === "focus")
      {
        this._ignoreShow = true;
      }
      this.element.focus();
    }
  },

  /**
   * @expose
   * @memberof! oj.ojInputDate
   * @instance
   */
  refresh : function ()
  {
    if(this._triggerNode)
    {
      this._triggerNode.find("." + this._TRIGGER_CALENDAR_CLASS).attr("title", this._GetCalendarTitle());
    }
    return this._superApply(arguments) || this;
  },

  /**
   * Shows the datepicker
   *
   * @expose
   * @memberof! oj.ojInputDate
   * @instance
   */
  show : function ()
  {
    if (this._datepickerShowing() || this.options["disabled"] || this.options["readOnly"])
    {
      return;
    }

    if (this._ignoreShow)
    {
      //set within hide or elsewhere and focus is placed back on this.element
      this._ignoreShow = false;
      return;
    }

    if (isPickerNative(this))
    {
      // our html picker is inside popup, which will take care of removing focus from input element,
      //  for native case we do it explicitly
      this.element.blur();

      // picker expects the fields like 'date' and 'mode' to retain its names. Use bracket notation
      //  to avoid closure compiler from renaming them
      var pickerOptions = {};
      pickerOptions['date'] = _getNativePickerDate(this._getNativeDatePickerConverter(), this._getDateIso());
      pickerOptions['mode'] = "date";

      return this._ShowNativeDatePicker(pickerOptions);
    }
    else
    {
      return this._ShowHTMLDatePicker();
    }
  },

  /**
   * TODO: Technically i think should be used for the calendar, but later since late in release
   * @ignore
   */
  _getNativeDatePickerConverter: function () {
    if(this._nativePickerConverter === null) {
      var resolvedOptions = this._GetConverter().resolvedOptions();
      var options = {};
      $.extend(options, resolvedOptions, {"isoStrFormat": "offset"});

      this._nativePickerConverter = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter(options);
    }

    return this._nativePickerConverter;
  },

  /**
   * Shows the native datepicker
   *
   * @protected
   * @memberof! oj.ojInputDate
   * @instance
   */
  _ShowNativeDatePicker : function (pickerOptions)
  {
    var minDate = this._getMinMaxDateIso("min");
    var maxDate = this._getMinMaxDateIso("max");
    var conv = this._getNativeDatePickerConverter();

    if (minDate)
    {
      pickerOptions['minDate'] = _getNativePickerDate(conv, minDate).valueOf();
    }

    if (maxDate)
    {
      pickerOptions['maxDate'] = _getNativePickerDate(conv, minDate).valueOf();
    }

    var self = this;

    // onError is called only for Android for cases where picker is cancelled, or if there were
    //  to be any error at the native picker end
    function onError(error)
    {
      self._nativePickerShowing = false;

      // if user cancels the picker dialog, we just bring the focus back
      // closure compiler renames 'startsWith', using bracket notation hence
      if (error["startsWith"]('cancel'))
      {
        self._onClose(self._ON_CLOSE_REASON_CANCELLED);
      }
      else
      {
        oj.Logger.log('Error: native date or time picker failed: ' + error);
      }
    }

    self._nativePickerShowing = true;

    // datePicker is variable at the top level available when the cordova date picker plugin is
    //  included.
    window['datePicker'].show(pickerOptions, $.proxy(this._OnDatePicked, this), onError);
  },

  /**
   * callback upon picking date from native picker
   *
   * @protected
   * @memberof! oj.ojInputDate
   * @instance
   */
  _OnDatePicked : function (date)
  {
    this._nativePickerShowing = false;

    // for iOS and windows, from the current implementation of the native datepicker plugin,
    //  for case when the picker is cancelled, this callback gets called without the parameter
    if (date)
    {
      // Explicitly setting timezone is supported only in iOS, and we do not have a need to do
      //  so at this time, so not exposing this feature for now.
      // The native date picker will preserve the timezone set on the supplied date upon returning,
      // however the returned value has its time part reset to 00:00 when in 'date' mode
      //  - need to copy time over hence
      var isoString = oj.IntlConverterUtils._dateTime(this._getDateIso(), {"month": date.getMonth(), "date": date.getDate(), "fullYear": date.getFullYear()});
      var formattedTime = this._GetConverter().format(isoString);

      // _SetValue will inturn call _SetDisplayValue
      this._SetValue(formattedTime, {});
    }

    this._onClose(this._ON_CLOSE_REASON_SELECTION);
  },

  /**
   * Shows the HTML datepicker
   *
   * @ignore
   */
  _ShowHTMLDatePicker : function ()
  {
    var rtl = this._IsRTL();

    this._switcherPrevValue = this._getDateIso();
    this._switcherPrevDay = this._currentDay;
    this._switcherPrevMonth = this._currentMonth;
    this._switcherPrevYear = this._currentYear;

    //to avoid flashes on Firefox
    this._getDatepickerContent().empty();
    this._updateDatepicker();

    if(!_isLargeScreen)
    {
      this._popUpDpDiv.ojPopup("open", this.element.parent(), {
        "my" : {"horizontal":"center", "vertical": "bottom"},
        "at" : {"horizontal":"center", "vertical": "bottom"},
        "of" : window,
        "collision" : "flipfit flipfit"
      });
    }
    else
    {
      var position = oj.PositionUtils.normalizeHorizontalAlignment({"my" : "start top", "at" : "start bottom", "of" : this.element, "collision" : "flipfit flipfit"}, rtl);
      this._popUpDpDiv.ojPopup("open", this.element.parent(), position);
    }
    
    return this;
  }
});

// Add custom getters for properties
oj.Components.setDefaultOptions(
{
  'ojInputDate':
  {
    'firstDayOfWeek': oj.Components.createDynamicPropertyGetter(
      function()
      {
         return oj.LocaleData.getFirstDayOfWeek();
      }),

    'dayWide': oj.Components.createDynamicPropertyGetter(
      function()
      {
         return oj.LocaleData.getDayNames("wide");
      }),

    'dayNarrow': oj.Components.createDynamicPropertyGetter(
      function()
      {
          return oj.LocaleData.getDayNames("narrow");
      }),

    'monthWide': oj.Components.createDynamicPropertyGetter(
      function()
      {
         return oj.LocaleData.getMonthNames("wide");
      }),

    'monthAbbreviated': oj.Components.createDynamicPropertyGetter(
      function()
      {
         return oj.LocaleData.getMonthNames("abbreviated");
      }),

    'datePicker': oj.Components.createDynamicPropertyGetter(
      function()
      {
        return (oj.ThemeUtils.parseJSONFromFontFamily('oj-inputdatetime-option-defaults') || {})["datePicker"];
      }),

    'renderMode': oj.Components.createDynamicPropertyGetter(
      function()
      {
        return (oj.ThemeUtils.parseJSONFromFontFamily('oj-inputdatetime-option-defaults') || {})["renderMode"];
      }),

    'keyboardEdit': oj.Components.createDynamicPropertyGetter(
      function()
      {
        return (oj.ThemeUtils.parseJSONFromFontFamily('oj-inputdatetime-option-defaults') || {})["keyboardEdit"];
      })
    }
  }
);

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
 *     <tr>
 *       <td>Input element and calendar trigger icon</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>When not inline, shows the grid and moves the focus into the expanded date grid</td>
 *     </tr>
 *     <tr>
 *       <td>Input element with picker open</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Set focus to the input. If hints, title or messages exist in a notewindow,
 *        pop up the notewindow.</td>
 *     </tr>
 *     {@ojinclude "name":"labelTouchDoc"}
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Swipe Left</kbd></td>
 *       <td>Switch to next month (or previous month on RTL page).</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Swipe Right</kbd></td>
 *       <td>Switch to previous month (or next month on RTL page).</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputDate
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
 *       <td><kbd>DownArrow or UpArrow</kbd></td>
 *       <td>Shows the calender grid and moves the focus into the expanded grid</td>
 *     </tr>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Close the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>Tab In</kbd></td>
 *       <td>Set focus to the input. If hints, title or messages exist in a notewindow,
 *        pop up the notewindow.</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Select the currently focused day</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Move up in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move down in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move right in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move left in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Close the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Home</kbd></td>
 *       <td>Move focus to first day of the month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>End</kbd></td>
 *       <td>Move focus to last day of the month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>PageUp</kbd></td>
 *       <td>Switch to previous month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>PageDown</kbd></td>
 *       <td>Switch to next month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Alt + PageUp</kbd></td>
 *       <td>Switch to previous year.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Alt + PageDown</kbd></td>
 *       <td>Switch to next year.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + PageUp</kbd></td>
 *       <td>Switch to previous by stepBigMonths.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + PageDown</kbd></td>
 *       <td>Switch to next by stepBigMonths.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + T</kbd></td>
 *       <td>Places focus on Today button if it exists.</tr>
 *     </tr>
 *     {@ojinclude "name":"labelKeyboardDoc"}
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputDate
 */


//////////////////     SUB-IDS     //////////////////

/**
 * <p>Sub-ID for the ojInputDate and ojInputDateTime component's input element. Note that if component is inline for
 * ojInputDate it would return null whereas ojInputDateTime would return the input element of the internally created
 * ojInputTime component.
 *
 * @ojsubid oj-inputdatetime-date-input
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the node for the input element:</caption>
 * var node = $( ".selector" ).ojInputDate( "getNodeBySubId", {'subId': 'oj-inputdatetime-date-input'} );
 */

/**
 * <p>Sub-ID for the calendar drop down node.
 *
 * @ojsubid oj-datepicker-content
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the calendar drop down node:</caption>
 * // Foo is ojInputDate or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-datepicker-content'} );
 */

/**
 * <p>Sub-ID for the calendar icon that triggers the calendar drop down.
 *
 * @ojsubid oj-inputdatetime-calendar-icon
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the calendar icon that triggers the calendar drop down:</caption>
 * // Foo is ojInputDate or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-inputdatetime-calendar-icon'} );
 */

/**
 * <p>Sub-ID for the previous month icon.
 *
 * @ojsubid oj-datepicker-prev-icon
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the previous month icon:</caption>
 * // Foo is ojInputDate or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-datepicker-prev-icon'} );
 */

/**
 * <p>Sub-ID for the next month icon.
 *
 * @ojsubid oj-datepicker-next-icon
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the next month icon:</caption>
 * // Foo is ojInputDate or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-datepicker-next-icon'} );
 */

/**
 * <p>Sub-ID for the month span or select element.
 *
 * @ojsubid oj-datepicker-month
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the month span or select element:</caption>
 * // Foo is ojInputDate or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-datepicker-month'} );
 */

/**
 * <p>Sub-ID for the year span or select element.
 *
 * @ojsubid oj-datepicker-year
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the year span or select element:</caption>
 * // Foo is ojInputDate or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-datepicker-year'} );
 */

/**
 * <p>Sub-ID for the current/today button for button bar.
 *
 * @ojsubid oj-datepicker-current
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the current/today button for button bar:</caption>
 * // Foo is ojInputDate or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-datepicker-current'} );
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Helper function to split the timeIncrement into its constituents and returns the split object.
 * Used in ojInputTime and ojInputDateTime
 *
 * @ignore
 */
function splitTimeIncrement(timeIncrement)
{
  var splitIncrement = timeIncrement.split(":");

  if (splitIncrement.length !== 4)
  {
    throw new Error("timeIncrement value should be in the format of hh:mm:ss:SSS");
  }

  var increments =
  {
    hourIncr : parseInt(splitIncrement[0].substring(0), 10),
    minuteIncr : parseInt(splitIncrement[1], 10),
    secondIncr : parseInt(splitIncrement[2], 10),
    millisecondIncr : parseInt(splitIncrement[3], 10)
  };

  var sum = 0;
  for(var key in increments) {
    sum += increments[key];
  }

  if(sum === 0) {
    throw new Error("timeIncrement must have a non 00:00:00:000 value");
  }

  return increments;
}

/**
 * Helper function to create a timepicker converter
 *
 * @ignore
 * @param {Object} converter
 * @param {Object=} addOpts
 * @return {Object}
 */
function _getTimePickerConverter(converter, addOpts) {
  var resolvedOptions = converter.resolvedOptions();
  var options = { };
  var params = ["hour", "hour12", "minute", "second", "millisecond", "timeFormat",
      "timeZone", "timeZoneName", "isoStrFormat", "dst"], i, j;

  for (i = 0, j = params.length;i < j;i++)
  {
    if (params[i] in resolvedOptions)
    {
      if(params[i] === "timeFormat") {
        //special case for timeFormat, formatType of time must be added
        options["formatType"] = "time";
      }
      options[params[i]] = resolvedOptions[params[i]];
    }
  }

  if ($.isEmptyObject(options))
  {
    throw new Error("Empty object for creating a time picker converter");
  }

  $.extend(options, addOpts || {});
  return oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter(options);;
}

/**
 * @ojcomponent oj.ojInputTime
 * @augments oj.inputBase
 * @since 0.6
 *
 * @classdesc
 * <h3 id="inputTimeOverview-section">
 *   JET ojInputTime Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputTimeOverview-section"></a>
 * </h3>
 *
 * <p>Description: ojInputTime provides a simple time selection drop down.
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="pseudos-section">
 *   Pseudo-selectors
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
 * </h3>
 *
 * <pre class="prettyprint">
 * <code>$( ":oj-inputTime" )            // selects all JET input on the page
 * </code>
 * </pre>
 *
 * <h3 id="binding-section">
 *   Declarative Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#binding-section"></a>
 * </h3>
 *
 * <pre class="prettyprint">
 * <code>
 *    &lt;input id="timeId" data-bind="ojComponent: {component: 'ojInputTime'}" /&gt;
 * </code>
 * </pre>
 *
 * @desc Creates or re-initializes a JET ojInputTime
 *
 * @param {Object=} options a map of option-value pairs to set on the component
 *
 * @example <caption>Initialize the input element with no options specified:</caption>
 * $( ".selector" ).ojInputTime();
 *
 * * @example <caption>Initialize the input element with some options:</caption>
 * $( ".selector" ).ojInputTime( { "disabled": true } );
 *
 * @example <caption>Initialize the input element via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;input id="timeId" data-bind="ojComponent: {component: 'ojInputTime'}" /&gt;
 */
oj.__registerWidget("oj.ojInputTime", $['oj']['inputBase'],
{
  widgetEventPrefix : "oj",

  //-------------------------------------From base---------------------------------------------------//
  _CLASS_NAMES : "oj-inputdatetime-input",
  _WIDGET_CLASS_NAMES : "oj-inputdatetime-time-only oj-component oj-inputdatetime",
  _INPUT_CONTAINER_CLASS : "oj-inputdatetime-input-container",
  _ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES : "",
  _INPUT_HELPER_KEY: "inputHelp",
  _ATTR_CHECK : [{"attr": "type", "setMandatory": "text"}],
  _GET_INIT_OPTIONS_PROPS:  [{attribute: "disabled", validateOption: true},
                             {attribute: 'pattern'},
                             {attribute: "title"},
                             {attribute: "placeholder"},
                             {attribute: "value", coerceDomValue: coerceIsoString},
                             {attribute: "required",
                              coerceDomValue: true, validateOption: true},
                             {attribute: 'readonly', option: 'readOnly',
                             validateOption: true},
                             {attribute: "min", coerceDomValue: coerceIsoString},
                             {attribute: "max", coerceDomValue: coerceIsoString}],
  //-------------------------------------End from base-----------------------------------------------//

  _TIME_PICKER_ID : "ojInputTime",
  _TRIGGER_CLASS : "oj-inputdatetime-input-trigger",
  _TRIGGER_TIME_CLASS : "oj-inputdatetime-time-icon",

  _ON_CLOSE_REASON_SELECTION: "selection",  // A selection was made
  _ON_CLOSE_REASON_CANCELLED: "cancelled",  // Selection not made
  _ON_CLOSE_REASON_TAB: "tab",              // Tab key
  _ON_CLOSE_REASON_CLOSE: "close",          // Disable or other closes

  _KEYBOARD_EDIT_OPTION_ENABLED: "enabled",
  _KEYBOARD_EDIT_OPTION_DISABLED: "disabled",

  options :
  {
    /**
     * Default converter for ojInputTime
     *
     * If one wishes to provide a custom converter for the ojInputTime override the factory returned for
     * oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
     *
     * @expose
     * @memberof! oj.ojInputTime
     * @instance
     * @default <code class="prettyprint">oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({"hour": "2-digit", "minute": "2-digit"})</code>
     */
    converter : oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter(
    {
      "hour" : "2-digit", "minute" : "2-digit"
    }),

    /**
     * Determines if keyboard entry of the text is allowed.
     * When disabled the picker must be used to select a time.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">keyboardEdit</code> option:</caption>
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojInputTime', keyboardEdit: 'disabled'}" /&gt;
     * // Example to set the default in the theme (SCSS)
     * $inputDateTimeKeyboardEditOptionDefault: disabled !default;
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputTime
     * @type {string}
     * @ojvalue {string} "enabled"  Allow keyboard entry of the time.
     * @ojvalue {string} "disabled" Changing the time can only be done with the picker.
     * @default Default value depends on the theme. In alta-android, alta-ios and alta-windows themes, the
     * default is <code class="prettyprint">"disabled"</code> and
     * it's <code class="prettyprint">"enabled"</code> for alta web theme.
     */
    keyboardEdit : "enabled",

    /**
     * The maximum selectable date. When set to null, there is no maximum.
     *
     * <ul>
     *  <li> type string - ISOString
     *  <li> null - no limit
     * </ul>
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">max</code> option:</caption>
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojInputTime', max: 'T13:30:00.000-08:00'}" /&gt;
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputTime
     * @default <code class="prettyprint">null</code>
     */
    max : undefined,

    /**
     * The minimum selectable date. When set to null, there is no minimum.
     *
     * <ul>
     *  <li> type string - ISOString
     *  <li> null - no limit
     * </ul>
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">min</code> option:</caption>
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojInputTime', min: 'T08:00:00.000-08:00'}" /&gt;
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputTime
     * @default <code class="prettyprint">null</code>
     */
    min : undefined,

    /**
     * JSON data passed when the widget is of ojInputDateTime
     *
     * {
     *  widget : dateTimePickerInstance,
     *  inline: true|false
     * }
     *
     * @expose
     * @memberof! oj.ojInputTime
     * @instance
     * @private
     */
    datePickerComp : null,

    /**
     * <p>Attributes specified here will be set on the picker DOM element when it's launched.
     * <p>The supported attributes are <code class="prettyprint">class</code> and <code class="prettyprint">style</code>, which are appended to the picker's class and style, if any.
     * Note: 1) pickerAttributes is not applied in the native theme.
     * 2) setting this option after component creation has no effect.
     *
     * @example <caption>Initialize the inputTime specifying a set of attributes to be set on the picker DOM element:</caption>
     * $( ".selector" ).ojInputTime({ "pickerAttributes": {
     *   "style": "color:blue;",
     *   "class": "my-class"
     * }});
     *
     * @example <caption>Get the <code class="prettyprint">pickerAttributes</code> option, after initialization:</caption>
     * // getter
     * var inputTime = $( ".selector" ).ojInputTime( "option", "pickerAttributes" );
     *
     * @expose
     * @memberof! oj.ojInputTime
     * @instance
     * @type {?Object}
     * @default <code class="prettyprint">null</code>
     */
    pickerAttributes: null,

    /**
     * The renderMode option allows applications to specify whether to render time picker in JET or
     * as a native picker control.</br>
     *
     * Valid values: jet, native
     *
     * <ul>
     *  <li> jet - Applications get full JET functionality.</li>
     *  <li> native - Applications get the functionality of the native picker.</li></br>
     *  Note that the native picker support is limited to Cordova plugin published
     *  at 'https://github.com/VitaliiBlagodir/cordova-plugin-datepicker'.</br>
     *  With native renderMode, the functionality that is sacrificed compared to jet renderMode are:
     *    <ul>
     *      <li>Time picker cannot be themed</li>
     *      <li>Accessibility is limited to what the native picker supports</li>
     *      <li>pickerAttributes is not applied</li>
     *      <li>Sub-IDs are not available</li>
     *      <li>hide() function is no-op</li>
     *      <li>translations sub options pertaining to the picker is not available</li>
     *      <li>'timePicker.timeIncrement' option is limited to iOS and will only take a precision of minutes</li>
     *    </ul>
     * </ul>
     *
     * @expose
     * @memberof! oj.ojInputTime
     * @instance
     * @type {string}
     * @default value depends on the theme. In alta-android, alta-ios and alta-windows themes, the
     * default is "native" and it's "jet" for alta web theme.
     *
     * @example <caption>Get or set the <code class="prettyprint">renderMode</code> option for
     * an ojInputTime after initialization:</caption>
     * // getter
     * var renderMode = $( ".selector" ).ojInputTime( "option", "renderMode" );
     * // setter
     * $( ".selector" ).ojInputTime( "option", "renderMode", "native" );
     * // Example to set the default in the theme (SCSS)
     * $inputDateTimeRenderModeOptionDefault: native !default;
     */
    renderMode : "jet",

    /**
     * <p>
     * Note that Jet framework prohibits setting subset of options which are object types.<br/><br/>
     * For example $(".selector").ojInputTime("option", "timePicker", {timeIncrement: "00:30:00:00"}); is prohibited as it will
     * wipe out all other sub-options for "timePicker" object.<br/><br/> If one wishes to do this [by above syntax or knockout] one
     * will have to get the "timePicker" object, modify the necessary sub-option and pass it to above syntax.<br/><br/>
     * Note that when renderMode is 'native', the only timePicker sub-options available are showOn and, to a limited extent, timeIncrement.<br/><br/>
     *
     * The properties supported on the timePicker option are:
     *
     * @property {string=} footerLayout Will dictate what content is shown within the footer of the wheel timepicker. <br/><br/>
     * The default value is <code class="prettyprint">{timePicker: {footerLayout: "now"}}</code> with possible values being
     * <ul>
     *   <li>"" - Do not show anything</li>
     *   <li>"now" - the now button</li>
     * </ul>
     * <br/>
     * Example <code class="prettyprint">$(".selector").ojInputTime("option", "timePicker.footerLayout", "now");</code>
     *
     * @property {string=} timeIncrement Time increment to be used for ojInputTime, the format is hh:mm:ss:SS. <br/><br/>
     * Note that when renderMode is 'native', timeIncrement option is limited to iOS and will only take a precision of minutes.<br/><br/>
     *
     * The default value is <code class="prettyprint">{timePicker: {timeIncrement': "00:05:00:00"}}</code>. <br/><br/>
     * Example <code class="prettyprint">$(".selector").ojInputTime("option", "timePicker.timeIncrement", "00:10:00:00");</code>
     *
     * @property {string=} showOn When the timepicker should be shown. <br/><br/>
     * Possible values are
     * <ul>
     *  <li>"focus" - when the element receives focus or when the trigger clock image is clicked. When the picker is closed, the field regains focus and is editable.</li>
     *  <li>"image" - when the trigger clock image is clicked</li>
     * </ul>
     * <br/>
     * Example to initialize the inputTime with showOn option specified
     * <code class="prettyprint">$(".selector").ojInputTime("option", "timePicker.showOn", "focus");</code>
     * </p>
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputTime
     * @type {Object}
     */
    timePicker:
    {
      /**
       * @expose
       */
      footerLayout : "",

      /**
       * @expose
       */
      timeIncrement : "00:05:00:00",

      /**
       * @expose
       */
      showOn : "focus"
    }

    // DOCLETS

    /**
     * The placeholder text to set on the element. Though it is possible to set placeholder
     * attribute on the element itself, the component will only read the value when the component
     * is created. Subsequent changes to the element's placeholder attribute will not be picked up
     * and page authors should update the option directly.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">placeholder</code> option:</caption>
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojInputTime', placeholder: 'Birth Date'}" /&gt;
     *
     * @example <caption>Initialize <code class="prettyprint">placeholder</code> option from html attribute:</caption>
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojInputTime'}" placeholder="User Name" /&gt;
     *
     * @default when the option is not set, the element's placeholder attribute is used if it exists.
     * If the attribute is not set then the default can be the converter hint provided by the
     * datetime converter. See displayOptions for details.
     *
     * @access public
     * @instance
     * @expose
     * @name placeholder
     * @instance
     * @memberof! oj.ojInputTime
     */

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
     * @property {Object=} options - optional Object literal of options that the validator expects.
     *
     * @example <caption>Initialize the component with validator object literal:</caption>
     * $(".selector").ojInputTime({
     *   validators: [{
     *     type: 'dateTimeRange',
     *     options : {
     *       max: 'T14:30:00',
     *       min: 'T02:30:00'
     *     }
     *   }],
     * });
     *
     * NOTE: oj.Validation.validatorFactory('dateTimeRange') returns the validator factory that is used
     * to instantiate a range validator for dateTime.
     *
     * @example <caption>Initialize the component with multiple validator instances:</caption>
     * var validator1 = new MyCustomValidator({'foo': 'A'});
     * var validator2 = new MyCustomValidator({'foo': 'B'});
     * // Foo is InputText, InputNumber, Select, etc.
     * $(".selector").ojFoo({
     *   value: 10,
     *   validators: [validator1, validator2]
     * });
     *
     * @expose
     * @name validators
     * @instance
     * @memberof oj.ojInputTime
     * @type {Array|undefined}
     */

    /**
     * The value of the ojInputTime component which should be an ISOString.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">value</code> option:</caption>
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojInputTime', value: 'T10:30:00.000'}" /&gt;
     * @example <caption>Initialize the component with the <code class="prettyprint">value</code> option specified programmatically
     * using oj.IntlConverterUtils.dateToLocalIso :</caption>
     * $(".selector").ojInputTime({'value': oj.IntlConverterUtils.dateToLocalIso(new Date())});<br/>
     * @example <caption>Get or set the <code class="prettyprint">value</code> option, after initialization:</caption>
     * // Getter: returns Today's date in ISOString
     * $(".selector").ojInputTime("option", "value");
     * // Setter: sets it to a different date
     * $(".selector").ojInputTime("option", "value", "T20:00:00-08:00");
     *
     * @expose
     * @name value
     * @instance
     * @memberof! oj.ojInputTime
     * @default When the option is not set, the element's value property is used as its initial value
     * if it exists. This value must be an ISOString.
     */

    // Events

    /**
     * Triggered when the ojInputTime is created.
     *
     * @event
     * @name create
     * @memberof oj.ojInputTime
     * @instance
     * @property {Event} event <code class="prettyprint">jQuery</code> event object
     * @property {Object} ui Currently empty
     *
     * @example <caption>Initialize the ojInputTime with the <code class="prettyprint">create</code> callback specified:</caption>
     * $( ".selector" ).ojInputTime({
     *     "create": function( event, ui ) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
     * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
     */
    // create event declared in superclass, but we still want the above API doc
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputTime
   */
  _InitOptions: function(originalDefaults, constructorOptions)
  {
    this._super(originalDefaults, constructorOptions);
    //when it is of ojInputDateTime component, do not initialize values from dom node since it's an empty input node if inline or
    //if not inline the values should be taken care of by ojInputDateTime. Note that option values would have been passed by
    //ojInputDateTime
    if(this.options["datePickerComp"] === null)
    {
      oj.EditableValueUtils.initializeOptionsFromDom(this._GET_INIT_OPTIONS_PROPS, constructorOptions, this);
    }
  },

  _getPrependNode: function() 
  {
    return this._isIndependentInput() ? $("body") : $(".oj-popup-content", this._datePickerComp.widget._popUpDpDiv.ojPopup("widget"));
  },

  /**
   * @ignore
   */
  _InitBase : function()
  {
    this._timePickerDefaultValidators = {};
    this._datePickerComp = this.options["datePickerComp"];
    this._inputContainer = null;
    this._redirectFocusToInputContainer = false;
    this._isMobile = false;

    //only case is when of showOn of focus and one hides the element [need to avoid showing]
    this._ignoreShow = false;

    // need this flag to keep track of native picker opened, there is no callback on native API
    //  to find out otherwise.
    this._nativePickerShowing = false;

    var pickerAttrs = this.options.pickerAttributes;

    var self = this;
    this._wheelPicker = $('<div class="oj-timepicker-popup" style="display:none"><div id="' + this._GetSubId(this._TIME_PICKER_ID) +
                          '" class="oj-timepicker-content"></div></div>');
    this._getPrependNode().prepend(this._wheelPicker); //@HTMLUpdateOK

    window.addEventListener('resize', function() {
      $('.oj-timepicker-content', self._wheelPicker)[_isLargeScreen ? 'removeClass' : 'addClass']('oj-timepicker-fixedheight');
      if(self._isIndependentInput() && oj.Components.isComponentInitialized(self._popUpWheelPicker, "ojPopup")) 
      {
        self._popUpWheelPicker.ojPopup("option", "modality", (_isLargeScreen ? "modeless" : "modal"));
      }
    }, false);

    if(this._isIndependentInput()) 
    {
      var animation = _isLargeScreen ? {"open": null, "close": null} : {"close": null};
      //DISABLE FOR NOW, as animation is coming quite clunky (not sure if the css of popup or of animation)
      animation = {"open": null, "close": null};

      this._popUpWheelPicker = this._wheelPicker.ojPopup(
      {
        "initialFocus": "none",
        "role": "dialog",
        "chrome": "default",
        "modality": _isLargeScreen ? "modeless" : "modal",
        "open": function () {
        },
        "beforeClose": function () {
        },
        "animateStart": function (event, ui)
        {
          if ('open' === ui.action)
          {
            event.preventDefault();
            oj.AnimationUtils.slideIn(ui.element, {"offsetY": ui.element.offsetHeight + "px"}).then(ui.endCallback);
          }
        },
        "animation": animation
      }).attr('data-oj-internal', ''); // mark internal component, used in oj.Components.getComponentElementByNode;
      this.element.attr('data-oj-popup-' + this._popUpWheelPicker.attr('id') + '-parent', ''); // mark parent of pop up

      if (pickerAttrs)
        oj.EditableValueUtils.setPickerAttributes(this._popUpWheelPicker.ojPopup("widget"), pickerAttrs);
    }
    // I want to wrap the inputTime if it is all by itself, or if it is
    // part of the inline inputDateTime component which is the inline date stacked on top of an
    // inputTime. The inline error messages will go under the inputTime part. TODO: how?
    // right now the destroy fails because I am whacking away something.. the dom.
    if (this._isIndependentInput())
      this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES += this._INPUT_CONTAINER_CLASS;
  },

  _timepickerShowing: function ()
  {
    if(this._isIndependentInput())
    {
      var picker = this._popUpWheelPicker
      return oj.Components.isComponentInitialized(picker, "ojPopup") && picker.ojPopup("isOpen") || this._nativePickerShowing;
    }
    else
    {
      var widget = this._datePickerComp.widget;
      var picker = widget._popUpDpDiv;
      return (widget._isShowingDatePickerSwitcher() && oj.Components.isComponentInitialized(picker, "ojPopup") && picker.ojPopup("isOpen")) || this._nativePickerShowing;
    }
    
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputTime
   */
  _ComponentCreate : function()
  {
    this._InitBase();

    var ret = this._superApply(arguments);

    if (this._isContainedInDateTimePicker() && !this._isDatePickerInline())
    {
      //set to nothing since then of not inline and don't want to place two component classes to
      //the same input element
      this._CLASS_NAMES = "";
    }
    else
    {
      //if isoString has a different timezone then the one provided in the converter, need to perform
      //conversion so pass it through the method
      if(this.options["value"])
      {
        var formatted = this._GetConverter()["format"](this.options["value"]);
        this._SetValue(formatted, {});
      }

      // active state handler, only in case time picker is independent
      bindActive(this);
    }

    this._processReadOnlyKeyboardEdit();

    if(this._isIndependentInput()) {
      this._attachTrigger();
    }
    
    return ret;
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputTime
   */
  _AfterCreate : function ()
  {
    var ret = this._superApply(arguments);

    if(this._isIndependentInput()) {
      disableEnableSpan(this._triggerNode.children(), this.options["disabled"]);

      var label = this.$label;
      if(this._inputContainer && label && label.length === 1) {
        var icId = this._inputContainer.attr("id");
        var LId = label.attr("id");

        if(!LId) {
          LId = this["uuid"] + "_Label";
          label.attr("id", LId);
        }

        this._inputContainer.attr("aria-labelledby", LId);
      }
    }

    return ret;
  },

  /**
   * @ignore
   * @protected
   * @override
   */
  _setOption : function (key, value, flags)
  {
    var retVal = null;
    var footer;

    //When a null, undefined, or "" value is passed in set to null for consistency
    //note that if they pass in 0 it will also set it null
    if (key === "value")
    {
      if(!value)
      {
        value = null;
      }

      retVal = this._super(key, value, flags);

      this._createWheelPickerDom();
      
      return retVal;
    }

    //set options on the timePicker wipe out the footerLayout settings
    //save footerLayout and restore after superApply
    else if (key === "timePicker" && value["footerLayout"] === undefined)
    {
      footer = this.options["timePicker"]["footerLayout"];
    }

    retVal = this._superApply(arguments);

    //restore footerLayout
    if (footer)
      this.options["timePicker"]["footerLayout"] = footer;

    if(key === "disabled" && this._isIndependentInput())
    {
      if(value)
      {
        this._hide(this._ON_CLOSE_REASON_CLOSE);
      }
      this._triggerNode.find("." + this._TRIGGER_TIME_CLASS).attr("title", this._getTimeTitle());
      disableEnableSpan(this._triggerNode.children(), value);
    }
    else if ((key === "max" || key === "min") && !this._isContainedInDateTimePicker())
    {
      //since validators are immutable, they will contain min + max as local values. B/c of this will need to recreate

      this._timePickerDefaultValidators[oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE] =
        getImplicitDateTimeRangeValidator(this.options, this._GetConverter(), this._GetDefaultStyleClass());
      this._AfterSetOptionValidators();
    }
    else if(key === "readOnly")
    {
      this._processReadOnlyKeyboardEdit();

      if (value)
      {
        this._hide(this._ON_CLOSE_REASON_CLOSE);
      }
      this._AfterSetOptionDisabledReadOnly("readOnly", oj.EditableValueUtils.readOnlyOptionOptions);
    }
    else if(key === "keyboardEdit")
    {
      this._processReadOnlyKeyboardEdit();
    }

    var redrawTimePicker = {"max": true, "min": true, "converter": true, "timePicker": true};
    if(key in redrawTimePicker)
    {
      this._createWheelPickerDom();
    }

    return retVal;
  },

  /**
   * @ignore
   * @protected
   * @override
   */
  _destroy : function ()
  {
    var retVal = this._super();

    if (this._isIndependentInput())
    {
      this.element.off("focus touchstart");
      this._wrapper.off("touchstart");
    }

    if (this._triggerNode)
    {
      this._triggerNode.remove();
    }

    if (this._wheelPicker)
      this._wheelPicker.remove();

    return retVal;
  },

  /**
   * @ignore
   */
  _processReadOnlyKeyboardEdit: function()
  {
    if(this._isIndependentInput()) 
    {
      var readonly = this.options["readOnly"] ||
            this._isKeyboardEditDisabled();
      this.element.prop("readOnly", !!readonly);
    }
  },

  /**
   * @ignore
   * @return {boolean}
   */
  _isKeyboardEditDisabled: function()
  {
    return this.options["keyboardEdit"] === this._KEYBOARD_EDIT_OPTION_DISABLED;
  },

  /**
   * Invoke super only if it is standlone or if it is part of ojInputDateTime and ojInputDateTime is inline
   *
   * @ignore
   * @protected
   * @override
   */
  _AppendInputHelper : function ()
  {
    if (this._isIndependentInput())
    {
      this._superApply(arguments);
    }
  },

  /**
   * Only time to have ojInputTime handle the display of timepicker by keyDown is when datePickerComp reference is null or
   * when it is not null and is inline
   *
   * @ignore
   * @protected
   * @override
   * @param {Event} event
   */
  _onKeyDownHandler : function (event)
  {
    if(this._isIndependentInput())
    {
      this._superApply(arguments);

      var kc = $.ui.keyCode;
      var handled = false;

      if (this._timepickerShowing())
      {
        switch (event.keyCode)
        {
          case kc.TAB: ;
            this._hide(this._ON_CLOSE_REASON_TAB);
            break;
          case kc.ESCAPE:
            this._hide(this._ON_CLOSE_REASON_CANCELLED);
            handled = true;
            break;
          case kc.UP: ;
          case kc.DOWN:
            this._getWheelPickerContent(this._wheelPicker).focus();
            
            handled = true;
            break;
          default:;
        }
      }
      else
      {
        switch (event.keyCode)
        {
          case kc.UP: ;
          case kc.DOWN:
            this._SetValue(this._GetDisplayValue(), event);
            this.show();
            handled = true;
            break;
          default:;
        }
      }

      if (handled || event.keyCode === kc.ENTER)
      {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }
  },

  _getTimeTitle: function ()
  {
    return this._EscapeXSS(this.getTranslatedString("tooltipTime" + (this.options["disabled"] ? "Disabled" : "")));
  },

  /**
   * @protected
   * @override
   * @ignore
   */
  _WrapElement: function()
  {
    this._inputContainer = this._superApply(arguments);
    this._inputContainer.attr({"role": "combobox", "aria-haspopup": "true", "tabindex": "-1"});
  },

  /**
   * When input element has focus
   * @private
   */
  _onElementFocus : function()
  {
    var showOn = this.options["timePicker"]["showOn"];

    if(this._redirectFocusToInputContainer)
    {
      this._redirectFocusToInputContainer = false;
      if (!isPickerNative(this))
      {
        this._wheelGroup.children().first().focus();
      }
      else
      {
        this._inputContainer.focus();
      }
    }
    else
    {
      if (showOn === "focus")
      {
        // pop-up date picker when focus placed on the input box
        this.show();
      }
      else
      {
        if(this._timepickerShowing())
        {
          this._hide(this._ON_CLOSE_REASON_CLOSE);
        }
      }
    }
  },

  /**
   * When input element is touched
   *
   * @ignore
   * @protected
   */
  _OnElementTouchStart : function()
  {
    var showOn = this.options["timePicker"]["showOn"];

    // If the focus is already on the text box and can't edit with keyboard
    // and show on is focus then reopen the picker.
    if(showOn === "focus")
    {
      if (this._timepickerShowing())
      {
        this._ignoreShow = true;
        this._hide(this._ON_CLOSE_REASON_CLOSE);
      }
      else
      {
        var inputActive = this.element[0] === document.activeElement;

        this.show();
        this._redirectFocusToInputContainer = true;

        // Don't change focus on wheel picker since it should have acquired focus
        if (isPickerNative(this))
        {
          if(inputActive)
          {
            this._inputContainer.focus();
          }
        }
      }
    }
  },

  /**
   * This function will create the necessary time trigger container [i.e. image to launch the time drop down]
   * and perform any attachment to events
   *
   * @private
   */
  _attachTrigger : function ()
  {
    var showOn = this.options["timePicker"]["showOn"];
    var isIndependentInput = this._isIndependentInput();
    var triggerContainer = isIndependentInput ? $("<span>").addClass(this._TRIGGER_CLASS) : $("+ span", this.element);
    var triggerTime = $("<span title='" + this._getTimeTitle() + "'/>").addClass(this._TRIGGER_TIME_CLASS + " oj-clickable-icon-nocontext oj-component-icon");

    var self = this;

    if (isIndependentInput)
    {
      this.element.on("focus", $.proxy(this._onElementFocus, this));
      this.element.on("touchstart", $.proxy(this._OnElementTouchStart, this));
    }

    var wrapper = this._isIndependentInput() ? this._wrapper : this._datePickerComp["widget"]._wrapper;
    wrapper.on("touchstart", function(e)
    {
      self._isMobile = true;
    });

    if (showOn === "image")
    {
      // we need to show the icon that we hid by display:none in the mobile themes
      triggerTime.css("display", "block");

      // In iOS theme, we defaulted to use border radius given that showOn=focus is default and
      //  we will not have trigger icon. For showOn=image case, we will show the icon, so
      //  we need to remove the border radius. iOS is the only case we use border radius, so this
      //  setting for all cases is fine.
      if (this._IsRTL())
      {
        this.element.css("border-top-left-radius", 0);
        this.element.css("border-bottom-left-radius", 0);
      }
      else
      {
        this.element.css("border-top-right-radius", 0);
        this.element.css("border-bottom-right-radius", 0);
      }
    }

    // do not attach time picker icon if not independent input mode and native picker is in use
    //  - this is because the native pickers let pick both date and time, showing one icon is
    //  sufficient and less clutter hence
    if (isIndependentInput || !isPickerNative(this))
    {
      triggerContainer.append(triggerTime); //@HTMLUpdateOK

      triggerTime.on("click", function ()
      {
        if (self._timepickerShowing())
        {
          self._hide(self._ON_CLOSE_REASON_CLOSE);
        }
        else
        {
          self.show();
        }
      });

      this._AddHoverable(triggerTime);
      this._AddActiveable(triggerTime);

      this._triggerIcon = triggerTime;
    }

    this._triggerNode = triggerContainer;

    // we need to add container only if we are in independent mode, else inputDate already would
    //  have attached it
    if (isIndependentInput)
    {
      this.element.after(triggerContainer); //@HTMLUpdateOK
    }
  },

  /**
   * Returns a boolean of whether the date is in the min + max range
   *
   * @private
   */
  _notInMinMaxRange : function (dateIso, minDateIso, maxDateIso)
  {
    var converter = this._GetConverter();

    return ((minDateIso && converter.compareISODates(dateIso, minDateIso) < 0)
          || (maxDateIso && converter.compareISODates(dateIso, maxDateIso) > 0));
  },

  _getValue : function ()
  {
    //need to use ojInputDateTime's value when created internally [i.e. for min + max and etc].
    return this._isContainedInDateTimePicker() ? this._datePickerComp["widget"].getValueForInputTime() : this.options["value"];
  },

  /**
   * So the request is to always show from 12AM - 11:xxPM in the time drop down.
   * Due to difference in timezone of the converter's timeZone + isoStrFormat, there can be conversion and
   * for that need to clean up the isoString for format.
   *
   * @private
   * @return {Object} converter
   */
  _getTimeSourceConverter: function()
  {
    if(this._timeSourceConverter === null) {
        this._timeSourceConverter = _getTimePickerConverter(this._GetConverter(), {"isoStrFormat": "offset"});
    }

    return this._timeSourceConverter;
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
    if(this._isIndependentInput())
    {
      this._superApply(arguments);
    }
  },

  /**
   * Shows the timepicker
   *
   * @expose
   * @instance
   * @memberof! oj.ojInputTime
   */
  show : function ()
  {
    if (this._timepickerShowing() || this.options["disabled"] || this.options["readOnly"])
    {
      return;
    }

    if (this._ignoreShow)
    {
      //set within hide or elsewhere and focus is placed back on this.element
      this._ignoreShow = false;
      return;
    }

    if (isPickerNative(this))
    {
      // our html picker is inside popup, which will take care of removing focus from input element,
      //  for native case we do it explicitly
      this.element.blur();
      return this._showNativeTimePicker();
    }
    else
    {
      return this._showWheelPicker();
    }
  },

  /**
   * Shows the native time picker
   *
   * @private
   */
  _showNativeTimePicker : function ()
  {
    // picker expects the fields like 'date' and 'mode' to retain its names. Use bracket notation
    //  to avoid closure compiler from renaming them
    var pickerOptions = {};
    var converter = this._getTimeSourceConverter();
    var date = _getNativePickerDate(converter, this._getValue());

    pickerOptions['date'] = date;
    pickerOptions['mode'] = 'time';

    var splitIncrements = splitTimeIncrement(this.options["timePicker"]["timeIncrement"]);

    // native picker supports only minute interval and only on iOS, we consider
    //  minute interval only when hours is not specified
    pickerOptions['minuteInterval'] = (splitIncrements.hourIncr === 0) ? splitIncrements.minuteIncr : 1;

    // if part of datetime, then get the min/max from the date component
    var minDate = this._isContainedInDateTimePicker() ?
      this._datePickerComp["widget"].options["min"] : this.options["min"];
    var maxDate = this._isContainedInDateTimePicker() ?
      this._datePickerComp["widget"].options["max"] : this.options["max"];

    if (minDate)
    {
      // get a correctly formatted ISO date string
      var minDateProcessed = _getNativePickerDate(converter, oj.IntlConverterUtils._minMaxIsoString(minDate, this._getValue()));
      pickerOptions['minDate'] = minDateProcessed.valueOf();
    }

    if (maxDate)
    {
    // get a correctly formatted ISO date string
      var maxDateProcessed = _getNativePickerDate(converter, oj.IntlConverterUtils._minMaxIsoString(maxDate, this._getValue()));
      pickerOptions['maxDate'] = maxDateProcessed.valueOf();
    }

    var self = this;

    function onTimePicked(date)
    {
      self._nativePickerShowing = false;

      // for iOS and windows, from the current implementation of the native datepicker plugin,
      //  for case when the picker is cancelled, this callback gets called without the parameter
      if (date)
      {
        // The time picker displays the time portion as is supplied, regardless of device timezone.
        //  Explicitly setting timezone is supported only in iOS, and we do not have a need to do
        //  so at this time, so not exposing this feature for now.
        //  The value returned after pick will have the supplied timezone preserved, however, the
        //  date portion will be reset to current date when in 'time' mode. This will not impact us
        //  because we extract only the time portion to be set on the component.
        var isoString = oj.IntlConverterUtils._dateTime(self._getValue(), {"hours": date.getHours(), "minutes": date.getMinutes(), "seconds": date.getSeconds()});
        var formattedTime = self._GetConverter().format(isoString);

        // _SetValue will inturn call _SetDisplayValue
        self._SetValue(formattedTime, {});
      }

      self._onClose(self._ON_CLOSE_REASON_SELECTION);
    }

    // onError is called only for Android for cases where picker is cancelled, or if there were
    //  to be any error at the native picker end
    function onError(error)
    {
      self._nativePickerShowing = false;

      // if user cancels the picker dialog, we just bring the focus back
      // closure compiler renames 'startsWith', using bracket notation hence
      if (error["startsWith"]('cancel'))
      {
        self._onClose(self._ON_CLOSE_REASON_CANCELLED);
      }
      else
      {
        oj.Logger.log('Error: native time picker failed: ' + error);
      }
    }

    this._nativePickerShowing = true;

    // datePicker is variable at the top level available when the cordova date picker plugin is
    //  included
    window['datePicker'].show(pickerOptions, onTimePicked, onError);
  },

  /**
   * Hides the timepicker. Note that this function is a no-op when renderMode is 'native'.
   *
   * @expose
   * @instance
   * @memberof! oj.ojInputTime
   */
  hide : function ()
  {
    return this._hide(this._ON_CLOSE_REASON_CLOSE);
  },

  /**
   * Hides the timepicker
   *
   * @param {string} reason - the reason that the popup is being hidden ("selection", "cancelled", "tab")
   *
   * @ignore
   * @expose
   * @memberof! oj.ojInputTime
   * @instance
   */
  _hide : function (reason)
  {
    if (!isPickerNative(this) && this._timepickerShowing())
    {
      this._popUpWheelPicker.ojPopup("close");
      
      this._onClose(reason);
    }

    return this;
  },

  /**
   * Sets focus to the right place after the picker is closed
   *
   * @param {string} reason - the reason that the popup is being hidden ("selection", "cancelled", "tab", "close")
   * @ignore
   */
  _onClose : function (reason)
  {
    if(this._isMobile && this.options["timePicker"]["showOn"] === "focus")
    {
      var inputContainer = this._isIndependentInput() ? this._inputContainer : this._datePickerComp["widget"]._inputContainer;
      inputContainer.focus();
    }
    else
    {

      if(this.options["timePicker"]["showOn"] === "focus")
      {
        if (!this._isIndependentInput())
        {
          this._datePickerComp["widget"]._ignoreShow = true;
        }
        else
        {
          this._ignoreShow = true;
        }
      }
      this.element.focus();
    }
  },

  /**
   * @expose
   * @instance
   * @memberof! oj.ojInputTime
   */
  refresh : function ()
  {
    if(this._triggerNode) {
      this._triggerNode.find("." + this._TRIGGER_TIME_CLASS).attr("title", this._getTimeTitle());
    }
    return this._superApply(arguments) || this;
  },

  /**
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputTime
   */
  _SetDisplayValue : function (displayValue)
  {
    //When not part of datePickerComp or of inline should update input element
    if (this._isIndependentInput())
    {
      this._superApply(arguments);
    }

    //so this is a change in behavior from original design. Previously it was decided that app developer
    //would have to invoke refresh to render the calendar after setting the new value programatically; however now it is
    //required to hook it in when _SetDisplayValue is invoked [can't use _SetValue b/c that function is not invoked
    //when developer invokes ("option", "value", "..")
    if(this._timepickerShowing())
    {
      this._createWheelPickerDom();
    }
  },

  /**
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputTime
   */
  _SetValue : function (newValue, event, options)
  {
    var ret = false;

    if(!this._isIndependentInput())
    {
      //never update the model if part of ojInputDateTime. Have ojInputDateTime update the model's value [otherwise 2 updates]
      //this is mainly for check of whether the format is correct [i.e when ojInputDateTime is inline], since the value
      //is always picked from the ojInputDateTime component
      
      try{
        //originally this._super call was invoked above, but the the timepicker wheel is now redrawing
        //before the below timeselected is propagated to the datetimepicker (which has the complete value that must be 
        //used and because of that kicked it down)

        var converter = this._GetConverter(),
            parsedNewValue = converter["parse"](newValue),
            converterUtils = oj.IntlConverterUtils,
            datePickerCompWidget = this._datePickerComp["widget"],
            dateTimeValue = datePickerCompWidget.getValueForInputTime() || converterUtils.dateToLocalIso(new Date());

        if(parsedNewValue && converter.compareISODates(dateTimeValue, parsedNewValue) === 0)
        {
          //need to kick out if _SetValue happened due to Blur w/o changing of value
          return false;
        }

        var isoString = converterUtils._copyTimeOver(parsedNewValue || converterUtils.dateToLocalIso(new Date()),
            dateTimeValue);

        datePickerCompWidget.timeSelected(isoString, event);

      }catch(e)
      {
        ret = this._super(newValue, null, options);
      }
    }
    else
    {
      ret = this._superApply(arguments);
    }

    return ret;
  },

  /**
   * Whether the this.element should be wrapped. Function so that additional conditions can be placed
   *
   * @ignore
   * @protected
   * @override
   * @return {boolean}
   */
  _DoWrapElement : function ()
  {
    return this._isIndependentInput();
  },

  /**
   * Whether the input element of ojInputTime is shared or not [i.e. not part of ojInputDateTime or if it has
   * been created by ojInputDateTime that is inline
   *
   * @ignore
   * @return {boolean}
   */
  _isIndependentInput : function ()
  {
    return !this._isContainedInDateTimePicker() || this._isDatePickerInline();
  },

  /**
   * @protected
   * @override
   * @return {string}
   * @instance
   * @memberof! oj.ojInputTime
   */
  _GetDefaultStyleClass : function ()
  {
    return "oj-inputtime";
  },

  /**
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputTime
   */
  _GetElementValue : function ()
  {
    return this.options['value'] || "";
  },

  /**
   * Sets up the default dateTimeRange and dateRestriction validators.
   *
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputTime
   */
  _GetImplicitValidators : function ()
  {
    var ret = this._superApply(arguments);

    if((this.options['min'] != null || this.options['max'] != null) && !this._isContainedInDateTimePicker())
    {
      //need to alter how the default validators work as validators are now immutable and to create the implicit validator only
      //if independent input [i.e. otherwise have ojInputDateTime take care of it]
      this._timePickerDefaultValidators[oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE] =
        getImplicitDateTimeRangeValidator(this.options, this._GetConverter(), this._GetDefaultStyleClass());
    }

    return $.extend(this._timePickerDefaultValidators, ret);
  },

  /**
   * Need to override since apparently we allow users to set the converter to null, undefined, and etc and when
   * they do we use the default converter
   *
   * @return {Object} a converter instance or null
   *
   * @memberof! oj.ojInputTime
   * @instance
   * @protected
   * @override
   */
  _GetConverter : function ()
  {
    return this.options['converter'] ?
            this._superApply(arguments) :
            $["oj"]["ojInputTime"]["prototype"]["options"]["converter"];
  },

  /**
   * Whether ojInputTime has been created by ojInputDateTime
   *
   * @private
   */
  _isContainedInDateTimePicker : function ()
  {
    return this._datePickerComp !== null;
  },

  /**
   * Helper function to determine whether the provided datePickerComp is inline or not
   *
   * @private
   */
  _isDatePickerInline : function ()
  {
    return this._datePickerComp["inline"];
  },

  /**
   * Notifies the component that its subtree has been removed from the document programmatically after the component has
   * been created
   * @memberof! oj.ojInputTime
   * @instance
   * @protected
   */
  _NotifyDetached: function()
  {
    this._hide(this._ON_CLOSE_REASON_CLOSE);
    // hide sets focus to the input, so we want to call super after hide. If we didn't, then
    // the messaging popup will reopen and we don't want that.
    this._superApply(arguments);
  },

  /**
   * Notifies the component that its subtree has been made hidden programmatically after the component has
   * been created
   * @memberof! oj.ojInputTime
   * @instance
   * @protected
   */
  _NotifyHidden: function()
  {
    this._hide(this._ON_CLOSE_REASON_CLOSE);
    // hide sets focus to the input, so we want to call super after hide. If we didn't, then
    // the messaging popup will reopen and we don't want that.
    this._superApply(arguments);
  },

  /**
   * Return true if the element is in the timepicker popup
   *
   * @param {?Element} element
   * @return {boolean}
   *
   * @memberof! oj.ojInputTime
   * @instance
   * @protected
   */
  _InPopup: function(element)
  {
    if (!element)
      return false;

    var picker = this._wheelPicker;
    
    return $.contains(picker[0], element);
  },

  /**
   * Generate the HTML for the header of the time picker.
   *
   * @private
   */
  _generateHeader : function()
  {
    var isRTL = this._IsRTL();

    var cancelText = this._EscapeXSS(this.getTranslatedString("cancelText"));
    var cancelButton = "<a role='button' href='#' class='oj-enabled oj-default oj-timepicker-cancel-button'" + " title='" + cancelText + "'>" + cancelText + "</a>";

    var okText = this._EscapeXSS(this.getTranslatedString("okText"));
    var okButton = "<a role='button' href='#' class='oj-enabled oj-default oj-timepicker-ok-button'" + " title='" + okText + "'>" + okText + "</a>";

    var header = "<div class='oj-timepicker-header" + (this.options["disabled"] ? " oj-disabled " : " oj-enabled oj-default ") + "'>";

    header += cancelButton;
    header += okButton;

    header += "</div>";
    return header;
  },

  /**
   * Generate the HTML for the footer of the time picker.
   *
   * @private
   */
  _generateFooter : function __generateFooter(footerLayoutDisplay, gotoTime)
  {
    var footerLayout = "";
    var currentText = this._EscapeXSS(this.getTranslatedString("currentTimeText"));
    var nowControl = "<a role='button' href='#' class='oj-timepicker-now oj-priority-secondary oj-enabled'" + ">" + currentText + "</a>";

    if(footerLayoutDisplay && footerLayoutDisplay.length > 1) //keep the code for future multiple buttons
    {
      var nowIndex = footerLayoutDisplay.indexOf("now"),
          loop = 0,
          footerLayoutButtons = [{index: nowIndex, content: (gotoTime ? nowControl : "")}];

      //rather than using several if + else statements, sort the content to add by index of the strings
      footerLayoutButtons.sort(function(a, b)
      {
        return a.index - b.index;
      });

      //continue to loop until the index > -1 [contains the string]
      while(loop < footerLayoutButtons.length && footerLayoutButtons[loop].index < 0) { loop++; }

      while(loop < footerLayoutButtons.length)
      {
        footerLayout += footerLayoutButtons[loop++].content;
      }

      if(footerLayout.length > 0)
      {
        footerLayout = "<div class='oj-timepicker-footer'>" + footerLayout + "</div>";
      }
    }
    return footerLayout;
  },

  /**
   * Get the ISO string for the min or max date limit if applicable
   *
   * @private
   */
  _getIsoDateLimit : function(converter, optionName, valueDate)
  {
    // Fetch option from correct picker
    var dateIso = this._isContainedInDateTimePicker() ? this._datePickerComp["widget"].options[optionName] : this.options[optionName];
    // Fill in date from value
    dateIso = dateIso ? oj.IntlConverterUtils._minMaxIsoString(dateIso, this._getValue()) : dateIso;
    // Move to the converter's timezone
    dateIso = dateIso ? converter.parse(dateIso) : dateIso;
    // If the dates don't match, then min or max doesn't apply to this value
    var date = dateIso ? oj.IntlConverterUtils._clearTime(dateIso) : null;
    if (valueDate && date && valueDate.substring(0, valueDate.indexOf("T")) !== date.substring(0, date.indexOf("T")))
    {
      dateIso = null;
    }

    return dateIso;
  },

  /**
   * Get the ISO string for the current value
   *
   * @private
   */
  _getIsoDateValue : function(converter)
  {
    var processDateIso = this._getValue();
    if(!processDateIso)
    {
      processDateIso = new Date();
      processDateIso.setHours(0);
      processDateIso.setMinutes(0);
      processDateIso.setSeconds(0);
      processDateIso.setMilliseconds(0);
      processDateIso = oj.IntlConverterUtils.dateToLocalIso(processDateIso);
    }
    processDateIso = converter.parse(processDateIso);

    return processDateIso;
  },

  /**
   * Get the local strings for AM/PM representation
   *
   * @private
   */
  _getAmPmStrings : function()
  {
    var factory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
    var converter = factory.createConverter({"pattern": "a"});

    return [converter.format("2016-01-01T01:00:00Z"),
            converter.format("2016-01-01T13:00:00Z")];
  },

  /**
   * @private
   * @param {jQuery} wheelPicker popup root node
   * @return {jQuery} returns the timepicker content node relative to the root node
   */
  _getWheelPickerContent: function (wheelPicker)
  {
    if (!wheelPicker)
      return null;

    var wheelPickerContent = $(wheelPicker.find(".oj-timepicker-content")[0]);
    return wheelPickerContent;
  },

  /**
   * Create the wheel timepicker DOM
   *
   * @private
   */
  _createWheelPickerDom : function __createWheelPickerDom()
  {
    var wheelPicker = this._wheelPicker;
    var wheelPickerContent = this._getWheelPickerContent(wheelPicker);

    wheelPickerContent.empty();

    var converter = this._GetConverter();
    var options = $.extend({}, converter.resolvedOptions());
    if (options.isoStrFormat === "zulu")
    {
      options.isoStrFormat = "offset";
      var factory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
      converter = factory.createConverter(options);
      options = converter.resolvedOptions();
    }

    var converterUtils = oj.IntlConverterUtils;
    var value = this._getValue();
    var date = new Date();
    if (!value)
    {
      value = oj.IntlConverterUtils.dateToLocalIso(date);
    }
    value = converter.parse(value);  // Convert to proper timezone
    var valueDate = converterUtils._clearTime(value);

    var minDateIso = this._getIsoDateLimit(converter, "min", valueDate);
    var maxDateIso = this._getIsoDateLimit(converter, "max", valueDate);

    var footerLayoutDisplay = this.options["timePicker"]["footerLayout"];

    var timePickerModel = this._timePickerModel = new TimePickerModel(null);
    var pattern = options["pattern"] || options["patternFromOptions"];
    if (pattern)
    {
      timePickerModel["format"] = pattern;
    }

    timePickerModel["ampmStrings"] = this._getAmPmStrings();

    //set increment before setting value so that positions will be calculated correctly
    var timeIncrement = this.options["timePicker"]["timeIncrement"];
    if (timeIncrement)
    {
      var splitIncrements = splitTimeIncrement(timeIncrement);
      timePickerModel["increment"] = splitIncrements.hourIncr * 60 + splitIncrements.minuteIncr;
    }

    //set value
    timePickerModel["isoValue"] = this._getIsoDateValue(converter);

    //set min and max values
    if (minDateIso)
      timePickerModel["isoMin"] = minDateIso;

    if (maxDateIso)
      timePickerModel["isoMax"] = maxDateIso;

    //add header, wheel group and footer
    if(this._isIndependentInput())
    {
      wheelPickerContent.append($(this._generateHeader(wheelPicker)));
    }
    this._wheelGroup = $(createWheelGroup(timePickerModel));
    wheelPickerContent.append(this._wheelGroup);
    wheelPickerContent.append($(this._generateFooter(footerLayoutDisplay, date)));

    //add aria labels to wheels for accessibility
    wheelPickerContent.find(".oj-timepicker-hour").attr("aria-label", this.getTranslatedString("hourWheelLabel"));
    wheelPickerContent.find(".oj-timepicker-minute").attr("aria-label", this.getTranslatedString("minuteWheelLabel"));
    wheelPickerContent.find(".oj-timepicker-meridian").attr("aria-label", this.getTranslatedString("ampmWheelLabel"));

    //add content
    //this._wheelPicker.append(wheelPicker);  ?? they are the same instance
  },

  /**
   * Shows the wheel timepicker
   *
   * @private
   */
  _showWheelPicker : function __showWheelPicker()
  {
    var self = this,
        popUpWheelPicker = this._popUpWheelPicker;

    this._createWheelPickerDom();

    //now control
    this._wheelPicker.find(".oj-timepicker-now").on('click',
      function(event)
      {
        var value = oj.IntlConverterUtils.dateToLocalIso(new Date());
        value = self._GetConverter().parse(value);  // Convert to proper timezone
        self._timePickerModel["isoValue"] = value;
        if (!self._isIndependentInput())
        {
          //when is not an independent component (i.e. part of switcher)
          //need to set the value to have datetimepicker handle the value
          self._SetValue(self._timePickerModel["isoValue"], event);
        }

        event.preventDefault();
      });

    if(this._isIndependentInput())
    {
      this._wheelPicker.find(".oj-timepicker-cancel-button").on('click',
        function(event)
        {
          event.preventDefault();
          self._hide(self._ON_CLOSE_REASON_CANCELLED);
        });

      this._wheelPicker.find(".oj-timepicker-ok-button").on('click',
        function(event)
        {
          self._SetValue(self._timePickerModel["isoValue"], event);
          event.preventDefault();
          self._hide(self._ON_CLOSE_REASON_SELECTION);
        });
    }
    else
    {
      this._wheelPicker.find(".oj-timepicker-wheel").on('blur',
        function(event)
        {
          self._SetValue(self._timePickerModel["isoValue"], event);
        });

      //need to hide the datePickerComp prior to showing timepicker
      this._datePickerComp["widget"]._togglePicker();
      //set focus on the 1st child
      this._wheelGroup.children().first().focus();
      return;
    }

    this._wheelPicker.on('keydown',
      function(event)
      {
        if (event.keyCode == $.ui.keyCode.ESCAPE)
        {
          event.preventDefault();
          self._hide(self._ON_CLOSE_REASON_CANCELLED);
        }
      });

    // ojPopup open must be passed the input container (this.element.parent)
    // as the launcher so that any event within the container won't auto-dismiss
    // the dialog.
    if(!_isLargeScreen)
    {
      popUpWheelPicker.ojPopup("open", this.element.parent(), {
        "my" : {"horizontal":"center", "vertical": "bottom"},
        "at" : {"horizontal":"center", "vertical": "bottom"},
        "of" : window,
        "collision" : "flipfit flipfit"
      });
    }
    else
    {
      var position = oj.PositionUtils.normalizeHorizontalAlignment({"my" : "start top", "at" : "start bottom", "of" : this.element, "collision" : "flipfit flipfit"}, this._IsRTL());
      popUpWheelPicker.ojPopup("open", this.element.parent(), position);
    }
    
  },

  /**
   * Return the subcomponent node represented by the documented locator attribute values. <br/>
   * If the locator is null or no subId string is provided then this method returns the element that
   * this component was initalized with. <br/>
   * If a subId was provided but a subcomponent node cannot be located this method returns null.
   *
   * <p>If the <code class="prettyprint">locator</code> or its <code class="prettyprint">subId</code> is
   * <code class="prettyprint">null</code>, then this method returns the element on which this component was initalized.
   *
   * <p>If a <code class="prettyprint">subId</code> was provided but no corresponding node
   * can be located, then this method returns <code class="prettyprint">null</code>.
   *
   * @expose
   * @override
   * @memberof oj.ojInputTime
   * @instance
   *
   * @param {Object} locator An Object containing, at minimum, a <code class="prettyprint">subId</code>
   * property. See the table for details on its fields.
   *
   * @property {string=} locator.subId - A string that identifies a particular DOM node in this component.
   *
   * <p>The supported sub-ID's are documented in the <a href="#subids-section">Sub-ID's</a> section of this document.
   *
   * @property {number=} locator.index - A zero-based index, used to locate a message content node
   * or a hint node within the popup.
   * @returns {Element|null} The DOM node located by the <code class="prettyprint">subId</code> string passed in
   * <code class="prettyprint">locator</code>, or <code class="prettyprint">null</code> if none is found.
   *
   * @example <caption>Get the node for a certain subId:</caption>
   * var node = $( ".selector" ).ojInputTime( "getNodeBySubId", {'subId': 'oj-some-sub-id'} );
   */
  getNodeBySubId: function(locator)
  {
    var node = null,
        subId = locator && locator['subId'],
        wheelPicker = this._wheelPicker,
        wheelPickerContent = this._getWheelPickerContent(wheelPicker)

    if(subId) {
      switch(subId)
      {
      case "oj-inputdatetime-time-icon": node = $(".oj-inputdatetime-time-icon", this._triggerNode)[0]; break;
      case "oj-inputdatetime-time-input": node = this.element[0]; break;

      case "oj-timepicker-content": node = wheelPickerContent ? wheelPickerContent[0] : null; break;
      case "oj-timepicker-cancel-button": node = $(".oj-timepicker-cancel-button", wheelPicker)[0]; break;
      case "oj-timepicker-ok-button": node = $(".oj-timepicker-ok-button", wheelPicker)[0]; break;
      case "oj-timepicker-hour": node = $(".oj-timepicker-hour", wheelPicker)[0]; break;
      case "oj-timepicker-minute": node = $(".oj-timepicker-minute", wheelPicker)[0]; break;
      case "oj-timepicker-meridian": node = $(".oj-timepicker-meridian", wheelPicker)[0]; break;
      case "oj-timepicker-now": node = $(".oj-timepicker-now", wheelPicker)[0]; break;

      default: node = null;
      }
    }

    return node || this._superApply(arguments);
  },

  /**
   * Returns the subId string for the given child DOM node.  For more details, see
   * <a href="#getNodeBySubId">getNodeBySubId</a>.
   *
   * @expose
   * @override
   * @memberof oj.ojInputTime
   * @instance
   *
   * @param {!Element} node - child DOM node
   * @return {string|null} The subId for the DOM node, or <code class="prettyprint">null</code> when none is found.
   *
   * @example <caption>Get the subId for a certain DOM node:</caption>
   * // Foo is ojInputNumber, ojInputTime, etc.
   * var subId = $( ".selector" ).ojFoo( "getSubIdByNode", nodeInsideComponent );
   */
  getSubIdByNode: function(node)
  {
    var timeIcon = $(".oj-inputdatetime-time-icon", this._triggerNode),
        subId = null,
        wheelPicker = this._wheelPicker,
        wheelPickerContent = this._getWheelPickerContent(wheelPicker),
        checks = [{"selector": ".oj-timepicker-cancel-button", "ele": wheelPicker},
                  {"selector": ".oj-timepicker-ok-button", "ele": wheelPicker},
                  {"selector": ".oj-timepicker-hour", "ele": wheelPicker},
                  {"selector": ".oj-timepicker-minute", "ele": wheelPicker},
                  {"selector": ".oj-timepicker-meridian", "ele": wheelPicker},
                  {"selector": ".oj-timepicker-now", "ele": wheelPicker}];


    if(node === timeIcon[0])
    {
      subId = "oj-inputdatetime-time-icon";
    }
    else if(node === this.element[0])
    {
      subId = "oj-inputdatetime-time-input";
    }
    else if(wheelPickerContent && node === wheelPickerContent[0])
    {
      subId = "oj-timepicker-content";
    }
    else
    {
      for(var i=0; i < checks.length; i++)
      {
        var map = checks[i],
            entry = $(map["selector"], map["ele"]);

        if(entry.length === 1 && entry[0] === node)
        {
          subId = map["selector"].substr(1);
          break;
        }
      }
    }

    return subId || this._superApply(arguments);
  },

  /**
   * Returns the root node
   *
   * @expose
   * @instance
   * @memberof! oj.ojInputTime
   */
  widget : function ()
  {
    return this._isIndependentInput() ? this._super() : this._datePickerComp["widget"].widget();
  }

});

// Add custom getters for properties
oj.Components.setDefaultOptions(
{
  'ojInputTime':
  {
    'renderMode': oj.Components.createDynamicPropertyGetter(
      function()
      {
        return (oj.ThemeUtils.parseJSONFromFontFamily('oj-inputdatetime-option-defaults') || {})["renderMode"];
      }),
    'keyboardEdit': oj.Components.createDynamicPropertyGetter(
      function()
      {
        return (oj.ThemeUtils.parseJSONFromFontFamily('oj-inputdatetime-option-defaults') || {})["keyboardEdit"];
      }),

    'timePicker': oj.Components.createDynamicPropertyGetter(
      function()
      {
        return (oj.ThemeUtils.parseJSONFromFontFamily('oj-inputdatetime-option-defaults') || {})["timePicker"];
      })
    }
  }
);

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
 *     <tr>
 *       <td>Input element and time trigger icon</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Shows the time picker and moves the focus into the expanded time picker</td>
 *     </tr>
 *     <tr>
 *       <td>Input element with picker open</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Set focus to the input. If hints, title or messages exist in a notewindow,
 *        pop up the notewindow.</td>
 *     </tr>
 *     {@ojinclude "name":"labelTouchDoc"}
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputTime
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
 *       <td><kbd>DownArrow or UpArrow</kbd></td>
 *       <td>Shows the time picker and moves the focus into the expanded time picker</td>
 *     </tr>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>Tab In</kbd></td>
 *       <td>Set focus to the input. If hints, title or messages exist in a notewindow,
 *        pop up the notewindow.</td>
 *     </tr>
 *     {@ojinclude "name":"labelKeyboardDoc"}
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputTime
 */

//////////////////     SUB-IDS     //////////////////

/**
 * <p>Sub-ID for the ojInputTime component's input element.</p>
 *
 * @ojsubid oj-inputdatetime-time-input
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the node for the input element:</caption>
 * var node = $( ".selector" ).ojInputTime( "getNodeBySubId", {'subId': 'oj-inputdatetime-time-input'} );
 */

/**
 * <p>Sub-ID for the time icon that triggers the time drop down display.</p>
 *
 * @ojsubid oj-inputdatetime-time-icon
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the time icon that triggers the time drop down display:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-inputdatetime-time-icon'} );
 */

/**
 * <p>Sub-ID for the time wheel picker drop down node.
 *
 * @ojsubid oj-timepicker-content
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the time wheel picker drop down node:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-timepicker-content'} );
 */

/**
 * <p>Sub-ID for the cancel button.
 *
 * @ojsubid oj-timepicker-cancel-button
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the cancel button:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-timepicker-cancel-button'} );
 */

/**
 * <p>Sub-ID for the OK button.
 *
 * @ojsubid oj-timepicker-ok-button
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the OK button:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-timepicker-ok-button'} );
 */

/**
 * <p>Sub-ID for the hour picker.
 *
 * @ojsubid oj-timepicker-hour
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the hour picker:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-timepicker-hour'} );
 */

/**
 * <p>Sub-ID for the minute picker.
 *
 * @ojsubid oj-timepicker-minute
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the minute picker:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-timepicker-minute'} );
 */

/**
 * <p>Sub-ID for the meridian picker.
 *
 * @ojsubid oj-timepicker-meridian
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the meridian picker:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-timepicker-meridian'} );
 */

/**
 * <p>Sub-ID for the now button for button bar.
 *
 * @ojsubid oj-timepicker-now
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the now/now button for button bar:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-timepicker-now'} );
 */

function createWheelItem(model, position)
{
  var _item;
  var _position;
  var _disabled = false;

  function updatePosition(newPosition)
  {
    _item.classList.remove("oj-timepicker-wheel-item-position" + _position);
    _item.classList.add("oj-timepicker-wheel-item-position" + newPosition);
    _position = newPosition;
    return Promise.resolve();
  }

  function itemFocusHandler()
  {
    _item.parentNode.focus();
  }

  var text = model.getText(position);
  if (text)
  {
    _item = document.createElement("div");
    _item.classList.add("oj-timepicker-wheel-item");
    _item.classList.add("oj-timepicker-wheel-item-position" + position);
    _position = position;
    if (model.isDisabled(position))
    {
      _disabled = true;
      _item.classList.add("oj-disabled");
    }

    _item.ojUpdatePosition = updatePosition;
    
    var content = document.createElement("div");
    content.textContent = text;
    content.classList.add("oj-timepicker-wheel-item-content");
    _item.appendChild(content);
 
    Object.defineProperty(_item, "ojDisabled", {
      'enumerable': true,
      'get': function()
      {
        return _disabled;
      },
      'set': function(disabled)
      {
        if (disabled !== _disabled)
        {
          $(_item).toggleClass("oj-disabled");
          _disabled = disabled;
        }
      }
    });
    
    // The item div and its content div can get focus from mouse click on IE,
    // which doesn't happen on other browsers.  Add a focus handler so that
    // focus can be redirected to the wheel.
    _item.addEventListener("focus", itemFocusHandler, false);
    content.addEventListener("focus", itemFocusHandler, false);
  }

  return _item;
}

/* global Promise, Hammer */

function createWheel(model, isNumber, classList)
{
  var CURRENT_POSITION = 7;
  var PAN_SPIN_THRESHOLD = 2;
  var TAP_THRESHOLDS = [0.152, 0.362, 0.638, 0.848];
  var MOMENTUM_FACTOR = 0.007;

  var KEYCODE_BACKSPACE = 8;
  var KEYCODE_UP = 38;
  var KEYCODE_DOWN = 40;

  var _wheel;
  var _items = [];
  var _panStartY;
  var _panLastSpinY;
  var _panLastZone;
  var _momentum;

  createDom(classList);
  var $wheel = $(_wheel);

  defineMethods();
  defineEvents();
  refresh();

  return _wheel;

  function createDom(classList)
  {
    _wheel = document.createElement("div");
    _wheel.classList.add("oj-timepicker-wheel");
    if (classList)
      _wheel.classList.add(classList);
    _wheel.setAttribute("id", "_ojWheel" + createWheel.counter++);
    _wheel.setAttribute("tabIndex", "0");
    _wheel.setAttribute("role", "spinbutton");
    model.wheel = _wheel;
  }

  function defineMethods()
  {
    _wheel.ojSpinUp = spinUp;
    _wheel.ojSpinDown = spinDown;
    _wheel.ojRefresh = refresh;
    _wheel.ojLinked = function()
    {
      return model["linked"];
    };
  }

  function defineEvents()
  {
    var mc = new Hammer(_wheel);
    mc.get('pan').set({ direction: Hammer["DIRECTION_VERTICAL"] });
    mc.get('swipe').set({ direction: Hammer["DIRECTION_VERTICAL"] });

    mc.on("tap", tapHander);
    mc.on("swipeup", swipeUpHandler);
    mc.on("swipedown", swipeDownHandler);

    mc.on("panstart", panStartHandler);
    mc.on("panend pancancel", panEndHandler);

    mc.on("panup pandown", panHandler);

    _wheel.addEventListener('wheel', wheelHandler, false);
    _wheel.addEventListener('keydown', keydownHandler, false);
    _wheel.addEventListener('focus', focusHandler, false);
    _wheel.addEventListener('blur', blurHandler, false);
  }

  function spinUp()
  {
    var next = _items[CURRENT_POSITION + 1];
    if (next)
    {
      spin(1);
      var oldItem = _items.shift();
      if (oldItem)
      {
        _wheel.removeChild(oldItem);
      }
      var newItem = createWheelItem(model, CURRENT_POSITION);
      if (newItem)
      {
        _wheel.appendChild(newItem);
      }
      _items.push(newItem);
    }
  }

  function spinDown()
  {
    var prev = _items[CURRENT_POSITION - 1];
    if (prev)
    {
      spin(-1);
      var oldItem = _items.pop();
      if (oldItem)
      {
        _wheel.removeChild(oldItem);
      }
      var newItem = createWheelItem(model, -CURRENT_POSITION);
      if (newItem)
      {
        _wheel.insertBefore(newItem, _items[0]);
      }
      _items.unshift(newItem);
    }
  }

  function spin(direction)
  {
    for (var i = 0; i < _items.length; i++)
    {
      var item = _items[i];
      if (item)
      {
        item.ojUpdatePosition(i - CURRENT_POSITION - direction);            
      }
    }

    _wheel.setAttribute("aria-valuenow", model.getText(0));
  }

  function refresh()
  {
    _items.forEach(function(item)
    {
      if (item)
      {
        _wheel.removeChild(item);
      }
    });
    _items = [];

    for (var offset = -CURRENT_POSITION; offset <= CURRENT_POSITION; offset++)
    {
      var item = createWheelItem(model, offset);
      if (item)
      {
        _wheel.appendChild(item);
      }

      _items.push(item);
    };

    // Set the current value on the wheel for accessibility
    _wheel.setAttribute("aria-valuenow", model.getText(0));
  }

  function keydownHandler(event)
  {
    var keyCode = event.keyCode;

    switch (keyCode) {
    case KEYCODE_UP:
      model["position"]++;
      event.preventDefault();
      break;
    case KEYCODE_DOWN:
      model["position"]--;
      event.preventDefault();
      break;
    case KEYCODE_BACKSPACE:
      model.keyboardValue = model.keyboardValue.slice(0,-1);
      event.preventDefault();
      break;

    default:
      if ((keyCode > 47 && keyCode < 58) || // number keys
          (keyCode > 95 && keyCode < 112) || // numpad keys
          (!isNumber &&(keyCode > 64 && keyCode < 91))) // letter keys
      {
        model["keyboardValue"] += event.key;
      }
      break;
    }
  }

  function tapHander(event)
  {
    _wheel.focus();
    var tapY = event["center"].y;
    var wheelTop = $wheel.offset().top;
    var wheelHeight = $wheel.height();
    var tapFraction = (tapY - wheelTop) / wheelHeight;
    var tapZone = 0;

    while ((tapZone < 4) && (tapFraction > TAP_THRESHOLDS[tapZone]))
    {
      tapZone++;
    }

    if (tapZone !== 2)
    {
      model["position"] += (tapZone - 2);
    }
  }
  
  function swipeUpHandler(event)
  {
    _wheel.focus();
    var velocity = event.velocityY;
    var extraPixels = velocity * velocity / MOMENTUM_FACTOR;
    _momentum = Math.floor(extraPixels / $wheel.height() * 5);
    event.preventDefault();
  }

  function swipeDownHandler(event)
  {
    _wheel.focus();
    var velocity = event.velocityY;
    var extraPixels = velocity * velocity / MOMENTUM_FACTOR;
    _momentum = -Math.floor(extraPixels / $wheel.height() * 5);
    event.preventDefault();
  }

  function panStartHandler(event)
  {
    _wheel.focus();
    _panStartY = _panLastSpinY = event["center"].y;
    _panLastZone = 0;
    _momentum = 0;
  }
 
  function panEndHandler(event)
  {
    _wheel.focus();
    if (_momentum)
    {
      model["position"] += _momentum;
    }
      
    _panStartY = _panLastSpinY = null;
    _panLastZone = null;
  }
 
  function panHandler(event)
  {
    _wheel.focus();
    var panY = event["center"].y;
    var newZone = Math.round(((_panStartY - panY) / $wheel.height()) * 5);
    if (newZone !== _panLastZone && Math.abs(_panLastSpinY - panY) > PAN_SPIN_THRESHOLD)
    {
      _panLastSpinY = panY;
      model["position"] += newZone - _panLastZone;
      _panLastZone = newZone;
    }
    event.preventDefault();
  }

  function wheelHandler(event)
  {
    if (event["deltaY"])
    {
      event.currentTarget.focus();
      event.preventDefault();
    }
    if (event["deltaY"] < 0)
    {
      model["position"]++;
    }
    if (event["deltaY"] > 0)
    {
      model["position"]--;
    }
  }

  function focusHandler()
  {
    model.keyboardValue = "";
    _wheel.classList.add("oj-focus");
  };

  function blurHandler()
  {
    _wheel.classList.remove("oj-focus");
    model.update();
  };
}

createWheel.counter = 0;
/**
 * @constructor
 */
function TimePickerModel(properties)
{
  /** @const */
  var ISO_TIME = /^.*T(\d{2})(?::?(\d{2}).*$)/;
  /** @const */
  var MIN_TIME = 0;
  /** @const */
  var MAX_TIME = 60 * 24;
  /** @const */
  var HOURS12 = 12 * 60;
  
  var FORMAT_MAP = {
    'h': hFormat,
    'hh': hhFormat,
    'H': HFormat,
    'HH': HHFormat,
    'k': kFormat,
    'kk': kkFormat,
    'K': KFormat,
    'KK': KKFormat,
    'mm': mmFormat
  };
  var PARSER_MAP = {
    'h': hour12Parser,
    'hh': hour12Parser,
    'H': numberParser,
    'HH': numberParser,
    'k': hour24Parser,
    'kk': hour24Parser,
    'K': numberParser,
    'KK': numberParser,
    'mm': numberParser
  };
  
  var _value = 0;

  var _increment;
  var _min = MIN_TIME;
  var _minValue = MIN_TIME;
  var _max = MAX_TIME;
  var _maxValue = MAX_TIME;

  var _format;
  var _12Hour;
  var _grouped = "auto";
  var _wheelOrder = "";
  var _ampmStrings = ["AM", "PM"];

  var _minuteModel = new WheelModel(this, {
    'valueRange': 60,
    'displayRange': 60,
    'valueMultiplier': 1,
    'displayMultiplier': 1  
  });
  var _hourModel = new WheelModel(this, {
    'valueMultiplier': 60,
    'displayMultiplier': 1
  });
  var _ampmModel = new WheelModel(this, {
    'valueRange': 2,
    'displayRange': 2,
    'formatter': ampmFormat,
    'parser': ampmParser,
    'valueMultiplier': HOURS12, 
    'displayMultiplier': 1 
  });
  var _models = [_minuteModel, _hourModel, _ampmModel];

  var _settingProps = false;
  
//  /** type {TimePickerModel} */
  var self = this;

  defineProperties();
  defineMethods();
  setProperties(properties);

  function defineProperties()
  {
    _settingProps = true;

    Object.defineProperty(self, "increment", {
      'enumerable': true,
      'get': function()
      {
        return _increment;
      },
      'set': function(increment)
      {
        _increment = Math.floor(increment);
        refreshSettings();
      }
    });
    self["increment"] = 1;

    Object.defineProperty(self, "grouped", {
      'enumerable': true,
      'get': function()
      {
        return _grouped;
      },
      'set': function(grouped)
      {
        switch (grouped)
        {
        case "auto":
        case "all":
        case "none":
        case "hoursMinutes":
        case "hoursMeridiem":
          _grouped = grouped;
          break;
        default:
          throw new Error("invalid grouped value: " + grouped);
        }

        refreshSettings();
      }
    });

    Object.defineProperty(self, "min", {
      'enumerable': true,
      'get': function()
      {
        return _min;
      },
      'set': function(min)
      {
        _min = Math.floor(min);
        refreshSettings();
      }
    });

    Object.defineProperty(self, "isoMin", {
      'enumerable': true,
      'get': function()
      {
        return minutesToIso(_min);
      },
      'set': function(iso)
      {
        var newMin = isoToMinutes(iso);
        if (!isNaN(newMin))
        {
          self["min"] = newMin;
        }
        else
        {
          console.log("Invalid ISO min time: " + iso);
        }
      }
    });

    Object.defineProperty(self, "max", {
      'enumerable': true,
      'get': function()
      {
        return _max - 1;
      },
      'set': function(max)
      {
        _max = Math.floor(max) + 1;
        refreshSettings();
      }
    });

    Object.defineProperty(self, "isoMax", {
      'enumerable': true,
      'get': function()
      {
        return minutesToIso(_max);
      },
      'set': function(iso)
      {
        var newMax = isoToMinutes(iso);
        if (!isNaN(newMax))
        {
          self["max"] = newMax;
        }
        else
        {
          console.log("Invalid ISO max time: " + iso);
        }
      }
    });

    Object.defineProperty(self, "value", {
      'enumerable': true,
      'get': function()
      {
        return _value;
      },
      'set': function(value)
      {
        _value = Math.floor(value);
        refreshSettings();

      }
    });

    Object.defineProperty(self, "isoValue", {
      'enumerable': true,
      'get': function()
      {
        return minutesToIso(_value);
      },
      'set': function(iso)
      {
        var newValue = isoToMinutes(iso);
        if (!isNaN(newValue))
        {
          self["value"] = newValue;
        }
        else
        {
          console.log("Invalid ISO value time: " + iso);
        }
      }
    });

    Object.defineProperty(self, "format", {
      'enumerable': true,
      'get': function()
      {
        return _format;
      },
      'set': function(format)
      {
        _format = format;
        // remove stuff between quotes.
        // remove anything that is not h, H, k, K, m or a
        format = format.replace(/\'[^']*\'/g, "").replace(/[^hHkKma]*/g, "");
        // Normalize multiple h, H, k, K to a single h, same for mulpiple m's
        _wheelOrder = format.replace(/(h|H|k|K)+/, "h").replace(/m+/, "m");

        var matches = format.match(/([hHkK]+)/);
        var hourCode = matches[1];
        _hourModel["formatter"] = FORMAT_MAP[hourCode];
        _hourModel["parser"] = PARSER_MAP[hourCode];
        
        matches = format.match(/(m+)/);
        var minuteCode = matches[1];
        _minuteModel["formatter"] = FORMAT_MAP[minuteCode];
        _minuteModel["parser"] = PARSER_MAP[minuteCode];

        _12Hour = _wheelOrder.indexOf("a") >= 0;
        refreshSettings();
      }
    });

    Object.defineProperty(self, "wheelOrder", {
      'enumerable': true,
      'get': function()
      {
        return _wheelOrder;
      }
    });

    Object.defineProperty(self, "ampmStrings", {
      'enumerable': true,
      'get': function()
      {
        return _ampmStrings;
      },
      'set': function(ampmStrings)
      {
        _ampmStrings = ampmStrings;
      }
    });

    _settingProps = false;
  }

  function defineMethods()
  {
    self.setProperties = setProperties;
  }

  function setProperties(properties)
  {
    try
    {
      _settingProps = true;

      if (properties)
      {
        for (var key in properties)
        {
          self[key] = properties[key];
        }
      }
    }
    finally
    {
      _settingProps = false;
      refreshSettings();
    }
  }

  /**
   * recalculates dependent values after settings change
   */
  function refreshSettings()
  {
    if (!_settingProps)
    {
      _minValue = Math.ceil(_min / _increment) * _increment;
      _maxValue = Math.ceil((_max - 1)/ _increment) * _increment;

      if (_maxValue < _minValue)
      {
        throw new Error("Invalid min and max settings with current increment: " +
                _min + " " + _max + + _increment);
      }

      if (_value < _minValue)
      {
        _value = _minValue;
      }

      if (_value > _maxValue)
      {
        _value = _maxValue;
      }

      _value = Math.round(_value / _increment) * _increment;

      if (_12Hour)
      {
        _hourModel["displayRange"] = 12;

        var grouped = _grouped;
        if (grouped === "auto")
        {
          // If the increment is a divisor or multiple of 60
          // Then use hoursMeridiem grouping
          var divisor = gcd(_increment, 60);
          if (divisor === _increment || divisor === 60)
          {
            grouped = "hoursMeridiem";
          }
          else
          {
            divisor = gcd(_increment, HOURS12);
            if (divisor === _increment)
            {
              grouped = "all";
            }
            else
            {
              grouped = "all";
            }
          }
        }

        switch (grouped)
        {
        case "all":
          _minuteModel["displayMultiplier"] = 1;
          _minuteModel["valueMultiplier"] = 1;
          _minuteModel["valueRange"] = 24 * 60;
          _minuteModel["linked"] = true;

          _hourModel["displayMultiplier"] = 60;
          _hourModel["valueMultiplier"] = 1;
          _hourModel["valueRange"] = 24 * 60;
          _hourModel["linked"] = true;

          _ampmModel["displayMultiplier"] = 1;
          _ampmModel["valueMultiplier"] = 60 * 12;
          _ampmModel["valueRange"] = 2;
          _ampmModel["linked"] = true;
          break;

        case "none":
          _minuteModel["displayMultiplier"] = 1;
          _minuteModel["valueMultiplier"] = 1;
          _minuteModel["valueRange"] = 60;
          _minuteModel["linked"] = false;

          _hourModel["displayMultiplier"] = 1;
          _hourModel["valueMultiplier"] = 60;
          _hourModel["valueRange"] = 12;
          _hourModel["linked"] = false;

          _ampmModel["displayMultiplier"] = 1;
          _ampmModel["valueMultiplier"] = 60 * 12;
          _ampmModel["valueRange"] = 2;
          _ampmModel["linked"] = false;
          break;

        case "hoursMinutes":
          _minuteModel["displayMultiplier"] = 1;
          _minuteModel["valueMultiplier"] = 1;
          _minuteModel["valueRange"] = HOURS12;
          _minuteModel["linked"] = true;

          _hourModel["displayMultiplier"] = 60;
          _hourModel["valueMultiplier"] = 1;
          _hourModel["valueRange"] = HOURS12;
          _hourModel["linked"] = true;

          _ampmModel["displayMultiplier"] = 1;
          _ampmModel["valueMultiplier"] = 60 * 12;
          _ampmModel["valueRange"] = 2;
          _ampmModel["linked"] = false;
          break;

        case "hoursMeridiem":
          _minuteModel["displayMultiplier"] = 1;
          _minuteModel["valueMultiplier"] = 1;
          _minuteModel["valueRange"] = 60;
          _minuteModel["linked"] = false;

          _hourModel["displayMultiplier"] = 1;
          _hourModel["valueMultiplier"] = 60;
          _hourModel["valueRange"] = 24;
          _hourModel["linked"] = true;

          _ampmModel["displayMultiplier"] = 1;
          _ampmModel["valueMultiplier"] = 60 * 12;
          _ampmModel["valueRange"] = 2;
          _ampmModel["linked"] = true;
          break;
        }
      }
      else // 24 hour
      {
        _hourModel["displayRange"] = 24;
        
        var grouped = _grouped;
        if (grouped === "auto")
        {
          // If the increment is a divisor or multiple of 60
          // Then no grouping
          var divisor = gcd(_increment, 60);
          if (divisor === _increment || divisor === 60)
          {
            grouped = "none";
          }
          else
          {
            grouped = "all";
          }
        }

        switch (grouped)
        {
        case "none":
        case "hoursMeridiem":
          _minuteModel["displayMultiplier"] = 1;
          _minuteModel["valueMultiplier"] = 1;
          _minuteModel["valueRange"] = 60;
          _minuteModel["linked"] = false;

          _hourModel["displayMultiplier"] = 1;
          _hourModel["valueMultiplier"] = 60;
          _hourModel["valueRange"] = 24;
          _hourModel["linked"] = false;
          break;

        case "all":
        case "hoursMinutes":
          _minuteModel["displayMultiplier"] = 1;
          _minuteModel["valueMultiplier"] = 1;
          _minuteModel["valueRange"] = 24 * 60;
          _minuteModel["linked"] = true;

          _hourModel["displayMultiplier"] = 60;
          _hourModel["valueMultiplier"] = 1;
          _hourModel["valueRange"] = 24 * 60;
          _hourModel["linked"] = true;
          break;
        }
      }

      for (var i = 0; i < _models.length; i++)
      {
        _models[i].refresh();
      }
    }
  }

  function isoToMinutes(isoString)
  {
    var matches = ISO_TIME.exec(isoString);
    var hours = parseInt(matches[1], 10);
    var minutes = parseInt(matches[2], 10);
    return hours * 60 + minutes;
  }
  function minutesToIso(minutes)
  {
    minutes = Math.floor(minutes);
    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return "T" + HHFormat(hours) + ":" + mmFormat(minutes);
  }

  function hFormat(value)
  {
    if (value === 0)
      return "12";
    
    return "" + value;
  }

  function hhFormat(value)
  {
    if (value === 0)
      return "12";
    
    value = "0" + value;
    return value.slice(-2);
  }

  function HFormat(value)
  {
    return "" + value;
  }

  function HHFormat(value)
  {
    value = "0" + value;
    return value.slice(-2);
  }

  function kFormat(value)
  {
    if (value === 0)
      return "24";
    return "" + value;
  }

  function kkFormat(value)
  {
    if (value === 0)
      return "24";
    value = "0" + value;
    return value.slice(-2);
  }

  function KFormat(value)
  {
    return "" + value;
  }

  function KKFormat(value)
  {
    value = "0" + value;
    return value.slice(-2);
  }

  function mmFormat(value)
  {
    value = "0" + value;
    return value.slice(-2);
  }

  function ampmFormat(value)
  {
    return _ampmStrings[value];
  }

  function numberParser(value)
  {
    if (value.match(/^\d+$/))
    {
      return parseInt(value, 10);
    }
    return -1;
  }

  function hour12Parser(value)
  {
    if (value.match(/^\d+$/))
    {
      var hour =  parseInt(value, 10);
      if (hour === 0)
      {
        hour = -1;
      }
      if (hour === 24)
      {
        hour = 0;
      }

      return hour;
    }
    return -1;
  }

  function hour24Parser(value)
  {
    if (value.match(/^\d+$/))
    {
      var hour =  parseInt(value, 10);
      if (hour === 0)
      {
        hour = -1;
      }
      if (hour === 24)
      {
        hour = 0;
      }

      return hour;
    }
    return -1;
  }

  function ampmParser(value)
  {
    value = value.toLowerCase().charAt();
    if (value === "a")
      return 0;
    else if (value === "p")
      return 1;
    else
      return -1;
  }

  self.getWheelModel = function(type)
  {
    switch (type)
    {
      case "hour":
        return _hourModel;

      case "minute":
        return _minuteModel;

      case "ampm":        
        return (_12Hour ? _ampmModel : null);
      default:
        console.log("Unknown wheel type: " + type);
    };
  };

  function mod(val1, val2)
  {
    // Make modulus out of remainder.  The fancy stuff deals with neg values.
    return ((val1 % val2) + val2) % val2;
  }

  function gcd(a, b) {
    if (b === 0)
    {
        return a;
    }
    return gcd(b, a % b);
  }
}


function createWheelGroup(timePickerModel)
{
  var KEYCODE_LEFT = 37;
  var KEYCODE_RIGHT = 39;


  var _group;
  var _wheels = [];

  createDom();
  defineMethods();
  defineEvents();
  refresh();

  return _group;

  function createDom()
  {
    _group = document.createElement("div");
    _group.classList.add("oj-timepicker-wheel-group");
  }
  
  function defineMethods()
  {
    _group.ojRefresh = refresh;
  }

  function defineEvents()
  {
    _group.addEventListener("keydown", keydownHandler, false);
  }

  function keydownHandler(event)
  {
    var wheel = event.target;
    var keyCode = event.keyCode;

    switch (keyCode) {
    case KEYCODE_LEFT:
      $(wheel).prev().focus();
      break;
    case KEYCODE_RIGHT:
      $(wheel).next().focus();
      break;

    default:
      break;
    }
  }

  function focusHandler(event)
  {
    var wheel = event.target;
    if (wheel.ojLinked())
    {
      for (var i = 0; i < _wheels.length; i++)
      {
        if (_wheels[i].ojLinked())
        {
          _wheels[i].classList.add("oj-active");
        }
      }
    }
    else
    {
      wheel.classList.add("oj-active");
    }
  }

  function blurHandler()
  {
    for (var i = 0; i < _wheels.length; i++)
    {
      _wheels[i].classList.remove("oj-active");
    }
  }

  function refresh()
  {
    var wheel;
    while (wheel = _group.firstChild)
    {
      _group.removeChild(wheel);
    }
    _wheels = [];

    createWheels();
  }

  function createWheels()
  {
    var wheelOrder = timePickerModel["wheelOrder"];

    var hourModel = timePickerModel.getWheelModel("hour");
    var hourWheel = createWheel(hourModel, true, "oj-timepicker-hour");
    var minuteModel = timePickerModel.getWheelModel("minute");
    var minuteWheel = createWheel(minuteModel, true, "oj-timepicker-minute");

    var ampmModel;
    var ampmWheel;
    if (wheelOrder.indexOf("a") >= 0)
    {
      ampmModel = timePickerModel.getWheelModel("ampm");
      ampmWheel = createWheel(ampmModel, false, "oj-timepicker-meridian");
    }

    var codes = wheelOrder.split("");
    var i;
    for (i = 0; i < codes.length; i++)
    {
      switch (codes[i])
      {
        case "h":
          _wheels.push(hourWheel);
          break;
        case "m":
          _wheels.push(minuteWheel);
          break;
        case "a":
          _wheels.push(ampmWheel);
          break;
        default:
          console.log("Unknown wheelOrder code: " + codes[i]);
      }
    }
    for (i = 0; i < _wheels.length; i++)
    {
      var wheel = _wheels[i];
      wheel.addEventListener("focus", focusHandler, false);
      wheel.addEventListener("blur", blurHandler, false);
      _group.appendChild(wheel);
    }
  }
}

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @private
 */
var dateSwitcherConverter = $["oj"]["ojInputDate"]["prototype"]["options"]["converter"];

/**
 * @private
 */
var timeSwitcherConverter =  $["oj"]["ojInputTime"]["prototype"]["options"]["converter"];

/**
 * @ojcomponent oj.ojInputDateTime
 * @augments oj.ojInputDate
 * @since 0.6
 * 
 * @classdesc
 * <h3 id="inputDateTimeOverview-section">
 *   JET ojInputDateTime Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputDateTimeOverview-section"></a>
 * </h3>
 * 
 * <p>Description: ojInputDateTime extends from ojInputDate providing additionally time selection drop down.</p>
 * 
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 * 
 * <h3 id="pseudos-section">
 *   Pseudo-selectors
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
 * </h3>
 * 
 * <pre class="prettyprint">
 * <code>$( ":oj-inputDateTime" )            // selects all JET input on the page
 * </code>
 * </pre>
 * 
  * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate the label to the input component.
 * For inputDateTime, you should put an <code>id</code> on the input, and then set 
 * the <code>for</code> attribute on the label to be the input's id.
 * </p>
 * <h3 id="label-section">
 *   Label and InputDateTime
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
 *    &lt;input id="dateTimeId" data-bind="ojComponent: {component: 'ojInputDateTime'}" /&gt;
 * </code>
 * </pre>
 * 
 * @desc Creates or re-initializes a JET ojInputDateTime
 * 
 * @param {Object=} options a map of option-value pairs to set on the component
 * 
 * @example <caption>Initialize the input element with no options specified:</caption>
 * $( ".selector" ).ojInputDateTime();
 * 
 * * @example <caption>Initialize the input element with some options:</caption>
 * $( ".selector" ).ojInputDateTime( { "disabled": true } );
 * 
 * @example <caption>Initialize the input element via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;input id="dateTimeId" data-bind="ojComponent: {component: 'ojInputDateTime'}" /&gt;
 */
oj.__registerWidget("oj.ojInputDateTime", $['oj']['ojInputDate'], 
{
  widgetEventPrefix : "oj",
  
  //-------------------------------------From base---------------------------------------------------//
  _WIDGET_CLASS_NAMES : "oj-inputdatetime-date-time oj-component oj-inputdatetime",
  _INPUT_HELPER_KEY: "inputHelpBoth",
  //-------------------------------------End from base-----------------------------------------------//
  _TRIGGER_CALENDAR_CLASS : "oj-inputdatetime-calendar-clock-icon",
  
  options : 
  {
    /**
     * Default converter for ojInputDateTime
     *
     * If one wishes to provide a custom converter for the ojInputDateTime override the factory returned for
     * oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDateTime
     * @default <code class="prettyprint">oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({"day": "2-digit", "month": "2-digit", "year": "2-digit", "hour": "2-digit", "minute": "2-digit"})</code>
     */
    converter : oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter(
    {
      "day" : "2-digit", "month" : "2-digit", "year" : "2-digit", "hour" : "2-digit", "minute" : "2-digit"
    }),

    /**
     * The renderMode option allows applications to specify whether to render date and time pickers 
     * in JET or as a native picker control.</br>
     * 
     * Valid values: jet, native
     *
     * <ul>
     *  <li> jet - Applications get full JET functionality.</li>
     *  <li> native - Applications get the functionality of the native picker.</li></br>
     *  Note that the native picker support is limited to Cordova plugin published 
     *  at 'https://github.com/VitaliiBlagodir/cordova-plugin-datepicker'.</br>
     *  With native renderMode, the functionality that is sacrificed compared to jet renderMode are:
     *    <ul>
     *      <li>Date and time pickers cannot be themed</li>
     *      <li>Accessibility is limited to what the native picker supports</li>
     *      <li>pickerAttributes is not applied</li>
     *      <li>Sub-IDs are not available</li>
     *      <li>hide() and hideTimePicker() functions are no-op</li>
     *      <li>translations sub options pertaining to the picker is not available</li>
     *      <li>All of the 'datepicker' sub-options except 'showOn' are not available</li>
     *      <li>'timePicker.timeIncrement' option is limited to iOS and will only take a precision of minutes</li>
     *    </ul>
     * </ul>
     *
     * @expose 
     * @memberof! oj.ojInputDateTime
     * @instance
     * @type {string}
     * @default value depends on the theme. In alta-android, alta-ios and alta-windows themes, the 
     * default is "native" and it's "jet" for alta web theme.
     *
     * @example <caption>Get or set the <code class="prettyprint">renderMode</code> option for
     * an ojInputDateTime after initialization:</caption>
     * // getter
     * var renderMode = $( ".selector" ).ojInputDateTime( "option", "renderMode" );
     * // setter
     * $( ".selector" ).ojInputDateTime( "option", "renderMode", "native" );
     * // Example to set the default in the theme (SCSS)
     * $inputDateTimeRenderModeOptionDefault: native !default;
     */
    renderMode : "jet",
    
    /**
     * <p>
     * Note that Jet framework prohibits setting subset of options which are object types.<br/><br/>
     * For example $(".selector").ojInputDateTime("option", "timePicker", {timeIncrement': "00:30:00:00"}); is prohibited as it will
     * wipe out all other sub-options for "timePicker" object.<br/><br/> If one wishes to do this [by above syntax or knockout] one
     * will have to get the "timePicker" object, modify the necessary sub-option and pass it to above syntax.<br/><br/>
     *
     * The properties supported on the timePicker option are:
     *
     * @property {string=} timeIncrement Time increment to be used for ojInputDateTime, the format is hh:mm:ss:SS. <br/><br/>
     * Note that when renderMode is 'native', timeIncrement option is limited to iOS and will only take a precision of minutes.<br/><br/> 
     *
     * The default value is <code class="prettyprint">{timePicker: {timeIncrement': "00:05:00:00"}}</code>. <br/><br/>
     * Example <code class="prettyprint">$(".selector").ojInputDateTime("option", "timePicker.timeIncrement", "00:10:00:00");</code>
     *
     * @property {string=} showOn When the timepicker should be shown. <br/><br/>
     * Possible values are
     * <ul>
     *  <li>"focus" - when the element receives focus or when the trigger clock image is clicked. When the picker is closed, the field regains focus and is editable.</li>
     *  <li>"image" - when the trigger clock image is clicked</li>
     * </ul>
     * <br/>
     * Example to initialize the inputTime with showOn option specified 
     * <code class="prettyprint">$(".selector").ojInputDateTime("option", "timePicker.showOn", "focus");</code>
     * </p>
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDateTime
     * @type {Object}
     */
    timePicker:
    {
      /**
       * @expose
       */
      timeIncrement : "00:05:00:00",

      /**
       * @expose
       */
      showOn : "focus"
    }
    
    /**
     * The maximum selectable datetime. When set to null, there is no maximum.
     *
     * <ul>
     *  <li> type string - ISOString
     *  <li> null - no limit
     * </ul>
     * 
     * @example <caption>Initialize the component with the <code class="prettyprint">max</code> option:</caption>
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojInputDateTime', max: '2014-09-25T13:30:00.000-08:00'}" /&gt;
     * 
     * @expose
     * @name max
     * @instance
     * @memberof! oj.ojInputDateTime
     * @default <code class="prettyprint">null</code>
     */
    
    /**
     * The minimum selectable date. When set to null, there is no minimum.
     *
     * <ul>
     *  <li> type string - ISOString
     *  <li> null - no limit
     * </ul>
     * 
     * @example <caption>Initialize the component with the <code class="prettyprint">min</code> option:</caption>
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojInputDateTime', min: '2014-08-25T08:00:00.000-08:00'}" /&gt;
     * 
     * @expose
     * @name min
     * @instance
     * @memberof! oj.ojInputDateTime
     * @default <code class="prettyprint">null</code>
     */
    
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
     * @property {Object=} options - optional Object literal of options that the validator expects. 
     * 
     * @example <caption>Initialize the component with validator object literal:</caption>
     * $(".selector").ojInputDateTime({
     *   validators: [{
     *     type: 'dateTimeRange', 
     *     options : {
     *       max: '2014-09-10T13:30:00.000',
     *       min: '2014-09-01T00:00:00.000'
     *     }
     *   }],
     * });
     * 
     * NOTE: oj.Validation.validatorFactory('dateTimeRange') returns the validator factory that is used 
     * to instantiate a range validator for dateTime.
     * 
     * @example <caption>Initialize the component with multiple validator instances:</caption>
     * var validator1 = new MyCustomValidator({'foo': 'A'}); 
     * var validator2 = new MyCustomValidator({'foo': 'B'});
     * // Foo is InputText, InputNumber, Select, etc.
     * $(".selector").ojFoo({
     *   value: 10, 
     *   validators: [validator1, validator2]
     * });
     * 
     * @expose 
     * @name validators
     * @instance
     * @memberof oj.ojInputDateTime
     * @type {Array|undefined}
     */
    
    /** 
     * The value of the ojInputDateTime component which should be an ISOString
     * 
     * @example <caption>Initialize the component with the <code class="prettyprint">value</code> option:</caption>
     * &lt;input id="date" data-bind="ojComponent: {component: 'ojInputDateTime', value: '2014-09-10T13:30:00.000'}" /&gt;
     * @example <caption>Initialize the component with the <code class="prettyprint">value</code> option specified programmatically 
     * using oj.IntlConverterUtils.dateToLocalIso :</caption>
     * $(".selector").ojInputDateTime({'value': oj.IntlConverterUtils.dateToLocalIso(new Date())});<br/>
     * @example <caption>Get or set the <code class="prettyprint">value</code> option, after initialization:</caption>
     * // Getter: returns Today's date in ISOString
     * $(".selector").ojInputDateTime("option", "value");
     * // Setter: sets it to a different date time
     * $(".selector").ojInputDateTime("option", "value", "2013-12-01T20:00:00-08:00");
     * 
     * @expose 
     * @name value
     * @instance
     * @memberof! oj.ojInputDateTime
     * @default When the option is not set, the element's value property is used as its initial value 
     * if it exists. This value must be an ISOString.
     */

    // Events

    /**
     * Triggered when the ojInputDateTime is created.
     *
     * @event
     * @name create
     * @memberof oj.ojInputDateTime
     * @instance
     * @property {Event} event <code class="prettyprint">jQuery</code> event object
     * @property {Object} ui Currently empty
     *
     * @example <caption>Initialize the ojInputDateTime with the <code class="prettyprint">create</code> callback specified:</caption>
     * $( ".selector" ).ojInputDateTime({
     *     "create": function( event, ui ) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
     * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
     */
    // create event declared in superclass, but we still want the above API doc
  },
  
  /**
   * @protected
   * @override
   * @instance
   * @ignore
   * @memberof! oj.ojInputDateTime
   */
  _InitBase : function () 
  {
    this._super();
    
    this._timePickerElement = this.element; //if the ojInputDateTime is inline, then this ref will change to a NEW input element
    this._timePicker = null;
    this._timeConverter = null;

    //need to remember the last _SetValue for the case of timepicker [i.e. select a date that is not in range due to 
    //time; however since we don't push invalid values to this.options["value"] the timepicker would pick up the wrong 
    //selected date
    this._previousValue = null;

    //below is when the switcher is active (i.e. datetimepicker and when one clicks on Cancel need to reset it)
    this._switcherDiv = null;
    this._switcherPrevValue = null;
    this._switcherPrevDay = null;
    this._switcherPrevMonth = null;
    this._switcherPrevYear = null;

    this._switcherDateValue = null;
    this._switcherTimeValue = null;
    this._dateTimeSwitcherActive = null;
    
    if(!this._isInLine) 
    {
      this._switcherDiv = $(this._generateSwitcher());
      $(".oj-popup-content", this._popUpDpDiv.ojPopup("widget")).append(this._switcherDiv);

      var self = this;
      this._switcherDiv.find("[data-handler]").map(function ()
        {
          var handler =
          {
            /** @expose */
            switchMe : function (evt)
            {
              var keyCode = evt.keyCode;
              if((evt.type === "keydown" && ($.ui.keyCode.ENTER === keyCode || $.ui.keyCode.SPACE === keyCode)) || evt.type === "click") 
              {
                if(!self._isShowingDatePickerSwitcher())
                {
                  self._timePicker.ojInputTime("show");
                }
                else
                {
                  self.show();
                  self._placeFocusOnCalendar();
                }

                return false;
              }
            },
            /** @expose */
            switchDone : function (evt)
            {
              var keyCode = evt.keyCode;
              if((evt.type === "keydown" && ($.ui.keyCode.ENTER === keyCode || $.ui.keyCode.SPACE === keyCode)) || evt.type === "click") 
              {
                self._hide(self._ON_CLOSE_REASON_SELECTION);

                var newVal = self._getDateIso();
                if(self._switcherDateValue) 
                {
                  newVal = self._switcherDateValue;
                }

                if(self._switcherTimeValue) 
                {
                  newVal = oj.IntlConverterUtils._copyTimeOver(self._switcherTimeValue, newVal);
                }

                var formatted = self._GetConverter()["format"](newVal);
                self._SetDisplayValue( formatted );
                self._SetValue(formatted, {});

                self._switcherTimeValue = self._switcherDateValue = self._switcherPrevDay = self._switcherPrevMonth = 
                  self._switcherPrevYear = self._switcherPrevValue = null;
                return false;
              }
              
            },
            /** @expose */
            switchCancel : function (evt)
            {
              var keyCode = evt.keyCode;
              if((evt.type === "keydown" && ($.ui.keyCode.ENTER === keyCode || $.ui.keyCode.SPACE === keyCode)) || evt.type === "click") 
              {
                self._hide(self._ON_CLOSE_REASON_CANCELLED);
                self._currentDay = self._switcherPrevDay;
                self._drawMonth = self._currentMonth = self._switcherPrevMonth;
                self._drawYear = self._currentYear = self._switcherPrevYear;
                self._SetValue(self._switcherPrevValue);

                self._switcherTimeValue = self._switcherDateValue = self._switcherPrevDay = self._switcherPrevMonth = 
                    self._switcherPrevYear = self._switcherPrevValue = null;
                return false;
              }
            }
          };

          $(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
        });
    }
    
  },
  
  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDateTime
   */
  _ComponentCreate : function ()
  {
    var ret = this._super();
    var timeConverter = this._getTimePickerConverter(this._GetConverter());
    
    if (timeConverter === null)
    {
      throw new Error("Please use ojInputDate if you do not have time portion");
    }
    
    if (this._isInLine)
    {
      //Since DatePicker never intended to have timepicker associated to it
      //need to have an input element that is tied to the time selector
      
      var input = $("<input type='text'>");
      input.insertAfter(this.element); //@HTMLUpdateOK
      
      //Now need to reset this._timePickerElement to the newly created input element
      this._timePickerElement = input;
    }
    else
    {
      var switcherButtons = this._switcherDiv.find("a");
      this._AddHoverable(switcherButtons);
      this._AddActiveable(switcherButtons);
    }
    
    var passOptions = ["title", "placeholder", "disabled", "required", "readOnly", 
                        "keyboardEdit", "pickerAttributes"];
    var passObject = {};
        
    for(var i=0, j=passOptions.length; i < j; i++) 
    {
      passObject[passOptions[i]] = this.options[passOptions[i]];
    }
    
    var messagesDisplayOption = this.options['displayOptions']['messages'];
    
    //create time instance for the time portion
    // jmw Seems to be a bug where messages are always in notewindow. So I think I should
    // carry the displayOptions over to the timePicker.

    var timePickerOptions = this.options["timePicker"];

    if(!this._isInLine) 
    {
      $.extend(timePickerOptions, {"footerLayout": "now"});
    }

    this._timePicker = this._timePickerElement.ojInputTime(
    $.extend(passObject, {
      "converter" : timeConverter,
      "displayOptions" : {"converterHint": "none", "title": "none", "messages": messagesDisplayOption},
      //need to pass the value down as otherwise if the value is null then it might pickup this.element.val() from 
      //our frameworks generic if options.value is not defined then pick up from element; however that would be a formatted 
      //value from ojInputDateTime
      "value": this.options["value"], 
      "timePicker" : timePickerOptions, 
      "datePickerComp" : {"widget": this, "inline": this._isInLine} 
    }));
    
    return ret;
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDateTime
   */
  _AfterCreate : function ()
  {
    var ret = this._superApply(arguments);

    this._dateTimeSwitcherActive = !isPickerNative(this) && this._timePicker && !this._isInLine;
    return ret;
  },
  
  _setOption : function (key, value, flags)
  {
    var retVal = this._superApply(arguments);
    
    if (key === "value") 
    {
      //if goes through model does it needs to update or should be only used by selection + keydown
      this._previousValue = this.options["value"]; //get from this.options["value"] as would be cleaned up by editablevalue
    }
    
    if(this._timePicker) 
    {
      //note that min + max are not passed through since it should be taken care of by ojInputDateTime and not ojInputTime
      //as it needs to use the fulle datetime
      var timeInvoker = {"disabled": true, "readOnly": true, "keyboardEdit": true};
      
      if (key in timeInvoker)
      {
        this._timePicker.ojInputTime("option", key, value);
      }
      else if(key === "timePicker")
      {
        this._timePicker.ojInputTime("option", "timePicker.timeIncrement", value["timeIncrement"]);
      }
      else if (key === "converter")
      {
        this._timeConverter = null;
        this._timePicker.ojInputTime("option", key, this._getTimePickerConverter(this._GetConverter())); //need to invoke _GetConverter for the case when null and etc sent in
      }
    }
    
    return retVal;
  },
  
  /**
   * @ignore
   * @protected
   * @override
   */
  _destroy : function ()
  {
    var ret = this._super();

    this._timePicker.ojInputTime("destroy");

    if (this._isInLine)
    {
      //note that this.element below would be of the TimePicker's input element
      this._timePickerElement.remove();
    }
    else
    {
      var switcherButtons = this._switcherDiv.find("a");
      this._RemoveActiveable(switcherButtons);
      this._RemoveHoverable(switcherButtons);

      if(this._switcherDiv) 
      {
        this._switcherDiv.remove();
      }
    }
    
    return ret;
  },

  /**
   * @protected
   * @override
   * @instance
   * @ignore
   * @memberof! oj.ojInputDateTime
   */
  _GetCalendarTitle : function ()
  {
    return this._EscapeXSS(this.getTranslatedString("tooltipCalendarTime" + (this.options["disabled"] ? "Disabled" : "")));
  },

  /**
   * Generate the HTML for the footer of the date picker.
   *
   * @ignore
   */
  _generateSwitcher : function()
  {
    var ret = "<div class='oj-datetimepicker-switcher'>" +
                "<div data-handler='switchMe' data-event='click keydown'>" +
                  "<div class='oj-inputdatetime-time-icon oj-clickable-icon-nocontext oj-component-icon oj-enabled oj-default'></div>" +
                  "<a href='#' class='oj-enabled oj-datetimepicker-switcher-text' role='button'></a>" +
                "</div>" +
                "<div class='oj-datetimepicker-switcher-buttons'>" +
                  "<a href='#' class='oj-enabled' data-handler='switchDone' data-event='click keydown' role='button'>" + this._EscapeXSS(this.getTranslatedString("done")) + "</a>" +
                  "<a href='#' class='oj-enabled' data-handler='switchCancel' data-event='click keydown' role='button'>" + this._EscapeXSS(this.getTranslatedString("cancel")) + "</a>" +
                "</div>" +
            "</div>";

    return ret;
  },

  /**
   * @ignore
   */
  _updateSwitcherText: function()
  {
    var switcherText = "";
    if(this._isShowingDatePickerSwitcher())
    {
      switcherText = dateSwitcherConverter.format(this._switcherDateValue || this._getDateIso());
    }
    else
    {
      switcherText = timeSwitcherConverter.format(this._switcherTimeValue || this._getDateIso());
    }

    $(".oj-datetimepicker-switcher-text", this._switcherDiv).text(switcherText);
  },

  /**
   * @ignore
   */
  _isShowingDatePickerSwitcher: function() 
  {
    return !this._switcherDiv || $(".oj-inputdatetime-time-icon", this._switcherDiv).length === 0;
  },

  _togglePicker: function()
  {
    var datepickerNode;
    var timepickerNode;

    var removeCss;
    var addCss;
    var newText;
    var switcher = this._switcherDiv;
    var timePickerShown = !this._isShowingDatePickerSwitcher();

    if(timePickerShown)
    {
      addCss = 'oj-inputdatetime-calendar-icon';
      removeCss = 'oj-inputdatetime-time-icon';
      newText = 'Set Date';
    }
    else
    {
      addCss = 'oj-inputdatetime-time-icon';
      removeCss = 'oj-inputdatetime-calendar-icon';
      newText = 'Set Time';
    }

    var children = $(switcher.children()[0]).children();
    $(children[0]).removeClass(removeCss).addClass(addCss);
    $(children[1]).text(newText);

    children = $(".oj-popup-content", this._popUpDpDiv.ojPopup("widget")).children();

    if(children[0].classList.contains("oj-datepicker-popup")) 
    {
      datepickerNode = $(children[0]);
      timepickerNode = $(children[1]);
    }
    else 
    {
      datepickerNode = $(children[1]);
      timepickerNode = $(children[0]);
    }

    if(!timePickerShown)
    {
      timepickerNode.css("display", "none");
      datepickerNode.css("display", "block");
    }
    else
    {
      datepickerNode.css("display", "none");
      timepickerNode.css("display", "block");
    }
    
    this._updateSwitcherText();
  },

  /*
   * Will provide the timePicker converter based on the actual converter
   */
  _getTimePickerConverter : function (converter) 
  {
    if(this._timeConverter !== null) 
    {
      return this._timeConverter;
    }

    this._timeConverter = _getTimePickerConverter(converter);
    return this._timeConverter;
  },
  
  /**
   * Handler for when the time is selected. Should be invoked ONLY by the ojInputTime component
   * 
   * @ignore
   * @param {string} newValue
   * @param {Event} event
   */
  timeSelected : function (newValue, event)
  {
    //TEMP TILL FIXED pass in formatted for _SetValue (should be newValue)
    if(!this._dateTimeSwitcherActive)
    {
      var formatted = this._GetConverter()["format"](newValue);
      this._SetDisplayValue( formatted );
      this._SetValue(formatted, event);
    }
    else
    {
      this._switcherTimeValue = newValue;
    }
  },
  
  /**
   * Provides the current displayed selected value for ojInputTime component [i.e. when is invalid return this._previousValue]
   * The complication occurs b/c we do not push invalid values to the model and b/c of that reason this.options["value"] 
   * might contain outdated isoString for ojInputTime. For instance let's say the min date is 02/01/14 2PM then 
   * when an user selects 02/01/14 the component would be invalid [as 12AM] and the value would not be pushed. However one needs 
   * to give opportunity for ojInputTime to allow user in selecting the valid datetime in full so the _previousValue 
   * must be passed through.
   * 
   * @ignore
   */
  getValueForInputTime : function ()
  {
    var value = null;

    if(this.isValid()) 
    {
      value = this.options["value"];
    }
    else 
    {
      if(this._previousValue) 
      {
        try 
        {
          //might have been that the user typed in an incorrect format, so try to parse it
          value = this._GetConverter()["parse"](this._previousValue);
        }
        catch(e) 
        {
          value = this.options["value"];
        }
      }
      else 
      {
        value = null;
      }
    }

    if(this._isDateTimeSwitcher()) 
    {
      value = this._switcherDateValue || value;

      if(this._switcherTimeValue && value)
      {
        value = oj.IntlConverterUtils._copyTimeOver(this._switcherTimeValue, value);
      }
    }

    return value;
  },
  
  /**
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDateTime
   */
  _SetValue : function (newValue, event, options)
  {
    var ret = this._superApply(arguments);
    
    this._previousValue = newValue;

    return ret;
  },
  
  /**
   * Just for the case of launching timepicker with Shift + Up or Shift + Down
   * 
   * @ignore
   * @protected
   * @override
   * @param {Event} event
   * @instance
   * @memberof! oj.ojInputDateTime
   */
  _onKeyDownHandler : function (event) 
  {
    var kc = $.ui.keyCode;
    var handled = false;
    
    switch (event.keyCode)
    {
      case kc.UP: ;
      case kc.DOWN:
        if(event.shiftKey)
        {
          this._SetValue(this._GetDisplayValue(), event);

          this._timePicker.ojInputTime("show");
          handled = true;
        }
        break;
      default: ;
    }

    if (handled)
    {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    
    return this._superApply(arguments);
  },
  
  /**
   * @instance
   * @memberof! oj.ojInputDateTime
   */
  show : function ()
  {
    if(this._isShowingDatePickerSwitcher()) 
    {
      this._togglePicker();
    }
    
    return this._super();
  },

  /**
   * Shows the native datepicker
   *
   * @protected
   * @override
   * @memberof! oj.ojInputDateTime
   * @instance
   */
  _ShowNativeDatePicker : function (pickerOptions)
  {
    // override the mode set by base class
    pickerOptions['mode'] = "datetime";
    
    var splitIncrements = splitTimeIncrement(this.options["timePicker"]["timeIncrement"]);
    
    // native picker supports only minute interval and only on iOS, we consider minute interval 
    //  only when hours is not specified
    pickerOptions.minuteInterval = (splitIncrements.hourIncr === 0) ? splitIncrements.minuteIncr : 1;
    
    return this._super(pickerOptions);
  },

  /**
   * callback upon picking date from native picker
   *
   * @protected
   * @override
   * @memberof! oj.ojInputDateTime
   * @instance
   */
  _OnDatePicked : function (date)
  {
    this._nativePickerShowing = false;
    
    // for iOS and windows, from the current implementation of the native datepicker plugin,
    //  for case when the picker is cancelled, this callback gets called without the parameter
    if (date)
    {
      var isoString = oj.IntlConverterUtils._dateTime(this._getDateIso(), {"month": date.getMonth(), "date": date.getDate(), "fullYear": date.getFullYear(), 
                                            "hours": date.getHours(), "minutes": date.getMinutes(), "seconds": date.getSeconds()});
      var formattedTime = this._GetConverter().format(isoString);

      // _SetValue will inturn call _SetDisplayValue
      this._SetValue(formattedTime, {});
    }
    
    this._onClose(this._ON_CLOSE_REASON_SELECTION);
  },

  /**
   * Shows the HTML datepicker
   *
   * @override
   * @ignore
   */
  _ShowHTMLDatePicker : function ()
  {
    var retVal = this._superApply(arguments)

    this._switcherPrevValue = this._getDateIso();
    this._switcherPrevDay = this._currentDay;
    this._switcherPrevMonth = this._currentMonth;
    this._switcherPrevYear = this._currentYear;

    this._updateSwitcherText();
    return retVal;
  },
  
  /**
   * Method to show the internally created ojInputTime
   * 
   * @expose
   * @memberof! oj.ojInputDateTime
   * @instance
   */
  showTimePicker : function ()
  {
    if(!this._datepickerShowing())
    {
      this.show();
    }

    if(!this._isShowingDatePickerSwitcher()) 
    {
      this._timePicker.ojInputTime("show");
    }
  },
  
  /**
   * @expose
   * @memberof! oj.ojInputDateTime
   * @instance
   */
  hideTimePicker : function ()
  {
    return this.hide();
  },
  
  /** 
   * @ignore
   * @override
   * @instance
   * @memberof! oj.ojInputDateTime
   */
  refresh : function ()
  {
    var retVal = this._superApply(arguments) || this;
    
    this._timePicker.ojInputTime("refresh");

    if(this._switcherDiv)
    {
      $("a[data-handler='switchDone']", this._switcherDiv).text(this.getTranslatedString("done"));
      $("a[data-handler='switchCancel']", this._switcherDiv).text(this.getTranslatedString("cancel"));
    }
    
    return retVal;
  },
  
  /**
   * Return the subcomponent node represented by the documented locator attribute values. <br/>
   * If the locator is null or no subId string is provided then this method returns the element that 
   * this component was initalized with. <br/>
   * If a subId was provided but a subcomponent node cannot be located this method returns null.
   * 
   * <p>If the <code class="prettyprint">locator</code> or its <code class="prettyprint">subId</code> is 
   * <code class="prettyprint">null</code>, then this method returns the element on which this component was initalized.
   * 
   * <p>If a <code class="prettyprint">subId</code> was provided but no corresponding node 
   * can be located, then this method returns <code class="prettyprint">null</code>.
   * 
   * @expose
   * @override
   * @memberof oj.ojInputDateTime
   * @instance
   * 
   * @param {Object} locator An Object containing, at minimum, a <code class="prettyprint">subId</code> 
   * property. See the table for details on its fields.
   * 
   * @property {string=} locator.subId - A string that identifies a particular DOM node in this component.
   * 
   * <p>The supported sub-ID's are documented in the <a href="#subids-section">Sub-ID's</a> section of this document.
   * 
   * @property {number=} locator.index - A zero-based index, used to locate a message content node 
   * or a hint node within the popup. 
   * @returns {Element|null} The DOM node located by the <code class="prettyprint">subId</code> string passed in 
   * <code class="prettyprint">locator</code>, or <code class="prettyprint">null</code> if none is found.
   * 
   * @example <caption>Get the node for a certain subId:</caption>
   * var node = $( ".selector" ).ojInputDateTime( "getNodeBySubId", {'subId': 'oj-some-sub-id'} );
   */
  getNodeBySubId: function(locator)
  {
    var subId = locator && locator['subId'];
    var node = null;
    
    if(subId) 
    {
      if(subId === "oj-inputdatetime-date-input") 
      {
        node = this._isInLine ? this._timePickerElement[0] : this.element[0];
      }
      else if(subId === "oj-inputdatetime-calendar-clock-icon") 
      {
        node = $(".oj-inputdatetime-calendar-clock-icon", this._triggerNode)[0];
      }
      else
      {
        node = this._timePicker.ojInputTime("getNodeBySubId", locator);
      }
    }
    
    return node || this._superApply(arguments);
  },
  
  /**
   * Returns the subId string for the given child DOM node.  For more details, see 
   * <a href="#getNodeBySubId">getNodeBySubId</a>.
   * 
   * @expose
   * @override
   * @memberof oj.ojInputDateTime
   * @instance
   * 
   * @param {!Element} node - child DOM node
   * @return {string|null} The subId for the DOM node, or <code class="prettyprint">null</code> when none is found.
   * 
   * @example <caption>Get the subId for a certain DOM node:</caption>
   * // Foo is ojInputNumber, ojInputDate, etc.
   * var subId = $( ".selector" ).ojFoo( "getSubIdByNode", nodeInsideComponent );
   */
  getSubIdByNode: function(node)
  {
    var dateTimeSpecific = null;
    
    if(this._isInLine) 
    {
      if(node === this._timePickerElement[0]) 
      {
        dateTimeSpecific = "oj-inputdatetime-date-input";
      }
    }
    else 
    {
      if(node === this.element[0]) 
      {
        dateTimeSpecific = "oj-inputdatetime-date-input";
      }
      else if(node === $(".oj-inputdatetime-calendar-clock-icon", this._triggerNode)[0])
      {
        dateTimeSpecific = "oj-inputdatetime-calendar-clock-icon";
      }
    }
    
    return dateTimeSpecific || this._timePicker.ojInputTime("getSubIdByNode", node) || this._superApply(arguments);
  },
  
  /**
   * Need to override since apparently we allow users to set the converter to null, undefined, and etc and when 
   * they do we use the default converter
   * 
   * @return {Object} a converter instance or null
   * 
   * @memberof! oj.ojInputDateTime
   * @instance
   * @protected
   * @override
   */
  _GetConverter : function () 
  {
    return this.options['converter'] ? 
            this._superApply(arguments) :
            $["oj"]["ojInputDateTime"]["prototype"]["options"]["converter"];
  },
  
  /**
   * Notifies the component that its subtree has been removed from the document programmatically after the component has
   * been created
   * @memberof! oj.ojInputDateTime
   * @instance
   * @protected 
   */
  _NotifyDetached: function()
  {
    if(this._timePicker) 
    {
      this.hideTimePicker();
    }

    // hide sets focus to the input, so we want to call super after hide. If we didn't, then
    // the messaging popup will reopen and we don't want that.
    this._superApply(arguments);
  },

  /**
   * Notifies the component that its subtree has been made hidden programmatically after the component has
   * been created
   * @memberof! oj.ojInputDateTime
   * @instance
   * @protected 
   */
  _NotifyHidden: function()
  {
    if(this._timePicker) 
    {
      this.hideTimePicker();
    }

    // hide sets focus to the input, so we want to call super after hide. If we didn't, then
    // the messaging popup will reopen and we don't want that.
    this._superApply(arguments);
  },
  
  /**
   * 
   * @return {Object} jquery object 
   * 
   * 
   * @expose
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDateTime
   */
  _GetMessagingLauncherElement : function ()
  {
    return !this._isInLine ? this._super() : this._timePickerElement;
  },
  
  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDateTime
   * @return {string}
   */
  _GetDefaultStyleClass : function ()
  {
    return "oj-inputdatetime";
  },
  
  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDateTime
   */
  _GetTranslationsSectionName: function()
  {
    return "oj-ojInputDate"; 
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
 *     <tr>
 *       <td>Input element and calendar trigger icon</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>When not inline, shows the grid and moves the focus into the expanded date grid.</td>
 *     </tr>
 *     <tr>
 *       <td>Time trigger icon</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Shows the time picker and moves the focus into the expanded time picker</td>
 *     </tr>
 *     <tr>
 *       <td>Input element with picker open</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Set focus to the input. If hints, title or messages exist in a notewindow, 
 *        pop up the notewindow.</td>
 *     </tr>
 *     {@ojinclude "name":"labelTouchDoc"}
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Swipe Left</kbd></td>
 *       <td>Switch to next month (or previous month on RTL page).</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Swipe Right</kbd></td>
 *       <td>Switch to previous month (or next month on RTL page).</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputDateTime
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
 *       <td><kbd>DownArrow or UpArrow</kbd></td>
 *       <td>When not in inline mode, shows the calendar grid and moves the focus into the 
 *       expanded grid. When in inline mode, shows the time picker and moves the focus into the 
 *       expanded time picker</td>
 *     </tr>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>Shift + DownArrow or UpArrow</kbd></td>
 *       <td>Shows the time picker and moves the focus into the expanded time picker</td>
 *     </tr>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Close the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Input Element</td>
 *       <td><kbd>Tab In</kbd></td>
 *       <td>Set focus to the input. If hints, title or messages exist in a notewindow, 
 *        pop up the notewindow.</td>
 *     </tr> 
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Select the currently focused day</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Move up in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move down in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move right in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move left in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Close the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Home</kbd></td>
 *       <td>Move focus to first day of the month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>End</kbd></td>
 *       <td>Move focus to last day of the month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>PageUp</kbd></td>
 *       <td>Switch to previous month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>PageDown</kbd></td>
 *       <td>Switch to next month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Alt + PageUp</kbd></td>
 *       <td>Switch to previous year.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Alt + PageDown</kbd></td>
 *       <td>Switch to next year.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + PageUp</kbd></td>
 *       <td>Switch to previous by stepBigMonths.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + PageDown</kbd></td>
 *       <td>Switch to next by stepBigMonths.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + T</kbd></td>
 *       <td>Places focus on Today button if it exists.</tr>
 *     </tr>   
 *      {@ojinclude "name":"labelKeyboardDoc"} 
 *   </tbody>
 * </table>
 * 
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputDateTime
 */

//////////////////     SUB-IDS     //////////////////

/**
 * <p>Sub-ID for the ojInputDateTime component's input element when not inline.</p>
 *
 * @ojsubid oj-inputdatetime-time-input
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the node for the input element:</caption>
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-inputdatetime-time-input'} );
 */

/**
 * <p>Sub-ID for the icon that triggers the calendar display.</p>
 *
 * @ojsubid oj-inputdatetime-calendar-clock-icon
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the icon that triggers the calendar display:</caption>
 * // Foo is ojInputDateTime 
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-inputdatetime-calendar-clock-icon'} );
 */

/**
 * <p>Sub-ID for the time wheel picker drop down node.
 *
 * @ojsubid oj-timepicker-content
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the time wheel picker drop down node:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-timepicker-content'} );
 */

/**
 * <p>Sub-ID for the cancel button.
 *
 * @ojsubid oj-timepicker-cancel-button
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the cancel button:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-timepicker-cancel-button'} );
 */

/**
 * <p>Sub-ID for the OK button.
 *
 * @ojsubid oj-timepicker-ok-button
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the OK button:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-timepicker-ok-button'} );
 */

/**
 * <p>Sub-ID for the hour picker.
 *
 * @ojsubid oj-timepicker-hour
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the hour picker:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-timepicker-hour'} );
 */

/**
 * <p>Sub-ID for the minute picker.
 *
 * @ojsubid oj-timepicker-minute
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the minute picker:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-timepicker-minute'} );
 */

/**
 * <p>Sub-ID for the meridian picker.
 *
 * @ojsubid oj-timepicker-meridian
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the meridian picker:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-timepicker-meridian'} );
 */

/**
 * <p>Sub-ID for the now button for button bar.
 *
 * @ojsubid oj-timepicker-now
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the now/now button for button bar:</caption>
 * // Foo is ojInputTime or ojInputDateTime.
 * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-timepicker-now'} );
 */

/**
 * @constructor
 * @param {TimePickerModel} parentModel parent picker model
 * @param {Object} properties initial property values
 */
function WheelModel(parentModel, properties)
{
  var SPIN_TIMES = [150, 100, 50, 25, 16];  // Note: No transitions for faster spins

  var _value = 0;

  var _position = 0;
  var _currentPosition = 0;
  
  var _displayRange = 1;
  var _valueRange = 1;
  var _increment = 1;
  var _wheelSize;
  var _keyboardValue = "";
  var _min;
  var _max;
  var _wrapped;
  
  var _valueMultiplier;
  var _valueUpperMultiplier;
  var _displayMultiplier = 1;
  var _displayUpperMultiplier;
  
  var _spinning = false;
  var _settingProps = false;
  
  var self = this;

  defineProperties();
  defineMethods();
  setProperties(properties);

  function defineProperties()
  {
    Object.defineProperty(self, "position", {
      'enumerable': true,
      'get': function()
      {
        return _position;
      },
      'set': function(position)
      {
        var val = mod(position, _wheelSize) * _increment;
        if ((val >= _min) && (val < _max) &&
            (position !== _position))
        {
          self["value"] += (position - _position) * _increment;
        }
     }
    });

    Object.defineProperty(self, "value", {
      'enumerable': true,
      'get': function()
      {
        return _value;
      },
      'set': function(value)
      {
        value = Math.round(value / _increment) * _increment;

        if (validValue(value) && _value !== value)
        {
          _value = mod(value, _valueRange);
          setPosition();
          if (self["linked"])
          {
            if (_valueRange == 2)
            {
              // Don't spin the linked wheel when changing am/pm.  Just set the
              // model value and update the DOM structure since we don't want the
              // hour wheel to spin back to the same number.
              parentModel["disableSpin"] = true;
            }
            parentModel["value"] = wheelValueToParentValue(parentModel["value"], _value);
            parentModel["disableSpin"] = false;
          }
        }
      }
    });

    Object.defineProperty(self, "increment", {
      'enumerable': true,
      'get': function()
      {
        return _increment;
      },
      'set': function(increment)
      {
        if (_increment !== increment)
        {
          _increment = increment;
          refreshSettings();
        }
      }
    });

    
    Object.defineProperty(self, "valueMultiplier", {
      'enumerable': true,
      'get': function()
      {
        return _valueMultiplier;
      },
      'set': function(valueMultiplier)
      {
        if (_valueMultiplier !== valueMultiplier)
        {
          _valueMultiplier = valueMultiplier;
          refreshSettings();
        }
      }
    });

    Object.defineProperty(self, "valueRange", {
      'enumerable': true,
      'get': function()
      {
        return _valueRange;
      },
      'set': function(valueRange)
      {
        if (_valueRange !== valueRange)
        {
          _valueRange = valueRange;
          refreshSettings();
        }
      }
    });

    Object.defineProperty(self, "displayMultiplier", {
      'enumerable': true,
      'get': function()
      {
        return _displayMultiplier;
      },
      'set': function(displayMultiplier)
      {
        if (_displayMultiplier !== displayMultiplier)
        {
          _displayMultiplier = displayMultiplier;
          refreshSettings();
        }
      }
    });

    Object.defineProperty(self, "displayRange", {
      'enumerable': true,
      'get': function()
      {
        return _displayRange;
      },
      'set': function(displayRange)
      {
        if (_displayRange !== displayRange)
        {
          _displayRange = displayRange;
          refreshSettings();
        }
      }
    });

    Object.defineProperty(self, "keyboardValue", {
      'enumerable': true,
      'get': function()
      {
        return _keyboardValue;
      },
      'set': function(keyboardValue)
      {
        _keyboardValue = keyboardValue;
        if (self["parser"] && _keyboardValue)
        {
          var value = self["parser"](_keyboardValue);
          if (value >= 0)
          {
            value = displayValueToWheelValue(_value, value);
            if (_min <= value && value < _max)
            {
              self["value"] = value;
            }
          }
          
          // Clear _keyboardValue when the user has typed in 2 digits or after
          // 1 second, so that a new value can be accepted.
          if (_keyboardValue.length >= 2)
          {
            _keyboardValue = "";
          }
          else
          {
            setTimeout(function() {
              _keyboardValue = "";
            }, 1000);
          }
        }
      }
    });
  };

  function defineMethods()
  {
    self.getText = function(position)
    {
      var text;
      var pos = mod(_currentPosition, _wheelSize) + position;
      var haveText = _wrapped || (pos >= 0 && pos < _wheelSize);
      if (self["formatter"] && haveText)
      {
        var val = positionToDisplayValue(_currentPosition + position);
        text = self["formatter"](val);
      }
      return text;
    };

    self.isDisabled = function(position)
    {      
      var value = mod(_currentPosition + position, _wheelSize) * _increment;
      if (_min !== 0 && value < _min)
      {
        return true;
      }
      if (_max !== _valueRange && value >= _max)
      {
        return true;
      }
      return false;
    };

    /**
     * 
     * called by wheel on blur
     */
    self.update = function()
    {
      parentModel["value"] = wheelValueToParentValue(parentModel["value"], _value);
    };

    self.refresh = refresh;
    self.setProperties = setProperties;
  }

  function setProperties(properties)
  {
    if (properties)
    {
      for (var key in properties)
      {
        self[key] = properties[key];
      }
    }
  }

  function refresh()
  {
    var needRefresh = false;
    var parentValue = parentModel.value;
    self["value"] = parentValueToWheelValue(parentValue);

    var parentMax = parentModel["max"];
    var newMax;
    if (parentValueUpperPart(parentValue) === parentValueUpperPart(parentMax))
    {
      newMax = parentValueToWheelValue(parentMax) + 1;
    }
    else
    {
      newMax = _valueRange;
    }
    if (_max !== newMax)
    {
      needRefresh = true;
      _max = newMax;
    }

    var parentMin = parentModel["min"];
    var newMin;
    if (parentValueUpperPart(parentValue) === parentValueUpperPart(parentMin))
    {
      newMin = parentValueToWheelValue(parentMin);
    }
    else
    {
      newMin = 0;
    }
    if (_min !== newMin)
    {
      needRefresh = true;
      _min = newMin;
    }

    var parentIncrement = parentModel["increment"];
    var inc = gcd(parentIncrement, _valueUpperMultiplier);  // For example 60 for minutes

    // If increment is a multiple of 60 then min and max are 0;
    if (inc === _valueUpperMultiplier)
    {
      _min = 0;
      _max = 1;
      needRefresh = true;
    }
    else if (self["linked"] && parentIncrement > _valueMultiplier)
    {
      inc = parentIncrement;
    }
    else if (mod(inc, _valueMultiplier) === 0)
    {
      inc = inc / _valueMultiplier;
    }
    else
    {
      inc = 1;
    }
    if (_increment !== inc)
    {
      _increment = inc;
      needRefresh = true;
    }

    _wheelSize = Math.floor(_valueRange / _increment);
    _wrapped = _wheelSize > 4;
    
    if (self.wheel && needRefresh)
    {
      self.wheel.ojRefresh();
    }
  }

  function setPosition()
  {
    var newPos = mod(wheelValueToPosition(_value), _wheelSize);
    var oldPos = mod(self.position, _wheelSize);
    var diff = newPos - oldPos;
    if (_wrapped)
    {
      if (newPos > oldPos)
      {
        if (oldPos + _wheelSize - newPos < Math.abs(diff))
        {
          diff = newPos - oldPos - _wheelSize;
        }
      }
      else 
      {
        if (newPos + _wheelSize - oldPos < Math.abs(diff))
        {
          diff = newPos + _wheelSize - oldPos;
        }
      }
    }
    if (diff !== 0)
    {
      _position += diff;

      if (self.wheel)
      {
        if (!_spinning)
        {
          _spinning = true;
          spinWheel.call(self);
        }
      }
      else
      {
        _currentPosition = _position;
      }
    }
  }

  /**
   * recalculates dependent values after settings change
   */
  function refreshSettings()
  {
    _valueUpperMultiplier = _valueMultiplier * _valueRange;
    _displayUpperMultiplier = _displayMultiplier * _displayRange;
  }

  function spinWheel()
  {
    SPIN_TIMES.forEach(function(time)
    {
      self.wheel.classList.remove("oj-timepicker-wheel-spin-" + time);
    });

    var dist = Math.abs(_position - _currentPosition);
    if (dist === 0)
    {
      _spinning = false;
      return;
    }

    var delay;

    dist--;
    dist = Math.min(dist, SPIN_TIMES.length - 1);
    delay = SPIN_TIMES[dist];
    self.wheel.classList.add("oj-timepicker-wheel-spin-" + SPIN_TIMES[dist]);

    if (_position > _currentPosition)
    {
      _currentPosition++;
      self.wheel.ojSpinUp();
    }
    if (_position < _currentPosition)
    {
      _currentPosition--;
      self.wheel.ojSpinDown();
    }
    if (delay)
    {
      if (parentModel["disableSpin"])
      {
        // Calling spinWheel without delay will update the DOM structure
        // without visually spinning the wheel.
        spinWheel.call(self);
      }
      else
      {
        setTimeout(spinWheel.bind(self), delay);
      }
    }
  }

  function validValue(value)
  {
    if (_wrapped)
      return true;
    
    return (_min <= value && value < _max);
  }

  function mod(val1, val2)
  {
    // Make modulus out of remainder.  The fancy stuff deals with neg values.
    return ((val1 % val2) + val2) % val2;
  }

  function gcd(a, b) {
    if (b === 0)
    {
        return a;
    }
    return gcd(b, a % b);
  }

  function positionToDisplayValue(position)
  {
    return wheelValueToDisplayValue(positionToWheelValue(position));
  }

  function wheelValueToPosition(value)
  {
    return Math.floor(value / _increment);
  }

  function wheelValueToParentValue(parentValue, value)
  {
    return Math.floor(parentValue / _valueUpperMultiplier ) * _valueUpperMultiplier +
                  mod(value, _valueRange) * _valueMultiplier +
                  mod(parentValue, _valueMultiplier);
  }

  function parentValueToWheelValue(value)
  {
    return mod(Math.floor(value / _valueMultiplier), _valueRange);
  }

  function parentValueUpperPart(value)
  {
    return Math.floor(value / _valueUpperMultiplier );
  }

  function positionToWheelValue(position)
  {
    return mod(mod(position, _wheelSize) * _increment, _valueRange);
  }

  function wheelValueToDisplayValue(value)
  {
    return mod(Math.floor(value / _displayMultiplier), _displayRange);
  }

  function displayValueToWheelValue(wheelValue, displayValue)
  {
    return Math.floor(wheelValue / _displayUpperMultiplier ) * _displayUpperMultiplier +
                mod(displayValue, _displayRange) * _displayMultiplier +
                mod(wheelValue, _displayMultiplier);
  }
}

(function() {
var ojInputTimeMeta = {
  "properties": {
    "keyboardEdit": {
      "type": "string"
    },
    "pickerAttributes": {
      "type": "Object"
    },
    "renderMode": {
      "type": "string"
    },
    "min": {
      "type": "string"
    },
    "max": {
      "type": "string"
    },
    "timePicker": {
      "type": "Object",
      "properties": {
        "footerLayout": {
          "type": "string"
        },
        "timeIncrement": {
          "type": "string"
        },
        "showOn": {
          "type": "string"
        }
      }
    },
    "validators": {
      "type": "Array"
    },
    "value": {
      "type": "string",
      "writeback": true
    }
  },
  "methods": {
    "getNodeBySubId": {},
    "getSubIdByNode": {},
    "hide": {},
    "refresh": {},
    "show": {},
    "widget": {},
    "validate": {}
  },
  "extension": {
    _INNER_ELEM: 'input',
    _ALIASED_PROPS: {"readonly": "readOnly"},
    _WIDGET_NAME: "ojInputTime",
    _TRANSFER_ATTRS: ["aria-label", "autocomplete", "autofocus", "disabled", "inputmode", "name", "required", "tabindex"]
  }
};
oj.CustomElementBridge.registerMetadata('oj-input-time', 'inputBase', ojInputTimeMeta);
oj.CustomElementBridge.register('oj-input-time', {'metadata': oj.CustomElementBridge.getMetadata('oj-input-time')});
})();

(function() {
var ojInputDateMeta = {
  "properties": {
    "datePicker": {
      "type": "Object",
      "properties": {
        "footerLayout": {
          "type": "string"
        },
        "changeMonth": {
          "type": "string"
        },
        "changeYear": {
          "type": "string"
        },
        "currentMonthPos": {
          "type": "number"
        },
        "daysOutsideMonth": {
          "type": "string"
        },
        "numberOfMonths": {
          "type": "number"
        },
        "showOn": {
          "type": "string"
        },
        "stepMonths": {
          "type": "string"
        },
        "stepBigMonths": {
          "type": "number"
        },
        "weekDisplay": {
          "type": "string"
        },
        "yearRange": {
          "type": "string"
        }
      }
    },
    "min": {
      "type": "string"
    },
    "max": {
      "type": "string"
    },
    "dayFormatter": {
      "type": "function"
    },
    "dayMetaData": {
      "type": "Object"
    },
    "keyboardEdit": {
      "type": "string"
    },
    "pickerAttributes": {
      "type": "Object"
    },
    "renderMode": {
      "type": "string"
    },
    "validators": {
      "type": "Array"
    },
    "value": {
      "type": "string",
      "writeback": true
    }
  },
  "methods": {
    "getNodeBySubId": {},
    "getSubIdByNode": {},
    "hide": {},
    "refresh": {},
    "show": {},
    "validate": {}
  },
  "extension": {
    _INNER_ELEM: 'input',
    _ALIASED_PROPS: {"readonly": "readOnly"},
    _WIDGET_NAME: "ojInputDate",
    _TRANSFER_ATTRS: ["aria-label", "autocomplete", "autofocus", "disabled", "inputmode", "name", "required", "tabindex"]
  }
};

oj.CustomElementBridge.registerMetadata('oj-input-date', 'inputBase', ojInputDateMeta);
oj.CustomElementBridge.register('oj-input-date', {'metadata': oj.CustomElementBridge.getMetadata('oj-input-date')});

var ojDatePickerMeta = oj.CollectionUtils.copyInto({}, oj.CustomElementBridge.getMetadata('oj-input-date'), undefined, true);
ojDatePickerMeta['extension']['_INNER_ELEM'] = 'div';
oj.CustomElementBridge.register('oj-date-picker', {'metadata': ojDatePickerMeta});
})();

(function() {
var ojInputDateTimeMeta = {
  "properties": {
    "timePicker": {
      "type": "Object",
      "properties": {
        "footerLayout": {
          "type": "string"
        },
        "timeIncrement": {
          "type": "string"
        },
        "showOn": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "getNodeBySubId": {},
    "getSubIdByNode": {},
    "hideTimePicker": {},
    "showTimePicker": {},
    "validate": {}
  },
  "extension": {
    _INNER_ELEM: 'input',
    _ALIASED_PROPS: {"readonly": "readOnly"},
    _WIDGET_NAME: "ojInputDateTime"
  }
};
oj.CustomElementBridge.registerMetadata('oj-input-date-time', 'ojInputDate', ojInputDateTimeMeta);
oj.CustomElementBridge.register('oj-input-date-time', {'metadata': oj.CustomElementBridge.getMetadata('oj-input-date-time')});

var ojDateTimePickerMeta = oj.CollectionUtils.copyInto({}, oj.CustomElementBridge.getMetadata('oj-input-date-time'), undefined, true);
ojDateTimePickerMeta['extension']['_INNER_ELEM'] = 'div';
oj.CustomElementBridge.register('oj-date-time-picker', {'metadata': ojDateTimePickerMeta});
})();
});
