import build from "./build.ts"
import dispatch from "./dispatch.ts"

if (import.meta.main) {
	try {
		const argsRaw = [...Deno.args]
		let suffix: string | undefined = undefined

		if (argsRaw[0] === "--suffix") {
			if (argsRaw[1] !== undefined) suffix = argsRaw.shift() && argsRaw.shift()
			else throw new Error("Specify a suffix.")
		}

		if (argsRaw[0] === "--build") {
			if (argsRaw[1] !== undefined) {
				const root = argsRaw.shift() && argsRaw.shift()
				if (argsRaw.length) throw new Error(`Unexpected arguments: ${argsRaw.join(" ")}`)
				if (root) {
					await build(root, suffix)
					Deno.exit(0)
				}
			}
			throw new Error("Specify a directory to find subcommands.")
		}

		const [root, ...args] = argsRaw
		if (root) Deno.exit(await dispatch({ root, suffix, args }))
		else throw new Error("Specify a directory to find subcommands.")
	} catch (error) {
		if (error) console.error(error)
	}
}