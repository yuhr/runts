import Command from "./Command.ts"
import dispatch from "./dispatch.ts"

namespace index {
	export type Executor = Command.Executor
}
type index = Command
const index = Object.assign(Command, { dispatch })

export default index