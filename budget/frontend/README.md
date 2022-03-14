# Frontend

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Usage

Use the makefile in the root of the directory to run the frontend and backend simultaneously. 

## Entities

This project is organized by the concept of entities. An entity is a logical grouping that contains everything it needs to represent itself. Entities can have dependencies between each other, but those dependencies should be minimized where possible.

### Importing

You should import an entity like this.

```js
import * as Entity from '../Entity';
```

1. Always import with the singular uppercase.
2. Never import another entity's sub-directory or file.

### Exporting

You should export properties from an entity like this.

```js
export * as context from './context'; // This is how to export a sub-directory
export { new } from './new'; // This is how to export a file.
export * from './new'; // Alternate way to export a file.
```

1. Only export an entity if you have to.
2. Remove unused exports.
3. Subdirectories should be exported as a property. Do not flatten them into the top level exports. (IE. Don't do this: `export * from './sub-directory';`)

### Naming

Do not use vague names such as `data`, `display`, and `utils`. Instead, think carefully about what it is you are trying to represent, then name it appropriately. 

### Plurality

Let's say there is a `Product` entity. How should multiples Products be handled? Since entities are not allowed to be plural, you can't make a `Products` entity. Instead, you should make a Product group. 

If the plural use-case is a component that displays multiple Products, you can have `Product.components.List`.

If the plural use-case has associated logic, context, or multiple components, you can make a sub-entity. `Product.Group.context.New()`. However, this should be avoided where possible.

### Structure

```
└── src
    ├── purchase
    │   ├── components
    │   │   ├── Card.js
    │   │   ├── index.js
    │   │   ├── List.js
    │   │   ├── UndoPurchase.js
    │   │   └── UndoRemove.js
    │   ├── context
    │   │   ├── New.js
    │   └── index.js
```
