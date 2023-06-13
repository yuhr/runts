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