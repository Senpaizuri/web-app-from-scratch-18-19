'use strict'

var
    getData = {
        "init":function(){
            getData.pokemon()
        },
        "pokemon":function(){
            getData.req('https://pokeapi.co/api/v2/pokemon/',151)
        },
        "pokemonType":function(id){
            var xhr = new XMLHttpRequest(),
            pokeType
            xhr.addEventListener("load", function(){
                var data = JSON.parse(this.responseText)
                pokeType = data.types.map(type => type.type.name)
            })
            xhr.open("GET",'https://pokeapi.co/api/v2/pokemon/'+id,true)
            xhr.send()
            // promise voor classes
        },
        "req":function(url,limit){
            var xhr = new XMLHttpRequest()
            xhr.addEventListener("load", function(){
                window.localStorage.setItem('pokemon',this.responseText)
                build.list()
            })
            xhr.open("GET",url+'?limit='+limit,true)
            xhr.send()
        }
    },
    build = {
        "list":function(){
            var data = JSON.parse(window.localStorage.getItem('pokemon'))
            console.log(data)

            var
                newList = document.createElement('ol')
            
            for(let i=0;i<data.results.length;i++){
                var
                    newLi = document.createElement('li'),
                    newH2 = document.createElement('h2'),
                    newImg= document.createElement('img'),
                    newAnc= document.createElement('a')

                newH2.textContent = data.results[i].name
                newImg.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+ (i+1) +".png"

                newAnc.href = data.results[i]

                newLi.classList.add(getData.pokemonType(i+1))

                newLi.appendChild(newImg)
                newLi.appendChild(newH2)
                newList.appendChild(newLi)
            }
            
            document.querySelector('#app').appendChild(newList)
        }
    }

getData.init()