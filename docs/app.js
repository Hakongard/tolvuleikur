// Hákon Garðarsson
// 7.jan.2021


// tengi síðunar saman
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// geri canvasinn á allan skjáinn
canvas.width = innerWidth;
canvas.height = innerHeight;

// tengi stigin frá html með að nota ID
const stig1El = document.querySelector('#stig1');
const stortStig1El = document.querySelector('#stortStig1');

const stig2El = document.querySelector('#stig2');
const stortStig2El = document.querySelector('#stortStig2');


// tengi þetta svo hægt sé að hafa UI
const byrjaleik = document.querySelector('#byrjaleik');
const kassi = document.querySelector('#kassi');


// bý til x og y hnit fyrir boltan þetta eru byrjunarhnit
let bolti_x = canvas.width / 2;
let bolti_y = canvas.height / 2;

// þetta ræður hraða og stefnu boltans
let hradi_x = -15;
let hradi_y = -10;

// stærðin á boltanum
let bolti_radius = 25;

// by til y hnit fyrir spaða 1 og 2
let spadi1_x = 100;
let spadi1_y = 100;

let spadi2_x = canvas.width-100;
let spadi2_y = 100;



// bý til klassa um boltan
class Bolti {
    constructor(x, y, radius ,litur){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.litur = litur;
    }
    // þetta teiknar boltan upp
    draw(){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.litur;
        ctx.fill();
        ctx.closePath();

    // þetta uppfæri hvar hnitin á boltanum eru
    }
    update(new_x, new_y){
        this.x = new_x;
        this.y = new_y;
    }
}

// bý til klassa fyrir spaðana 
// þessi klassi virkar svipað og klassin fyrir ofan
class Spadar{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 200;
        this.litur = 'blue';
    }
    draw(){
       ctx.beginPath();
       ctx.rect(this.x, this.y, this.width, this.height);
       ctx.fillStyle = this.litur;
       ctx.fill();
       ctx.closePath();
    }
    update(new_x, new_y){
        this.x = new_x;
        this.y = new_y;
    }
}

// by til boltan og set á hann það sem hann a að byrja

const bolti = new Bolti(bolti_x ,bolti_y ,bolti_radius ,'white');
bolti.draw();


// by til spaðana
const spadi1 = new Spadar(spadi1_x ,spadi1_y);
const spadi2 = new Spadar(spadi2_x ,spadi2_y);


// nota þetta í animate fallinu
let stig1=0;
let stig2=0;
let tala = 100;
let hit = 0;


// Þetta lætur leikinn gerast 
let animationId 
function animate(){
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    bolti.draw();
    spadi1.draw();
    spadi2.draw();
    spadi2.update(spadi2_x,spadi2_y)
    bolti.update(bolti_x,bolti_y)


    // Ef boltinn rekst í toppinn eða botninn á canvasnum þá fer hann ekki útaf heldur y-ásinn snýst við
    if(bolti_y - bolti_radius <= 0 ||  bolti_y + bolti_radius >= canvas.height) {
        hradi_y = -hradi_y;
    }

    // Ef boltinn rekst í spaðann sem leikmaður stjórnar þá snýst x-ásinn við
    if(bolti_x - bolti_radius <= spadi1_x + 10){
        if(bolti_y >= spadi1_y && bolti_y <= spadi1_y + 200){
            console.log('hit')
            hradi_x = -hradi_x;
        }
    }

    // Þetta virkar eins og þetta fyrir ofan nema þegar boltinn hitir spaðan þrisvar sinnum þá breyttist y-ásinn hjá spaðanum
    if(bolti_x + bolti_radius >= spadi2_x - 10){
         if(bolti_y >= spadi2_y && bolti_y <= spadi2_y + 200){
            console.log('hit')
            hradi_x = -hradi_x;
            hit +=1
            if(hit==3){
                tala = -70
            }
        }
    }

    // Ef boltinn snertir vinstri veggin þá fær spaði2 eitt stig
    if(bolti_x - bolti_radius <= 0) {
        hradi_x = -hradi_x;
        stig2 +=1
        stig2El.innerHTML = stig2
        stortStig2El.innerHTML = stig2
        bolti_x = canvas.width / 2;
        bolti_y = canvas.height / 2;
        // Þegar boltinn snertir veggin þrisvar þá stöðvast leikurinn
        if(stig2==3){
            kassi.style.display = 'flex'
            cancelAnimationFrame(animationId)
        }
    }

    // Ef boltinn snertir hægri veggin þá fær spaði1 eitt stig
    if(bolti_x + bolti_radius >= canvas.width) {
        hradi_x = -hradi_x;
        stig1 +=1
        stig1El.innerHTML = stig1
        stortStig1El.innerHTML = stig1
        bolti_x = canvas.width / 2;
        bolti_y = canvas.height / 2;
        hit = 0
        tala = 100
        // Þegar boltinn snertir veggin þrisvar þá stöðvast leikurinn
        if(stig1==3){
            kassi.style.display = 'flex'
            cancelAnimationFrame(animationId)
        }
    }

    // þetta heldur boltanum á hreifingu
    bolti_x += hradi_x;
    bolti_y += hradi_y;

    // y-ásinn hjá spaða 2
    spadi2_y = bolti_y - tala;
}

// SPAÐINN FER EFTIR MÚSINNI
addEventListener('mousemove', (event) => {
    spadi1_y=event.clientY
    spadi1.update(spadi1_x,spadi1_y);
    
} )

// Ef ég klikka á hnappin "Byrja leik" þá fer þetta af stað sem ræsir animate fallið
byrjaleik.addEventListener('click', () =>{
    animate()
    kassi.style.display = 'none'
    stig1=0
    stig2=0
    stig1El.innerHTML = stig1
    stig2El.innerHTML = stig2
    stortStig1El.innerHTML = stig1
    stortStig2El.innerHTML = stig2
    hit = 0

})