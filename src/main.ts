import './style.less'

import t_an from '/imgs/min/t暗.png?url'
import t_ying from '/imgs/min/t影.png?url'
import t_hua from '/imgs/min/t华.png?url'
import t_rong from '/imgs/min/t容.png?url'
import t_dao from '/imgs/min/t道.png?url'

import levelSelectDialog from './level-select-dialog.html?raw'
import completeDialog from './complete-dialog.html?raw'

import { boards, boardsSorted, classicBoards, Level } from './boards'
// import { initBoardFayaa } from './boards/klotski.board.fayaa'
import { Game } from './game'
import { boardFlip, getBoardDiff, key2Board1, Tuple } from './utils'


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
    <div id="level-info" class="text-box inline-flex items-center justify-center text-lg my-2 px-2">
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
console.log(boards)

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

initTabs()
selectLevel(480)

function selectLevel(index: number) {
  let selectedLevel = boardsSorted[index]
  if (index >= boardsSorted.length) {
    selectedLevel = classicBoards[index - boardsSorted.length]
  }
  console.log('选择了关卡：', index, selectedLevel)
  game?.destroy()
  game = new Game(selectedLevel)
  document.getElementById('level-info')!.innerText = `${game.currentLevelName}`
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

function initTabs() {
  const tabsNum = 5
  const eachSum = Math.floor(boardsSorted.length / tabsNum)
  const tabsContent: Level[][] = []
  const dialogTabsEl = document.getElementById('dialog-level-tabs')!
  const dialogListEl = document.getElementById('dialog-level-list')!
  // let selectedIndex = 0

  for (let i = 0; i < tabsNum; i++) {
    tabsContent.push(boardsSorted.slice(i * eachSum, i == tabsNum - 1 ? undefined : (i + 1) * eachSum))
  }
  tabsContent.push(classicBoards)
  const btns: HTMLButtonElement[] = []
  tabsContent.forEach((e, i, arr) => {
    const btn = document.createElement('button')
    btns.push(btn)
    btn.innerText = i == arr.length - 1 ? '经典' : `等级 ${i + 1}`
    btn.className = `inline-flex items-center h-10 px-4 -mb-px text-sm text-center bg-transparent border-b-2 focus:outline-none sm:text-base whitespace-nowrap ${
      i == 0 ? 'text-blue-600 border-blue-500 dark:border-blue-400 dark:text-blue-300' : 'text-gray-700 dark:text-white whitespace-nowrap cursor-base hover:border-gray-400'
    }`
    btn.onclick = () => {
      btns.forEach((e, i1) => {
        e.className = `inline-flex items-center h-10 px-4 -mb-px text-sm text-center bg-transparent border-b-2 focus:outline-none sm:text-base whitespace-nowrap ${
          i == i1 ? 'text-blue-600 border-blue-500 dark:border-blue-400 dark:text-blue-300' : 'text-gray-700 dark:text-white whitespace-nowrap cursor-base hover:border-gray-400'
        }`
      })
      dialogListEl.replaceChildren(
        ...e.map((level, index) => {
          const btn = document.createElement('button')
          btn.classList.add('bg-gray-100', 'hover:bg-blue-100', 'p-4', 'rounded-lg', 'shadow')
          btn.dataset.level = index + ''
          btn.onclick = () => selectLevel(i * eachSum + index)
          btn.innerHTML = `
        <div class="text-lg font-medium">${level.name}</div>
        <div class="text-sm text-gray-500">关卡 ${index + 1}</div>
      `
          return btn
        })
      )
    }
    dialogTabsEl.appendChild(btn)
  })
  dialogListEl.replaceChildren(
    ...tabsContent[0].map((level, index) => {
      const btn = document.createElement('button')
      btn.classList.add('bg-gray-100', 'hover:bg-blue-100', 'p-4', 'rounded-lg', 'shadow')
      btn.dataset.level = index + ''
      btn.onclick = () => selectLevel(0 * eachSum + index)
      btn.innerHTML = `
        <div class="text-lg font-medium">${level.name}</div>
        <div class="text-sm text-gray-500">关卡 ${index + 1}</div>
      `
      return btn
    })
  )
}
