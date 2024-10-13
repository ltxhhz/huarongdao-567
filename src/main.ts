import './style.less'

import t_an from '../public/imgs/t暗.png?url'
import t_ying from '../public/imgs/t影.png?url'
import t_hua from '../public/imgs/t华.png?url'
import t_rong from '../public/imgs/t容.png?url'
import t_dao from '../public/imgs/t道.png?url'

import levelSelectDialog from './level-select-dialog.html?raw'

import { initBoardFayaa } from './klotski.board.fayaa'
import { Game } from './game'

// const link = document.createElement('link')
// link.type = 'text/css'
// link.href = tailwind
// document.head.appendChild(link)
const level = initBoardFayaa[0]

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
  <div class="boards-container touch-none">
    <div class="boards" id="boards"></div>
  </div>
  <div class="controls flex justify-around select-none pt-4">
    <div class="text-box steps flex items-center justify-center px-4">
      步数：<span id="steps">0</span>
    </div>
    <button class="text-box py-2 px-4 rounded-lg disabled:opacity-75" id="reset-btn" disabled>重置</button>
    <button class="text-box py-2 px-4 rounded-lg" id="select-btn">选择关卡</button>
  </div>
</div>
${levelSelectDialog}
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
document.getElementById('dialog-level-close')!.onclick = closeModal

document.getElementById('select-btn')!.onclick = openModal

function selectLevel(index: number) {
  const selectedLevel = initBoardFayaa[index]
  console.log('选择了关卡：', selectedLevel.name)
  const game = new Game(selectedLevel)
  document.getElementById('level-info')!.innerText = `${game.currentLevel}、${game.currentLevelName}`
  const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement
  resetBtn.onclick = () => game.init()
  resetBtn.disabled = false
  closeModal() // 选择后关闭弹窗
}

function closeModal() {
  document.getElementById('levelSelectModal')!.style.display = 'none'
}

function openModal() {
  document.getElementById('levelSelectModal')!.style.display = 'flex'
}
