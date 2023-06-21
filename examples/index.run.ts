import dispatch from "../src/dispatch.ts"

if (import.meta.main)
	dispatch({
		root: import.meta.resolve("./."),
		suffix: "run",
		args: Deno.args,
	}).then(Deno.exit)

export { default } from "./greet.run.ts"