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

var ball;
var plate;
var blocks;
var keys;
var isBallMoving;

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

    // SPRITES
    ball = this.physics.add.sprite(200,250, 'ball').setScale(0.2);
    plate = this.physics.add.sprite(200, 480, 'ground').setScale(0.1,0.2);

    
    // block = this.physics.add.sprite(200,50,'ground').setScale(0.1,0.4);

    blocks = this.physics.add.group({
      key: 'ground',
      repeat: 2,
      setXY: {x: 100, y: 50, stepX: 100},
      setScale: {x:0.1, y:0.4}
    });
    
    ball.setImmovable(true);
    plate.setImmovable(true);

    blocks.getChildren().forEach(function(child){
      child.setImmovable(true);
    })

    // block.setImmovable(true);

    this.physics.add.overlap(ball, blocks, this.destroyBlock, null, this);

    isBallMoving = false;
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
      }
      if (ball.getBounds().top < 0 && ball.body.velocity.y < 0)
      {
        ball.setVelocityY(-ball.body.velocity.y);
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
  }

  destroyBlock(_ball, _block)
  {
    this.bounce(_ball, _block);
    _block.disableBody(true, true);
  }

}