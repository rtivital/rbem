import test from 'tape-catch';
import { block, applyModifiers } from '../src';

const BLOCK_NAME = 'component';
const ELEMENT_NAME = 'element';
const validElements = ['button', 'map', 'container', 'display', 'element-0'];
const invalidParams = [null, undefined, function a() {}, {}, [], 0, 45, NaN, new Date()];

const isEmptyString = value => typeof value === 'string' && value.length === 0;
const createElement = (blockValue, elementValue) => `${blockValue}__${elementValue}`;

test('block function with valid params', (t) => {
  const validBlock = block(BLOCK_NAME);
  t.equal(typeof validBlock, 'function', 'block returns function');

  validElements.forEach((element) => {
    t.equal(
      validBlock(element),
      createElement(BLOCK_NAME, element),
      `block produces valid element with value ${element}`
    );
  });

  invalidParams.forEach((param) => {
    t.equal(
      validBlock(param),
      BLOCK_NAME,
      `block returns block name with invalid element value ${param}`
    );
  });

  t.end();
});

test('block function with invalid params', (t) => {
  invalidParams.forEach((param) => {
    const blockWithInvalidParam = block(param)();

    t.equal(
      isEmptyString(blockWithInvalidParam), true,
      `block produces empty string with invalid param ${param}`
    );
  });

  const invalidBlock = block(null);

  validElements.forEach((element) => {
    t.equal(
      isEmptyString(invalidBlock(element)), true,
      `invalid block does not produce elements with valid value ${element}`
    );
  });

  invalidParams.forEach((param) => {
    t.equal(
      isEmptyString(invalidBlock(param)), true,
      `invalid block does not produce elements with invalid value ${param}`
    );
  });

  t.end();
});

const applyStringModifier = selector =>
  modifier => `${selector} ${selector}--${modifier}`;

const applyArrayModifiers = selector =>
  (modifiers) => {
    const applied = modifiers
      .filter(Boolean)
      .reverse()
      .map(modifier => `${selector}--${modifier}`)
      .join(' ');

    return applied.length > 0 ? `${selector} ${applied}` : selector;
  };

const applyObjectModifiers = selector =>
  (modifiers) => {
    const keys = Object.keys(modifiers).filter(modifier => modifiers[modifier]);
    return applyArrayModifiers(selector)(keys);
  };

const stringModifiers = ['active', 'opened', 'valid', 'invalid'];
const arrayModifiers = [
  ['active'],
  ['active', 'opened'],
  ['valid', 'invalid', null, undefined],
];

const objectModifiers = [
  { active: true, 'sidebar-opened': null },
  { valid: true, invalid: undefined },
  { opened: false },
  { invalid: 0, valid: 1 },
  {},
];

test('applyModifiers function with elements', (t) => {
  const validBlock = block(BLOCK_NAME);
  const validElement = validBlock(ELEMENT_NAME);
  const expectedStringSelector = applyStringModifier(validElement);
  const expectedArraySelector = applyArrayModifiers(validElement);
  const expectedObjectSelector = applyObjectModifiers(validElement);

  stringModifiers.forEach((modifier) => {
    t.equal(
      applyModifiers(validElement, modifier),
      expectedStringSelector(modifier),
      `Applies string modifier ${modifier} to element`
    );
  });

  arrayModifiers.forEach((modifiers) => {
    t.equal(
      applyModifiers(validElement, modifiers),
      expectedArraySelector(modifiers),
      `Applies array modifiers ${modifiers} to element`
    );
  });

  objectModifiers.forEach((modifiers) => {
    t.equal(
      applyModifiers(validElement, modifiers),
      expectedObjectSelector(modifiers),
      `Applies object modifiers ${Object.keys(modifiers).join(', ')} to element`
    );
  });

  t.end();
});
