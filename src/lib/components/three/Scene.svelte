<script>
  import { T, useTask } from '@threlte/core'
  import { interactivity } from '@threlte/extras'
  import { Spring } from 'svelte/motion'

  interactivity()
  const scale = new Spring(1)
  
</script>

<T.PerspectiveCamera
  makeDefault
  position={[0, 0, 10]}
  fov={45}
/>

<!-- Lighting -->
<T.AmbientLight intensity={0.6} />
<T.DirectionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
<T.PointLight position={[-5, 5, -5]} intensity={0.8} color="#88ccff" />



<T.Mesh
  position={[0, 0, 0]}
  scale={scale.current}
  onpointerenter={() => {
    scale.target = 1.5
  }}
  onpointerleave={() => {
    scale.target = 1
  }}
  castShadow
>
  <T.CapsuleGeometry args={[0.8, 2.5, 4, 16]} />
  <T.MeshPhysicalMaterial 
    color="#e0f7ff"
    
    metalness={0}
    roughness={0.1}
    transmission={1}
    thickness={.5}
    ior={1.5}
    clearcoat={1}
    clearcoatRoughness={0}
    transparent={true}
    side={2}
  />
</T.Mesh>

<!-- Background objects to show refraction -->
<T.Mesh position={[0, 0, -8]}>
  <T.PlaneGeometry args={[20, 20]} />
  <T.MeshStandardMaterial color="#4a90e2" />
</T.Mesh>

<!-- Additional floating spheres for more interesting refraction -->
<T.Mesh position={[3, 2, -3]}>
  <T.SphereGeometry args={[0.5, 16, 16]} />
  <T.MeshStandardMaterial color="#ff6b6b" />
</T.Mesh>

<T.Mesh position={[-3, -1, -2]}>
  <T.SphereGeometry args={[0.7, 16, 16]} />
  <T.MeshStandardMaterial color="#4ecdc4" />
</T.Mesh>
