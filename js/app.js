document.addEventListener("DOMContentLoaded", () => {
	
	console.log('ребята, которые проверяют мою рабту, огромное спасибо вам, я успела доделать')
});

const difficulties = [3, 4, 5, 6, 7, 8];
let diff = difficulties[1];
let moves = 0;

const div = document.createElement('div');
div.className = 'container';
const headerBlock = document.createElement('div');
headerBlock.className = 'header-block';

const panel = document.createElement('section');
panel.classList.add('panel');
const panelContainer = document.createElement('div');
panelContainer.classList.add('panel-container');
const panelItemFirst = document.createElement('div');
panelItemFirst.classList.add('panel-item');
const startBtn = document.createElement('button');
startBtn.classList.add('panel-button');
startBtn.classList.add('btn-primary');
startBtn.classList.add('shuffleAndStart');
startBtn.textContent = 'shuffle and start'
const stopBtn = document.createElement('button');
stopBtn.classList.add('panel-button');
stopBtn.classList.add('btn-secondary');
stopBtn.classList.add('stop');
stopBtn.textContent = 'stop'
const saveBtn = document.createElement('button');
saveBtn.classList.add('panel-button');
saveBtn.classList.add('btn-primary');
saveBtn.classList.add('save');
saveBtn.textContent = 'save'
const resultsBtn = document.createElement('button');
resultsBtn.classList.add('panel-button');
resultsBtn.classList.add('btn-primary');
resultsBtn.classList.add('results');
resultsBtn.textContent = 'results'

const panelItemSecond = document.createElement('div');
panelItemSecond.classList.add('panel-item');
const panelInfo = document.createElement('div');
panelInfo.classList.add('panel-info');
const panelScores = document.createElement('div');
panelScores.classList.add('panel-scores');
const panelSave = document.createElement('div');
panelSave.classList.add('panel-save');

const panelItemThird = document.createElement('div');
panelItemThird.classList.add('panel-item');
const panelInfoThird = document.createElement('div');
panelInfoThird.classList.add('panel-info');

panelItemFirst.append(startBtn);
panelItemFirst.append(stopBtn);
panelItemFirst.append(saveBtn);
panelItemFirst.append(resultsBtn);

panelItemSecond.append(panelInfo);
panelItemSecond.append(panelSave);
panelItemSecond.append(panelScores);

panelContainer.append(panelItemFirst);
panelContainer.append(panelItemSecond);
panelContainer.append(panelItemThird);
panel.append(panelContainer);
div.append(panel);


const timerBlock = document.createElement('div');
timerBlock.className = 'timer-block';
timerBlock.innerHTML = '<p class="timer-text">Timer</p><div class="timer">00:00</div>';
const moveCountBlock = document.createElement('div');
moveCountBlock.className = 'timer-block';
moveCountBlock.innerHTML = '<p class="timer-text">Moves</p><div class="moves"></div>';


const gameArea = document.createElement('div');
gameArea.className = 'game-area';
gameArea.setAttribute('data-size', '16');
gameArea.setAttribute('data-sound', 'on');

const buttons = document.createElement('div');
buttons.className = 'buttons';

const turnOff = document.createElement('div');
const textSound = document.createElement('p');
textSound.className = 'text';
textSound.innerText = 'Sound Off/On:';
turnOff.className = 'switch';
turnOff.innerHTML = '<input id="switch" type="checkbox" checked><label for="switch"></label>';

const diffCntrl = document.createElement('div');
diffCntrl.className = 'diff-control';

const colorCtrl = document.createElement('div');
colorCtrl.className = 'diff-control__color';

