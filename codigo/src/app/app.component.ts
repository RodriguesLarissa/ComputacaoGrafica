import { Component } from '@angular/core';
import { ModeloComponent } from './modelo/modelo.component';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [ModeloComponent, FormsModule, DecimalPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  nome: string = '';
  sexo: string = '';
  idade: number = 0;
  etnia: string = '';
  altura: number = 0;
  peso: number = 0;
  volumePulmao = 0;
  densidade = 0;
  adipometriaScanner = 0;
  readonly volumeSensor = 104857896;

  calcular() {
    this.volumePulmao = (((0.0472 * this.altura) + (0.000009 * this.peso)) - 5.92)*1000;
    this.densidade = this.peso/(this.volumeSensor-this.volumePulmao);
    this.adipometriaScanner = 437/(this.densidade-393);
  }
}
