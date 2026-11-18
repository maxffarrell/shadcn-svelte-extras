import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';

const appRequire = createRequire(new URL('../package.json', import.meta.url));
const superformsRequire = createRequire(appRequire.resolve('sveltekit-superforms'));
const { merge } = superformsRequire('ts-deepmerge');

test('Superforms merge dependency ignores unsafe prototype methods', () => {
	for (const input of [
		{ toString: null },
		{ toString: 1, valueOf: null },
		{ hasOwnProperty: false, toLocaleString: null }
	]) {
		const result = merge({}, input);
		assert.equal(String(result), '[object Object]');
		for (const key of Object.keys(input)) assert.equal(Object.hasOwn(result, key), false);
	}
});

test('Superforms merge dependency preserves ordinary nested data and arrays', () => {
	assert.deepEqual(
		merge({ profile: { name: 'Ada' }, tags: ['a'] }, { profile: { active: true }, tags: ['b'] }),
		{
			profile: { name: 'Ada', active: true },
			tags: ['a', 'b']
		}
	);
});
