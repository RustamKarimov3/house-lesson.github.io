import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import { Sky } from 'three/addons/objects/Sky.js'

console.log(Sky)

const textureLoader = new THREE.TextureLoader();

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



/**
 * House
 */


// floor
const floorAlpha = textureLoader.load('floor/alpha.jpg')
const floorColor = textureLoader.load('floor/coast_sand_rocks_02/coast_sand_rocks_02_diff_1k.jpg')
const floorArm = textureLoader.load('floor/coast_sand_rocks_02/coast_sand_rocks_02_arm_1k.jpg')
const floorDisplacement = textureLoader.load('floor/coast_sand_rocks_02/coast_sand_rocks_02_disp_1k.jpg')
const floorNormal = textureLoader.load('floor/coast_sand_rocks_02/coast_sand_rocks_02_nor_gl_1k.jpg')

floorColor.repeat.set(8, 8)
floorArm.repeat.set(8, 8)
floorDisplacement.repeat.set(8, 8)
floorNormal.repeat.set(8, 8)

floorColor.wrapS = THREE.RepeatWrapping
floorArm.wrapS = THREE.RepeatWrapping
floorDisplacement.wrapS = THREE.RepeatWrapping
floorNormal.wrapS = THREE.RepeatWrapping

floorColor.wrapT = THREE.RepeatWrapping
floorArm.wrapT = THREE.RepeatWrapping
floorDisplacement.wrapT = THREE.RepeatWrapping
floorNormal.wrapT = THREE.RepeatWrapping

floorColor.colorSpace = THREE.SRGBColorSpace;

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        // wireframe: true,
        transparent: true,
        alphaMap: floorAlpha,
        normalMap: floorNormal,
        map: floorColor,
        aoMap: floorArm,
        roughnessMap: floorArm,
        metalnessMap:floorArm,
        displacementMap: floorDisplacement,
        displacementScale: 0.3,
        displacementBias: -0.16
    })
)
floor.rotateX(Math.PI*-0.5)
floor.receiveShadow = true;

gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.1)
gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001)


// walls
const wallstexture = textureLoader.load('walls/rock_wall_15/rock_wall_15_diff_1k.jpg')
wallstexture.colorSpace = THREE.SRGBColorSpace;
const wallsArm = textureLoader.load('walls/rock_wall_15/rock_wall_15_arm_1k.jpg')
const wallsNormal = textureLoader.load('walls/rock_wall_15/rock_wall_15_nor_gl_1k.jpg')
wallstexture.repeat.set(4,4)
wallsArm.repeat.set(4,4)
wallsNormal.repeat.set(4,4)


wallstexture.wrapS = THREE.RepeatWrapping;
wallsArm.wrapS = THREE.RepeatWrapping;
wallsNormal.wrapS = THREE.RepeatWrapping;
wallstexture.wrapT = THREE.RepeatWrapping;
wallsArm.wrapT = THREE.RepeatWrapping;
wallsNormal.wrapT = THREE.RepeatWrapping;


const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4, 5),
    new THREE.MeshStandardMaterial({
        map: wallstexture, 
        normalMap: wallsNormal, 
        aoMap: wallsArm,
        roughnessMap: wallsArm, 
        // displacementMap: wallsDisplacement,
        metalnessMap: wallsArm
    })
)

walls.position.y = 2.5/2

// roof
const rooftexture = textureLoader.load('roof/thatch_roof_angled_1k/thatch_roof_angled_diff_1k.jpg')
wallstexture.colorSpace = THREE.SRGBColorSpace;
const roofArm = textureLoader.load('roof/thatch_roof_angled_1k/thatch_roof_angled_arm_1k.jpg')
const roofNormal = textureLoader.load('roof/thatch_roof_angled_1k/thatch_roof_angled_nor_gl_1k.jpg')
rooftexture.repeat.set(3,1)
roofNormal.repeat.set(3,1)
roofArm.repeat.set(3,1)


rooftexture.wrapS = THREE.RepeatWrapping;
roofNormal.wrapS = THREE.RepeatWrapping;
roofArm.wrapS = THREE.RepeatWrapping;
// rooftexture.wrapT = 4;
// roofNormal.wrapT = 4;
// roofArm.wrapT = 4;


const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: rooftexture,
        normalMap: roofNormal,
        aoMap: roofArm,
        roughnessMap: roofArm,
        metalnessMap: roofArm,
    })
)
roof.position.y = 1.5/2 + 2.5
roof.rotateY(Math.PI/4)