let difBtn = document.createElement('input');
let labelForDiff = document.createElement('label');
for (let i = 0; i < difficulties.length; i++) {
	difBtn = document.createElement('input');
	difBtn.type = 'radio';
	difBtn.name = 'radio';
	difBtn.id = `diff-${i + 1}`;
	difBtn.value = difficulties[i];
	if (difficulties[i] === 4) {
		difBtn.checked = true;
	};
	labelForDiff = document.createElement('label');
	labelForDiff.htmlFor = difBtn.id;
	labelForDiff.className = `diff-control__${i+1}`
	labelForDiff.innerHTML = `<p>${difficulties[i]}✕${difficulties[i]}</p>`;

	diffCntrl.append(difBtn);
	diffCntrl.append(labelForDiff);
};

let tileArr = [];
let numbersOfTiles = [];


const audioMove = new Audio();
audioMove.src = '../assets/sounds/alert.wav';
let isAudioOn = true;


function addTiles(dif) {
	let tile = document.createElement('div');
	for (let i = 1; i <= dif ** 2; i++) {
		tile = document.createElement('div');
		tile.className = 'tile';
		tile.id = `tile${i}`;
		tile.innerText = i;
		tile.style.width = `calc(100%/${dif})`;
		tileArr.push(tile);
		gameArea.append(tile);
	};
};

document.body.append(div);
div.append(headerBlock);
headerBlock.append(timerBlock);
headerBlock.append(moveCountBlock);
div.append(gameArea);
div.append(diffCntrl);
diffCntrl.append(colorCtrl);
div.append(buttons);
buttons.append(textSound);
buttons.append(turnOff);

const movesCount = document.querySelector('.moves');
movesCount.innerText = moves;

let time = document.querySelector('.timer');
let seconds = 0;

addTiles(diff);

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	};
	return array;
};

function getNumbersFromTiles(array) {
	numbersOfTiles = array.map(item => +item.id.slice(4));
	return numbersOfTiles;
};

let currentMatrix;

function shuffleTiles() {
	if (localStorage.getItem('saveMatrix') !== null) {
		currentMatrix = JSON.parse(localStorage.getItem("saveMatrix"));
		localStorage.clear();
	} else {
		currentMatrix = getMatrix(shuffle(getNumbersFromTiles(tileArr)));
	}

	if (!isSolvable(currentMatrix)) {
		shuffleTiles();
		return;
	};

	setPositions(currentMatrix);
	moves = 0;
	movesCount.innerText = moves;
	return currentMatrix;
};

function getMatrix(arr) {
	const matrix = [];
	for (let i = 0; i < diff; i++) matrix.push([]);
	let x = 0,
		y = 0;
	for (let j = 0; j < arr.length; j++) {
		if (x === diff) {
			y++;
			x = 0;
		};
		matrix[y][x] = arr[j];
		x++;
	};	
	return matrix;
};

function setElemStyle(elem, x, y) {
	const shift = 100;
	elem.style.transform = `translate(${x*shift}%, ${y*shift}%)`;
};

function setPositions(matrix) {
	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			const value = matrix[y][x];
			const elem = tileArr[value - 1];
			setElemStyle(elem, x, y);
		};
	};
};

let matrix = getMatrix(getNumbersFromTiles(tileArr));

setPositions(matrix);

// startBtn.addEventListener('click', shuffleTiles);


startBtn.addEventListener('click', () => {
	if (gameArea.style.pointerEvents = 'none') {
		gameArea.style.pointerEvents = 'auto';
		timerBlock.innerText= `TIMER
          00:00`;     
		shuffleTiles();
	}
});

// shuffleTiles();


function isWin(winArr, currArr) {
	for (let i = 0; i < currArr.flat().length; i++) {
		if (winArr.flat()[i] !== currArr.flat()[i]) return false;
	}
	return true;
};

function isNear(coords1, coords2) {
	const deltaX = Math.abs(coords1.x - coords2.x);
	const deltaY = Math.abs(coords1.y - coords2.y);
	if (deltaX + deltaY === 1) return true;
	return false;
};

function witchDirection(coords0, coords1) {
	const deltaX = coords0.x - coords1.x;
	const deltaY = coords0.y - coords1.y;
	if (deltaY === -1) return 1;
	if (deltaY === 1) return 3;
	if (deltaX === 1) return 2;
	if (deltaX === -1) return 4;
	else return;
}

