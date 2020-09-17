//再整理下思路！！！~~~
// 1. 游戏开始：
const playGame = function () {
    let square = Lattice024(2, Lattice())
    log('初始 square is', square)
    renderSquare(square)
    selectSugar(square)
    keydownMove(square)
}

//copy 数组的通用函数
const clonedArray = function(array) {
    return array.slice(0)
}
const clonedSquare = function(array) {
    let l = []
    for (let i = 0; i < array.length; i++) {
        let e = array[i]
        let line = clonedArray(e)
        l.push(line)
    }
    return l
}

// 生成4*4的00数组，放在页面里，0不显示
const Lattice = function () {
    let s = '[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]'
    let square = JSON.parse(s)
    return square
}

// 初始数组里有两个随机位置的数字（2或4）
let arr = [2, 2, 4]
const randomLattice = function(arr) {
    let l = arr.length
    let a = arr[Math.floor((Math.random()*l))]
    return a
}

const random_ij = function(m) {
    let n = Math.random()
    n = n * m
    n = Math.floor(n)
    return n
}

const random_i = function(n) {
    let r = []
    for (let i = 0; i < n; i++) {
        let n = random_ij(4)
        r.push(n)
    }
    return r
}

const unique = function(array) {
    let s = new Set(array)
    let a = Array.from(s)
    return a
}

const Lattice024 = function(b, square) {
    let coord_i = clonedArray(random_i(4))
    let coord_j = clonedArray(random_i(4))
    let s = clonedSquare(square)
    let r = []
    for (let i = 0; i < b; i++) {
        let n = coord_i[i]
        let m = coord_j[i]
        let numb = randomLattice(arr)
        s[n][m] = numb
        r.push(`${n}${m}`)
    }
    let r_set = unique(r)
    if (r_set.length < b) {
        log('两次数字位置重复了')
        Lattice024(b, square)
    }
    return s
}

//把数组显示在页面
const templateCell = function(line, x) {
    let r = ''
    for (let i = 0; i < line.length; i++) {
        r += `<div class="cell" data-number="${line[i]}" data-x="${x}" data-y="${i}" id="${x}${i}">${line[i]}</div>`
    }
    return r
}

const templateRow = function(square) {
    let row = ''
    for(let i = 0; i < square.length; i++) {
        let line = square[i]
        row += templateCell(line, i)
    }
    return row
}

let sugar = e('#id-div-sugar')
const renderSquare = function(square) {
    let row = templateRow(square)
    appendHtml(sugar, row)
}

const replace = function (square, x, y) {
    let re = e(`[data-x="${x}"][data-y="${y}"]`)
    re.innerHTML = `${square[x][y]}`
}

//遍历数组(selectSugar)中的数字，非0数字中，如果为2/4/8……添加css
const color_sugar = (a, x, y) => {
    let are = e(`[data-x="${x}"][data-y="${y}"]`)
    // log('are is', are)
    if (a === 2) {
        are.classList.add('cell-2')
    } else if (a === 0) {
        are.removeAttribute("class")
        are.classList.add('cell')
    } else if (a === 4) {
        are.removeAttribute("class")
        are.classList.add('cell-4')
    } else if (a === 8) {
        are.removeAttribute("class")
        are.classList.add('cell-8')
    } else if (a === 16) {
        are.removeAttribute("class")
        are.classList.add('cell-16')
    } else if (a === 32) {
        are.removeAttribute("class")
        are.classList.add('cell-32')
    } else if (a === 64) {
        are.removeAttribute("class")
        are.classList.add('cell-64')
    } else if (a === 128) {
        are.removeAttribute("class")
        are.classList.add('cell-128')
    } else if (a === 256) {
        are.removeAttribute("class")
        are.classList.add('cell-256')
    } else if (a === 512) {
        are.removeAttribute("class")
        are.classList.add('cell-512')
    } else if (a === 1024) {
        are.removeAttribute("class")
        are.classList.add('cell-1024')
    } else if (a === 2048) {
        are.removeAttribute("class")
        are.classList.add('cell-2048')
    }
}
const selectSugar = function (square) {
    let c = square
    for (let i = 0; i < c.length; i++) {
        let l = c[i]
        let x = i
        for (let j = 0; j < l.length; j++) {
            let y = j
            if (!(c[x][y] === 0)){
                color_sugar(c[x][y], x, y)
            }
        }
    }
}

