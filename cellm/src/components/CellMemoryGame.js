import { useEffect } from "react";

function CellMemoryGame() {
    const [dimensions, setDimensions] = useState(4);
    const [cells, setCells] = useState([]);
    const [points, setPoints] = useState(0);
    const [disableCells, setDisableCells] = useState(true);
    const [hitCounter, setHitCounter] = useState(0);
    const [disableStart, setDisableStart] = useState(true);

    const rNumber = (to, from) => Math.floor(Math.random * ((to - from) + 1) + from);

    const generateCells = () => {
        const cs = [];

        for (let i = 0; i < dimensions; i++) {
            cs.push({
                selected: false,
                highlighted: false,
                userSelected: ""
            });
        }

        setCells(cs);
    }

    const startGame = () => {
        const checkDuplications = [];
        const cs = [...cells];
        setDisableStart(true);

        while (checkDuplications.length < Math.sqrt(dimensions)) {
            const randIndex = rNumber(0, dimensions - 1);

            if (!checkDuplications.includes(randIndex)) {
                checkDuplications.push(randIndex);
                cs[randIndex].highlighted = true;
            }
        }

        setCells([...cs]);

        cs = [];

        setTimeout(() => {
            for (let i = 0; i < dimensions; i++)
                cs[i].highlighted = false;
            setCells(cs);
            setDisableCells(false);
        }, 3000);
    }

    useEffect(() => {
        generateCells();
    }, []);

    const cellClick = (i) => {
        //console.log(cells[i]);
        if (disableCells) {
            alert("Please wait until the cell disappears!");
            return;
        }

        const cs = [...cells];

        if (cells[i].selected) {
            setPoints(p => ++p);
            cs[i].userSelected = "selected-well"
            setCells([...cs]);
        } else {
            cs[i].userSelected = "selected-wrong";
            setDisableCells(true);
            setHitCounter(0);

            setTimeout(() => {
                generateCells();
                setDisableStart(false); 
            }, 1000);
        }
    }

    useEffect(() => {
        if (hitCounter === Math.sqrt(dimensions)) {
            setDisableCells(true);

            setTimeout(() => {
                setDimensions(Math.sqrt(dimensions) + 1) ** 2;
                setHitCounter(0);
                setDisableStart(false);
            }, 1000);
        }
    }, [hitCounter]);

    useEffect(()=> {
        if(cells.length === 0)
            return;
            
            generateCells();
            startGame();
    }, [dimensions]);

    return (
        <div className="container-md text-center p-lg box-secondary-lighter">
            <h1>Cell Memory</h1>
            <h2>Points: {points}</h2>

           <div className={(`grid-col-${Math.sqrt(dimensions)} grid-row-${Math.sqrt(dimensions)} `) + "maxw-500 height-500 margin-x-auto"}>
                {
                    cells.map((c, i) => 
                        <div key={i} style={c.highlighted ? {animationName: "highlight-cell", animationDuration: "3s"} : {}}
                            onClick={() => cellClick(i)}
                            className={"box-light-grey table-border cursor-pointer " + c.userSelected}></div>
                    )
                }
            </div>

            {
                disableStart && <button className="input-md btn-primary center-input"
                onClick={startGame}>Start!</button>
            }
        </div>
    );
}

export default CellMemoryGame;

