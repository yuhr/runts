<div align="center"><br><br>

# RUNTS

[![License](https://img.shields.io/github/license/yuhr/runts?color=%231e2327)](LICENSE)

Filesystem-based subcommand dispatcher for Deno.

<br><br></div>

`runts` is a tiny, lightweight subcommand dispatcher that finds subcommands based on the filesystem structure.

## Basic Usage

Create a file with the filename being `<your-subcommand-name>.run.ts`, say `greet.run.ts` here and the content is like this:

```typescript
import Command from "https://lib.deno.dev/x/runts@v1/Command.ts"

export default new Command(([name]) => {
	if (name) console.log(`Hello, ${name}!`)
	else console.log("Who are you?")
})
```

`runts` has a built-in CLI, so you can run it using [`land`](https://github.com/ije/land):

```sh
$ land -A runts . greet
Who are you?
```

Or if you install directly:

```sh
$ deno install -Af https://lib.deno.dev/x/runts@v1/runts.ts
$ runts . greet World
Hello, World!
```

Alternatively, of course you can create your own script and call the `dispatch` function:

```typescript
#!/usr/bin/env -S deno run -A

import dispatch from "https://lib.deno.dev/x/runts@v1/dispatch.ts"

if (import.meta.main)
	Deno.exit(
		await dispatch({
			root: ".",
			suffix: "run",
			args: Deno.args,
		}),
	)
```

Changing the suffix when using the CLI is possible by `--suffix` option. When you want your subcommands to be named like `greet.cmd.ts`:

```sh
$ runts --suffix cmd . greet World
```

## Suffix Restriction

- Cannot be empty
- Cannot contain slashes
- Cannot start or end with dots

These restrictions are by design and will never be lifted.

## `index` Special-Case

If there's a file named `index.run.ts`, it will be used as the default subcommand for the directory. For example, in addition to `greet.run.ts` above, if you have `index.run.ts` with the following content:

```typescript
export { default } from "./greet.run.ts"
```

Then you can run it like this:

```sh
$ runts . World
Hello, World!
```

## Extending `Command`

By default, arguments passed to a subcommand are given just as `string[]`. Further parsing is out of scope of this library so that you can handle it yourself or combine with existing libraries you like.

If you want to insert middlewares before/after an execution of subcommand, you can extend the `Command` class:

```typescript
import Command from "https://lib.deno.dev/x/runts@v1/Command.ts"

class CommandCustom extends Command {
	constructor(executor: Command.Executor) {
		super(async (...args) => {
			console.log("Arguments:", args)
			return await executor(...args)
		})
	}
}

export default CommandCustom
```

And simply replace `Command` with this in your `*.run.ts`.

## Semver Policy

Only the default exports are public APIs and remain stable throughout minor version bumps. Named exports should be considered private and unstable. Any single release may randomly contain breaking changes to named exports, so users should avoid using them where possible.