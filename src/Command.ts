namespace Command {
	export type Executor = (args: string[]) => number | void | Promise<number | void>
}

interface Command {
	(args: string[]): number | void | Promise<number | void>
}

class Command {
	constructor(executor: Command.Executor) {
		return Object.defineProperty(
			Object.setPrototypeOf(executor, new.target.prototype),
			Symbol.for("runts"),
			{ value: undefined, configurable: false, enumerable: false, writable: false },
		)
	}
}

export default Command