# Reactive Function

The one simple function that allows you to make your values reactive to each other!

![NPM](https://static.npmjs.com/da3ab40fb0861d15c83854c29f5f2962.png) https://www.npmjs.com/package/@kamyil/reactive-function Link to NPM Package

Demo: https://codesandbox.io/s/reactive-function-demo-l8ms7?file=/src/index.ts

- [Reactive Function](#reactive-function)
- [Advantages](#advantages)
- [How to use it?](#how-to-use-it-)
- [How does it work?](#how-does-it-work-)
- [What about objects and arrays?](#what-about-objects-and-arrays-)
- [How to track changes?](#how-to-track-changes-)
  * [How to stop tracking changes?](#how-to-stop-tracking-changes-)
- [For TypeScript users](#for-typescript-users)
- [When to pass value and when to pass callback?](#when-to-pass-value-and-when-to-pass-callback-)
- [I have `property $reactiveDataContainer does not exist on type (Window & typeof globalThis)` problem](#i-have--property--reactivedatacontainer-does-not-exist-on-type--window---typeof-globalthis---problem)
- [Inspirations](#inspirations)

# Advantages

- **Minimalistic**
- **Light-weight**
- **100% Hardly Typed**
- **Framework agnostic**
- **Zero dependencies**

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
now you want to make it reactive/dependent to other reactive value

```ts
import { reactive } from '@kamyil/reactive-function';

const myNumber = reactive(2);
// and now let make it dependent from number above
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
without saving any reference to `myNumber` variable. Thanks to passing function, we can save all references to all used variables in that function, then use values from those variables and compute always fresh and updated value as a result.

# How does it work?

All of your reactive values live inside `$reactiveDataContainer` variable
that sits inside `window` or `global` object (depending if you're running
this function in a browser or Node.js) and those reactive values retrieve, compute and
save references in there.
When `someReactive.value` is called, then the getter function runs

- checks all dependencies of itself
- gets values from them
- and computes new value

However when f.e. the `someReactive.value = 'some new value'` is being called, then it runs the setter function that will update the value
and compute function and also trigger/call other dependent values to
react on that and update theirselves.
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
const testNumber1 = reactive(1);

trackChanges(testNumber1, ({ previousValue, newValue }) => {
  // here will be value before update
  console.log(previousValue); // => 1
  // here will be value after update
  console.log(nextValue); // => 2
});

testNumber.value = 2;
```

## How to stop tracking changes?

However if you want to stop tracking changes, you can destructure
subhelper tool from `trackChanges` function called `stopTracking`,
where when called => it will stop tracking changes, not perform any passed
callback into `trackChanges` function anymore, and if any callback for `stopTracking` function was passed - it will call it once.

```ts
const birthday = reactive(1);

const { stopTracking } = trackChanges(testNumber1, ({ newValue }) => {
  if (newValue === 18) {
    stopTracking(() => alert('Congratulations! Youre an adult now!'));
  }
});

setTimeout(() => birthday.value++, 1000);
```

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

The same goes for tool functions like `trackChanges`;

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
