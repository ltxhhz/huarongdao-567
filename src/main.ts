import './style.less'

import t_an from '/imgs/min/t暗.png?url'
import t_ying from '/imgs/min/t影.png?url'
import t_hua from '/imgs/min/t华.png?url'
import t_rong from '/imgs/min/t容.png?url'
import t_dao from '/imgs/min/t道.png?url'

import levelSelectDialog from './level-select-dialog.html?raw'
import completeDialog from './complete-dialog.html?raw'

import { initBoardFayaa } from './klotski.board.fayaa'
import { Game } from './game'
import { Tuple } from './utils'

let game: Game

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="container ">
  <div class="text-center">
    <div class="flex items-center justify-center gap-1 md:gap-2 lg:gap-4">
      <img src="${t_an}" alt="暗" />
      <img src="${t_ying}" alt="影" />
      <img src="${t_hua}" alt="华" />
      <img src="${t_rong}" alt="容" />
      <img src="${t_dao}" alt="道" />
    </div>
    <div id="level-info" class="text-box inline-flex items-center justify-center text-lg my-2">
      请选择关卡
    </div>
  </div>
  <div class="boards-container touch-none relative">
    <div class="boards" id="boards"></div>
    <div class="exit absolute left-1/4 bottom-0 w-1/2 h-1/5"></div>
  </div>
  <div class="controls flex justify-around select-none pt-4">
    <div id="steps-container" class="text-box steps flex items-center justify-center px-4">
      步数：<span id="steps">0</span>
    </div>
    <button class="text-box py-2 px-4 rounded-lg disabled:opacity-75" id="reset-btn" disabled>重置</button>
    <button class="text-box py-2 px-4 rounded-lg" id="select-btn">选择关卡</button>
  </div>
</div>
${levelSelectDialog}
${completeDialog}
`

document.getElementById('dialog-level-list')!.replaceChildren(
  ...initBoardFayaa.map((level, index) => {
    const btn = document.createElement('button')
    btn.classList.add('bg-gray-100', 'hover:bg-blue-100', 'p-4', 'rounded-lg', 'shadow')
    btn.dataset.level = index + ''
    btn.onclick = () => selectLevel(index)
    btn.innerHTML = `
        <div class="text-lg font-medium">${level.name}</div>
        <div class="text-sm text-gray-500">关卡 ${level.level}</div>
      `
    return btn
  })
)
document.getElementById('dialog-level-close')!.onclick = closeSelectModal

document.getElementById('select-btn')!.onclick = function () {
  document.getElementById('levelSelectModal')!.style.display = 'flex'
}

document.getElementById('close-complete-modal-btn')!.onclick = function () {
  //@ts-ignore
  document.getElementById('game-complete-modal')!.style.display = 'none'
}

document.getElementById('steps-container')!.onclick = function () {
  //@ts-ignore
  this.classList.add('q-pop')
  setTimeout(() => {
    //@ts-ignore
    this.classList.remove('q-pop')
  }, 600)
}
function selectLevel(index: number) {
  const selectedLevel = initBoardFayaa[index]
  console.log('选择了关卡：', selectedLevel.name)
  game?.destroy()
  game = new Game(selectedLevel)
  document.getElementById('level-info')!.innerText = `${game.currentLevel}、${game.currentLevelName}`
  const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement
  resetBtn.onclick = () => game.init()
  resetBtn.disabled = false
  closeSelectModal() // 选择后关闭弹窗
  if (import.meta.env.DEV) {
    //@ts-ignore
    window.a = async () => {
      // game.move(3, 4, 2, 4)
      const arr: Tuple<number, 4>[] = [
        [3, 4, 2, 4],
        [3, 2, 3, 3],
        [1, 2, 2, 2],
        [1, 3, 1, 4],
        [0, 2, 1, 2],
        [0, 4, 0, 3],
        [1, 4, 0, 4],
        [1, 2, 1, 3],
        [2, 2, 0, 2],
        [2, 3, 2, 2],
        [2, 2, 3, 2],
        [2, 4, 2, 2],
        [1, 3, 2, 3],
        [0, 3, 1, 3],
        [1, 3, 1, 4],
        [0, 2, 0, 3],
        [2, 2, 0, 2],
        [3, 2, 1, 2],
        [2, 3, 2, 2],
        [3, 3, 3, 2],
        [1, 4, 3, 4],
        [0, 4, 2, 4],
        [0, 3, 0, 4],
        [1, 2, 1, 3],
        [1, 3, 0, 3],
        [2, 2, 1, 2],
        [3, 2, 2, 2],
        [3, 0, 3, 2],
        [1, 0, 2, 0],
        [0, 0, 1, 0],
        [0, 2, 0, 0],
        [0, 3, 0, 1],
        [1, 2, 0, 2],
        [1, 0, 1, 2],
        [2, 0, 1, 0],
        [3, 2, 3, 0],
        [2, 2, 3, 2],
        [2, 4, 2, 2],
        [3, 4, 2, 4],
        [2, 4, 2, 3],
        [0, 4, 2, 4],
        [0, 2, 0, 3],
        [1, 2, 1, 3],
        [2, 2, 0, 2],
        [1, 0, 1, 1],
        [0, 0, 2, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 2, 0, 0],
        [0, 3, 0, 1],
        [1, 3, 0, 3],
        [2, 3, 1, 3],
        [1, 3, 1, 4],
        [1, 1, 1, 2],
        [2, 0, 2, 1],
        [2, 1, 1, 1],
        [3, 0, 2, 0],
        [3, 2, 3, 0],
        [1, 2, 2, 2],
        [1, 1, 1, 2],
        [1, 0, 1, 1],
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [0, 3, 0, 2],
        [1, 4, 0, 4],
        [1, 2, 1, 4],
        [2, 2, 1, 2],
        [3, 0, 3, 2],
        [2, 0, 3, 0],
        [1, 0, 2, 0],
        [1, 1, 2, 1],
        [0, 0, 1, 0],
        [0, 2, 0, 0],
        [1, 2, 0, 2],
        [2, 1, 2, 3],
        [2, 0, 2, 2],
        [3, 0, 2, 0],
        [3, 2, 3, 0],
        [2, 3, 3, 3],
        [3, 3, 3, 2],
        [2, 4, 2, 3],
        [1, 4, 3, 4],
        [0, 4, 2, 4],
        [0, 2, 0, 3],
        [2, 2, 0, 2],
        [3, 2, 1, 2],
        [2, 3, 2, 2],
        [2, 4, 2, 3],
        [2, 3, 3, 3],
        [0, 3, 1, 3]
      ]
      for (const item of arr) {
        game.move(...item, 100)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }
}

function closeSelectModal() {
  document.getElementById('levelSelectModal')!.style.display = 'none'
}
