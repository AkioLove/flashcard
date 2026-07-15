KANA_DATA_PROMISE.then(data=>{
  if(!data?.rows?.length)return;
  data.rows.forEach(row=>{
    const index=ROWS.findIndex(existing=>existing.id===row.id);
    if(index>=0)ROWS.splice(index,1,row);
    else ROWS.push(row);
  });

  // Keep the existing SM-2 card IDs (row-id + index) and stored progress intact.
  if(state){
    renderSettings();
    buildQueue();
  }
});
