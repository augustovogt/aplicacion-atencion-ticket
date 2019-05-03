
const fs = require ('fs');

class Ticket {

    constructor(numero, escritorio){
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor(){
        console.log('TicketControl ...')
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        let data = require('../data/data');

        console.log("Data leida:",data);

        if ( data.hoy === this.hoy ){

            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;

             console.log('No hay cambios');
        } else {
            console.log('Se reinicia');
            this.reiniciaConteo();

        }
    }

    siguiente(){

        this.ultimo += 1;

        let ticket = new Ticket(this.ultimo, null);
        console.log('ticket:',ticket);
        this.tickets.push(ticket);
        this.grabarArchivo();

        return `Ticket ${ this.ultimo }`;
    }

    getUltimoTicket(){
        return `Ticket ${ this.ultimo }`;
    }

    getUltimos4(){
        return this.ultimos4;
    }

    atenderTicket( escritorio ){
        if( this.tickets.length === 0){
            return 'No hay tickets';
        }

        console.log('aten',this.tickets);
        let numeroTicket = this.tickets[0].numero;
        //Elimina primera posicion del arreglo
        this.tickets.shift();

        let atenderTicket = new Ticket(numeroTicket, escritorio);
        console.log('Ticket atendido por:',atenderTicket);

        //Agrega nuevo ticket atender al inicio del arreglo
        this.ultimos4.unshift( atenderTicket );

        //Elimina ultimo elemento pasado de 4
        if(this.ultimos4.length > 4 ){
            this.ultimos4.splice( -1, 1);
        }

        console.log('Ultimos 4:',this.ultimos4);
        this.grabarArchivo();
        console.log("Ticket devuelto:",atenderTicket)
        return atenderTicket;

    }

    reiniciaConteo(){
       this.ultimo = 0;
       this.tickets = [];
       this.ultimos4 = [];

       this.grabarArchivo();
       console.log('Se ha inicializado el sistema');
    }

    grabarArchivo(){
        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets : this.tickets,
            ultimos4 : this.ultimos4
        };

        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync('./server/data/data.json',jsonDataString);
    }

}

module.exports = {
    TicketControl
}