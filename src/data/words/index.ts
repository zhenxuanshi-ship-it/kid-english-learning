import type { Word } from '../../types/word';
import appleImage from '../../assets/word-images/apple.svg';
import bagImage from '../../assets/word-images/bag.svg';
import bananaImage from '../../assets/word-images/banana.svg';
import birdImage from '../../assets/word-images/bird.svg';
import bookImage from '../../assets/word-images/book.svg';
import breadImage from '../../assets/word-images/bread.svg';
import burgerImage from '../../assets/word-images/burger.svg';
import catImage from '../../assets/word-images/cat.svg';
import chairImage from '../../assets/word-images/chair.svg';
import classroomImage from '../../assets/word-images/classroom.svg';
import cloudImage from '../../assets/word-images/cloud.svg';
import cowImage from '../../assets/word-images/cow.svg';
import dogImage from '../../assets/word-images/dog.svg';
import duckImage from '../../assets/word-images/duck.svg';
import eggImage from '../../assets/word-images/egg.svg';
import fishImage from '../../assets/word-images/fish.svg';
import crayonImage from '../../assets/word-images/crayon.svg';
import grapeImage from '../../assets/word-images/grape.svg';
import handImage from '../../assets/word-images/hand.svg';
import milkImage from '../../assets/word-images/milk.svg';
import moonImage from '../../assets/word-images/moon.svg';
import noseImage from '../../assets/word-images/nose.svg';
import pearImage from '../../assets/word-images/pear.svg';
import penImage from '../../assets/word-images/pen.svg';
import pencilImage from '../../assets/word-images/pencil.svg';
import pigImage from '../../assets/word-images/pig.svg';
import rabbitImage from '../../assets/word-images/rabbit.svg';
import rainbowImage from '../../assets/word-images/rainbow.svg';
import rainImage from '../../assets/word-images/rain.svg';
import riceImage from '../../assets/word-images/rice.svg';
import puddleImage from '../../assets/word-images/puddle.svg';
import schoolImage from '../../assets/word-images/school.svg';
import shoeImage from '../../assets/word-images/shoe.svg';
import stickerImage from '../../assets/word-images/sticker.svg';
import sunImage from '../../assets/word-images/sun.svg';
import teacherImage from '../../assets/word-images/teacher.svg';
import umbrellaImage from '../../assets/word-images/umbrella.svg';
import watermelonImage from '../../assets/word-images/watermelon.svg';
import waterImage from '../../assets/word-images/water.svg';
import zebraImage from '../../assets/word-images/zebra.svg';

