/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating JavaScript for loop blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.JavaScript.loops');

goog.require('Blockly.JavaScript');


Blockly.JavaScript['controls_repeat_ext'] = function(block) {
  // Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    // External number.
    var repeats = Blockly.JavaScript.valueToCode(block, 'TIMES',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  }
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block);
  var code = '';
  var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
      'count', Blockly.VARIABLE_CATEGORY_NAME);
  var endVar = repeats;
  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    endVar = Blockly.JavaScript.variableDB_.getDistinctName(
        'repeat_end', Blockly.VARIABLE_CATEGORY_NAME);
    code += 'var ' + endVar + ' = ' + repeats + ';\n';
  }
  code += 'for (var ' + loopVar + ' = 0; ' +
      loopVar + ' < ' + endVar + '; ' +
      loopVar + '++) {\n' +
      branch + '}\n';
  return code;
};

Blockly.JavaScript['controls_repeat'] =
    Blockly.JavaScript['controls_repeat_ext'];

Blockly.JavaScript['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL',
      until ? Blockly.JavaScript.ORDER_LOGICAL_NOT :
      Blockly.JavaScript.ORDER_NONE) || 'false';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

Blockly.JavaScript['controls_for'] = function(block) {
  // For loop.
  var variable0 = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  var argument0 = Blockly.JavaScript.valueToCode(block, 'FROM',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.JavaScript.valueToCode(block, 'TO',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.JavaScript.valueToCode(block, 'BY',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block);
  var code;
  if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
      Blockly.isNumber(increment)) {
    // All arguments are simple numbers.
    var up = Number(argument0) <= Number(argument1);
    code = 'for (' + variable0 + ' = ' + argument0 + '; ' +
        variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
        variable0;
    var step = Math.abs(Number(increment));
    if (step == 1) {
      code += up ? '++' : '--';
    } else {
      code += (up ? ' += ' : ' -= ') + step;
    }
    code += ') {\n' + branch + '}\n';
  } else {
    code = '';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    var startVar = argument0;
    if (!argument0.match(/^\w+$/) && !Blockly.isNumber(argument0)) {
      startVar = Blockly.JavaScript.variableDB_.getDistinctName(
          variable0 + '_start', Blockly.VARIABLE_CATEGORY_NAME);
      code += 'var ' + startVar + ' = ' + argument0 + ';\n';
    }
    var endVar = argument1;
    if (!argument1.match(/^\w+$/) && !Blockly.isNumber(argument1)) {
      endVar = Blockly.JavaScript.variableDB_.getDistinctName(
          variable0 + '_end', Blockly.VARIABLE_CATEGORY_NAME);
      code += 'var ' + endVar + ' = ' + argument1 + ';\n';
    }
    // Determine loop direction at start, in case one of the bounds
    // changes during loop execution.
    var incVar = Blockly.JavaScript.variableDB_.getDistinctName(
        variable0 + '_inc', Blockly.VARIABLE_CATEGORY_NAME);
    code += 'var ' + incVar + ' = ';
    if (Blockly.isNumber(increment)) {
      code += Math.abs(increment) + ';\n';
    } else {
      code += 'Math.abs(' + increment + ');\n';
    }
    code += 'if (' + startVar + ' > ' + endVar + ') {\n';
    code += Blockly.JavaScript.INDENT + incVar + ' = -' + incVar + ';\n';
    code += '}\n';
    code += 'for (' + variable0 + ' = ' + startVar + '; ' +
        incVar + ' >= 0 ? ' +
        variable0 + ' <= ' + endVar + ' : ' +
        variable0 + ' >= ' + endVar + '; ' +
        variable0 + ' += ' + incVar + ') {\n' +
        branch + '}\n';
  }
  return code;
};

Blockly.JavaScript['controls_forEach'] = function(block) {
  // For each loop.
  var variable0 = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  var argument0 = Blockly.JavaScript.valueToCode(block, 'LIST',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '[]';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block);
  var code = '';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  var listVar = argument0;
  if (!argument0.match(/^\w+$/)) {
    listVar = Blockly.JavaScript.variableDB_.getDistinctName(
        variable0 + '_list', Blockly.VARIABLE_CATEGORY_NAME);
    code += 'var ' + listVar + ' = ' + argument0 + ';\n';
  }
  var indexVar = Blockly.JavaScript.variableDB_.getDistinctName(
      variable0 + '_index', Blockly.VARIABLE_CATEGORY_NAME);
  branch = Blockly.JavaScript.INDENT + variable0 + ' = ' +
      listVar + '[' + indexVar + '];\n' + branch;
  code += 'for (var ' + indexVar + ' in ' + listVar + ') {\n' + branch + '}\n';
  return code;
};

Blockly.JavaScript['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  var xfix = '';
  if (Blockly.JavaScript.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    xfix += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_PREFIX,
        block);
  }
  if (Blockly.JavaScript.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the break/continue is triggered.
    xfix += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_SUFFIX,
        block);
  }
  if (Blockly.JavaScript.STATEMENT_PREFIX) {
    var loop = Blockly.Constants.Loops
        .CONTROL_FLOW_IN_LOOP_CHECK_MIXIN.getSurroundLoop(block);
    if (loop && !loop.suppressPrefixSuffix) {
      // Inject loop's statement prefix here since the regular one at the end
      // of the loop will not get executed if 'continue' is triggered.
      // In the case of 'break', a prefix is needed due to the loop's suffix.
      xfix += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_PREFIX,
          loop);
    }
  }
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return xfix + 'break;\n';
    case 'CONTINUE':
      return xfix + 'continue;\n';
  }
  throw Error('Unknown flow statement.');
};

