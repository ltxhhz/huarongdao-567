export type Tuple<T, N extends number, R extends unknown[] = []> = R['length'] extends N ? R : Tuple<T, N, [...R, T]>

export const G_BOARD_X = 4
export const G_BOARD_Y = 5
export const G_BOARD_SIZE = G_BOARD_X * G_BOARD_Y // board size
export const G_EMPTY_BLOCK = 1 // gBlockBelongTo index 1 ('@')
export const G_GOAL_BLOCK = 2 // gBlockBelongTo index 2 ('A')
export const G_GOAL_STYLE = 4 // index of gBlockStyle for goal block
export const G_VOID_CHAR = '?'
export const G_EMPTY_CHAR = '@'
//prettier-ignore
//convert char to index of block style
//ASCII char   :       ?, @,  A,  B,C,D,E,F,G,  H,I,J,K,L,M,  N,O,P,Q,R,S,T,U,V,W,X,Y,Z,[
const gBlockBelongTo = [-1, 0,  4,  2,2,2,2,2,2,  3,3,3,3,3,3,  1,1,1,1,1,1,1,1,1,1,1,1,1,1];
const gBlockStyle = [
  [1, 1],
  [1, 1],
  [2, 1],
  [1, 2],
  [2, 2]
] //block style:[x size, y size]
const gGoalPos = [
  [1, 4],
  [2, 4]
] //goal position: [x,y]

//                       0    1    2    3    4
const gBlockStartStyle = ['@', 'N', 'B', 'H', 'A']

//--------------------------------------------------------------------
// board string convert to board array with gBlockBelongTo index value
//--------------------------------------------------------------------
export function gEasyBoard(boardString: string): number[] {
  var boardArray: any[] = boardString.split('')

  for (var i = 0; i < boardArray.length; i++) {
    boardArray[i] = boardArray[i].charCodeAt(0) - G_VOID_CHAR.charCodeAt(0)
  }
  return boardArray
}

//---------------------------------------------------------
// transfer the board to 64 bits int
// one char convert to 2 bits
//
// javascript: They are 64-bit floating point values,
//             the largest exact integral value is 2 ^ 53
//             but bitwise/shifts only operate on int32
//
// add support key for left-right mirror, 09/02/2017
//---------------------------------------------------------
export function gBoard2Key(board: number[], mirror = 0) {
  let boardKey = 0
  let primeBlockPos = -1
  let invBase = 0
  let blockValue

  if (mirror) invBase = -(G_BOARD_X + 1) //key for mirror board

  for (let i = 0; i < board.length; i++) {
    //---------------------------------------------------------------------
    // Javascript only support 53 bits integer	(64 bits floating)
    // for save space, one cell use 2 bits
    // and only keep the position of prime minister block (曹操)
    //---------------------------------------------------------------------
    // maxmum length = (4 * 5 - 4) * 2 + 4
    //               = 32 + 4 = 36 bits
    //
    // 4 * 5 : max cell
    // - 4   : prime minister block size
    // * 2   : one cell use 2 bits
    // + 4   : prime minister block position use 4 bits
    //---------------------------------------------------------------------
    if (!(i % G_BOARD_X)) invBase += G_BOARD_X * 2 //key for mirror board
    if ((blockValue = board[mirror ? invBase - i : i]) == G_GOAL_BLOCK) {
      //skip prime minister block (曹操), only keep position
      if (primeBlockPos < 0) primeBlockPos = i
      continue
    }
    boardKey = (boardKey << 2) + gBlockBelongTo[blockValue] //bitwise/shifts must <= 32 bits)
  }
  boardKey = boardKey * 16 + primeBlockPos //shift 4 bits (0x00-0x0E)
  return boardKey
}

export enum ArrowDirection {
  UP = 0,
  DOWN = 1,
  LEFT = 2,
  RIGHT = 3
}

/**
 * 使用固定的字符值来表示不同的方块类型，这些字符值在整个棋盘上是一致的。
 * 用于内部逻辑和棋盘状态的比较。
 */
