# Rbem

[![Build Status](https://travis-ci.org/rtivital/rbem.svg?branch=master)](https://travis-ci.org/rtivital/rbem)

Tiny library without dependencies for better BEM naming.

## Instalation
`npm install --save rbem`

Best with Webpack and Babel:
```js
import { block, applyModifiers } from 'rbem';
```

## Basics
Rbem comes with two functions `block` and `applyModifiers`.

`block` is a higher order function that is used for creating namespace for single component. Block produces elements:

```js
import { block } from 'rbem';

// block - single namespace for all dependent elements
const btn = block('button'); // -> function

// elements - multiple instances of block
const icon = btn('icon'); // -> 'button__icon'
const text = btn('text'); // -> 'button__text'
```

`applyModifiers` function takes care of adding modifiers both to blocks and elements:

```js
import { block, applyModifiers } from 'rbem';

const btn = block('button');
const primaryButton = applyModifiers(btn, 'primary'); // -> 'button--primary'
const icon = btn('icon'); // -> 'button__icon'
const lightIcon = applyModifiers(icon, 'light');
// -> 'button__icon button__icon--light'
```

## Best with React
```js
import React, { Component } from 'react';
import { block, applyModifiers } from 'rbem';

export default class Button extends Component {
  constructor(props) {
    super(props);
    this.state = { pressed: false };
  }

  handleClick = () => {
    this.setState({ pressed: !this.state.pressed });
  }

  render() {
    const btn = block('btn');
    const btnClassName = applyModifiers(btn, {
      primary: true,
      active: this.state.pressed,
    });

    return (
      <button className={btnClassName} onClick={this.handleClick}>
        <span className={btn('text')}>{this.props.children}</span>
        <span className={btn('icon')}>
          <img className={btn('image')} src={this.props.icon} alt="" />
        </span>
      </button>
    );
  }
}
```

## Applying modifiers
Modifiers can be applied with string, array or object:
```js
import { block, applyModifiers } from 'rbem';

const icon = block('button')('icon');
const bigWhiteIcon = applyModifiers(icon, ['big', 'white']);
// -> 'button__icon button__icon--big button__icon--white'

// black modifier will be added only if condition evaluates to true
const bigMaybeBlackIcon = applyModifiers(icon, {
  black: Math.random() > 0.5,
  big: true,
});
// -> 'button__icon button__icon--big button__icon--black'
```
