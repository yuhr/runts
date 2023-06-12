namespace Command {
	export type Executor = (args: string[]) => number | void | Promise<number | void>
}

interface Command {
	(args: string[]): number | void | Promise<number | void>
}

class Command {
	constructor(executor: Command.Executor) {
		return Object.setPrototypeOf(executor, new.target.prototype)
	}
}

export default Command