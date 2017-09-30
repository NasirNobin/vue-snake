Vue.component('snake-game',{
	'template' : `
		<div>
			<div v-if="game_on" class="game">
				<span v-for="x in list" :data-id="x" class="px">
					<span v-for="y in list" :data-id="y" class="px col" :class="{snake: isSnake(x,y), food: isFood(x,y)}"></span>
				</span>
			</div>
			<p>Score: <b>{{ score }}</b></p>
		</div>
	`,

	data: function(){

		return {
			'total' : 25,
			'snake': [],
			'snakeLenth': 1,
			'snakeDirection': 'right',
			'food': {},
			'game_on': true,
		}
	},

	created: function(){
		this.init();

	},
	destroyed: function(){
		window.removeEventListener('keyup', this.changeDirection);
	},
	computed: {
		list: function(){
			var x = [];

			for (var i = 0 ; i <= this.total ; i++) {
				x.push(i);
			}

			return x;
		},
		score: function(){
			return this.snakeLenth-1;
		},
	},

	methods: {
		init(){
			this.newGame();

			window.addEventListener('keyup', this.changeDirection);

			setInterval(this.move,100);
		},
		newGame(){
			var self = this;

			this.snakeLenth = 1;
			self.snake = [];

			self.snake.push(self.getRand());
			self.food = self.getRand();
		},
		move(){

			var self = this;

			var last = self.snake[self.snake.length-1];

			var x = last.x;
			var y = last.y;


			if(x == this.food.x && y == this.food.y){
				this.eat();
			}

			switch( self.snakeDirection ){
				case 'up':
					y -= 1;
				break;

				case 'right':
					x += 1;

				break;

				case 'down':
					y += 1;

				break;

				case 'left':
					x -= 1;
				break;
			}


			if(y > self.total){
				y = 0;
			}

			if(x > self.total){
				x = 0;
			}

			if(y < 0){
				y = self.total;
			}

			if(x < 0){
				x = self.total;
			}

			// self bite
			for(i in this.snake){
				if(this.snake[i] != undefined && this.snake[i].x == x && this.snake[i].y == y){
					alert('Game over. Your score: ' + this.score );
					this.newGame();
				}
			}

			self.snake.push({x: x, y: y})

			if(self.snake.length > self.snakeLenth){
				self.snake.shift();
			}
		},
		isSnake(x,y){
			for(i in this.snake){
				if(this.snake[i].x == x && this.snake[i].y == y){
					return true;
				}
			}
		},
		isFood(x,y){

			if(this.food.x == x && this.food.y == y){
				return true;
			}
		},
		eat(){
			this.snakeLenth += 1;
			this.food = this.getRand();
		},
		changeDirection(e){

			e.preventDefault();
			e.stopPropagation();

			var directions = {
				37 : 'left',
				38 : 'up',
				39 : 'right',
				40 : 'down',
			}

			if(directions[e.keyCode] !== undefined){

				if( (this.snakeDirection == 'right' && directions[e.keyCode] == 'left') ||
					(this.snakeDirection == 'left' && directions[e.keyCode] == 'right') ||
					(this.snakeDirection == 'down' && directions[e.keyCode] == 'up') ||
					(this.snakeDirection == 'up' && directions[e.keyCode] == 'down') ) {

					return false;
				}

				this.snakeDirection = directions[e.keyCode];
			}

			return false;
		},

		getRand(){
			return {x: Math.floor(Math.random()*this.total), y: Math.floor(Math.random()*this.total)}
		},
	},
})

var vm = new Vue({
	'el' : '#app',
})