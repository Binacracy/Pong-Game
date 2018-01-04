/*
	Phaser Project #1: Pong Game
	Creation Date: 1/1/2018
*/

//Create Phaser object
var game = new Phaser.Game(900, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var player;
var ai;
var ball;

var ball_launched; 
var ball_velocity; //Speed at which ball is traveling
var xball_velocity;
var ai_speed;

var player_score_text;
var ai_score_text;

var player_score;
var ai_score;


function preload(){
	game.load.image('paddle', 'assets/images/paddle.png');
	game.load.image('ball', 'assets/images/ball.png');
	game.load.image('background', 'assets/images/pong_bg.jpg');

	//Loading the Bitmap
	game.load.bitmapFont('font', 'assets/images/font.png','assets/images/font.xml');

}

function create(){
	//Initialize ball_launched and ball_velocity variables
	ball_launched = false;
	ball_velocity = 400;
	player_score = 0;
	ai_score = 0;
	ai_speed = 250;

	//Add background image
	var bg = game.add.sprite(0,0,'background');
	bg.scale.setTo(1.64, 1.52);

	//Create the paddles by invoking createPaddle method
	player = createPaddle(0, game.world.centerY);
	ai = createPaddle(game.world.width - 8, game.world.centerY);

	//Create the ball by invoking createBall method
	ball = createBall(game.world.centerX, game.world.centerY);

	//When the input is down (such as a click or a tap on the screen, add an event)
	game.input.onDown.add(launch_ball, this);

	//Pause game
	//spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
	//Create score texts using Text Objects
	/*player_score = game.add.text(128, 128, '0',{
		font: "64px Gabriella",
		fill: "#ffffff",
		align: "center"
	});
	
	ai_score = game.add.text(game.world.width - 128, 128, '0',{
		font: "64px Gabriella",
		fill: "#ffffff",
		align: "center"
	});*/

	//Create score texts using Bitmap font
	//bitmapText(xPos, yPos, bitmap, initial value, size in pixels)
	player_score_text = game.add.bitmapText(128, 128, 'font', '0', 64);
	ai_score_text = game.add.bitmapText(game.world.width - 148, 128, 'font', '0', 64);
}

function update(){
	player_score_text.text = player_score;
	ai_score_text.text = ai_score;
	//game.input.y is the Y position of the mouse
	control_paddle(player, game.input.y);

	//Checks to see if the paddles and ball objects are colliding
	if (game.physics.arcade.collide(player, ball) | game.physics.arcade.collide(ai, ball)){
		increase_ball_velocity();
	} 
	

	//If the ball is being blocked by the wall on the left side, execute the following code
	if(ball.body.blocked.left){
		ai_score++;
	} else if(ball.body.blocked.right){
		player_score++;
	}

	//Set AI paddle to move where the ball is moving
	ai.body.velocity.setTo(0,ball.body.velocity.y);

	if (ball.body.velocity.y >= 500 | ball.body.velocity.y <= -500){
		ai.body.maxVelocity = ai_speed + 200;
	} else{
		ai.body.maxVelocity.y = ai_speed;
	}
	

}

function createPaddle(x, y){
	var paddle = game.add.sprite(x, y, 'paddle');
	
	paddle.scale.setTo(0.5);

	//Set anchor to the center of the paddle sprite
	paddle.anchor.setTo(0.5);

	//Enable physics on the paddle by creating a body for the object.
	//Bodys are what physics impact
	game.physics.arcade.enable(paddle);

	//Keep paddle within the bounds of the game world
	paddle.body.collideWorldBounds = true;

	//Removes all velocity that is being acted upon that object
	paddle.body.immovable = true; 
	return paddle;
}

function control_paddle(paddle, y){
	//Set paddle's Y position to the user input's Y position
	paddle.y = y;

	if (paddle.y < paddle.height / 2){
		paddle.y = paddle.height / 2;
	} else if(paddle.y > game.world.height - paddle.height / 2){
		paddle.y = game.world.height - paddle.height / 2;
	}
}

function createBall(x, y){
	var ball = game.add.sprite(x, y, 'ball');
	ball.anchor.setTo(0.5);
	game.physics.arcade.enable(ball);
	ball.body.collideWorldBounds = true;

	//When ball object comes in contact with another physics body
	//(i.e.: bounces off the paddle), the velocity will change
	ball.body.bounce.setTo(1,1);

	return ball;
}

function launch_ball(){
	if(ball_launched){
		ball.x = game.world.centerX;
		ball.y = game.world.centerY;
		ball.body.velocity.setTo(0); //Set velocity to so ball doesn't move
		ball_launched = false;
	} else{
		ball.body.velocity.x = -ball_velocity;
		ball.body.velocity.y = ball_velocity;
		ball_launched = true;
	}
}

function increase_ball_velocity(){
	if (ball.body.velocity.x < 0 ){
			ball.body.velocity.x -= 5;
		} else{
			ball.body.velocity.x += 5;
		}

	if (ball.body.velocity.y < 0 ){
			ball.body.velocity.y -= 5;
		} else{
			ball.body.velocity.y += 5;
		}
	
}

function pauseGame(){
	console.log(ball.body.velocity.x);
	console.log(ball.body.velocity.y);
	ball.body.velocity.setTo(0);

	console.log(ball.body.velocity.x);
	console.log(ball.body.velocity.y);
}