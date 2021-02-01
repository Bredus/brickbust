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
let ball;
let plate;
let blocks = [];
let keys;
let isBallMoving;
let score;
let scoreText;
let bop;

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
    this.load.audio('bop', ['audio/bong.wav']);
  }

  create()
  {
    // Adding keyboard inputs
    keys = {
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    // SPRITES & OBJECTS
    ball = this.physics.add.sprite(200,250, 'ball').setScale(0.2);
    plate = this.physics.add.sprite(200, 480, 'ground').setScale(0.1,0.2);

    for (this.i = 0; this.i < 3; this.i++)
    {
      blocks[this.i] = this.physics.add.group({
        key: 'ground',
        repeat: 2,
        setXY: {x: 100, y: 50 + this.i * 30, stepX: 100},
        setScale: {x:0.1, y:0.4}
      });

      blocks[this.i].getChildren().forEach(function(child){
        child.setImmovable(true);
      })

      this.physics.add.overlap(ball, blocks[this.i], this.destroyBlock, null, this);

    }
    
    scoreText = this.add.text(10, 10, '');

    ball.setImmovable(true);
    plate.setImmovable(true);

    // AUDIO
    bop = this.sound.add("bop", { loop: false });

    // Start game parameters
    isBallMoving = false;
    score = 0;
    this.updateScore(0);
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
        bop.play();
      }
      if (ball.getBounds().top < 0 && ball.body.velocity.y < 0)
      {
        ball.setVelocityY(-ball.body.velocity.y);
        bop.play();
      }
      // - Lower Border
      else if (ball.getBounds().bottom > 500 && ball.body.velocity.y > 0)
      {
        this.scene.start('PlayGame');
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

  bounce(_ball, surface)
  {
    ball.setVelocityY(-ball.body.velocity.y);

    if (surface == plate)
    {
      if (plate.body.velocity.x != 0)
        ball.setVelocityX(0.5 * plate.body.velocity.x);
    }

    bop.play();
  }

  destroyBlock(_ball, _block)
  {
    this.bounce(_ball, _block);
    _block.disableBody(true, true);
    this.updateScore(1);
  }

  updateScore(inc)
  {
    score += inc;
    scoreText.text = "Score: " + score;
  }
}