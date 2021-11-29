import { useState, useEffect, useCallback } from "react"
import ScoreBoard from "./components/ScoreBoard"
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'

const width = 8
const candyColors = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy
]

const  App = () => {
  const [currentColorArrangemnet, setcurrentColorArrangemnet] = useState([])
  const [squareBeingDragged, setsquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setsquareBeingReplaced] = useState(null)
  const [scoreDisplay, setscoreDisplay] = useState(0)

  const checkForColumnOfThree = useCallback(
    () => {
      for(let i = 0; i <= 47; i++) {
        const columnOfThree = [i, i + width, i + width * 2]
        const colorToCheck = currentColorArrangemnet[i]
        const isBlank = currentColorArrangemnet[i] === blank

        if(columnOfThree.every(square => currentColorArrangemnet[square] === colorToCheck && !isBlank)){
          setscoreDisplay((score) => score + 3)
          columnOfThree.forEach(square => currentColorArrangemnet[square] = blank)
          return true
        }
      }
    },
    [currentColorArrangemnet],
  )

  const checkForColumnOfFour = useCallback(
  () => {
    for(let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      const colorToCheck = currentColorArrangemnet[i]
      const isBlank = currentColorArrangemnet[i] === blank

      if(columnOfFour.every(square => currentColorArrangemnet[square] === colorToCheck && !isBlank)){
        setscoreDisplay((score) => score + 4)
        columnOfFour.forEach(square => currentColorArrangemnet[square] = blank)
        return true
      }
    }
  },
  [currentColorArrangemnet]
  )

  const checkForRowOfThree = useCallback(
  () => {
    for(let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2]
      const colorToCheck = currentColorArrangemnet[i]
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
      const isBlank = currentColorArrangemnet[i] === blank

      if(notValid.includes(i)) continue

      if(rowOfThree.every(square => currentColorArrangemnet[square] === colorToCheck && !isBlank)){
        setscoreDisplay((score) => score + 3)
        rowOfThree.forEach(square => currentColorArrangemnet[square] = blank)
        return true
      }
    }
  },
  [currentColorArrangemnet]
  )

  const checkForRowOfFour = useCallback(
  () => {
    for(let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      const colorToCheck = currentColorArrangemnet[i]
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
      const isBlank = currentColorArrangemnet[i] === blank

      if(notValid.includes(i)) continue

      if(rowOfFour.every(square => currentColorArrangemnet[square] === colorToCheck && !isBlank)){
        setscoreDisplay((score) => score + 4)
        rowOfFour.forEach(square => currentColorArrangemnet[square] = blank)
        return true
      }
    }
  },
  [currentColorArrangemnet]
  )

  console.log(scoreDisplay)

  const moveIntoSquareBelow = useCallback(
  () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if(isFirstRow && currentColorArrangemnet[i] === blank){
        let randomNum = Math.floor(Math.random() * candyColors.length)
        currentColorArrangemnet[i] = candyColors[randomNum]
      }

      if(currentColorArrangemnet[i + width] === blank){
        currentColorArrangemnet[i + width] = currentColorArrangemnet[i]
        currentColorArrangemnet[i] = blank
      }
    }
  },
  [currentColorArrangemnet]
  )

  const dragStart = (e) => {
    setsquareBeingDragged(e.target)
  }

  const dragDrop = (e) => {
    setsquareBeingReplaced(e.target)
  }

  const dragEnd = (e) => {
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))

    currentColorArrangemnet[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
    currentColorArrangemnet[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

    const validMoves = [
      squareBeingDraggedId - 1, 
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1, 
      squareBeingDraggedId + width
    ]
    
    const validMove = validMoves.includes(squareBeingReplacedId)

    const isAColumnOfFour = checkForColumnOfFour()
    const isAColumnOfThree = checkForColumnOfThree()
    const isARowOfFour = checkForRowOfFour()
    const isARowOfThree = checkForRowOfThree()

    if(squareBeingReplacedId && validMove && (isAColumnOfFour || isAColumnOfThree || isARowOfFour || isARowOfThree)){
      setsquareBeingDragged(null)
      setsquareBeingReplaced(null)
    } else {
      currentColorArrangemnet[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
      currentColorArrangemnet[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
      setcurrentColorArrangemnet([...currentColorArrangemnet])
    }
  }

  const createBoard = () => {
    const randomColorArrangement = []
    for (let i = 0; i < width * width; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
      randomColorArrangement.push(randomColor)
    }
    setcurrentColorArrangemnet(randomColorArrangement)
  }

  useEffect(() => {
    createBoard()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour()
      checkForColumnOfThree();
      checkForRowOfThree()
      moveIntoSquareBelow()
      setcurrentColorArrangemnet([...currentColorArrangemnet])
    }, 100)
    return () => clearInterval(timer)
  }, [moveIntoSquareBelow, checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, currentColorArrangemnet])

  
  return (
    <div className="app">
      <div className="game">
        {currentColorArrangemnet.map((candyColor, index) => (
          <img 
            key={index} 
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay}/>
    </div>
  );
}

export default App;
