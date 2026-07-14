function escapeMnemonicHtml(value){return String(value||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function revealWithMnemonic(){
  if(!current||revealed)return;
  revealed=true;
  const cs=cardState(current.id);
  const data=KANA_MNEMONICS[current.id]||{};
  const shown=$('#cardPrompt').textContent;
  const isKatakana=shown===current.k;
  const shape=isKatakana?data.k:data.h;
  const scriptLabel=isKatakana?'片假名':'平假名';
  const stats=cs.seen?`正確率 ${Math.round(cs.correct/cs.seen*100)}% · 忘記 ${cs.lapses} 次`:'新卡';
  const confuse=data.confuse?`<div class="memory-note confuse"><span>⚠️ 易混淆</span><p>${escapeMnemonicHtml(data.confuse)}</p></div>`:'';
  $('#cardAnswer').innerHTML=`
    <div class="answer-head"><strong>${escapeMnemonicHtml(current.r)}</strong><small>${scriptLabel} · ${stats}</small></div>
    <div class="memory-note shape"><span>💡 外型聯想</span><p>${escapeMnemonicHtml(shape||'觀察筆畫的方向與轉折，並把它和發音一起記住。')}</p></div>
    <div class="memory-note origin"><span>📜 字源</span><p>源自漢字「${escapeMnemonicHtml(data.origin||'—')}」的簡化或草寫。</p></div>
    ${confuse}`;
  $('#cardAnswer').hidden=false;
  $('#cardHint').hidden=true;
  $('#ratingButtons').hidden=false;
}
$('#card').onclick=revealWithMnemonic;