const doorTexture = textureLoader.load('door/color.jpg')
const aplhaDoorTexture = textureLoader.load('door/alpha.jpg')
const doorDisp = textureLoader.load('door/height.jpg')
const doorNormal = textureLoader.load('door/normal.jpg')
const doorao = textureLoader.load('door/ambientOcclusion.jpg')
const doorMetal = textureLoader.load('door/metalness.jpg')
const doorRou = textureLoader.load('door/roughness.jpg')
doorTexture.colorSpace = THREE.SRGBColorSpace

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorTexture,
        transparent: true,
        alphaMap: aplhaDoorTexture,
        displacementMap: doorDisp,
        displacementScale: 0.15,
        displacementBias: -0.01,
        normalMap: doorNormal,
        aoMap: doorao,
        metalnessMap: doorMetal,
        roughnessMap: doorRou,
    })
)
door.position.set(0, 1, 4/2+0.001)

// Bushes
const bushtexture = textureLoader.load('bush/forest_leaves_03_1k/forest_leaves_03_diff_1k.webp')
bushtexture.colorSpace = THREE.SRGBColorSpace;
const bushArm = textureLoader.load('bush/forest_leaves_03_1k/forest_leaves_03_arm_1k.webp')
const bushNormal = textureLoader.load('bush/forest_leaves_03_1k/forest_leaves_03_nor_gl_1k.webp')

bushtexture.repeat.set(2,1)
bushArm.repeat.set(2,1)
bushNormal.repeat.set(2,1)


bushtexture.wrapS = THREE.RepeatWrapping;
bushArm.wrapS = THREE.RepeatWrapping;
bushNormal.wrapS = THREE.RepeatWrapping;

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
    map: bushtexture,
    color: 0x00ff00,
    aoMap: bushArm,
    roughnessMap: bushArm,
    metalnessMap: bushArm,
    normalMap: bushNormal,
});

const bush1 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush1.scale.setScalar(0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = -0.75

const bush2 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush2.scale.setScalar(0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = -0.75

const bush3 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush3.scale.setScalar(0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = -0.75


const house = new THREE.Group();
// house.castShadow = true;
house.add(walls, roof, door, bush1, bush2, bush3)

scene.add(floor,house)


// Graves
const gravetexture = textureLoader.load('grave/slab_tiles_1k/slab_tiles_diff_1k.jpg')
gravetexture.colorSpace = THREE.SRGBColorSpace;
const graveNormal = textureLoader.load('grave/slab_tiles_1k/slab_tiles_nor_gl_1k.jpg')

gravetexture.repeat.set(1,2)
graveNormal.repeat.set(1,2)

gravetexture.wrapT = THREE.RepeatWrapping;
graveNormal.wrapT = THREE.RepeatWrapping;

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
    map: gravetexture,
    normalMap: graveNormal,
})

const gravesGroup = new THREE.Group()

for (let i = 0; i <30; i++) {
    const grave = new THREE.Mesh(
        graveGeometry,
        graveMaterial
    )
    
    const angle = Math.random() * Math.PI*2;
    const radius = 4 + 4 * Math.random();
    const positionX = Math.sin(angle) *radius;
    const positionZ = Math.cos(angle) *radius;

    grave.rotation.set((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4)
    grave.position.set(positionZ, 0.4*Math.random(), positionX)

    gravesGroup.add(grave);
}

// gravesGroup.position.y = 0.3

scene.add(gravesGroup)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.5)

house.add(doorLight)

// Ghosts
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)


const animateGhost = () => {

}

scene.add(ghost1, ghost2, ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

gravesGroup.children.forEach(i => {
    i.castShadow = true
})

// mapping shadow
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

// sKy
const sky = new Sky()

const uniforms = sky.material.uniforms;
uniforms[ 'turbidity' ].value = 10
uniforms[ 'rayleigh' ].value = 3
uniforms[ 'mieCoefficient' ].value = 0.1
uniforms[ 'mieDirectionalG' ].value = 0.95
uniforms['sunPosition'].value.set(0.3, -0.038, - 0.95)
sky.scale.setScalar(100)

scene.add(sky)


// fog
// scene.fog = new THREE.Fog(0x000000, 1, 13)
scene.fog = new THREE.FogExp2(0x03343f, 0.1)

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) *4
    ghost1.position.z = Math.sin(ghost1Angle) *4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle*2.34) * Math.sin(ghost1Angle*3.45)

    const ghost2Angle = -elapsedTime * 0.38;
    ghost2.position.x = Math.cos(ghost2Angle) *5
    ghost2.position.z = Math.sin(ghost2Angle) *5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle*2.34) * Math.sin(ghost2Angle*3.45)

    const ghost3Angle = elapsedTime * 0.23;
    ghost3.position.x = Math.cos(ghost3Angle) *6
    ghost3.position.z = Math.sin(ghost3Angle) *6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle*2.34) * Math.sin(ghost3Angle*3.45)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()