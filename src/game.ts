import { Level } from './klotski.board.fayaa'

import niao from '/imgs/鸟a.png?url'
import hua from '/imgs/华a.png?url'
import shi from '/imgs/石a.png?url'
import hu from '/imgs/狐a.png?url'
import feng from '/imgs/凤a.png?url'
import ya from '/imgs/牙a.png?url'
import biao from '/imgs/镖a.png?url'
import interact from 'interactjs'
import { Tuple } from './utils'

const pieceMap: Record<string, string> = {
  // '2x2': [hua],
  // '1x2': [niao, shi, hu, ya],
  // '2x1': [feng],
  // '1x1': [biao],
  //2x2
  A: hua,
  //2x1
  B: feng,
  C: 'B',
  D: 'B',
  E: 'B',
  F: 'B',
  G: 'B',
  //1x2
  H: niao,
  I: shi,
  J: hu,
  K: ya,
  L: 'H-K',
  M: 'H-K',
  //1x1
  N: biao
}

for (let i = 'N'.charCodeAt(0) + 1; i <= 'Z'.charCodeAt(0); i++) {
  pieceMap[String.fromCharCode(i)] = 'N'
}

interface Block {
  letter: string
  dom: HTMLDivElement
  interactObj: ReturnType<typeof interact>
  gridX: number
  gridY: number
  width: number
  height: number
}

type BoardState = (string | null)[][]

export class Game {
  readonly rows = 5
  readonly cols = 4
  private _steps = 0
  private boardState: BoardState = []

  public get boardStateString(): string {
    return this.boardState.map(e => e.map(e => (e ? e : '@')).join('')).join('')
  }

  private pieces: Record<string, Block> = {}
  private boardDom!: HTMLDivElement
  private stepsDom!: HTMLSpanElement
  // private isGameOver = false
  private timer!: number

  public get currentLevel(): number {
    return this.level.level
  }

  public get currentLevelName(): string {
    return this.level.name
  }

  private set steps(v: number) {
    this._steps = v
    this.stepsDom.innerText = v + ''
  }

  private get steps() {
    return this._steps
  }

