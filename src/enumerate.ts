import Distree from "https://deno.land/x/distree@v2.0.0/index.ts"

const escapeForRegExp = (string: string) =>
	string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")
const createRegExpFromSuffix = (suffix: string) =>
	new RegExp(`(?<name>[^/]+?)(?<suffix>\\.${escapeForRegExp(suffix)}\\.ts)$`, "u")

/**
 * Enumerates subcommands from a directory. The return value is a nested object and the terminal values are absolute paths to the subcommands.
 *
 * @param root The directory to enumerate subcommands from.
 * @param suffix The suffix of the subcommand filenames, e.g. `*.<suffix>.ts`.
 */
const enumerate = async (root: string, suffix: string = "run") => {
	if (!suffix) throw new Error("Suffix cannot be empty.")
	if (suffix.search("/") !== -1) throw new Error("Suffix cannot contain slashes.")
	if (suffix.startsWith(".") || suffix.endsWith("."))
		throw new Error("Suffix cannot start or end with dots.")
	const path = await Deno.realPath(root)
	const regExp = createRegExpFromSuffix(suffix)
	return await Distree.fromDirectory(path, async path => {
		const matched = path.match(regExp)
		if (matched) return path
		throw undefined
	})
}

export default enumerate