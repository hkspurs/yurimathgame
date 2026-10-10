// generate_chiikawa_catalog.js - Generates complete 500 unique animal species definitions
import fs from 'fs';

const FAMILIES = [
  {
    id: "canine", name: "狗狼狐系",
    species: [
      { id: "pup", zh: "幼犬", en: "Pup", desc: "軟綿綿小肉爪與垂耳" },
      { id: "corgi", zh: "柯基", en: "Corgi", desc: "矮矮胖胖大屁股與短腿" },
      { id: "pug", zh: "八哥", en: "Pug", desc: "委屈淚汪汪眼與扁平小鼻" },
      { id: "shiba", zh: "柴犬", en: "Shiba", desc: "微笑圓臉蛋與捲捲尾" },
      { id: "husky", zh: "哈士奇", en: "Husky", desc: "二哈呆萌表情與雙色面紋" },
      { id: "fox", zh: "小狐仙", en: "Fox", desc: "蓬鬆大尾巴與靈動大耳" },
      { id: "dingo", zh: "野犬", en: "Dingo", desc: "機靈小耳朵與敏捷小身軀" },
      { id: "wolf", zh: "狼崽", en: "Wolf", desc: "純真嗷嗚叫與毛茸茸胸毛" },
      { id: "hound", zh: "獵犬", en: "Hound", desc: "大垂耳與溫柔長睫毛" },
      { id: "pomeranian", zh: "博美", en: "Pome", desc: "炸毛圓棉花糖球" }
    ]
  },
  {
    id: "feline", name: "貓科虎豹系",
    species: [
      { id: "kitten", zh: "小貓", en: "Kitten", desc: "粉嫩小肉墊與好奇小觸角" },
      { id: "persian", zh: "波斯貓", en: "Persian", desc: "扁扁年糕臉與長長柔毛" },
      { id: "tiger", zh: "虎崽", en: "Tiger", desc: "呆呆小王字紋與胖虎掌" },
      { id: "snowleopard", zh: "雪豹", en: "Leopard", desc: "粗粗毛茸茸尾巴含在嘴裡" },
      { id: "lynx", zh: "山貓", en: "Lynx", desc: "耳尖兩撮逗趣天線毛" },
      { id: "lion", zh: "獅崽", en: "Lion", desc: "小向日葵圍脖毛毛" },
      { id: "shorthair", zh: "短毛貓", en: "Shorty", desc: "圓滾滾大包子臉" },
      { id: "fold", zh: "折耳貓", en: "Fold", desc: "貼貼小耳與無辜圓圓眼" },
      { id: "blackcat", zh: "小黑貓", en: "Kuro", desc: "圓滾滾金黃大燈泡眼" },
      { id: "ocelot", zh: "豹貓", en: "Ocelot", desc: "甜甜圈斑點與調皮伸爪" }
    ]
  },
  {
    id: "avian", name: "鳥禽羽翼系",
    species: [
      { id: "tit", zh: "山雀", en: "Tit", desc: "圓滾滾白頭肥啾鳥球" },
      { id: "owl", zh: "貓頭鷹", en: "Owl", desc: "歪頭發呆大圓框眼" },
      { id: "sparrow", zh: "麻雀", en: "Sparrow", desc: "棕黃小豆豆身軀" },
      { id: "penguin", zh: "企鵝幼崽", en: "Penguin", desc: "啪嗒啪嗒走路跌倒" },
      { id: "seagull", zh: "海鷗", en: "Gull", desc: "呆呆粗眉毛與小黃喙" },
      { id: "kingfisher", zh: "翠鳥", en: "Kingfisher", desc: "彩虹閃亮小披風" },
      { id: "parrot", zh: "鸚鵡", en: "Parrot", desc: "頭頂彩色小冠毛" },
      { id: "swan", zh: "白天鵝", en: "Swan", desc: "軟綿綿羽毛小圍巾" },
      { id: "hummingbird", zh: "蜂鳥", en: "Humming", desc: "超迷你小不點扇翅" },
      { id: "finch", zh: "文鳥", en: "Finch", desc: "年糕融化般趴在掌心" }
    ]
  },
  {
    id: "lagomorph", name: "兔子鼠兔系",
    species: [
      { id: "lop", zh: "垂耳兔", en: "Lop", desc: "軟綿綿垂地麻糬長耳" },
      { id: "snowhare", zh: "雪兔", en: "SnowHare", desc: "純白雪球與粉紅三瓣嘴" },
      { id: "pika", zh: "鼠兔", en: "Pika", desc: "圓耳朵嘴叼小草葉" },
      { id: "dwarf", zh: "侏儒兔", en: "Dwarf", desc: "短短耳配圓碌碌身軀" },
      { id: "wildhare", zh: "野兔", en: "Hare", desc: "好奇站立後腳蹬蹬" },
      { id: "longear", zh: "長耳兔", en: "Longear", desc: "耳朵當圍巾繞脖子" },
      { id: "cottontail", zh: "棉尾兔", en: "Cotton", desc: "棉花糖白白圓圓球尾" },
      { id: "dutch", zh: "荷蘭兔", en: "Dutch", desc: "小熊貓配色黑白斑紋" },
      { id: "angora", zh: "安哥拉兔", en: "Angora", desc: "只見一團毛看不見臉" },
      { id: "moonhare", zh: "月兔", en: "MoonHare", desc: "頭頂小月亮光環" }
    ]
  },
  {
    id: "rodent", name: "倉鼠松鼠系",
    species: [
      { id: "hamster", zh: "倉鼠", en: "Hamster", desc: "塞爆瓜子的大臉頰" },
      { id: "squirrel", zh: "松鼠", en: "Squirrel", desc: "比身體還大的蓬鬆毛尾" },
      { id: "chinchilla", zh: "龍貓", en: "Chinchilla", desc: "超極致柔順大毛球" },
      { id: "capybara", zh: "水豚", en: "Capybara", desc: "頭頂頂著小橘子發呆" },
      { id: "marmot", zh: "土撥鼠", en: "Marmot", desc: "兩爪抱肚皮啊啊叫" },
      { id: "flysquirrel", zh: "飛鼠", en: "Glider", desc: "張開小滑翔傘滑行" },
      { id: "chipmunk", zh: "花栗鼠", en: "Chipmunk", desc: "背上五道清晰條紋" },
      { id: "guineapig", zh: "豚鼠", en: "Guinea", desc: "噗噗叫的短圓年糕" },
      { id: "hedgehog", zh: "刺蝟", en: "Hedgehog", desc: "軟軟刺小鼻頭粉粉" },
      { id: "dormouse", zh: "睡鼠", en: "Dormouse", desc: "捲成圓球呼呼大睡" }
    ]
  },
  {
    id: "marine", name: "水生海洋系",
    species: [
      { id: "otter", zh: "水獺", en: "Otter", desc: "仰泳肚皮抱著小貝殼" },
      { id: "seal", zh: "小海豹", en: "Seal", desc: "趴在地上像芝麻大福" },
      { id: "dolphin", zh: "海豚", en: "Dolphin", desc: "粉嫩粉嫩微笑海豚" },
      { id: "beluga", zh: "白鯨", en: "Beluga", desc: "圓滾滾Q彈大腦門" },
      { id: "sealion", zh: "海獅", en: "Sealion", desc: "頂著七彩泡泡拍拍鰭" },
      { id: "jellyfish", zh: "水母", en: "Jelly", desc: "果凍傘蓋飄飄觸鬚" },
      { id: "octopus", zh: "章魚仔", en: "Octo", desc: "圓嘟嘟小章魚香腸嘴" },
      { id: "turtle", zh: "小海龜", en: "SeaTurtle", desc: "圓圓綠藻背甲輕划" },
      { id: "mola", zh: "曼波魚", en: "Mola", desc: "扁平大眼緩慢漂浮" },
      { id: "axolotl", zh: "六角恐龍", en: "Axo", desc: "頭頂粉紅羽狀小鰓微笑" }
    ]
  },
  {
    id: "ursine", name: "熊貓北極熊系",
    species: [
      { id: "bearcub", zh: "棕熊崽", en: "Bearcub", desc: "抱著蜂蜜罐舔舔爪" },
      { id: "panda", zh: "大熊貓", en: "Panda", desc: "滾來滾去啃竹葉筍" },
      { id: "polarbear", zh: "北極熊", en: "Polar", desc: "滑溜溜趴在小浮冰上" },
      { id: "raccoon", zh: "小浣熊", en: "Raccoon", desc: "兩手搓搓洗棉花糖" },
      { id: "redpanda", zh: "小熊貓", en: "RedPanda", desc: "九節環紋尾嚇人舉雙手" },
      { id: "koala", zh: "無尾熊", en: "Koala", desc: "大黑圓鼻子抱緊尤加利" },
      { id: "badger", zh: "蜜獾", en: "Badger", desc: "天不怕地不怕呆呆前衝" },
      { id: "sunbear", zh: "馬來熊", en: "Sunbear", desc: "胸口金色U字紋吐舌" },
      { id: "sloth", zh: "樹懶", en: "Sloth", desc: "倒掛樹枝兩倍慢動作" },
      { id: "honeybear", zh: "蜜熊", en: "HoneyBear", desc: "大尾巴倒吊勾樹枝" }
    ]
  },
  {
    id: "herbivore", name: "鹿羊草食系",
    species: [
      { id: "deer", zh: "梅花鹿", en: "Fawn", desc: "白色小梅花斑與細細蹄" },
      { id: "sheep", zh: "小綿羊", en: "Sheep", desc: "圓滾滾捲捲綿羊球" },
      { id: "alpaca", zh: "羊駝", en: "Alpaca", desc: "長脖子天然呆眨眼" },
      { id: "goat", zh: "小山羊", en: "Goat", desc: "小短角咩咩跳石頭" },
      { id: "pony", zh: "小矮馬", en: "Pony", desc: "長瀏海蓋住雙眼" },
      { id: "zebra", zh: "小斑馬", en: "Zebra", desc: "黑白條紋小斑鳩步" },
      { id: "calf", zh: "小牛犢", en: "Calf", desc: "粉紅濕潤鼻鏡戴小鈴鐺" },
      { id: "giraffe", zh: "長頸鹿仔", en: "Giraffe", desc: "圓圓茸茸小角與長睫毛" },
      { id: "elephant", zh: "小飛象", en: "Elephant", desc: "大蒲扇耳朵扇風飄浮" },
      { id: "hippo", zh: "小河馬", en: "Hippo", desc: "粉嫩圓肚子泡在水裡" }
    ]
  },
  {
    id: "reptile", name: "爬蟲兩棲系",
    species: [
      { id: "chameleon", zh: "變色龍", en: "Chameleon", desc: "捲捲蚊香尾巴大眼各看一邊" },
      { id: "gecko", zh: "壁虎", en: "Gecko", desc: "圓吸盤小爪爪貼在玻璃" },
      { id: "tortoise", zh: "小陸龜", en: "Tortoise", desc: "伸出短短縮頭縮腦" },
      { id: "frog", zh: "小青蛙", en: "Frog", desc: "頭頂荷葉雨傘呱呱叫" },
      { id: "newt", zh: "蠑螈", en: "Newt", desc: "軟Q紅肚皮小手小腳" },
      { id: "treefrog", zh: "樹蛙", en: "Treefrog", desc: "鮮紅大圓吸盤抱竹子" },
      { id: "skink", zh: "石龍子", en: "Skink", desc: "藍色小舌頭滑溜溜" },
      { id: "pacman", zh: "角蛙", en: "Pacman", desc: "圓得像個綠色小皮球" },
      { id: "dino", zh: "小恐龍", en: "TinyDino", desc: "背上鋸齒小鰭咬手指" },
      { id: "iguana", zh: "小綠鬣蜥", en: "Iguana", desc: "背部軟軟小棘刺曬太陽" }
    ]
  },
  {
    id: "mythic", name: "妖精幻獸系",
    species: [
      { id: "cloudelf", zh: "雲精靈", en: "CloudElf", desc: "像棉花糖般飄來飄去" },
      { id: "starbeast", zh: "星光小獸", en: "StarBeast", desc: "頭頂星星發光天線" },
      { id: "baku", zh: "夢貘", en: "Baku", desc: "軟軟象鼻專吸噩夢" },
      { id: "unicorn", zh: "獨角獸崽", en: "Unicorn", desc: "彩色螺旋小角角發光" },
      { id: "feathered", zh: "羽蛇仔", en: "Feathered", desc: "小綠羽毛翅膀盤在樹梢" },
      { id: "windspirit", zh: "微風靈", en: "WindSpirit", desc: "小旋風小尾巴轉圈圈" },
      { id: "firewisp", zh: "小火精", en: "FireWisp", desc: "火苗形狀小腦袋暖笠笠" },
      { id: "moonwisp", zh: "月光靈", en: "MoonWisp", desc: "散發溫柔珍珠色微光" },
      { id: "flowerdoll", zh: "花妖精", en: "FlowerElf", desc: "穿著花瓣裙子的小精靈" },
      { id: "snowfairy", zh: "雪精靈", en: "SnowFairy", desc: "六角雪花冰晶小翅膀" }
    ]
  }
];

