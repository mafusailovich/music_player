'usr strict'

//выравнивание картинок с позицией absolute телефон и кабель
const headerPhoneImg = document.querySelector('.header__phone img');
const headerPhone = document.querySelector('.header__phone');
const headerCable = document.querySelector('.header__cable');
const headerPlay = document.querySelector('.header-player');
const playerBg = document.querySelector('.player__bg');

//констанды для menu
const munuLogo = document.querySelector('.menu-small');
const menuSmallLinks = document.querySelector('.menu-small__links');


function resizeElements() {
    if (window.innerWidth <= Number(756) && window.innerWidth > Number(400)) {
        headerPhone.style.right = `${(window.innerWidth - headerPhoneImg.offsetWidth) / 2 - 40}px`;
        headerCable.style.right = `${(window.innerWidth - headerPhone.offsetWidth) / 2 + 58}px`;
        headerPlay.style.right = `${(window.innerWidth - headerPhoneImg.offsetWidth) / 2 + 65}px`;
        playerBg.style.right = `${(window.innerWidth - headerPhoneImg.offsetWidth) / 2 + 65}px`;
    } else {
        headerPhone.style.removeProperty('right');
        headerCable.style.removeProperty('right');
        headerPlay.style.removeProperty('right');
        playerBg.style.removeProperty('right');
    }
    //выпадающее меню закрывается
    if (menuSmallLinks.classList.contains('active-menu')) {
        menuSmallLinks.classList.remove('active-menu');
    }
}
resizeElements();

window.addEventListener(`resize`, resizeElements);

//нажатие на кнопку MP (открывается и закрывается по кнопку), по клику в другом месте документа
//и по нажатию клавиши Escape

document.addEventListener('click', function (event) {
    if (event.target.matches('.menu-small__logo')) {
        menuSmallLinks.classList.toggle('active-menu');
    }
    if (!event.target.closest('.menu-small')) {
        if (menuSmallLinks.classList.contains('active-menu')) {
            menuSmallLinks.classList.remove('active-menu');
        }
    }
});
document.addEventListener('keyup', function (event) {
    if (event.code === 'Escape') {
        if (menuSmallLinks.classList.contains('active-menu')) {
            menuSmallLinks.classList.remove('active-menu');
        }
    }
});

