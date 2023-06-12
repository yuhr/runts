import CommandCustom from "./CommandCustom.ts"

export default new CommandCustom(([name]) => {
	if (name) console.log(`Hello, ${name}!`)
	else console.log("Who are you?")
})