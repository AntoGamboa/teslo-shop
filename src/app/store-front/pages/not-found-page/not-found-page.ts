import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  imports: [],
  styleUrl:'./not-found-page.css',
  templateUrl: './not-found-page.html',
})
export class NotFoundPage {
// En la clase PageNotFoundComponent, añade:
stars: Array<{x: number, y: number, size: number, opacity: number}> = [];

ngOnInit() {
  this.generateStars();
}

generateStars() {
  // Generar estrellas aleatorias para el fondo
  for (let i = 0; i < 100; i++) {
    this.stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.7 + 0.3
    });
  }
}

}