function replace(coords0, coords1) {
	const coords = currentMatrix[coords0.y][coords0.x];
	currentMatrix[coords0.y][coords0.x] = currentMatrix[coords1.y][coords1.x];
	currentMatrix[coords1.y][coords1.x] = coords;
	if (isWin(getMatrix(getNumbersFromTiles(tileArr)), currentMatrix)) {
		gameArea.style.pointerEvents = 'none';
		localStorage.setItem('movesData', JSON.stringify(moves));
		localStorage.setItem('secondsData', JSON.stringify(timerBlock.innerText.slice(6)));
		alert(`Hooray! You solved the puzzle in ${timerBlock.innerText.slice(6)} and ${moves} moves!`);
		console.log(`timerBlock111: ${timerBlock.innerText.slice(6)}`)
		
		clearInterval(timerId);
	}	
};

function moveTileByClick(e) {
	const tileNode = e.target.closest('.tile');
	if (!tileNode) return;
	const tileNumber = Number(tileNode.id.slice(4));
	const tileCoords = findCoords(tileNumber);
	const blankCoords = findCoords(diff ** 2);
	if (isNear(tileCoords, blankCoords)) {
		replace(blankCoords, tileCoords);
		setPositions(currentMatrix);
		if (isAudioOn) audioMove.play();
		moves += 1;
		if (moves === 1) {
			timer();
		}
		movesCount.innerText = moves;		
	};
};

gameArea.addEventListener('click', moveTileByClick);

gameArea.onmousedown = function (e) {
	e.preventDefault();
	const tileNode = e.target.closest('.tile');
	if (!tileNode) return;
	const blankNode = tileNode.parentElement.lastElementChild;
	const tileNumber = Number(tileNode.id.slice(4));
	const tileCoords = findCoords(tileNumber);
	const blankCoords = findCoords(diff ** 2);
	if (isNear(tileCoords, blankCoords)) {
		if (witchDirection(blankCoords, tileCoords) === 2 ||
			witchDirection(blankCoords, tileCoords) === 4) {
			const shiftX = e.clientX - tileNode.getBoundingClientRect().left;
			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
			const currTransX = +tileNode.style.transform.slice(10, tileNode.style.transform.indexOf('%'));
			const blankTransX = +blankNode.style.transform.slice(10, blankNode.style.transform.indexOf('%'));

			function onMouseMove(e) {
				gameArea.removeEventListener('click', moveTileByClick);
				tileNode.classList.add('undelay');
				let distX = (((e.clientX - shiftX - gameArea.getBoundingClientRect().left)) / tileNode.getBoundingClientRect().width) * 100;
				const currTransY = +tileNode.style.transform.slice(tileNode.style.transform.indexOf(' '), tileNode.style.transform.lastIndexOf('%'));
				if (witchDirection(blankCoords, tileCoords) === 2) {
					if (distX < currTransX) {
						distX = currTransX;
					}
					if (distX > currTransX + 100) {
						distX = currTransX + 100;
					}
				}
				if (witchDirection(blankCoords, tileCoords) === 4) {
					if (distX < currTransX - 100) {
						distX = currTransX - 100;
					}
					if (distX > currTransX) {
						distX = currTransX;
					}
				}
				tileNode.style.transform = `translate(${distX}%, ${currTransY}%)`;
			}

			function onMouseUp() {
				gameArea.addEventListener('click', moveTileByClick);
				tileNode.classList.remove('undelay');
				document.removeEventListener('mouseup', onMouseUp);
				document.removeEventListener('mousemove', onMouseMove);
			}
		}

		if (witchDirection(blankCoords, tileCoords) === 1 ||
			witchDirection(blankCoords, tileCoords) === 3) {
			const shiftY = e.clientY - tileNode.getBoundingClientRect().top;
			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);

			const currTransY = +tileNode.style.transform.slice(tileNode.style.transform.indexOf(' '), tileNode.style.transform.lastIndexOf('%'))

			function onMouseMove(e) {
				gameArea.removeEventListener('click', moveTileByClick);
				tileNode.classList.add('undelay');
				let distY = (((e.clientY - shiftY - gameArea.getBoundingClientRect().top)) / tileNode.getBoundingClientRect().height) * 100;
				const currTransX = +tileNode.style.transform.slice(10, tileNode.style.transform.indexOf('%'));
				if (witchDirection(blankCoords, tileCoords) === 3) {
					if (distY < currTransY) {
						distY = currTransY;
					}
					if (distY > currTransY + 100) {
						distY = currTransY + 100;
					}
				}
				if (witchDirection(blankCoords, tileCoords) === 1) {
					if (distY < currTransY - 100) {
						distY = currTransY - 100;
					};
					if (distY > currTransY) {
						distY = currTransY;
					};
				}
				tileNode.style.transform = `translate(${currTransX}%, ${distY}%)`;
			}

			function onMouseUp() {
				gameArea.addEventListener('click', moveTileByClick);
				tileNode.classList.remove('undelay');
				document.removeEventListener('mouseup', onMouseUp);
				document.removeEventListener('mousemove', onMouseMove);
			};
		};
	};

	tileNode.ondragstart = function () {
		return false;
	};

};

