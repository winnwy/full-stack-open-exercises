import { useState } from 'react'

const AnecdoteDisplay = ({anecdotes, votes, selected}) => {
  return <>
    <p>{anecdotes[selected]}</p>
    <p>has {votes[selected]} votes</p>
  </>

}

const App = () => {
 const indexOfMax = (arr) => {
    if (arr.length === 0) return -1;
    
    let max = arr[0];
    let maxIndex = 0;
    
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    
    return maxIndex;
}

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max)
  }
  const onClickHandler = ()=> {
    setSelected(getRandomInt(anecdotes.length))
  }
  const votesHandler = ()=> {
    const updatedVotes = [...votes];
    updatedVotes[selected] += 1;
    setVotes(updatedVotes);
  }


  return (
    <div>
      <h1>Anecdote of the day</h1>
      <AnecdoteDisplay anecdotes={anecdotes} votes={votes} selected={selected}/>
      <button onClick={votesHandler}>vote</button> {""}
      <button onClick={onClickHandler}>next anecdote</button>

      {/* displays the anecdote with the largest number of votes */}
      <h1>Anecdote with most votes</h1>
      <AnecdoteDisplay anecdotes={anecdotes} votes={votes} selected={indexOfMax(votes)}/>
    </div>
  )
}

export default App