export function key2Board1(curKey: number) {
  var board = []
  var blockIndex
  //0   1   2   3   4
  var blockValue = [' ', 'N', 'B', 'H', 'A']
  var primeBlockPos = curKey & 0x0f //position of prime minister block (曹操), 4 bits

  //set prime minister block
  board[primeBlockPos] = blockValue[4]
  board[primeBlockPos + G_BOARD_X] = blockValue[4]
  board[primeBlockPos + 1] = blockValue[4]
  board[primeBlockPos + 1 + G_BOARD_X] = blockValue[4]

  curKey = Math.floor(curKey / 16) //shift >> 4 bits

  for (var curPos = G_BOARD_Y * G_BOARD_X - 1; curPos >= 0; curPos--) {
    if (board[curPos] == blockValue[4]) continue

    blockIndex = curKey & 0x03 //2 bits
    curKey >>= 2 //shift >> 2 bits, now the value <= 32 bits can use bitwise operator
    board[curPos] = blockValue[blockIndex]
  }

  return board
}

/**
 * 使用不同的字符值来表示相同的方块类型，这样每个方块在棋盘上的显示会有所不同，以便于区分不同的方块。
 * 用于可视化显示棋盘，使用户能够更清楚地看到每个方块的位置和移动。
 */
export function key2Board2(curKey: number) {
  var blockIndex
  var board = []
  //                 0    1    2    3    4
  var blockValue = ['@', 'N', 'B', 'H', 'A']
  var primeBlockPos = curKey & 0x0f //position of prime minister block (曹操), 4 bits

  //set prime minister block
  board[primeBlockPos] = blockValue[4]
  board[primeBlockPos + G_BOARD_X] = blockValue[4]
  board[primeBlockPos + 1] = blockValue[4]
  board[primeBlockPos + 1 + G_BOARD_X] = blockValue[4]
  curKey = Math.floor(curKey / 16) //shift >> 4 bits

  loop: for (var curPos = G_BOARD_Y * G_BOARD_X - 1; curPos >= 0; curPos--) {
    if (board[curPos] == blockValue[4]) continue

    blockIndex = curKey & 0x03 //2 bits
    curKey >>= 2 //shift >> 2 bits, now the value <= 32 bits can use bitwise operator

    if (typeof board[curPos] != 'undefined') continue

    switch (blockIndex) {
      case 0: //empty block
        board[curPos] = blockValue[0]
        break
      case 1: // 1X1 block
        board[curPos] = blockValue[1]
        blockValue[1] = String.fromCharCode(blockValue[1].charCodeAt(0) + 1) //ascii + 1
        break
      case 2: // 2X1 block
        board[curPos] = blockValue[2]
        board[curPos - 1] = blockValue[2]
        blockValue[2] = String.fromCharCode(blockValue[2].charCodeAt(0) + 1) //ascii + 1
        break
      case 3: // 1X2 block
        board[curPos] = blockValue[3]
        board[curPos - G_BOARD_X] = blockValue[3]
        blockValue[3] = String.fromCharCode(blockValue[3].charCodeAt(0) + 1) //ascii + 1
        break
      case 4: // 2X2 block
      default:
        console.log('Error: design error !')
        break loop
    }
  }
  return board
}
interface BoardDiffResult {
  srcX: number
  srcY: number
  /**目标x */
  x: number
  /**目标y */
  y: number
  arrow: ArrowDirection
}
/**
 * compare source:board1, target:board2
 * to find the moved block
 */
