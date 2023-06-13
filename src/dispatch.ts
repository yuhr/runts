import Command from "./Command.ts"
import enumerate from "./enumerate.ts"
import { toFileUrl } from "https://deno.land/std@0.191.0/path/mod.ts"
import Distree from "https://deno.land/x/distree@v2.0.0/index.ts"

const toImportSpecifier = async (path: string) => toFileUrl(await Deno.realPath(path)).href
const execute = async (path: string, args: readonly string[]) => {
	const specifier = await toImportSpecifier(path)
	const { default: command } = await import(specifier)
	if (command instanceof Command) return (await command([...args])) ?? 0
	else
		throw new Error(
			`The file \`${specifier}\` found but no command is default-exported: ${specifier}`,
		)
}

const rec = async (
	suffix: string,
	distree: Distree<string>,
	args: readonly string[],
): Promise<number> => {
	const [arg, ...rest] = args

	if (arg) {
		const key = `${arg}.${suffix}.ts`
		const file = distree[key]
		if (typeof file === "string") return await execute(file, rest)

		const directory = distree[arg]
		if (Distree.isDistree(directory)) return await rec(suffix, directory, rest)
	}

	const key = `index.${suffix}.ts`
	const file = distree[key]
	if (typeof file === "string") return await execute(file, args)

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