const KANA_MNEMONICS={};

function normalizeMnemonicCard(card,rowId,index){
  const id=`${rowId}-${index}`;
  KANA_MNEMONICS[id]={
    hiragana:card.hiragana,
    katakana:card.katakana,
    romaji:card.romaji,
    shapeMnemonic:card.shapeMnemonic||{},
    kanjiOrigin:card.kanjiOrigin||{},
    confusableKana:Array.isArray(card.confusableKana)?card.confusableKana:[],
    sampleWord:card.sampleWord||null
  };
  return [card.hiragana,card.katakana,card.romaji];
}

function expandAdvancedCard(tuple,kind){
  const [hiragana,katakana,romaji,baseH,baseKOrSmall,word,reading,meaning]=tuple;
  if(kind==='yoon'){
    const smallH=baseKOrSmall;
    const smallK=katakana.slice(1);
    return {
      hiragana,katakana,romaji,
      shapeMnemonic:{
        hiragana:`${baseH} 後面接小寫「${smallH}」，兩個聲音滑成一拍。小字要明顯較小。`,
        katakana:`${katakana[0]} 後面接小寫「${smallK}」，兩張卡緊靠成一個音節。`
      },
      kanjiOrigin:{
        hiragana:`${baseH}＋小寫 ${smallH} 的組合音`,
        katakana:`${katakana[0]}＋小寫 ${smallK} 的組合音`
      },
      confusableKana:[baseH,smallH],
      sampleWord:{word,reading,meaning}
    };
  }
  const baseK=baseKOrSmall;
  const isHandakuten=romaji.startsWith('p');
  const markText=isHandakuten?'右上小圓圈是半濁點，像吹出一個輕快泡泡音。':'右上兩點是濁點，像替原本的假名加上震動。';
  return {
    hiragana,katakana,romaji,
    shapeMnemonic:{
      hiragana:`${hiragana} 是 ${baseH} 加上記號；${markText}`,
      katakana:`${katakana} 是 ${baseK} 加上記號；${markText}`
    },
    kanjiOrigin:{hiragana:`${baseH} 的字源＋記號`,katakana:`${baseK} 的字源＋記號`},
    confusableKana:[baseH,baseK],
    sampleWord:{word,reading,meaning}
  };
}

function normalizeRows(data){
  return (data.rows||[]).map(row=>({
    id:row.id,
    label:row.label,
    cards:(row.cards||[]).map((raw,index)=>{
      const card=Array.isArray(raw)?expandAdvancedCard(raw,row.kind):raw;
      return normalizeMnemonicCard(card,row.id,index);
    })
  }));
}

const KANA_DATA_PROMISE=Promise.all([
  fetch('./data/mnemonics.json').then(response=>{if(!response.ok)throw new Error(`Failed to load kana data: ${response.status}`);return response.json()}),
  fetch('./data/advanced-kana.json').then(response=>{if(!response.ok)throw new Error(`Failed to load advanced kana data: ${response.status}`);return response.json()})
])
  .then(([basic,advanced])=>({
    version:`${basic.version}.${advanced.version}`,
    rows:[...normalizeRows(basic),...normalizeRows(advanced)]
  }))
  .catch(error=>{
    console.error(error);
    return null;
  });