export function getBoardDiff(board1: string[], board2: string[]): BoardDiffResult {
  var srcPos, dstPos
  var blockStyle
  let stepNum = 0

  srcPos = dstPos = blockStyle = null

  for (var i = 0; i < board1.length; i++) {
    if (board1[i] != board2[i]) {
      if (board1[i] == ' ') {
        stepNum++
        //move block to here
        if (dstPos == null) {
          //first time
          dstPos = i
          if (blockStyle == null) blockStyle = board2[i]
        }
        /*
				if(blockStyle != board2[i]) {
					console.log("Error1: wrong board (" + i + ") !");
					break;
				}*/
      } else {
        // move block out here
        /*
				if(board2[i] != ' ') {
					console.log("Error2: wrong board (" + i + ") !");
					break;
				}*/
        if (srcPos == null) {
          //first time
          srcPos = i
          if (blockStyle == null) blockStyle = board1[i]
        } /*
				if(blockStyle != board1[i]) {
					console.log("Error3: wrong board (" + i + ") !");
					break;
				}*/
      }
    }
  }
  //-----------------------------------------------------------------------------------
  //
  //  (01)
  //        0         0                           0         0
  //      ┌───┐     ┌───┐                       ┌───┐     ┌───┐
  //   0  │ E │     │ ↑ │                    0  │   │     │ E │
  //      ├───┤ ==> ├───┤                       ├───┤ ==> ├───┤
  //   1  │   │     │ E │                    1  │ E │     │ ↓ │
  //      └───┘     └───┘                       └───┘     └───┘
  //      srcPos = (0,1) , dstPos = (0,0)       srcPos = (0,0) , dstPos = (0,1)
  //      direction = (0,-1), move up           direction = (0,1) , move down
  //
  //        0   1         0   1                   0   1         0   1
  //      ┌───┬───┐     ┌───┬───┐               ┌───┬───┐     ┌───┬───┐
  //   0  │ E │   │ ==> │ ← │ E │            0  │   │ E │ ==> │ E │ → │
  //      └───┴───┘     └───┴───┘               └───┴───┘     └───┴───┘
  //      srcPos = (1,0), dstPos = (0,0)       srcPos = (0,0), dstPos = (1,0)
  //	    direction = (-1,0), move left        direction = (1,0), move right
  //
  //  (02)
  //        0         0                           0         0
  //      ┌───┐     ┌───┐                       ┌───┐     ┌───┐
  //   0  │ E │     │ ↑ │                    0  │   │     │ E │
  //      ├───┤     │   │                       ├   ┤     ├───┤
  //   1  │   │ ==> │   │                    1  │   │ ==> │   │
  //      ├   ┤     ├───┤                       ├───┤     │   │
  //   2  │   │     │ E │                    2  │ E │     │ ↓ │
  //      └───┘     └───┘                       └───┘     └───┘
  //      srcPos = (0,2) , dstPos = (0,0)       srcPos = (0,0) , dstPos = (0,2)
  //      direction = (0,-2), move up        direction = (0,2) , move down
  //
  //        0         0                           0         0
  //      ┌───┐     ┌───┐                       ┌───┐     ┌───┐
  //   0  │ E │     │ ↑ │                    0  │   │     │ E │
  //      ├───┤     │   │                       ├   ┤     ├───┤
  //   1  │ E │     │   │                    1  │   │     │ E │
  //      ├───┤     ├───┤                       ├───┤     ├───┤
  //   2  │   │ ==> │ E │                    2  │ E │ ==> │ ↓ │ ==> case1: need to be fixed
  //      ├   ┤     ├───┤                       ├───┤     │   │
  //   3  │   │     │ E │                    3  │ E │     │   │
  //      └───┘     └───┘                       └───┘     └───┘
  //      srcPos = (0,2) , dstPos = (0,0)       srcPos = (0,0) , dstPos = (0,2)
  //      direction = (0,-2), move up           direction = (0,2) , move down
  //
  //        0   1         0   1                   0   1         0   1
  //      ┌───┬───┐     ┌───┬───┐               ┌───┬───┐     ┌───┬───┐
  //   0  │ E │   │     │ ← │ E │            0  │   │ E │     │ E │ → │
  //      ├─-─┼   ┤ ==> │   ┼─-─┤               ├   ┼─-─┤ ==> ├─-─┼   │
  //   1  │ E │   │     │   │ E │            1  │   │ E │     │ E │   │
  //      └───┴───┘     └───┴───┘               └───┴───┘     └───┴───┘
  //      srcPos = (1,0) , dstPos = (0,0)       srcPos = (0,0) , dstPos = (1,0)
  //      direction = (-1,0), move left         direction = (1,0) , move right
  //
  //  (03)
  //        0   1         0   1                   0   1         0   1
  //      ┌───┬───┐     ┌───────┐               ┌───┬───┐     ┌───┬───┐
  //   0  │ E │ E │     │ ↑     │            0  │       │     │ E │ E │
  //      ├─-─┼─-─┤ ==> ├─-─┬─-─┤               ├-──┼─-─┤ ==> ├─-─┴─-─┤
  //   1  │       │     │ E │ E │            1  │ E │ E │     │ ↓     │
  //      └───┴───┘     └───┴───┘               └───┴───┘     └───────┘
  //      srcPos = (0,1) , dstPos = (0,0)       srcPos = (0,0) , dstPos = (0,1)
  //      direction = (0,-1), move up           direction = (0,1) , move down
  //
  //        0   1   2         0   1   2           0   1   2         0   1   2
  //      ┌───┬───┬───┐     ┌───────┬───┐       ┌───┬───┬───┐     ┌───┬───────┐
  //   0  │ E │       │ ==> │ ←     │ E │    0  │       │ E │ ==> │ E │     → │
  //      └───┴───┴───┘     └───────┴───┘       └───┴───┴───┘     └───┴───────┘
  //      srcPos = (1,0) , dstPos = (0,0)       srcPos = (0,0) , dstPos = (2,0)
  //      direction = (-1,0), move left         direction = (2,0) , move right
  //
  //        0   1   2   3         0   1   2   3          0   1   2   3         0   1   2   3
  //      ┌───┬───┬───┬───┐     ┌───────┬───┬───┐      ┌───┬───┬───┬───┐     ┌───┬───┬───────┐
  //   0  │ E │ E │       │ ==> │ ←     │ E │ E │   0  │       │ E │ E │ ==> │ E │ E │ →     │
  //      └───┴───┴───┴───┘     └───────┴───┴───┘      └───┴───┴───┴───┘     └───┴───┴───────┘
  //      srcPos = (2,0) , dstPos = (0,0)              srcPos = (0,0) , dstPos = (2,0) ==> case2: need to be fixed
  //      direction = (-2,0) , move left               direction = (2,0) , move right
  //
  //  (04)
  //
  //        0   1         0   1                   0   1         0   1
  //      ┌───┬───┐     ┌───────┐               ┌───┬───┐     ┌───┬───┐
  //   0  │ E │ E │     │ ↑     │            0  │       │     │ E │ E │
  //      ├─-─┼─-─┤     │       │               ├       ┤     ├─-─┴─-─┤
  //   1  │       │ ==> │       │            1  │       │ ==> │       │
  //      ├       ┤     ├─-─┬─-─┤               ├-──┼─-─┤     │       │
  //   2  │       │     │ E │ E │            1  │ E │ E │     │ ↓     │
  //      └───┴───┘     └───┴───┘               └───┴───┘     └───────┘
  //      srcPos = (0,1) , dstPos = (0,0)       srcPos = (0,0) , dstPos = (0,2)
  //      direction = (0,-1), move up           direction = (0,1) , move down
  //
  //        0   1   2         0   1   2          0   1   2          0   1   2
  //      ┌───┬───┬───┐     ┌───────┬───┐       ┌───┬───┬───┐     ┌───┬───────┐
  //   0  │ E │       │     │ ←     │ E │    0  │       │ E │     │ E │     → │
  //      ├─-─┼       ┤ ==> │       ├─-─┤       ├       ┼─-─┤ ==> ├─-─┤       │
  //   2  │ E │       │     │       │ E │    2  │       │ E │     │ E │       │
  //      └───┴───┴───┘     └───────┴───┘       └───┴───┴───┘     └───┴───────┘
  //      srcPos = (1,0) , dstPos = (0,0)       srcPos = (0,0) , dstPos = (2,0)
  //      direction = (-1,0), move left         direction = (2,0) , move right
  //
  //-------------------------------------------------------------------------------------------

  var srcX = srcPos! % G_BOARD_X,
    srcY = (srcPos! - srcX) / G_BOARD_X
  var dstX = dstPos! % G_BOARD_X,
    dstY = (dstPos! - dstX) / G_BOARD_X
  var directX = dstX - srcX,
    directY = dstY - srcY
  var arrowValue: ArrowDirection
  //console.log("(", + srcX + "," + srcY + ") -> (", + dstX + "," + dstY + ")" );

  //-------------------------------------------------------------
  // special case (skip first step)
  //
  //       0   1         0   1       0   1         0   1
  //     ┌───┐         ┌───┐           ┌───┐         ┌───┐
  //  0  │ E │         │   │           │ E │         │   │
  //     ├───┼───┐ ==> ├───┼───┐   ┌───┼───┤ ==> ┌───┼───┤
  //  1  │ E │   │     │ E │ E │   │   │ E │     │ E │ E │
  //     └───┴───┘     └───┴───┘   └───┴───┘     └───┴───┘
  //
  //     left then up ==> up       right then up ==> up
  //
  //       0   1         0   1       0   1         0   1
  //     ┌───┬───┐     ┌───┬───┐   ┌───┬───┐     ┌───┬───┐
  //  0  │ E │   │     │ E │ E │   │   │ E │     │ E │ E │
  //     ├───┼───┘ ==> ├───┼───┘   └───┼───┤ ==> └───┼───┤
  //  1  │ E │         │   │           │ E │         │   │
  //     └───┘         └───┘           └───┘         └───┘
  //
  //     left then down ==> down   right then down ==> down
  //
  //       0   1         0   1      0   1         0   1
  //     ┌───┬───┐     ┌───┬───┐      ┌───┐         ┌───┐
  //  0  │ E │ E │     │   │ E │      │   │         │ E │
  //     └───┼───┤ ==> └───┼───┤  ┌───┼───┤ ==> ┌───┼───┤
  //  1      │   │         │ E │  │ E │ E │     │   │ E │
  //         └───┘         └───┘  └───┴───┘     └───┴───┘
  //
  //     up then left ==> left    down then left ==> left
  //
  //        0   1         0   1     0   1         0   1
  //     ┌───┬───┐     ┌───┬───┐  ┌───┐         ┌───┐
  //  0  │ E │ E │     │ E │   │  │   │         │ E │
  //     ├───┼───┘ ==> ├───┼───┘  ├───┼───┐ ==> ├───┼───┐
  //  1  │   │         │ E │      │ E │ E │     │ E │   │
  //     └───┘         └───┘      └───┴───┘     └───┴───┘
  //
  //     up then right ==> right  down then right ==> right
  //--------------------------------------------------------------
  if (directX && directY) {
    if (directX > 0) {
      //move right
      //srcPos+(1,0) = empty, means first step is moving right (skip it)
      if (board1[srcX + 1 + srcY * G_BOARD_X] == ' ') directX = 0
      else directY = 0
    } else {
      //move left
      //srcPos+(-1,0) = empty, means first step is moving left (skip it)
      if (board1[srcX - 1 + srcY * G_BOARD_X] == ' ') directX = 0
      else directY = 0
    }
  }

  //----------------------------------
  // case 1: dst pos need to be fixed
  //----------------------------------
  //    board1    board2
  //      0         0         0
  //    ┌───┐     ┌───┐     ┌───┐            ┌───┐
  // 0  │   │     │ E │     │ E │            │ E │
  //    ├   ┤     ├───┤     ├───┤            ├───┤
  // 1  │   │     │ E │     │ E │            │ E │
  //    ├───┤     ├───┤     ├───┤   dstY+1   ├───┤
  // 2  │ E │ ==> │   │ ==> │ ↓ │   ======>  │   │
  //    ├───┤     ├   ┤     │   │            │   │
  // 3  │ E │     │   │     │   │            │ ↓ │
  //    └───┘     └───┘     └───┘            └───┘
  //    srcPos = (0,0) , dstPos = (0,2)     dstY+1 ==> dstPos = (0,3)
  //    direct = (0,2) , move down
  //
  //  directY = 2, blockStyle = 'I', board2(0,2-1) = 'E'  ==> dstY+1
  //
  if (directY > 1 && blockStyle == 'H' && stepNum == 2 /* board2[dstX + (dstY - 1) * G_BOARD_X] == ' ' */) {
    dstY++
  }

  if (directY > 1 && (blockStyle == 'H' || blockStyle == 'A')) {
    dstY--
  }
  // if (directY == -2 && blockStyle == 'H' && board2[srcX + (srcY - 1 + 2) * G_BOARD_X] == ' ') {
  //   srcY++
  // }
  if (directY < 0 && ((blockStyle == 'H' && stepNum == 1) || blockStyle == 'A')) {
    srcY--
  }

  //----------------------------------
  // case 2: dst pos need to be fixed
  //----------------------------------
  //     board1                board2
  //      0   1   2   3         0   1   2   3         0   1   2   3         0   1   2   3
  //    ┌───┬───┬───┬───┐     ┌───┬───┬───┬───┐     ┌───┬───┬───────┐ dstX+1 ┌───┬───┬───────┐
  // 0  │       │ E │ E │ ==> │ E │ E │       │ ==> │ E │ E │ →     │ =====> │ E │ E │     → │
  //    └───┴───┴───┴───┘     └───┴───┴───┴───┘     └───┴───┴───────┘        └───┴───┴───────┘
  //    srcPos = (0,0) , dstPos = (2,0)                                   dstX+1 ==> dstPos = (3,0)
  //    direct = (2,0) , move right
  //
  //  directX = 2, blockStyle = 'H', board2(2-1,0) = 'E'  ==> dstX+1
  //
  // if (directX > 1 && blockStyle == 'H' && board2[dstX - 1 + dstY * G_BOARD_X] == ' ') {
  //   dstX++
  // }

  if (directX > 1 && ((blockStyle == 'B' && stepNum == 1) || blockStyle == 'A')) {
    dstX--
  }
  if (directX < 0 && ((blockStyle == 'B' && stepNum == 1) || blockStyle == 'A')) {
    srcX--
  }

  //UP:0, DN:1, LT:2, RT:3
  if (directY) arrowValue = directY < 0 ? 0 : 1
  if (directX) arrowValue = directX < 0 ? 2 : 3

  return {
    srcX,
    srcY,
    x: dstX,
    y: dstY,
    arrow: arrowValue!
  }
}

