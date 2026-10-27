import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createConnectors} from '../lib/provider-connectors';
import {createSourceCache} from '../lib/source-cache';
import {dayAt} from '../lib/contracts';
import type {BusinessConfig} from '../lib/business-validation';
const config=():BusinessConfig=>({name:'Synthetic',currency:'USD',timezone:'UTC',stripe:{productIds:['prod_test']},meta:{accounts:[{accountId:'act_123',campaignIds:['456']}]}});
const env={STRIPE_RESTRICTED_KEY:'synthetic',META_ACCESS_TOKEN:'synthetic',META_API_VERSION:'v25.0'};
const paid=()=>({id:'in_test',currency:'usd',amount_paid:1234,status_transitions:{paid_at:Math.floor(Date.now()/1000)-60},lines:{has_more:false,data:[{price:{product:'prod_test'}}]}});
function transport(overrides:(url:URL)=>unknown=(url)=>undefined){let calls=0;return {get calls(){return calls;},fetch:(async(input:RequestInfo|URL)=>{calls++;const u=new URL(String(input)),custom=overrides(u);if(custom instanceof Response)return custom;if(custom)return Response.json(custom);if(u.pathname.endsWith('/invoices'))return Response.json({has_more:false,data:[paid()]});if(u.pathname.endsWith('/subscriptions'))return Response.json({has_more:false,data:[]});if(u.pathname.endsWith('/insights'))return Response.json({data:[{campaign_id:'456',date_start:dayAt(Date.now()/1000,'UTC'),spend:'5.20',inline_link_clicks:'4'}]});if(u.pathname.endsWith('/456'))return Response.json({id:'456',account_id:'123'});return Response.json({currency:'USD',timezone_name:'UTC'});}) as typeof fetch};}
test('concurrent refresh/ranges reuse provider reads and expose original read time',async()=>{const t=transport(),c=createConnectors(config(),env,t.fetch);const results=await Promise.all([c.stripeMetrics(7),c.stripeMetrics(30),c.stripeMetrics(7)]);assert.equal(t.calls,2);assert.equal(results[0]?.paid,12.34);assert.equal(results[0]?.readAt,results[2]?.readAt);});
test('Stripe malformed paid amounts, missing pagination and invalid dates fail instead of zero/NaN',async()=>{for(const value of [NaN,undefined,-1,'1234']){const t=transport(u=>u.pathname.endsWith('/invoices')?{data:[{...paid(),amount_paid:value}],has_more:false}:undefined);await assert.rejects(createConnectors(config(),env,t.fetch).stripeMetrics(7));}const t=transport(u=>u.pathname.endsWith('/invoices')?{data:[]}:undefined);await assert.rejects(createConnectors(config(),env,t.fetch).stripeMetrics(7));});
test('Stripe paginated history cannot repeat a cursor and inflate totals',async()=>{const t=transport(u=>u.pathname.endsWith('/invoices')?{data:[paid()],has_more:true}:undefined);await assert.rejects(createConnectors(config(),env,t.fetch).stripeMetrics(7),/duplicado|Cursor/);});
test('Meta validates campaign and day returned, duplicate rows and monetary data',async()=>{const row={campaign_id:'456',date_start:dayAt(Date.now()/1000,'UTC'),spend:'5',inline_link_clicks:'2'};for(const data of [[{...row,campaign_id:'999'}],[{...row,date_start:'2000-01-01'}],[row,row],[{...row,spend:null}],[{...row,inline_link_clicks:'-1'}]]){const t=transport(u=>u.pathname.endsWith('/insights')?{data}:undefined);await assert.rejects(createConnectors(config(),env,t.fetch).metaMetrics(7));}});
test('one inaccessible Meta account rejects the whole combined source',async()=>{const b=config();b.meta.accounts.push({accountId:'act_789',campaignIds:['888']});const t=transport(u=>u.pathname.includes('act_789')?new Response('',{status:403}):undefined);await assert.rejects(createConnectors(b,env,t.fetch).metaMetrics(7));});
test('cache expires, coalesces failures briefly and never serves stale values after failure',async()=>{let clock=0,calls=0;const read=createSourceCache(60,5,()=>clock);assert.equal((await read('a',async()=>++calls)).value,1);clock=61;const fail=()=>{calls++;throw Error('down')};await assert.rejects(read('a',async()=>fail()));await assert.rejects(read('a',async()=>fail()));assert.equal(calls,2);clock=67;assert.equal((await read('a',async()=>++calls)).value,3);});

test('Stripe rejects repeated IDs on a terminal page and within the first page',async()=>{
 for(const samePage of [false,true]){
  const t=transport(u=>u.pathname.endsWith('/invoices')?{data:samePage?[paid(),paid()]:[paid()],has_more:!samePage&&!u.searchParams.has('starting_after')}:undefined);
  await assert.rejects(createConnectors(config(),env,t.fetch).stripeMetrics(7),/duplicado/);
 }
});
test('Meta verifies campaign ownership before accepting empty Insights and caches the verification',async()=>{
 for(const campaign of [{id:'456',account_id:'999'},{id:'999',account_id:'123'},{},new Response('',{status:404})]){
  let insights=0;
  const t=transport(u=>{if(u.pathname.endsWith('/456'))return campaign;if(u.pathname.endsWith('/insights')){insights++;return {data:[]};}});
  await assert.rejects(createConnectors(config(),env,t.fetch).metaMetrics(7));
  assert.equal(insights,0);
 }
 let campaignReads=0;
 const t=transport(u=>{if(u.pathname.endsWith('/456')){campaignReads++;return {id:'456',account_id:'123'};}if(u.pathname.endsWith('/insights'))return {data:[]};});
 const c=createConnectors(config(),env,t.fetch);
 assert.equal((await c.metaMetrics(7))?.spend,0);
 assert.equal((await c.metaMetrics(30))?.spend,0);
 assert.equal(campaignReads,1);
});
