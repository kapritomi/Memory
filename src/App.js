import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cards] = useState(["Macska", "Kutya", "Ló", "Papagáj", "Béka", "Egér", "Majom", "Kenguru"]);
  const [final, setFinal] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [disableAll, setDisableAll] = useState(false);

  const shuffle = () => {
    let doubledArray = cards.flatMap(value => [value, value]); // Double the array
    let current = doubledArray.length;

    while (current !== 0) {
      let place = Math.floor(Math.random() * current);
      current--;
      [doubledArray[current], doubledArray[place]] = [doubledArray[place], doubledArray[current]];
    }

    return doubledArray;
  }

  const createCards = (updated) => {
    let temp = [];
    for (let i = 0; i < updated.length; i++) {
      temp.push({
        id: i,
        card: updated[i],
        flipped: false,
        matched: false // Add a matched property
      });
    }
    setFinal(temp);
  }

  useEffect(() => {
    const updated = shuffle();
    createCards(updated);
  }, []);

  const flip = (index) => {
    const currentCard = final[index];

    // Prevent flipping if the card is already flipped, matched, or all cards are disabled
    if (currentCard.flipped || currentCard.matched || disableAll) {
      return; // Exit if conditions are met
    }

    const newFlippedCards = [...flippedCards, index];

    // Update the flipped state of the card
    const updatedFinal = final.map((item, idx) => {
      if (idx === index) {
        return { ...item, flipped: true }; // Flip the selected card
      }
      return item;
    });

    setFinal(updatedFinal);
    setFlippedCards(newFlippedCards);

    // Check for flipped cards
    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = final[firstIndex];
      const secondCard = final[secondIndex];

      if (firstCard.card === secondCard.card) {
        // Cards match, mark them as matched
        setTimeout(() => {
        const matchedFinal = updatedFinal.map(item => {
          
          if (item.card === firstCard.card) {
            return { ...item, matched: true }; // Mark matched cards
          }
          return item;
        });
        setFinal(matchedFinal);
        setFlippedCards([]);
      }, 300);
      } else {
        // Cards do not match, reset flipped state for both cards after a brief delay
        setDisableAll(true);
        setTimeout(() => {
          const resetFinal = updatedFinal.map(item => {
            if (newFlippedCards.includes(item.id) && !item.matched) {
              return { ...item, flipped: false }; // Reset flipped state
            }
            return item;
          });
          setFinal(resetFinal);
          setFlippedCards([]);
          setDisableAll(false);
        }, 800); // Delay to show the second card before resetting
      }
    } else if (newFlippedCards.length > 2) {
      // If a third card is flipped before the timeout, reset the previous two
      const resetFinal = updatedFinal.map((item, idx) => {
        if (flippedCards.includes(idx) && !item.matched) {
          return { ...item, flipped: false }; // Reset flipped state
        }
        return item;
      });

      setFinal(resetFinal);
      setFlippedCards([index]);
    }
  }
  

  return (
    <div className='flex items-center justify-center'>
      <div className="grid grid-cols-4 gap-4 p-4">
        {final.map((item, index) => 
          (item.matched ? // Check for matched cards
          <div key={item.id} className="bg-white text-black rounded w-[200px] h-[200px] mobile:w-[50px] mobile:h-[50px] mobile:text-[13px]  text-[44px] flex items-center justify-center"></div> :
          (item.flipped ? 
          <div key={item.id} className="bg-blue-500 text-white rounded w-[200px] h-[200px] mobile:w-[50px] mobile:h-[50px] mobile:text-[13px] text-[44px] flex items-center justify-center" onClick={() => flip(index)}>{item.card}</div> :
          <div key={item.id} className="bg-blue-500 text-white rounded w-[200px] h-[200px] mobile:w-[50px] mobile:h-[50px] mobile:text-[13px]" onClick={() => flip(index)}></div>))
        )}
      </div>
    </div>
  );
}

export default App;
