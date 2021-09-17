import * as React from 'react'
import * as Server from 'react-dom/server'
import { GameComponent } from "gokart.js/src/core/ui_components/GameComponent.jsx"
import { HUDView } from "gokart.js/src/core/ui_components/HUDView.jsx"
import { MobileStick } from "gokart.js/src/core/ui_components/MobileStick.jsx"
import { Physics3dScene } from "gokart.js/src/scene/physics3d"
import { CameraComponent,  ModelComponent, LightComponent  } from "gokart.js/src/core/components/render"
import { BodyComponent } from "gokart.js/src/core/components/physics"

class TestScene extends Physics3dScene {
    init_entities(){
        const g = this.world.createEntity()
        g.addComponent( BodyComponent, {
            mass: 0,
            bounds_type: BodyComponent.BOX_TYPE,
            body_type: BodyComponent.STATIC,
            bounds: new Vector3(1000,1,1000),
        })
        g.addComponent( ModelComponent, {geometry:"box",material:0x111111,scale: new Vector3(1000,1,1000)})
        g.addComponent( LocRotComponent, { rotation: new Vector3(0,0,0), location: new Vector3(0,-0.5,0) } )
        g.name = "ground_plane"

        const l1 = this.world.createEntity()
        l1.addComponent(LocRotComponent,{location: new Vector3(0,0,0)})
        l1.addComponent(LightComponent,{type:"ambient",intensity:0.6})

        const l2 = this.world.createEntity()
        l2.addComponent(LocRotComponent,{location: new Vector3(0,30,20),rotation: new Vector3(-Math.PI/4,0,0)})
        l2.addComponent(LightComponent,{type:"directional",cast_shadow:true,intensity:0.6})

        const c = this.world.createEntity()
        c.addComponent(CameraComponent,{lookAt: new Vector3(0,0,1),current: true, fov:60})
        c.addComponent(LocRotComponent,{location: new Vector3(10,50,-50)})
    }
}

class Game extends React.Component {
    constructor(props){
        super(props)
        this.state = { 
            playing: false,
            loading: false,
            scene: null,
            fullscreen: false,
        }
        this.handleFullscreen = this.handleFullscreen.bind(this)
    }

    handleFullscreen(event){
        const showFullscreen = event.target.checked
        if (!document.fullscreenElement && showFullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen && !showFullscreen) {
                document.exitFullscreen();
            }
        }
        this.setState({fullscreen:showFullscreen})
    }

    startLoading(selected_scene){
        this.setState({loading:true}) 
        let scene = null
        scene = new TestScene() 
        scene.load().then( () => {
            this.setState({playing:true,loading:false})
        })
        this.setState({scene:scene})
    } 

    getTouchControls(){
        let touch_controls = ""
        if('ontouchstart' in window){
            touch_controls = (
                <React.Fragment>
                    <MobileStick className="dpad" joystickId="dpad" pad_radius={20} width={150} height={150} />
                </React.Fragment>
            )
        }
        return touch_controls
    }

    render(){
        if(this.state.playing){
            return  (
                <GameComponent scene={this.state.scene} touch_controls={this.getTouchControls()}>
                	{hudState => (
                        <HUDView hudState={hudState}>
                	    {hudState => (
                            <div className="overlay">
                        		<h1>Web Game Starter - Test</h1>
                        		<p>This is an example from the <a href="https://github.com/nikolajbaer/web-game-starter">web game starter kit</a>. WASD to move.</p>
                                <p>{hudState?hudState.fps.toFixed(1):"-"} fps</p>
                                <p><input type="checkbox" checked={this.state.fullscreen} onChange={this.handleFullscreen} /> Fullscreen</p>

                        	</div>
                        )} 
                        </HUDView>
                   )}
                </GameComponent>
            )
        }else if(this.state.loading){
            return (
                <div className="menu">
                    <p>LOADING ASSETS..</p>
                </div>
            )
        }else{
            return (
                <div className="menu">
                    <h1>🏎️ GoKart.js Test</h1> 
                    <p><a href="https://github.com/nikolajbaer/gokart.js">github</a></p>
                    <button onClick={() => this.startLoading()}>Load Scene Test</button>
                </div>
            )
        }
    }
}
console.log(Server.renderToString(<Game />))
