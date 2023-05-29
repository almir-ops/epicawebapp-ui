import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

   transform(array: any[], texto: string): any[] {

    if( texto === ''){
      return array;
    }
    texto = texto.toLowerCase();
    return array.filter( item => {
      return item.title.toLowerCase().includes(texto);
    });
  }
  /* transform(value: Array<any>, filtro: string): any {
    if (filtro) {
        filtro = filtro.toUpperCase();

        return value.filter(a =>
            a.nome.toUpperCase().indexOf(filtro) >= 0
        );
    } else {

        return value;
    }
} */
}
