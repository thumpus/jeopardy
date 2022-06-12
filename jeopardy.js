// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
const gameContainer = document.getElementById("gameContainer");
gameContainer.addEventListener("click", handleClick);
const newGameButton = document.getElementById("startButton");
newGameButton.addEventListener("click", setupAndStart)



/** Get 6 random categories from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    const response = await axios.get(`http://jservice.io/api/categories?count=100`);
    let categoryIds = Array.from(response.data).map(function(value){
        return value.id;
    })
    let categoryIdsToUse = [];
    for (let i = 0; i <= 5; i++){
        let id = categoryIds[Math.floor(Math.random()*100)]
        if (categoryIdsToUse.includes(id)){
            i--; 
        } else {
            categoryIdsToUse.push(id);
        }
    }
    return categoryIdsToUse;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    const response = await axios.get(`http://jservice.io/api/category?id=${catId}`);
    let clueArray = [];
    let clueArray2 = [];
    for (let i = 0; i < 5; i++){
        let clue = response.data.clues[Math.floor(Math.random()*response.data.clues_count)]
        if (clueArray2.includes(clue)){ 
            i--;
        } else {
        clueArray.push({question: clue.question, answer: clue.answer});
        clueArray2.push(clue);
        }
    }
    let catArray = {
        title: response.data.title,
        clues: clueArray 
    };
    categories.push(catArray)
    if (categories.length === 6){
        fillTable();
    }
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/ 5 <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */


function fillTable() {
    //lol this is the ugliest code on earth. probably a smarter way to do this
    gameContainer.innerHTML = (`<table><thead>
    <tr> <td class = "cat">${categories[0].title}</td><td class = "cat">${categories[1].title}</td>
    <td class = "cat">${categories[2].title}</td><td class = "cat">${categories[3].title}</td>
    <td class = "cat">${categories[4].title}</td><td class = "cat">${categories[5].title}</td></tr>
    </thead><tbody>
    <tr><td id="00">?</td><td id="10">?</td><td id="20">?</td><td id="30">?</td><td id="40">?</td><td id="50">?</td></tr>
    <tr><td id="01">?</td><td id="11">?</td><td id="21">?</td><td id="31">?</td><td id="41">?</td><td id="51">?</td></tr>
    <tr><td id="02">?</td><td id="12">?</td><td id="22">?</td><td id="32">?</td><td id="42">?</td><td id="52">?</td></tr>
    <tr><td id="03">?</td><td id="13">?</td><td id="23">?</td><td id="33">?</td><td id="43">?</td><td id="53">?</td></tr>
    <tr><td id="04">?</td><td id="14">?</td><td id="24">?</td><td id="34">?</td><td id="44">?</td><td id="54">?</td></tr>
    </tbody>
    </table>`)
}


/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
   let cat = evt.target.id[0];
   let q = evt.target.id[1];
   if (evt.target.innerText == "?"){ 
    evt.target.innerHTML = categories[cat].clues[q].question;
   } else if (evt.target.innerText == categories[cat].clues[q].question){ 
    evt.target.innerHTML = categories[cat].clues[q].answer;
   } else {
       evt.target.innerHTML = categories[cat].clues[q].answer;
   }
}


/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    gameContainer.innerHTML = "<h2>Loading...</h2>"
    categories = [];
    let catIds = await getCategoryIds();
    catIds.forEach((val) => {getCategory(val)})
}