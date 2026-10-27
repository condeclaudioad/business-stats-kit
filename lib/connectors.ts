import 'server-only';
import {business} from '../business.config';
import {createConnectors} from './provider-connectors';
// Survives module reloads in this process, never exposed to the browser.
const state=globalThis as typeof globalThis & { statsConnectors?:{scope:string;instance:ReturnType<typeof createConnectors>} };
const scope=JSON.stringify(business);
if(state.statsConnectors?.scope!==scope)state.statsConnectors={scope,instance:createConnectors(business,process.env)};
const connectors=state.statsConnectors!.instance;
export const {stripeMetrics,metaMetrics}=connectors;