Blockly.JavaScript['mouse_event_handler'] = function(block) {
  var dropdown_eventtype = block.getFieldValue('EventType');
  var text_id = block.getFieldValue('ID');
  var statements_statementinput = Blockly.JavaScript.statementToCode(block, 'statementInput');
  var code = 'document.getElementById(\"' + text_id +
             '\").' + dropdown_eventtype +
             ' = function() {' + statements_statementinput +
             '};\n';
  return code;
};

Blockly.JavaScript['move_with_key'] = function(block) {
  var text_id = block.getFieldValue('ID');
  var code = 'function leftArrowPressed() {' +
             'var element = document.getElementById(\"' + text_id + '");' +
             'element.style.left = parseInt(element.style.left) - 5 + \'px\'; }' +

             'function rightArrowPressed() {' +
             'var element = document.getElementById(\"' + text_id + '\");' +
             'element.style.left = parseInt(element.style.left) + 5 + \'px\'; }' +

             'function upArrowPressed() {' +
             'var element = document.getElementById(\"' + text_id + '\");' +
             'element.style.top = parseInt(element.style.top) - 5 + \'px\'; }' +

             'function downArrowPressed() {' +
             'var element = document.getElementById(\"' + text_id + '\");' +
             'element.style.top = parseInt(element.style.top) + 5 + \'px\'; }' +

             'function moveSelection(evt) {' +
                'switch (evt.keyCode) {' +
                    'case 37:' +
                    'leftArrowPressed();' +
                    'break;' +
                    'case 39:' +
                    'rightArrowPressed();' +
                    'break;' +
                    'case 38:' +
                    'upArrowPressed();' +
                    'break;' +
                    'case 40:' +
                    'downArrowPressed();' +
                    'break;' +
                    '}' +
                  'overlapCheck();' +
                '};' +

             'window.addEventListener(\'keydown\', moveSelection);\n';
  return code;
};

Blockly.JavaScript['object_overlap'] = function(block) {
  var text_obja = block.getFieldValue('objA');
  var text_objb = block.getFieldValue('objB');
  var statements_input = Blockly.JavaScript.statementToCode(block, 'input');
  var element = document.getElementById(text_obja);
  var code = 'function overlapCheck() {' +
               'var obja = document.getElementById(\"' + text_obja + '\");' +
               'var objb = document.getElementById(\"' + text_objb + '\");' +
               'if (obja.offsetLeft < objb.offsetLeft + objb.offsetWidth &&' +
                 'obja.offsetLeft + obja.offsetWidth > objb.offsetLeft &&' +
                 'obja.offsetTop < objb.offsetTop + objb.offsetHeight &&' +
                 'obja.offsetTop + obja.offsetHeight > objb.offsetTop) {' +
                 statements_input + '}' +
             '};\n';
  return code;
};

Blockly.JavaScript['move_variable_with_key'] = function(block) {
  var vn = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var code = 'function leftArrowPressed() {' +
             'var element = document.getElementById(\"' +  vn + '\");' +
             'element.style.left = parseInt(element.style.left) - 5 + \'px\'; }' +

             'function rightArrowPressed() {' +
             'var element = document.getElementById(\"' + vn + '\");' +
             'element.style.left = parseInt(element.style.left) + 5 + \'px\'; }' +

             'function upArrowPressed() {' +
             'var element = document.getElementById(\"' + vn + '\");' +
             'element.style.top = parseInt(element.style.top) - 5 + \'px\'; }' +

             'function downArrowPressed() {' +
             'var element = document.getElementById(\"' + vn + '\");' +
             'element.style.top = parseInt(element.style.top) + 5 + \'px\'; }' +

             'function moveSelection(evt) {' +
                'switch (evt.keyCode) {' +
                    'case 37:' +
                    'leftArrowPressed();' +
                    'break;' +
                    'case 39:' +
                    'rightArrowPressed();' +
                    'break;' +
                    'case 38:' +
                    'upArrowPressed();' +
                    'break;' +
                    'case 40:' +
                    'downArrowPressed();' +
                    'break;' +
                    '}' +
                  'overlapCheck();' +
                '};' +

             'window.addEventListener(\'keydown\', moveSelection);\n';
  return code;
};

Blockly.JavaScript['object_variable_overlap'] = function(block) {
  var obja = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('objA'), Blockly.Variables.NAME_TYPE);
  var objb = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('objB'), Blockly.Variables.NAME_TYPE);
  var statements_input = Blockly.JavaScript.statementToCode(block, 'input');
  var element = document.getElementById(obja);
  var code = 'function overlapCheck() {' +
               'var obja = document.getElementById(\"' + obja + '\");' +
               'var objb = document.getElementById(\"' + objb + '\");' +
               'if (obja.offsetLeft < objb.offsetLeft + objb.offsetWidth &&' +
                 'obja.offsetLeft + obja.offsetWidth > objb.offsetLeft &&' +
                 'obja.offsetTop < objb.offsetTop + objb.offsetHeight &&' +
                 'obja.offsetTop + obja.offsetHeight > objb.offsetTop) {' +
                 statements_input + '}' +
             '};\n';
  return code;
};
