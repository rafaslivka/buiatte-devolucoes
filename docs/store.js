const operationStore = (() => {
  const buckets = ['movements', 'collections', 'occurrences', 'logs'];
  async function rpc(name, args) {
    const { data, error } = await client.rpc(name, args);
    if (error?.code === '23505') throw Error('Registro duplicado. Verifique a importação ou os seriais da agenda.');
    if (error) throw Error(error.message);
    return data;
  }
  async function read(selected) {
    const result = C.empty();
    let cursor = '';
    while (true) {
      const batch = await rpc('dev3_catalog', {after_id:cursor});
      result.appointments.push(...batch);
      if (batch.length < 200) break;
      cursor = batch.at(-1).id;
    }
    if (selected && result.appointments.some(a => a.id === selected)) {
      const detail = C.validateBackup(await rpc('dev3_detail', {agenda_id:selected}));
      const pos = result.appointments.findIndex(a => a.id === selected);
      result.appointments[pos] = detail.appointments[0];
      for (const name of buckets) result[name] = detail[name] || [];
    }
    return result;
  }
  function header(agenda) {
    const { items, signature, revision, summary, totals, ...body } = agenda;
    return body;
  }
  function diff(before, after) {
    const changes = new Map();
    const agendas = new Map(before.appointments.map(a=>[a.id,a]));
    function change(id) {
      if (!changes.has(id)) changes.set(id,{ag:id,revision:agendas.get(id)?.revision ?? -1});
      return changes.get(id);
    }
    for (const a of after.appointments) {
      const prev = agendas.get(a.id);
      if (!prev || JSON.stringify(header(a)) !== JSON.stringify(header(prev))) {
        const pack = change(a.id);
        pack.header = header(a);
        if (!prev) Object.assign(pack,{items:a.items,signature:a.signature});
      }
    }
    for (const kind of buckets) {
      const previous = new Map((before[kind] || []).map(row => [row.id,row]));
      for (const row of after[kind] || []) {
        if (JSON.stringify(row) === JSON.stringify(previous.get(row.id))) continue;
        const pack = change(row.ag);
        (pack[kind] ||= []).push(row);
      }
    }
    return Array.from(changes.values());
  }
  async function write(before, after, operator, password) {
    const changes = diff(before,after);
    if (changes.length) await rpc('dev3_apply',{changes,operator_name:operator,delete_password:password || null});
  }
  return {read,write};
})();
