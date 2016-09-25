import test from 'tape-catch';
import { block } from '../src';

const validElements = ['button', 'map', 'container', 'display', 'element-0'];
const invalidParams = [null, undefined, function a() {}, {}, [], 0, 45, NaN, new Date()];

const isEmptyString = value => typeof value === 'string' && value.length === 0;
const createElement = (blockValue, elementValue) => `${blockValue}__${elementValue}`;

test('block function with valid params', (t) => {
  const CLASS_NAME = 'component';

  const validBlock = block(CLASS_NAME);
  t.equal(typeof validBlock, 'function', 'block returns function');

  validElements.forEach((element) => {
    t.equal(
      validBlock(element),
      createElement(CLASS_NAME, element),
      `block produces valid element with value ${element}`
    );
  });

  invalidParams.forEach((param) => {
    t.equal(
      validBlock(param),
      CLASS_NAME,
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
      'invalid block does not produce elements'
    );
  });

  t.end();
});