export function getBoardDiff1(board1: string[], board2: string[]): BoardDiffResult {
  const emptyBlock = '@'
  let srcPos, dstPos
  let blockStyle

  srcPos = dstPos = blockStyle = null

  for (let i = 0; i < board1.length; i++) {
    if (board1[i] != board2[i]) {
      if (board1[i] == emptyBlock) {
        //move block to here
        if (dstPos == null) {
          //first time
          dstPos = i
          if (blockStyle == null) blockStyle = board2[i]
        }
      } else {
        if (srcPos == null) {
          //first time
          srcPos = i
          if (blockStyle == null) blockStyle = board1[i]
        }
      }
    }
  }
  let srcX = srcPos! % G_BOARD_X,
    srcY = (srcPos! - srcX) / G_BOARD_X
  let dstX = dstPos! % G_BOARD_X,
    dstY = (dstPos! - dstX) / G_BOARD_X
  let directX = dstX - srcX,
    directY = dstY - srcY
  let arrowValue: ArrowDirection
  if (directX && directY) {
    if (directX > 0) {
      //move right
      //srcPos+(1,0) = empty, means first step is moving right (skip it)
      if (board1[srcX + 1 + srcY * G_BOARD_X] == emptyBlock) directX = 0
      else directY = 0
    } else {
      //move left
      //srcPos+(-1,0) = empty, means first step is moving left (skip it)
      if (board1[srcX - 1 + srcY * G_BOARD_X] == emptyBlock) directX = 0
      else directY = 0
    }
  }

  if (directY) arrowValue = directY < 0 ? ArrowDirection.UP : ArrowDirection.DOWN
  if (directX) arrowValue = directX < 0 ? ArrowDirection.LEFT : ArrowDirection.RIGHT
  return {
    srcX,
    srcY,
    x: dstX,
    y: dstY,
    arrow: arrowValue!
  }
}

export function reverseString(str: string) {
  let reversed = ''
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i]
  }
  return reversed
}

export function boardFlip(boardString: string) {
  var srcBoard = boardString
  var flipBoard = ''

  for (var y = 0; y < G_BOARD_Y; y++) {
    flipBoard += reverseString(srcBoard.slice(y * G_BOARD_X, (y + 1) * G_BOARD_X))
  }
  return flipBoard
}

// export function calcSrcPos(board: BoardDiffResult) {
//   switch (board.arrow) {
//     case ArrowDirection.UP:
//       return board.y - board.srcPos.y
//     case ArrowDirection.RIGHT:
//     case ArrowDirection.DOWN:
//     case ArrowDirection.LEFT:
//   }
// }