/*
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

Generálunk annyi false értéket, ahány dimensions van 
-> 
for(let i = 0; i < dimensions; i++) 
    cs.push(false);

Itt pedig véletlenszerűen generálunk index-eket -> const randIndex  = rNumber(0, dimensions - 1);
Amilyen index-et létrehoztunk, mint random számot annál true lesz ez az érték
-> 
cs[randIndex] = true;
Tehát itt mindig kiválasztunk annyi véletlen index-et, ami négyzetgyöke a dimensions-nak 
->
while(checkDuplications.length < Math.sqrt(dimensions)
*****
<div key={i} style={highlighted ? {animationName:"highlight-cell", animationDuration: "3s"} : {}}

Az a baj, hogy ez a style attributum, ez rajta marad a div-en, akkor is ha új játékot generálunk a button-vel 
Nem törlödik le valamiért, 3s-ig felvillan, de mivel, hogy nem törlödik le, ezért ha megnyomjuk a button-t, akkor a cell-eket be kell állítani 
Kell három másodpercet várni és utána legyenek a cell-ek, mind false!!!!! ezt a startGame függvényben csináljuk miután, beletettük a 
a true-kat randIndex alapján a cs-be!!!! 
és azért, mert nem lesz highlighted, ezért nem fogja megkapni a ezt -> style={highlighted ? {animationName:"highlight-cell", animationDuration: "3s"} : {}}

a cs nem const lesz felül hanem let cs = [];
és itt a setTimeout felett csinálunk egy újabb üres tömböt, amiben, már nem lesznek benne a true, meg a false értékek 

cs = [];

setTimeout(()=> {
    for(let i = 0; i < dimensions; i++) {
        cs.push(false)
    }
    setCells(cs);
}, 3000);

És így már nem lesznek style attributumok a div-en!!!!! 
Visszaállítottuk az összes cell értéket false-ra és emiatt eltünnek a style attributumok és ha rányomunk a button-re, 
akkor újra fel tudnak villani
******
Most kellene egy olyannak történnie, hogy megmondjuk, hogy melyik volt (villant fel) és melyik nem!!!! 
És ezzel meg az lesz a probléma, hogy most mindent visszaállítunk false-ra, tehát akkor nem tudjuk, hogy milyen index-ek voltak 
amik true-k voltak és emiatt villantak fel a style attributumban lévő animation miatt!!
->
Tudni kéne, hogy milyen index-ek villantak fel 
A generateCells-be most csak egy false értéket push-olunk bele, amivel majd set-eljük a cells useStates-s változónkat 
De ezek most nem csak true false értékek lesznek hanem csinálunk egy objektumot!!!! 

Ennek az objektumnak lesz egy selected illetve egy highlight kulcsa!! 
1. selected, az hogy ki van-e választva 
2. highlight padig az, hogy felvillanjon-e 

Rögtön, ahol legeneráltuk a cell-eket, tehát a generateCells függvényben 
->
    const generateCells = ()=> {
        const cs = [];

        for(let i = 0; i < dimensions; i++) {
            cs.push({
                selected: false,
                highlighted: false
            });
        }

        setCells(cs);
    }

És a startGame függvényben a generateCells, ami az elején lefut, mert meg van hívva egy useEffect-ben
Tehát, annyit fogunk ott generálni, amennyit szükséges 
a cs az nem egy üres tömb lesz, hanem a cell-nek az értékei, tehát spread operator cell 
let cs = [];
-> 
let cs = [...cell];

A while-ban, ahol eddig, csak annyi volt, hogy cs[randIndex] = true, át kell írni, mert a cs megkapta a [...cell]-t, ahol már egy objektum van
nem csak egy false mint az elöbb 
-> 
cs[findIndex].highlighted = true;

és ahol a setTimeout-ban eddig csak a cs.push-oltunk minden elemnek egy false-t 
    cs = [];

    setTimeout(() => {
        for (let i = 0; i < dimensions; i++) {
            cs.push(false)
        }
        setCells(cs);
    }, 3000);

a cs.push helyett, mivel megváltozott a cs-nek a szerkezete, ezért 
-> 
cs[i].highlighted = false;
ezért a cs minden elemnek a highlighted kulcsát frissítjük azzal, hogy false
cs = []; meg nem is kell felé!!!! 

És ami nagyon fontos, hogy a return-ben is meg kell változtatni, mert eddig volt a cells amin végigmentünk egy map-val 
eddig egy tömb volt ez amiben voltak false értékek, meg true-k is bizonyos index-eken, mikor a cs[findIndex] = true;-ra állítottuk 
most a cells egy tömb, amiben objektumok vannak és a highlighted kulcs kell nekünk, ahol ugyanígy vannak true és false értékek
akkor szeretnénk, hogy a div amit legenerálunk a cells.map-val megkapja az animationt, amitől felvillan, amikor a highlighted értéke true!!! 

változtatások 
- nem egy highlighted-ot kap meg hanem egy c (de ez mondjuk nem változtat semmi-n)
- és a c.highlighted, ha ez true, akkor kapja meg az animation-t, de lehetett volna úgy, highlighted-ot kap meg és highlighted.highlighted 
    az true, akkor kapja meg az animation-t, de ez így jobb

cells.map((highlighted, i) =>
    <div key={i} style={highlighted ? { animationName: "highlight-cell", animationDuration: "3s" } : {}}
->
cells.map((c, i) =>
    <div key={i} style={c.highlighted ? { animationName: "highlight-cell", animationDuration: "3s" } : {}}

és amikor átálítjuk a highlighted-ot true-ra a while-ban, akkor a selected kulcsot is át kell állítani true-ra!!!! 
cs[randIndex].selected = true;

-> 
    const startGame = () => {
        const checkDuplications = [];
        const cs = [...cells];

        while (checkDuplications.length < Math.sqrt(dimensions)) {
            const randIndex = rNumber(0, dimensions - 1);

            if (!checkDuplications.includes(randIndex)) {
                checkDuplications.push(randIndex);
                cs[randIndex].highlighted = true;
                cs[randIndex].selected = true;
            }
        }

        setCells([...cs]);

        cs = [];

        setTimeout(() => {
            for (let i = 0; i < dimensions; i++) {
                cs[i].highlighted = false;
            }
            setCells(cs);
        }, 3000);
    }

És amikor a highlighted-ot false-ra állítjuk itt a timeout-ban, akkor is tudjuk, hogy melyik volt kiválasztva, mert a selected kulcsát 
azt nem állítjuk vissza false-ra, hanem az true marad és majd csak, akkor lesz false ha újrender a komponens és megkapja az alapértékét 
a cells-nek, ahol mindkettő false alapból!!
*******
És létrehozunk egy clickCell-t függvényt, ami kérni fog egy index-et!!!! 
amit majd meghívunk a return-ben a map-ban ott a div-nek amiket legeneráltunk adunk egy onClick-et és meghívjuk a clickCell-t és megadjuk 
neki az index-et (ami jön a map-ból) és akkor tudjuk, hogy melyik index-űre kattintottunk rá 
->
const cellClick = (i)=> {
    console.log(cells[i]);
    itt visszakapjuk, ha rákattintottunk egy cell-re {selected: true, highlighted: false} vagy {selected: false, highlighted: false}
    attól függően, hogy arra kattintottunk rá, ami felvillan-t, mert ott a selected: true vagy arra ami nem selected: false
}
-> 
cells.map((c, i) =>
    <div key={i} style={c.highlighted ? { animationName: "highlight-cell", animationDuration: "3s" } : {}}
    onClick={()=>cellClick(i)}

és akkor el kell találni, annyit amennyi a Math.sqrt(dimensions); mert ennyi villant fel 

Nem csak egy i-t kell, hogy visszakapjunk hanem az elemet is -> e.target 
onClick={(e)=>cellClick(i, e.target)}
const cellClick = (i, target)=> {... 
és ilyenkor a függvényben ha a cells[i].selected (tehát ha ez az érték true, akkor tudjuk, hogy ez villant fel, ezt kellett kitalálni)
ebben az esetben a target-nek (amit bekért, tehát a div), adunk style-val egy zöld backgroundColor-t!!!!
ha meg nem true a selected, akkor meg egy red-et 
-> 
const cellClick = (i, target)=> {
    if(cells[i].selected) {
    tehát amire rákattintunk cell (indexedik), annak a selected-je true, akkor a target-nek, tehát az egész elemnek adunk egy backgroundColor-t
        target.style.backgroundColor = "green"; ha jó, akkor adunk neki egy zöld háttérszínt 
    } else {
        target.style.backgroundColor = "red"; ha nem, akkor meg egy red-et 
    }
}
Ha arra kattintunk, ami felvillant, akkor kap egy zöld háttérszínt, ha meg arra, ami nem, akkor meg egy pirosat
*******
Ha eltaláltuk, akkor a pontokat kell majd növelni egyel
Létrehozunk egy points useState-s változót -> const [points, setPoints] = useState(0);
-> 
if(cells[i].selected) {
    target.style.backgroundColor = "green";
    setPoints(p=>++p); 

A pontokat meg kiírjuk a return-ben -> <h2>Points: {points}</h2>
nem kell csinálni egy valamilyen grid-es div-et, amiben lesz ugyanannyi box, mert most csak a points-okat írjuk ki és nem lesz pl. error 
*****
Most az a probléma, hogy amikor még nem fejeződött be az animation, akkor is rá lehet kattintani és azt akarjuk, hogy lemenjen az animáció 
és csak utána lehessen rákattintani a mezőkre (cell-ekre)
Erre létrehozunk egy disableCells useState-s változót, aminek a kezdőértéke true!!
->
const [disableCells, setDisableCells] = useState(true);

1.
A cellClick-ben pedig csinálunk egy feltételt az elejére, hogyha a disableCells az true, akkor return!!!

    const cellClick = (i, target)=> {
        //console.log(cells[i]);
        if(disableCells) {
            alert("Please wait until the cell disappears!");
            return;
        }

2.
És akkor nem lehet rákattintani csak akkor, amikor a setTimeout-val vártunk 3s-t, mert ennyi a animationDuration és azután 
állítjuk vissza a highlighted-ot false, hogy ne legyen animation!!!
itt adjuk meg, hogy setDisableCells(false);
mert ha lement az animation, akkor már kattinthatunk

        setTimeout(() => {
            for (let i = 0; i < dimensions; i++) 
                cs[i].highlighted = false;
            setCells(cs);
            setDisableCells(false);
        }, 3000);
*********
És ha eltaláljuk az összeset, amennyi a Math.sqrt(dimensions) vagyis annyit kattintottunk, ezt is kell majd számolni, mert annyit 
szabad majd kattintani, ahányat ki lehet majd találni (ahány felvillant) -> Math.sqrt(dimensions);
és erre létrehozunk egy hitCounter useState-s változót!!!! 
const [hitCounter, setHitCounter] = useState(0);

Növeltük a hitCounter értékét és létrehozunk egy useEffect-et a hitCounter-re, mert mindig csak a korábbi értéket látnánk!!!! 
és ha a hitCounter értéke egyenlő a Math.sqrt(dimensions)-val, akkor nem tudunk többet tippelni és legeneráljuk a következő 
játékteret, ahol már egyel több sor illetve oszlop lesz!!! 

Mivel a dimensions-ban a tényleges cellaszámot írtuk 
const [dimensions, setDimensions] = useState(4);
nem annyit, hogy kettő, mert akkor ezt lehetne egyel növelni és dimensions helyett dimensions * dimensions lenne megadva sok helyen!!! 
ezért azt csináljuk, hogy a (Math.sqrt(dimensions)+1) ** 2, tehát a dimensions-nak a gyökét, plusz 1 növeljük a négyzetével 
-> ha a dimension 4 -> 2 + 1 -> 9
Useeffect(()=> {
    if(hitCounter === Math.sqrt(dimensions)) {
        setDimensions(Math.sqrt(dimensions) + 1) ** 2;
    }    
}, [hitCounter]);
és mivel itt generáltunk egy új játeékteret az összes selected-et meg highlighted-ot false-ra állítjuk ez egy új startGame lesz!!! 
Meg kell itt ebben a useEffect-ben hívni a startGame-et ha a dimension az növekedett egyel

Ezzez szükséges megint egy useEffect, ahol viszont a dimensions-ra reagálunk és ebben meghívjuk a startGame-et!!!! 
useEffect(()=> {
    startGame();
}, [dimensions]);
Amikor a dimensions növekszik egyel akkor meghívjuk a startGame-t, de itt az a baj, hogy elöszöri betöltésnél is meg fog hívodni, amikor
még a cells-ben nincsen semmi!!!!! 
-> 
const [cells, setCells] = useState([]);
mert még a generateCells-vel nem generáltuk le a dolgokat!!! 
tehát csak, akkor szeretnénk, hogy meghívodjon, hogyha a cells.length > 0, tehát van már benne valami!!!!!!!!!!!!!!!!!!!!!!!
useEffect(()=> {
    if(cells.length > 0)
        startGame();
}, [dimensions]);

vagy lehet itt más feltétel is, hogyha a cells.length === 0-val, akkor return és csak utána hívjuk meg a startGame-t  
-> 
useEffect(()=> {
    if(cells.length === 0)
        return;

        startGame();
}, [dimensions]);
és itt még meg is kell hívni a generateCells függvényt is!!!! 
-> 
    useEffect(()=> {
        if(cells.length === 0)
            return;
            
            generateCells();
            startGame();
    }, [dimensions]);

És csak utána lehet a startGame()-et meghívni vagy különben nem lesz annyi cell, amennyire szükségünk lenne!!! 
Tehát a dimension értéke növekedni fog attól függően, hogy mennyi a hitCounter értéke, mert ha annyit kattintottunk, mint amennyi a max
szeretnénk, akkor a dimension-t növeljük egyel setDimensions(Math.sqrt(dimensions) + 1) ** 2;
és ennek a változására kell meghívni a generateCells-et, ami a dimensions useState-s értéke alapján generál majd cells-eket!!!! 
**************
Két probléma van még
1. 
Jelenleg csinált egy 9 mezőt, de grid-col-2-ben, mert az van megadva 
<div className="grid-col-2 grid-row-2 maxw-500 height-500 margin-x-auto">
    {
        cells.map((c, i) =>
tehát bármennyi a cells értéke grid-col-2 lesz 
2. 
Amit megadtunk a cellClick-ben, hogy milyen legyen a háttérszíne amire rákattintottunk, ez ott marad, amikor generáljuk le az új táblát 
if (cells[i].selected) {
    target.style.backgroundColor = "green";

tehét ezt is a return-ben kell majd megoldani valahogy!!! 
1. 
Létrehozunk egy grid-es useState-s változtót 
    const [grid, setGrid] = useState({
        col:"grid-col-2",
        row:"grid-row-2"
    });

és ezt behelyetesítjük a return-ben a div-hez, ahol meg van adva a grid-rendszer
<div className={(`${grid.col} ${grid.row} `) + "maxw-500 height-500 margin-x-auto"}>

És ami itt fontos, amikor beállítjuk a dimension-t, tehét a useEffect, ami a dimensions-nak az értékére fog reagálni 
itt set-eljük a grid-et 
setGrid({
    col: "grid-col-" + Math.sqrt(dimensions),
    row: "grid-row-" + Math.sqrt(dimensions)
})
Mindig ugyanannyi a col meg a row szóval nem lett volna muszály ezt külön csinálni, hogy objektum és row meg col kulcsokkal 
Meg ezt meg lehet adni egyből a return-be a div-nek így is és akkor nem kell, hogy itt a dimensions-önös useEffect-ben ez 
->
<div className={(`grid-col-${Math.sqrt(dimensions)} grid-row-${Math.sqrt(dimensions)} `) + "maxw-500 height-500 margin-x-auto"}>

és akkor az egész grid useState-s sem kell, mert mindig itt a dimensions-nek a gyöke kell majd a grid-col meg row értékként!!!! 
*** 
Meg ami fontos, hogy a hitCounter-t is le kell majd nullázni miután set-eltük a dimensions-t 
->
    useEffect(() => {
        if (hitCounter === Math.sqrt(dimensions)) {
            setDimensions(Math.sqrt(dimensions) + 1) ** 2;
            setHitCounter(0);
        }
    }, [hitCounter]);
***
2. 
Már csak annyi a dolgunk, hogy az összes cell-ről leszedjük ezt a style attributumot!!!

****
Azt kell csinálni, hogy ez a highlighted -> c.highlighted aminek meg van adva az animation és ez egy objektum lesz, ami változni fog itt 
animationName: "highlight-cell", animationDuration: "3s"} : {}
Vagyis nem a highlighted lesz hanem csinálunk egy külön objektumot erre 
Igazából csak azt kéne, hogy leszedjük a style attributumot, csak ha most így felrakjuk a style attributumot, akkor nem tudunk hozzáférni 
mi alapján a cell-hez és ezért nem is tudjuk levenni a style attributumot!! 
-> 
Ezt úgy kell majd feltenni, hogy majd utána le is lehessen venni, viszont itt a style attributumot már arra használjuk, hogy az animation-t 
felrakjuk rá 
Itt az a nehezség, hogy nincs mi alapján eltüntetni ezt 
    const cellClick = (i, target) => {
    ******
        if (cells[i].selected) {
            target.style.backgroundColor = "green";
            setPoints(p => ++p);
        } else {
            target.style.backgroundColor = "red";
        }
    }
Mert, hogy ezt ilyen formában, hogy cellClick, target, target.style ez így biztosan nem fog müködni 
de viszont ha adunk neki egy class-t, hogy userSelected az már jó lehet 
-> 
kell egy userSelected kulcs a cell-nél és a userSelected lesz egy osztály attól függően, hogy a user jól választotta-e ki vagy sem!!
-> 
for (let i = 0; i < dimensions; i++) {
    cs.push({
        selected: false,
        highlighted: false,
        userSelected: ""
    });
Alapból a userSelected egy üres string és ide meg hozzá tudjuk majd füzni a userSelected-et, mivel egy üres string!!! 
className="box-light-grey table-border cursor-pointer"></div>
->
className={"box-light-grey table-border cursor-pointer " + c.userSelected}></div>
és a cellClick-nél nem is kell ilyenkor, hogy megkapjuk a target-et, csak az index-et 
onClick={() => cellClick(i)}

    const cellClick = (i) => {
        if (disableCells) {
            alert("Please wait until the cell disappears!");
            return;
        }

        const cs = [...cells];

        setHitCounter(hc=>++hc);

        if (cells[i].selected) {
            setPoints(p => ++p);
            cs[i].userSelected = "selected-well"
        } else {
            cs[i].userSelected = "selected-wrong"
        }

        setCells([...cs])
    }


Tehát csak egy i-t vár és csináltunk egy cs-t amiben kibontottuk az elemét a cells-nek (hogy majd hozzáférjünk a userSelected-hez)
és ott, ahol a selected true ott majd annak az indexűnek adunk egy selected-well osztályt, ha false, akkor meg egy selected-wrong-ot 
A végén meg set-eljük a változtatásokat -> setCells([...cs])

fontos az !important, hogy biztos felülírjon mindent!! class-ok ->
.selected-well {
    background-color: map-get($colors, "success")!important;
}

.selected-wrong {
    background-color: map-get($colors, "danger")!important;
}

Jó csak egy ki ideig várni kell még, mert az utolsónál nem mutatja, hogy jó-e vagy sem, hanem rögtön legenerálja a nagyobb táblát 
és ezt a hitCounter-es useEffect-ben kell majd megoldani, mert ott van az, hogyha egyenlő a hitCounter a Math.sqrt(dimensions)-val 
akkor csinálja meg az új táblát, tehát ezt kell majd késlelteni 1ms-vel 
setDimensions(Math.sqrt(dimensions) + 1) ** 2;
setHitCounter(0);
és amig várunk 1ms-t, addig le is kell tiltani, nehogy megnyomjuk a button-t!!! 
-> 
    useEffect(() => {
        if (hitCounter === Math.sqrt(dimensions)) {
            setDisableCells(true);

            setTimeout(() => {
                setDimensions(Math.sqrt(dimensions) + 1) ** 2;
                setHitCounter(0);
            }, 1000);
        }
    }, [hitCounter]);

és a disableCells-et nem kell visszaállítani false-ra az majd a startGame-nél újra false lesz ha megnyomjuk a gombot!!!!!! 

Ha rosszra kattint, akkor meg legeneráljuk újra a cell-eket és lenullázuk a hitCounter-t 
->
            cs[i].userSelected = "selected-well"
        } else {
            cs[i].userSelected = "selected-wrong"
            setHitCounter(0);
            generateCells();
        }

    setCells([...cs]); 
    ..
de a setCells-nek csak abban az esetben kell megtörténnie, hogy jó-ra kattintott 
-> 
            cs[i].userSelected = "selected-well"
            setCells([...cs]); 
        } else {
            cs[i].userSelected = "selected-wrong"
            setHitCounter(0);
            generateCells();
        }
és legenerált egy újat, de úgy, hogy nem mutatta, hogy rosszra kattintott, megint az időtényező a fontos, ezért csinálunk egy setTimeout-ot 
            cs[i].userSelected = "selected-well"
            setCells([...cs]);
        } else {
            cs[i].userSelected = "selected-wrong";
            setDisableCells(true);
            setHitCounter(0);

            setTimeout(() => {
                generateCells(); 
            }, 1000);
        }
    }
**********
Meg a start-ot is le kell majd tiltani a button-t 
és ez nem is a disableCells-től kell, hogy fügjön 
->
const [disableStart, setDisableStart] = useState(false);
És ha megnyomjuk a start-ot, akkor true-ra állítjuk!!
->  
const startGame = () => {
    const checkDuplications = [];
    const cs = [...cells];
    setDisableStart(true);

Ezt meg kell adni a button-nek is egy disabled attributummal 
->
<button className="input-md btn-primary center-input"
onClick={startGame} disabled={disableStart}>Start!</button>
és amikor változik a hitCounter, tehát új játékot akarunk és megvártuk az 1ms-t, akkor visszaállítjuk false-ra 
-> 
setTimeout(() => {
    setDimensions(Math.sqrt(dimensions) + 1) ** 2;
    setHitCounter(0);
    setDisableStart(false);
vagy ott tudjuk még amikor a cellClick-nél vártunk 1ms-t 
->
const cellClick = (i) => {
....
setTimeout(() => {
    generateCells();
    setDisableStart(false); 

És amikor elkezdődött a játék, rányomtunk a start-ra, akkor hiába nyomunk rá mégegyszer, nem fog újat generálni!! 
-> 
és a button-nél nem a disabled atributumot fogjuk használni, hanem ha true az disabledStart, akkor legyen csak ott a gomb 
ebből
-> 
<button className="input-md btn-primary center-input"
onClick={startGame} disabled={disableStart}>Start!</button>
ez lesz 
->
{
    !disableStart && <button className="input-md btn-primary center-input"
    onClick={startGame}>Start!</button>
}
fontos, hogy a disabledStart-ot tagadni kell, mert false-val kezdünk és akkor mutatjuk meg, ha ez true 


*/
