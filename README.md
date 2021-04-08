# Reactive Function

The one simple function that allows you to make your values reactive to each other!

## Advantages

- **Minimalistic**
- **Light-weight `(451B) `**
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

- Make it small size

- Make it hardly typed for improving developer experience. **Reactive Function** serves it's own type with automatically interfered
  subtype of your new reactive value, so it will show you which values are reactive and which don't without forcing you to use any weird naming conventions for marking reactive variables. And also it will track any type problems without forcing you to implicitly write any type at all

- Make it Proxy based, so it won't make any "magic" to make it reactive. This function does use standard JavaScript's `Proxy` class to register, update and retrieve new and updated reactive values
