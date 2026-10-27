import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDisposableDatabase} from '../e2e/disposable-database.mjs';
test('browser fixture reset refuses libpq overrides, remote hosts and non-disposable databases',()=>{
  const local='postgresql://test:synthetic@127.0.0.1:55439/kit_e2e_test';
  assert.equal(validateDisposableDatabase(local),local);
  for(const value of [local+'?host=remote.example',local+'?dbname=production',local+'#ignored',local.replace('127.0.0.1','remote.example'),local.replace('kit_e2e_test','production'),local.replace('postgresql:','https:'),local.replace('kit_e2e_test','kit%5Fe2e_test')])assert.throws(()=>validateDisposableDatabase(value));
});
