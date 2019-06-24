const
    previewSound = (url,state = true)=>{
        const
            audio = document.querySelector("audio")
        if (state) {
            audio.setAttribute("src",url)
            audio.play()
        }else{
            audio.pause()
        }
    }
export {previewSound}