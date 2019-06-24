import * as router from "../js/modules/router.js"
import * as helper from "../js/modules/helper.js"
// apiConfig is set in key.js
(()=>{
    'use strict'
    var
        app = {
            init:()=>{ // Initialze the app                
                const
                    userInput = document.getElementById("userInput")
                            
                router.init()


                document.querySelector("button").addEventListener("click",()=>{
                    app.reboot()
                })

                userInput.addEventListener("keypress",(e)=>{
                    if(e.charCode == 0 || e.code == "Enter"){
                        if(userInput.value == ''){
                            window.location.hash = ""
                        }else{
                            app.reboot()
                        }
                    }
                })
            },
            reboot:()=>{
                let
                    userInput = document.getElementById("userInput"),
                    userName = userInput.value.toLowerCase()

                    helper.errorMsg(false)
                    helper.loading(true)

                    window.location.hash = "osu-user-" + userName
            }
        }
    app.init()
})()