function findCoords(number) {
	for (let y = 0; y < currentMatrix.length; y++) {
		for (let x = 0; x < currentMatrix[y].length; x++) {
			if (currentMatrix[y][x] === number) {
				return {
					x,
					y
				};
			};
		};
	};
	return;
};

diffCntrl.addEventListener('click', (e) => {
	let checkedRadio = e.target;
	if (checkedRadio.checked) {
		diff = Number(checkedRadio.value);
		gameArea.innerHTML = '';
		tileArr = [];
		addTiles(diff);
		shuffleTiles();
	} else return;
});

function switchSound() {
	if (turnOff.firstElementChild.checked === true) {
		isAudioOn = true;
	} else isAudioOn = false;
};
turnOff.firstElementChild.addEventListener('change', switchSound);

// function timerToText(seconds) {
// 	let addZero = function (num) {
// 		num = num.toString();
// 		if (num.length === 1) return '0' + num;
// 		return num;
// 	};
// 	let MM = Math.floor(seconds / 60);
// 	let SS = seconds % 60;
// 	return (addZero(MM) + ':' + addZero(SS));
// };

// function timer() {
// 	seconds += 1;
// 	time.innerText = timerToText(seconds);
// 	if (moves === 0) {
// 		seconds = 0;
// 		time.innerText = timerToText(seconds);
// 		return;
// 	};
// 	localStorage.setItem('secondsData', JSON.stringify(timerToText(seconds)));	
// 	setTimeout(timer, 1000);
// };

function timer() {
    let time = 0;
    timerId = setInterval(() => {
      if (!gameArea.getAttribute('data-pause')) {
        time += 1;
        timerBlock.innerText= `TIMER
          ${
            Math.trunc(time / 60) < 10
              ? `0${Math.trunc(time / 60)}`
              : Math.trunc(time / 60)
          }:${time % 60 < 10 ? `0${time % 60}` : time % 60}`;
      }
    }, 1000);
	// console.log(`timerBlock222: ${timerBlock.innerText.slice(6)}`)
	// localStorage.setItem('secondsData', JSON.stringify(time));	
  }
 

function getInversions(arr) {
	let invCount = 0;
	for (let i = 0; i < arr.length; i++) {
		for (let j = i + 1; j < arr.length; j++) {
			if (arr[i] < arr.length && arr[j] < arr.length && arr[i] > arr[j]) {
				invCount++;
			}
		}
	}
	// localStorage.setItem('movesData', JSON.stringify(invCount));
		return invCount;
	
};

