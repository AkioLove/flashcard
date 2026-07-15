function escapeMnemonicHtml(value){return String(value||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function highlightSampleWord(sample){
  const word=String(sample?.word||'');
  const target=String(sample?.targetKana||'');
  if(!target)return escapeMnemonicHtml(word);
  const index=word.indexOf(target);
  if(index<0)return escapeMnemonicHtml(word);
  return `${escapeMnemonicHtml(word.slice(0,index))}<mark>${escapeMnemonicHtml(target)}</mark>${escapeMnemonicHtml(word.slice(index+target.length))}`;
}
function revealWithMnemonic(){
  if(!current||revealed)return;
  revealed=true;
  const cs=cardState(current.id);
  const data=KANA_MNEMONICS[current.id]||{};
  const shown=$('#cardPrompt').textContent;
  const isKatakana=shown===current.k;
  const script=isKatakana?'katakana':'hiragana';
  const scriptLabel=isKatakana?'片假名':'平假名';
  const shape=data.shapeMnemonic?.[script];
  const origin=data.kanjiOrigin?.[script]||'—';
  const stats=cs.seen?`正確率 ${Math.round(cs.correct/cs.seen*100)}% · 忘記 ${cs.lapses} 次`:'新卡';
  const confusable=(data.confusableKana||[]).map(escapeMnemonicHtml).join('、');
  const sample=data.sampleWord;
  const sampleLabel=sample?.isSentence?'📝 範例句子':'📝 範例單字';
  const sampleBlock=sample?`<div class="memory-note sample"><span>${sampleLabel}</span><p><strong>${highlightSampleWord(sample)}</strong>（${escapeMnemonicHtml(sample.reading)}）— ${escapeMnemonicHtml(sample.meaning)}</p></div>`:'';
  $('#cardAnswer').innerHTML=`
    <div class="answer-head"><strong>${escapeMnemonicHtml(current.r)}</strong><small>${scriptLabel} · ${stats}</small></div>
    <div class="memory-note shape"><span>💡 外型聯想</span><p>${escapeMnemonicHtml(shape||'觀察筆畫的方向與轉折，並把它和發音一起記住。')}</p></div>
    <div class="memory-note origin"><span>📜 字源</span><p>源自漢字「${escapeMnemonicHtml(origin)}」的簡化或草寫。</p></div>
    <div class="memory-note confuse"><span>⚠️ 易混淆</span><p>${confusable||'目前沒有特別容易混淆的假名。'}</p></div>
    ${sampleBlock}`;
  $('#cardAnswer').hidden=false;
  $('#cardHint').hidden=true;
  $('#ratingButtons').hidden=false;
}
$('#card').onclick=revealWithMnemonic;

KANA_DATA_PROMISE.then(data=>{
  if(!data?.rows?.length)return;
  data.rows.forEach(row=>{
    const index=ROWS.findIndex(existing=>existing.id===row.id);
    if(index>=0)ROWS.splice(index,1,row);
    else ROWS.push(row);
  });
  // IDs stay row-id + index, so existing SM-2 progress remains compatible.
  if(state){
    renderSettings();
    buildQueue();
  }
});
