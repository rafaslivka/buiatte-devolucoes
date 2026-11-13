/* Regras operacionais puras: compartilhadas pelo navegador e pelos testes. */
(function(root){
'use strict';
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const text=v=>String(v??'').trim();
const uid=()=>globalThis.crypto?.randomUUID?.()||Math.random().toString(36).slice(2)+Date.now().toString(36);
const now=()=>new Date().toISOString();
const aliases={date:['Data Agenda','Agenda CD','DATA_AGENDA','Data Agendamento','Data'],carrier:['Transportadora'],ad:['AD - Número','AD'],reason:['Motivo da devolução','Motivo'],client:['Nome','Cliente'],value:['Valor Total Produtos'],nf:['NFe Venda','NF Venda','Nota Fiscal Venda'],nfd:['NFe Ret/Dev','NFD'],sku:['Material','SKU','Código SKU'],description:['Descrição','Denominação de item','Descrição Material'],qty:['Quantidade Ret/Dev','Quantidade','Qtd','Qtd Ret/Dev','QTDE'],cd:['Nome do CD'],claim:['Valor Total Chamado'],shipment:['Remessa Venda','Remessa'],operation:['Tipo Operação Retorno/Devolução','Tipo Operação'],center:['Centro de Destino','Centro'],ean:['EAN','Código EAN','EAN13','EAN 13','Código de barras'],key:['Chave de acesso','Chave CT-e','Chave CTe','Chave do CTe','Chave de acesso CT-e']};
const required=['nf','sku','qty'];
function dateISO(v){
 if(v instanceof Date&&!isNaN(v))return `${v.getUTCFullYear()}-${String(v.getUTCMonth()+1).padStart(2,'0')}-${String(v.getUTCDate()).padStart(2,'0')}`;
 if(typeof v==='number')return dateISO(new Date(Date.UTC(1899,11,30)+Math.floor(v)*86400000));
 let s=text(v),m=s.match(/^(\d{4})-(\d{2})-(\d{2})/)||s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
 if(!m)return '';let [y,mo,d]=m[1].length===4?[+m[1],+m[2],+m[3]]:[+m[3],+m[2],+m[1]];
 let dt=new Date(Date.UTC(y,mo-1,d));return dt.getUTCFullYear()===y&&dt.getUTCMonth()===mo-1&&dt.getUTCDate()===d?`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`:'';
}
function mapping(row){const m={};for(const [k,aa]of Object.entries(aliases)){const i=row.findIndex(v=>aa.some(a=>norm(a)===norm(v)));if(i>=0)m[k]=i;}return m;}
function parseSheets(sheets,carrierOverride='',fallbackDate=''){
 const rows=[],errors=[],warnings=[];let matched=0;
 for(const sheet of sheets){let map=null;
  for(let i=0;i<sheet.rows.length;i++){
   const r=sheet.rows[i];if(!r.some(v=>text(v)))continue;
   const h=mapping(r);if(required.every(k=>h[k]!==undefined)){map=h;matched++;continue;}if(!map)continue;
   if(norm(r[map.sku])==='TOTAL'||(/^TOTAL/.test(norm(r[0]))&&!text(r[map.key])))continue;
   const x=Object.fromEntries(Object.keys(aliases).map(k=>[k,map[k]===undefined?'':text(r[map[k]])]));
   const loc=`${sheet.name}, linha ${i+1}`;
   const fail=[];x.date=dateISO(r[map.date])||(!text(r[map.date])?dateISO(fallbackDate):'');x.carrier=text(carrierOverride||x.carrier).toUpperCase();
   x.qty=Number(x.qty.replace(',','.'));
   if(!x.date)fail.push('data inválida');if(!x.carrier)fail.push('transportadora ausente (preencha acima)');
   if(!x.nf||!x.sku)fail.push('NF de venda e material são obrigatórios');
   if(!Number.isInteger(x.qty)||x.qty<1||x.qty>100000)fail.push('quantidade deve ser inteira de 1 a 100.000');
   if(typeof r[map.key]==='number'||!/^\d{44}$/.test(x.key)){warnings.push(`${loc}: CT-e ausente ou inválido; chave numérica pode perder precisão. Scanner indisponível para este item.`);x.key='';}
   if(typeof r[map.ean]==='number'&&Number.isSafeInteger(r[map.ean]))x.ean=String(r[map.ean]);
   if(!/^\d{8,14}$/.test(x.ean)){warnings.push(`${loc}: EAN ausente ou inválido. Scanner indisponível para este item.`);x.ean='';}
   if(fail.length)errors.push(`${loc}: ${fail.join('; ')}.`);else rows.push({...x,sourceRow:i+1,sourceSheet:sheet.name});
  }
 }
 if(!matched)errors.push('Cabeçalho não encontrado. Obrigatórios: NFe Venda/NF Venda, Material/SKU e Quantidade/Qtd. Informe data e transportadora quando ausentes.');
 if(!rows.length&&!errors.length)errors.push('Nenhum item encontrado.');
 const seen=new Set();for(const x of rows){const {sourceRow,sourceSheet,...data}=x;const k=JSON.stringify(data);if(seen.has(k))warnings.push('Existem linhas repetidas; confira a prévia.');seen.add(k);}
 const grouped=new Map();for(const x of rows){const k=x.date+'|'+x.carrier;if(!grouped.has(k))grouped.set(k,[]);grouped.get(k).push(x);}
 return {rows,errors,warnings:[...new Set(warnings)],groups:[...grouped.values()]};
}
function empty(){return {version:1,revision:0,appointments:[],movements:[],collections:[],occurrences:[],logs:[]};}
function log(s,type,ag,person,detail){s.logs.push({id:uid(),time:now(),type,ag,person,detail});}
function importGroups(s,parsed,file,person){
 if(parsed.errors.length||!parsed.rows.length)throw Error('Corrija a importação antes de continuar.');if(!text(person))throw Error('Informe o responsável.');
 const added=[];
 for(const group of parsed.groups){
  const signature=JSON.stringify(group.map(({sourceRow,sourceSheet,...r})=>r));
  if(s.appointments.some(a=>a.signature===signature))throw Error('Este conteúdo já foi importado. Nenhum agendamento foi adicionado.');
  const a={id:'DEV-'+group[0].date.replaceAll('-','')+'-'+uid().slice(0,8).toUpperCase(),date:group[0].date,carrier:group[0].carrier,file,signature,status:'Não iniciado',created:now(),startedBy:'',finishedBy:'',items:group.map(x=>({...x,id:uid()}))};added.push(a);
 }
 for(const a of added){s.appointments.push(a);log(s,'Importação',a.id,person,`${a.items.length} itens • ${file}`);}return added;
}
function active(s,id){const a=s.appointments.find(a=>a.id===id);if(!a)throw Error('Agendamento não encontrado.');return a;}
function editable(s,id){const a=active(s,id);if(a.status!=='Em andamento')throw Error('Abra ou reabra o agendamento antes de registrar.');return a;}
const receipts=(s,ag,item)=>s.movements.filter(m=>m.ag===ag&&(!item||m.item===item)&&!m.voided);
function counts(s,a){if(a.summary)return a.totals;let expected=0,ok=0,pending=0,div=0;for(const i of a.items){const ms=receipts(s,a.id,i.id),n=ms.filter(m=>m.result==='OK').length;expected+=i.qty;ok+=n;pending+=Math.max(0,i.qty-n);div+=ms.filter(m=>m.result!=='OK').length;}return {expected,ok,pending,div,percent:expected?Math.min(100,Math.round(ok/expected*100)):0};}
function start(s,id,person){if(!text(person))throw Error('Responsável obrigatório.');const a=active(s,id);if(a.status==='Finalizado')throw Error('Use Reabrir para este agendamento.');if(a.status==='Não iniciado'){a.status='Em andamento';a.startedBy=person;a.started=now();log(s,'Abertura',id,person,'Conferência iniciada');}}
function reopen(s,id,person,reason){const a=active(s,id);if(a.status!=='Finalizado')throw Error('Agendamento não finalizado.');if(!text(person)||!text(reason))throw Error('Responsável e motivo obrigatórios.');a.status='Em andamento';log(s,'Reabertura',id,person,reason);}
function finish(s,id,person,allowPending=false){const a=editable(s,id);if(!text(person))throw Error('Responsável obrigatório.');if(counts(s,a).pending&&!allowPending)throw Error('Confirme a finalização com volumes pendentes.');a.status='Finalizado';a.finishedBy=person;a.finished=now();log(s,'Finalização',id,person,`${counts(s,a).pending} volumes sem recebimento OK`);}
function checkSerials(s,ag,serial,extra,exclude){const vals=[text(serial),text(extra)].filter(Boolean).map(v=>v.toUpperCase());const used=[...receipts(s,ag),...(s.collections||[]).filter(c=>c.ag===ag)].filter(m=>m.id!==exclude).flatMap(m=>[m.serial,m.extra]).filter(Boolean).map(v=>v.toUpperCase());if(vals.some(v=>used.includes(v)))throw Error('Serial já registrado neste agendamento (principal ou adicional).');}
function resolve(s,id,form){const a=editable(s,id);const key=text(form.key);if(!/^\d{44}$/.test(key))throw Error('Bipe a chave completa de 44 dígitos.');const byKey=a.items.filter(i=>i.key===key&&/^\d{8,14}$/.test(i.ean));if(!byKey.length)throw Error('Chave não pertence ao agendamento ativo.');const code=text(form.ean);if(!code)throw Error('Informe EAN ou SKU.');const exact=byKey.filter(i=>i.ean===code||i.sku.toUpperCase()===code.toUpperCase());let candidates=exact.length?exact:byKey;
 const item=form.item?candidates.find(i=>i.id===form.item):candidates.length===1?candidates[0]:null;
 if(!item)return {candidates,ambiguous:true};const n=receipts(s,id,item.id).filter(m=>m.result==='OK').length;
 return {item,candidates,result:!exact.length?'MATERIAL DIVERGENTE':n>=item.qty?'EXCEDENTE':'OK'};
}
function receive(s,id,form,person,acceptDivergence=false){
 const a=editable(s,id);if(!text(person))throw Error('Responsável obrigatório.');if(!text(form.lot))throw Error('Lote indústria obrigatório.');
 let item,result;
 if(form.mode==='MANUAL'){item=a.items.find(i=>i.id===form.item);if(!item)throw Error('Selecione o item da NF.');if(!text(form.reason))throw Error('Motivo do lançamento manual obrigatório.');if(receipts(s,id,item.id).filter(m=>m.result==='OK').length>=item.qty)throw Error('Quantidade prevista já recebida. Use a bipagem para registrar excedente.');result='OK';}
 else{const match=resolve(s,id,form);if(match.ambiguous)throw Error('Selecione a NF/material correspondente entre os itens da chave.');({item,result}=match);}
 if(result!=='OK'&&!acceptDivergence)throw Error('Confirme o recebimento com divergência.');
 checkSerials(s,id,form.serial,form.extra);
 const m={id:uid(),ag:id,item:item.id,time:now(),person,mode:form.mode||'BIPAGEM',result,key:item.key,ean:text(form.ean)||item.ean,serial:text(form.serial),extra:text(form.extra),lot:text(form.lot),reason:text(form.reason),damage:!!form.damage,treatment:'Pendente'};
 s.movements.push(m);log(s,'Recebimento',id,person,`${item.sku} • ${result} • movimento ${m.id}`);return m;
}
function voidMovement(s,id,person,reason){const m=s.movements.find(x=>x.id===id);if(!m)throw Error('Movimento não encontrado.');editable(s,m.ag);if(!text(person)||!text(reason))throw Error('Informe responsável e motivo.');if(m.voided)throw Error('Movimento já estornado.');m.voided=true;m.voidReason=reason;log(s,'Estorno',m.ag,person,`${m.id}: ${reason}`);}
function occurrence(s,id,itemId,type,qty,person,note){const a=editable(s,id),item=a.items.find(i=>i.id===itemId);if(!item||!['FALTA','AVARIA'].includes(type)||!Number.isInteger(qty)||qty<1)throw Error('Selecione item, tipo e quantidade válida.');if(!text(person)||!text(note))throw Error('Responsável e observação obrigatórios.');if(type==='FALTA'&&qty>Math.max(0,item.qty-receipts(s,id,itemId).filter(m=>m.result==='OK').length))throw Error('Falta maior que o saldo pendente.');s.occurrences.push({id:uid(),ag:id,item:itemId,type,qty,person,note,time:now()});log(s,type,id,person,`${item.sku} • ${qty} • ${note}`);}
function report(s,a){
 const movements=new Map(),collected=new Map();
 function group(map,row){if(!map.has(row.item))map.set(row.item,[]);map.get(row.item).push(row);}
 for(const m of receipts(s,a.id))group(movements,m);
 for(const c of s.collections||[])if(c.ag===a.id)group(collected,c);
 const rows=[];
 for(const item of a.items){
  const receiptsForItem=movements.get(item.id)||[];
  const received=receiptsForItem.filter(m=>m.result==='OK');
  const extras=receiptsForItem.filter(m=>m.result!=='OK');
  const serials=collected.get(item.id)||[];let nextSerial=0;
  if(rows.length+item.qty+extras.length>100000)throw Error('O agendamento excede 100.000 volumes no relatório.');
  for(let i=0;i<Math.max(item.qty,received.length);i++){
   const row=reportRow(a,item,i+1,received[i],a.status==='Finalizado'?'FALTA':'PENDENTE');
   if(!row.Serial&&!row['Serial adicional']&&nextSerial<serials.length){
    const c=serials[nextSerial++];row.Serial=c.serial;row['Serial adicional']=c.extra;
    row['Lote coletado']=c.lot;if(!row['Lote indústria'])row['Lote indústria']=c.lot;
   }
   rows.push(row);
  }
  extras.forEach((m,i)=>rows.push(reportRow(a,item,item.qty+i+1,m,'')));
 }
 return rows;
}
function reportRow(a,i,volume,m,pending){return {'Agendamento':a.id,'Data agenda':a.date,'Transportadora':a.carrier,'NF venda':i.nf,'NFD':i.nfd,'Cliente':i.client,'AD':i.ad,'Material esperado':i.sku,'Descrição':i.description,'Volume':String(volume),'Quantidade':1,'Volumes previstos do item':i.qty,'Status':m?m.mode==='MANUAL'?'RECEBIDO (MANUAL)':m.result:pending,'Chave de acesso':i.key,'EAN esperado':i.ean,'EAN recebido':m?.ean||'','Serial':m?.serial||'','Serial adicional':m?.extra||'','Lote indústria':m?.lot||'','Avaria':m?.damage?'SIM':'','Responsável':m?.person||'','Data recebimento':m?.time||'','Motivo':m?.reason||i.reason,'Remessa':i.shipment,'Centro':i.center,'Nome CD':i.cd,'Valor produtos':i.value,'Valor chamado':i.claim,'Tipo operação':i.operation,'Iniciado por':a.startedBy,'Finalizado por':a.finishedBy,'ID movimento':m?.id||''};}
function validateBackup(s){if(!s||s.version!==1||!Number.isInteger(s.revision)||!['appointments','movements','occurrences','logs'].every(k=>Array.isArray(s[k])))throw Error('Backup incompatível.');const ids=new Set(),items=new Map();for(const a of s.appointments){if(!a.id||ids.has(a.id)||!Array.isArray(a.items)||!['Não iniciado','Em andamento','Finalizado'].includes(a.status)||!dateISO(a.date))throw Error('Agendamento inválido no backup.');ids.add(a.id);const set=new Set();for(const i of a.items){if(!i.id||set.has(i.id)||!Number.isInteger(i.qty)||i.qty<1||i.qty>100000||(i.key!==''&&!/^\d{44}$/.test(i.key))||!i.sku)throw Error('Item inválido no backup.');set.add(i.id);}items.set(a.id,set);}const mids=new Set();for(const m of s.movements){if(!m.id||mids.has(m.id)||!items.get(m.ag)?.has(m.item)||!['OK','MATERIAL DIVERGENTE','EXCEDENTE'].includes(m.result))throw Error('Movimento inválido no backup.');mids.add(m.id);}for(const o of s.occurrences)if(!items.get(o.ag)?.has(o.item)||!Number.isInteger(o.qty)||o.qty<1)throw Error('Ocorrência inválida no backup.');return s;}
root.Devolucoes={norm,text,uid,now,dateISO,aliases,required,mapping,parseSheets,empty,log,importGroups,active,editable,receipts,counts,start,reopen,finish,checkSerials,resolve,receive,voidMovement,occurrence,report,validateBackup};
if(typeof module!=='undefined')module.exports=root.Devolucoes;
})(globalThis);
