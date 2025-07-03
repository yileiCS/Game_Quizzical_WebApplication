export const getRandomTriviaLocal = async function() {
    console.log("Trying local fetch...");
    return fetch("utilities/localtrivia.json")
    .then(resp => resp.json())
    .then(data => {
        let index = Math.floor(Math.random() * data.length);
        return data[index];
    })
} 

export const getRandomMathLocal = async function() {
    console.log("Trying local fetch...");
    return fetch("utilities/localmath.json")
    .then(resp => resp.json())
    .then(data => {
        let index = Math.floor(Math.random() * data.length);
        return data[index];
    })
}