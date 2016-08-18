// Node modules
const _ = require('lodash');
const THREE = require('three');
const firebase = require('firebase');

// Engine modules
const Input = require('../engine/Input');
const Engine = require('../engine/Engine');
const Assets = require('../engine/AssetLoader').Assets;
const GameObject = require('../engine/GameObject');

// Components
const MeshComponent = require('../components/Mesh');

FirebaseManager = {
  init: function(go) {
      var config = {
        apiKey: "AIzaSyAqHGwQN2J5BHniiZG0RtrFMHmQRDAKWCQ",
        authDomain: "multiplayer-2108d.firebaseapp.com",
        databaseURL: "https://multiplayer-2108d.firebaseio.com",
        storageBucket: "multiplayer-2108d.appspot.com",
      };
      firebase.initializeApp(config);
      this.database = firebase.database();
  }
};

FirebaseManager.init();

module.exports = {
  Floor: {
    transform: {
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(Math.PI / 2, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    components: {
      FloorMesh : {
        init: function(go) {
          //TODO: Initial Configuration in loader (see loader todos)
          Assets.floorTexture.wrapS = Assets.floorTexture.wrapT = THREE.RepeatWrapping;
        	Assets.floorTexture.repeat.set( 10, 10 );
        	var floorMaterial = new THREE.MeshPhongMaterial( { map: Assets.floorTexture, side: THREE.DoubleSide } );
        	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
        	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        	go.add(floor);
        }
      }
    }
  },
  Player: {
    transform: {
      position: new THREE.Vector3(0, 32, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    components: {
      NetworkPlayer: {
        init: function(go) {
          var infoKey = FirebaseManager.database.ref("players").push({transform: {
            position: {
              x: go.transform.position.x,
              y: go.transform.position.y,
              z: go.transform.position.z
            }
          }}).key;
          (function UpdateDB(go){
            FirebaseManager.database.ref("players/" + infoKey).update({transform: {
              position: {
                x: go.transform.position.x,
                y: go.transform.position.y,
                z: go.transform.position.z
              }
            }}).then(function() {
              setTimeout(UpdateDB(go), 50);
            });
          }.bind(this))(go);
        },
        update: function(go, deltaTime) {

        }
      },
      PlayerController: {
        linSpeed: 80,
        angSpeed: 4,
        update: function(go, deltaTime) {
          var vert = (Input.isDown(Input.Keys.UP) ? 1 : 0) + (Input.isDown(Input.Keys.DOWN) ? -1 : 0);
          var horz = (Input.isDown(Input.Keys.RIGHT) ? 1 : 0) + (Input.isDown(Input.Keys.LEFT) ? -1 : 0);
          if(Input.isPressed(Input.Keys.SPACE)) {
            go.components.Gravity.velocity.set(0, 5, 0);
          }
          var linVelocity = new THREE.Vector3(0, 0, -this.linSpeed * vert * deltaTime);
          var angDelta = this.angSpeed * horz * deltaTime;
          go.transform.rotation.y -= angDelta;
          linVelocity.applyAxisAngle(new THREE.Vector3(0, 1, 0), go.transform.rotation.y);
          go.transform.position.add(linVelocity);
        }
      },
      Gravity: {
        velocity: new THREE.Vector3(0, 0, 0),
        update: function(go, deltaTime) {
          go.transform.position.add(this.velocity);
          this.velocity.add(new THREE.Vector3(0, (-35) * deltaTime, 0));
          if(go.transform.position.y < 32 && this.velocity.y < 0)
            this.velocity.y = 0.0;
        }
      }
    },
    children: {
      Sword: {
        transform: {
          position: new THREE.Vector3(-20, 0, -30),
          rotation: new THREE.Euler(-Math.PI/2, 0, 0),
          scale: new THREE.Vector3(1, 1, 1)
        },
        components: {
          Mesh: new MeshComponent({
            type: THREE.CylinderGeometry,
            params: [1, 5, 60]
          },
          {
            type: THREE.MeshPhongMaterial,
            params: {
              color: 0xFFFFFF
            }
          }),
        },
      },
      Shield: {
        transform: {
          position: new THREE.Vector3(20, 0, -20),
          rotation: new THREE.Euler(Math.PI/2, 0, 0),
          scale: new THREE.Vector3(1, 1, 1)
        },
        components: {
          Mesh: new MeshComponent({
            type: THREE.CylinderGeometry,
            params: [10, 10, 5]
          },
          {
            type: THREE.MeshPhongMaterial,
            params: {
              color: 0xFFFFFF
            }
          }),
        },
      },
      Body: {
        components: {
          Mesh: new MeshComponent({
              type: THREE.SphereGeometry,
              params: [20, 32, 32]
            },
            {
              type: THREE.MeshPhongMaterial,
              params: {
                color: Math.random() * 0xFFFFFF
              }
            }
          ),
        },
      },
      Head: {
        transform: {
          position: new THREE.Vector3(0, 30, 0),
          rotation: new THREE.Euler(0, 0, 0),
          scale: new THREE.Vector3(1, 1, 1)
        },
        components: {
          Mesh: new MeshComponent({
              type: THREE.SphereGeometry,
              params: [10, 32, 32]
            },
            {
              type: THREE.MeshPhongMaterial,
              params: {
                color: Math.random() * 0xFFFFFF
              }
            }
          ),
        },
      },
      Camera: {
        components: {
          Camera: {
            init: function(go) {
              var specs = {
                VIEW_ANGLE: 45,
                NEAR: 0.1,
                FAR: 20000
              };
              var ASPECT = 4/3;
              var camera = new THREE.PerspectiveCamera( specs.VIEW_ANGLE, ASPECT, specs.NEAR, specs.FAR );
              camera.position.set(0, 100, 300);
              camera.lookAt(new THREE.Vector3(0, 0, 0));
              Engine.mainCamera = camera;
              go.add(camera);
            }
          }
        },
      },
    }
  },
  Skybox: {
    components: {
      Mesh: new MeshComponent({
          type: THREE.CubeGeometry,
          params: [10000, 10000, 10000]
        },
        {
          type: THREE.MeshBasicMaterial,
          params: { color: 0xAA419D, side: THREE.BackSide }
        }
      )
    }
  },
  Light: {
    transform: {
      position: new THREE.Vector3(0, 500, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    components: {
      SpotLight: {
        light: null,
        init: function(go) {
          this.light = new THREE.SpotLight(0xffffff, 5.0, 1000, Math.PI/4, 0.5, 2);
          go.add(this.light);
        }
      },
      AmbientLight: {
        light: null,
        init: function(go) {
          this.light = new THREE.AmbientLight(0xFF00FF, 0.25);
          go.add(this.light);
        }
      },
    }
  },
  NetworkPlayers: {
    components: {
      NetworkPlayers: {
        init: function(go) {
          var getNetPlayer = function(data) {
            var val = data.val();
            var pos = val.transform.position;
            new GameObject(
                      "playerNetwork_" + data.key,
                      {
                        position: new THREE.Vector3(pos.x, pos.y, pos.z),
                        rotation: new THREE.Euler(0, 0, 0),
                        scale: new THREE.Vector3(1, 1, 1)
                      }, {
                        NetTransform: {
                          hasNewTransform: false,
                          newTransform: {
                            position: new THREE.Vector3(0, 0, 0),
                          },
                          update: function(go, deltaTime) {
                            if(this.hasNewTransform) {
                              var pos = this.newTransform.position;
                              go.transform.position.set(pos.x, pos.y, pos.z);
                              this.hasNewTransform = false;
                            }
                          }
                        },
                        Mesh: new MeshComponent({
                            type: THREE.SphereGeometry,
                            params: [20, 32, 32]
                          },
                          {
                            type: THREE.MeshPhongMaterial,
                            params: {
                              color: Math.random() * 0xFFFFFF
                            }
                          }
                        ),
                      }, go);
          };

          var updateNetPlayer = function(data) {
            var val = data.val();
            var pos = val.transform.position;
            var player = _.find(go.children, (c) => c._nameid === "playerNetwork_" + data.key);
            player.components.NetTransform.hasNewTransform = true;
            player.components.NetTransform.newTransform = {
              position: new THREE.Vector3(pos.x, pos.y, pos.z),
            };
          };

          FirebaseManager.database.ref("players").limitToLast(10).on('child_added', getNetPlayer);
          FirebaseManager.database.ref("players").limitToLast(10).on('child_changed', updateNetPlayer);
        }
      }
    }
  }
};
