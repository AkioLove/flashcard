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

const KANA_DATA_PROMISE=fetch('./data/mnemonics.json')
  .then(response=>{
    if(!response.ok)throw new Error(`Failed to load kana data: ${response.status}`);
    return response.json();
  })
  .then(data=>({
    ...data,
    rows:(data.rows||[]).map(row=>({
      id:row.id,
      label:row.label,
      cards:(row.cards||[]).map((card,index)=>normalizeMnemonicCard(card,row.id,index))
    }))
  }))
  .catch(error=>{
    console.error(error);
    return null;
  });