  constructor(private level: Level) {
    this.init()
  }
  public init() {
    // this.isGameOver = false
    this._steps = 0
    this.boardDom = document.getElementById('boards') as HTMLDivElement
    this.stepsDom = document.getElementById('steps')!
    this.hahaha()
    this.level.board.split('').forEach((v, i) => {
      this.boardState[Math.floor(i / this.cols)] ||= []
      this.boardState[Math.floor(i / this.cols)][i % this.cols] = v === '@' ? null : v
    })
    const noop: Record<number, boolean> = {}
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const block = this.level.board[y * this.cols + x]
        if (block !== '@' && !noop[y * this.cols + x]) {
          let src = pieceMap[block] || biao // 默认块
          const [width, height] = getBlockSize(block)
          for (let i = 0; i < width; i++) {
            for (let i1 = 0; i1 < height; i1++) {
              noop[(y + i1) * this.cols + x + i] = true
            }
          }
          if (src.length === 1) {
            src = pieceMap[src]
          } else if (src.includes('-')) {
            const [start, end] = src.split('-')
            src = pieceMap[String.fromCharCode(Math.floor(Math.random() * (end.charCodeAt(0) - start.charCodeAt(0) + 1) + start.charCodeAt(0)))!]
          }
          this.pieces[block] = {
            letter: block,
            dom: this.createPiece(src, x, y, width, height),
            gridX: x + 1,
            gridY: y + 1,
            width,
            height
          } as any
          this.addListenMove(this.pieces[block])
        }
      }
    }
    console.log(this.boardState)
    this.boardDom.replaceChildren(...Object.values(this.pieces).map(e => e.dom))
  }

  private hahaha() {
    try {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.stepsDom.innerText !== this._steps + '') {
          //@ts-ignore
          window[atob('ZXZhbA==')](`document.getElementById('steps').innerText=${this._steps}`)
        }
        if (!document.contains(this.stepsDom)) {
          this.endGame()
        }
      }, 500)
    } catch (error) {}
  }

  private addListenMove(block: Block) {
    const { letter, dom, gridX, gridY, width, height } = block
    let moveSteps: Tuple<number, 4> = [0, 0, 0, 0]
    let currentGridX = gridX,
      currentGridY = gridY
    let originalX: number, originalY: number
    let moveX: undefined | boolean
    let gridWidth: number, gridHeight: number
    let animeTimeout: number
    let animeTimeoutFunc: undefined | ((breakAnime?: true) => void)
    block.interactObj = interact(dom).draggable({
      listeners: {
        start: event => {
          event.preventDefault()
          const rect = dom.getBoundingClientRect()
          gridWidth = rect.width / width
          gridHeight = rect.height / height
          if (animeTimeoutFunc) {
            clearTimeout(animeTimeout)
            animeTimeoutFunc(true)
          }
          originalX = rect.x
          originalY = rect.y

          dom.style.transition = 'none'
          // let gridArea = dom.style.gridArea.split('/') as Tuple<string, 4>
          currentGridY = block.gridY
          currentGridX = block.gridX
          console.log(block)

          moveSteps = this.getMoveSteps(currentGridX - 1, currentGridY - 1, width, height)

          console.log(moveSteps)
        },
        move(event) {
          event.preventDefault()
          let x = (parseFloat(dom.getAttribute('data-x')!) || 0) + event.dx
          let y = (parseFloat(dom.getAttribute('data-y')!) || 0) + event.dy
          if (moveX == undefined) {
            moveX = Math.abs(event.dx) > Math.abs(event.dy)
          } else {
            if (moveX) {
              y = 0
              x = Math.min(Math.max(x, gridWidth * moveSteps[0]), gridWidth * moveSteps[1])
            } else {
              x = 0
              y = Math.min(Math.max(y, gridHeight * moveSteps[2]), gridHeight * moveSteps[3])
            }
          }
          dom.style.transform = `translate(${x}px, ${y}px)`
          dom.setAttribute('data-x', x)
          dom.setAttribute('data-y', y)
        },
        end: event => {
          event.preventDefault()
          const board = this.boardDom
          const rect = board.getBoundingClientRect()
          const targetRect = dom.getBoundingClientRect()
          console.log(targetRect.x, targetRect.y)

          // 计算目标位置
          const tx = Math.round(((targetRect.x - rect.x) / rect.width) * this.cols)
          const ty = Math.round(((targetRect.y - rect.y) / rect.height) * this.rows)
          console.log(tx + 1, ty + 1)

          if (tx != currentGridX - 1 || ty != currentGridY - 1) {
            animeTimeout = setTimeout(
              (animeTimeoutFunc = () => {
                dom.style.gridArea = `${ty + 1} / ${tx + 1} / ${ty + 1 + height} / ${tx + 1 + width}`
                dom.style.transition = 'none'
                dom.style.transform = 'translate(0px, 0px)'
                animeTimeoutFunc = undefined
                block.gridX = tx + 1
                block.gridY = ty + 1
                this.steps++
                this.checkWin()
              }),
              350
            )
            for (let i = currentGridX - 1; i < currentGridX - 1 + width; i++) {
              for (let j = currentGridY - 1; j < currentGridY - 1 + height; j++) {
                this.boardState[j][i] = null
              }
            }
            for (let i = tx; i < tx + width; i++) {
              for (let j = ty; j < ty + height; j++) {
                this.boardState[j][i] = letter
              }
            }
            console.log(this.boardState)
            dom.style.transform = `translate(${(tx / this.cols) * board.clientWidth + rect.x - originalX}px, ${(ty / this.rows) * board.clientHeight + rect.y - originalY}px)`
          } else {
            dom.style.transform = 'translate(0px, 0px)'
          }
          dom.style.transition = 'all 0.3s ease'

          dom.removeAttribute('data-x')
          dom.removeAttribute('data-y')
          moveX = undefined
        }
      }
    })
  }
  /**
   * 获取移动步数 [x左移,x右移,y上移,y下移]
   */
  private getMoveSteps(x: number, y: number, width: number, height: number): [number, number, number, number] {
    const steps: number[] = []
    // const letter = this.boardState[x][y]
    let flag = false
    let ii = -1
    while (steps[0] == undefined || steps[1] == undefined) {
      for (let i = y; i < y + height; i++) {
        const y1 = x + ii + (ii > 0 ? width - 1 : 0)
        if (y1 < 0 || y1 >= this.cols || i < 0 || i >= this.rows || this.boardState[i][y1]) {
          flag = true
          break
        }
      }
      if (flag) {
        if (steps[0] == undefined) {
          steps[0] = ii + 1
        } else {
          steps[1] = ii - 1
        }
        ii = 1
        flag = false
      } else {
        if (steps[0] == undefined) {
          ii--
        } else {
          ii++
        }
      }
    }
    flag = false
    ii = -1
    while (steps[2] == undefined || steps[3] == undefined) {
      for (let i = x; i < x + width; i++) {
        const y1 = y + ii + (ii > 0 ? height - 1 : 0)
        if (y1 < 0 || y1 >= this.rows || i < 0 || i >= this.cols || this.boardState[y1][i]) {
          flag = true
          break
        }
      }
      if (flag) {
        if (steps[2] == undefined) {
          steps[2] = ii + 1
        } else {
          steps[3] = ii - 1
        }
        ii = 1
        flag = false
      } else {
        if (steps[2] == undefined) {
          ii--
        } else {
          ii++
        }
      }
    }
    return steps as any
  }

  private createPiece(src: string, x: number, y: number, width: number, height: number) {
    x++
    y++
    // return `<div class="piece" style="grid-area:${y}/${x}/${y + height}/${x + width}">${src.includes('<') ? src : `<img src="${src}" alt="piece" />`} </div>`
    //改为返回dom
    const dom = document.createElement('div')
    dom.classList.add('piece', 'z-10')
    dom.style.gridArea = `${y}/${x}/${y + height}/${x + width}`
    dom.innerHTML = `<img src="${src}" alt="piece" />`

    return dom
  }

  private checkWin(): boolean {
    // 假设胜利条件是 A 块在 (4,1) 和 (4,2)
    if (this.boardState[4][1] === 'A' && this.boardState[4][2] === 'A') {
      // alert('你赢了！')
      document.getElementById('game-complete-modal')!.style.display = 'flex'
      document.getElementById('game-complete-steps')!.innerText = this._steps + ''
      this.endGame()
      return true
    }
    return false
  }

  //结束游戏
  private endGame() {
    // this.isGameOver = true
    Object.values(this.pieces).forEach(e => {
      e.interactObj.unset()
    })
  }

  move(x: number, y: number, tx: number, ty: number) {
    const letter = this.boardState[y][x]!
    const { width, height, dom, gridX, gridY } = this.pieces[letter]
    const steps = this.getMoveSteps(x, y, width, height)
    const board = this.boardDom
    const rect = board.getBoundingClientRect()
    const targetRect = dom.getBoundingClientRect()
    if (tx >= steps[0] + x && tx <= steps[1] + x && ty >= steps[2] + y && ty <= steps[3] + y) {
      setTimeout(() => {
        dom.style.gridArea = `${ty + 1} / ${tx + 1} / ${ty + 1 + height} / ${tx + 1 + width}`
        this.pieces[letter].gridX = tx + 1
        this.pieces[letter].gridY = ty + 1
        dom.style.transition = 'none'
        dom.style.transform = 'translate(0px, 0px)'
        this.steps++
        this.checkWin()
      }, 350)
      for (let i = gridX; i < gridX + width; i++) {
        for (let j = gridY; j < gridY + height; j++) {
          this.boardState[j][i] = null
        }
      }
      for (let i = tx; i < tx + width; i++) {
        for (let j = ty; j < ty + height; j++) {
          this.boardState[j][i] = letter
        }
      }
      console.log(this.boardState)
      dom.style.transform = `translate(${(tx / this.cols) * board.clientWidth + rect.x - targetRect.x}px, ${(ty / this.rows) * board.clientHeight + rect.y - targetRect.y}px)`
      dom.style.transition = 'all 0.3s ease'
    } else {
      throw new Error('移动不合法')
    }
  }
  destroy() {
    clearInterval(this.timer)
  }
}

function getBlockSize(block: string): [number, number] {
  const code = block.charCodeAt(0)
  if (block === 'A') {
    return [2, 2]
  } else if (code >= 'B'.charCodeAt(0) && code <= 'G'.charCodeAt(0)) {
    return [2, 1]
  } else if (code >= 'H'.charCodeAt(0) && code <= 'M'.charCodeAt(0)) {
    return [1, 2]
  } else {
    return [1, 1]
  }
}
