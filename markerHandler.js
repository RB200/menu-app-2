var tableNumber = null
AFRAME.registerComponent('marker-handler',{
    init: async function(){
      if(tableNumber === null){
        this.askTableNumber()
      }
        var dishes = await this.getDishes()

        this.el.addEventListener('markerFound',()=>{
          if(tableNumber !== null){
            var markerId = this.el.id
            this.handleMarkerFound(dishes,markerId)
          }


        })
        this.el.addEventListener('markerLost',()=>{
            
            this.handleMarkerLost()
        })
    },
    
    handleMarkerFound: function(dishes,markerId){
        var todaysDate = new Date();
        var todaysDay = todaysDate.getDay();
        
        // Sunday - Saturday : 0 - 6
        var days = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday"
        ];
    
        var dish = dishes.filter(dish => dish.id === markerId)[0];
    
        if (dish.unavailable_days.includes(days[todaysDay])) {
          swal({
            icon: "warning",
            title: dish.dish_name.toUpperCase(),
            text: "This dish is not available today!!!",
            timer: 2500,
            buttons: false
          });
        } else {
           // Changing Model scale to initial scale
          var model = document.querySelector(`#model-${dish.id}`);
          model.setAttribute("position", dish.modelGeometry.position);
          model.setAttribute("rotation", dish.modelGeometry.rotation);
          model.setAttribute("scale", dish.modelGeometry.scale);
    
          model.setAttribute('visible',true)
          var ingredientsContainer = document.querySelector(`#main-plane-${dish.id}`)
          ingredientsContainer.setAttribute('visible',true)
          var pricePlane = document.querySelector(`#price-value-${dish.id}`)
          pricePlane.setAttribute('visible',true)
          
    
          // Changing button div visibility
          var buttonDiv = document.getElementById("button-div");
          buttonDiv.style.display = "flex";
    
          var ratingButton = document.getElementById("rating-button");
          var orderButton = document.getElementById("order-button");
    
          // Handling Click Events
          ratingButton.addEventListener("click", function() {
            swal({
              icon: "warning",
              title: "Rate Dish",
              text: "Work In Progress"
            });
          });
    
          orderButton.addEventListener("click", () => {
            
            swal({
              icon: "https://i.imgur.com/4NZ6uLY.jpg",
              title: "Thanks For Order !",
              text: "Your order will serve soon on your table!",
              timer: 2000,
              buttons: false
            });
          });
        }
      },

    handleMarkerLost: function(){
        var buttonDiv = document.getElementById('button-div')
        buttonDiv.style.display = 'none'
    },  

    askTableNumber: function(){
      var iconURL = "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png"
      swal({
        title:'Welcome to hunger',
        icon: iconURL,
        content:{
          element:'input',
          attributes:{
            placeholder:'Type your table number',
            type:'number',
            min:1
          }
        },
        closeOnClickOutside: false,
      })
      .then(inputValue=>{
        tableNumber = inputValue
      })
    },

    
    getDishes: async function(){
        return await firebase.firestore()
        .collection('dishes')
        .get()
        .then(snap=>{
            return snap.docs.map(doc=>doc.data())
        })
    }

})