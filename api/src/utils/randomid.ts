export const randomId = (MAX_LENGTH : number):string => {
    const letters = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let id = '';
    for(let i = 0; i< MAX_LENGTH; i++){
        id += letters[Math.floor(Math.random()*letters.length)];
    }

    return id;
}