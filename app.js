const App = {
    data() {
        return {
            error: false,
            iteration: 0,
            parah: 0,
            started:false,
            accurancy: 100,
            deduction: 0,
            tLastTime:0,
            tTotal:0,
            enteredKey:0,
            tKeyInMin:0,
        }
    },
    created(){
        this.preload()
    },
    methods: {
        getText(){
            $(".text").html("")
            $.getJSON( "https://baconipsum.com/api/?callback=?",{ 'type':'meat-and-filler'}, function( data ) {
                if (data && data.length > 0){
                    for (let i = 0; i < data.length; i++){
                        let el = data[i].split("").map((el) => `<span class="letter">${el}</span>`).join("")
                        $(".text").append(`<p>${el}</p>`)
                    }
                }
            })
        },

        preload(){
            this.getText()
        },

        start(is){
            $(".text").focus()
            this.started = !this.started
            this.error = this.parah = this.iteration = 0
            this.deduction = 100 / $.makeArray($(".text p")).reduce(function(sum, current) {
                return sum + current.outerText.length;
            }, 0);
            if (is) this.preload()
        },

        typing(e){
            if (this.started) {
                let tTime = new Date().getTime();
                let countPar = $('.text p').length
                let $letterObj = $('.text p').eq(this.parah)
                let lengthPar = $letterObj.text().length

                let $letterCurrent = $letterObj.find(`.letter:eq(${this.iteration})`)
                let $letterNext = $letterObj.find(`.letter:eq(${this.iteration + 1})`)

                let keyCurrent = $letterCurrent.text()


                if(countPar < this.parah){
                    // конец
                }

                if (e.key === keyCurrent && countPar >= this.parah && lengthPar > this.iteration) {
                    $letterCurrent.addClass("passed-text").removeClass("letter-false letter-true")
                    $letterNext.addClass("letter-true").removeClass("letter-false passed-text")
                    this.iteration++

                    if (this.tLastTime != 0) {
                        this.tTotal += tTime - this.tLastTime
                        this.enteredKey++
                        this.tKeyInMin = Math.round(this.enteredKey / this.tTotal * 6000)
                    }
                    console.log(this.tKeyInMin)
                    this.tLastTime = tTime;

                    if (this.error) {
                        this.error = !this.error
                        this.accurancy -= this.deduction;
                    }
                }else if(lengthPar === this.iteration && countPar >= this.parah){
                    this.parah++
                    this.iteration = 0
                }else if(e.key !== keyCurrent && countPar >= this.parah){
                    $letterCurrent.addClass("letter-false").removeClass('letter-true passed-text')
                    this.error = true
                }
            }
        }
    },
}
Vue.createApp(App).mount('#app')
