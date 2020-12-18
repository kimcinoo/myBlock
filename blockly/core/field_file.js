'use strict';

goog.provide('Blockly.FieldFile');

goog.require('Blockly.Field');
goog.require('Blockly.fieldRegistry');
goog.require('Blockly.utils');
goog.require('Blockly.utils.dom');
goog.require('Blockly.utils.object');
goog.require('Blockly.utils.Size');

Blockly.FieldFile = function(opt_value, opt_class, opt_config) {
  /**
   * The html class name to use for this field.
   * @type {?string}
   * @private
   */
  this.class_ = null;


console.log('[GGGGGGGG] opt_value: ' + opt_value);
  Blockly.FieldFile.superClass_.constructor.call(this, opt_value, opt_config);

  if (!opt_config) {  // If the config was not passed use old configuration.
    this.class_ = opt_class || null;
  }
};
Blockly.utils.object.inherits(Blockly.FieldFile, Blockly.Field);

/**
 * Serializable fields are saved by the XML renderer, non-serializable fields
 * are not. Editable fields should also be serializable.
 * @type {boolean}
 */
Blockly.FieldFile.prototype.SERIALIZABLE = true;

/**
 * Create and show the file selector.
 * @protected
 */
Blockly.FieldFile.prototype.showEditor_ = function() {
  // Focus so we can start receiving keyboard events.
   console.log('[GGGGGGGGGG] showEditor this: ' + this);
   var blockObject = this;
   var f = document.createElement('input');
   f.style.display='none';
   f.type='file';
   f.name='file';
   f.addEventListener('change',
                      function() { 
                        console.log(f.files[0].name);
                        var reader = new FileReader();
                        reader.onloadend = function() {
                                             //console.log('[GGGGGGGGGG]this: ' + this + 'blockObj: ' + blockObject);
                                             //console.log(reader.result);
                                             blockObject.setValue(reader.result);
                                             //TODO: blockObject.render_();
                                             };
                                             /*this.setValue(reader.result);}*/
                        reader.readAsDataURL(f.files[0]);
                      });
   f.click();
};

/**
 * Ensure that the input value is a valid file.
 * @param {*=} opt_newValue The input value.
 * @return {?string} A valid file, or null if invalid.
 * @protected
 */
Blockly.FieldFile.prototype.doClassValidation_ = function(opt_newValue) {
  if (typeof opt_newValue != 'string') {
    return null;
  }
console.log("[GGGGGGGGG] getText: " + this.getText());
  console.log("MYTODO: change return value");
  return opt_newValue
};

/**
 * Update the value of this file field, and update the displayed file.
 * @param {*} newValue The value to be saved. The default validator guarantees
 * that this is a file in string format.
 * @protected
 */
Blockly.FieldFile.prototype.doValueUpdate_ = function(newValue) {
console.log("[GGGGGGGGG] doValueUpdate to " + newValue );
  this.value_ = newValue;
};

Blockly.FieldFile.fromJson = function(options) {
  //var value = Blockly.utils.replaceMessageReferences(options['value']);
  return new Blockly.FieldFile(options['file'], undefined, options);
};
Blockly.fieldRegistry.register('field_file', Blockly.FieldFile);
