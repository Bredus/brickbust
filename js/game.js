var game;

window.onload = function() {
  let gameConfig = {
      type: Phaser.AUTO,
      backgroundColor:0x555555,
      scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          parent: 'thegame',
          width: 400,
          height: 500
      },
      physics: {
          default: 'arcade'
      },
      scene: playGame
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}

// Global variables
// OBJECTs
let ball;
let plate;
let blocks = {
  group: [],
  r: 4,
  c: 3,
  count: 0
};

// INPUTs
let keys;

// TEXT
let score;
let scoreText;
let topscore;
let topscoreText;

// AUDIO
let bop = [];
let yay;
let ohno;

// GAME MANAGER
let isBallMoving;
let localStorageName = 'topscore';

class playGame extends Phaser.Scene
{
  constructor()
  {
    super('PlayGame');
  }

  preload()
  {
    this.load.image('ground', 'images/ground.png');
    this.load.image('ball', 'images/ball.png');
    this.load.audio('bop', 'audio/bongC.mp3');
    this.load.audio('bop2', 'audio/bongG.mp3');
    this.load.audio('yay', 'audio/yay.mp3');
    this.load.audio('ohno', 'audio/ohno.mp3');
  }

  create()
  {
    // INPUTs
    keys = {
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    // SPRITES & OBJECTS
    ball = this.physics.add.sprite(200, 250, 'ball').setScale(0.2);
    ball.setImmovable(true);

    plate = this.physics.add.sprite(200, 480, 'ground').setScale(0.1,0.2);
    plate.setImmovable(true);

    blocks.count = blocks.r * blocks.c
    for (this.i = 0; this.i < blocks.r; this.i++)
    {
      blocks.group[this.i] = this.physics.add.group({
        key: 'ground',
        repeat: blocks.c-1,
        setXY: {x: 100, y: 80 + this.i * 30, stepX: 100},
        setScale: {x:0.1, y:0.4}
      });

      blocks.group[this.i].getChildren().forEach(function(child){
        child.setImmovable(true);
      })

      this.physics.add.overlap(ball, blocks.group[this.i], this.destroyBlock, null, this);

    }
    
    // TEXT / SCORE
    score = 0;
    topscore = localStorage.getItem(localStorageName) == null ? 0 : localStorage.getItem(localStorageName);

    scoreText = this.add.text(10, 10, '');

    // AUDIO
    bop[0] = this.sound.add("bop", { loop: false });
    bop[1] = this.sound.add("bop2", {loop: false});
    yay = this.sound.add("yay", {loop: false});
    ohno = this.sound.add("ohno", {loop: false});

    // SETUP
    isBallMoving = false;
    this.updateScore(0);
  }

  newGame()
  {

  }

  newRound()
  {
    this.scene.start('PlayGame');
  }

  update()
  {
    //Press SPACE is start game
    if (!isBallMoving)
    {
        if (keys.space.isDown)
        {
          isBallMoving = true;
          ball.setVelocityY(200);
        }
    }
    else
    {
      // Ball Bounce:
      // - PLATE
      this.physics.world.collide(ball, plate, this.bounce, null, this);

      // - SCREEN BORDERS
      if ((ball.getBounds().left < 0 && ball.body.velocity.x < 0) || (ball.getBounds().right > 400 && ball.body.velocity.x > 0))
      {
        ball.setVelocityX(-ball.body.velocity.x);
        bop[0].play();
      }
      if (ball.getBounds().top < 0 && ball.body.velocity.y < 0)
      {
        ball.setVelocityY(-ball.body.velocity.y);
        bop[0].play();
      }
      // - Lower Border
      else if (ball.getBounds().bottom > 500 && ball.body.velocity.y > 0)
      {
        this.gameover();
      }

      // Plate's movement
      if (keys.A.isDown && plate.getBounds().left > 0)
      {
        plate.setVelocityX(-300);
      }
      else if (keys.D.isDown && plate.getBounds().right < 400)
      {
        plate.setVelocityX(300);
      }
      else
      {
        plate.setVelocityX(0);
      } 
    }
  }

  gameover()
  {
    ohno.play();
    localStorage.setItem(localStorageName, Math.max(score, topscore));
    this.scene.start('PlayGame');
  }

  bounce(_ball, surface)
  {
    ball.setVelocityY(-ball.body.velocity.y);

    if (surface == plate)
    {
      if (plate.body.velocity.x != 0)
        ball.setVelocityX(0.5 * plate.body.velocity.x);

      bop[0].play();
    }
      
  }

  destroyBlock(_ball, _block)
  {
    this.bounce(_ball, _block);
    _block.disableBody(true, true);
    this.updateScore(1);
    blocks.count--;

    if (blocks.count == 0)
    {
      yay.play();
      this.newRound();
    }
    else
    {
      bop[1].play();
    }
  }

  updateScore(inc)
  {
    score += inc;
    scoreText.text = 'Score: ' + score + '\nTop-Score: ' + topscore;
  }
}