/* аудиоплеер */
function AudioPlayer(player) {

    //получаем кнопки управления
    this.btnPp = player[0].querySelector('.track-menu__btn2');
    this.btnTl = player[0].querySelector('.track-menu__btn1');
    this.btnTr = player[0].querySelector('.track-menu__btn3');

    //получаем картинки на кнопочках управления (для анимирования)
    this.pPimg = player[0].querySelectorAll('.track-menu__btn2 img');//playpause
    this.tTlimg = player[0].querySelectorAll('.track-menu__btn1 img'); //влево
    this.tTrimg = player[0].querySelectorAll('.track-menu__btn3 img');//вправо

    //получаем название и исполнителя (для дальнейшего заполнения)
    this.tTitle = player[0].querySelector('.track__title');
    this.tArtist = player[0].querySelector('.track__artist');

    //получаем доступ к полосе заполнения прогресс бара
    this.tPaint = player[0].querySelector('.track-line__paint-line');
    //элемент управления прогресс баром (кнопка передвижения)
    this.cBtn = player[0].querySelector('.controlBtn');

    //получаем черную линию (фон прогресс бара, относительно которо можно перемещаться)
    this.tLine = player[0].querySelector('.track-line__line');

    //отслеживание загрузки данных
    this.loaddata = false;
    this.loadmeta = false;

    //создание аудиоэлемента и подгрузка нулевого трека
    this.audioElement = new Audio();

    //переменная для хранения позиции в списке (по умолчанию стоит на нуле)
    this.num = 0;

    this.listTracks = [['audio/Veselie_gvozdiki.ogg', 'Веселые гвоздики', 'Vladimir Fesenko'],
    ['audio/Vestnik.ogg', 'Вестник', 'Vladimir Fesenko'],
    ['audio/Vremena_goda_Leto.ogg', 'Времена года', 'Vladimir Fesenko']];


    //метод загружает в обект данные о треке
    this.loadAudio = function () {
        this.loaddata = false;
        this.audioElement.src = this.listTracks[this.num][0];
        this.tTitle.innerHTML = this.listTracks[this.num][1];
        this.tArtist.innerHTML = this.listTracks[this.num][2];
    };

    this.loadAudio();

    //устанавливаем прослушку на события загрузки данных о треке
    this.audioElement.addEventListener('loadeddata', () => {
        this.loaddata = true;
    });
    this.audioElement.addEventListener('loadedmetadata', () => {
        this.loadmeta = true;
    });


    //действие пауза
    this.fPause = function () {
        this.pPimg[2].style.transform = 'scale(2,2)';
        this.pPimg[1].style.transform = 'scale(0,0)';
        this.pPimg[3].style.transform = 'scale(0,0)';
        this.audioElement.pause();
    }

    //действие play
    this.fPlay = function () {
         //проверяем загружены ли данные о треках
        while (this.load) {
            this.interval = setInterval(() => {
                if (this.loaddata && this.loadmeta){
                    clearInterval(this.interval);
                    this.load = true;
                }
            }, "1000");
        }
        this.pPimg[2].style.transform = 'scale(0,0)';
        this.pPimg[1].style.transform = 'scale(2,2)';
        this.pPimg[3].style.transform = 'scale(2,2)';
        this.audioElement.play();
    }


    //функция воспроизведения и паузы и заполнение progress bar
    this.playPause = function () {
        //по нажатию на кнопку play pause запускаем трек и анимируем нажатие кнопки
        this.btnPp.addEventListener('click', (event) => {
            if (event.target.closest('.track-menu__btn2')) {
                if (!this.audioElement.paused) {
                    this.fPause();
                } else {
                    this.fPlay();
                }
            }
        });
        this.btnTr.addEventListener('click', (event) => {
            if (event.target.closest('.track-menu__btn3')) {
                if (this.listTracks[this.num + 1]) {
                    this.num++;
                } else {
                    this.num = 0;
                };
                this.loadAudio();
                this.fPause();
                this.fPlay();
            };
        });
        this.btnTl.addEventListener('click', (event) => {
            if (event.target.closest('.track-menu__btn1')) {
                if (this.num > 0) {
                    this.num--;
                } else {
                    this.num = this.listTracks.length - 1;
                };
                this.loadAudio();
                this.fPause();
                this.fPlay();
            };
        });



        //заполнение прогресс бара во время проигрывания
        this.audioElement.addEventListener('timeupdate', () => {
            //вычисляем заполнение progress bar
            this.tPaint.style.width = `${this.audioElement.currentTime / this.audioElement.duration * 100}%`;
            //позиционируем элемент управления
            this.cBtn.style.left = `${this.audioElement.currentTime / this.audioElement.duration * 100 - 4.4}%`;
        });

        //управление прогресс баром
        //получаем координаты и разницу в стартовых положениях кнопки управления и строки
        const coordBtnStart = this.cBtn.getBoundingClientRect().left;
        const diffLineBtn = this.tLine.getBoundingClientRect().left - this.cBtn.getBoundingClientRect().left;

        //функция устанавливает позицию элемента
        this.setPosition = function (evt) {
            //вычисляем позиционирование в %
            let positionLeft = (evt.clientX - coordBtnStart - diffLineBtn - this.cBtn.clientWidth / 2);
            positionLeft /= this.tLine.clientWidth / 100;

            //по позиционированию вычисляем currentTime для трека (при timeupdate выше уже элемент будет спозиционирован)
            this.audioElement.currentTime = (positionLeft + 4.4) / 100 * this.audioElement.duration;
        };

        this.tLine.addEventListener(`dragover`, (event) => {
            //разрешаю перемещать элементы в эту область
            event.preventDefault(); //отменяем действие по умолчанию

            this.setPosition(event);
        });

        this.tLine.addEventListener('click', (event) => {
            this.setPosition(event);
        });
    };



    //функция переходит к следующиему или предыдущему треку в альбоме
    // this.nextprevTrack = function () {


    //     });
    // };

    // this.nextprevTrack();
    this.playPause();

}

//получаем элементы управления плеером
const player = document.querySelectorAll('.header-player');
let NewPlayer = new AudioPlayer(player);