// 2. 绑定 keydown 事件委托，每次按键后，相应数字变化，要插入一个函数3
const  keydownMove = function(square) {
    window.addEventListener('keydown', function(event){
        let k = event.key
        if (k === 'a') {
            log('向左')
            removeClassAll('direction-image-active')
            let a = e('#id-A')
            a.classList.add('direction-image-active')
            moveLeft(square)
            randomSugar(square)
        } else if (k === 'd') {
            log('向右')
            removeClassAll('direction-image-active')
            let d = e('#id-D')
            d.classList.add('direction-image-active')
            moveRight(square)
            randomSugar(square)
        }else if (k === 'w') {
            log('向上')
            removeClassAll('direction-image-active')
            let w = e('#id-W')
            w.classList.add('direction-image-active')
            moveUp(square)
            randomSugar(square)
        }else if (k === 's') {
            log('向下')
            removeClassAll('direction-image-active')
            let s = e('#id-S')
            s.classList.add('direction-image-active')
            moveDown(square)
            randomSugar(square)
        }

    })
    return square
}


// 3. 数字变化的函数分四种情况：遍历每一个数字，生成指定方向上第一个数字的坐标，插入函数4
// 【注意】要随时更新数组
//     左，要确保进入判断的数字不是在左边界上
const moveLeft = function (square) {
    let c = square
    for (let i = 0; i < c.length; i++) {
        let l = c[i]
        let x = i
        for (let j = 0; j < l.length; j++) {
            let y = j
            //本身不等于 0 且 满足左边界条件
            if ((!(c[x][y] === 0)) && (!(y === 0))) {
                // log('本身和左边坐标', n, n_left)
                // mergeSugar(n, n_left)
                if (c[x][y - 1] === 0) {
                    c[x][y - 1] = c[x][y]
                    c[x][y] = 0
                    replace(c, x, y)
                    color_sugar(c[x][y], x, y)
                    replace(c, x, y - 1)
                    color_sugar(c[x][y - 1], x, y - 1)
                    moveLeft(c)
                } else if (!(c[x][y - 1] === 0)) {
                    if(c[x][y] === c[x][y - 1]) {
                        mergeSugar(c[x][y], c[x][y - 1])
                        let m = mergeSugar(c[x][y], c[x][y - 1])
                        c[x][y - 1] = m[0]
                        c[x][y] = m[1]
                        replace(c, x, y)
                        color_sugar(c[x][y], x, y)
                        replace(c, x, y - 1)
                        color_sugar(c[x][y - 1], x, y - 1)
                    }
                }
            }
        }
    }
    return c
}

//     右
const moveRight = function (square) {
    let c = square
    for (let i = 0; i < c.length; i++) {
        let l = c[i]
        let x = i
        for (let j = 0; j < l.length; j++) {
            let y = j
            //本身不等于 0 且 满足左边界条件
            if ((!(c[x][y] === 0)) && (!(y === 3))) {
                if (c[x][y + 1] === 0) {
                    c[x][y + 1] = c[x][y]
                    c[x][y] = 0
                    replace(c, x, y)
                    color_sugar(c[x][y], x, y)
                    replace(c, x, y + 1)
                    color_sugar(c[x][y + 1], x, y + 1)
                    moveRight(c)
                } else if (!(c[x][y + 1] === 0)) {
                    if(c[x][y] === c[x][y + 1]) {
                        mergeSugar(c[x][y], c[x][y + 1])
                        let m = mergeSugar(c[x][y], c[x][y + 1])
                        c[x][y + 1] = m[0]
                        c[x][y] = m[1]
                        replace(c, x, y)
                        color_sugar(c[x][y], x, y)
                        replace(c, x, y + 1)
                        color_sugar(c[x][y + 1], x, y + 1)
                    }
                }
            }
        }
    }
    return c
}

