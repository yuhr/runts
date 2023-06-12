import Command from "./Command.ts"
import enumerate from "./enumerate.ts"
import Distree from "https://deno.land/x/distree@v2.0.0/index.ts"

const rec = async (
	suffix: string,
	distree: Distree<string>,
	args: readonly string[],
): Promise<number> => {
	const [arg, ...rest] = args
	if (arg) {
		const file = distree[`${arg}.${suffix}.ts`]
		if (typeof file === "string") {
			const { default: command } = await import(file)
			if (command instanceof Command) return (await command(rest)) ?? 0
		}

		const directory = distree[arg]
		if (Distree.isDistree(directory)) return await rec(suffix, directory, rest)
	}

	const index = distree[`index.${suffix}.ts`]
	if (typeof index === "string") {
		const { default: command } = await import(index)
		if (command instanceof Command) return (await command([...args])) ?? 0
	}

	throw new Error("No such command exists.")
}

/**
 * Dispatches subcommands.
 *
 * @returns Status code returned from the subcommand, or `0` if a nullish value is returned.
 */
const dispatch = async (options: {
	root: string
	suffix?: string | undefined
	args: readonly string[]
}): Promise<number> => {
	const { root, suffix = "run", args } = options
	const distree = await enumerate(root, suffix)
	return await rec(suffix, distree, args)
}

export default dispatch