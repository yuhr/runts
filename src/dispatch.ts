import Command from "./Command.ts"
import enumerate from "./enumerate.ts"
import { join, toFileUrl, isAbsolute } from "https://deno.land/std@0.191.0/path/mod.ts"
import Distree from "https://deno.land/x/distree@v2.0.0/index.ts"

const execute = async (root: URL, path: string, args: readonly string[]) => {
	const specifier = new URL(path, root.href).href
	const { default: command } = await import(specifier)
	if (command instanceof Command) return (await command([...args])) ?? 0
	else
		throw new Error(
			`The file \`${specifier}\` found but no command is default-exported: ${specifier}`,
		)
}
const toUrl = (path: string) => {
	try {
		return new URL(path)
	} catch (error) {
		if (isAbsolute(path)) return toFileUrl(path)
		else return toFileUrl(join(Deno.cwd(), path))
	}
}

const rec = async (
	root: URL,
	suffix: string,
	distree: Distree<string>,
	args: readonly string[],
): Promise<number> => {
	const [arg, ...rest] = args

	if (arg) {
		const key = `${arg}.${suffix}.ts`
		const file = distree[key]
		if (typeof file === "string") return await execute(root, file, rest)

		const directory = distree[arg]
		if (Distree.isDistree(directory)) return await rec(root, suffix, directory, rest)
	}

	const key = `index.${suffix}.ts`
	const file = distree[key]
	if (typeof file === "string") return await execute(root, file, args)

	throw new Error("No such command exists.")
}

const tryImportRuntslist = async (root: URL) => {
	try {
		const specifier = new URL(`runtslist.ts`, root.href).href
		const { default: runtslist } = await import(specifier)
		return Distree.from<string>(runtslist)
	} catch (error) {
		return undefined
	}
}

/**
 * Dispatches subcommands.
 *
 * @returns Status code returned from the subcommand, or `0` if a nullish value is returned.
 */
const dispatch = async (options: {
	root: string | URL
	suffix?: string | undefined
	args: readonly string[]
}): Promise<number> => {
	const { root, suffix = "run", args } = options
	const rootUrl = root instanceof URL ? root : toUrl(root)
	if (!rootUrl.pathname.endsWith("/")) rootUrl.pathname += "/"
	if (rootUrl.protocol === "file:") {
		const distree = await enumerate(rootUrl, suffix)
		const runtslist = await tryImportRuntslist(rootUrl)
		if (runtslist) {
			// Check if `runtslist.ts` is outdated.
			const keysRuntslist = [...runtslist]
			const keysDistree = [...distree]
			const keys = new Map([...keysRuntslist, ...keysDistree])
			if (!(keys.size === keysRuntslist.length && keys.size === keysDistree.length))
				throw new Error(
					`Aborting due to outdated \`runtslist.ts\`. Run \`runts --build ${root}\` or remove the file.`,
				)
		}
		return await rec(rootUrl, suffix, distree, args)
	} else {
		const runtslist = await tryImportRuntslist(rootUrl)
		if (runtslist) return await rec(rootUrl, suffix, runtslist, args)
		else throw new Error(`Failed to load \`runtslist.ts\` at \`${rootUrl.href}/runtslist.ts\`.`)
	}
}

export default dispatch