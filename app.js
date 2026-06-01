var itemList = []


const addItem = () => {
    let form = document.getElementById("itemInput");
    let list = document.getElementById("shoppingList");
    
    console.log(form.value)
    itemList.push(form.value);
    
    let textList = ""  
    itemList.forEach(item => {
        textList += "<li>" + item + "</li>";
    });
    list.innerHTML = textList
}