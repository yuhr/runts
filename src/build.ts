import enumerate from "./enumerate.ts"
import { resolve, relative } from "https://deno.land/std@0.191.0/path/mod.ts"
import Distree from "https://deno.land/x/distree@v2.0.0/index.ts"

const build = async (root: string, suffix: string = "run") => {
	const commands = await enumerate(root, suffix)
	const rootReal = await Deno.realPath(root)
	const refs = Distree.transform(commands, path => `./${relative(rootReal, path)}`)
	const content = `export default ${Deno.inspect(refs, { depth: Infinity })}`
	await Deno.writeTextFile(resolve(rootReal, "runtslist.ts"), content)
}

export default build