import { boardFlip, gBoard2Key, gEasyBoard } from '@/utils'
import { LevelFayaa, initBoardFayaa } from './klotski.board.fayaa'
import { LevelMine, initBoardMine } from './klotski.board.mine'
import { LevelUnblock2, initBoardUnblockIt2 } from './klotski.board.unblock2'
import { LevelWayout, initBoardWayOut } from './klotski.board.wayout'

export type Level = LevelFayaa | LevelUnblock2 | LevelMine | LevelWayout

const levels: Level[] = [...initBoardFayaa, ...initBoardUnblockIt2, ...initBoardWayOut, ...initBoardMine]

export const boards: Level[] = []

export const classicBoards: LevelFayaa[] = []
// prettier-ignore
const gClassicList = [ //level list: the array index = level - 1,
  1,2,3,4,5,6,7,8,9,10,11,12,  
  13,57,   14,15,  
  16,17,18,19,20,21,22,23,24,  
  25,123,  26,27,
  39,40,41,42,43,45, 
  //46,47,48,49,50,51,52,53,
  46,47,50,51,52,53, //remove "48 走投無路": no solution & "49 小燕出巢": same as "22 甕中之鼈"
  
  //-----------------------------------------------------------------------
  //取自:華容道遊戲秘決技巧  
  // http://ewchem.blog.163.com/blog/static/9875667201111151425842/)		
  56, //56:井底之蛙
  //-----------------------------------------------------------------------
  // 取自:利用電腦探討中國古代益智遊戲─「華容道」之解法 
  //	魏仲良、林順喜 (國立臺灣師範大學 資訊教育系)
  // http://www2.kuas.edu.tw/prof/cjh/2003puzzle/subject/08.htm
  406, 407, //406:身先士卒(將擋後路), 407:兵威將廣(調兵遣將)	
  //-----------------------------------------------------------------------
  55 //55: 峰迴路轉 
]

const set = new Set() // 重复

for (let i = 0; i < levels.length; i++) {
  const level = levels[i]
  const key1 = gBoard2Key(gEasyBoard(level.board))
  const key2 = gBoard2Key(gEasyBoard(boardFlip(level.board)))
  if (!set.has(key1) && !set.has(key2) && level.mini > 0) {
    if (gClassicList.includes((<LevelFayaa>level).level)) {
      classicBoards.push(<LevelFayaa>level)
    }
    boards.push(level)
    set.add(key1)
    set.add(key2)
  }
}

export const boardsSorted = boards.sort((a, b) => a.mini - b.mini)

console.log('关卡', levels.length, '可用', boards.length + classicBoards.length, '经典', classicBoards.length, '其他', boards.length)