const ELEMENTS = [
  { id: "fire", zh: "烈焰", en: "Flame", prefix: "烈焰", aura: "溫暖柔火與小火星" },
  { id: "water", zh: "水流", en: "Tidal", prefix: "波紋", aura: "清澈水滴與小水泡" },
  { id: "earth", zh: "大地", en: "Flora", prefix: "青苔", aura: "翠綠嫩葉與四葉草" },
  { id: "ice", zh: "冰霜", en: "Frost", prefix: "玄冰", aura: "冰晶雪花與霜粒" },
  { id: "storm", zh: "風暴", en: "Volt", prefix: "電光", aura: "閃爍靜電與金色星芒" }
];

const database = {};
let counter = 1;

FAMILIES.forEach(family => {
  family.species.forEach(sp => {
    ELEMENTS.forEach(el => {
      const petId = `pet500_${family.id}_${sp.id}_${el.id}_${counter}`;
      const name = `${el.prefix}${sp.zh} (${el.en}${sp.en})`;
      
      database[petId] = {
        id: petId,
        index: counter,
        name: name,
        familyId: family.id,
        familyName: family.name,
        speciesId: sp.id,
        speciesName: sp.zh,
        element: el.id,
        elementName: el.zh,
        desc: `${sp.desc}，周身伴隨${el.aura}。`,
        sprite: `./assets/sprites/pets500/pet500_${family.id}_${el.id}_${counter}.png`,
        prompt: `Generate a monster creature in exact Chiikawa (ちいかわ / Nagano Nagano-style) aesthetic:
Pet Name: ${name}
Theme: ${sp.zh} (${sp.en}) in ${el.zh} (${el.id}) element, Chiikawa style. Super cute, round chubby squishy mochi-like body, thick cute minimalist hand-drawn ink outline, big watery innocent black dot eyes with tiny shiny white highlights, pink blush cheeks, stubby little paws/feet, ${sp.desc}, subtle pastel ${el.aura}, soft calming pastel colors. Extremely cute, soothing, healing, minimalist Japanese cartoon mascot, isolated on pure solid white background, clean 2D character sprite.`
      };
      counter++;
    });
  });
});

fs.writeFileSync('/data/prodigygame/www/src/battle/ChiikawaDatabase500.json', JSON.stringify(database, null, 2), 'utf-8');
console.log(`Successfully generated ChiikawaDatabase500.json with ${Object.keys(database).length} unique pet prompts!`);
