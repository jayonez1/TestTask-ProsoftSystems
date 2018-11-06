var fakeBASE = [
    {
        id:1,
        name:"Иванов Иван Иванович",
        type:1,
        number:"1234567890123"
    },
    {
        id:2,
        name:"Александров Александр Александрович",
        type:2,
        number:"1234567890123"
    },
    {
        id:3,
        name:"Николаев Николай Николаевич",
        type:1,
        number:"1234567890123"
    },
    {
        id:4,
        name:"Антонов Антон Антонович",
        type:2,
        number:"1234567890123"
    },
]

// Запрос списка потребителей из fake-базы
const fakeAPI_RequestList = () => {
    // Сортировка по имени
    fakeBASE.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
            return 0;
    });
    return fakeBASE
}