export const allWords: Word[] = [
  { id: 1, english: 'cat', chinese: '猫', category: 'animals', level: 1, difficulty: 1, emoji: '🐱', imageUrl: catImage },
  { id: 2, english: 'dog', chinese: '狗', category: 'animals', level: 1, difficulty: 1, emoji: '🐶', imageUrl: dogImage },
  { id: 3, english: 'bird', chinese: '鸟', category: 'animals', level: 1, difficulty: 1, emoji: '🐦', imageUrl: birdImage },
  { id: 4, english: 'fish', chinese: '鱼', category: 'animals', level: 1, difficulty: 1, emoji: '🐟', imageUrl: fishImage },
  { id: 5, english: 'duck', chinese: '鸭子', category: 'animals', level: 1, difficulty: 1, emoji: '🦆', imageUrl: duckImage },
  { id: 6, english: 'pig', chinese: '猪', category: 'animals', level: 1, difficulty: 1, emoji: '🐷', imageUrl: pigImage },
  { id: 7, english: 'cow', chinese: '奶牛', category: 'animals', level: 1, difficulty: 1, emoji: '🐮', imageUrl: cowImage },
  { id: 8, english: 'horse', chinese: '马', category: 'animals', level: 2, difficulty: 2, emoji: '🐴' },
  { id: 9, english: 'sheep', chinese: '羊', category: 'animals', level: 2, difficulty: 2, emoji: '🐑' },
  { id: 10, english: 'rabbit', chinese: '兔子', category: 'animals', level: 2, difficulty: 2, emoji: '🐰', imageUrl: rabbitImage },
  { id: 11, english: 'lion', chinese: '狮子', category: 'animals', level: 2, difficulty: 2, emoji: '🦁' },
  { id: 12, english: 'tiger', chinese: '老虎', category: 'animals', level: 2, difficulty: 2, emoji: '🐯' },
  { id: 13, english: 'monkey', chinese: '猴子', category: 'animals', level: 3, difficulty: 3, emoji: '🐵' },
  { id: 14, english: 'panda', chinese: '熊猫', category: 'animals', level: 2, difficulty: 2, emoji: '🐼' },
  { id: 15, english: 'elephant', chinese: '大象', category: 'animals', level: 3, difficulty: 4, emoji: '🐘' },

  { id: 16, english: 'apple', chinese: '苹果', category: 'fruits', level: 2, difficulty: 2, emoji: '🍎', imageUrl: appleImage },
  { id: 17, english: 'banana', chinese: '香蕉', category: 'fruits', level: 2, difficulty: 2, emoji: '🍌', imageUrl: bananaImage },
  { id: 18, english: 'pear', chinese: '梨', category: 'fruits', level: 1, difficulty: 1, emoji: '🍐', imageUrl: pearImage },
  { id: 19, english: 'grape', chinese: '葡萄', category: 'fruits', level: 2, difficulty: 2, emoji: '🍇', imageUrl: grapeImage },
  { id: 20, english: 'peach', chinese: '桃子', category: 'fruits', level: 2, difficulty: 2, emoji: '🍑' },
  { id: 21, english: 'melon', chinese: '甜瓜', category: 'fruits', level: 2, difficulty: 2, emoji: '🍈' },
  { id: 22, english: 'orange', chinese: '橙子', category: 'fruits', level: 2, difficulty: 2, emoji: '🍊' },
  { id: 23, english: 'cherry', chinese: '樱桃', category: 'fruits', level: 3, difficulty: 3, emoji: '🍒' },
  { id: 24, english: 'lemon', chinese: '柠檬', category: 'fruits', level: 2, difficulty: 2, emoji: '🍋' },
  { id: 25, english: 'strawberry', chinese: '草莓', category: 'fruits', level: 3, difficulty: 4, emoji: '🍓' },

  { id: 26, english: 'red', chinese: '红色', category: 'colors', level: 1, difficulty: 1, emoji: '🟥' },
  { id: 27, english: 'blue', chinese: '蓝色', category: 'colors', level: 1, difficulty: 1, emoji: '🟦' },
  { id: 28, english: 'green', chinese: '绿色', category: 'colors', level: 2, difficulty: 2, emoji: '🟩' },
  { id: 29, english: 'yellow', chinese: '黄色', category: 'colors', level: 3, difficulty: 3, emoji: '🟨' },
  { id: 30, english: 'pink', chinese: '粉色', category: 'colors', level: 2, difficulty: 2, emoji: '🩷' },
  { id: 31, english: 'black', chinese: '黑色', category: 'colors', level: 2, difficulty: 2, emoji: '⬛' },
  { id: 32, english: 'white', chinese: '白色', category: 'colors', level: 2, difficulty: 2, emoji: '⬜' },
  { id: 33, english: 'purple', chinese: '紫色', category: 'colors', level: 2, difficulty: 2, emoji: '🟪' },
  { id: 34, english: 'brown', chinese: '棕色', category: 'colors', level: 2, difficulty: 2, emoji: '🟫' },
  { id: 35, english: 'gray', chinese: '灰色', category: 'colors', level: 2, difficulty: 2, emoji: '灰' },

  { id: 36, english: 'one', chinese: '一', category: 'numbers', level: 1, difficulty: 1, emoji: '1️⃣' },
  { id: 37, english: 'two', chinese: '二', category: 'numbers', level: 1, difficulty: 1, emoji: '2️⃣' },
  { id: 38, english: 'three', chinese: '三', category: 'numbers', level: 2, difficulty: 2, emoji: '3️⃣' },
  { id: 39, english: 'four', chinese: '四', category: 'numbers', level: 1, difficulty: 1, emoji: '4️⃣' },
  { id: 40, english: 'five', chinese: '五', category: 'numbers', level: 1, difficulty: 1, emoji: '5️⃣' },
  { id: 41, english: 'six', chinese: '六', category: 'numbers', level: 1, difficulty: 1, emoji: '6️⃣' },
  { id: 42, english: 'seven', chinese: '七', category: 'numbers', level: 2, difficulty: 2, emoji: '7️⃣' },
  { id: 43, english: 'eight', chinese: '八', category: 'numbers', level: 2, difficulty: 2, emoji: '8️⃣' },
  { id: 44, english: 'nine', chinese: '九', category: 'numbers', level: 2, difficulty: 2, emoji: '9️⃣' },
  { id: 45, english: 'ten', chinese: '十', category: 'numbers', level: 1, difficulty: 1, emoji: '🔟' },
  { id: 46, english: 'eleven', chinese: '十一', category: 'numbers', level: 3, difficulty: 3, emoji: '11' },
  { id: 47, english: 'twelve', chinese: '十二', category: 'numbers', level: 3, difficulty: 3, emoji: '12️⃣' },

  { id: 48, english: 'mom', chinese: '妈妈', category: 'family', level: 1, difficulty: 1, emoji: '👩' },
  { id: 49, english: 'dad', chinese: '爸爸', category: 'family', level: 1, difficulty: 1, emoji: '👨' },
  { id: 50, english: 'baby', chinese: '宝宝', category: 'family', level: 1, difficulty: 1, emoji: '👶' },
  { id: 51, english: 'brother', chinese: '哥哥/弟弟', category: 'family', level: 3, difficulty: 3, emoji: '👦' },
  { id: 52, english: 'sister', chinese: '姐姐/妹妹', category: 'family', level: 3, difficulty: 3, emoji: '👧' },
  { id: 53, english: 'grandma', chinese: '奶奶/外婆', category: 'family', level: 3, difficulty: 4, emoji: '👵' },
  { id: 54, english: 'grandpa', chinese: '爷爷/外公', category: 'family', level: 3, difficulty: 4, emoji: '👴' },
  { id: 55, english: 'family', chinese: '家庭', category: 'family', level: 3, difficulty: 4, emoji: '👨‍👩‍👧‍👦' },

  { id: 56, english: 'book', chinese: '书', category: 'school', level: 1, difficulty: 1, emoji: '📘', imageUrl: bookImage },
  { id: 57, english: 'pen', chinese: '钢笔', category: 'school', level: 1, difficulty: 1, emoji: '🖊️', imageUrl: penImage },
  { id: 58, english: 'bag', chinese: '书包', category: 'school', level: 1, difficulty: 1, emoji: '🎒', imageUrl: bagImage },
  { id: 59, english: 'ruler', chinese: '尺子', category: 'school', level: 2, difficulty: 2, emoji: '📏', imageUrl: pencilImage },
  { id: 60, english: 'desk', chinese: '书桌', category: 'school', level: 1, difficulty: 1, emoji: '🪑' },
  { id: 61, english: 'chair', chinese: '椅子', category: 'school', level: 2, difficulty: 2, emoji: '🪑', imageUrl: chairImage },
  { id: 62, english: 'pencil', chinese: '铅笔', category: 'school', level: 2, difficulty: 2, emoji: '✏️', imageUrl: pencilImage },
  { id: 63, english: 'eraser', chinese: '橡皮', category: 'school', level: 2, difficulty: 2, emoji: '🧽' },
  { id: 64, english: 'teacher', chinese: '老师', category: 'school', level: 3, difficulty: 3, emoji: '🧑‍🏫', imageUrl: teacherImage },
  { id: 65, english: 'school', chinese: '学校', category: 'school', level: 2, difficulty: 2, emoji: '🏫', imageUrl: schoolImage },
  { id: 66, english: 'class', chinese: '班级/课堂', category: 'school', level: 2, difficulty: 2, emoji: '🏫' },

  { id: 67, english: 'rice', chinese: '米饭', category: 'food', level: 1, difficulty: 1, emoji: '🍚', imageUrl: riceImage },
  { id: 68, english: 'bread', chinese: '面包', category: 'food', level: 2, difficulty: 2, emoji: '🍞', imageUrl: breadImage },
  { id: 69, english: 'milk', chinese: '牛奶', category: 'food', level: 1, difficulty: 1, emoji: '🥛', imageUrl: milkImage },
  { id: 70, english: 'egg', chinese: '鸡蛋', category: 'food', level: 1, difficulty: 1, emoji: '🥚', imageUrl: eggImage },
  { id: 71, english: 'cake', chinese: '蛋糕', category: 'food', level: 1, difficulty: 1, emoji: '🍰' },
  { id: 72, english: 'water', chinese: '水', category: 'food', level: 2, difficulty: 2, emoji: '💧', imageUrl: waterImage },
  { id: 73, english: 'candy', chinese: '糖果', category: 'food', level: 2, difficulty: 2, emoji: '🍬' },
  { id: 74, english: 'juice', chinese: '果汁', category: 'food', level: 2, difficulty: 2, emoji: '🧃' },
  { id: 75, english: 'noodle', chinese: '面条', category: 'food', level: 2, difficulty: 2, emoji: '🍜' },
  { id: 76, english: 'cookie', chinese: '饼干', category: 'food', level: 2, difficulty: 2, emoji: '🍪' },
  { id: 77, english: 'icecream', chinese: '冰淇淋', category: 'food', level: 3, difficulty: 4, emoji: '🍨' },

  { id: 78, english: 'head', chinese: '头', category: 'body', level: 1, difficulty: 1, emoji: '🙂' },
  { id: 79, english: 'eye', chinese: '眼睛', category: 'body', level: 1, difficulty: 1, emoji: '👁️' },
  { id: 80, english: 'ear', chinese: '耳朵', category: 'body', level: 1, difficulty: 1, emoji: '👂' },
  { id: 81, english: 'nose', chinese: '鼻子', category: 'body', level: 1, difficulty: 1, emoji: '👃', imageUrl: noseImage },
  { id: 82, english: 'mouth', chinese: '嘴巴', category: 'body', level: 2, difficulty: 2, emoji: '👄' },
  { id: 83, english: 'hand', chinese: '手', category: 'body', level: 1, difficulty: 1, emoji: '✋', imageUrl: handImage },
  { id: 84, english: 'foot', chinese: '脚', category: 'body', level: 1, difficulty: 1, emoji: '🦶' },
  { id: 85, english: 'leg', chinese: '腿', category: 'body', level: 1, difficulty: 1, emoji: '🦵' },
  { id: 86, english: 'arm', chinese: '手臂', category: 'body', level: 1, difficulty: 1, emoji: '💪' },
  { id: 87, english: 'face', chinese: '脸', category: 'body', level: 1, difficulty: 1, emoji: '😀' },
  { id: 88, english: 'hair', chinese: '头发', category: 'body', level: 2, difficulty: 2, emoji: '💇' },

  { id: 89, english: 'hat', chinese: '帽子', category: 'clothes', level: 1, difficulty: 1, emoji: '🧢' },
  { id: 90, english: 'shirt', chinese: '衬衫', category: 'clothes', level: 2, difficulty: 2, emoji: '👕' },
  { id: 91, english: 'dress', chinese: '连衣裙', category: 'clothes', level: 2, difficulty: 2, emoji: '👗' },
  { id: 92, english: 'shoe', chinese: '鞋子', category: 'clothes', level: 1, difficulty: 1, emoji: '👟', imageUrl: shoeImage },
  { id: 93, english: 'sock', chinese: '袜子', category: 'clothes', level: 1, difficulty: 1, emoji: '🧦' },
  { id: 94, english: 'coat', chinese: '外套', category: 'clothes', level: 2, difficulty: 2, emoji: '🧥' },
  { id: 95, english: 'skirt', chinese: '裙子', category: 'clothes', level: 2, difficulty: 2, emoji: '👗' },
  { id: 96, english: 'pants', chinese: '裤子', category: 'clothes', level: 2, difficulty: 2, emoji: '👖' },
  { id: 97, english: 'glove', chinese: '手套', category: 'clothes', level: 2, difficulty: 2, emoji: '🧤' },

  { id: 98, english: 'sun', chinese: '太阳', category: 'weather', level: 1, difficulty: 1, emoji: '☀️', imageUrl: sunImage },
  { id: 99, english: 'moon', chinese: '月亮', category: 'weather', level: 1, difficulty: 1, emoji: '🌙', imageUrl: moonImage },
  { id: 100, english: 'star', chinese: '星星', category: 'weather', level: 1, difficulty: 1, emoji: '⭐' },
  { id: 101, english: 'rain', chinese: '下雨', category: 'weather', level: 1, difficulty: 1, emoji: '🌧️', imageUrl: rainImage },
  { id: 102, english: 'snow', chinese: '下雪', category: 'weather', level: 1, difficulty: 1, emoji: '❄️' },
  { id: 103, english: 'wind', chinese: '风', category: 'weather', level: 1, difficulty: 1, emoji: '💨' },
  { id: 104, english: 'cloud', chinese: '云', category: 'weather', level: 2, difficulty: 2, emoji: '☁️', imageUrl: cloudImage },
  { id: 105, english: 'hot', chinese: '热', category: 'weather', level: 1, difficulty: 1, emoji: '🥵' },
  { id: 106, english: 'cold', chinese: '冷', category: 'weather', level: 1, difficulty: 1, emoji: '🥶' },
  { id: 107, english: 'storm', chinese: '暴风雨', category: 'weather', level: 3, difficulty: 3, emoji: '⛈️' },
  { id: 108, english: 'rainbow', chinese: '彩虹', category: 'weather', level: 3, difficulty: 3, emoji: '🌈', imageUrl: rainbowImage },

  { id: 109, english: 'zebra', chinese: '斑马', category: 'animals', level: 2, difficulty: 2, emoji: '🦓', imageUrl: zebraImage },
  { id: 110, english: 'watermelon', chinese: '西瓜', category: 'fruits', level: 2, difficulty: 2, emoji: '🍉', imageUrl: watermelonImage },
  { id: 111, english: 'crayon', chinese: '蜡笔', category: 'school', level: 2, difficulty: 2, emoji: '🖍️', imageUrl: crayonImage },
  { id: 112, english: 'classroom', chinese: '教室', category: 'school', level: 2, difficulty: 2, emoji: '🏫', imageUrl: classroomImage },
  { id: 113, english: 'umbrella', chinese: '伞', category: 'weather', level: 2, difficulty: 2, emoji: '☂️', imageUrl: umbrellaImage },
  { id: 114, english: 'puddle', chinese: '水坑', category: 'weather', level: 2, difficulty: 2, emoji: '🫧', imageUrl: puddleImage },
  { id: 115, english: 'burger', chinese: '汉堡', category: 'food', level: 2, difficulty: 2, emoji: '🍔', imageUrl: burgerImage },
  { id: 116, english: 'sticker', chinese: '贴纸', category: 'school', level: 2, difficulty: 2, emoji: '🏷️', imageUrl: stickerImage },
  { id: 117, english: 'paper', chinese: '纸', category: 'school', level: 1, difficulty: 1, emoji: '📄' },
  { id: 118, english: 'scissors', chinese: '剪刀', category: 'school', level: 2, difficulty: 2, emoji: '✂️' },
  { id: 119, english: 'card', chinese: '卡片', category: 'school', level: 1, difficulty: 1, emoji: '🪪' },
  { id: 120, english: 'pizza', chinese: '比萨饼', category: 'food', level: 2, difficulty: 2, emoji: '🍕' },
  { id: 121, english: 'jacket', chinese: '夹克', category: 'clothes', level: 2, difficulty: 2, emoji: '🧥' },
  { id: 122, english: 'raincoat', chinese: '雨衣', category: 'clothes', level: 2, difficulty: 2, emoji: '🌧️' },
];

export const wordCategories = Array.from(new Set(allWords.map((word) => word.category)));
