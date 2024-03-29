class Pocemon {
    constructor() {
        this.API_ENDPOINT = "https://api.pokemontcg.io/v1/cards?";
        this.pageSize = 6;
        this.currentPage = null;
        this.srcHidden = "img/poc.png";
        this.tabTwo = [];
        this.tempTwo = [];
        this.cards = document.querySelector('[data-cards]');
        this.btn = document.querySelector('[data-btn]');
        this.cardsListner = null;
        this.score = 0;
        this.hit = 0;
        this.tabCardsRan = [];
        this.tabCards = [];
        this.timeGame = 0;
        this.stopInterval = null;
    }
    async fetchCards() {
        let idd = 0;
        const currentPage = Math.floor(Math.random() * 100);
        const endpoint = `${this.API_ENDPOINT}page=${currentPage}&pageSize=${this.pageSize}`
        await fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                data.cards.forEach(da => {
                    this.tabCards.push({
                        id: da.id,
                        imageUrl: da.imageUrl,
                        dataId: idd++,
                        hidden: true,
                        guessed: false,
                        click: false,
                    })
                })
            });

        let tabObject = [];
        this.tabCards.forEach(ta => {
            let objCopy = Object.assign({}, ta);
            tabObject.push(objCopy);
        })
        this.tabTwo = [...this.tabCards, ...tabObject];
        this.putRandomNumber();
    }

    putRandomNumber() {
        let tempTab = [];
        let temp = [];
        for (let i = 0; i < this.pageSize * 2; i++) {
            temp[i] = i;
        }

        for (let i = 0; i < this.pageSize * 2; i++) {
            let ran = Math.floor(Math.random() * temp.length);
            tempTab.push(this.tabTwo[temp[ran]]);
            temp.splice(ran, 1);
        }
        this.tabCardsRan = tempTab;
        setTimeout(() => {
            this.displayCards();
        }, 1000)

    }
    playAgain() {
        location.reload();
    }
    startGameTime = () => {
        this.stopInterval = setInterval(() => {
            this.timeGame++;
            this.btn.textContent = "Move: " + this.score + " Time: " + this.timeGame + "sec";
        }, 1000)
    }
    checkCard(e) {
        this.tabCardsRan[e.target.dataset.item].hidden = false;
        this.tabCardsRan[e.target.dataset.item].click = false;
        if (this.tempTwo.length === 0) {
            this.tempTwo.push(e.target.dataset.item);
            setTimeout(() => {
                this.displayCards(e.target.dataset.item);
            }, 300)
            e.target.parentNode.classList.add('main_card--rotate');

        }
        else if (this.tempTwo.length > 0) {
            setTimeout(() => {
                this.displayCards(e.target.dataset.item);
            }, 300)
            e.target.parentNode.classList.add('main_card--rotate');
            setTimeout(() => {
                this.tabCardsRan[this.tempTwo[0]].hidden = true;
                this.tabCardsRan[e.target.dataset.item].hidden = true;
                this.tabCardsRan[e.target.dataset.item].click = false;
                if (this.tabCardsRan[e.target.dataset.item].id === this.tabCardsRan[this.tempTwo[0]].id) {
                    this.hit++;
                    this.score++;
                    this.tabCardsRan[e.target.dataset.item].guessed = true;
                    this.tabCardsRan[this.tempTwo[0]].guessed = true;
                    if (this.hit >= this.pageSize) {
                        clearInterval(this.stopInterval);
                        this.btn.textContent = `Move:  ${this.score} Time:  ${this.timeGame}sec Play again?`;
                        this.btn.classList.remove('btn_main--off');
                        this.btn.addEventListener('click', this.playAgain)
                    }
                } else {
                    this.score++;
                    this.tabCardsRan[e.target.dataset.item].click = true;
                    this.tabCardsRan[this.tempTwo[0]].click = true;
                }
                this.tempTwo.length = 0;
                this.displayCards();
            }, 1000);
        }
    }
    addMouseOver = (card) => {
        this.cardsListner.forEach(card => {
            card.children[0].classList.remove('main_card--shadow');
        })
        card.children[0].classList.add('main_card--shadow');
    }
    displayCards(item) {
        this.cards.innerHTML = "";
        let id = 0;
        this.tabCardsRan.forEach(tab => {
            this.cards.innerHTML += `<div class="main_card " data-id >
                <img src=${tab.hidden ? this.srcHidden : tab.imageUrl} class="main_img ${tab.guessed ? "main_card--guessed" : ""} ${tab.hidden ? "main_card--hidden" : ""}   " alt="pocemon" data-item=${id++}>
                </div>`
        })
        this.cardsListner = document.querySelectorAll('[data-id]');
        this.cardsListner.forEach(card => {
            if (this.tabCardsRan[card.children[0].dataset.item].click) {
                card.addEventListener('click', this.checkCard.bind(this));
                card.classList.add('main_card--pointer');
                card.addEventListener('mouseover', () => this.addMouseOver(card));
            } else {
                card.removeEventListener('mouseover', this.addMouseOver);
            }

        })

        if (item) {
            this.cardsListner.forEach(card => {
                if (item === card.children[0].dataset.item) {
                    card.children[0].classList.add('main_card--animation');
                    console.log(card.children[0].classList);
                }


            })
        }
    }
    hiddenFalse = () => {
        this.tabCardsRan.forEach(ta => {
            ta.hidden = false;
        })
        this.btn.removeEventListener('click', this.hiddenFalse);
        this.btn.classList.add('btn_main--off');
        this.displayCards();
        this.btn.textContent = "Wait..."
        setTimeout(() => {
            this.tabCardsRan.forEach(ta => {
                ta.hidden = true;
                ta.click = true;
            })
            this.startGameTime();
            this.displayCards();
        }, 3000);
    }
    hiddenTrue = () => {
        this.tabCardsRan.forEach(ta => {
            ta.hidden = true;
        })
    }
    startGame() {
        this.btn.addEventListener('click', this.hiddenFalse)
    }
    init() {
        this.fetchCards();
        this.startGame();
    }
}

