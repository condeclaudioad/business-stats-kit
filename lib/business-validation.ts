import { assertSupportedCurrency } from './contracts';
export type BusinessConfig = {name:string;currency:string;timezone:string;stripe:{productIds:string[]};meta:{accounts:{accountId:string;campaignIds:string[]}[]}};
export function validateBusiness(b:BusinessConfig):string[]{
 const issues:string[]=[];
 if(!b.name?.trim())issues.push('Falta el nombre del negocio.');
 try{assertSupportedCurrency(b.currency);}catch{issues.push('Moneda no soportada; revisá docs/integrations.md.');}
 try{new Intl.DateTimeFormat('en',{timeZone:b.timezone}).format();if(!b.timezone)throw Error();}catch{issues.push('Zona horaria IANA inválida.');}
 if(b.stripe.productIds.some(x=>!/^prod_[A-Za-z0-9]+$/.test(x)))issues.push('Stripe requiere IDs de producto prod_, no price_ ni nombres.');
 if(new Set(b.stripe.productIds).size!==b.stripe.productIds.length)issues.push('Producto Stripe repetido.');
 const ids=b.meta.accounts.map(x=>x.accountId), campaigns=b.meta.accounts.flatMap(x=>x.campaignIds);
 if(new Set(ids).size!==ids.length||new Set(campaigns).size!==campaigns.length)issues.push('Cuenta o campaña Meta repetida.');
 if(b.meta.accounts.some(x=>!/^act_\d+$/.test(x.accountId)||!x.campaignIds.length||x.campaignIds.some(c=>!/^\d+$/.test(c))))issues.push('Meta requiere IDs exactos de cuenta y campañas.');
 return issues;
}
