# Reactive Function

The one simple function that allows you to make your values reactive to each other!

<img width="683" alt="Zrzut ekranu 2021-04-9 o 00 30 02" src="https://user-images.githubusercontent.com/26087070/114106898-194c9180-98d0-11eb-91f8-63fbcf82c81a.png">

![NPM](https://static.npmjs.com/da3ab40fb0861d15c83854c29f5f2962.png) https://www.npmjs.com/package/@kamyil/reactive-function Link to NPM Package


- [Reactive Function](#reactive-function)
  - [Advantages](#advantages)
  - [Purpose](#purpose)
  - [How does it work?](#how-does-it-work-)
  - [I have `property $reactiveDataContainer does not exist on type (Window & typeof globalThis)` problem](#i-have--property--reactivedatacontainer-does-not-exist-on-type--window---typeof-globalthis---problem)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

## Advantages

- **Minimalistic**
- **Light-weight**
- **Performant**
- **100% Hardly Typed**
- **Framework agnostic**
- **Zero dependencies**
- **Proxy-based**

## Purpose

- Make possibility to use reactive data completely without needing to include any JS framework or library
- Make it minimalistic. Don't bother developer with hard usage. Just pass your new value inside callback to reactive function argument like so:
  `let newReactiveValue = reactive(() => 'your new reactive value!');`

  ... and update it like so

`newReactiveValue.value = 'some new value';`

... and then every other reactive value that depends on your `newReactiveValue` will change as well

- Make it hardly typed for improving developer experience. **Reactive Function** serves it's own type with automatically interfered
  subtype of your new reactive value,

  <img width="632" alt="Zrzut ekranu 2021-04-9 o 01 12 08" src="https://user-images.githubusercontent.com/26087070/114107140-ab549a00-98d0-11eb-9060-433f9616b83f.png">

  so it will show you which values are reactive and which don't without forcing you to use any weird naming conventions for marking reactive variables. And also it will track any type problems without forcing you to implicitly write any type at all

- Make it Proxy based, so it won't make any "magic" to make it reactive. This function does use standard JavaScript's `Proxy` class to register, update and retrieve new and updated reactive values

## How does it work?

Every time when you use this function, it will register the callback (that you provide in argument)
inside global execution context (Browser od Node.JS) in `$reactiveDataContainer` property.
Every time you want to try to retrieve the reactive value, it will call this `$reactiveDataContainer` to perform this callback to
make sure that you will get fresh value every time (even if value is dependent from other reactive values). 

## How to import it?
Since it's standard ESModule, you can import it simply using `import` syntax
```ts
import { reactive } from "@kamyil/reactive-function";
```

or you can destructure it using `require` if you do not use any kind of module bundler for writing your Node application

```js
const { reactive } = require("@kamyil/reactive-function");
```

## How to use it?
1. First, declare your new reactive value
```ts
const myReactiveValue = reactive(() => 'your initial value goes here...');
```
2. Then you can update it by mutating the `value` property of it
```ts
myReactiveValue.value = 'new value';
```
And then every other dependent value will be automatically updated after the mutation

## Where this function could be useful?
Mainly in the legacy systems and old JS applications, where putting reactive JS framework (like React, Vue or Angular) would be extremely though challenge to do, but there is a need to create some reactive functionality

## I have `property $reactiveDataContainer does not exist on type (Window & typeof globalThis)` problem

It means that your development environment did not catch extended `Window` & `Global` with this property. The possible fix for that would be adding it manually to your type definition file

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
