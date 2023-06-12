import dispatch from "./dispatch.ts"

if (import.meta.main) {
	try {
		const argsRaw = [...Deno.args]
		let suffix: string | undefined = undefined
		if (argsRaw[0] === "--suffix") {
			if (argsRaw[1] !== undefined) suffix = argsRaw.shift() && argsRaw.shift()
			else throw new Error("Specify a suffix.")
		}
		const [root, ...args] = argsRaw
		if (root) Deno.exit(await dispatch({ root, suffix, args }))
		else throw new Error("Specify a directory to find subcommands.")
	} catch (error) {
		if (error) console.error(error)
	}
}