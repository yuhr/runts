@_:
	just --list

setup:
	chmod +x .githooks/*
	git config --local core.hooksPath .githooks

test:
	deno test --allow-net --allow-read tests

bundle:
	deno run -A bundle.ts

pack: bundle
	cd dist && pnpm pack