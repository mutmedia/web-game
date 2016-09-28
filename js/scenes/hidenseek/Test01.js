// Node modules
const _ = require('lodash');
const THREE = require('three');
const $ = require('jquery');

// Engine modules
const Input = require('my-engine/core/Input');
const Engine = require('my-engine/core/Engine');
const GameObject = require('my-engine/core/GameObject');

// Components
const MeshComponent = require('my-engine/components/Mesh');
const CameraComponent = require('my-engine/components/Camera');
const LightComponent = require('my-engine/components/Light');
const NetworkTransformComponent = require('my-engine/components/NetworkTransform');

// Custom Modules
const ServerPlayerView = require('./customGameObjects/ServerPlayerView');

// Engine modules
const RandomNameGenerator = require('../../random-names/RandomNames');

var globalCamera;

module.exports = function(Assets, Firebase) {
return {
  Mirror1: {
      transform: {
          position: new THREE.Vector3(0, 375, -500),
          rotation: new THREE.Euler(0, 0, 0),
          scale: new THREE.Vector3(1, 1, 1)
      },
      components: {
          PlaneMesh: {
              init: function(go) {
                  this.renderTarget = new THREE.WebGLRenderTarget(512, 512, {
                      format: THREE.RGBFormat
                  });
                  var TVMaterial = new THREE.MeshBasicMaterial({
                      map: this.renderTarget.texture
                  });
                  var TVGeometry = new THREE.PlaneGeometry(1000, 750, 1, 1);
                  var TVMesh = new THREE.Mesh(TVGeometry, TVMaterial);
                  go.add(TVMesh);
              },
              update: function(go, deltaTime) {
                  var camChild = go.getObjectByName("Camera");
                  Engine.renderer.render(Engine.hierarchy, camChild.components.Camera.ref, this.renderTarget);
              },
          },
      },
      children: {
          Camera: {
              transform: {
                  position: new THREE.Vector3(0, 375, 500),
                  rotation: new THREE.Euler(-Math.PI/2, 0, 0),
                  scale: new THREE.Vector3(1, 1, 1)
              },
              components: {
                  Camera: new CameraComponent(false),
              }
          }
      }
  },
  Mirror2: {
      transform: {
          position: new THREE.Vector3(0, 375, 500),
          rotation: new THREE.Euler(0, Math.PI, 0),
          scale: new THREE.Vector3(1, 1, 1)
      },
      components: {
          PlaneMesh: {
              init: function(go) {
                  this.renderTarget = new THREE.WebGLRenderTarget(512, 512, {
                      format: THREE.RGBFormat
                  });
                  var TVMaterial = new THREE.MeshBasicMaterial({
                      map: this.renderTarget.texture
                  });
                  var TVGeometry = new THREE.PlaneGeometry(1000, 750, 1, 1);
                  var TVMesh = new THREE.Mesh(TVGeometry, TVMaterial);
                  go.add(TVMesh);
              },
              update: function(go, deltaTime) {
                  var camChild = go.getObjectByName("Camera");
                  Engine.renderer.render(Engine.hierarchy, camChild.components.Camera.ref, this.renderTarget);
              },
          },
      },
      children: {
          Camera: {
              transform: {
                  position: new THREE.Vector3(0, 375, 500),
                  rotation: new THREE.Euler(-Math.PI/2, 0, 0),
                  scale: new THREE.Vector3(1, 1, 1)
              },
              components: {
                  Camera: new CameraComponent(false),
              }
          }
      }
  },
  Mirror3: {
      transform: {
          position: new THREE.Vector3(500, 375, 0),
          rotation: new THREE.Euler(0, -Math.PI/2, 0),
          scale: new THREE.Vector3(1, 1, 1)
      },
      components: {
          PlaneMesh: {
              init: function(go) {
                  this.renderTarget = new THREE.WebGLRenderTarget(512, 512, {
                      format: THREE.RGBFormat
                  });
                  var TVMaterial = new THREE.MeshBasicMaterial({
                      map: this.renderTarget.texture
                  });
                  var TVGeometry = new THREE.PlaneGeometry(1000, 750, 1, 1);
                  var TVMesh = new THREE.Mesh(TVGeometry, TVMaterial);
                  go.add(TVMesh);
              },
              update: function(go, deltaTime) {
                  var camChild = go.getObjectByName("Camera");
                  Engine.renderer.render(Engine.hierarchy, camChild.components.Camera.ref, this.renderTarget);
              },
          },
      },
      children: {
          Camera: {
              transform: {
                  position: new THREE.Vector3(0, 375, 500),
                  rotation: new THREE.Euler(-Math.PI/2, 0, 0),
                  scale: new THREE.Vector3(1, 1, 1)
              },
              components: {
                  Camera: new CameraComponent(false),
              }
          }
      }
  },
  Mirror4: {
      transform: {
          position: new THREE.Vector3(-500, 375, 0),
          rotation: new THREE.Euler(0, Math.PI/2, 0),
          scale: new THREE.Vector3(1, 1, 1)
      },
      components: {
          PlaneMesh: {
              init: function(go) {
                  this.renderTarget = new THREE.WebGLRenderTarget(512, 512, {
                      format: THREE.RGBFormat
                  });
                  var TVMaterial = new THREE.MeshBasicMaterial({
                      map: this.renderTarget.texture
                  });
                  var TVGeometry = new THREE.PlaneGeometry(1000, 750, 1, 1);
                  var TVMesh = new THREE.Mesh(TVGeometry, TVMaterial);
                  go.add(TVMesh);
              },
              update: function(go, deltaTime) {
                  var camChild = go.getObjectByName("Camera");
                  Engine.renderer.render(Engine.hierarchy, camChild.components.Camera.ref, this.renderTarget);
              },
          },
      },
      children: {
          Camera: {
              transform: {
                  position: new THREE.Vector3(0, 375, 500),
                  rotation: new THREE.Euler(-Math.PI/2, 0, 0),
                  scale: new THREE.Vector3(1, 1, 1)
              },
              components: {
                  Camera: new CameraComponent(false),
              }
          }
      }
  },
  Floor: {
    transform: {
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(Math.PI / 2, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    components: {
      Mesh: new MeshComponent({
          type: THREE.PlaneGeometry,
          params: [1000, 1000, 10, 10]
        },
        {
          type: THREE.MeshPhongMaterial,
          params: { map: Assets.floorTexture, side: THREE.DoubleSide }
        }
      )
    }
  },
  Player: {
    transform: {
      position: new THREE.Vector3(0, 32, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    },
    components: {
      NetworkTransform: new NetworkTransformComponent("players", Firebase, RandomNameGenerator.getUnique),
      MouseRotation: {
        update(go, deltaTime) {
          go.rotateY(-Input.Mouse.delta.x);
          //go.rotateAxis(go.Input.Mouse.delta.y * 0.1);
        }
      },
      PlayerController: {
        linSpeed: 80,
        angSpeed: 4,
        update: function(go, deltaTime) {
          var vert = (Input.isDown(Input.Keys.W) ? 1 : 0) + (Input.isDown(Input.Keys.S) ? -1 : 0);
          var linVelocity = go.transform.getForward().multiplyScalar(this.linSpeed * vert * deltaTime);
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
      ThirdPersonCamera: {
        transform: {
          position: new THREE.Vector3(0, 50, 300),
          rotation: new THREE.Euler(0, 0, 0),
          scale: new THREE.Vector3(1, 1, 1)
        },
        components: {
          Camera: new CameraComponent(true),
          Crosshair: {
            raycaster: new THREE.Raycaster(),
            scene: null,
            init: function(go) {
              globalCamera = go.components.Camera.ref;

              // TODO: add glogal reference to scene
              // Add a better (possibly readonly reference to the scene)
              this.scene = go.parent.parent;
            },
            update: function (go, deltaTime) {
              this.raycaster.setFromCamera( new THREE.Vector2(Input.Mouse.position.x, Input.Mouse.position.y), go.components.Camera.ref );
              var objsToTest = this.scene.getObjectByName("NetworkPlayers");
              var intersects = this.raycaster.intersectObjects( objsToTest.children, true );
              if(intersects.length > 0){
                //
                var hitObjects = _.map(intersects, (i) => objsToTest.getObjectById(i.object.id));
                var firstHit = _.find(
                  hitObjects,
                  (h) => h.layer === "Default");
                if(firstHit){
                  if(_.hasIn(firstHit, 'onHitScan')){
                    firstHit.onHitScan();
                  }
                }
              }
            }
          },


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
      SpotLight: new LightComponent("spot", 0xffffff, 5.0, 1000, Math.PI/4, 0.5, 2),
      AmbientLight: new LightComponent("ambient", 0xFF00FF, 0.25),
    }
  },
  NetworkPlayers: {
    components: {
      NetworkPlayers: {
        PLAYER_LIMIT: 10,
        BaseGameObject: ServerPlayerView,
        init: function(go) {
          var getNetPlayer = function(data) {
            var val = data.val();
            var position = val.transform.position;
            var scale = val.transform.scale;
            var rotation = val.transform.rotation;
            var name = val.name;
            // TODO: ServerNetworkTransform
            var baseGameObject = new this.BaseGameObject(
              name, {
                position: new THREE.Vector3(position.x, position.y, position.z),
                rotation: new THREE.Euler(rotation.x, rotation.y, rotation.z),
                scale: new THREE.Vector3(scale.x, scale.y, scale.z)
              },
              go,
              data.key);

            //baseGameObject.AddComponents(ServerNetworkTransform(data.key, position, rotation, scale));
          }.bind(this);

          var updateNetPlayer = function(data) {
            var val = data.val();
            var position = val.transform.position;
            var scale = val.transform.scale;
            var rotation = val.transform.rotation;
            var player = _.find(go.children, (c) => c.components.ServerNetworkTransform &&
                                                    c.components.ServerNetworkTransform.key === data.key);
            if(!player) {
              console.warn("No player found on transform update");
              return;
            }
            player.components.ServerNetworkTransform.emitTransformChange({
              position: new THREE.Vector3(position.x, position.y, position.z),
              rotation: new THREE.Euler(rotation.x, rotation.y, rotation.z),
              scale: new THREE.Vector3(scale.x, scale.y, scale.z)
            });
          };

          var removeNetPlayer = function(data) {
            var player = _.find(go.children, (c) => c.components.ServerNetworkTransform &&
                                                    c.components.ServerNetworkTransform.key === data.key);
            console.log("DESTROYED SOMEONE");
            go.remove(player);
          };

          Firebase.database.ref("players").limitToLast(10).on('child_added', getNetPlayer);
          Firebase.database.ref("players").limitToLast(10).on('child_changed', updateNetPlayer);
          Firebase.database.ref("players").on('child_removed', removeNetPlayer);
        }
      }
    }
  }
};
};
