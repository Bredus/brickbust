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
var block;
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
    block = this.physics.add.sprite(200,50,'ground').setScale(0.1,0.4);
    

    ball.setImmovable(true);
    plate.setImmovable(true);
    block.setImmovable(true);

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
      // Ball Bounce
      this.physics.world.collide(ball, plate, this.surfaceBounce, null, this);
      this.physics.world.collide(ball, block, this.surfaceBounce, null, this);

      if ((ball.getBounds().left < 0 && ball.body.velocity.x < 0) || (ball.getBounds().right > 400 && ball.body.velocity.x > 0))
      {
        ball.setVelocityX(-ball.body.velocity.x);
      }
      if (ball.getBounds().top < 0 && ball.body.velocity.y < 0)
      {
        ball.setVelocityY(-ball.body.velocity.y);
      }
      //Ball touches bottom bound
      else if (ball.getBounds().bottom > 500 && ball.body.velocity.y > 0)
      {
        
        this.scene.start('PlayGame');
      }


      // Floor's movement
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

  surfaceBounce(_ball, surface)
  {
    ball.setVelocityY(-ball.body.velocity.y);
    // if (_object != 0)
    // {
      // ball.setVelocityX(_object.body.velocity.x);
    // }

    if (surface == plate)
    {
      console.log('Hit Plate!');
    }
    else{
      console.log('Hit Block!');
    }
  }

}







// function preload()
// {
//   this.load.image('ball','images/ball.png');
//   this.load.image('platform','images/ground.png');
// }

// function create()
// {
//   this.ball = this.physics.add.sprite(100, 450, 'ball');



  

  
  
// }

// function update()
// {

// }