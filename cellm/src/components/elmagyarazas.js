/*
here what is the difference between setCells(cs) and setCells([...cs])

 const startGame = ()=> {
        const checkDuplications = [];
        const cs = [];

        for(let i = 0; i < dimensions; i++) 
            cs.push(false);

        while(checkDuplications.length < Math.sqrt(dimensions)) {
            const randIndex  = rNumber(0, dimensions - 1);

            if(!checkDuplications.includes(randIndex)) {
                checkDuplications.push(randIndex);
                cs[randIndex] = true;
            }
        }

        setCells([...cs]);
    }


The difference between setCells(cs) and setCells([...cs]) lies in how the state update function setCells is called, 
and it primarily affects how React detects changes and re-renders components.

setCells(cs):
This directly passes the reference to the cs array to the setCells function.
If the cs array has not been modified since the last state update, React might not trigger a re-render because 
it performs a shallow comparison and sees that the reference to cs has not changed.

setCells([...cs]):
This creates a new array with the same elements as cs using the spread operator [...].
Since this creates a new array object, the reference to the array is different from the original cs.
React will detect that the state has changed because the new array has a different reference, thus triggering a re-render.

Why setCells([...cs]) is Often Preferred:
Ensuring State Change Detection: By creating a new array, you ensure that React's state change detection mechanism is triggered. 
React uses shallow comparison to check if the state has changed, so a new reference will guarantee that the state is considered updated.
Immutable Updates: Using [...cs] adheres to the principle of immutability in React state management. It avoids directly mutating the state and instead creates a new state based on the old state.
*/
const startGame = () => {
    let cs = [false, false, false];
    cs[1] = true;

    // With setCells(cs), React might not detect the change
    setCells(cs); // React might not re-render if cs was previously [false, true, false]

    // With setCells([...cs]), React will detect the change
    setCells([...cs]); // React will re-render because a new array is created
}

/*
In this example, setCells(cs) may fail to trigger a re-render if cs is the same array reference as the previous state. 
On the other hand, setCells([...cs]) will always trigger a re-render because a new array is created even if the content of the array 
hasn't changed.
*/