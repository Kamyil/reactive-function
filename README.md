# Reactive Function

The one simple function that allows you to make your values reactive to each other!

![NPM](https://static.npmjs.com/da3ab40fb0861d15c83854c29f5f2962.png) https://www.npmjs.com/package/@kamyil/reactive-function Link to NPM Package

Demo: https://codesandbox.io/s/reactive-function-demo-l8ms7?file=/src/index.ts

# Advantages

- **Minimalistic**
- **Very Light-weight**
- **100% Hardly Typed**
- **Framework agnostic**
- **Zero dependencies**

_(**DISCLAIMER**: This package is mainly my side project created and maintained purely for fun. It is battle tested and can be used on production freely, but...
please. Keep in mind that this project can be, but should not be used as an default reactive system if you're planning to create serious business-valuable project for either yourself or company you work for, since there are various of JavaScript frameworks already that are way more advanced. Also if you're looking for simpler but framework-agnostic reactivity system, I would rather recommend `@vue/reactivity` (https://www.google.com/search?client=safari&rls=en&q=%40vue%2Freactivity&ie=UTF-8&oe=UTF-8). **Consider this library being a last-ditch alternative**)_

OFC: feel free to suggest any changes in pull requests or raise an issue in Issues tab 😅

- [Reactive Function](#reactive-function)
- [Advantages](#advantages)
- [How to use it?](#how-to-use-it-)
- [How does it work?](#how-does-it-work-)
- [What about objects and arrays?](#what-about-objects-and-arrays-)
- [How to track changes?](#how-to-track-changes-)
  - [How to stop tracking changes?](#how-to-stop-tracking-changes-)
  - [How to sync reactive variables with HTML?](#how-to-sync-reactive-variables-with-html-)
- [For TypeScript users](#for-typescript-users)
- [When to pass value and when to pass callback?](#when-to-pass-value-and-when-to-pass-callback-)
- [I have `property $reactiveDataContainer does not exist on type (Window & typeof globalThis)` problem](#i-have--property--reactivedatacontainer-does-not-exist-on-type--window---typeof-globalthis---problem)
- [Inspirations](#inspirations)

# How to use it?

First import the function _(since it's written in TypeScript, you can auto-import it);_

```ts
import { reactive } from '@kamyil/reactive-function';
```

if you receive the error from your bundler/compiler that it cannot get the module (f.e. Vite can do that, because it points automatically on types.d.ts file instead of index.ts file), then import it this way

```ts
import { reactive } from '@kamyil/reactive-function/index';
```

or you can destructure it using `require` if you do not use any kind of module bundler for writing your Node application

```js
const { reactive } = require('@kamyil/reactive-function');
// or
const { reactive } = require('@kamyil/reactive-function/index');
```

Then pass your value into reactive function and assign it's result to variable

```ts
import { reactive } from '@kamyil/reactive-function';

const myReactiveValue = reactive('some random string');
```

And from now on you can get always-freshly updated value by accessing
it's `value` property

or update it by mutating `value` property as well

```ts
import { reactive } from '@kamyil/reactive-function';

const myReactiveValue = reactive('some random string');

console.log(myReactiveValue.value); // => 'some random string'
myReactiveValue.value = 'some another string';
console.log(myReactiveValue.value); // => 'some another string'
```

`What's so reactive about that huh? It's obvious that if you mutate properties, you will update and retrieve only fresh values`

You're absolutely right! But now the magic is going to happen. Let's say:
now you want to make it reactive to other reactive value

```ts
import { reactive } from '@kamyil/reactive-function';

const myNumber = reactive(2);
// and now let's make it dependent from number above
const anotherNumber = reactive(() => myNumber.value * 2);

// and now let's check if it will react on first reactive value change
myNumber.value = 4;

console.log(myNumber.value); // => 4
console.log(anotherNumber.value); // => 8
```

Voila!, it does react. But you may ask `'Why there is a function in second reactive variable?'`

The answer is actually pretty simple: JavaScript unlike Lazy computed languages like Haskell, it does compute expressions early before any function calls. So this kind of expression

```ts
const myNumber = reactive(2);
const anotherNumber = reactive(myNumber.value * 2);
```

... will early and automatically compute `myNumber.value * 2` into simple `4`
without saving any reference to `myNumber` variable. Thanks to passing function, we can save all references to all used variables in that function and then use those variables to compute always fresh and updated value as a result.

# How does it work?

All of your reactive values live inside `$reactiveDataContainer` variable
that sits inside `window` or `global` object (depending if you're running
this function in a browser or Node.js) and those reactive values retrieve, compute and
save references in there.
When `.value` is called, then the getter function runs

- checks all dependencies of itself
- gets values from them
- and computes new value

However when f.e. the `someReactive.value = 'some new value'` is being called, then it runs the setter function that will update the value,
update computing function and also trigger/call other dependent values to
react and update theirselves.
All thanks to JavaScript Proxy API
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
that allows to override default JavaScript behaviour to achieve such a thing 👏

# What about objects and arrays?

They can also be used in the same way like primitive values

```ts
let testArray = reactive([1, 2, 3]);
let testObject = reactive({
  name: 'Kamil',
  age: 23,
});
```

However, if you want to update it `YOU CANNOT MUTATE IT DIRECTLY`.
You have to always pass new values to them, because otherwise you will loose all of previous used data

```ts
testArray.value = [...testArray.value, 4];
testObject.value = {
  ...testObject.value,
  favoriteHero: 'Daredevil',
};
```

# How to track changes?

For this case there is a special tool function called `trackChanges`.
You can use it to perform your actions on every reactive value change

```ts
import { reactive, trackChanges } from '@kamyil/reactive-function';

const testNumber1 = reactive(1);

trackChanges(testNumber1, ({ previousValue, newValue }) => {
  // here will be value before update
  console.log(previousValue); // => 1
  // here will be value after update
  console.log(nextValue); // => 2
});

testNumber.value = 2;
```

- first argument: reactive value to track
- second argument: callback to perform on every change

## How to stop tracking changes?

However if you want to stop tracking changes, you can import another tool function called `stopTracking`. When called, it will stop tracking changes, not perform any passed
callback into `trackChanges` function anymore, and if any callback for `stopTracking` function was passed - it will call it once.

```ts
import {
  reactive,
  trackChanges,
  stopTracking,
} from '@kamyil/reactive-function';

const birthday = reactive(1);

trackChanges(testNumber1, ({ newValue }) => {
  if (newValue === 18) {
    stopTracking(() => alert(`Congratulations! You're an adult now!`));
  }
});

setInterval(() => birthday.value++, 1000);
```

## How to sync reactive variables with HTML?

There is a dedicated tool function for that case called `syncWithHTML`

```ts
import { reactive, syncWithHTML } from '@kamyil/reactive-function';

const myNumber = reactive(1);
const doubledNumber = reactive(() => myNumber.value * 2);

// And it will automatically reflect changes into your DOM Element
syncWithHTML(doubledNumber, '.element-to-sync');
```

However, if you want more flexibility with auto-updating HTML, then folow this recommendation.

_As mentioned before, you can grab always fresh value by getting `value`
property of your reactive variable like so: `yourVariable.value`.
You can combine it with tool function called `trackChanges` to update the DOM Element your own way. Since `trackChanges` accepts a callback as a second argument - there you have flexibility to perform any side-effects you want_

# For TypeScript users

Since this library is heavly using TypeScript and it's glorious features
to embrace developer's productivity and hapiness,
expect type inference in almost every place possible thanks to TypeScript Generics.

However if you want to type everything manually on your own,
you can pass your types/interfaces as a generic to this function

```ts
type Person = {
  name: string;
  age: number;
  favoriteHero?: string;
};

testObject = reactive<Person>({
  name: 'Kamyil',
  age: 24,
});
```

The same goes for tool functions like `trackChanges`, `stopTracking` and `syncHTML`;

# When to pass value and when to pass callback?

As mentioned earlier. Pass values directly
`ONLY` if they will not be dependent from any other reactive values.
Otherwise, put them after the lambda `() => yourVariable.value` in order
to save reference for your variables and produce always fresh values

# I have `property $reactiveDataContainer does not exist on type (Window & typeof globalThis)` problem

It means that your development environment did not catch extended `Window` & `Global` interfaces with this property. The possible fix for that would be adding it manually to your type definition file

```ts
import { IReactiveDataContainer } from '@kamyil/reactive-functions';

declare global {
  interface Window {
    $reactiveDataContainer: IReactiveDataContainer;
  }
  namespace NodeJS {
    interface Global {
      $reactiveDataContainer: IReactiveDataContainer;
    }
  }
}
```

# Inspirations

- `@vue/reactivity` by Evan You https://www.npmjs.com/package/@vue/reactivity
- `rxjs/observables` - https://rxjs-dev.firebaseapp.com/guide/observable
