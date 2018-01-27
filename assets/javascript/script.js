 // Initialize Google Firebase
  var config = {
    apiKey: "AIzaSyByyBYc7GoEkCfDMgbJJpFyFykBl1jjrzs",
    authDomain: "rpsfirebasencb.firebaseapp.com",
    databaseURL: "https://rpsfirebasencb.firebaseio.com",
    projectId: "rpsfirebasencb",
    storageBucket: "rpsfirebasencb.appspot.com",
    messagingSenderId: "244628581855"
  };
  firebase.initializeApp(config);


  //Var to reference Firebase Database
  var database = firebase.database();

  //Var to reference Player
  var player = '';

  //Var to reference Player 1
  var player1name = "";

  //Var to reference Player 2
  var player2name = "";

  //Var to reference Player 1's choice
  var player1choice = "";

  //Var to reference Player 2's choice
  var player2choice = "";

  //Var to reference alert window
  var alertwindow = "";

  //Var to player 1's wins
  var player1wins = 0;

  //Var to player 1's losses
  var player1losses = 0;

  //Var to player 2's wins
  var player2wins = 0;

  //Var to player 2's losses
  var player2losses = 0;
  var turns = 1;
  var timedelay;
  var timedelay2;
  var resetgame = false;


$(document).ready(function(){

	//this object handles the score check
	var derivewinner={
			//restart the game to turn 1
			resetGame : function(){
				resetgame = false;
				turns = 1;
					//update the turn in the firebase to 1
					database.ref().update({
								turn: turns
					});
			},
			//clear the 5 seconds timeout and call the reset
			clearDelay : function(){
				clearTimeout(timedelay);
				derivewinner.resetGame();
			},
			//update winner message to winner 1 
			updateWinner1 : function (){
				$("#winner").html( player1name + " wins!!");
			},
			//update winner message to winner 1 
			updateWinner2 : function (){
				$("#winner").html( plpayer2name + " wins!!");
			},
			//update the database to match the player score after the increases
			updateScore: function(){
				database.ref("players/1").update({		
						win: player1wins,
						lose: player1losses,	
				});//database update
				database.ref("players/2").update({
						win: player2wins,
						lose: player2losses,
				});//database update
			},
	
			playerscore : function (){
			

				if(player1choice == "rock" && player2choice == "scissors") {	
					player1wins++;
					player2losses++;
					derivewinner.updateWinner1();
					derivewinner.updateScore();
				}
		
				if(player1choice == "rock" && player2choice == "paper") {
					player1losses++;
					player2wins++;
					derivewinner.updateWinner2();
					derivewinner.updateScore();					
				}
		
				if(player1choice == "scissors" && player2choice == "rock") {					
					player1losses++;
					player2wins++;
					derivewinner.updateWinner2();
					derivewinner.updateScore();		
				}
		
				if(player1choice == "scissors" && player2choice == "paper") {					
					player1wins++;
					player2losses++;
					derivewinner.updateWinner1();
					derivewinner.updateScore();
				}
		
				if(player1choice == "paper" && player2choice == "rock") {					
					player1wins++;
					player2losses++;
					derivewinner.updateWinner1();
					derivewinner.updateScore();				
				}
				
				if(player1choice == "paper" && player2choice == "scissors") {
					player1losses++;
					player2wins++;
					derivewinner.updateWinner2();
					derivewinner.updateScore();
				}
	
				if(player1choice == player2choice) {
					$("#winner").html("It's a tie!");
				}

			}
	}

	

	$("#greetings").html("<h2>Enter Your Name to Play</h2>"
						+"</br><input type='text' id='name-input'>" +
						"</br></br><input type='submit' id='submit-name'>");
	$("#waiting1").html("Waiting for player 1");
	$("#waiting2").html("Waiting for player 2");
	
	//Hiding Choices and Messages foor New Game
	function hidden() {
			$("#player1choices").attr("style", "visibility:hidden");
			$("#player2choices").attr("style", "visibility:hidden");
			$("#group2message").attr("style", "visibility:hidden");
			$("#group1message").attr("style", "visibility:hidden");
	}
	hidden();

	database.ref().on("value", function(snapshot){

		function playerDisconnect(){
			if(player != ""){
				
				//if this is Player 1's browser
				if ((snapshot.child("players").child(1).exists()) && (player == snapshot.child("players").child(1).val().name)){					
						//update the message to the database
						database.ref("/chat").onDisconnect().update({							
							message: ((snapshot.child("players").child(1).val().name) + " has been DISCONNECTED!!"),
							dateAdded: firebase.database.ServerValue.TIMESTAMP												
						});
						//delete the player 1 database
						database.ref("players/1").onDisconnect().remove();
				//if this is Player 2's browser
				}else if ((snapshot.child("players").child(2).exists()) && (player == snapshot.child("players").child(2).val().name)){	
						//update the message to the database	
						database.ref("/chat").onDisconnect().update({						
							message: ((snapshot.child("players").child(2).val().name) + " has been DISCONNECTED!!"),
							dateAdded: firebase.database.ServerValue.TIMESTAMP													
						});//database	
						//delete the player 1 database
						database.ref("players/2").onDisconnect().remove();
						//delete the turn database				
						database.ref("/turn").onDisconnect().remove();	
				}
			}
		}
		
		//if player 1 dont exists, empty all that related to player 1 and unhilighted both user div
		if(((snapshot.child("players").child(1).exists()) == false)){
				$("#waiting1").html("Waiting for player 1");
				$("#winner").empty();
				$("#win1").empty();
				$("#lose1").empty();
				$("#player1-name").empty();
				$("#playerturn").empty();
				$("#player-1").attr("style", "border: 5px solid white");
				$("#player-2").attr("style", "border: 5px solid white");

		};
		//if player 2 dont exists, empty all that related to player 2 and unhilighted both user div
		if(((snapshot.child("players").child(2).exists()) == false)){
				$("#waiting2").html("Waiting for player 2");
				$("#winner").empty();
				$("#win2").empty();
				$("#lose2").empty();
				$("#player2-name").empty();
				$("#playerturn").empty();
				$("#player-1").attr("style", "border: 5px solid white");
				$("#player-2").attr("style", "border: 5px solid white");
		};
		//if player 2 exists but not 1,, show player 2 name in his div and unhilighted both user div
		if((snapshot.child("players").child(2).exists()) && ((snapshot.child("players").child(1).exists()) === false)){
				$("#player2-name").html(snapshot.child("players").child(2).val().name);
				$("#waiting2").empty();
				$("#player-1").attr("style", "border: 5px solid white");
				$("#player-2").attr("style", "border: 5px solid white");
				hidden();
				//when any player disconnect from the game
				playerDisconnect();
		};
		//if player 1 exists but not 2,,show player 1 name in his div and unhilighted both user div
		if((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()) === false)){
				$("#waiting1").empty(); 
				$("#player1-name").html(snapshot.child("players").child(1).val().name);
				hidden();
				//when any player disconnect from the game
				playerDisconnect();
					//at the player1's  browser
					if(player == snapshot.child("players").child(1).val().name){
							$("#greetings").html("<h2>Hello " + snapshot.child("players").child(1).val().name +  ".  You are player 1!</h2>");					
							$("#win1").html("WIN: " + player1wins);
							$("#lose1").html("LOSE: " + player1losses);
					}
		//If both players exists == we are READY to play!
		}else if((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()))){
				//Keeping track of turn for the database
				var databaseTurn = snapshot.child("turn").val();
				player1name = snapshot.child("players").child(1).val().name;
	  			plpayer2name = snapshot.child("players").child(2).val().name;
					//Both browers will show...
					$("#waiting2").empty();
					$("#waiting1").empty();
					$("#player2-name").html(snapshot.child("players").child(2).val().name);
					$("#player1-name").html(snapshot.child("players").child(1).val().name);
					$("#win2").html("WIN: " + snapshot.child("players").child(2).val().win);
					$("#lose2").html("LOSE: " + snapshot.child("players").child(2).val().lose);
					$("#win1").html("WIN: " + snapshot.child("players").child(1).val().win);
					$("#lose1").html("LOSE: " + snapshot.child("players").child(1).val().lose);
					//when any player disconnect from the game
					playerDisconnect();
					
				//player 1's browser, player 1's turn
				if((player == snapshot.child("players").child(1).val().name) && (databaseTurn == 1)){
						$("#greetings").html("<h2>Hello " + snapshot.child("players").child(1).val().name +  ".  You are player 1!</h2>");
						$("#player-1").attr("style", "border: 5px solid purple");
						$("#player-2").attr("style", "border: 5px solid white");
						hidden();
						$("#player1choices").attr("style", "visibility:visible");
							$("#rock1").html("ROCK");
							$("#paper1").html("PAPER");
							$("#scissors1").html("SCISSORS");
						$("#winner").empty();
						$("#playerturn").html("It's your turn!");
				}
				//player 1's browser, player 2's turn
				if((player == snapshot.child("players").child(1).val().name) && (databaseTurn == 2)){//after player 1 picks
						$("#player-1").attr("style", "border: 2px solid white");
						$("#player-2").attr("style", "border: 2px solid purple");
						hidden();
						$("#group1message").attr("style", "visibility:visible");
							$("#group1message").html("Chose: " + "<h2>" + player1choice + "</h2>");
						$("#playerturn").html("Waiting for " + plpayer2name + " to choose...");
				}
				
				//player2's browser, player 1's turn
				if((player == snapshot.child("players").child(2).val().name) && (databaseTurn == 1 )){
						$("#greetings").html("<h2>Hello " + snapshot.child("players").child(2).val().name +  ".  You are player 2!</h2>");
						$("#player-1").attr("style", "border: 5px solid purple");
						$("#player-2").attr("style", "border: 5px solid white");
						$("#playerturn").html("Wating for " + player1name + " to choose!!");
						hidden();	
						$("#winner").empty();
				}
				//player2's browser, player 2's turn
				if((player == snapshot.child("players").child(2).val().name) && (databaseTurn == 2 )){
						$("#player-1").attr("style", "border: 2px solid white");
						$("#player-2").attr("style", "border: 1px solid purple");
						$("#playerturn").html("It is your turn!"); 
						hidden();							
						$("#player2choices").attr("style", "visibility:visible");
							$("#rock2").html("ROCK");
							$("#paper2").html("PAPER");
							$("#scissors2").html("SCISSORS");				
				}
		
				if(databaseTurn == 3 && resetgame == false){
						resetgame = true;
					
						player1choice = snapshot.child("players").child(1).val().choice;
						player2choice = snapshot.child("players").child(2).val().choice;
						player1wins = snapshot.child("players").child(1).val().win;
						player1losses = snapshot.child("players").child(1).val().lose;
						player2wins = snapshot.child("players").child(2).val().win;
						player2losses = snapshot.child("players").child(2).val().lose;
							
							$("#player-1").attr("style", "border: 5px solid white");
							$("#player-2").attr("style", "border: 5px solid white");
							$("#player2choices").attr("style", "visibility:hidden");
							$("#player1choices").attr("style", "visibility:hidden");
							$("#group2message").attr("style", "visibility:visible");
							$("#group1message").attr("style", "visibility:visible");		
						 		$("#group1message").html("Chose: " + "<h2>" + player1choice + "</h2>");
						 		$("#group2message").html("Chose: " + "<h2>" + player2choice + "</h2>");
							$("#playerturn").empty();	
		
						derivewinner.playerscore();
			
						timedelay = setTimeout(derivewinner.clearDelay, 5 * 1000);				
				}	
		}
	}); 

	$("#submit-name").on("click", function(){
		
		var username = $("#name-input").val().trim();
	
		player = username;

		    database.ref().once('value').then(function(snapshot) {
	 				
	 				if((snapshot.child("players").child(1).exists()) === false){
							database.ref("players/1").set({
									name : username,
									win: player1wins,
									lose: player1losses
							}); 
					
					}else if((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()) === false)){
							database.ref("players/2").set({
								name : username,
								win: player2wins,
								lose: player2losses
						}); 
							database.ref().update({
								turn: turns,
						});
					
					}else if ((snapshot.child("players").child(1).exists()) && (snapshot.child("players").child(2).exists())){
					alert("There are two players playing! Try again later!");
					}
			}); 
	}); 

	
	$(".choice1").on("click", function(){
	
			player1choice = $(this).val();

				database.ref().once('value').then(function(snapshot) {
		 		
		 			turns = (snapshot.child("turn").exists() ? snapshot.child("turn").val() : turns);
					turns++; 

				
			 		if((player == snapshot.child("players").child(1).val().name)){
						database.ref("players/1").update({		
							choice : player1choice,						
						});
						
						database.ref().update({		
							turn: turns		
						});
					}
				});
	}); 

	$(".choice2").on("click", function(){

			player2choice = $(this).val();

				database.ref().once('value').then(function(snapshot) {
		 		
		 			turns = (snapshot.child("turn").exists() ? snapshot.child("turn").val() : turns);
					turns++; //3
					
			
			 		if((player == snapshot.child("players").child(2).val().name)){
						database.ref("players/2").update({									
							choice : player2choice,														
						});
						
						database.ref().update({
							turn: turns,									
						});
					}
				});
			}); 
 	

 				$("#submit-chat").on("click", function(event){

 				event.preventDefault();

				var messages = $("#chat-input").val().trim();
				$("#chat-input").val("");
			
	
				alertwindow = player + " : " + messages;
					
			
				database.ref("/chat").update({		
				message: alertwindow,
				dateAdded: firebase.database.ServerValue.TIMESTAMP								
			});
		}); 

				database.ref("/chat").orderByChild("dateAdded").limitToLast(1).on("value", function(snapshot) {
	    		$("#chat-window").append("</br>" + snapshot.val().message + "</br>");
			});

		});
