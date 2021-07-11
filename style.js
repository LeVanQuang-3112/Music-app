
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const playlist = $('.playlist')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const playBtn = $('.btn-toggle-play')
const pauseBtn = $('.btn-toggle-pause')
const audio = $('#audio')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    
    songs : [
            { name: 'Alone',
            singer: 'Alan Walker', 
            path: './audio/Alone-AlanWalker-5815087.mp3',
            image: './images/alone.jpg'
            },
        
            { name: 'All Falls Down',
            singer: 'Alan Walker', 
            path: './audio/AllFallsDown-AlanWalkerNoahCyrusDigitalFarmAnimalsJuliander-5817723.mp3',
            image: './images/allfallsdown.jpg'
            },
        
            { name: 'Faded',
            singer: 'Alan Walker', 
            path: './audio/Faded-AlanWalker-5919763.mp3',
            image: './images/faded.jpg'
            },
        
            { name: 'Lily',
            singer: 'Alan Walker', 
            path: './audio/Lily-AlanWalkerK391EmelieHollow-5815034.mp3',
            image: './images/lily.jpg'
            },
        
            { name: 'On My Way',
            singer: 'Alan Walker', 
            path: './audio/OnMyWay-AlanWalkerSabrinaCarpenterFarruko-5919403.mp3',
            image: './images/onmyway.jpg'
            },
            { name: 'That Girl',
            singer: 'Olly Murs', 
            path: './audio/ThatGirl-OllyMurs-6560207.mp3',
            image: './images/that girl.jpg'
            },
            { name: 'Animals',
            singer: 'Maroon5', 
            path: './audio/Animals-Maroon5-3334407.mp3',
            image: './images/animal.jpg'
            },
            { name: 'Something Just Like This',
            singer: 'The Chainsmokers', 
            path: './audio/SomethingJustLikeThis-TheChainsmokersColdplay-5337136.mp3',
            image: './images/something just like this.jpg'
            },
            
        
        ],

render: function() {
    
    const htmls = this.songs.map((song, index) => {
        return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = '${index}'>
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
    })
    playlist.innerHTML = htmls.join('')

},

defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
        get: function() {
            return this.songs[this.currentIndex]
        }
    })
},

handleEvents: function() {
    const cdWidth  = cd.offsetWidth
    const _this = this
    
    // xử lý cd quay / dừng

    const cdThumbAnimate = cdThumb.animate([
        {transform: 'rotate(360deg'}
    ], {
        duration: 10000,
        iterations: Infinity
    })
    cdThumbAnimate.pause()

    // xử lý cd ẩn / hiện

    document.onscroll = function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const newCdWidth = cdWidth - scrollTop
        
        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
        cd.style.opacity = newCdWidth / cdWidth
    }

    // xủ lý play / pause

    playBtn.onclick = function() {

        if(_this.isPlaying) {
            _this.isPlaying = false
            audio.pause()
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        else {
            _this.isPlaying = true
            audio.play()
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
    }

    // khi tiến độ bài hát thay đổi

    audio.ontimeupdate = function() {
        if(audio.duration) {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
        }
    }

    // xử lý khi tua xong 

    progress.onchange = function(e) {
        const seekTime = audio.duration / 100 * e.target.value
        audio.currentTime = seekTime
    }
    
    // next song 

    nextBtn.onclick = function() {
        if(_this.isRandom) {
            _this.playRandomSong()
        }
        else {
            _this.nextSong()
        }
        audio.play()
            cdThumbAnimate.play()
            player.classList.add('playing')
            _this.render( )
    }

    // prev song

    prevBtn.onclick = function() {
        _this.prevSong()
        audio.play()
        cdThumbAnimate.play()
        player.classList.add('playing')
        _this.render( )

    }
    
    // random song

    randomBtn.onclick = function() {
        _this.isRandom = !_this.isRandom
        randomBtn.classList.toggle('active', _this.isRandom)
        _this.playRandomSong()
    }
    
    // repeat song

    repeatBtn.onclick = function() {
        _this.isRepeat = !_this.isRepeat
        repeatBtn.classList.toggle('active', _this.isRepeat)
    }
    // xử lý khi song phát xong

    audio.onended = function() {
        if(_this.isRepeat) {
            audio.play()
        }
        else {
            nextBtn.click()
        }
    }
},

loadCurrentSong: function() {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
},

nextSong: function() {
    this.currentIndex ++
    if(this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
    }
    this.loadCurrentSong()
},

prevSong: function() {
    this.currentIndex --
    if(this.currentIndex <=0) {
        this.currentIndex = 0
    }
    this.loadCurrentSong()
},

playRandomSong: function() {
    let newIndex 
    do {
        newIndex = Math.floor(Math.random() * this.songs.length)
    } while(newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
},

start: function() {
    
    this.defineProperties()
    this.loadCurrentSong()
    this.handleEvents()
    this.render()
}



}

app.start()
