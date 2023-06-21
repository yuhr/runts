import Command from "./Command.ts"
import build from "./build.ts"
import dispatch from "./dispatch.ts"
import enumerate from "./enumerate.ts"

namespace index {
	export type Executor = Command.Executor
}
type index = Command
const index = Object.assign(Command, { dispatch, enumerate, build })

export default index