//     上
const moveUp = function (square) {
    let c = square
    for (let i = 0; i < c.length; i++) {
        let l = c[i]
        let x = i
        for (let j = 0; j < l.length; j++) {
            let y = j
            //本身不等于 0 且 满足左边界条件
            if ((!(c[x][y] === 0)) && (!(x === 0))) {
                if (c[x - 1][y] === 0) {
                    c[x - 1][y] = c[x][y]
                    c[x][y] = 0
                    replace(c, x, y)
                    color_sugar(c[x][y], x, y)
                    replace(c, x - 1, y)
                    color_sugar(c[x - 1][y], x - 1, y)
                    moveUp(c)
                } else if (!(c[x - 1][y] === 0)) {
                    if (c[x][y] === c[x - 1][y]) {
                        mergeSugar(c[x][y], c[x - 1][y])
                        let m = mergeSugar(c[x][y], c[x - 1][y])
                        c[x - 1][y] = m[0]
                        c[x][y] = m[1]
                        replace(c, x, y)
                        color_sugar(c[x][y], x, y)
                        replace(c, x - 1, y)
                        color_sugar(c[x - 1][y], x - 1, y)
                    }
                }
            }
        }
    }
    return c
}

//     下
const moveDown = function (square) {
    let c = square
    for (let i = 0; i < c.length; i++) {
        let l = c[i]
        let x = i
        for (let j = 0; j < l.length; j++) {
            let y = j
            //本身不等于 0 且 满足左边界条件
            if ((!(c[x][y] === 0)) && (!(x === 3))) {
                if (c[x + 1][y] === 0) {
                    c[x + 1][y] = c[x][y]
                    c[x][y] = 0
                    replace(c, x, y)
                    color_sugar(c[x][y], x, y)
                    replace(c, x + 1, y)
                    color_sugar(c[x + 1][y], x + 1, y)
                    moveDown(c)
                } else if (!(c[x + 1][y] === 0)) {
                    if(c[x][y] === c[x + 1][y]) {
                        mergeSugar(c[x][y], c[x + 1][y])
                        let m = mergeSugar(c[x][y], c[x + 1][y])
                        c[x + 1][y] = m[0]
                        c[x][y] = m[1]
                        replace(c, x, y)
                        color_sugar(c[x][y], x, y)
                        replace(c, x + 1, y)
                        color_sugar(c[x + 1][y], x + 1, y)
                    }
                }
            }
        }
    }
    return c
}

// 4. 定义一个函数，总的来说，在指定一方向上，如果本身不等于 0 和 2048，如果方向上第一个数字b和本身a相同，则这第一个数字*2，添加函数5
const mergeSugar = function (a, b) {
    let c = []
    let sum = ''
    let s = e('#score')
    if ((a === b) && (!(a === 2048)) && (!(b === 2048))) {
        b = b * 2
        sum += b
        log('sum is', sum)
        s.innerhtml = `SCORE:${sum}`
        c.push(b)
        a = 0
        c.push(a)
    }
    log('mergeSugar', a, b, c)
    return c
}

// 5. 添加css，不同的数字对应的css不同
// 6. 数字本身css的class全删除，再添加cell
// 7. 在数组中除了被占位置，随机生成 2 或 4，并添加相应css
//     生成随机位置，遍历数组，如果该位置的数字等于 0，确认生成该位置，如果不等于0，再循环（递归），最后添加css
const randomSugar = function (square) {
    let coord_i = clonedArray(random_i(4))
    let coord_j = clonedArray(random_i(4))
    let c = square
    for (let i = 0; i < 1; i++) {
        let n = coord_i[i]
        let m = coord_j[i]
        let numb = randomLattice(arr)
        if (c[n][m] === 0) {
            c[n][m] = numb
            log('执行了randomSugar,c[n][m] is', c[n][m])
            log('nm', n, m)
            replace(c, n, m)
            color_sugar(c[n][m], n, m)
        } else {
            randomSugar(square)
        }
    }
}

// 8. 游戏结束：遍历，
//     第一种情况：所有数字都不等于0，并且，数字周围数字（要分情况算）都不等于它本身
//     第二种情况：所有数字都等于2048
//总
const gameOver = function () {
    // if ()
    playGame()
}
gameOver()
