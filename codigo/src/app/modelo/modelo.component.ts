import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-modelo',
  imports: [],
  templateUrl: './modelo.component.html',
  styleUrl: './modelo.component.scss'
})
export class ModeloComponent {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);  // Verifica o ambiente
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.initThree();
      this.loadPLYModel();
      this.animate();
    } else {
      console.warn('Executando no servidor, renderização 3D desativada.');
    }
  }

  initThree() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(10, 50, 1000);  // Afaste a câmera
    this.camera.lookAt(0, 0, 0);  // Aponte para o centro


    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);  // Maior intensidade
    this.scene.add(ambientLight);

    // Luz pontual
    const pointLight = new THREE.PointLight(0xffffff, 2, 50);  // Maior intensidade e alcance
    pointLight.position.set(10, 10, 10);  // Ajuste a posição da luz
    this.scene.add(pointLight);

  }

  loadPLYModel() {
    const loader = new PLYLoader();
    loader.load('assets/estrutura-3d.ply',
      (geometry) => {
        console.log('Modelo carregado:', geometry);

        geometry.computeVertexNormals();  // Calculando as normais para iluminação adequada

        // Material básico para garantir visibilidade
        const material = new THREE.MeshNormalMaterial();

        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(0.5, 0.5, 0.5);  // Ajusta a escala
        mesh.position.set(-500, 400, 0);  // Posiciona no centro da cena
        mesh.rotation.set(270, 10, 30);
        this.scene.add(mesh);
      },
      (xhr) => {
        console.log(`Progresso do carregamento: ${(xhr.loaded / xhr.total) * 100}%`);
      },
      (error) => {
        console.error('Erro ao carregar o modelo:', error);
      }
    );
  }


  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}
