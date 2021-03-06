/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating JavaScript for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.JavaScript.variables');

goog.require('Blockly.JavaScript');


Blockly.JavaScript['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.VARIABLE_CATEGORY_NAME);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  return varName + ' = ' + argument0 + ';\n';
};

Blockly.JavaScript['rect'] = function(block) {
  var text_id = block.getFieldValue('ID');
  var number_x = block.getFieldValue('X');
  var number_y = block.getFieldValue('Y');
  var number_w = block.getFieldValue('W');
  var number_h = block.getFieldValue('H');
  var colour_color = block.getFieldValue('Color');
  var code = 'document.getElementById(\'ui-content\').innerHTML += \'<div id=\"' + text_id +
             '\" style=\"background-color: ' + colour_color +
             '; position: absolute; left: ' + number_x +
             'px; top: ' + number_y +
             'px; width: ' + number_w +
             'px; height: ' + number_h +
             'px;\"></div>\';\n';
  return code;
};

Blockly.JavaScript['image_with_geometry'] = function(block) {
  var text_id = block.getFieldValue('ID');
  var number_x = block.getFieldValue('X');
  var number_y = block.getFieldValue('Y');
  var number_w = block.getFieldValue('W');
  var number_h = block.getFieldValue('H');
  var dataURL = block.getFieldValue('DataURL');
  var code = 'document.getElementById(\'ui-content\').innerHTML += \'<div id=\"' + text_id +
             '\" style=\"position: absolute; left: ' + number_x +
             'px; top: ' + number_y +
             'px; width: ' + number_w +
             'px; height: ' + number_h +
             'px;\"><img width=' + number_w +
             ' height=' + number_h +
             ' src=\"' + dataURL +
             '\"/></div>\';\n';
  return code;
};

Blockly.JavaScript['image'] = function(block) {
  var dataURL = block.getFieldValue('DataURL');
  var code = Blockly.JavaScript.quote_(dataURL);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['move_object'] = function(block) {
  var text_id = block.getFieldValue('ID');
  var value_x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'var obj = document.getElementById(\"' + text_id + '\");' +
             'obj.style.left = ' + value_x + ' + \'px\';' +
             'obj.style.top = ' + value_y + ' + \'px\';';
  return code;
};

Blockly.JavaScript['obj_geometry_set'] = function(block) {
  var variable_name = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('OBJ'), Blockly.Variables.NAME_TYPE);
  var number_x = block.getFieldValue('X');
  var number_y = block.getFieldValue('Y');
  var number_w = block.getFieldValue('W');
  var number_h = block.getFieldValue('H');
  var code = 'document.getElementById(\'ui-content\').innerHTML += \'<div id=\"' + variable_name +
             '\" style=\"position: absolute; left: ' + number_x +
             'px; top: ' + number_y +
             'px; width: ' + number_w +
             'px; height: ' + number_h +
             'px;\"><img width=' + number_w +
             ' height=' + number_h +
             ' src=\"\' + ' + variable_name +
             ' + \'\"/></div>\';\n';
  return code;
};

Blockly.JavaScript['move_object_variable'] = function(block) {
  var vn = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var value_x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'var obj = document.getElementById(\"' + vn + '\");' +
             'obj.style.left = ' + value_x + ' + \'px\';' +
             'obj.style.top = ' + value_y + ' + \'px\';';
  return code;
};