function isSolvable(matrix) {
	let invCount = getInversions(matrix.flat());
	if (matrix.length % 2 === 1) {
		return (invCount % 2 === 0);
	}
	if (matrix.length % 2 === 0) {
		for (let i = 0; i < matrix.length; i++) {
			for (let j = 0; j < matrix[i].length; j++) {
				if (matrix[i][j] === matrix.flat().length) {
					return ((invCount + i) % 2 === 1);
				}
			}
		}
	}
}

function showResults(time) {
	panelScores.innerHTML = '';
	
	const movesData = JSON.parse(
		localStorage.getItem(`movesData`),
	);

	const secondsData = JSON.parse(
		localStorage.getItem(`secondsData`),
	);

	const now = new Date().toString();
	const dateData = `${now.slice(8, 10)} ${now.slice(4, 7)} ${now.slice(11, 15)}`;


	if(movesData == null && secondsData == null) {
		panelScores.innerHTML +=
		`<div class="panel-scores-notice">No results yet!</div>`;
	} else {
		panelScores.innerHTML += `
		<div class="panel-scores-notice">Best scores:</div>
		<div class="panel-show-info">
		<div class="panel-show-info-tile">moves: ${movesData}</div>
		<div class="panel-show-info-tile">time: ${secondsData}</div>
		<div class="panel-show-info-tile">date: ${dateData}</div>
</div>`;
	}	
	panelScores.style.display = 'flex';
}


function saveResults() {
	panelSave.innerHTML = '';
	const saveMatrixData = JSON.parse(
		localStorage.getItem(`saveMatrix`),
	);

	panelSave.innerHTML += `
	<div class="panel-save-info">
	<p class="panel-save-info-tile">Saved the following set of cells</p>
	<p class="panel-save-info-tile panel-save-info-tile_change">[${saveMatrixData}]</p>
	<p class="panel-save-info-tile">The saved values are stored until one click on the SHUFFLE AND START  and this WINDOW RELOAD</p>
	</div>`;
	panelSave.style.display = 'flex';
}


//   function timer() {
// 	seconds += 1;
// 	time.innerText = timerToText(seconds);
// 	if (moves === 0) {
// 		seconds = 0;
// 		time.innerText = timerToText(seconds);
// 		return;
// 	};
// 	localStorage.setItem('secondsData', JSON.stringify(timerToText(seconds)));	
// 	setTimeout(timer, 1000);
// };


stopBtn.addEventListener('click', (event) => {
	if (event.target.innerHTML === 'stop') {
		if (gameArea.hasAttribute('data-pause')) {
			gameArea.removeAttribute('data-pause', true);
			gameArea.style.pointerEvents = 'auto';
			stopBtn.style.backgroundColor = 'rgb(121, 132, 132)';
			} else if (!gameArea.hasAttribute('data-pause')) {							
			gameArea.setAttribute('data-pause', true);
			gameArea.style.pointerEvents = 'none';
			stopBtn.style.backgroundColor = 'rgba(121, 132, 132, .2)';
		}
	}
});

saveBtn.addEventListener('click', (event) => {
	if (event.target.innerHTML === 'save') {
		gameArea.setAttribute('data-pause', true);		
		localStorage.setItem('saveMatrix', JSON.stringify(currentMatrix));
		saveResults();

	} else {
		gameArea.removeAttribute('data-pause');
		panelSave.style.display = 'none';
	}
});


resultsBtn.addEventListener('click', (event) => {
	if (event.target.innerHTML === 'results') {
		gameArea.setAttribute('data-pause', true);
		console.log(`resultBtn`)
		showResults();
		// setRecord();
		replace()
	} else {
		gameArea.removeAttribute('data-pause');
		panelScores.style.display = 'none';
	}	
});

panelScores.addEventListener('click', () => {
	panelScores.style.display = 'none';

});

panelSave.addEventListener('click', () => {
	panelSave.style.display = 'none';

});

panelInfo.addEventListener('click', () => {
	panelInfo.style.display = 'none';
});