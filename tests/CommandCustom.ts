import Command from "../src/Command.ts"

class CommandCustom extends Command {
	constructor(executor: Command.Executor) {
		super(async (...args) => {
			console.log("Arguments:", args)
			return await executor(...args)
		})
	}
}

export default CommandCustom